# Progress

What Sam has actually learned, based on evidence: a check question answered, or something done without help. Hearing an explanation doesn't count.

## Can explain
- 2026-10-26: What happens when a ticker is missing from `companyNames`: the card falls back to
  `cleanIssuer`, and the fix is adding the name to the list in `lib/content.ts`.
- 2026-10-27: Why a production build shows changes the dev server didn't: `npm run build`
  redraws everything from the current code, while the dev server served a saved render of a
  prerendered route. (Nuance added: `next dev` normally redraws per request; prerendered
  routes were the exception.)

## Can do myself

## Shaky
- 2026-10-26: How new data reaches prerendered pages. Knew to run the 13F ingest first, but not
  that the live cards only change after commit → push → Vercel rebuild, because they're drawn
  at build time. Ask again after the first real quarterly update.
