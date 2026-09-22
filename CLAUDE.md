@AGENTS.md

# De Amerikabelegger

Dutch-language site aggregating US finfluencer commentary on American stocks.
Categories: Giants, Growers, Moonshots.

## Stack
Next.js (App Router), TypeScript, Tailwind. Deployed on Vercel.

## Architecture rules
- All content access goes through `lib/content.ts`. Pages never read the
  filesystem or call a database directly. This exists so the source can
  become Supabase later without touching any page.
- Exported types live beside their data in `lib/content.ts` — a type gets a
  name when another file must speak it (`CategorySlug`, `Investor`), otherwise
  it stays inline on the const. Treat those types as the eventual database
  schema, not as mock-data convenience. There is no `lib/types.ts`.
- Server Components by default. Add "use client" only when a component
  needs state, effects, or browser APIs.

## Code style
- No abstraction until a pattern appears three times.
- No component files under ~15 lines — inline it instead.
- No new dependency without saying what it replaces and why it's worth it.
- Prefer deleting code over adding flags to it.

## Don't
- No barrel files (`index.ts` re-exports).
- No state management library. useState and server components are enough.
- No CSS files beyond globals.css. Tailwind classes only.