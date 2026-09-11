import { Cartouche } from "@/components/cartouche";
import { Guilloche } from "@/components/guilloche";
import { Masthead } from "@/components/masthead";
import { Seal } from "@/components/seal";
import { Ticker } from "@/components/ticker";
import { disclaimer } from "@/lib/content";
import { formatCurrency, formatDate, formatPercent } from "@/lib/format";

export const metadata = { title: "Stijlgids — De Amerikabelegger" };

/* Measured with the WCAG relative-luminance formula. Keep in sync with docs/STYLE_GUIDE.md. */
const swatches = [
  { token: "--color-ink", className: "bg-ink", on: "paper", ratio: "14,65" },
  { token: "--color-ink-soft", className: "bg-ink-soft", on: "paper", ratio: "10,54" },
  { token: "--color-paper", className: "bg-paper", on: "ink", ratio: "14,65" },
  { token: "--color-ledger", className: "bg-ledger", on: "ink", ratio: "14,31" },
  { token: "--color-brass", className: "bg-brass", on: "ink", ratio: "5,54" },
  { token: "--color-seal", className: "bg-seal", on: "paper", ratio: "6,17" },
  { token: "--color-giants", className: "bg-giants", on: "paper", ratio: "7,71" },
  { token: "--color-growers", className: "bg-growers", on: "paper", ratio: "5,22" },
  { token: "--color-moonshots", className: "bg-moonshots", on: "paper", ratio: "5,04" },
  { token: "--color-up", className: "bg-up", on: "ledger", ratio: "5,36" },
  { token: "--color-down", className: "bg-down", on: "ledger", ratio: "4,88" },
];

const typeScale = [
  { token: "display-xl", className: "font-display text-display-xl" },
  { token: "display-l", className: "font-display text-display-l" },
  { token: "display-m", className: "font-display text-display-m" },
  { token: "display-s", className: "font-display text-display-s" },
  { token: "body-l", className: "text-body-l" },
  { token: "body", className: "text-body" },
  { token: "body-s", className: "text-body-s" },
  { token: "micro", className: "text-micro" },
];

const spacing = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32];

const holdings = [
  { symbol: "AAPL", price: 231.4, change: 1.24 },
  { symbol: "NVDA", price: 184.92, change: -2.13 },
  { symbol: "BRK.B", price: 492.18, change: 0.08 },
];

export default function StyleguidePage() {
  return (
    <>
      <Masthead
        title="Stijlgids"
        intro="Het volledige specimen: kleur, type, ruimte, ornament en de bouwstenen."
      />

      <div className="mx-auto max-w-content space-y-24 px-6 pb-24">
        <Section title="Kleur">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {swatches.map((s) => (
              <li key={s.token} className="border border-ink/15">
                <div className={`h-20 ${s.className}`} />
                <div className="p-4">
                  <p className="text-body-s font-medium">{s.token}</p>
                  <p className="tabular text-micro text-ink-soft">
                    {s.ratio}:1 op {s.on}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-reading text-body-s text-ink-soft">
            Brass haalt 2,64:1 op paper en is daarom structureel: hairlines,
            guilloché, randen en focusringen. Nooit tekst op paper.
          </p>
        </Section>

        <Section title="Typografie">
          <ul className="space-y-6">
            {typeScale.map((t) => (
              <li key={t.token}>
                <p className="text-micro text-ink-soft">{t.token}</p>
                <p className={t.className}>Never bet against America</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Ruimte">
          <ul className="space-y-2">
            {spacing.map((step) => (
              <li key={step} className="flex items-center gap-4">
                <span className="tabular w-16 text-micro text-ink-soft">
                  {step * 4}px
                </span>
                <span className="h-3 bg-ink" style={{ width: step * 4 }} />
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Ornament">
          <div className="space-y-8">
            <Ornament label="Guilloché — band">
              <div className="bg-ink text-brass">
                <Guilloche height={28} amplitude={7} lines={6} />
              </div>
            </Ornament>

            <Ornament label="Scotch rule — alleen onder een masthead">
              <div className="scotch-rule" />
            </Ornament>

            <Ornament label="Cartouche — op paper en op ink">
              <div className="flex flex-wrap gap-3">
                <Cartouche category="giants" label="Giants" />
                <Cartouche category="growers" label="Growers" />
                <Cartouche category="moonshots" label="Moonshots" />
              </div>
              <div className="mt-4 flex flex-wrap gap-3 bg-ink p-4">
                <Cartouche category="giants" label="Giants" surface="ink" />
                <Cartouche category="growers" label="Growers" surface="ink" />
                <Cartouche category="moonshots" label="Moonshots" surface="ink" />
              </div>
            </Ornament>

            <Ornament label="Zegel — drie of vier keer op de hele site">
              <Seal />
            </Ornament>
          </div>
        </Section>

        <Section title="Ticker">
          <Ticker />
          <p className="mt-4 max-w-reading text-body-s text-ink-soft">
            De enige beweging op de site. Richting zit in het teken en het
            driehoekje, niet in de kleur.
          </p>
        </Section>

        <Section title="Artikelkaart">
          <article className="max-w-reading border border-ink/15 p-6">
            <Cartouche category="giants" label="Giants" />
            <h3 className="mt-4 font-display text-display-s">
              Titel van het artikel staat hier
            </h3>
            <p className="mt-3 text-body-l text-ink-soft">
              De deck staat hier: één of twee zinnen die vertellen waarom dit
              stuk bestaat.
            </p>
            <SourceAttribution />
          </article>
        </Section>

        <Section title="Bronvermelding">
          <div className="max-w-reading border-l-2 border-brass pl-4">
            <SourceAttribution />
          </div>
          <p className="mt-4 max-w-reading text-body-s text-ink-soft">
            Elke geleende uitspraak laat zien wie het zei, op welk platform, en
            wanneer. Dit blok is geen kleine lettertjes.
          </p>
        </Section>

        <Section title="Redactieoordeel">
          <div className="flex max-w-reading flex-col gap-6 bg-ledger p-6 sm:flex-row">
            <Seal />
            <div>
              <h3 className="font-display text-display-s">Ons oordeel</h3>
              <p className="mt-2 text-body">
                De mening van de redactie, zichtbaar losgemaakt van alles wat
                geciteerd is. Een mening, geen onderzoek.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Datatabel">
          <table className="tabular w-full max-w-reading bg-ledger text-body-s">
            <thead>
              <tr className="text-left">
                <th className="p-3 font-medium">Symbool</th>
                <th className="p-3 text-right font-medium">Koers</th>
                <th className="p-3 text-right font-medium">Verschil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} className="p-0">
                  <div className="scotch-rule" />
                </td>
              </tr>
              {holdings.map((row) => (
                <tr key={row.symbol}>
                  <td className="p-3">{row.symbol}</td>
                  <td className="p-3 text-right">
                    {formatCurrency(row.price)}
                  </td>
                  <td
                    className={`p-3 text-right ${
                      row.change < 0 ? "text-down" : "text-up"
                    }`}
                  >
                    {row.change < 0 ? "▼" : "▲"} {formatPercent(row.change)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Disclaimer">
          <p className="max-w-reading text-micro text-ink-soft">{disclaimer}</p>
        </Section>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-display-m">{title}</h2>
      <div className="scotch-rule mt-4 mb-8" />
      {children}
    </section>
  );
}

function Ornament({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-micro text-ink-soft">{label}</p>
      {children}
    </div>
  );
}

function SourceAttribution() {
  return (
    <p className="mt-4 text-body-s text-ink-soft">
      <span className="font-medium text-ink">Naam van de bron</span> op X,{" "}
      <time dateTime="2026-03-04">{formatDate(new Date(2026, 2, 4))}</time>
    </p>
  );
}
