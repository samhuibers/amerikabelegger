# De Amerikabelegger — style guide

The durable version, matching what is actually built. See [design-plan.md](design-plan.md)
for the reasoning and the four deviations from the original brief.

Live specimen: **`/styleguide`**.

---

## The one rule that outranks the rest

**We never imply we conduct our own research.** We borrow knowledge and organise it.

- Write: *wij verzamelen, ordenen, selecteren, wegen*.
- Never write: *ons onderzoek, onze analyse, onze research, wij berekenen*.
- Opinion is allowed, but it is labelled **Redactie** and looks visually distinct from
  anything quoted. An opinion is not research.
- Every borrowed claim names **who said it, on which platform, when**.

---

## Tokens

All tokens live in [`app/globals.css`](../app/globals.css). **No component carries a raw
hex value** — verified with `grep -rE '#[0-9a-fA-F]{6}' app components lib`. The one
exception is `app/kaart/shell.tsx`; see "Sanctioned deviation: post cards for X" below.

### Colour

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#0E1B2E` | Hero, header, ticker, footer. Body text on paper. |
| `--color-ink-soft` | `#24354C` | Secondary text on paper. |
| `--color-paper` | `#F1ECDE` | The reading surface. |
| `--color-ledger` | `#E7EBE3` | Tables, data panels, inset quotes, the disclaimer band. |
| `--color-brass` | `#B08D3F` | Hairlines, guilloché, cartouche edges, focus rings. |
| `--color-seal` | `#A6231F` | The seal, the one primary CTA. Sparingly. |
| `--color-giants` | `#2E4A6B` | Steel navy |
| `--color-growers` | `#3E6B4A` | Bottle green |
| `--color-moonshots` | `#A24A1B` | Burnt orange — **darkened from `#B4521E` for AA** |
| `--color-up` | `#1F6B44` | On ledger only (post cards: also the background line on paper) |
| `--color-down` | `#B23B30` | On ledger only (post cards: also the background line on paper) |

No white. No black. No gradients, no glassmorphism, no blurred shadows. No dark mode in v1.

### Measured contrast

| Pair | Ratio | |
|---|---|---|
| ink on paper | 14.65 | AAA |
| ink-soft on paper | 10.54 | AAA |
| paper on ink | 14.65 | AAA |
| ledger on ink | 14.31 | AAA |
| brass on ink | 5.54 | AA — brass text is allowed here |
| **brass on paper** | **2.64** | **FAIL — brass is structural only** |
| giants / growers / moonshots on paper | 7.71 / 5.22 / 5.04 | AAA / AA / AA |
| seal on paper | 6.17 | AA |
| up / down on ledger | 5.36 / 4.88 | AA |
| **up / down on ink** | **2.67 / 2.93** | **FAIL — never use these on ink** |

### Type

Loaded via `next/font/google` in [`app/layout.tsx`](../app/layout.tsx). Two things are
easy to get wrong: **Bodoni Moda's `opsz` axis must be requested explicitly** (Next drops
extra axes by default), and **IBM Plex Mono has no variable cut**, so its weights are
mandatory.

| Token | Size / leading | Face |
|---|---|---|
| `text-display-xl` | 44→72 / 1.02 | Bodoni — hero only, one per page |
| `text-display-l` | 34→52 / 1.06 | Bodoni — page titles |
| `text-display-m` | 36 / 1.12 | Bodoni — section heads |
| `text-display-s` | 26 / 1.2 | Bodoni — card titles |
| `text-body-l` | 18→19 / 1.65 | Franklin — article body, deck |
| `text-body` | 17 / 1.6 | Franklin — default |
| `text-body-s` | 15 / 1.5 | Franklin — captions, metadata, cells |
| `text-micro` | 13 / 1.4 | Franklin — legal, timestamps |

The three responsive sizes clamp inside the token, so components never need breakpoint
size classes.

Rules: Bodoni never below 24px. Sentence case everywhere, including nav and buttons —
all-caps is for ticker symbols only. No tracked-out eyebrow labels above headings. Measure
62–68 characters (`max-w-reading`). `.tabular` on every table, price and figure.

### Libre Franklin stays — and what would replace it

The three faces were formally re-evaluated in September 2026 and **Libre Franklin was
kept**. If it is ever questioned again, the vetted substitute is **Archivo**: a grotesque
drawn for small sizes, with a narrower set width that buys back a line in the 256px media
tile captions and gives the figures more spine in a table. The other two finalists were
**Public Sans** (a redraw of Libre Franklin itself, the conservative pick) and **IBM Plex
Sans** (pairs by design with the Plex Mono already in the ticker).

Bodoni Moda is settled and is not up for discussion. Don't introduce a face that wasn't on
that shortlist without running a fresh specimen first.

### Geometry

4px base (Tailwind's default scale). `max-w-content` 1240px, `max-w-reading` 680px.
(The following is a guideline, not a rule) **Border radius 0 on everything** — the only rounded things on the site are the cartouche
and the seal. Borders are 1px brass on ink, `border-ink/15` on paper.

---

## Ornament — four devices, and only these

On the site, that is. The X post cards add a fifth, the skyline, and only there; see
"Sanctioned deviation: post cards for X".

1. **Guilloché** ([`components/guilloche.tsx`](../components/guilloche.tsx)) — a 24–32px
   band between regions, or a hero backdrop at 7% brass on ink. Never behind body text.
2. **Cartouche** ([`components/cartouche.tsx`](../components/cartouche.tsx)) — the category
   marker. Solid fill + paper text on ink; ink text + category border on paper. The label
   is never set in the category hue on paper, because Moonshots would fail AA at 15px.
3. **Scotch rule** (`.scotch-rule`) — 2px + 1px brass. **Only under a section masthead.**
4. **The seal** ([`components/seal.tsx`](../components/seal.tsx)) — three or four times
   across the whole site, never per card, never inside a data module.

## Photography

Photographs appear on the **homepage only** — the banner behind the brand line and one
behind each category column. Sources and licensing: [IMAGE-CREDITS.md](IMAGE-CREDITS.md).

Three classes in `globals.css` do all the work:

- `.photo` — `saturate(1.15)`. The one knob to turn if the images feel too muted or too
  loud. Colour is wanted: these are not black-and-white photographs.
- `.photo-scrim` — a **flat** 70% ink fill, for photographs with text directly on them.
  Never a gradient; the gradient ban still holds.
- `.photo-scrim-soft` — a flat **25%** fill, used only on the banner. It carries no contrast
  duty, because the banner's quote sits on a solid ink plate rather than on the photograph.
  **Never put text straight onto this one.**

**Choosing a category photograph.** The card is a wide, dark strip — roughly 480×220 on a
desktop — and the 70% scrim flattens everything behind it. A subject that depends on fine
tonal detail (an aerial in even grey light, a distant horizon) turns to mush at that size;
what survives is strong figure-ground: lit windows against night, an exhaust plume against
black, coloured machinery against concrete. Judge a candidate in the card, never on its own.

**Two ways to keep text legible over a photograph.** Scrim it, or plate it:

| | When | Contrast |
|---|---|---|
| Scrim (`.photo-scrim`) | Text directly on the image, as on the category cards | 5.44:1 worst case |
| Plate (solid `bg-ink` + brass hairline) | The image is too bright or too loved to mute — the banner | 14.65:1 always |

The banner earns the plate: its brightest area is the neon sign, exactly where the quote
falls, so a scrim heavy enough to make it legible would have flattened the neon and the
sunset. The plate fixes contrast regardless of what sits behind it and leaves the
photograph punchy.

The banner is **2.5:1**, matching its image's own ratio so nothing is cropped. It carries
`min-h-fit` alongside the ratio: on a narrow desktop the plate is taller than a 2.5:1 box,
and the band grows rather than clipping the quote. Keep that pairing on any fixed-ratio
box that contains text.

**The 70% is measured, not chosen by eye.** Text over a photograph has to survive the
photograph's *brightest* region, not its average — the Artemis exhaust plume and the
skyline's lit windows are exactly where a lighter scrim fails:

| Scrim | Paper text over a pure-white highlight | |
|---|---|---|
| 60% | 3.88:1 | body text fails |
| 64% | 4.43:1 | still fails |
| **70%** | **5.44:1** | **safe everywhere** |

Average-region contrast at 70% runs 6.9:1 (flag) to 12.1:1 (skyline).

Rules for any image that replaces these:
- Re-measure before lowering the scrim. Average brightness is not the test; the brightest
  region is.
- Category images get a real `alt` describing the photograph. The banner is decorative
  (`alt=""`) because the brand line beside it carries the meaning.
- No chart-going-up imagery, no money, no celebration of profit — the compliance line in
  "Things that would make this wrong" applies to pictures exactly as it does to copy. The one
  exception is the decorative price line on the X post cards, which never shows real data.

## Motion

One orchestrated moment: the ticker. Everything else is static — no scroll animation, no
hover lift. Hover changes colour or underline only. `prefers-reduced-motion` halts the
ticker and leaves a readable static row.

## Sanctioned deviation: post cards for X

The PNG cards under `/kaart/...` ([`app/kaart/`](../app/kaart/)) live in a different place
from the site: a timeline where people scroll past in a second, mostly on a phone. A card has
to make someone stop. Decided by Sam on 27 October 2026, after comparing rendered variants. On
the site itself, none of the rules below change.

**What the cards may do that the site may not:**

- **A price line in the background** ([`backdrop.tsx`](../app/kaart/backdrop.tsx)). It runs
  from lower left to upper right in short runs, each segment green (`up`) when it rises and red
  (`down`) when it falls, at 45% opacity on paper. It is the same fixed line on every card and
  never stands for real data, so it is decoration, not a figure. The rule that direction is
  never shown in colour alone applies to values, and still holds for every value on a card.
- **A skyline as a fifth ornament**, only on cards: Golden Gate, Space Needle, Gateway Arch,
  Manhattan and the Statue of Liberty, drawn in simple shapes in the format's colour at 9%.
  Drawn in-house, so there is no licence to track.
- **Type sized for a phone.** X shows a 1600 px card about 400 px wide, so card type is roughly
  three times the site scale: the name in Bodoni at 150 px (smaller when the longest word has
  more than seven letters, so it never runs under the data panel), figures at 48 px, the band
  at 42 px. The smallest text on a card is the 30 px footer.
- **Text over the line sits on its own patch of paper**, so the line never runs through
  letters. A glow around the letters would be subtler, but `ImageResponse` doesn't draw
  `textShadow`.

**What stays the same:** the paper surface, the ink band with a brass rule, sentence case,
Bodoni for the name and the wordmark, a ledger panel for figures. The data is always the first
thing you read: the decoration stays light, and every number on a card comes from the data.

**Constraints of the engine** (`ImageResponse` reads neither CSS nor Tailwind classes, only
inline styles):

- **Raw hex values.** `tokens` in `shell.tsx` copies the colours from `globals.css`. It is the
  one place outside `globals.css` where hex values are allowed, and both files carry a comment
  pointing at the other. Change a colour in one, change it in both.
- **Fonts as files.** Libre Franklin (regular and medium) and Bodoni Moda live as static TTFs in
  `assets/fonts/`, with their OFL licences, because `ImageResponse` can't use `next/font`'s WOFF2.
- **Word spacing.** The engine leaves a gap after long words unless a line is kept together
  with non-breaking spaces (`keepTogether` in `shell.tsx`).

## Sanctioned deviation — the homepage filmstrip

The "Topbeleggers en influencers" rail breaks three rules above on purpose, by decision
of the owner: its tiles are `rounded-lg`, they scale to 1.2 on hover, and they sit in a
horizontally scrolling rail rather than a divided band. The scale is wrapped in
`motion-safe:`, so a reduced-motion visitor still gets only the brass outline.

Their caption uses the **plate**, not the scrim — solid `ink-soft` with a brass hairline,
at 10.53:1 — because a translucent layer over the photograph was the thing being fixed.
Don't restore the scrim or the square corners here.

Hovering a tile dims the image (`.photo-dim`, a measured 60%) and reveals the platform mark
in `paper`, the same colour for every platform. There is no permanent platform chip: the
thumbnails are mock-ups of the posts themselves, so each one already shows whose interface
it is. The mark is an affordance, not a label.

---

## Dutch formatting

Always use [`lib/format.ts`](../lib/format.ts) — never `toFixed` or `toLocaleString` at
the call site.

| | Output |
|---|---|
| `formatNumber(1234.56)` | `1.234,56` |
| `formatCurrency(1234.56)` | `$ 1.234,56` (symbol, thin space, figure) |
| `formatPercent(12.4)` | `+12,4%` |
| `formatPercent(-3.1)` | `−3,1%` (true minus U+2212, not a hyphen) |
| `formatCompactCurrency(1.9e9)` | `$ 1,9 mld` (and `$ 254 mln`, `$ 4,7 mln`; under a million the whole figure) |
| `formatWeight(22.04)` | `22,0%` (a share of a whole, so unsigned; `< 0,1%` below that) |
| `formatRoughShare(99.8)` | `meer dan 99%` (running text; `minder dan 1%` at the other end) |
| `formatDate(...)` | `4 maart 2026` |

The space after the currency symbol is a narrow **no-break** space (U+202F), so `$` never
ends a line on its own.

Quotes in copy: `‘enkel’` and `“dubbel”`.

Direction is **never** encoded in colour alone — every up/down value carries an explicit
sign and a triangle glyph.

---

## Things that would make this wrong

Gradients. Glassmorphism or soft shadows. Rounded corners on cards, buttons or images.
Inter/Roboto/system-UI as the display face. Tracked-out all-caps eyebrows. Three identical
shadowed cards per section. Mono as decorative flavour on small labels. Emoji. Cartoon
eagles, distressed grunge, torn paper, Route 66 shields, western lettering. Pure white or
black. A hairline-ruled broadsheet pastiche. **Any implication of a return, a guarantee, or
urgency** — no countdowns, no "hot", no flames, no "trending now". We are
regulated-adjacent and the design must never write a cheque compliance can't cash.
