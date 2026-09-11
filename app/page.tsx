import Image from "next/image";
import Link from "next/link";
import { Cartouche } from "@/components/cartouche";
import { Guilloche } from "@/components/guilloche";
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
    <section className="relative overflow-hidden bg-ink">
      <Image
        src="/images/banner-flag.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="photo object-cover"
      />
      <div className="photo-scrim absolute inset-0" aria-hidden />
      <div className="absolute inset-0 text-brass opacity-[0.07]" aria-hidden>
        <Guilloche height={280} amplitude={40} lines={16} className="h-full" />
      </div>

      {/* The brand line gets one appearance on the whole site. This is it. */}
      {/*
       * Aligned to the page gutter rather than centred in a 1240px column, so
       * the banner, the categories and the media all share one left edge. The
       * subline keeps max-w-reading so the measure stays 62-68 characters.
       */}
      <div className="relative px-6 py-20 md:py-24 lg:px-8">
        <p className="font-display text-display-xl text-paper">
          Never bet against America
        </p>
        <p className="mt-4 text-body-s text-brass">Warren Buffett</p>
        <p className="mt-6 max-w-reading text-body-l text-paper">
          Wij lezen wat Amerikaanse beleggers publiceren, wegen het, en ordenen
          het in drie categorieën.
        </p>
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
 * Full-bleed to match the banner and the categories, and pulled up close to
 * them. The thumbnail is the link target; the affordance over it names what
 * clicking actually does, which differs per platform.
 */
function Media() {
  return (
    <section aria-label="Media" className="border-t border-brass">
      <div className="px-6 pt-10 pb-6 lg:px-8">
        <h2 className="font-display text-display-m">Wat wij deze week zagen</h2>
        <div className="scotch-rule mt-4 max-w-reading" />
        <p className="mt-4 max-w-reading text-body-s text-ink-soft">
          Bij elke uitspraak staat wie het zei, op welk platform, en wanneer.
        </p>
      </div>

      <ul className="grid border-t border-brass sm:grid-cols-2 lg:grid-cols-4">
        {media.map((item) => {
          const isVideo = item.kind === "Video";
          return (
            <li
              key={item.title}
              className="border-b border-brass last:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <a href={item.href} className="group block h-full p-6 lg:p-8">
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

                  {/*
                   * Always visible, so a video reads as a video without hovering
                   * — touch devices never get a hover state. Solid ink behind it
                   * because the photograph underneath is unscrimmed and may be
                   * bright.
                   */}
                  {isVideo && (
                    <span
                      className="absolute bottom-0 left-0 bg-ink px-3 py-2 text-body-s text-paper"
                      aria-hidden
                    >
                      ▶
                    </span>
                  )}

                  {/*
                   * Revealed on hover and on keyboard focus. Opacity and colour
                   * only — no lift, no scale. The scrim is the same measured 70%
                   * that keeps paper text legible over any part of a photograph.
                   */}
                  <span
                    className="photo-scrim absolute inset-0 flex items-center justify-center p-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                    aria-hidden
                  >
                    <span className="border border-paper px-4 py-2 text-center text-body-s font-medium text-paper">
                      {item.cta}
                    </span>
                  </span>
                </div>

                <h3 className="mt-4 text-body font-medium group-hover:underline">
                  {item.title}
                </h3>

                {/*
                 * The attribution block: who said it, where, when. Platform is
                 * named in text rather than shown as a coloured logo chip.
                 */}
                <p className="mt-2 text-body-s text-ink-soft">
                  {item.source} op {item.platform},{" "}
                  <time dateTime={item.date.toISOString().slice(0, 10)}>
                    {formatDate(item.date)}
                  </time>
                </p>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
