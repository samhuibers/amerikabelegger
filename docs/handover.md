# Handover: 13F ingest

State on 24 September 2026. The work is on branch `13f-ingest` (commit `dcc8eb0`), pushed to GitHub and **not yet merged into `main`**.

## What exists now

Each of the 30 topbeleggers now has their latest 13F filing (Q2 2026) stored in the repo, and pages can read it through `lib/content.ts`. The profile pages don't show the holdings yet; that's the next job.

- **[tools/13f/ingest.py](../tools/13f/ingest.py):** pulls each investor's latest 13F-HR from SEC EDGAR into `data/13f.json`. It runs by hand, never in the Vercel build.
- **[data/13f.json](../data/13f.json):** the output, committed. It holds 1,489 holdings across 30 investors. Git history is the archive of past quarters.
  - *Since 27 Oct 2026:* two quarters per investor, `{ latest, previous }`, for Kwartaalseizoen. `previous` is the quarter right before `latest` (or `null`). The script prints a `previous <date>: new / unchanged / none` line per investor.
- **[lib/content.ts](../lib/content.ts):**
  - each `Investor` gains a `cik` (the SEC number of whoever files the 13F)
  - new types `Portfolio` and `Holding`
  - `getPortfolio(slug)` and `getLatestQuarter()`
  - a `thirteenF` const with the one-sentence explanation
  - the hand-set `filings` quarter is gone
- **`/topbeleggers`** reads its quarter ("Q2 2026") from the data.

## Running the quarterly update

Run it the day after each 13F deadline: around **15 Feb, 16 May, 15 Aug and 15 Nov**. The next one is **~15 November 2026**, for Q3. Re-running at any time is safe: an unchanged filing leaves the file byte-identical, so you can also run it to catch late filers and amendments.

The first time on a machine, create the Python environment (`tools/13f/.venv` is gitignored):

```
python3 -m venv tools/13f/.venv
tools/13f/.venv/bin/pip install edgartools==5.58.0
```

Each quarter:

```
EDGAR_IDENTITY="Your Name you@example.com" tools/13f/.venv/bin/python tools/13f/ingest.py
```

SEC requires every request to name a person, so the email is set at runtime and never committed. The script prints one line per investor:
- **status:** `new`, `unchanged`, `STALE` or `FAILED`
- **filer name, period, filing date, number of rows and total value**

A failure keeps that investor's previous data and makes the script exit with an error. Review the `git diff` on `data/13f.json` and commit it.

### During Kwartaalseizoen (added 27 Oct 2026)

Each morning of the season:
1. Run the ingest as above.
2. Check the `previous` lines:
   - `new` or `unchanged` is fine.
   - `SKIPPED` means the two quarters' totals differ more than threefold, so the comparison was dropped (like Ackman's Q1 2026). Check on sec.gov whether the filer changed.
3. Look at the Kwartaalseizoen section of `/voorvertoning` against a production build (`npm run build && npx next start`). Look for ugly company names ("Occidental Pete") and add each one to `companyNames` in `lib/content.ts`, keyed by ticker.
4. Commit `data/13f.json` and any new names. Vercel redeploys, so the 15:00 post uses the new data.

## Decisions already made (don't reopen)

- **The roster lives only in `investors` in `lib/content.ts`.** The script reads it through Node and keeps no list of its own. To add an investor, add the entry with a CIK; to remove one, delete the entry, and their data is dropped on the next run. Companies are never an input.
- **The filer isn't always the firm on the page.** The site keeps the familiar name:
  - Einhorn → DME Capital Management
  - Ackman → Pershing Square Inc.
  - Cooperman → his own filer (the site keeps "Omega Advisors")
  - Nygren → Harris Associates
  - Smith → Fundsmith LLP (Fundsmith Investment Services Ltd. is ignored)
- **Firm-wide filings are fine.** Nygren, Marks and Rogers represent their firm.
- **No caveats about what a 13F leaves out.** The site's name already says it's about American shares. One sentence explains what a 13F is (`thirteenF`, still a draft Sam may reword).
- **How the profile page shows the holdings** is recorded in the doc comment on `Portfolio`:
  - heading "Portefeuille" with a source line
  - weights over shares only
  - options and bonds in their own section
  - options never get a percentage
  - a mix line at the top only when the investor holds options or bonds
- **Tickers:**
  - edgartools' ticker first.
  - For gaps: SEC's live ticker list for US rows. Convertible bonds take the issuer's stock ticker.
  - OpenFIGI's home exchange for foreign shares (`HEIO` · Amsterdam).
  - Nothing is guessed. Two rows stay empty on purpose: Sunbelt Rentals (malformed CUSIP in the filing) and Redfin (acquired in 2025).

## Next up

1. ~~**Merge `13f-ingest` into `main`.**~~ Done 25 September 2026 (fast-forward).
2. ~~**Profile-page design pass.**~~ Done 25 September 2026. Sam picked the strip with a two-column ledger below it from three rendered treatments. The choice is recorded in the `Portfolio` doc comment.
3. **Readable company names.** SEC's names are raw ("COCA COLA CO", "STATE STR SPDR S&P 500 ETF"). The proper fix is the company table that the Giants, Growers and Moonshots categories will need anyway.
4. **The TE CONTROLEREN note in `lib/content.ts`** still stands. Style, horizon and summaries need a source before publication. Also check whether Mandel (Lone Pine) still counts as active.

## Known limits and gotchas

- **This project uses npm, not pnpm.** `pnpm dev` starts an install that restructures `node_modules` and leaves `pnpm-lock.yaml` and `pnpm-workspace.yaml` behind. If it happens again, delete those two files and run `npm ci`.
- **NEW HOLDINGS amendments aren't merged.** Such an amendment adds positions that were previously confidential. The script reports it and skips it, which is rare enough for now.
- **The holdings JSON sits in an unused client chunk.** `components/site-header.tsx` is a client component that imports `lib/content.ts`, so the build emits the JSON as a lazy chunk. No page loads it, but the file is deployed. It's public SEC data, so it's harmless.
- **Lint:** the only warning, an unused `Team` in `app/over-ons/page.tsx`, came before this work.

## Posting to X (since step 4, 27 Oct 2026)

**How it runs:**
1. Every weekday a Vercel cron job (`vercel.json`) calls `/api/voorstel` between 12:00 and 12:59 UTC, which is 13:00–15:00 in Amsterdam.
2. If there's a post today (`todaysPost` in `lib/posts.ts`), it goes to the Telegram group "Amerikabelegger beheer" as a proposal, with "Plaats" and "Overslaan" buttons.
3. A tap calls `/api/telegram` (the webhook). "Plaats" uploads the card to X and posts it, then the Telegram message says who posted it and when, with a link.

**Environment variables** (Vercel → Settings → Environment Variables, Production; locally in `.env.local`, which git ignores):
- `CRON_SECRET`, `TELEGRAM_WEBHOOK_SECRET`: random strings. Make one with `openssl rand -hex 24`.
- `TELEGRAM_BOT_TOKEN`: from BotFather.
- `TELEGRAM_CHAT_ID`: the group, a negative number.
- `TELEGRAM_APPROVERS`: Telegram user IDs, comma-separated.
- `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`: from the X developer portal, generated with "Read and write" permissions.

A changed variable only takes effect after a redeploy.

**Register the webhook once**, and again whenever the address or `TELEGRAM_WEBHOOK_SECRET` changes:
```
set -a; source .env.local; set +a
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" -d "url=https://amerikabelegger.vercel.app/api/telegram" -d "secret_token=$TELEGRAM_WEBHOOK_SECRET" -d 'allowed_updates=["callback_query"]'
```
The first line loads `.env.local` into the terminal session, so the secrets don't end up typed in your shell history.

**No proposal today?** The cron is "best effort" and isn't retried. Send it by hand:
```
curl -H "Authorization: Bearer $CRON_SECRET" https://amerikabelegger.vercel.app/api/voorstel
```
Add `?datum=2026-11-13` for another day's proposal, to test. Posting it is refused, because the webhook only posts proposals for today.

**What the messages mean:**
- *"Dit voorstel is al afgehandeld"*: someone else tapped first.
- *"de post is veranderd sinds dit voorstel"*: the data changed after the proposal (for example a morning ingest); a fresh proposal follows.
- *"Niet geplaatst: X …"*: X refused. A fresh proposal follows so you can retry. "duplicate content" means the post already exists.
- **Errors are in Vercel → Logs**, filtered on `/api/telegram` or `/api/voorstel`.
