/**
 * Dutch formatting. Use these everywhere a number or date is shown — never
 * `toFixed` or `toLocaleString` at the call site.
 *
 * Conventions: thousands `.`, decimals `,`, currency symbol then a thin space,
 * and a true minus sign (U+2212) rather than a hyphen.
 */

const LOCALE = "nl-NL";
/** Narrow and non-breaking (U+202F), so `$` never ends a line on its own. */
const THIN_SPACE = "\u202f";
const MINUS = "−";
/** Between a figure and its unit, so `1,9` and `mld` never wrap apart. */
const NBSP = "\u00a0";

/** `1.234,56` */
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * `$ 1.234,56`. Built by hand because Intl renders USD in Dutch as `US$`,
 * and places the symbol without the thin space.
 */
export function formatCurrency(value: number, symbol = "$"): string {
  const sign = value < 0 ? MINUS : "";
  return `${sign}${symbol}${THIN_SPACE}${formatNumber(Math.abs(value))}`;
}

/**
 * `$ 1,9 mld`, `$ 254 mln`, `$ 4,7 mln`. For portfolio values, where cents
 * are noise. Below a million the whole figure (`$ 761.834`): a quarter of all
 * 13F rows are that small, and `$ 0,8 mln` hides more than it saves.
 */
export function formatCompactCurrency(value: number, symbol = "$"): string {
  const sign = value < 0 ? MINUS : "";
  const abs = Math.abs(value);
  const figure =
    abs >= 1e9
      ? `${formatNumber(abs / 1e9, 1)}${NBSP}mld`
      : abs >= 1e7
        ? `${formatNumber(abs / 1e6, 0)}${NBSP}mln`
        : abs >= 1e6
          ? `${formatNumber(abs / 1e6, 1)}${NBSP}mln`
          : formatNumber(abs, 0);
  return `${sign}${symbol}${THIN_SPACE}${figure}`;
}

/**
 * `22,0%`. A share of a whole, so unsigned — unlike `formatPercent`, which is
 * a change. Too small to show is `< 0,1%`, never `0,0%`.
 */
export function formatWeight(value: number): string {
  return value < 0.05
    ? `<${NBSP}0,1%`
    : `${formatNumber(value, 1)}%`;
}

/**
 * `71%` in running text. Rounding must not say something false at either end:
 * under half a percent is `minder dan 1%` rather than `0%`, and 99,5% or more
 * is `meer dan 99%` rather than `100%` when there is something next to it.
 */
export function formatRoughShare(value: number): string {
  if (value < 0.5) return "minder dan 1%";
  if (value >= 99.5) return "meer dan 99%";
  return `${Math.round(value)}%`;
}

/** `+12,4%` / `−3,1%`. Always signed, so colour is never the only signal. */
export function formatPercent(value: number, decimals = 1): string {
  const sign = value < 0 ? MINUS : "+";
  return `${sign}${formatNumber(Math.abs(value), decimals)}%`;
}

/**
 * `Q2 2026`. Here rather than in JSX for the same reason as the rest of this
 * file: the quarter is a figure, and a figure typed at a call site is a figure
 * that can drift. Every profielpagina repeats it above its portefeuille.
 */
export function formatQuarter(quarter: number, year: number): string {
  return `Q${quarter} ${year}`;
}

/** `4 maart 2026` */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
