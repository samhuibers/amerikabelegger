/**
 * A page's title block: display title over a scotch rule.
 *
 * The rule is "only under a section masthead" — this component is the page-level
 * one, and an `h2` opening a section qualifies too (see /over-ons, /styleguide
 * and /topbeleggers). It is never a divider between paragraphs.
 */
export function Masthead({
  title,
  intro,
}: {
  title: string;
  intro?: string;
}) {
  return (
    <header className="mx-auto w-full max-w-content px-6 pt-16 pb-8 md:pt-24">
      <h1 className="font-display text-display-l">{title}</h1>
      <div className="scotch-rule mt-6" />
      {intro && (
        <p className="mt-6 max-w-reading text-body-l text-ink-soft">{intro}</p>
      )}
    </header>
  );
}
