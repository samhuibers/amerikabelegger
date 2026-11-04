import type { Metadata } from "next";
import { Bodoni_Moda, Libre_Franklin } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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

export const metadata: Metadata = {
  title: "De Amerikabelegger",
  description:
    "Wij verzamelen en ordenen wat Amerikaanse beleggers publiceren over Amerikaanse aandelen.",
  icons: {
    icon: "/images/favicon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl"
      className={`${bodoni.variable} ${franklin.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
