# Decisions

One entry per meaningful decision: what we chose, what we didn't, and why.
Earlier decisions about the 13F ingest are in [handover.md](handover.md).

## 2026-10-22: Phase 1 launch scope
**Chose:** Topbelegger van de week, Kwartaalseizoen and Wall Street gisteren live by ~16 Nov. Giant, Grower and Moonshot after that. Week vooruit and alerts later still.
**Instead of:** all eight formats by the deadline.
**Why:** the Q3 13F filings (deadline rolls from Sat 14 Nov to Mon 16 Nov) are the content peak. Topbelegger runs on data we already have. Every other format needs a new data source.

## 2026-10-22: A person approves every post at launch
**Chose:** each post is sent to Telegram with "Plaats" / "Overslaan" buttons. Approving is posting, so posts go out when someone taps, not at exactly 07:30 or 15:00.
**Instead of:** fully automatic (the original plan), a veto window, a password-protected preview page, or email approval.
**Why:**
- A wrong number under the brand is worse than a late post.
- Telegram gives a push notification and works on a phone, and phase 2 already plans Telegram approvals.
- Making approval the same moment as posting means nothing has to be stored in between, so no database is needed.
**Revisit:** switch to fully automatic once the output is trusted (tracked in TODO.md).

## 2026-10-22: Templates, not AI, write the post text in phase 1
**Chose:** fixed sentences with the numbers filled in, with a few variants per format.
**Instead of:** Claude writing the text, with or without a news source.
**Why:**
- Each post has very little data (a name, a percentage, a holder count), so there's little for AI to add.
- Templates can't invent facts or slip into investment advice, so the plan's safety checks hold by construction.
- The "why did it move" line ("Zorgen over chipexport…") is dropped: price data can't explain a move.
- AI comes in with phase 2, when there is real text to work with.

## 2026-10-22: No Supabase in phase 1
**Chose:** JSON committed in the repo, prices fetched live, and the "van de week" picks rotated by week number.
**Instead of:** setting up Supabase now.
**Why:** phase 1 stores almost nothing that can't be recomputed. A database adds a schema, keys and security rules under deadline. `lib/content.ts` keeps the later switch cheap.

## 2026-10-22: Stay on Vercel Hobby for now
**Chose:** Hobby (free).
**Instead of:** Pro (~$20/month, per-minute cron precision).
**Why:** while a person approves each post, it doesn't matter that Hobby's scheduled jobs fire anywhere within the hour.
**Revisit before fully automatic posting.** Hobby is also meant for non-commercial use.

## 2026-10-22: Monday's morning post covers Friday
**Chose:** a morning post Mon–Fri, each about the previous US session. Monday's is labelled "Wall Street vrijdag". US market holidays skip a day.
**Instead of:** posting Tue–Sat so the label always reads "gisteren".
**Why:** this keeps the plan's weekday rhythm with an honest label.

## 2026-10-22: "Grootste beweger" is the biggest mover in the S&P 500
**Chose:** the S&P 500. Index moves are shown through ETFs (SPY, QQQ), labelled as such, unless we pay for index data.
**Instead of:** our own company list, or every stock the 30 topbeleggers hold.
**Why:** these are familiar names, and a top mover among them is real news. It needs a price API that returns every closing price in one call.

## 2026-10-22: Newsletter signup only, through a hosted tool
**Chose:** collect addresses with a hosted service, linked from the X bio and the site. No sending automation yet.
**Instead of:** no newsletter, or a full automated weekly email.
**Why:** this starts building the list from day one at almost no build cost. Which service is still open.

## 2026-10-22: The site goes public with the X account, ~16 Nov
**Chose:** launch both together.
- The empty pages (Giants, Growers, Moonshots, Influencers, Modelportefeuilles) stay visible with a "binnenkort" note.
- The media gallery stays, labelled visibly as an example.
- The ticker gets real end-of-day prices, with a date.
- Sam verifies the TE CONTROLEREN investor texts personally; whatever can't be sourced is removed.
**Instead of:** hiding the empty pages, removing the gallery, or launching the profiles without summaries.
**Why:** the site gives X readers somewhere to go. Showing invented content as real is the one thing the "De bron staat erbij" promise rules out, so placeholders must say what they are.

## 2026-10-22: Readable company names by cleaning plus an override list
**Chose:** code tidies the SEC names (title case, strip Inc/Corp and similar), and a small hand-kept list fixes the ones that still read badly. The Telegram approver catches new ugly names.
**Instead of:** a fully hand-curated table (hundreds of entries), or tickers only on the cards.
**Why:** this is readable for a Dutch audience with little manual work, and it grows into the company table the categories need.

## 2026-10-22: Post cards follow the site's style guide, not the PDF mockups
**Chose:** the site's tokens and fonts (Libre Franklin, Bodoni, ink, paper, brass, seal, and the three category colours). The format colours map to those tokens, so Moonshots are burnt orange, not purple.
**Instead of:** the PDF mockups' white background, Inter-like sans and own colour set.
**Why:** the mockups were a sketch, and readers coming from X should recognise the site. The style guide allows four ornament devices, so the skyline background probably goes. Sam decides by looking at rendered cards.

## 2026-10-22: Telegram approval happens in a team group
**Chose:** a group with the bot and team members. Whoever taps first decides.
**Instead of:** a private chat with Sam only.
**Why:** spreads the twice-daily task. The bot only accepts taps from an allowlist of Telegram user IDs.

## 2026-10-22: The 13F ingest runs by hand during the first quarter season
**Chose:** Sam runs `ingest.py` each morning from about 12 to 27 Nov, reviews the diff, and commits. Vercel redeploys.
**Instead of:** a scheduled GitHub Action from the start.
**Why:** one less moving part before the deadline, and Sam learns the flow first. Automate it afterwards (tracked in TODO.md).

## 2026-10-26: Post cards are route handlers drawn with ImageResponse
**Chose:** one URL per card (`/kaart/topbelegger/[slug]`), drawn by `ImageResponse` from `next/og` and prerendered for all 30 at build time. One shared shell (`app/kaart/shell.tsx`) holds the band, footer, colours and fonts.
**Instead of:** rendering a normal page with Tailwind and screenshotting it with Playwright (as `tools/post-mockups/render.mjs` does).
**Why:** no headless browser is needed where the posts are made, and it's built into Next.js. The price is a copy of the colour tokens in `shell.tsx` and font files in `assets/fonts/`, both recorded in the style guide.

## 2026-10-26: Company names are keyed by ticker, and share classes merge on that name
**Chose:** `companyNames` in `lib/content.ts`, keyed by ticker, seeded with every ticker in anyone's top five. Anything missing falls back to automatic clean-up. `topPositions` merges holdings that map to the same name (GOOG + GOOGL → Alphabet).
**Instead of:** an override list keyed by the filed name, or merging on the issuer code (the first 6 characters of the CUSIP).
**Why:** one company is filed under several names (Mastercard appears three ways). The issuer code would wrongly merge different ETFs from one fund family (iShares, Vanguard).

## 2026-10-26: Topbelegger cards show the style group
**Chose:** "firm · style group" under the name (e.g. "Pershing Square · Activisme en bijzondere situaties").
**Instead of:** leaving style off until the TE CONTROLEREN check is done.
**Why:** Sam's call. A wrong label gets caught in the Telegram approval step, and Sam is verifying the styles before launch anyway.

## 2026-10-26: The card band shows the quarter, not the posting date
**Chose:** "Q2 2026" on the right of the band.
**Instead of:** the posting day ("VR 9 OKT"), as in the PDF mockups.
**Why:** a posting date would make every card depend on the day it's posted, so cards couldn't be prerendered. X already shows when something was posted, and the quarter is the date that matters for the data.

## 2026-10-27: Post cards get a price line, a skyline and phone-sized type
**Chose:** version B from the demo:
- type about three times the site scale, so the card is readable at the ~400 px X shows on a phone
- a fixed background line in short runs, green where it rises and red where it falls
- a hand-drawn skyline (Golden Gate to the Statue of Liberty) in the format's colour

All three are written into the style guide as card-only exceptions.
**Instead of:** the plain card that followed the site's style guide (too "boring and professional" to stop a scroll), or version A with site-sized type (illegible on a phone).
**Why:** a card on X has a second to make someone stop.
**Trade-off we accepted:** the style guide banned chart-going-up imagery because it can suggest returns. The line is decorative, never real data, and shows falls as well as rises. Every figure on the card still comes from the data.
**Details:** text that crosses the line sits on a patch of paper, because the engine doesn't draw `textShadow`. Names shrink when the longest word has more than seven letters ("Cooperman"), so they never run under the positions panel.

## 2026-10-27: The X handle is @amerikabelegger
**Chose:** @amerikabelegger, secured by Sam on a newly created account. That account becomes the brand account (shared team email, 2FA) rather than being renamed.
**Instead of:** renaming it and claiming the handle again on a fresh brand account.
**Why:** renaming frees the handle, and anyone could take it before the new account claims it.

## 2026-10-27: One catalogue of post types, in code
**Chose:** `postTypes` in `lib/posts.ts` lists all eight post types with their band label, colour, slot and status. The card routes and `/voorvertoning` read from it. The look of every card stays in one place, `renderCard()` in `app/kaart/shell.tsx`, so the card design the team picks applies to all types at once. Types that aren't built yet get a blank card (`/kaart/leeg/[type]`) in the preview.
**Instead of:** a document (`docs/post-types.md` or a shared Google Doc) describing each post type.
**Why:** a document describes what we intend to post, the code what we actually post, and the two drift apart. The preview page is the readable view for the team, and it's generated from the same table, so it can't drift.
**Vocabulary:** *post type* is Topbelegger, Kwartaalseizoen and so on. *Card design* is the look (the ten variants the team is comparing).
**Also:** `Post` and `postTypes` live in `lib/posts.ts`, not `lib/content.ts`. A post isn't stored content but something computed from it. CLAUDE.md's "types live in lib/content.ts" covers stored content.

## 2026-10-27: Topbelegger post text
**Chose:** a fixed template, every number from the data:
```
Topbelegger van de week: Bill Ackman (Pershing Square).

Top 3 van 14 aandelenposities (samen 37%):
Uber 12,7%
Brookfield 12,6%
Microsoft 11,9%

Bron: 13F over Q2 2026, ingediend bij de SEC op 14 augustus 2026.

$UBER $BN $MSFT
```
- Three opening lines, picked by week number so consecutive weeks differ. With 30 investors, each investor always gets the same one.
- Cashtags yes. When a post would go over 280 characters, it drops them (the only optional part).
- No disclaimer in the post. "Geen beleggingsadvies" goes in the X bio.
- No emoji, no links, no pronouns for investors.
- The position count matches the profile page (every share class counts). The top three merge share classes, like the card.
**Instead of:** the plan's draft, which had a separate "Samen 37% van een portefeuille van 14 aandelen" line and a longer opening. That came to 266–322 characters. Now it's 204–276.
**Why:** X's limit is 280. The source line stays complete, because "De bron staat erbij" is the promise.

## 2026-10-27: Topbelegger rotation
**Chose:** a hand-ordered list in `lib/posts.ts`, starting Friday 13 Nov 2026 (likely, subject to change). Well-known names first, never the same style group two weeks running. A check stops the build if the list doesn't hold every investor exactly once.
**Instead of:** an automatic interleave by style group.
**Why:** one readable list that the team can reorder by hand. The order is Claude's draft.

## 2026-10-27: The preview page is unlinked and noindex
**Chose:** `/voorvertoning`, rendered on every visit, not linked from the site, with `robots: noindex`.
**Instead of:** a password (environment variables and a `proxy.ts`).
**Why:** it shows only public 13F data. The real approval happens in Telegram.

## 2026-10-27: The weekly schedule
**Chose (from the content plan, open to change):** Wall Street gisteren Mon–Fri at 07:30. At 15:00: Week vooruit on Monday, Giant van de week on Tuesday, Grower on Wednesday, Moonshot on Thursday, Topbelegger on Friday.
**Kwartaalseizoen:** four times a year, for two weeks after the 13F deadline, it takes the Mon–Thu 15:00 slots ("Wat kochten en verkochten de topbeleggers?"). Topbelegger keeps Friday and shows the newest quarter.
**Instead of:** pausing the Topbelegger rotation during the season.
**Why:** the weekly Topbelegger rhythm continues, and the Friday post picks up the fresh filings anyway.

## 2026-10-27: Kwartaalseizoen shows only "nieuw" and "verkocht"
**Chose:** positions that are new this quarter or fully sold.
**Instead of:** also "bijgekocht" and "afgebouwd".
**Why:** those compare share counts, and a stock split looks exactly like a large purchase. Without split data that would say something false. Comparing weights instead mixes trading with price moves. New and sold are plain yes/no facts.

## 2026-10-27: Kwartaalseizoen post text and order
**Chose:**
```
Wat kocht en verkocht Howard Marks (Oaktree Capital Management)?

Nieuw:
Sea Limited 1,6%
Viasat 1,5%
MakeMyTrip 1,4%
en nog 7 kleinere

Helemaal verkocht:
Petrobras
Nokia
CBL & Associates
en nog 8 kleinere

Bron: 13F over Q2 2026, ingediend bij de SEC op 14 augustus 2026.
```
- Three names per list. If the post goes over 280, it tries two, then one, each time with cashtags first. The card always shows three.
- **Order:** on-time filers with at least one change, in rotation order (well-known names first, confirmed by Sam), then late filers by filing date. It follows from the data alone, because nothing records what was posted.
**Instead of:** the plan's draft opening "Wat kochten en verkochten de topbeleggers? Vandaag: …" with the quarter in each heading. That came to 19 of 28 posts over 280.

## 2026-10-27: Two quarters only count as comparable when their totals are within a factor of three
**Chose:** `ingest.py` stores `previous: null` and prints SKIPPED when the totals differ more than threefold.
**Instead of:** a special case for Ackman, or a list of former filer CIKs per investor.
**Why:** Pershing Square Inc. (the CIK we follow) filed only its Howard Hughes stake for Q1 2026 ($569M), while Pershing Square Capital Management filed the rest. Comparing them would have reported 13 positions Ackman already held as "nieuw". The rule also catches the next filer reorganisation. Across all 30, the next-largest change from Q1 to Q2 was Loeb at 2.25×.

## 2026-10-27: Changes are matched on company name, then ticker, then CUSIP
**Chose:** the key from `companyNames` (so share classes are one company), otherwise the ticker, otherwise the CUSIP. `topPositions` uses the same key, so the cards are unchanged.
**Instead of:** the cleaned issuer name, which a filer can spell differently from one quarter to the next.
**Watch for:** a different security of a company already held, like Alphabet's preferred depositary shares (GOOGM/GOOGN) next to its common stock. It needs its own name in `companyNames` ("Alphabet (preferent)"), or the post says the company is new.
