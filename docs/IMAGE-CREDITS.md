# Beeldverantwoording

**These are placeholders.** They were chosen to show the design working, not as final art
direction. They are public domain or CC0, so nothing here creates an attribution obligation —
but replacing them with licensed or commissioned photography is still the intent.

Anything that replaces them must be checked against the same rule: the site never implies a
return or a guarantee, so no chart-going-up imagery, no money shots, no celebration of
profit. These celebrate *a country and its enterprise*, which is the distinction the whole
brand rests on.

| File | Subject | Source | Creator | Licence |
|---|---|---|---|---|
| `giants-skyline.jpg` | Manhattan at night from the Empire State Building | [Flickr](https://www.flickr.com/photos/130478877@N02/23347480891) | jody.claborn | Public Domain Mark 1.0 |
| `growers-construction.jpg` | A building site seen from above: tower cranes, formwork, an excavator | [StockSnap](https://stocksnap.io/photo/building-structure-7CMLX06CWF) | Chuttersnap | CC0 1.0 |
| `moonshots-artemis.jpg` | Artemis I liftoff from Launch Complex 39B, 16 November 2022 | [NASA image library](https://images.nasa.gov/details/NHQ202211160029) | NASA/Joel Kowsky (NHQ202211160029) | Public domain (NASA) |

### Banner

`banner-diner.jpg` was **supplied by the client**, not sourced here, so its provenance and
licensing sit with them rather than in this table. It appears to be generated rather than
photographed.

Two things to check before this goes anywhere public:

- **"Mel's Diner"** is rendered in neon across the sign. Mel's Drive-In is a real, trading
  American chain. A generated image carrying a real trademark is worth a look from whoever
  handles that.
- **"THE AMERICAN DREAM / BIGGER · BRIGHTER · TOGETHER"** appears on the roadside sign, and
  the car's licence plate reads "THE AMERICAN DREAM". It is vague optimism rather than a
  stated return, and it is part of the photograph rather than a claim the site makes — but
  on a regulated-adjacent site it is the kind of phrasing worth a second read. Flagging,
  not objecting.

The file is **2.5:1** (1983×793), which is also the ratio the banner is set to, so it
displays uncropped. A replacement cut to a different ratio will be cropped by
`object-cover`; re-cut it to 2.5:1 or change the ratio in `app/page.tsx`.

### Media thumbnails

**Not photographs. Drawn, not sourced.** The eight `post-*.jpg` files are mock-ups of
social posts, rendered from [`tools/post-mockups/posts.html`](../tools/post-mockups/posts.html)
and screenshotted — so there is no third party in them and nothing to license. Edit that
file and run `node tools/post-mockups/render.mjs` to regenerate the set.

Every account in them is invented (`@chipcheck`, `Macro Daily`, `The Value Letter`, and so
on) and no image contains a face. They imitate each platform's interface closely enough to
read as real at thumbnail size, which is the point — they exist so partners can see what
the product looks like with real-world content in it.

| File | Platform | Invented account |
|---|---|---|
| `post-youtube-index.jpg` | YouTube video page | Macro Daily |
| `post-tiktok-smallcap.jpg` | TikTok video | @smallcaphunter |
| `post-x-chips.jpg` | X thread | @chipcheck |
| `post-substack-margins.jpg` | Substack post | The Value Letter |
| `post-instagram-warning.jpg` | Instagram carousel | @investingcoach |
| `post-x-rates.jpg` | X thread | @bonddesk |
| `post-youtube-revisions.jpg` | YouTube video page | Sector Watch |
| `post-instagram-week.jpg` | Instagram carousel | @marketnotes |

**Before anything goes public**, these need replacing with real, cleared screenshots or
licensed art. Mock interfaces carrying another company's trade dress are fine for an
internal pitch and are not fine on a live regulated-adjacent site.

## One image deliberately rejected

A striking low-angle photograph of the World Trade Center twin towers came up while
searching and is *not* used. Using them as decorative furniture on a finance homepage is
not a call to make casually. Manhattan at night carries the same "Giants" meaning without
it.

## How they are treated

See [STYLE_GUIDE.md](STYLE_GUIDE.md#photography). Flat 70% ink scrim, mild saturation, no
gradients. The 70% is measured, not chosen by eye.
