import { Cartouche } from "@/components/cartouche";
import { Masthead } from "@/components/masthead";
import { categories, type CategorySlug } from "@/lib/content";

/** Shared shell for the three category pages. Until they have contents, a "binnenkort" line. */
export function CategoryPage({ slug }: { slug: CategorySlug }) {
  const category = categories.find((c) => c.slug === slug)!;

  return (
    <>
      <Masthead title={category.label} intro={category.description} />
      <div className="mx-auto max-w-content px-6">
        <Cartouche category={category.slug} label={category.label} />
        <p className="mt-8 text-body-s text-ink-soft">
          Binnenkort meer op deze pagina.
        </p>
      </div>
    </>
  );
}
