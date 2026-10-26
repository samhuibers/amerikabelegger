import { keepTogether, renderCard, tokens } from "@/app/kaart/shell";
import { getPortfolio, investors, styleGroups, topPositions } from "@/lib/content";
import { formatDate, formatQuarter, formatWeight } from "@/lib/format";

/*
 * De kaart voor "Topbelegger van de week", als PNG op /kaart/topbelegger/[slug].
 * Alle dertig worden bij de build getekend: de data verandert alleen met een
 * nieuwe commit, en die bouwt de site toch opnieuw. Een onbekende slug is 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return investors.map((investor) => ({ slug: investor.slug }));
}

export async function GET(_request: Request, { params }: RouteContext<"/kaart/topbelegger/[slug]">) {
  const { slug } = await params;
  const investor = investors.find((i) => i.slug === slug);
  const portfolio = await getPortfolio(slug);
  if (!investor || !portfolio) return new Response("Niet gevonden", { status: 404 });

  const style = styleGroups.find((g) => g.slug === investor.styleGroup)!.label;
  // Een datum als `new Date(y, m, d)`: een ISO-string wordt UTC-middernacht en kan een dag verschuiven.
  const [year, month, day] = portfolio.period.split("-").map(Number);
  const quarter = formatQuarter(Math.ceil(month / 3), year);
  // Bodoni op 150px is tot zo'n 85px per letter breed (m, o). Een woord van acht
  // letters of meer ("Cooperman") past dan niet in de kolom en loopt onder het
  // positievlak door, dus de naam wordt kleiner naarmate het langste woord langer is.
  const longestWord = Math.max(...investor.name.split(" ").map((word) => word.length));
  const nameSize = Math.min(150, Math.floor(1080 / longestWord));

  return renderCard({
    label: "Topbelegger van de week",
    meta: quarter,
    accent: tokens.brass,
    source: `13F over ${quarter} · portefeuille per ${formatDate(new Date(year, month - 1, day))}`,
    children: (
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", width: 660 }}>
          <div style={{ fontFamily: "Bodoni", fontSize: nameSize, lineHeight: 0.98, letterSpacing: "-0.02em" }}>
            {investor.name}
          </div>
          {/* Twee stukken die elk heel blijven (zie `keepTogether`); afbreken mag alleen ertussen. */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              columnGap: 9,
              marginTop: 32,
              fontSize: 40,
              lineHeight: 1.35,
              color: tokens.inkSoft,
            }}
          >
            {/*
              * Elk stuk op een eigen vlakje paper, zodat de lijn op de achtergrond niet door
              * de tekst loopt. Een waas rond de letters (textShadow) zou subtieler zijn, maar
              * ImageResponse tekent die niet.
              */}
            <div style={{ backgroundColor: tokens.paper }}>{keepTogether(`${investor.firm} ·`)}</div>
            <div style={{ backgroundColor: tokens.paper }}>{keepTogether(style)}</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 620,
            padding: "30px 40px 14px",
            backgroundColor: tokens.ledger,
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 500, color: tokens.inkSoft, marginBottom: 8 }}>
            Grootste posities
          </div>
          {topPositions(portfolio, 3).map((position) => (
            <div
              key={position.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 24,
                padding: "16px 0",
                borderTop: `1px solid ${tokens.rule}`,
                fontSize: 48,
                lineHeight: 1.2,
              }}
            >
              <div style={{ flex: 1 }}>{position.name}</div>
              <div style={{ fontWeight: 500 }}>{formatWeight(position.weight)}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  });
}
