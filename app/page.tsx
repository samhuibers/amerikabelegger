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
 * A streaming-gallery card: thumbnail and attribution fused into one rounded
 * unit, tight gaps between cards, and a lift-and-border on hover rather than
 * a darkened overlay — the card itself is the affordance, so it needs no
 * button naming the click.
 */
function Media() {
  return (
    <section aria-label="Media" className="border-t border-brass">
      <div className="px-6 pt-10 pb-6 lg:px-8">
        <h2 className="font-display text-display-m">
          Topbeleggers en influencers. Wat is hún nieuws deze week?
        </h2>
        <div className="scotch-rule mt-4 max-w-reading" />
        <p className="mt-4 max-w-reading text-body-s text-ink-soft">
          Wie zegt wat? Op welk platform? De Amerikabelegger deelt de
          opvallendste updates.
        </p>
      </div>

      <ul className="grid gap-4 px-6 pb-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:px-8">
        {media.map((item) => (
          <li key={item.title}>
            <a
              href={item.href}
              className="group block origin-center overflow-hidden rounded-lg border border-transparent bg-paper transition duration-200 ease-out hover:z-10 hover:scale-[1.04] hover:border-brass hover:shadow-lg focus-visible:z-10 focus-visible:scale-[1.04] focus-visible:border-brass focus-visible:shadow-lg"
            >
              <div className="relative aspect-[4/3] bg-ink">
                {/*
                 * Decorative: these are generic placeholders, not stills from
                 * the linked post, so describing them would misdescribe the
                 * link. The heading below carries its name. Give real stills a
                 * real alt (item.imageAlt) when they replace these.
                 */}
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="photo object-cover"
                />

                {/* Always visible, so the source platform reads without hovering. */}
                <span
                  className="absolute top-0 left-0 flex items-center bg-ink p-2 text-paper"
                  aria-hidden
                >
                  <PlatformIcon platform={item.platform} className="h-4 w-4" />
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-body font-medium group-hover:underline">
                  {item.title}
                </h3>

                <p className="mt-1 text-body-s text-ink-soft">
                  {item.source} op {item.platform},{" "}
                  <time dateTime={item.date.toISOString().slice(0, 10)}>
                    {formatDate(item.date)}
                  </time>
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
