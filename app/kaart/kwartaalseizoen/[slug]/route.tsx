import { keepTogether, renderCard, tokens } from "@/app/kaart/shell";
import {
  getPortfolio,
  getPreviousPortfolio,
  investors,
  portfolioPeriod,
  positionChanges,
  styleGroups,
} from "@/lib/content";
import { formatQuarter, formatWeight } from "@/lib/format";
import { postTypes } from "@/lib/posts";

/*
 * De kaart voor Kwartaalseizoen, als PNG op /kaart/kwartaalseizoen/[slug]: wat
 * een belegger nieuw kocht en helemaal verkocht sinds het kwartaal ervoor.
 * Alleen voor wie een vorig kwartaal heeft om mee te vergelijken; de rest is 404.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const withPrevious = [];
  for (const investor of investors) {
    if (await getPreviousPortfolio(investor.slug)) withPrevious.push({ slug: investor.slug });
  }
  return withPrevious;
}

export async function GET(_request: Request, { params }: RouteContext<"/kaart/kwartaalseizoen/[slug]">) {
  const { slug } = await params;
  const investor = investors.find((i) => i.slug === slug)!;
  const latest = (await getPortfolio(slug))!;
  const previous = (await getPreviousPortfolio(slug))!;
  const { added, sold } = positionChanges(latest, previous);

  const style = styleGroups.find((g) => g.slug === investor.styleGroup)!.label;
  const period = portfolioPeriod(latest);
  const quarter = formatQuarter(period.quarter, period.year);
  const before = portfolioPeriod(previous);
  // Zoals op de Topbelegger-kaart: de naam krimpt als het langste woord niet in de kolom past.
  const longestWord = Math.max(...investor.name.split(" ").map((word) => word.length));
  const nameSize = Math.min(150, Math.floor(1080 / longestWord));

  const lists = [
    { title: "Nieuw", rows: added.map((p) => ({ name: p.name, figure: formatWeight(p.weight) })), more: added.length - 3 },
    { title: "Helemaal verkocht", rows: sold.map((p) => ({ name: p.name, figure: "" })), more: sold.length - 3 },
  ].filter((list) => list.rows.length);

  return renderCard({
    label: postTypes.kwartaalseizoen.label,
    meta: quarter,
    accent: postTypes.kwartaalseizoen.accent,
    source: `13F over ${quarter}, vergeleken met ${formatQuarter(before.quarter, before.year)}`,
    children: (
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", width: 600 }}>
          <div style={{ fontFamily: "Bodoni", fontSize: nameSize, lineHeight: 0.98, letterSpacing: "-0.02em" }}>
            {investor.name}
          </div>
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
            <div style={{ backgroundColor: tokens.paper }}>{keepTogether(`${investor.firm} ·`)}</div>
            <div style={{ backgroundColor: tokens.paper }}>{keepTogether(style)}</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 660,
            padding: "22px 36px 10px",
            backgroundColor: tokens.ledger,
          }}
        >
          {lists.map((list) => (
            <div key={list.title} style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
              <div style={{ fontSize: 30, fontWeight: 500, color: tokens.inkSoft, marginBottom: 4 }}>
                {list.more > 0 ? `${list.title} (en nog ${list.more})` : list.title}
              </div>
              {list.rows.slice(0, 3).map((row) => (
                <div
                  key={row.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 24,
                    padding: "8px 0",
                    borderTop: `1px solid ${tokens.rule}`,
                    fontSize: 38,
                    lineHeight: 1.2,
                  }}
                >
                  <div style={{ flex: 1 }}>{row.name}</div>
                  <div style={{ fontWeight: 500 }}>{row.figure}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
  });
}
