# TODO

Open work and points of attention. Decisions and their reasons live in
[docs/decisions.md](docs/decisions.md); this file only says what still has to happen.
Remove an item once it's done.

## Phase 1: X content engine (deadline: Q3 13F filings, ~16 Nov 2026)

### Live by ~16 Nov
- [ ] Card renderer: one shared three-layer shell (band, data block, footer) with `ImageResponse` from `next/og`
- [ ] Topbelegger van de week (data already exists)
- [ ] Kwartaalseizoen: keep the previous quarter's 13F next to the current one so we can diff (watch out for stock splits)
- [ ] Wall Street gisteren: needs a price-data provider (commercial licence, see below) and a US market holiday calendar
- [ ] Telegram approval flow: scheduled job → preview in Telegram → "Plaats" / "Overslaan" → post via X API
- [ ] Readable company names: an automatic clean-up plus a hand-kept override list
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
- [ ] **Create the X account and an X developer account** with pay-per-use billing.
  Use a shared team email with 2FA, not anyone's personal account. The access tokens
  let our code post as the brand.
- [ ] **Price-data budget.** Claude prepares a comparison of providers whose terms allow
  public display; the team decides. Wall Street gisteren and the real ticker are blocked until then.
- [ ] Create the Telegram bot (via BotFather) and the approval group; collect the approvers' Telegram user IDs.
- [ ] Pick the newsletter service.

### Open questions
- [ ] Card design: decide by looking at the first rendered cards, including whether the skyline goes.
- [ ] Moonshot tagline "Enorme potentie" reads as advice. Replace it with something neutral.

## Before the site and the X account go public (together, ~16 Nov)
- [ ] **TE CONTROLEREN** in `lib/content.ts` (Sam does this): investor style, horizon and
  summaries are LLM drafts with no source. Verify each one against a statement or filing,
  with platform and date, or remove it. Also check whether Mandel (Lone Pine) still counts as active.
- [ ] Sam's bio on /over-ons is invented placeholder text.
- [ ] X account: set the "Automated" label, and decide who owns the developer account and its billing.
- [ ] Keep links out of posts (they cost $0.20 each through the API and lower reach). Put the site link in the bio.

## Carried over from docs/handover.md
- [ ] Readable company names. SEC names are raw ("COCA COLA CO"). The company table fixes this.
- [ ] NEW HOLDINGS amendments to a 13F are reported but not merged.
- [ ] `data/13f.json` ends up in an unused client chunk (harmless; public data).
- [ ] Lint warning: unused `Team` in `app/over-ons/page.tsx`.
