# TODO

Open work and points of attention. Decisions and their reasons live in
[docs/decisions.md](docs/decisions.md); this file only says what still has to happen.
Remove an item once it's done.

**Next session: start with [docs/plan-step-2.md](docs/plan-step-2.md)** (post text and the
preview page; draft, waiting for Sam's OK).

## Phase 1: X content engine (deadline: Q3 13F filings, ~16 Nov 2026)

### Live by ~16 Nov
- [ ] Topbelegger van de week: post text and weekly rotation (step 2; the card itself is done)
- [ ] Kwartaalseizoen: keep the previous quarter's 13F next to the current one so we can diff (watch out for stock splits)
- [ ] Wall Street gisteren: needs a price-data provider (commercial licence, see below) and a US market holiday calendar
- [ ] Telegram approval flow: scheduled job → preview in Telegram → "Plaats" / "Overslaan" → post via X API
- [ ] Company names: extend `companyNames` in `lib/content.ts` whenever an ugly fallback name shows up (top five is covered)
- [ ] Homepage ticker: real end-of-day prices with a date, replacing `tickerRows`
- [ ] Media gallery: a visible "voorbeeld" label
- [ ] Empty pages (Giants, Growers, Moonshots, Influencers, Modelportefeuilles): a "binnenkort" note
- [ ] Newsletter signup: pick a hosted service and link it from the X bio and the site

### During the first quarter season (~12–27 Nov)
- [ ] Sam runs `tools/13f/ingest.py` by hand every morning, reviews the diff and commits

### After launch
- [ ] Giant, Grower and Moonshot van de week (needs the company table with categories)
- [ ] Week vooruit (needs an earnings calendar and a hand-kept macro calendar)
- [ ] Alerts on 13D/13G filings (needs EDGAR polling; rare for most of the 30)
- [ ] Automate the daily 13F ingest during quarter season (for example a scheduled GitHub Action)
- [ ] Newsletter: automatic sending

### Decisions to revisit
- [ ] **Switch from human approval to fully automatic posting** once the output is trusted.
  We chose approval for the launch (22 Oct 2026). Before switching: upgrade Vercel to Pro
  (Hobby cron fires anywhere within the hour) and decide what happens when nobody is
  there to catch a mistake.
- [ ] Vercel Hobby → Pro. Hobby is meant for non-commercial use, and its cron timing is
  imprecise. Required before fully automatic posting.
- [ ] Supabase: deferred to phase 2.

### Waiting on the team (start now, these block the build)
- [x] Handle **@amerikabelegger** secured (27 Oct 2026), for now on an account Sam created.
- [ ] **Make that account the brand account:** switch it to a shared team email, turn on 2FA,
  set the display name and photo. Don't rename it to free the handle for a new account:
  anyone could claim @amerikabelegger in between.
- [ ] **Create the X developer account** with pay-per-use billing, attached to the brand
  account. The access tokens let our code post as the brand.
- [ ] **Price-data budget.** Claude prepares a comparison of providers whose terms allow
  public display; the team decides. Wall Street gisteren and the real ticker are blocked until then.
- [ ] Create the Telegram bot (via BotFather) and the approval group; collect the approvers' Telegram user IDs.
- [ ] Pick the newsletter service.

### Open questions
- [ ] `package.json`: `next` moved from the exact `16.3.4` to `^16.4.3` (uncommitted, made outside our sessions).
  Decide whether to keep the caret, and bump `eslint-config-next` to match.
- [ ] Profile pages still show names as filed ("COCA COLA CO"). Switch them to `companyName()`?
- [ ] Moonshot tagline "Enorme potentie" reads as advice. Replace it with something neutral.

## Before the site and the X account go public (together, ~16 Nov)
- [ ] **TE CONTROLEREN** in `lib/content.ts` (Sam does this): investor style, horizon and
  summaries are LLM drafts with no source. Verify each one against a statement or filing,
  with platform and date, or remove it. The style group also appears on the Topbelegger
  cards. Also check whether Mandel (Lone Pine) still counts as active.
- [ ] Sam's bio on /over-ons is invented placeholder text.
- [ ] X account: set the "Automated" label, and decide who owns the developer account and its billing.
- [ ] Keep links out of posts (they cost $0.20 each through the API and lower reach). Put the site link in the bio.

## Carried over from docs/handover.md
- [ ] NEW HOLDINGS amendments to a 13F are reported but not merged.
- [ ] `data/13f.json` ends up in an unused client chunk (harmless; public data).
- [ ] Lint warning: unused `Team` in `app/over-ons/page.tsx`.
