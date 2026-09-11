# Design plan — De Amerikabelegger

The plan required by Section 0 of the style guide prompt, checked against Section 6
("Things that would make this wrong") before any code was written.

## Palette

Navy dominant, not accent. `--ink` is the engraved plate; `--paper` is the only reading
surface; `--ledger` marks every module where the reader is looking at figures. `--brass`
is structural, `--seal` is the house voice. No white, no black, no gradients.

## Type roles

| Face | Role | Bound |
|---|---|---|
| Bodoni Moda | Display, brand line, category names | Never below 24px |
| Libre Franklin | Body, UI, nav, tables, captions | Weights 400/500/600 only |
| IBM Plex Mono | The ticker | Nothing else |

## Layout concept — the plate and its inserts

Ink is the engraved plate: ticker, header, hero, footer. Paper is where you read. Ledger
is where figures live. A page is a stack of full-bleed ink and paper bands, never floating
cards on a background.

## Three principles

1. **Edited, not fed.** Every screen shows a human hand — a category assigned, a source
   named, a verdict signed.
2. **Retro in the ornament, modern in the grid.** Guilloché, cartouche, scotch rule and
   seal carry the period voice; the layout stays hard-edged, zero-radius and disciplined.
3. **Borrowed knowledge, stated plainly.** Attribution is designed, not fine print.

---

## What was revised, and why

Four changes were made to the specification. Three came out of the Section 6 check and
measured contrast; the fourth was a conflict inside the guide itself.

### 1. The three categories are one divided band, not three cards

The obvious homepage treatment — Giants, Growers and Moonshots as three equal cards — is
the exact pattern Section 6 forbids ("every section chopped into three identical cards").

Revised to a **single paper panel divided by brass hairlines**: three columns, no gaps, no
shadows, each topped by a 4px category rule. It reads as a bank note's denomination row
rather than a generic card grid, and the rounded cartouche inside the hard-edged column is
the intended contrast.

### 2. `--moonshots` darkened from `#B4521E` to `#A24A1B`

The original scored **4.27:1 against paper**, below the AA threshold of 4.5. Because
contrast is symmetric, this broke *both* cartouche forms the guide specifies — burnt-orange
text on paper, and paper text on a burnt-orange fill.

A 10% darkening brings it to **5.04:1**. Giants (7.71) and Growers (5.22) were already
fine, so this was the only hue affected, and there are still exactly three.

### 3. The ticker carries direction without colour

`--up` and `--down` score **2.67:1 and 2.93:1 against ink** — both far under AA. The guide
only ever considered them on ledger, where they pass (5.36 and 4.88).

Rather than add two lightened brand tokens, the ticker sets every figure in paper and lets
the sign and the triangle carry direction — which the guide already mandates ("never encode
direction in colour alone"). `--up` and `--down` keep their meaning on ledger surfaces,
where the data tables live. **Worth revisiting** if a coloured ticker turns out to matter.

### 4. The disclaimer sits on ledger, between the page and the ink footer

Section 3 puts the footer on ink; Section 7 wants the disclaimer "ink-soft on paper" and
explicitly readable rather than hidden. Those can't both hold.

Resolved as a **ledger band directly above the ink footer** — a data/legal surface at
14.31:1. It honours the intent (readable, not tucked away) and keeps the footer on ink.

---

## The rule that outranks the style guide

We never imply we conduct our own research. We borrow knowledge and organise it.

This is structural, not just copy. The source attribution block is a first-class element,
the house voice is labelled *Redactie* and visually separated from anything quoted, and the
positioning line sits above the footer on every page. The vocabulary rule is recorded in
[STYLE_GUIDE.md](STYLE_GUIDE.md).
