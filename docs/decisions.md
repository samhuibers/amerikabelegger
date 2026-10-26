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
