import Link from "next/link";
import { categories, disclaimer, navigation, positioning } from "@/lib/content";

/*
 * A ledger disclaimer band over an ink footer.
 *
 * The disclaimer sits on ledger rather than inside the ink footer so it stays
 * genuinely readable (14.31:1) instead of being tucked away in low-contrast
 * text — it is meant to be read, not hidden.
 *
 * No top margin. The air before the disclaimer is `pt-16` inside the ledger
 * band, not a margin outside it: a margin renders as a strip of paper, which
 * on the homepage put an unfinished seam between the ink filmstrip and this
 * band. As padding, the same air arrives as ledger and every page's last
 * section meets the footer directly.
 */
export function SiteFooter() {
  return (
    <footer>
      <div className="bg-ledger">
        <div className="mx-auto max-w-content px-6 pt-16 pb-10">
          <p className="max-w-reading text-body-s text-ink">{positioning}</p>
          <p className="mt-3 max-w-reading text-micro text-ink-soft">
            {disclaimer}
          </p>
        </div>
      </div>

      <div className="bg-ink">
        <div className="mx-auto flex max-w-content flex-col gap-8 px-6 py-12 sm:flex-row sm:gap-16">
          <FooterColumn title="Rubrieken" links={navigation} />
          <FooterColumn
            title="Categorieën"
            links={categories.map((c) => ({
              label: c.label,
              href: `/${c.slug}`,
            }))}
          />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h2 className="text-body-s font-medium text-brass">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-body-s text-paper hover:text-brass"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
