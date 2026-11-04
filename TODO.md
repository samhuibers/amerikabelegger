# TODO

Open work and points of attention. Decisions and their reasons live in
[docs/decisions.md](docs/decisions.md); this file only says what still has to happen.
Remove an item once it's done.

What steps 1–4 built is in [docs/build-log.md](docs/build-log.md).

## Phase 1: X content engine (deadline: Q3 13F filings, ~16 Nov 2026)

The partner brief of 4 Nov 2026 (PDF, shared) put these to the partners: card design, rotation
order, brand account and billing, X profile, own domain, price data and the newsletter service.

### Card design (open with the partners)
- [ ] The partners are choosing between ten variants of the Topbelegger card
  ([Topbelegger-kaarten](https://claude.ai/artifact/9myUwdGuSE1YxNy2JuMLX3)). Ask two things
  separately: which *look* (background, colours, weight; it goes into `app/kaart/shell.tsx` and
  `backdrop.tsx`, so it applies to every post type) and, for Topbelegger only, which *layout*
  (04 Groot cijfer, 05 Strook and 10 Tweeluik change where the data sits).
- [ ] Today the post type's colour shows only as a faint skyline tint, so the blank cards in
  `/voorvertoning` differ mainly in their band. Consider a design that uses the type colour more.

### Post types: still undecided
These are `null` in `postTypes` in `lib/posts.ts`; the preview shows "nog niet bepaald".
- [ ] **Slot for Alerts:** the only slot still open (schedule in decisions.md, 27 Oct).
- [ ] **Colours:** Wall Street gisteren, Week vooruit, Alerts (they show in ink for now).
- [ ] **Band label for alerts:** "Alert" is a placeholder.

### Live by ~16 Nov
- [ ] **Launch Friday:** `ROTATION_START` in `lib/posts.ts` is Fri 13 Nov 2026 (likely, subject
  to change). Changing it changes who goes first.
- [ ] **Rotation order** in `lib/posts.ts` is Claude's draft. Sam and the partners review it.
- [ ] Wall Street gisteren and the homepage ticker: both depend on the price-data decision below.
  Without price data, the ticker (`tickerRows`, placeholder prices) comes off before launch.
  Wall Street gisteren also needs a US market holiday calendar.
- [ ] Company names: extend `companyNames` in `lib/content.ts` whenever an ugly fallback name shows up (top five is covered)
- [ ] Media gallery: a visible "voorbeeld" label

### During the first quarter season (~12–30 Nov; Kwartaalseizoen posts 17–30 Nov)
- [ ] Sam runs `tools/13f/ingest.py` by hand every morning, reviews the diff and commits.
  The routine is in [docs/handover.md](docs/handover.md), "During Kwartaalseizoen".
- [ ] **Run it on the morning of Tue 17 Nov at the latest**, so the on-time filers are all in
  before the first Kwartaalseizoen post. That fixes the order for the season.

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
- [ ] **Before phase 2 reads X posts:** update the use-case description in the X developer
  portal first (decisions.md, 27 Oct). Also check the per-read cost on pay-per-use, X's rules
  for showing posts off X and honouring deletions, and the current terms on using X content with AI.
- [ ] **Kwartaalseizoen covers 8 of the 30 investors per season** (one per Mon–Thu slot for two
  weeks). Fine for now (Sam, 27 Oct). Revisit: two investors per day, or a longer season.

### Waiting on the team (start now, these block the build)
- [x] Handle **@amerikabelegger** secured (27 Oct 2026), for now on an account Sam created.
- [x] X developer account created and Telegram bot @amerikabelegger_bot + group set up (27 Oct 2026).
- [ ] **Partners as approvers:** done on the Telegram side (all four in the group, four IDs in
  `.env.local`, webhook registered again; checked 4 Nov). Still to confirm: Vercel has the same
  four IDs. Test: send a proposal for another day (`?datum=`, handover.md) and let a partner tap.
- [ ] **Make that account the brand account:** switch it to a shared team email, turn on 2FA,
  set the display name and photo. Don't rename it to free the handle for a new account:
  anyone could claim @amerikabelegger in between.
- [ ] **Price data.** Sam proposes launching without it to keep costs low (partner brief, 4 Nov).
  If the partners agree: no Wall Street gisteren at launch, and the homepage ticker comes off
  until there's a licensed source. Otherwise Claude compares providers whose terms allow public display.
- [ ] Pick the newsletter service, then link it from the X bio and the site.
- [ ] **Own domain:** the team already owns one (probably amerikabelegger.nl; Sam hasn't seen it yet).
  Confirm the name and get access to the registrar, then connect it to the Vercel project before the
  X bio links the site. Follow-ups under "When the site gets its own domain".

## Before the site and the X account go public (together, ~16 Nov)
- [ ] **TE CONTROLEREN** in `lib/content.ts` (Sam does this): investor style, horizon and
  summaries are LLM drafts with no source. Verify each one against a statement or filing,
  with platform and date, or remove it. The style group also appears on the Topbelegger
  cards. Also check whether Mandel (Lone Pine) still counts as active.
- [ ] X account: decide who owns the developer account and its billing.
- [ ] X bio: the site link (own domain) and a short "Geen beleggingsadvies." Posts carry no
  disclaimer and no links (a link costs $0.20 per post through the API and lowers reach).
- [ ] **Homepage banner** (`banner-diner.jpg`, supplied by the client) shows a "Mel's Diner" sign,
  the name of a real US chain. Check it before going public (docs/IMAGE-CREDITS.md, "Banner").
- [ ] On the first real API post, check in the developer console that a post with cashtags was
  billed as a plain post ($0.015), not as a post with a URL ($0.20). X's pricing page names
  only URLs, but doesn't say. (The 29 Oct test post had no cashtags, so it doesn't answer this.)
- [ ] **Keep X credit topped up.** At zero, posting fails with 402 "credits depleted". Consider
  auto-recharge in the developer console, or a reminder.

## Carried over from docs/handover.md
- [ ] NEW HOLDINGS amendments to a 13F are reported but not merged.
- [ ] `data/13f.json` ends up in an unused client chunk (harmless; public data).

## When the site gets its own domain
- [ ] Register the Telegram webhook again with the new address (command in docs/step-4-design.md, §9).
- [ ] Update the website URL (and callback URL) in the X developer app.
