# Progress

What Sam has actually learned, based on evidence: a check question answered, or something done without help. Hearing an explanation doesn't count.

## Can explain
- 2026-10-26: What happens when a ticker is missing from `companyNames`: the card falls back to
  `cleanIssuer`, and the fix is adding the name to the list in `lib/content.ts`.
- 2026-10-27: Why a production build shows changes the dev server didn't: `npm run build`
  redraws everything from the current code, while the dev server served a saved render of a
  prerendered route. (Nuance added: `next dev` normally redraws per request; prerendered
  routes were the exception.)
- 2026-10-27: Why a chosen card design reaches every post type: all cards are drawn by
  `renderCard()` in `app/kaart/shell.tsx`, so the design changes in one place.
- 2026-10-27: Why Kwartaalseizoen shows only "nieuw" and "helemaal verkocht": after a stock split
  the share count jumps without a purchase, so "bijgekocht" would be false.

## Can do myself

## Shaky
- 2026-10-26: How new data reaches prerendered pages. Knew to run the 13F ingest first, but not
  that the live cards only change after commit → push → Vercel rebuild, because they're drawn
  at build time. Ask again after the first real quarterly update.
  - 2026-10-27, still shaky: asked what must happen between the morning ingest and the 15:00
    post, answered "npm run build". That only builds on the laptop; the live site needs commit →
    push → Vercel build. Knew that the live preview would show old data without it.
- 2026-10-28: Stateless approval (step 4). Thought a tap on an outdated proposal would post the new
  data. In fact the fingerprint differs, so nothing is posted and a fresh proposal is sent:
  approving means approving exactly what you saw.
- 2026-10-28: Why the webhook always answers Telegram with 200. Answered about who checks what
  (approver list vs. X). Missed that Telegram re-sends a tap after any non-200 answer, which could
  trigger a second posting attempt (idempotency).
- 2026-10-27: Why `/voorvertoning` renders per visit (ƒ) while the cards are built once (●).
  Answered that code changes wouldn't show up. In fact every commit rebuilds; the real problem
  is that the date changes without a commit, so a built-once preview goes stale. Also thought
  the preview page sends posts; it only displays them, and the Telegram job will call
  `lib/posts.ts` itself. Related to the entry above.
