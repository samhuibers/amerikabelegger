# Handover: 13F ingest

State on 24 September 2026. The work is on branch `13f-ingest` (commit `dcc8eb0`), pushed to GitHub and **not yet merged into `main`**.

## What exists now

Each of the 30 topbeleggers now has their latest 13F filing (Q2 2026) stored in the repo, and pages can read it through `lib/content.ts`. The profile pages don't show the holdings yet; that's the next job.

- **[tools/13f/ingest.py](../tools/13f/ingest.py):** pulls each investor's latest 13F-HR from SEC EDGAR into `data/13f.json`. It runs by hand, never in the Vercel build.
- **[data/13f.json](../data/13f.json):** the output, committed. It holds 1,489 holdings across 30 investors. Git history is the archive of past quarters.
- **[lib/content.ts](../lib/content.ts):**
  - each `Investor` gains a `cik` (the SEC number of whoever files the 13F)
  - new types `Portfolio` and `Holding`
  - `getPortfolio(slug)` and `getLatestQuarter()`
  - a `thirteenF` const with the one-sentence explanation
  - the hand-set `filings` quarter is gone
- **`/topbeleggers`** reads its quarter ("Q2 2026") from the data.

## Running the quarterly update

Run it the day after each 13F deadline: around **15 Feb, 16 May, 15 Aug and 15 Nov**. The next one is **~15 November 2026**, for Q3. Re-running at any time is safe: an unchanged filing leaves the file byte-identical, so you can also run it to catch late filers and amendments.

The first time on a machine, create the Python environment (`tools/13f/.venv` is gitignored):

```
python3 -m venv tools/13f/.venv
tools/13f/.venv/bin/pip install edgartools==5.58.0
```

Each quarter:

```
EDGAR_IDENTITY="Your Name you@example.com" tools/13f/.venv/bin/python tools/13f/ingest.py
```

SEC requires every request to name a person, so the email is set at runtime and never committed. The script prints one line per investor:
- **status:** `new`, `unchanged`, `STALE` or `FAILED`
- **filer name, period, filing date, number of rows and total value**

A failure keeps that investor's previous data and makes the script exit with an error. Review the `git diff` on `data/13f.json` and commit it.

## Decisions already made (don't reopen)

- **The roster lives only in `investors` in `lib/content.ts`.** The script reads it through Node and keeps no list of its own. To add an investor, add the entry with a CIK; to remove one, delete the entry, and their data is dropped on the next run. Companies are never an input.
- **The filer isn't always the firm on the page.** The site keeps the familiar name:
  - Einhorn → DME Capital Management
  - Ackman → Pershing Square Inc.
  - Cooperman → his own filer (the site keeps "Omega Advisors")
  - Nygren → Harris Associates
  - Smith → Fundsmith LLP (Fundsmith Investment Services Ltd. is ignored)
- **Firm-wide filings are fine.** Nygren, Marks and Rogers represent their firm.
- **No caveats about what a 13F leaves out.** The site's name already says it's about American shares. One sentence explains what a 13F is (`thirteenF`, still a draft Sam may reword).
- **How the profile page shows the holdings** is recorded in the doc comment on `Portfolio`:
  - heading "Portefeuille" with a source line
  - weights over shares only
  - options and bonds in their own section
  - options never get a percentage
  - a mix line at the top only when the investor holds options or bonds
- **Tickers:**
  - edgartools' ticker first.
  - For gaps: SEC's live ticker list for US rows. Convertible bonds take the issuer's stock ticker.
  - OpenFIGI's home exchange for foreign shares (`HEIO` · Amsterdam).
  - Nothing is guessed. Two rows stay empty on purpose: Sunbelt Rentals (malformed CUSIP in the filing) and Redfin (acquired in 2025).

## Next up

1. **Merge `13f-ingest` into `main`.** Earlier work went straight to `main`, so a fast-forward is enough.
2. **Profile-page design pass** (`app/topbeleggers/[slug]/page.tsx`). Build to the rules in the `Portfolio` doc comment. Sam judges the result by looking at it, not by reading a description of it. This needs:
   - a compact money formatter in `lib/format.ts` ("$ 1,9 mld", "$ 254 mln")
   - the sec.gov link, built from `cik` and `accession`: `https://www.sec.gov/Archives/edgar/data/<cik without leading zeros>/<accession without dashes>/`
3. **Readable company names.** SEC's names are raw ("COCA COLA CO", "STATE STR SPDR S&P 500 ETF"). The proper fix is the company table that the Giants, Growers and Moonshots categories will need anyway.
4. **The TE CONTROLEREN note in `lib/content.ts`** still stands. Style, horizon and summaries need a source before publication. Also check whether Mandel (Lone Pine) still counts as active.

## Known limits and gotchas

- **This project uses npm, not pnpm.** `pnpm dev` starts an install that restructures `node_modules` and leaves `pnpm-lock.yaml` and `pnpm-workspace.yaml` behind. If it happens again, delete those two files and run `npm ci`.
- **NEW HOLDINGS amendments aren't merged.** Such an amendment adds positions that were previously confidential. The script reports it and skips it, which is rare enough for now.
- **The holdings JSON sits in an unused client chunk.** `components/site-header.tsx` is a client component that imports `lib/content.ts`, so the build emits the JSON as a lazy chunk. No page loads it, but the file is deployed. It's public SEC data, so it's harmless.
- **Lint:** the only warning, an unused `Team` in `app/over-ons/page.tsx`, came before this work.
