import type { Metadata } from "next";
import { Bodoni_Moda, IBM_Plex_Mono, Libre_Franklin } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Ticker } from "@/components/ticker";
import "./globals.css";

// Display. `opsz` is requested explicitly — Next drops extra axes by default.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

// Text and UI.
const franklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-franklin",
  display: "swap",
});

// Ticker only. IBM Plex Mono has no variable cut, so weights are required.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "De Amerikabelegger",
  description:
    "Wij verzamelen en ordenen wat Amerikaanse beleggers publiceren over Amerikaanse aandelen.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl"
      className={`${bodoni.variable} ${franklin.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Ticker />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
