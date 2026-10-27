import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { Backdrop } from "@/app/kaart/backdrop";

/*
 * De gedeelde opbouw van elke postkaart voor X: een band, één datablok en een
 * footer. Geen route — alleen `route.tsx` maakt van een map een URL — maar de
 * schil die de routes onder app/kaart/ delen.
 */

/*
 * AFWIJKING VAN DE HUISSTIJL, bewust (docs/STYLE_GUIDE.md, "Post cards"):
 * kopieën van de kleurtokens in app/globals.css. ImageResponse leest geen CSS
 * en geen Tailwind-klassen, alleen inline styles, dus de waarden moeten hier
 * letterlijk staan. Dit is de enige plek in de code met hexwaarden. Verandert
 * een kleur in globals.css, verander hem dan hier ook.
 */
export const tokens = {
  ink: "#0e1b2e",
  inkSoft: "#24354c",
  paper: "#f1ecde",
  ledger: "#e7ebe3",
  brass: "#b08d3f",
  seal: "#a6231f",
  giants: "#2e4a6b",
  growers: "#3e6b4a",
  moonshots: "#a24a1b",
  up: "#1f6b44",
  down: "#b23b30",
  /** `border-ink/15` uit de huisstijl: lijnen op paper. */
  rule: "rgba(14, 27, 46, 0.15)",
};

/*
 * ImageResponse kan de WOFF2-bestanden van next/font niet lezen, dus de
 * lettertypen staan als TTF in assets/fonts (OFL, licenties ernaast). Eén keer
 * gelezen bij het laden van de module, niet per kaart.
 */
const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));
const fonts = Promise.all([
  font("LibreFranklin-Regular.ttf"),
  font("LibreFranklin-Medium.ttf"),
  font("BodoniModa-Regular.ttf"),
]);

/*
 * ImageResponse meet elk woord los en tekent het daarna met kerning. Over een
 * lang woord loopt dat verschil op, en dan staat er een gat achter het woord
 * ("Topbelegger  van de week"). Met harde spaties meet hij de hele regel in één
 * keer en klopt de spatiëring — maar zo'n regel kan niet meer afbreken. Dus
 * alleen voor tekst die op één regel past, of voor stukken die als geheel
 * naar de volgende regel mogen.
 */
export function keepTogether(text: string) {
  return text.replaceAll(" ", " ");
}

/** 16:9 zoals X hem toont. Belangrijke tekst blijft binnen de middelste 80%. */
const WIDTH = 1600;
const HEIGHT = 900;
const MARGIN = 160;

export async function renderCard({
  label,
  meta,
  source,
  accent,
  children,
}: {
  /** Het posttype, in de band: "Topbelegger van de week". */
  label: string;
  /** Rechts in de band, uit de data: "Q2 2026". */
  meta: string;
  /** De datalijn in de footer: waar de cijfers vandaan komen en van wanneer. */
  source: string;
  /** De kleur van het posttype (uit `postTypes` in lib/posts.ts), voor de skyline op de achtergrond. */
  accent: keyof typeof tokens;
  /** Het datablok. */
  children: React.ReactNode;
}) {
  const [franklin, franklinMedium, bodoni] = await fonts;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: tokens.paper,
          color: tokens.ink,
          fontFamily: "Franklin",
          position: "relative",
        }}
      >
        {/* Eerst, zodat band, datablok en footer eroverheen getekend worden. */}
        <Backdrop color={tokens[accent]} up={tokens.up} down={tokens.down} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 120,
            padding: `0 ${MARGIN}px`,
            backgroundColor: tokens.ink,
            borderBottom: `3px solid ${tokens.brass}`,
            color: tokens.paper,
            fontSize: 42,
            fontWeight: 500,
          }}
        >
          <div>{keepTogether(label)}</div>
          <div style={{ color: tokens.brass }}>{keepTogether(meta)}</div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: `0 ${MARGIN}px`,
          }}
        >
          {children}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            margin: `0 ${MARGIN}px`,
            padding: "28px 0 72px",
            borderTop: `1px solid ${tokens.rule}`,
          }}
        >
          <div style={{ fontSize: 30, color: tokens.inkSoft }}>{keepTogether(source)}</div>
          <div style={{ fontFamily: "Bodoni", fontSize: 48 }}>{keepTogether("De Amerikabelegger")}</div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Franklin", data: franklin, weight: 400, style: "normal" },
        { name: "Franklin", data: franklinMedium, weight: 500, style: "normal" },
        { name: "Bodoni", data: bodoni, weight: 400, style: "normal" },
      ],
    },
  );
}
