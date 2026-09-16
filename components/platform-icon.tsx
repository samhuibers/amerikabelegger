import type { Platform } from "@/lib/content";

/*
 * Simplified, single-colour glyphs — not traced logos — so they read at chip
 * size on `currentColor` over both ink and paper. New platform? Add a case.
 */
export function PlatformIcon({
  platform,
  className = "h-4 w-4",
}: {
  platform: Platform;
  className?: string;
}) {
  switch (platform) {
    case "X":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M18.24 2.25h3.26l-7.33 8.38 8.62 11.12h-6.77l-5.3-6.93-6.07 6.93H1.4l7.84-8.97L1 2.25h6.94l4.79 6.34 6.51-6.34Zm-1.14 17.52h1.8L7.05 4.14h-1.9l11.95 15.63Z" />
        </svg>
      );
    case "YouTube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M22.54 6.42a2.87 2.87 0 0 0-2.02-2.03C18.88 4 12 4 12 4s-6.88 0-8.52.39a2.87 2.87 0 0 0-2.02 2.03A30 30 0 0 0 1 12a30 30 0 0 0 .46 5.58 2.87 2.87 0 0 0 2.02 2.03C5.12 20 12 20 12 20s6.88 0 8.52-.39a2.87 2.87 0 0 0 2.02-2.03A30 30 0 0 0 23 12a30 30 0 0 0-.46-5.58ZM9.75 15.5V8.5L15.8 12l-6.05 3.5Z" />
        </svg>
      );
    case "TikTok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M16.5 2h-3v13.9a2.85 2.85 0 1 1-2.02-2.73v-3.09a5.9 5.9 0 0 0-.73-.05A5.87 5.87 0 1 0 16.5 15.9V8.62a8.3 8.3 0 0 0 4.5 1.31v-3a5.3 5.3 0 0 1-4.5-4.93Z" />
        </svg>
      );
    case "Substack":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M4 3.5h16v2.3H4V3.5Zm0 4.1h16v2.3H4V7.6ZM4 11.7h16V21l-8-4.9-8 4.9V11.7Z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={className}
          aria-hidden
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
