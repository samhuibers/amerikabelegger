/**
 * Dutch formatting. Use these everywhere a number or date is shown — never
 * `toFixed` or `toLocaleString` at the call site.
 *
 * Conventions: thousands `.`, decimals `,`, currency symbol then a thin space,
 * and a true minus sign (U+2212) rather than a hyphen.
 */

const LOCALE = "nl-NL";
const THIN_SPACE = " ";
const MINUS = "−";

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

/** `+12,4%` / `−3,1%`. Always signed, so colour is never the only signal. */
export function formatPercent(value: number, decimals = 1): string {
  const sign = value < 0 ? MINUS : "+";
  return `${sign}${formatNumber(Math.abs(value), decimals)}%`;
}

/** `4 maart 2026` */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
