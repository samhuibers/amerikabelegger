import type { CategorySlug } from "@/lib/content";

/*
 * The category marker, shaped like the denomination lozenge on a bank note.
 * Along with the seal, the only rounded thing on the site.
 *
 * On ink it is a solid category fill with paper text; on paper it is ink text
 * inside a category-coloured border. Paper never sets the label in the category
 * hue — at this size Moonshots would fall below WCAG AA.
 */

const onInk: Record<CategorySlug, string> = {
  giants: "bg-giants text-paper",
  growers: "bg-growers text-paper",
  moonshots: "bg-moonshots text-paper",
};

const onPaper: Record<CategorySlug, string> = {
  giants: "border-giants text-ink",
  growers: "border-growers text-ink",
  moonshots: "border-moonshots text-ink",
};

export function Cartouche({
  category,
  label,
  surface = "paper",
}: {
  category: CategorySlug;
  label: string;
  surface?: "paper" | "ink";
}) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-body-s font-medium ${
        surface === "ink" ? onInk[category] : onPaper[category]
      }`}
    >
      {label}
    </span>
  );
}
