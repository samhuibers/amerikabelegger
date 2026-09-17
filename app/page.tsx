import Image from "next/image";
import Link from "next/link";
import { Cartouche } from "@/components/cartouche";
import { Guilloche } from "@/components/guilloche";
import { PlatformIcon } from "@/components/platform-icon";
import { categories, media, type CategorySlug } from "@/lib/content";
import { formatDate } from "@/lib/format";

/*
 * Photographs sit under a flat 70% ink scrim (`.photo-scrim`), never a gradient.
 * 70% is measured, not guessed: it keeps paper text at 5.44:1 even over a pure
 * white highlight — the Apollo exhaust plume and the skyline's lit windows are
 * exactly the places a lighter scrim fails. See docs/STYLE_GUIDE.md.
 */

// Written out in full: Tailwind scans source statically, so a class built by
// interpolation would never be generated.
const categoryRule: Record<CategorySlug, string> = {
  giants: "bg-giants",
  growers: "bg-growers",
  moonshots: "bg-moonshots",
};

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Media />
    </>
  );
}

function Hero() {
  return (
    /*
     * 2.5:1, matching the banner image's own ratio so it shows uncropped.
     * The plate is an absolutely positioned overlay now, not flow content —
     * `min-h-[220px]` is the mobile floor that used to come from the plate's
     * own padding, kept so the banner has a sensible height once the plate
     * is lifted out of flow.
     */
    <section className="relative min-h-[220px] overflow-hidden bg-ink md:aspect-[2.5/1]">
      <Image
        src="/images/banner-diner.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="photo object-cover"
      />
      {/* Light, decorative only — the plate below carries the contrast. */}
      <div className="photo-scrim-soft absolute inset-0" aria-hidden />

      {/*
       * The quote sits on a solid ink plate rather than straight on the
       * photograph. The photograph's brightest area is the neon sign, exactly
       * where this text falls, so a scrim heavy enough to make it legible would
       * have flattened the neon and the sunset. The plate fixes contrast at
       * 14.65:1 regardless of what moves behind it, and lets the image stay
       * punchy. Brass hairline, because it is an engraved plate.
       *
       * Kept small and pinned to a corner on purpose: this is a caption on
       * the photo, not the page's headline — the banner is the visual, so
       * the plate must not compete with it or sit across its center.
       */}
      <div className="absolute inset-x-0 bottom-0 px-6 py-6 lg:px-8 lg:py-8">
        <div className="max-w-xs border border-brass bg-ink px-5 py-4 sm:max-w-fit">
          <p className="font-display text-display-s text-paper">
            Never bet against America&copy;
          </p>
          <p className="mt-1 text-body-s text-brass">Warren Buffett</p>
        </div>
      </div>
    </section>
  );
}

/*
 * Full-bleed and hard against the banner: the three categories are the first
 * thing under the quote, not a contained block further down the page. The
 * guilloché band is the only thing between them, keeping the engraved DNA.
 */
function Categories() {
  return (
    <section aria-label="Categorieën">
      <div className="bg-ink text-brass">
        <Guilloche height={24} amplitude={6} lines={6} />
      </div>

      <div className="grid md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/${category.slug}`}
            className="group relative isolate overflow-hidden border-b border-brass p-6 last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0 lg:p-8"
          >
            <Image
              src={category.image}
              alt={category.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="photo -z-10 object-cover"
            />
            <div className="photo-scrim absolute inset-0 -z-10" aria-hidden />

            <div className={`h-1 w-16 ${categoryRule[category.slug]}`} />
            <h2 className="mt-5 font-display text-display-s text-paper group-hover:text-brass">
              {category.label}
            </h2>
            <p className="mt-2 text-body-s text-paper">
              {category.description}
            </p>
            <div className="mt-5">
              <Cartouche
                category={category.slug}
                label={category.label}
                surface="ink"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/*
 * A filmstrip on the ink plate. The rail is wider than the viewport on purpose
 * — the tile cut off at the right edge is the whole affordance, so there are no
 * arrow buttons and no client JS. Tiles are portrait: a cover, not a thumbnail
 * stacked above a byline.
 *
 * `pl-6` without a matching `pr` is deliberate. Padding on the right would
 * park the last tile neatly inside the gutter and the row would read as a grid
 * that happens to scroll.
 */
function Media() {
  return (
    <section aria-label="Media" className="border-t border-brass bg-ink text-paper">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-6 pt-10 pb-1 lg:px-8">
        <div>
          <h2 className="font-display text-display-m">
            Topbeleggers en influencers. Wat is hún nieuws deze week?
          </h2>
          <div className="scotch-rule mt-4 max-w-reading" />
          <p className="mt-4 max-w-reading text-body-s">
            Wie zegt wat? Op welk platform? De Amerikabelegger deelt de
            opvallendste updates.
          </p>
        </div>

        {/* The count is the second overflow cue, for anyone who never scrolls. */}
        <p className="tabular text-body-s text-brass">{media.length} updates</p>
      </div>

      {/*
       * `py-11` is not spacing, it is headroom. A scroll container clips at its
       * padding box, so a tile growing to 1.2x needs (scale - 1) / 2 * height
       * — 38.4px at this tile size — or it gets cut off at the band edges.
       * The same padding keeps the focus ring, drawn 2px outside, unclipped.
       *
       * `scroll-pl-*` has to match `pl-*`. Snapping measures from the snapport,
       * which ignores padding unless scroll-padding says otherwise — without it
       * the browser snaps tile one flush to the viewport edge on load and eats
       * the gutter.
       */}
      <ul className="rail flex snap-x snap-mandatory gap-3 overflow-x-auto py-11 pl-6 scroll-pl-6 lg:pl-8 lg:scroll-pl-8">
        {media.map((item) => (
          <li key={item.title} className="w-56 shrink-0 snap-start sm:w-64">
            <a
              href={item.href}
              className="group relative block aspect-[2/3] overflow-hidden rounded-lg bg-ink transition duration-300 ease-out hover:z-10 hover:outline-1 hover:-outline-offset-1 hover:outline-brass focus-visible:z-10 motion-safe:hover:scale-[1.2] motion-safe:focus-visible:scale-[1.2]"
            >
              {/*
               * Decorative on purpose: the image is a mock-up of the post and
               * the caption beside it already names the post, the source and
               * the date, so a real alt would only repeat it. `item.imageAlt`
               * describes each file and is ready if that ever stops being true.
               */}
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(max-width: 640px) 224px, 256px"
                className="photo object-cover"
              />

              {/*
               * The hover affordance. The thumbnail is a mock-up of the post
               * itself, so it already announces its platform far better than a
               * permanent chip did — the mark only needs to appear at the point
               * the tile becomes clickable.
               *
               * Paper for every platform rather than each brand's own colour:
               * this says "the post lives over there", it is not a logo wall.
               *
               * Placed before the plate so the plate paints over it and stays
               * undimmed, and `pb-28` lifts the mark into the part of the image
               * the plate doesn't cover.
               */}
              <span
                className="photo-dim absolute inset-0 flex items-center justify-center pb-28 text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                aria-hidden
              >
                <PlatformIcon platform={item.platform} className="h-12 w-12" />
              </span>

              {/*
               * A plate, not a scrim: solid ink-soft under the text rather than
               * a translucent layer over the photograph. Fixes contrast at
               * 10.53:1 whatever the image does behind it, where the 70% scrim
               * could only promise 5.44:1. Brass hairline because it is an
               * engraved plate — the same device as the banner's quote.
               *
               * ink-soft rather than ink: the band behind is already ink, so an
               * ink plate would hide the tile's lower corners and the radius
               * would only read at the top.
               */}
              <div className="absolute inset-x-0 bottom-0 border-t border-brass bg-ink-soft p-3">
                <h3 className="text-body leading-snug font-medium group-hover:underline">
                  {item.title}
                </h3>

                {/* Who, on which platform, when — named in text, not by icon alone. */}
                <p className="mt-1.5 text-body-s leading-snug">
                  {item.source} op {item.platform}
                </p>
                <time
                  dateTime={item.date.toISOString().slice(0, 10)}
                  className="tabular block text-micro"
                >
                  {formatDate(item.date)}
                </time>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
