# Plan: phase 1, step 2 — post text and the preview page

*Written 27 October 2026. Status: **draft, waiting for Sam's OK**. No code written yet.*

This file is the starting point for a fresh session. Read it, then
[TODO.md](../TODO.md) and [decisions.md](decisions.md). CLAUDE.md and AGENTS.md apply as
always: plan → Sam's OK → build → recap → check question. Sam runs git.

## Where we are

**Phase 1** is the automated X account: two posts per US trading day, built from hard data (13F
filings, later prices), with a person approving each post in Telegram before it goes out. The
first content peak is the Q3 13F filings, due **Mon 16 Nov 2026**. The full reasoning is in
[decisions.md](decisions.md); the build order is:

1. ~~**Card shell + Topbelegger card.**~~ Done, commit `eb8381b`.
2. **Post text templates + preview page.** ← this plan
3. **Kwartaalseizoen:** keep last quarter's 13F, diff the two quarters, card + text.
4. **Telegram approval → X posting.** Needs the X developer account, which doesn't exist yet.
5. **Wall Street gisteren + real ticker.** Waits on the team's price-data budget.
6. **Site launch items** (see TODO.md).

**What step 1 built:**

- `GET /kaart/topbelegger/[slug]` returns a 1600×900 PNG, prerendered for all 30 investors at
  build time ([route](../app/kaart/topbelegger/[slug]/route.tsx)).
- [`app/kaart/shell.tsx`](../app/kaart/shell.tsx): `renderCard({ label, meta, source, accent, children })`.
  It holds the band, footer, fonts, a copy of the colour tokens and `keepTogether()`.
- [`app/kaart/backdrop.tsx`](../app/kaart/backdrop.tsx): the red/green price line and the skyline.
- [`lib/content.ts`](../lib/content.ts):
  - `companyNames` (ticker → readable name)
  - `companyName(holding)`
  - `topPositions(portfolio, count)`, which merges share classes and computes weights over
    shares only

## Goal of step 2

For any date, the code can say **which Topbelegger post goes out and what it says**, and a
page shows the upcoming posts (card plus text) so the team can judge them before anything is
posted. This is the "dry run" from the plan. Nothing is posted in step 2: no Telegram, no X API,
no scheduler.

Only the Topbelegger format is covered. The other formats plug into the same structure later.

## Design

### 1. `lib/posts.ts` (new): what a post is

```ts
type Post = {
  format: "topbelegger";   // grows per format: "kwartaalseizoen", "wall-street-gisteren", ...
  date: string;            // ISO date of the posting day, Amsterdam time
  text: string;            // the post text, ready to publish
  card: string;            // path of the card PNG, e.g. "/kaart/topbelegger/bill-ackman"
};
```

- `topbeleggerPost(slug, date)` builds the text from the data.
- `postsBetween(from, to)` lists the scheduled posts. For now that's one per Friday: Topbelegger
  van de week at 15:00.

`Post` lives in `lib/posts.ts`, not in `lib/content.ts`. It isn't stored content but something
computed *from* content, and both the preview page and the later Telegram route import it.
Record this in decisions.md, because CLAUDE.md's "types live in lib/content.ts" rule is
otherwise easy to misread.

### 2. The template: no AI (decided 22 Oct)

A draft to refine with Sam:

```
Topbelegger van de week: Bill Ackman (Pershing Square).

De drie grootste aandelenposities eind juni:
Uber 12,7%
Brookfield 12,6%
Microsoft 11,9%

Samen 37% van een portefeuille van 14 aandelen.
Bron: 13F over Q2 2026, ingediend bij de SEC op 14 augustus 2026.
```

**Rules for the template:**

- **Every number comes from the data**, formatted through `lib/format.ts` (`formatWeight`,
  `formatDate`, `formatRoughShare`). No number is ever typed into the template.
- **No pronouns for investors.** We have no basis for anyone's pronouns, so write "De drie
  grootste posities", never "zijn".
- **No advice words** ("kopen", "kans", "potentie") and no links. Links cost $0.20 per post
  through the API and lower reach; the site link goes in the bio.
- **Stay under 280 characters.** X counts most characters as 1 and emoji as 2. The preview
  shows the count and flags anything over 280.
- **Two or three wordings of the opening line**, chosen by week number so consecutive weeks
  differ. Fixed text, no randomness.

**Reuse:**

- Turning `portfolio.period` into a quarter and a date now happens in the card route and the
  profile page, and would happen a third time here. Under the rule of three, extract one helper
  into `lib/content.ts` (for example `portfolioPeriod(portfolio)` returning
  `{ year, quarter, date }`) and use it in all three places.
- The card route already computes "firm · style group". Keep that inline; the text doesn't
  need the style.

### 3. Rotation: who is Topbelegger van de week

Each investor appears once before anyone repeats. The week index counts from a fixed launch
Friday (`ROTATION_START`): `index = weeksSince(ROTATION_START) % 30`.

The order is an open question (see below). Whatever the order, a check in `lib/posts.ts`
throws at build time if the list doesn't contain exactly the 30 roster slugs, so an investor
added to `investors` can't silently be skipped.

**Not in step 2:** during kwartaalseizoen (two weeks after each 13F deadline) the 15:00 slot
switches format. Step 3 decides whether the rotation pauses then or simply moves on.

### 4. Dates and time zones

Posting times are Amsterdam time, while servers run in UTC. All "which day is it" logic goes
through one function that takes a `Date` and returns the Amsterdam calendar date, via
`Intl.DateTimeFormat` with `timeZone: "Europe/Amsterdam"`. No date library is needed. Keep
using the existing rule: build a date as `new Date(y, m - 1, d)`, never from an ISO string,
because an ISO string becomes UTC midnight and can shift a day.

### 5. Preview page: `/voorvertoning` (new)

A Server Component (no `"use client"`). For the next 6 Fridays it shows:

- the date
- the card, as an `<img src={post.card}>` (the PNG route from step 1)
- the post text, with its line breaks
- the character count, highlighted above 280

**How it renders:** the page depends on today's date, so it must render per request and must
not be prerendered at build time. This version of Next.js has changed how that is declared.
**Read `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` first** (look for
`connection()`), and don't rely on memory.

**Access:** it shows nothing secret, only public 13F data. The proposal is no link from the
site plus `robots: { index: false }` in its metadata. Real approval happens later in Telegram.

### Files

| File | Change |
|---|---|
| `lib/posts.ts` | new: `Post`, `topbeleggerPost`, `postsBetween`, the rotation, the Amsterdam-date helper |
| `lib/content.ts` | `portfolioPeriod()` helper |
| `app/kaart/topbelegger/[slug]/route.tsx`, `app/topbeleggers/[slug]/page.tsx` | use `portfolioPeriod()` |
| `app/voorvertoning/page.tsx` | new: the preview |
| `docs/decisions.md`, `docs/glossary.md`, `TODO.md` | entries for the above |

The main alternative we're not choosing is putting the templates in a JSON or Markdown file
that non-programmers could edit. Templates need logic (plurals, the opening-line variants,
formatting), so they're TypeScript. When the team wants to edit the wording itself, revisit
this.

## Open questions for Sam (ask these first in the new session)

1. **Cashtags?** Add `$UBER $BN $MSFT` at the end of the post. They make posts findable per
   stock on X and aren't links. *Recommended: yes*, but check whether X's API bills a cashtag
   like a URL; the pay-per-use pricing docs are vague.
2. **Disclaimer:** per post ("Geen advies.") or only in the X bio? *Recommended: the bio, with
   neutral wording in every post.* Revisit when the AFM finfluencer question comes up.
3. **Rotation order:** a hand-ordered list (starting with well-known names like Buffett and
   Ackman for launch, then mixing styles) or an automatic interleave by style group?
   *Recommended: hand-ordered.* It's one readable list, guarded by the 30-slug check.
4. **Launch Friday** (`ROTATION_START`): Fri 6 Nov or Fri 13 Nov 2026? It decides who is first.
5. **Preview access:** unlinked plus noindex (recommended), or behind a password? A password
   means environment variables and a `proxy.ts`. Next 16 renamed middleware to proxy; see
   `16-proxy.md` in the docs.
6. **Emoji in posts:** the site's style guide bans them. *Recommended: none in posts either.*

## How to verify step 2

- `npm run build` and `npm run lint` pass.
- **Always check the preview against a production build** (`npm run build && npx next start`),
  not just `next dev`. On 27 Oct the dev server served stale renders of prerendered routes.
- For three investors (Ackman, Li Lu, Arnold Van Den Berg) the text matches the card and the
  profile page, figure for figure.
- Every post in the preview stays at or under 280 characters, so try the longest names and the
  longest company names ("Madison Square Garden Entertainment").
- The rotation shows 30 different investors in 30 consecutive weeks, and the 31st week is the
  first again.

## Gotchas

- **npm, not pnpm.** If `node_modules` ends up in the pnpm layout again, run `npm ci`.
- **A running `next start` or `next dev` locks `.next`**, and `npm run build` then fails with
  `ENOTEMPTY`. Stop the server first (`lsof -ti tcp:<port>` finds it).
- **To see a card exactly as built**, read
  `.next/server/app/kaart/topbelegger/<slug>.body`; it's the PNG.
- **`ImageResponse` limits:**
  - It ignores `textShadow`.
  - Long words get extra spacing unless the text goes through `keepTogether()`.
  - It does flexbox only.
- **Uncommitted on purpose:** `package.json` / `package-lock.json` (`next` `16.3.4` →
  `^16.4.3`, done outside our sessions). Sam still has to decide on these; see TODO.md.
- **Open with Sam:** whether "Sam runs git" (AGENTS.md) stays the rule. On 27 Oct Sam asked
  Claude to commit and push once.
