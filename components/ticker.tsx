import { formatNumber, formatPercent } from "@/lib/format";
import { tickerRows } from "@/lib/content";

/*
 * The site's only moving element. A machine readout, so it earns the mono face
 * and tabular figures — columns must not jump.
 *
 * The track is rendered twice and translated -50%, which makes the loop seamless.
 * `prefers-reduced-motion` halts it in globals.css, leaving a readable static row.
 *
 * Direction is carried by the sign and the triangle, not by colour: --up and
 * --down score 2.67 and 2.93 against ink, well under AA, so on this surface the
 * figures stay paper. Those tokens are used on ledger, where they pass.
 */
export function Ticker() {
  return (
    <div className="overflow-hidden border-b border-brass bg-ink py-2">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex" aria-hidden={copy === 1}>
            {tickerRows.map((row) => (
              <span
                key={row.symbol}
                className="tabular flex items-baseline gap-2 px-6 font-mono text-body-s text-paper"
              >
                <span>{row.symbol}</span>
                <span>{formatNumber(row.price)}</span>
                <span>
                  {row.change < 0 ? "▼" : "▲"} {formatPercent(row.change)}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
