import { notFound } from "next/navigation";
import { Masthead } from "@/components/masthead";
import {
  getPortfolio,
  investors,
  thirteenF,
  type Holding,
  type Portfolio,
} from "@/lib/content";
import {
  formatCompactCurrency,
  formatDate,
  formatQuarter,
  formatRoughShare,
  formatWeight,
} from "@/lib/format";

/*
 * dynamicParams = false: een slug die niet in `investors` staat wordt een 404
 * en niet een lege pagina met een verzonnen titel erboven.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return investors.map((investor) => ({ slug: investor.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/topbeleggers/[slug]">) {
  const { slug } = await params;
  const investor = investors.find((i) => i.slug === slug);
  return { title: `${investor?.name ?? "Belegger"} — De Amerikabelegger` };
}

// `params` is in deze versie van Next een promise en moet gewacht worden; de
// synchrone vorm is verouderd.
export default async function Page({
  params,
}: PageProps<"/topbeleggers/[slug]">) {
  const { slug } = await params;
  const investor = investors.find((i) => i.slug === slug);

  if (!investor) notFound();

  const portfolio = await getPortfolio(slug);

  return (
    <>
      <Masthead title={investor.name} intro={investor.firm} />

      <div className="mx-auto max-w-content px-6 pb-20">
        <div className="max-w-reading">
          <p className="text-body-l">
            {investor.styleTags.join(", ")}. Horizon: {investor.horizon}.
          </p>
          <p className="mt-6 text-body-l">{investor.summary}</p>
          <p className="mt-10 text-body-s italic text-ink-soft">
            Waar de omschrijving hierboven vandaan komt, volgt nog: naam,
            platform en datum.
          </p>
        </div>

        {portfolio && <PortfolioSection portfolio={portfolio} />}
      </div>
    </>
  );
}

/** Zichtbaar zonder uitklappen. Daarna "Toon de overige". */
const TOP = 10;

type Ranked = Holding & { rank: number; weight: number };

/*
 * De regels staan in de doc-comment op `Portfolio` in lib/content.ts: gewichten
 * alleen over aandelen, opties en obligaties apart, opties nooit een gewicht.
 */
function PortfolioSection({ portfolio }: { portfolio: Portfolio }) {
  const byValue = (a: Holding, b: Holding) => b.value - a.value;
  const sum = (rows: Holding[]) => rows.reduce((total, r) => total + r.value, 0);

  const plain = portfolio.holdings.filter((h) => !h.putCall);
  const options = portfolio.holdings.filter((h) => h.putCall).sort(byValue);
  const bonds = plain.filter((h) => h.shareType === "PRN").sort(byValue);
  const stockTotal = sum(plain.filter((h) => h.shareType === "SH"));
  const stocks: Ranked[] = plain
    .filter((h) => h.shareType === "SH")
    .sort(byValue)
    .map((h, i) => ({ ...h, rank: i + 1, weight: (h.value / stockTotal) * 100 }));

  const [year, month, day] = portfolio.filed.split("-").map(Number);
  const periodMonth = Number(portfolio.period.split("-")[1]);
  const quarter = formatQuarter(
    Math.ceil(periodMonth / 3),
    Number(portfolio.period.slice(0, 4)),
  );
  const secUrl =
    "https://www.sec.gov/Archives/edgar/data/" +
    `${Number(portfolio.cik)}/${portfolio.accession.replaceAll("-", "")}/`;

  return (
    <section aria-labelledby="portefeuille" className="mt-20">
      <h2 id="portefeuille" className="font-display text-display-m">
        Portefeuille
      </h2>
      <div className="scotch-rule mt-4 max-w-reading" />

      {/* Een datum als `new Date(y, m, d)`: een ISO-string wordt UTC-middernacht en kan buiten Europa een dag verschuiven. */}
      <p className="mt-5 max-w-reading text-body-s text-ink-soft">
        13F over {quarter}, ingediend bij de SEC op{" "}
        {formatDate(new Date(year, month - 1, day))}.{" "}
        <a
          href={secUrl}
          className="underline underline-offset-4 hover:text-seal"
        >
          Bekijk de filing op sec.gov
        </a>
      </p>

      <p className="tabular mt-7 text-body-l">
        <span className="font-medium">
          {stocks.length}{" "}
          {stocks.length === 1 ? "aandelenpositie" : "aandelenposities"}
        </span>
        , samen {formatCompactCurrency(stockTotal)}.
      </p>

      <MixLine
        stockTotal={stockTotal}
        bondTotal={sum(bonds)}
        options={options}
      />

      <Strip stocks={stocks} />

      <RankedLedger rows={stocks.slice(0, TOP)} />
      {stocks.length > TOP && (
        <More label={`Toon de overige ${stocks.length - TOP} posities`}>
          <RankedLedger rows={stocks.slice(TOP)} headless />
        </More>
      )}

      {options.length + bonds.length > 0 && (
        <OptionsAndBonds rows={[...options, ...bonds]} hasOptions={options.length > 0} />
      )}

      <p className="mt-12 max-w-reading text-body-s italic text-ink-soft">
        {thirteenF}
      </p>
    </section>
  );
}

/*
 * Alleen bij een mix van instrumenten. Aandelen en obligaties als deel van hún
 * samen opgetelde waarde; opties als aantal en onderliggende waarde, nooit als
 * percentage.
 */
function MixLine({
  stockTotal,
  bondTotal,
  options,
}: {
  stockTotal: number;
  bondTotal: number;
  options: Holding[];
}) {
  if (!bondTotal && !options.length) return null;

  const both = stockTotal + bondTotal;
  const split = bondTotal
    ? `${formatRoughShare((stockTotal / both) * 100)} aandelen en ` +
      `${formatRoughShare((bondTotal / both) * 100)} obligaties`
    : "alleen aandelen";
  const optionPart = options.length
    ? `, plus ${options.length} ${options.length === 1 ? "optiepositie" : "optieposities"} ` +
      `op aandelen ter waarde van ${formatCompactCurrency(
        options.reduce((total, o) => total + o.value, 0),
      )}`
    : "";

  return (
    <p className="tabular mt-3 max-w-reading text-body-l">
      Deze belegger heeft {split} in de portefeuille{optionPart}.
    </p>
  );
}

/*
 * De hele aandelenportefeuille als één band: de tien grootste als segmenten,
 * de rest als één bleek blok. Beantwoordt "hoe geconcentreerd?" in één blik.
 *
 * Labels hangen af van de breedte van het segment, en die is op de server niet
 * bekend. Daarom twee drempels: ticker en gewicht vanaf 4,5% op desktop en 15%
 * op een telefoon, daaronder het rangnummer zolang dat past. Ver onder de
 * drempels blijft het segment leeg; de tabel eronder noemt het toch.
 *
 * Het gewicht staat er altijd, niet bij hover: een telefoon heeft geen hover,
 * en daar is de strook het eerste wat je van de portefeuille ziet.
 */
function Strip({ stocks }: { stocks: Ranked[] }) {
  const top = stocks.slice(0, TOP);
  const topWeight = top.reduce((total, s) => total + s.weight, 0);
  const rest = stocks.length - top.length;

  const label = (s: Ranked, ticker: number, rank: number) =>
    s.weight >= ticker ? (
      <>
        {s.ticker ?? s.rank}
        <span className="block font-normal">{formatWeight(s.weight)}</span>
      </>
    ) : s.weight >= rank ? (
      s.rank
    ) : null;

  return (
    <div className="mt-8">
      <div
        role="img"
        aria-label={
          rest > 0
            ? `De ${top.length} grootste posities zijn samen ${formatWeight(topWeight)} van de aandelen.`
            : `De verdeling over ${stocks.length} aandelen.`
        }
        className="tabular flex h-14 gap-0.5 md:h-16"
      >
        {top.map((s) => (
          <div
            key={s.cusip}
            title={`${s.issuer}, ${formatWeight(s.weight)}`}
            style={{ flexBasis: `${s.weight}%` }}
            className="flex min-w-0 items-end overflow-hidden pb-2 pl-2 text-micro font-medium whitespace-nowrap text-paper odd:bg-ink even:bg-ink-soft"
          >
            <span className="md:hidden">{label(s, 15, 7)}</span>
            <span className="max-md:hidden">{label(s, 4.5, 2)}</span>
          </div>
        ))}
        {rest > 0 && (
          <div
            style={{ flexBasis: `${100 - topWeight}%` }}
            className="flex min-w-0 items-end overflow-hidden bg-ink/15 pb-2 pl-2 text-micro whitespace-nowrap"
          >
            <span className={100 - topWeight >= 40 ? "" : "max-md:hidden"}>
              {100 - topWeight >= 12 && (
                <>
                  Overige {rest}
                  <span className="block">{formatWeight(100 - topWeight)}</span>
                </>
              )}
            </span>
          </div>
        )}
      </div>

      {/*
       * De maatstreep staat op de grens tussen top tien en de rest. Onder 35%
       * hangt het label rechts van de streep, anders links: zo loopt het nooit
       * van de band af.
       */}
      {rest > 0 && (
        <div aria-hidden className="tabular relative mt-1.5 h-5 text-micro text-ink-soft">
          <span
            style={{ left: `${topWeight}%` }}
            className={`absolute whitespace-nowrap ${
              topWeight < 35
                ? "border-l border-ink-soft pl-1"
                : "-translate-x-full border-r border-ink-soft pr-1"
            }`}
          >
            Top {top.length}: {formatWeight(topWeight)}
          </span>
        </div>
      )}
    </div>
  );
}

/*
 * Het grootboek: de datatabel van /styleguide, in twee kolommen naast elkaar
 * op desktop en onder elkaar op een telefoon. Twee echte tabellen, geen grid:
 * een schermlezer leest dan per cel de kolomkop mee.
 *
 * Op een telefoon lopen de twee tabellen door als één. De tweede kop is daar
 * sr-only in plaats van weg, zodat hij voor een schermlezer blijft bestaan.
 * `headless` is voor de uitgeklapte rest: daar staat de kop al boven, en de
 * rijen sluiten zonder witruimte aan op de tien erboven.
 *
 * De eerste rij krijgt geen streep direct onder de scotch rule, maar wel waar
 * een tabel op een andere doorloopt.
 */
function RankedLedger({ rows, headless = false }: { rows: Ranked[]; headless?: boolean }) {
  const half = Math.ceil(rows.length / 2);
  const columns = [rows.slice(0, half), rows.slice(half)].filter((c) => c.length);

  return (
    <div className={`grid gap-x-8 md:grid-cols-2 ${headless ? "" : "mt-6"}`}>
      {columns.map((column, i) => (
        <table
          key={column[0].cusip}
          className="tabular w-full table-fixed self-start bg-ledger text-body-s"
        >
          <colgroup>
            <col className="w-8 md:w-10" />
            <col />
            <col className="w-24 md:w-28" />
            <col className="w-18 md:w-20" />
          </colgroup>
          <thead className={headless ? "sr-only" : i > 0 ? "max-md:sr-only" : undefined}>
            <tr className="text-left">
              <th className="px-2 pt-3 pb-2.5 font-medium md:px-3">
                <span className="sr-only">Rang</span>
              </th>
              <th className="px-2 pt-3 pb-2.5 font-medium md:px-3">Aandeel</th>
              <th className="px-2 pt-3 pb-2.5 text-right font-medium md:px-3">Waarde</th>
              <th className="px-2 pt-3 pb-2.5 text-right font-medium md:px-3">Gewicht</th>
            </tr>
          </thead>
          <tbody>
            {!headless && (
              <tr className={i > 0 ? "max-md:hidden" : undefined}>
                <td colSpan={4} className="p-0">
                  <div className="scotch-rule" />
                </td>
              </tr>
            )}
            {column.map((row, j) => (
              <tr key={row.cusip} className={`border-ink/8 ${j > 0 || headless ? "border-t" : i > 0 ? "max-md:border-t" : ""}`}>
                <td className="px-2 py-2.5 text-ink-soft md:px-3">{row.rank}</td>
                <td className="px-2 py-2.5 md:px-3">
                  <Name holding={row} />
                </td>
                <td className="px-2 py-2.5 text-right whitespace-nowrap md:px-3">
                  {formatCompactCurrency(row.value)}
                </td>
                <td className="px-2 py-2.5 text-right whitespace-nowrap md:px-3">
                  {formatWeight(row.weight)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
}

function OptionsAndBonds({ rows, hasOptions }: { rows: Holding[]; hasOptions: boolean }) {
  const shown = 8;
  const kind = (h: Holding) =>
    h.putCall === "Put"
      ? "Put (daalt-positie)"
      : h.putCall === "Call"
        ? "Call"
        : "Converteerbare obligatie";

  const table = (slice: Holding[], head: boolean) => (
    <table className="tabular w-full table-fixed bg-ledger text-body-s">
      <colgroup>
        <col />
        <col className="w-30 md:w-52" />
        <col className="w-24 md:w-28" />
      </colgroup>
      <thead className={head ? undefined : "sr-only"}>
        <tr className="text-left">
          <th className="px-2 pt-3 pb-2.5 font-medium md:px-3">Onderliggend</th>
          <th className="px-2 pt-3 pb-2.5 font-medium md:px-3">Soort</th>
          <th className="px-2 pt-3 pb-2.5 text-right font-medium md:px-3">Waarde</th>
        </tr>
      </thead>
      <tbody>
        {head && (
          <tr>
            <td colSpan={3} className="p-0">
              <div className="scotch-rule" />
            </td>
          </tr>
        )}
        {slice.map((row, j) => (
          <tr
            key={`${row.cusip}-${row.putCall}`}
            className={`border-ink/8 ${j > 0 || !head ? "border-t" : ""}`}
          >
            <td className="px-2 py-2.5 md:px-3">
              <Name holding={row} />
            </td>
            <td className="px-2 py-2.5 md:px-3">{kind(row)}</td>
            <td className="px-2 py-2.5 text-right whitespace-nowrap md:px-3">
              {formatCompactCurrency(row.value)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <h3 className="mt-16 font-display text-display-s">Opties en obligaties</h3>
      <div className="mt-6 max-w-reading">
        {table(rows.slice(0, shown), true)}
        {rows.length > shown && (
          <More label={`Toon de overige ${rows.length - shown} regels`}>
            {table(rows.slice(shown), false)}
          </More>
        )}
      </div>
      {hasOptions && (
        <p className="mt-3 max-w-reading text-micro text-ink-soft">
          Bij een optie staat de waarde van het onderliggende aandeel. Dat is
          niet wat er op het spel staat, en daarom krijgt een optie geen
          gewicht.
        </p>
      )}
    </>
  );
}

/*
 * Naam zoals ingediend, met de ticker erachter — op een telefoon eronder.
 * Geen ticker bekend: alleen de naam, nooit een geraden ticker.
 */
function Name({ holding }: { holding: Holding }) {
  return (
    <>
      <span className="[overflow-wrap:anywhere]">{holding.issuer}</span>
      {holding.ticker && (
        <span className="block font-medium whitespace-nowrap text-ink-soft md:ml-2 md:inline">
          {holding.ticker}
          {holding.exchange && ` · ${holding.exchange}`}
        </span>
      )}
    </>
  );
}

/*
 * Een <details>, zodat de rest zonder client-JS uitklapt. Open schuift de knop
 * onder de lijst (`order-2`), zodat hij staat waar je na het lezen bent.
 */
function More({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="group open:flex open:flex-col">
      <summary className="mt-4 cursor-pointer list-none self-start text-body-s underline underline-offset-4 group-open:order-2 hover:text-seal [&::-webkit-details-marker]:hidden">
        {label}{" "}
        <span aria-hidden>
          <span className="group-open:hidden">&#8595;</span>
          <span className="hidden group-open:inline">&#8593;</span>
        </span>
      </summary>
      {children}
    </details>
  );
}
