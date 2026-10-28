# Glossary

Terms that come up in this project, explained plainly.

**13F.** The quarterly list of US stock holdings that every investment manager with more than $100M must file with the SEC, at most 45 days after the quarter ends. Our topbelegger data comes from it (`tools/13f/ingest.py`, `data/13f.json`).

**13D / 13G.** A filing that someone has bought more than 5% of a company. It's due within days, which makes it the source for the planned alerts.

**Cron job.** A task a server runs on a fixed schedule ("every weekday at 06:15"). On Vercel it calls one of our URLs at that time. It's planned as the trigger for each post.

**Route handler.** A file in `app/` that answers a URL with data instead of a page (for example a PNG card, or "post this now"). It's how the scheduler, the cards and Telegram will talk to our code.

**`ImageResponse` (`next/og`).** Built into Next.js. It turns JSX-like markup into a PNG. It's planned for the post cards, and it's the same engine as the `@vercel/og` package named in the content plan.

**Webhook.** A URL of ours that another service calls when something happens. When someone taps "Plaats" in Telegram, Telegram calls our webhook, and that's when the post goes to X.

**Static generation (prerendering).** Building a page or file once, during `npm run build`, instead of on every visit. The 30 Topbelegger cards and the 30 profile pages are prerendered (marked ● in the build output); Vercel then serves them as plain files.

**CUSIP.** A nine-character code for a security, used in every 13F row. The first six characters identify the issuer, but one issuer can have many different securities (a fund family issues many ETFs), so we don't merge on those six alone.

**Kerning.** Small spacing corrections between particular letter pairs ("Av", "To"). The card engine measures words without them and draws with them, which left gaps after long words. `keepTogether` in `app/kaart/shell.tsx` works around it.

**Non-breaking space (`\u00a0`).** A space that looks normal but doesn't allow a line break. On the cards it makes the engine measure a whole line at once, which fixes the spacing.

**Post type / card design.** Our two words for two different things. A *post type* is a kind of post (Topbelegger van de week, Wall Street gisteren). The *card design* is how every card looks. Post types are listed in `postTypes` in `lib/posts.ts`; the design lives in `app/kaart/shell.tsx`.

**Cashtag.** A ticker with a dollar sign (`$UBER`) in a post. X makes it clickable and groups posts per stock, so it helps people find us. It isn't a link, so it shouldn't cost the $0.20 link price (still to confirm on the first real post).

**Dynamic rendering.** The opposite of prerendering: the server builds the page on every visit (ƒ in the build output). `/voorvertoning` needs this because it depends on today's date. In the code, `await connection()` asks for it.

**Weighted character count.** X doesn't count every character as 1. Latin letters and normal punctuation count 1, emoji and many special characters 2. `xLength()` in `lib/posts.ts` counts the way X does.

**noindex.** An instruction in a page's metadata that asks search engines not to list the page. Used on `/voorvertoning`.

**Filer.** The legal entity that submits a 13F, identified by its CIK number. It isn't always the firm we show: Pershing Square Inc. filed Ackman's full portfolio from Q2 2026, Pershing Square Capital Management before that. `ingest.py` skips a comparison when the two quarters clearly don't cover the same portfolio.

**Depositary share.** A share that stands for a fraction of another security, here 1/20 of an Alphabet preferred share (GOOGM, GOOGN). It's a different security from the common stock, so it gets its own name in `companyNames`.

**Kwartaalseizoen order.** Which investor gets which season day. It's computed from the data alone (on-time filers in rotation order, then late filers), because nothing records what was already posted. See `seasonOrder()` in `lib/posts.ts`.

**Environment variable.** A named setting that lives on the server, not in the code, read as `process.env.NAME`. Secrets (keys, tokens) live only there: in Vercel's settings and, locally, in `.env.local`, which git ignores. Without the `NEXT_PUBLIC_` prefix they never reach the browser.

**OAuth 1.0a.** The way our code proves to X that it may post as @amerikabelegger. Every request is signed with four keys, and the signature (`lib/x.ts`) proves we hold the secrets without sending them. These keys don't expire.

**Callback query.** What Telegram sends when someone taps a button under a bot's message. It carries the button's hidden data (`plaats|topbelegger|2026-11-13|a9a1f280`), who tapped, and which message it was.

**Fingerprint (hash).** A short code computed from a piece of data, which changes when the data changes. `postFingerprint` makes 8 characters from a post. If the post computed at the tap gives a different fingerprint than the one in the button, the text changed since the proposal.

**Idempotent.** Doing it twice has the same effect as doing it once. Cron jobs and webhooks can arrive twice, so posting must never happen twice; the button lock and X's duplicate check make sure of that.
