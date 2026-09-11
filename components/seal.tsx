/**
 * The house mark. It means: we are putting our name to this.
 *
 * Reserved for the editorial voice — house verdicts, verified markers, the one
 * primary call to action. Three or four times across the whole site, never per
 * card, and never inside a data module (where red means "down").
 *
 * The label is set in Franklin: Bodoni is never used below 24px.
 */
export function Seal({
  label = "Redactie",
  size = 72,
}: {
  label?: string;
  size?: number;
}) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-full border-2 border-seal"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Merkteken van de redactie: ${label}`}
    >
      <span className="absolute inset-[5px] rounded-full border border-seal" />
      <span className="px-2 text-center text-micro font-semibold text-seal">
        {label}
      </span>
    </span>
  );
}
