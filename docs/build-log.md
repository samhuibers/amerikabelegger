# Build log: phase 1 (the X account)

What each step delivered, in plain language. This is the raw material for the one-page brief
to the partners once all steps are done. The reasons behind each choice are in
[decisions.md](decisions.md); open work is in [TODO.md](../TODO.md). One entry per finished step.

**Before phase 1 (September 2026):** every topbelegger's latest 13F filing is pulled from the SEC
into the site, and each profile page shows the portfolio.

## Step 1: the Topbelegger card (26–27 Oct 2026)
- An image for the "Topbelegger van de week" post, drawn automatically for each of the 30
  investors from their latest 13F: name, firm, style, three largest positions and the source.
- Version B chosen after comparing rendered options: phone-sized type, a decorative price line
  and a skyline.
- Ten further design directions are with the partners
  ([Topbelegger-kaarten](https://claude.ai/artifact/9myUwdGuSE1YxNy2JuMLX3)). Still open.

## Step 2: post text, rotation and preview (27 Oct 2026)
- **The post text** is written by fixed templates from the data, not by AI: no invented facts, no
  advice. It includes cashtags ($UBER). Every post stays under X's 280 characters.
- **The rotation:** each Friday a different investor, all 30 before anyone repeats, well-known
  names first. It starts Friday 13 November (likely).
- **One list of all eight post types**, with when each goes out and what it waits on. When the
  partners choose a card design, it applies to every post type at once.
- **An internal preview page** (`/voorvertoning`, not linked and hidden from search engines)
  shows the next six posts with card and text, plus a blank card for each type not built yet.
- **Decided:** no disclaimer in the posts, "Geen beleggingsadvies" in the X bio; no emoji.

## Step 3: Kwartaalseizoen (27 Oct 2026)
- **What it is:** for two weeks after each 13F deadline, the Monday–Thursday 15:00 posts show what
  one topbelegger newly bought and fully sold. Friday stays Topbelegger van de week.
- **First season:** Tue 17 – Mon 30 Nov 2026, eight posts, so eight of the 30 investors per
  season. Well-known names go first, among those who filed on time.
- **Only "nieuw" and "helemaal verkocht"**, never "bijgekocht" or "afgebouwd". A stock split would
  make those look like big purchases, and we don't want to publish anything that isn't true.
- **The site now keeps two quarters per investor**, so the changes can be computed.
- **Seen in the preview:** the August season (Q1 → Q2) as a real example, with card and text. It
  switches to November once the Q3 filings are in.
- **Caught on the way:** Ackman's Q1 filing came from a different Pershing Square entity, which
  would have made all his holdings look new. A general check now skips comparisons like that.
- **During the season**, Sam updates the data each morning and fixes any unreadable company names
  before the 15:00 post.
