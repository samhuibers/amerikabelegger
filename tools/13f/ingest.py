"""
Pulls each topbelegger's latest 13F-HR from SEC EDGAR into data/13f.json.

Run by hand once a quarter, the day after the 13F deadline — 45 days after
quarter end, so around 15 Feb, 16 May, 15 Aug and 15 Nov — and again whenever
you like to catch late filers and amendments. Review the diff, commit the JSON.

    python3 -m venv tools/13f/.venv
    tools/13f/.venv/bin/pip install edgartools==5.58.0
    EDGAR_IDENTITY="Your Name you@example.com" tools/13f/.venv/bin/python tools/13f/ingest.py

SEC refuses requests without a User-Agent naming a person; edgartools reads it
from EDGAR_IDENTITY so no address ends up in the repo.

The roster is `investors` in lib/content.ts, read through Node — this script
keeps no list of its own. The output holds exactly the roster's slugs: add an
investor there with a CIK and the next run fetches them; remove one and their
entry is dropped. Companies are never an input; they come out of the filings.

edgartools is not a project dependency: it replaces fetching EDGAR indexes,
parsing information-table XML and mapping CUSIPs to tickers by hand, and it
runs here, never in the Vercel build. Where its ticker table has gaps, US rows
are filled from SEC's current ticker list and foreign shares from OpenFIGI
(Bloomberg's free security lookup, no key needed) — see fill_tickers().
"""

import json
import os
import re
import subprocess
import sys
import time
import urllib.request
import warnings
from datetime import date, timedelta
from functools import cache
from pathlib import Path

from edgar import Company
from edgar.thirteenf.units import Ambiguous13FValueUnitWarning

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data" / "13f.json"

# Filers round the cover-page total; a gap bigger than this means the holdings
# were read wrong, not rounded.
TOTAL_TOLERANCE = 0.001

SEC_TICKERS = "https://www.sec.gov/files/company_tickers.json"
OPENFIGI = "https://api.openfigi.com/v3/mapping"

# Legal-form words that differ between a 13F and SEC's ticker list.
NAME_SUFFIXES = {
    "INC", "CORP", "CORPORATION", "CO", "LTD", "LIMITED", "PLC", "LP", "L",
    "P", "LLC", "AG", "SA", "NV", "SE", "DE", "DEL", "NEW", "THE", "COM",
    "CL", "A", "B", "C",
}

# A CINS code's first letter is the issuer's country; these are the exchanges
# its home listing is on, in order of preference. Countries, not companies.
HOME_EXCHANGES = {
    "B": ["BB"], "D": ["GY", "GR"], "E": ["SM", "SQ"], "F": ["FP"],
    "G": ["LN", "ID"], "H": ["SE", "SW"], "K": ["DC"], "L": ["FP", "NA", "LX"],
    "N": ["NA"], "T": ["IM"], "W": ["SS"], "X": ["FH", "AV", "NO"],
    "Y": ["IJ", "PM", "HK", "SP"],
}

# OpenFIGI exchange codes as a Dutch reader knows them. The order is the
# fallback for a company listed outside its own country (Campari: Dutch, Milan);
# German secondary listings last, because nearly everything trades there too.
EXCHANGE_NAMES = {
    "NA": "Amsterdam", "FP": "Parijs", "BB": "Brussel", "IM": "Milaan",
    "SM": "Madrid", "SQ": "Madrid", "SE": "Zürich", "SW": "Zürich",
    "DC": "Kopenhagen", "SS": "Stockholm", "FH": "Helsinki", "AV": "Wenen",
    "NO": "Oslo", "LX": "Luxemburg", "ID": "Dublin", "IJ": "Jakarta",
    "PM": "Manilla", "HK": "Hongkong", "SP": "Singapore", "LN": "Londen",
    "GY": "Frankfurt", "GR": "Frankfurt",
}

ROSTER_JS = (
    'import("./lib/content.ts").then(m => console.log(JSON.stringify('
    "m.investors.map(({ slug, name, cik }) => ({ slug, name, cik })))))"
)


def read_roster():
    result = subprocess.run(
        ["node", "--no-warnings", "-e", ROSTER_JS],
        cwd=ROOT, capture_output=True, text=True, check=True,
    )
    return json.loads(result.stdout)


def expected_period(today):
    """The latest quarter end whose filing deadline has passed."""
    ends = [
        date(year, month, day)
        for year in (today.year - 1, today.year)
        for month, day in ((3, 31), (6, 30), (9, 30), (12, 31))
    ]
    return max(end for end in ends if end + timedelta(days=45) < today).isoformat()


def choose_filing(cik):
    """
    The report for the latest period: a RESTATEMENT amendment replaces the
    original; a NEW HOLDINGS amendment would have to be merged with it, which
    v1 doesn't do — it is reported instead.
    """
    filings = Company(cik).get_filings(form="13F-HR", trigger_full_load=False)
    if len(filings) == 0:
        raise ValueError("no 13F-HR on file (only 13F-NT, or the wrong CIK?)")

    period = max(f.report_date for f in filings)
    in_period = sorted(
        (f for f in filings if f.report_date == period),
        key=lambda f: (f.filing_date, f.accession_no),
    )

    chosen, notes = None, []
    for filing in in_period:
        report = filing.obj()
        if filing.form == "13F-HR" or report.amendment_type == "RESTATEMENT":
            chosen = report
        elif report.amendment_type == "NEW HOLDINGS":
            notes.append(f"NEW HOLDINGS amendment {filing.accession_no} not merged")
    if chosen is None:
        raise ValueError(f"no original or restated 13F-HR for {period}")
    return chosen, notes


def warn(message):
    print(f"{'':<10} ! {message}", file=sys.stderr)


def normalize(name):
    words = re.sub(r"[^A-Z0-9 ]", " ", name.upper().replace("&", " AND ")).split()
    while words and words[-1] in NAME_SUFFIXES:
        words.pop()
    return " ".join(words)


@cache
def sec_tickers():
    """
    SEC's own list of current tickers, by normalized company name. A company's
    first ticker in the list is its common stock (PEB before its preferreds).
    """
    try:
        request = urllib.request.Request(
            SEC_TICKERS, headers={"User-Agent": os.environ["EDGAR_IDENTITY"]}
        )
        rows = json.load(urllib.request.urlopen(request, timeout=30)).values()
    except Exception as error:
        warn(f"SEC ticker list unavailable, US gaps stay empty: {error}")
        return {}, set()
    by_name = {}
    for row in rows:
        by_name.setdefault(normalize(row["title"]), row["ticker"])
    return by_name, {row["ticker"] for row in rows}


def home_listings(cusips):
    """(ticker, exchange) per CINS code, from OpenFIGI: 10 per request, 25 a minute."""
    found = {}
    for start in range(0, len(cusips), 10):
        batch = cusips[start:start + 10]
        jobs = [{"idType": "ID_CINS", "idValue": cusip} for cusip in batch]
        request = urllib.request.Request(
            OPENFIGI, data=json.dumps(jobs).encode(),
            headers={"Content-Type": "application/json"},
        )
        try:
            results = json.load(urllib.request.urlopen(request, timeout=30))
        except Exception as error:
            warn(f"OpenFIGI unavailable, foreign tickers stay empty: {error}")
            return found
        for cusip, result in zip(batch, results):
            listed = {
                listing["exchCode"]: listing["ticker"]
                for listing in result.get("data", [])
                if listing["marketSector"] == "Equity"
            }
            for code in HOME_EXCHANGES.get(cusip[0], []) + list(EXCHANGE_NAMES):
                if code in listed:
                    found[cusip] = (listed[code], EXCHANGE_NAMES[code])
                    break
        time.sleep(2.5)
    return found


def fill_tickers(holdings):
    """
    edgartools maps CUSIPs to tickers from a bundled table and leaves gaps:
    convertible bonds (a bond has no ticker; the issuer's stock is what a reader
    looks up), foreign shares, and renamed companies. A gap is only filled from
    SEC's current list or the home exchange, never guessed; what stays empty
    shows as a name.
    """
    by_name, current = sec_tickers()
    for holding in holdings:
        ticker = holding["ticker"]
        # Share classes come as BRKB; SEC lists BRK-B, brokers show BRK.B.
        if ticker and ticker not in current and f"{ticker[:-1]}-{ticker[-1]}" in current:
            holding["ticker"] = f"{ticker[:-1]}.{ticker[-1]}"
        elif not ticker and not holding["cusip"][0].isalpha():
            holding["ticker"] = by_name.get(normalize(holding["issuer"]))

    foreign = [h for h in holdings if not h["ticker"] and h["cusip"][0].isalpha()]
    listings = home_listings(sorted({h["cusip"] for h in foreign}))
    for holding in foreign:
        holding["ticker"], holding["exchange"] = listings.get(holding["cusip"], (None, None))


def to_portfolio(cik, report):
    with warnings.catch_warnings():
        # An ambiguous thousands-vs-dollars guess is a failure, not a warning.
        warnings.simplefilter("error", Ambiguous13FValueUnitWarning)
        table = report.holdings
        cover_total = int(report.total_value or 0)

    holdings = []
    for row in (table.itertuples() if table is not None else []):
        ticker = row.Ticker if isinstance(row.Ticker, str) and row.Ticker else None
        put_call = row.PutCall if row.PutCall in ("Put", "Call") else None
        holdings.append({
            "cusip": row.Cusip.upper(),
            "issuer": row.Issuer,
            "class": row.Class,
            "ticker": ticker,
            "exchange": None,
            "shares": int(row.SharesPrnAmount),
            "shareType": "PRN" if row.Type == "Principal" else "SH",
            "value": int(row.Value),
            "putCall": put_call,
        })
    holdings.sort(key=lambda h: (-h["value"], h["cusip"], h["putCall"] or ""))
    fill_tickers(holdings)

    total = sum(h["value"] for h in holdings)
    if cover_total and abs(total - cover_total) > TOTAL_TOLERANCE * cover_total:
        raise ValueError(f"holdings sum to {total:,}, cover page says {cover_total:,}")

    return {
        "cik": cik,
        "filer": report.management_company_name,
        "accession": report.accession_number,
        "form": report.form,
        "period": report.report_period,
        "filed": report.filing_date,
        "totalValue": total,
        "holdings": holdings,
    }


def main():
    roster = read_roster()
    previous = json.loads(OUT.read_text()) if OUT.exists() else {}
    expected = expected_period(date.today())
    output, failed = {}, False

    for investor in roster:
        slug, cik = investor["slug"], investor["cik"]
        old = previous.get(slug)
        try:
            report, notes = choose_filing(cik)
            if old and old["accession"] == report.accession_number:
                output[slug], status = old, "unchanged"
            else:
                output[slug], status = to_portfolio(cik, report), "new"
            p = output[slug]
            if p["period"] < expected:
                status = f"STALE (expected {expected})"
            print(
                f"{status:<10} {slug:<22} {p['filer'][:38]:<38} {p['period']} "
                f"filed {p['filed']}  {len(p['holdings']):>4} rows  "
                f"$ {p['totalValue'] / 1e6:>10,.0f}M"
            )
            for note in notes:
                print(f"{'':<10} {slug:<22} ! {note}")
        except Exception as error:
            failed = True
            if old:
                output[slug] = old
            print(f"{'FAILED':<10} {slug:<22} {cik}  {type(error).__name__}: {error}")

    # A failed investor keeps their old entry, so only roster removals land here.
    for slug in sorted(previous.keys() - output.keys()):
        print(f"{'dropped':<10} {slug:<22} no longer in lib/content.ts")

    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
