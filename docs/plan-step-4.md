# Plan: phase 1, step 4 — Telegram approval → X posting

*Written 27 October 2026. Status: **code built 27 October 2026; production test pending**. Sam
sets the environment variables, deploys, registers the webhook, then tests (see "How to verify",
3–5). How it runs day to day is in [handover.md](handover.md), "Posting to X".*

**Where the build differs from this plan:**
- `/api/voorstel` accepts `?datum=` (only with the secret) to send another day's proposal for
  testing. The webhook still posts only today's.
- The card URL in Telegram carries `?v=<fingerprint>`, because Telegram caches photos by URL.
- "Overslaan" also takes the button lock first, so it can't race a "Plaats".
- The signature test is in the repo (`lib/x.test.mjs`, Node's built-in runner, no dependency).
- Local tests stop before Telegram: Telegram can't fetch card images from `localhost`, so the
  real round trip is tested on production.

This file is the starting point for a fresh session. Read it, then [TODO.md](../TODO.md),
[decisions.md](decisions.md) and [build-log.md](build-log.md). CLAUDE.md and AGENTS.md apply as
always: plan → Sam's OK → build → recap → check question. Sam runs git.

## Where we are

1. ~~Card shell + Topbelegger card.~~
2. ~~Post text, `postTypes`, `/voorvertoning`.~~
3. ~~Kwartaalseizoen.~~
4. **Telegram approval → X posting.** ← this plan
5. Wall Street gisteren + real ticker (waits on the price-data budget).
6. Site launch items.

**Deadline:** the first real post is **Fri 13 Nov 2026** (Topbelegger, launch Friday likely). The
first Kwartaalseizoen post is Tue 17 Nov.

**Decided earlier** (decisions.md, 22 Oct):
- A person approves every post in a Telegram group with "Plaats" / "Overslaan".
- **Approving *is* posting**, so nothing is stored in between: no database.
- Vercel Hobby, whose scheduled jobs fire anywhere within the hour. That's fine while a person taps.

## Goal of step 4

On every posting day a preview (card + text + buttons) arrives in the team's Telegram group before
15:00. A tap on "Plaats" by an approver posts it on @amerikabelegger, card included. "Overslaan"
drops it. Only the 15:00 slot exists yet; the 07:30 slot follows with Wall Street gisteren (step 5).

## The flow, in the order it runs

```
Vercel cron (Mon–Fri)  ──GET /api/voorstel──▶  todaysPost(today)
                                                 │ nothing today → stop
                                                 ▼
                                    Telegram sendPhoto to the group:
                                    card + text + [Plaats] [Overslaan]
                                                 │
                         an approver taps ───────┘
                                                 ▼
Telegram  ──POST /api/telegram (webhook)──▶  checks: secret, group, approver,
                                              date is today, text unchanged
                                                 │
                              Overslaan ◀────────┼────────▶ Plaats
                    edit message:                │          remove buttons (the "lock"),
                    "Overgeslagen door Sam"      │          upload card to X, create post,
                                                 │          edit message: "Geplaatst door
                                                 │          Sam om 15:02" + link
```

## Design

### 1. The trigger: one Vercel cron job (`vercel.json`)

- **Schedule:** `0 12 * * 1-5`. Vercel schedules run in **UTC**, and Hobby fires anywhere within
  the hour, so the preview arrives between 13:00 and 14:59 in winter and between 14:00 and 14:59
  in summer. That's before 15:00 in both, without daylight-saving logic.
- The route checks `Authorization: Bearer $CRON_SECRET`, the header Vercel sends when the
  `CRON_SECRET` environment variable is set. Anyone else gets a 401.
- **Cron delivery is "best effort":** a run can be missed or come twice.
  - **Missed:** Sam can trigger the route by hand with `curl` and the secret (the command goes in
    handover.md).
  - **Twice:** two identical previews; see §4 for why that can't post twice.
- **Not chosen:**
  - Vercel Pro (~$20/month) for per-minute timing. Exact timing only matters once nobody approves.
  - An outside scheduler (GitHub Actions, cron-job.org). Another service, and GitHub's schedules
    are imprecise too.

### 2. Which post is today's: `todaysPost(date)` in `lib/posts.ts`

- **Mon–Thu in a season:** the Kwartaalseizoen post for that date (`seasonPosts` + `seasonDays`).
- **Friday from `ROTATION_START`:** the Topbelegger post.
- **Otherwise:** `null`, and nothing is sent. Week vooruit, Giant, Grower and Moonshot come later.

Plus `postFor(type, date)`, the same calculation for one type, which the webhook uses to rebuild a
post. `todaysPost` uses it too, so the preview and the posted version can't drift apart.

### 3. Stateless approval: the button carries the post's identity

Telegram's button data (`callback_data`, at most 64 bytes) holds
`plaats|kwartaalseizoen|2026-11-17|3f9a1c2e`: the action, the type, the date and **a short
fingerprint of the text and card** (the first 8 characters of a SHA-256 hash). The webhook
rebuilds the post with `postFor(type, date)` and only posts when:

- **the date is today** (Amsterdam). Yesterday's forgotten preview can't post late.
- **the fingerprint still matches.** If the data changed after the preview, for example a morning
  ingest deployed in between, the approver would otherwise post something they haven't seen. On
  a mismatch the bot says so and sends a fresh preview.

**Not chosen:** storing previews in a database (Supabase or Vercel KV) and keeping only an ID in
the button. That's more moving parts, and it contradicts the "nothing stored" decision.

### 4. Never posting twice

Two approvers tapping at the same moment, or a duplicate cron run, must not lead to two posts.

1. **On "Plaats", the bot first removes the buttons** (`editMessageReplyMarkup`) and only posts
   when that succeeds. A second tap on the same message finds no buttons left and stops.
2. **X itself refuses an identical post** ("duplicate content"). That catches a second preview of
   the same post. The bot reports it rather than retrying.

If posting fails after the buttons are gone (X down, card not reachable), the bot puts the error in
the message and sends the preview again, so someone can retry.

### 5. Security: four checks before anything happens

| Check | What it stops |
|---|---|
| `CRON_SECRET` on `/api/voorstel` | strangers spamming the group with previews |
| Telegram's `secret_token` header on `/api/telegram` (set once with `setWebhook`) | fake "taps" sent to our URL by someone other than Telegram |
| `chat.id` equals `TELEGRAM_CHAT_ID` | the bot being used from another chat |
| `from.id` in `TELEGRAM_APPROVERS` | a group member who isn't an approver |

Secrets are compared with `crypto.timingSafeEqual`, so the time a comparison takes reveals nothing.
The bot can't join other groups (`/setjoingroups` disabled, done during setup).

### 6. Talking to X: our own small client, OAuth 1.0a

- **OAuth 1.0a user context:** four keys (API key + secret, access token + secret) for
  @amerikabelegger. **These tokens don't expire** (X: "These tokens do not expire but can be
  revoked by the user at any time").
  - **Not chosen: OAuth 2.0.** Its user tokens expire after two hours, and the refresh token
    changes on every use, so it would have to be stored somewhere. That means a database.
- **Two calls:**
  - `POST /2/media/upload` (multipart, `media_category=tweet_image`) for the card;
  - `POST /2/tweets` with `{ text, media: { media_ids: [id] } }`.

  Both accept OAuth 1.0a ("UserToken" in X's spec).
- **`lib/x.ts`, about 60 lines, no dependency.** The only tricky part is the OAuth 1.0a signature
  (HMAC-SHA1 from `node:crypto`). It's tested against the worked example in X's documentation
  before any real call. With multipart and JSON bodies, the body isn't part of the signature,
  which keeps it small.
  - **Not chosen: X's official SDK `@xdevplatform/xdk`.** It supports OAuth 1.0a, but its docs show
    no media upload, and it's a large generated client for two calls.
  - **Not chosen: `twitter-api-v2`.** A popular community library, but its upload helper uses the
    older v1.1 upload endpoint, which is being phased out.
  - *Per CLAUDE.md, a dependency needs Sam's OK. The proposal is none.*
- **Cost:** $0.015 per post on pay-per-use, about $0.40 a month at one post per weekday.

### 7. Talking to Telegram: `lib/telegram.ts`, plain `fetch`, no dependency

There are four Bot API calls: `sendPhoto` (card by URL, text as caption, buttons),
`editMessageCaption` / `editMessageReplyMarkup`, and `answerCallbackQuery` (stops the spinner on
the button).
- **Not chosen:** a bot framework (grammY, Telegraf), which is overkill for four calls.

**The preview message:** the card, then the caption. The caption starts with one line of context
("Voorstel voor vrijdag 13 november, 15:00 · Topbelegger van de week"), then the exact post text
and its length. Telegram fetches the card from our own URL, so the card routes must be deployed
first.

### 8. Environment variables

These are settings that live on the server instead of in the code. They're set in the Vercel
dashboard (Production) and, for local tests, in `.env.local`, which git ignores (`.env*` in
`.gitignore`).

| Name | What | Secret? |
|---|---|---|
| `CRON_SECRET` | random, at least 16 characters | yes |
| `TELEGRAM_BOT_TOKEN` | from BotFather | yes |
| `TELEGRAM_WEBHOOK_SECRET` | random; Telegram sends it back with every update | yes |
| `TELEGRAM_CHAT_ID` | the approval group, a negative number | no |
| `TELEGRAM_APPROVERS` | user IDs, comma-separated | no |
| `X_API_KEY`, `X_API_SECRET` | the app's keys | yes |
| `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET` | @amerikabelegger's tokens | yes |

The non-secret IDs live there too, so changing approvers doesn't need a code change.

### 9. Sam's setup (outside the code)

1. **X developer account** (pay-per-use), logged in as @amerikabelegger. The use-case text is
   in the chat of 27 Oct; the choice is in decisions.md.
2. **In the app's settings, set permissions to "Read and write" *before* generating the access
   token and secret** under "Keys and tokens". Tokens made earlier stay read-only; regenerate them
   if needed.
3. **Buy a little credit**, about $5.
4. **Telegram bot, group, `/setjoingroups` disabled, IDs collected** (walkthrough in the chat of
   27 Oct).
5. **All variables in Vercel → Settings → Environment Variables (Production).**
6. **After the deploy, register the webhook once:**
   `curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" -d "url=https://amerikabelegger.vercel.app/api/telegram" -d "secret_token=$TELEGRAM_WEBHOOK_SECRET" -d 'allowed_updates=["callback_query"]'`

### Files

| File | Change |
|---|---|
| `vercel.json` | new: the cron job |
| `lib/posts.ts` | `todaysPost(date)`, `postFor(type, date)`, `postFingerprint(post)` |
| `lib/x.ts` | new: OAuth 1.0a signing, `uploadImage`, `createPost` |
| `lib/telegram.ts` | new: the four Bot API calls |
| `app/api/voorstel/route.ts` | new: the cron route |
| `app/api/telegram/route.ts` | new: the webhook |
| `docs/handover.md` | how the posting runs, the manual trigger, what to do on errors |
| `docs/decisions.md`, `docs/glossary.md`, `docs/build-log.md`, `TODO.md` | entries |

## How to verify step 4

1. **Locally, without network:** the OAuth 1.0a signature matches the worked example in X's docs
   ("Creating a signature"), character for character.
2. **Locally, with real keys in `.env.local`:**
   - one preview sent to the group by calling the route with the secret;
   - "Overslaan" tested via `getUpdates`. *(Or on production; the webhook needs a public URL.)*
3. **On production:**
   - the cron route without the secret returns 401;
   - a fake webhook call without Telegram's header returns 401;
   - a tap by a non-approver is refused;
   - a tap on yesterday's preview is refused.
4. **One real test post** with card, after Sam's OK. It costs $0.015 and is deleted afterwards. It
   proves the upload, the signature and the permissions in one go, before 13 Nov.
5. **Double-tap:** two people tap "Plaats" on the same preview, and exactly one post appears.

## Answered 27 Oct

1. **Production address:** `https://amerikabelegger.vercel.app` until the own domain arrives.
   Then register the webhook again and update the X app's website URL (TODO.md).
2. **Approvers:** Sam for now. The three partners join later: their IDs go into
   `TELEGRAM_APPROVERS` in Vercel, then redeploy.
3. **Preview window 13:00–14:59:** fine.
4. **No dependency for X and Telegram:** agreed.
5. **The test post:** yes, at the end of the build, at a moment Sam picks.

**Setup done (27 Oct):**
- **Telegram:** bot @amerikabelegger_bot, basic group "Amerikabelegger beheer". The group ID and
  Sam's user ID were collected; they go straight into the environment variables, not the repo.
  If the group is ever upgraded to a supergroup, its ID changes (to `-100…`): run `getUpdates`
  again.
- **X developer account:** created. App type "Web App, Automated App or Bot", permissions "Read
  and write", callback and website URL `https://amerikabelegger.vercel.app/`.

## Gotchas

- **Telegram webhooks don't reach Vercel preview deployments**, which sit behind Vercel's login.
  Test the webhook on production, where the routes are useless without the secrets.
- **Vercel crons run only on production deployments**, and only after a deploy that contains
  `vercel.json`.
- **A failed cron is not retried** by Vercel. Use the manual trigger.
- **`ENOTEMPTY` on `npm run build`:** the repo is in iCloud-synced `~/Documents`. Delete `.next`
  and build again; moving the repo out of iCloud fixes it for good.
- **npm, not pnpm.** **Check posts against a production build** (`npm run build && npx next start`).
- **Uncommitted on purpose:** `package.json` / `package-lock.json` (Next version, see TODO.md).
