# Plan: phase 1, step 3 — Kwartaalseizoen

*Written 27 October 2026. Status: **built 27 October 2026.** Decisions are recorded in
[decisions.md](decisions.md).*

**Where the build differs from this plan:**
- The post text is shorter than the draft below: "Wat kocht en verkocht …?" and headings without
  the quarter. The lists shrink from three names to two or one when needed. The draft put 19 of
  28 posts over 280.
- `ingest.py` drops a comparison when the totals differ more than threefold (Ackman's Q1 2026 came
  from a different filer). There's a new season routine in the handover.
- No `kwartaalseizoenPost(date)`. Instead there's `seasonPosts(quarterEnd)` (all posts of a
  season), `seasonDays(quarterEnd)` (its dates) and `latestSeasonPosts()` for the preview. Step 4
  finds today's post with `seasonPosts(q).find((p) => p.date === today)`.
- `topPositions` and `positionChanges` share one helper (`stockPositions`) and one matching key.
- `companyNames` gained the names in the August example season, and `cleanIssuer` now strips
  "Inc." and "Corp." with a full stop.

This file is the starting point for a fresh session. Read it, then [TODO.md](../TODO.md),
[decisions.md](decisions.md) and [build-log.md](build-log.md) (what steps 1 and 2 built).
CLAUDE.md and AGENTS.md apply as always: plan → Sam's OK → build → recap → check question.
Sam runs git.

## Where we are

**Phase 1** is the automated X account: two posts per US trading day, built from hard data, with a
person approving each post in Telegram. The build order:

1. ~~Card shell + Topbelegger card.~~ Done.
2. ~~Post text, the post type catalogue (`postTypes`) and `/voorvertoning`.~~ Done.
3. **Kwartaalseizoen.** ← this plan
4. Telegram approval → X posting. Needs the X developer account.
5. Wall Street gisteren + real ticker. Waits on the price-data budget.
6. Site launch items (see TODO.md).

**Deadline:** the Q3 13F deadline (Sat 14 Nov, which rolls to Mon 16 Nov 2026). The first
Kwartaalseizoen post goes out **Tue 17 Nov**.

## What Kwartaalseizoen is (from the content plan)

> Vier keer per jaar schakelt het 15:00-slot twee weken over op "Wat kochten en verkochten de
> topbeleggers?"

The weekly schedule (Sam, 27 Oct; open to change):

| | 07:30 | 15:00 |
|---|---|---|
| Ma | Wall Street gisteren | Week vooruit |
| Di | Wall Street gisteren | Giant van de week |
| Wo | Wall Street gisteren | Grower van de week |
| Do | Wall Street gisteren | Moonshot van de week |
| Vr | Wall Street gisteren | Topbelegger van de week |

During the season, Kwartaalseizoen takes the **Monday–Thursday 15:00 slots**. Topbelegger keeps
Friday and simply shows the newest quarter (decided 27 Oct).

## Design

### 1. Data: two quarters per investor

`ingest.py` now overwrites each investor's filing with the newest one. The code can't read git
history on Vercel, so the previous quarter has to be in the data.

- `data/13f.json` becomes `{ [slug]: { latest: Portfolio, previous: Portfolio | null } }`.
- `previous` is always the filing for **the quarter right before `latest`**. If an investor
  skipped a quarter, it stays `null` rather than comparing across six months.
- `choose_filing()` already loads all of an investor's 13F filings in one call. It will pick a
  filing for a given period, so `latest` and `previous` come from that same call. The
  "unchanged" shortcut (same accession number → keep the stored entry) applies to both.
- **The first run fills `previous` with Q1 2026.** That gives real Q1 → Q2 changes to build and
  check against now, before any Q3 filing exists.
- **Sam runs the ingest**, because it sends his name and email to the SEC (`EDGAR_IDENTITY`). See
  the handover's "Running the quarterly update".

**Not chosen:** one file per quarter (`data/13f/2026-06-30.json`). That keeps the whole history,
but `lib/content.ts` would have to import a file whose name it only knows at runtime, which the
bundler handles badly. Git already archives old quarters.

`lib/content.ts`: `getPortfolio(slug)` keeps returning `latest`, so profile pages and Topbelegger
cards don't change. New: `getPreviousPortfolio(slug)`, `getLatestQuarter()` reads `latest`, and
the JSON's shape gets a named type beside `Portfolio`.

### 2. The changes: only "nieuw" and "verkocht" (decided 27 Oct)

`positionChanges(latest, previous)` in `lib/content.ts`, next to `topPositions`:

- **Nieuw:** a company held now and not last quarter, with its weight now.
- **Verkocht:** a company held last quarter and not now, with its weight then.
- Same rules as the card: shares only (no options, no bonds), share classes merged.
- **Matching key:** the name from `companyNames` (so GOOG and GOOGL are one company), otherwise the
  ticker, otherwise the CUSIP. **Not the cleaned issuer name:** a filer that writes "MASTERCARD
  INC" one quarter and "MASTERCARD INCORPORATED" the next would otherwise show a false sale and
  purchase.
- Both lists sorted by weight, largest first.

**Not in this step:** "bijgekocht" and "afgebouwd". They need share counts, and a stock split
looks exactly like a big purchase. That would need split data we don't have. Weight changes mix
trading with price moves.

**Known false positive:** a merger or a change of ticker can show as "verkocht X, nieuw Y". It's
rare, and the Telegram approver catches it.

### 3. The season: dates and order (in `lib/posts.ts`)

**Deadline:** 45 days after quarter end. If that's a weekend, it moves to Monday. If it then lands
on Presidents' Day (third Monday of February), it moves again. That's the only US holiday that can
hit a 13F deadline. Test cases:

| Quarter | +45 days | Deadline | Season starts |
|---|---|---|---|
| Q2 2026 | Fri 14 Aug | Fri 14 Aug | Mon 17 Aug |
| Q3 2026 | Sat 14 Nov | Mon 16 Nov | Tue 17 Nov |
| Q4 2026 | Sun 14 Feb 2027 | Tue 16 Feb (Mon is Presidents' Day) | Wed 17 Feb |

**Season:** the 10 weekdays from the day after the deadline. Kwartaalseizoen posts on the Mon–Thu
among them. That's 8 posts, so **8 of the 30 investors** per season.

**Who goes on which day:** this must follow from the data alone, because nothing records what was
already posted (no database; approving is posting). The rule:

1. investors whose `latest` filing is for this quarter and **was filed by the deadline**, with at
   least one change, **in rotation order** (the Topbelegger list: well-known names first);
2. then late filers with changes, in filing order.

Day *k* of the season takes the *k*-th investor. Sam ingests on the morning of the first season
day, so the on-time list is complete before the first post and doesn't shift afterwards. An
amendment that adds or removes someone's only change can still shift the order; the approver will
see it. *Confirmed by Sam, 27 Oct.*

### 4. The post text

Same rules as Topbelegger:
- every number from the data, through `lib/format.ts`
- no pronouns, no advice words, no links, no emoji
- cashtags dropped when the post would go over 280 characters

A draft to measure against all 30 and adjust, as in step 2:

```
Wat kochten en verkochten de topbeleggers? Vandaag: Bill Ackman (Pershing Square).

Nieuw in Q3 2026:
Amazon 9,1%
Hertz 2,0%

Verkocht:
Chipotle
Canadian Pacific

Bron: 13F over Q3 2026, ingediend bij de SEC op 14 november 2026.

$AMZN $HTZ $CMG $CP
```

At most three per list, then "+ 12 kleinere" when there are more (Nygren has 161 positions). A
list with nothing in it is left out. The opening line is long, so shortening it is the first
thing to try if posts run over.

### 5. The card: `/kaart/kwartaalseizoen/[slug]`

`renderCard()` with label "Kwartaalseizoen", colour brass, and the quarter in the band. The data
block has the name and firm on the left, and "Nieuw" and "Verkocht" panels (top three each) on the
right. It's prerendered for all 30, like the Topbelegger card. It follows whichever card design
the partners pick, through the shell.

### 6. The preview and the catalogue

- `postTypes`: the slots from Sam's table. `kwartaalseizoen.slot` becomes "Maandag tot en met
  donderdag 15:00, twee weken na elke 13F-deadline".
- `/voorvertoning` gets a Kwartaalseizoen section with **the latest season the data covers**:
  - before the Q3 ingest, that's Q2's season (17–27 Aug), so the team sees real posts now;
  - after the Q3 ingest, it's 17–30 Nov.
  - The section says which season it shows.
- Kwartaalseizoen also moves out of the "Nog niet gebouwd" grid.

### Files

| File | Change |
|---|---|
| `tools/13f/ingest.py` | `{ latest, previous }`, choose a filing per period |
| `data/13f.json` | regenerated by Sam's ingest run |
| `lib/content.ts` | new JSON shape, `getPreviousPortfolio`, `positionChanges` |
| `lib/posts.ts` | slots, deadline and season dates, season order, `kwartaalseizoenPost(date)` |
| `app/kaart/kwartaalseizoen/[slug]/route.tsx` | new: the card |
| `app/voorvertoning/page.tsx` | Kwartaalseizoen section |
| `docs/handover.md` | the quarterly update now keeps two quarters |
| `docs/decisions.md`, `docs/glossary.md`, `docs/build-log.md`, `TODO.md` | entries |

### Order of work

1. Ingest and data shape first. Sam runs the ingest, we check the Q1 → Q2 diff, and Sam commits.
2. Then `positionChanges` + the post text + the card + the preview.

## How to verify step 3

- `npm run build` and `npm run lint` pass. Check the preview against a production build
  (`npm run build && npx next start`).
- After the first ingest, the `git diff` of `data/13f.json` only adds `previous` entries:
  every `latest` is byte-identical to today's data.
- The Q1 → Q2 changes for three investors (Buffett, Ackman, Li Lu) match the two filings on
  sec.gov, read by hand.
- The 30 Topbelegger cards are byte-identical to before (compare the `.body` files).
- The season dates match the test cases above.
- Every season post is at or under 280 characters, including Nygren and Rogers (most positions)
  and the longest names.

## Answered 27 Oct

1. **8 posts per season, so 8 of 30 investors:** fine for now. Revisit later (TODO.md).
2. **The order rule in §3:** confirmed, well-known names first.

## Gotchas

- **npm, not pnpm.** If `node_modules` ends up in the pnpm layout again, run `npm ci`.
- **`ENOTEMPTY` on `npm run build`:**
  - Usually a running `next start` or `next dev` locks `.next`, so stop the server first
    (`lsof -ti tcp:<port>` finds it).
  - On 27 Oct it happened with no server running. Deleting `.next` (it's build output and
    git-ignored) fixed it.
- **To see a card exactly as built**, read `.next/server/app/kaart/<type>/<slug>.body`; it's the
  PNG.
- **`ImageResponse` limits:**
  - It ignores `textShadow`, so text that crosses the background line sits on a patch of paper.
  - Long words get extra spacing unless the text goes through `keepTogether()`.
  - It does flexbox only.
- **To run `lib/` code outside Next** (for example to measure every post), Node 24 runs TypeScript
  directly. The `@/` imports and the JSON import need a small loader: a `module.register()`
  resolve hook that maps `@/x` to `<project>/x.ts` and gives `.json` files
  `importAttributes: { type: "json" }`. Keep it in the scratchpad, not the repo.
- **The `rotation` guard** in `lib/posts.ts` stops the build when the list doesn't hold every
  investor exactly once.
- **Uncommitted on purpose:** `package.json` / `package-lock.json` (`next` `16.3.4` →
  `^16.4.3`). Sam still has to decide; see TODO.md.
- **The repo is in iCloud-synced `~/Documents`.** iCloud created `main 2` conflict copies in
  `.git/refs` (harmless so far). Claude suggested moving the repo out of iCloud (27 Oct); Sam
  hasn't decided yet.
