import { keepTogether, renderCard, tokens } from "@/app/kaart/shell";
import { postTypes, type PostType } from "@/lib/posts";

/*
 * Een lege kaart per posttype, op /kaart/leeg/[type]: de schil met de band en
 * kleur van dat type, zonder data. Alleen voor de voorvertoning, zodat het
 * gekozen kaartontwerp te zien is bij de types die nog niet gebouwd zijn.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(postTypes).map((type) => ({ type }));
}

export async function GET(_request: Request, { params }: RouteContext<"/kaart/leeg/[type]">) {
  const { type } = await params;
  const postType = postTypes[type as PostType];

  return renderCard({
    label: postType.label,
    meta: "Voorbeeld",
    // Nog geen kleur gekozen: dan inkt, zodat het niet op een besluit lijkt.
    accent: postType.accent ?? "ink",
    source: postType.slot ?? "Tijdstip nog niet bepaald",
    children: (
      // Op vlakjes paper, zoals op de Topbelegger-kaart: de lijn op de achtergrond loopt niet door tekst.
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ fontFamily: "Bodoni", fontSize: 120, lineHeight: 1, backgroundColor: tokens.paper }}>
          {keepTogether("Nog niet gebouwd")}
        </div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 40 }}>
          <div style={{ backgroundColor: tokens.paper, color: tokens.inkSoft }}>{postType.status}</div>
        </div>
      </div>
    ),
  });
}
