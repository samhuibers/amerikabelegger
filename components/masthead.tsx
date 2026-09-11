/**
 * A page's title block: display title over a scotch rule.
 * The scotch rule appears here and nowhere else.
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
