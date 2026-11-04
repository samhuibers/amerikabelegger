# De Amerikabelegger

A Dutch-language site and X account (@amerikabelegger) about American stocks: what well-known US
investors hold, taken from their public SEC filings, always with the source. Categories: Giants,
Growers, Moonshots. Built by Sam (Huibers Labs) with coding agents; three partners decide on
content and design.

**Status (Nov 2026):** phase 1, the X content engine. It launches around 13–16 Nov 2026.

**Read first:**
- [CLAUDE.md](CLAUDE.md): architecture and code-style rules.
- [AGENTS.md](AGENTS.md): how to work with Sam. Sam runs all git commands, and new dependencies need an OK first.
- [TODO.md](TODO.md): what is open.

## Stack
Next.js 16 (App Router; the APIs differ from older versions, so read `node_modules/next/dist/docs/`
before writing code), React 19, TypeScript, Tailwind 4. Deployed on Vercel (Hobby). There is no
database; data is JSON in the repo. **npm only**: `pnpm` breaks `node_modules` here.

```
npm run dev                      # local site on :3000
npm run build && npx next start  # check posts and cards against a production build
npm run lint
node --test lib/*.test.mjs       # OAuth signature test for X
```

## Where things are
| Path | What |
|---|---|
| `lib/content.ts` | **All content access.** Investors (30), categories, copy, 13F reading (`getPortfolio`), company names (`companyName`, `companyNames`, `cleanIssuer`). Its exported types are the future database schema. |
| `lib/posts.ts` | Post types (`postTypes`), post text templates, Topbelegger rotation, Kwartaalseizoen, `todaysPost`, `postFingerprint`. |
| `lib/x.ts`, `lib/telegram.ts` | Small API clients written in-house (OAuth 1.0a for X, plain fetch for Telegram). |
| `lib/format.ts` | Dutch number, date and percentage formatting. Figures are never formatted inline. |
| `data/13f.json` | Two quarters of 13F holdings per investor. Written only by the ingest script and committed. |
| `tools/13f/ingest.py` | Pulls 13F filings from SEC EDGAR, run by hand (Python venv). See handover.md. |
| `app/` pages | Home, `/giants` `/growers` `/moonshots` (placeholders), `/topbeleggers` + `/[slug]` (portfolios), `/influencers` and `/modelportefeuilles` (placeholders), `/over-ons`, `/styleguide`. |
| `app/voorvertoning` | Unlinked, noindex preview of the coming posts with card and text. |
| `app/kaart/*` | Post card PNGs (`ImageResponse`). One look for every type in `shell.tsx` + `backdrop.tsx`. |
| `app/api/voorstel` | Cron route: sends today's post to the Telegram group as a proposal. |
| `app/api/telegram` | Webhook: an approver's tap posts to X. |
| `assets/fonts/` | TTFs for the card renderer. The site itself loads fonts with `next/font`. |

## How a post goes out
1. **The quarterly data.** `ingest.py` updates `data/13f.json`. Commit and push, and Vercel rebuilds; the cards are prerendered at build time.
2. **The proposal.** A Vercel cron (`vercel.json`, weekdays 12:00–12:59 UTC) calls `/api/voorstel`. That route calls `todaysPost()` and sends the card and text to Telegram with "Plaats" / "Overslaan" buttons.
3. **The tap.** `/api/telegram` checks the secret, the group and the approver. It recomputes the post and posts only if it's for today and the fingerprint is unchanged. It removes the buttons first, so nothing posts twice.

Secrets live in Vercel environment variables and in `.env.local` (git-ignored). Their names are in handover.md.

## Notes (docs/)
| File | Use it for |
|---|---|
| `TODO.md` | Open work. Remove an item once it's done. |
| `docs/decisions.md` | Every meaningful choice: chosen, rejected, why. Check it before changing direction. |
| `docs/handover.md` | Running things: the 13F ingest, posting, adding approvers, error messages. |
| `docs/build-log.md` | What each step delivered, in plain language for the partners. |
| `docs/step-4-design.md` | Design record of the Telegram → X flow. |
| `docs/STYLE_GUIDE.md` | Visual rules and recorded deviations. The palette is fixed. |
| `docs/glossary.md`, `progress.md` | Terms explained for Sam, and what Sam has shown to understand. |
| `docs/thirty_investors.md` | Unverified AI draft behind the investor texts (see TE CONTROLEREN in `lib/content.ts`). |

## House rules that shape the code
- **"De bron staat erbij":** every figure comes from data, with its source. Never invent facts, never give investment advice, and never imply our own research. Placeholders must say what they are.
- **Post text comes from fixed templates, not AI.** It stays under 280 characters and has no links, no emoji and no disclaimer.
- **Gotcha:** the repo sits in iCloud-synced `~/Documents`, so `.next` can collect `* 2.*` copies or `ENOTEMPTY` errors. Delete `.next` and rebuild.
