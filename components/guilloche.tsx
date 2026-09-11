/**
 * The engine-turned wave pattern from bank notes.
 *
 * Two uses only: a thin band separating major page regions, and a hero
 * backdrop at low opacity. Never behind text read at body size.
 */
export function Guilloche({
  height = 28,
  amplitude = 6,
  lines = 7,
  className = "",
}: {
  height?: number;
  amplitude?: number;
  lines?: number;
  className?: string;
}) {
  // One period of a sine-ish wave, repeated by the pattern tile.
  const wave = `M 0 ${height / 2} C 20 ${height / 2 - amplitude}, 40 ${
    height / 2 + amplitude
  }, 60 ${height / 2} S 100 ${height / 2 - amplitude}, 120 ${height / 2}`;

  // Derived from the geometry so two instances on one page never collide:
  // same parameters means the same pattern definition.
  const patternId = `guilloche-${height}-${amplitude}-${lines}`;

  return (
    <svg
      aria-hidden="true"
      className={className}
      width="100%"
      height={height}
      viewBox={`0 0 120 ${height}`}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id={patternId}
          width="120"
          height={height}
          patternUnits="userSpaceOnUse"
        >
          {Array.from({ length: lines }, (_, i) => (
            <path
              key={i}
              d={wave}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              transform={`translate(0 ${
                (i - (lines - 1) / 2) * (amplitude / 2)
              })`}
            />
          ))}
        </pattern>
      </defs>
      <rect width="120" height={height} fill={`url(#${patternId})`} />
    </svg>
  );
}
