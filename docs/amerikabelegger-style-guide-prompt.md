# De Amerikabelegger — Style Guide Prompt (for Claude Code)

---

## 0. Your task

Build the visual foundation for De Amerikabelegger's public website and commit it as real, working code.

Work in two passes:

1. **Plan first.** Write a short design plan (palette, type roles, layout concept, three principles). Check it against Section 6 ("Things that would make this wrong"). If any part of the plan is what you'd produce for any generic finance site, revise it and say what you changed and why. Do not write code until the plan survives that check.
2. **Then build.** Produce the deliverables in Section 8.

Ask me before inventing a new brand rule. Ask me before adding a typeface beyond the three specified.

---

## 1. What this is

De Amerikabelegger is a Dutch-language media platform about American stocks. It aggregates and analyses commentary from US finance influencers, then adds its own editorial and data layer on top.

**Audience:** Dutch retail investors, roughly 25–55, who follow US markets and are already exposed to American investing culture through social media. They are not professionals. They are also not beginners who need "wat is een aandeel" explained. They can smell a get-rich-quick site from a mile off and will leave.

**The job of the design:** make aggregated social-media commentary feel like it has been *edited* — weighed, sourced, and put on the record by someone with a house view. The design must do the work of saying "this is a publication, not a feed."

**Content is organised in three categories, always in this order:**

| Category | What it covers |
|---|---|
| **Giants** | Mega-caps, blue chips, the established index-movers |
| **Growers** | Compounders and mid-caps with a real business |
| **Moonshots** | Speculative, high-variance, the lottery tickets |

These are the primary navigation. Do not reorganise the site around which influencer said what — the categories are what the reader came for.

**Brand line:** *"Never bet against America"* (Warren Buffett). Keep it in English even in Dutch copy. Use it once, in one place, with weight. It is not a tagline to repeat in every footer.

---

## 2. The visual direction

**Retro Americana, but the serious kind.**

The reference is **not** diner signage, route-66 chrome, baseball pennants, or distressed vintage textures. The reference is the visual language of American *money and enterprise*:

- Engraved stock certificates and bank notes — guilloché line-work, cartouches, brass hairlines, tinted safety paper
- 1960s–70s American corporate annual reports — confident, spacious, high-contrast serifs
- The typographic seriousness of an American financial paper, without cosplaying a newspaper

The tension to hold: **retro lives in the ornament and the colour; the structure stays modern and disciplined.** If the layout itself starts looking like a period pastiche, you've gone too far.

**One bold element, everything else quiet.** The boldness lives in the navy expressive surfaces and the engraved display type. Article bodies, tables, and forms are plain and calm.

---

## 3. Colour

Navy is the dominant brand surface, not the accent. The site should read as a navy-and-brass banknote with buff paper inserts — not as a cream editorial site with a blue logo.

### Core palette

```
--ink            #0E1B2E   Deep navy-black. Primary brand field: hero, mastheads,
                           category headers, ticker, footer. Also body text on paper.
--ink-soft       #24354C   Navy one step up. Secondary text on paper, borders on ink.
--paper          #F1ECDE   Warm buff. The reading surface. Article bodies, cards.
--ledger         #E7EBE3   Pale safety-green. Tables, data panels, inset quotes.
                           Its only job is to say "this is a data surface, not prose."
--brass          #B08D3F   Hairlines, guilloché, cartouche edges, focus rings, ornament.
--seal           #A6231F   Oxidised red. Seals, stamps, one primary CTA. Sparingly.
```

Two paper tones is deliberate: on a real certificate, prose and figures sit on different stock. Use `--ledger` to mark every module where the reader is looking at numbers.

### Category colours

```
--giants         #2E4A6B   Steel navy
--growers        #3E6B4A   Bottle green
--moonshots      #B4521E   Burnt orange
```

Each category gets a colour and a cartouche (Section 5). Never introduce a fourth.

### Market data colours

```
--up             #1F6B44
--down           #B23B30
```

**Governance rule, and it matters:** `--seal` and `--down` are close enough to confuse. So — **red never appears inside a data module except to mean "down."** No seal-red buttons, badges, rules or headings inside a table, chart, quote card, or price block. Outside data modules, `--down` is not used at all.

Never encode direction in colour alone. Every up/down value carries an explicit sign and a small triangle glyph.

### Rules

- White (`#FFFFFF`) is not in the palette. There is no pure-white surface anywhere.
- Pure black is not in the palette either. `--ink` is the darkest value.
- No gradients. No glassmorphism. No blurred drop shadows. If a surface needs lifting off the page, use a 1px `--brass` hairline or a hard 2px offset shadow in `--ink` at 12% — never a soft grey blur.
- Contrast: WCAG AA minimum for all text, AAA for body copy on paper. Check `--brass` on `--paper` before using it for anything readable — it likely fails, so keep brass structural.

### Dark mode

**There is no separate dark mode for v1.** The navy surfaces already are the dark half of the site. Respect `prefers-color-scheme` only to the extent of not fighting it. If I ask for dark mode later we'll design it properly rather than inverting tokens.

---

## 4. Typography

Three faces, each with a hard-bounded role. Do not use any face outside its role.

### Display — **Bodoni Moda** (Google Fonts)

Headlines, the brand line, category mastheads, large figures in editorial contexts.

High-contrast engraved serif — the letterform of certificates and 20th-century American advertising. This is the retro carrier. Licensed upgrade path if we ever buy fonts: Publico Banner or Canela.

- Set it **big and tight.** Optical size axis on; tracking `-0.02em` at display sizes, `0` below 32px.
- Sentence case by default. Bodoni small caps for the rare structural label.
- Never below 24px — it falls apart at text sizes.

### Text & UI — **Libre Franklin** (Google Fonts)

Body copy, decks, navigation, buttons, forms, tables, captions, everything else.

Franklin Gothic is the American gothic — newspapers, campaign posters, annual reports. It's the workmanlike counterweight that keeps the Bodoni from reading as luxury fashion. It also sets Dutch well, which matters. Licensed upgrade path: Trade Gothic or Untitled Sans.

- Body 400, UI labels 500, emphasis 600. Avoid 300 and 800 entirely.
- Enable `font-feature-settings: "tnum" 1` on every table, price, and figure.

### Ticker only — **IBM Plex Mono** (Google Fonts)

The live ticker strip. Nothing else.

Monospace as a decorative "data" flavour on small labels is a tell and I don't want it. Here it earns its place because the ticker genuinely is a machine readout with columns that must not jump. If you find yourself reaching for mono anywhere else, use Libre Franklin with tabular figures instead.

### Scale

A 1.2 ratio for text, wider jumps for display. Define as tokens; don't hardcode sizes in components.

```
display-xl   72 / 1.02   Bodoni    Hero only. One per page.
display-l    52 / 1.06   Bodoni    Article titles, category mastheads
display-m    36 / 1.12   Bodoni    Section heads
display-s    26 / 1.2    Bodoni    Card titles
body-l       19 / 1.65   Franklin  Article body, deck
body         17 / 1.6    Franklin  Default UI, list body
body-s       15 / 1.5    Franklin  Captions, metadata, table cells
micro        13 / 1.4    Franklin  Legal, disclaimers, timestamps
```

Mobile: display-xl drops to 44, display-l to 34, body-l to 18. Everything else holds.

### Typographic rules

- **Measure: 62–68 characters** for Franklin body. Dutch compounds run long, so err wide rather than narrow, but never past 72.
- **No tracked-out all-caps eyebrow labels above headings.** If a heading needs categorising, it gets a cartouche, not a label. This is a hard no — it's the single fastest way to make this site look generated.
- **Sentence case throughout**, including buttons and nav. All-caps is reserved for ticker symbols (`AAPL`, `NVDA`) and nothing else.
- No em-dash-plus-fragment label constructions. No middle-dot-joined metadata strings. No arrows appended to link text.
- Dutch typographic conventions, enforced in a shared formatter:
  - Thousands `.`, decimals `,` → `$ 1.234,56` / `€ 1.234,56`
  - Percentages `+12,4%` / `−3,1%` (true minus sign U+2212, not a hyphen)
  - Dates in Dutch long form: `4 maart 2026`
  - Quotes: `‘enkel’` and `“dubbel”`
  - Currency symbol, then a thin space, then the figure

---

## 5. Ornament and structure

This is where the period voice lives. Four devices, and only these four.

**1. Guilloché.** The engine-turned wave pattern from bank notes. Build it once as an SVG component with configurable amplitude and colour. Two uses: a thin band (24–32px) separating major page regions, and a hero backdrop at 6–8% opacity in `--brass` on `--ink`. Never behind text that has to be read at body size.

**2. Cartouches.** The category markers, shaped like the denomination lozenges on currency: fully rounded ends (`border-radius: 999px`), 1px `--brass` border, category colour as a solid fill on ink surfaces or as text-and-border on paper. Small caps Bodoni or 500-weight Franklin at `body-s`. Giants / Growers / Moonshots each get one, used consistently everywhere the category appears.

The rounded cartouche against the hard-edged panels is intentional — it's the contrast that keeps the layout from reading as a flat grid of squares.

**3. Scotch rules.** A thick-thin double rule (2px + 1px, 3px gap, `--brass`) under section mastheads. **Only** under section mastheads — not between list items, not between cards, not as a decorative divider. Hairlines everywhere is a newspaper pastiche and I don't want it.

**4. The seal.** A circular engraved mark in `--seal` for the brand's own editorial voice: house verdicts, "geverifieerd" markers, the primary CTA. It signifies *we are putting our name to this*. Use it three or four times across the whole site, not per card.

### Geometry and spacing

- 4px base unit, 8px rhythm. Scale: `4 8 12 16 24 32 48 64 96 128`.
- Content container 1240px. Reading column 680px, centred within it.
- Section padding: 96px desktop / 56px mobile vertical. Card padding 24px. Never pad below 12px.
- **Border radius 0** on panels, cards, images, inputs, and buttons. The only rounded things on the site are cartouches and the seal.
- Borders are 1px `--brass` on ink, 1px `--ink` at 15% on paper.

### Motion

**One orchestrated moment: the ticker.** A continuous horizontal scroll on the ink strip, respecting `prefers-reduced-motion` (which stops it and shows a static row).

Everything else is static. No fade-and-slide-up on scroll. No hover lift on cards. Hover states change colour or underline only. Motion that answers a click — a disclosure opening, a filter applying — is welcome and should be fast (150ms) and unfussy.

---

## 6. Things that would make this wrong

Check your plan and your code against this list before you ship.

- Any gradient, especially blue-to-purple, and especially in a hero
- Glassmorphism, soft blurred shadows, or a "floating card" look
- Rounded corners on cards, buttons, or images
- Inter, Roboto, or any system-UI stack as the display face
- Tracked-out all-caps eyebrow labels above headings
- Every section chopped into three identical rounded cards with identical shadows
- Monospace used as a decorative flavour on small labels
- Emoji anywhere, including in Dutch copy
- Cartoon eagles, checkerboard, distressed grunge overlays, torn-paper edges, Route 66 shields, cowboy or western lettering
- Pure white or pure black anywhere
- A dense multi-column broadsheet layout with hairline rules everywhere — this is a website, not a facsimile newspaper
- Any implication of a return, a guarantee, or urgency. No countdown timers, no "hot," no flame icons, no "trending now" pressure devices. We are regulated-adjacent and the design must never write a cheque compliance can't cash.

---

## 7. Content-specific components

Specify and build these as primitives:

- **Ticker strip** — ink, mono, tabular, scrolling, reduced-motion-safe. Symbol, price, signed change with triangle.
- **Cartouche** — the category marker described above.
- **Article card** — paper surface, Bodoni title, Franklin deck, cartouche, source attribution, timestamp. No hover lift.
- **Source attribution block** — this one is load-bearing. Every aggregated claim shows *who said it, on which platform, when.* Platform is named in text, not by a coloured logo chip. This block is what separates us from a content farm; design it as a first-class element, not as fine print.
- **House verdict** — the seal plus our own editorial line, on a ledger surface. Visually distinct from anything quoted.
- **Data table** — ledger surface, tabular figures, right-aligned numbers, Scotch rule under the header row only, zebra striping off.
- **Disclaimer** — micro size, ink-soft on paper, persistent in the footer and above the fold on any page carrying a specific stock view. Designed to be readable rather than hidden. Content TBD with legal, but build the slot now.

---

## 8. Deliverables

Assume Next.js (App Router) and Tailwind. Adapt if the repo says otherwise — read it first.

1. `docs/design-plan.md` — the short plan from Section 0, including what you revised and why.
2. Design tokens as CSS custom properties (Tailwind v4 `@theme` in `globals.css`, or a config extension for v3). Every colour, size, space, and radius above becomes a named token. **No raw hex values in any component.**
3. Font loading via `next/font/google` for the three families, with the correct subsets and weights, and a sensible fallback stack.
4. A `/styleguide` route rendering the full specimen: palette swatches with token names and contrast ratios, the type scale in situ, spacing scale, all four ornament devices, and every component from Section 7 in its states.
5. A shared `lib/format.ts` with the Dutch number, currency, percentage, and date formatters from Section 4.
6. `docs/STYLE_GUIDE.md` — the durable version of this document, updated to match what you actually built.

Make it responsive to 360px, keyboard-navigable with a visible `--brass` focus ring, and accessible before you make it pretty.
