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
