/**
 * The shell's content. Header, footer, homepage and category pages all read
 * from here so no label or path is written twice.
 */

export type CategorySlug = "giants" | "growers" | "moonshots";

export const navigation = [
  { label: "Topbeleggers", href: "/topbeleggers" },
  { label: "Influencers", href: "/influencers" },
  { label: "Modelportefeuilles", href: "/modelportefeuilles" },
  { label: "Over ons", href: "/over-ons" },
] as const;

/** Always in this order. It is the order the reader learns the site by. */
export const categories: {
  slug: CategorySlug;
  label: string;
  description: string;
  image: string;
  imageAlt: string;
}[] = [
  {
    slug: "giants",
    label: "Giants",
    description: "Mega-caps en blue chips. De namen die de index bewegen.",
    image: "/images/giants-skyline.jpg",
    imageAlt: "De skyline van Manhattan bij nacht",
  },
  {
    slug: "growers",
    label: "Growers",
    description: "De toekomstige Giants. Bedrijven die snel groeien en dominant worden.",
    image: "/images/growers-farmland.jpg",
    imageAlt: "Een tractor voor een maisveld onder een bewolkte hemel",
  },
  {
    slug: "moonshots",
    label: "Moonshots",
    description: "Speculatief en met grote uitslagen. De loten.",
    image: "/images/moonshots-apollo.jpg",
    imageAlt: "De lancering van de Saturn V-raket van Apollo 11 in 1969",
  },
];

/** Placeholder rows until the ticker is wired to real data. */
export const tickerRows = [
  { symbol: "AAPL", price: 231.4, change: 1.24 },
  { symbol: "NVDA", price: 184.92, change: -2.13 },
  { symbol: "MSFT", price: 512.06, change: 0.41 },
  { symbol: "BRK.B", price: 492.18, change: 0.08 },
  { symbol: "AMZN", price: 228.75, change: -0.62 },
  { symbol: "GOOGL", price: 254.31, change: 1.87 },
  { symbol: "TSLA", price: 421.09, change: -3.44 },
  { symbol: "META", price: 738.52, change: 0.95 },
];

/** The platforms a source can post on. Drives which icon a card shows. */
export type Platform = "X" | "YouTube" | "TikTok" | "Substack" | "Instagram";

/*
 * Hardcoded media placeholders. Roles rather than real names, and invented
 * titles: attaching a fabricated headline to a real creator would misrepresent
 * them. `href` is "#" until the real links exist. The platform is shown as an
 * icon on the card.
 */
export const media: {
  platform: Platform;
  kind: string;
  title: string;
  source: string;
  date: Date;
  image: string;
  imageAlt: string;
  href: string;
}[] = [
  {
    platform: "YouTube",
    kind: "Video",
    title: "Waarom de grootste namen de index blijven dragen",
    source: "Macro-commentator",
    date: new Date(2026, 8, 2),
    image: "/images/media-youtube.jpg",
    imageAlt: "Twee vintage fotocamera's op een houten tafel",
    href: "#",
  },
  {
    platform: "TikTok",
    kind: "Video",
    title: "Drie vragen die je stelt voor je een small cap koopt",
    source: "Small-cap jager",
    date: new Date(2026, 8, 5),
    image: "/images/media-tiktok.jpg",
    imageAlt: "Een hand houdt een smartphone vast boven een grasveld",
    href: "#",
  },
  {
    platform: "X",
    kind: "Draad",
    title: "Wat de cijfers van dit kwartaal wel en niet zeggen",
    source: "Halfgeleider-analist",
    date: new Date(2026, 8, 7),
    image: "/images/media-x.jpg",
    imageAlt: "Een laptop en een monitor op een donker bureau",
    href: "#",
  },
  {
    platform: "Substack",
    kind: "Nieuwsbrief",
    title: "De week waarin iedereen het over marges had",
    source: "Waardebelegger",
    date: new Date(2026, 8, 9),
    image: "/images/media-substack.jpg",
    imageAlt: "Een turquoise schrijfmachine op een houten tafel",
    href: "#",
  },
];

/** Shown above the ink footer. The promise the whole site is built on. */
export const positioning =
  "De Amerikabelegger verzamelt en ordent wat Amerikaanse beleggers publiceren. " +
  "Wij voeren geen eigen onderzoek uit.";

export const disclaimer =
  "Niets op deze site is beleggingsadvies. Wij geven meningen van derden weer, " +
  "voorzien van bron en datum. Beleggen brengt risico's met zich mee; je kunt je inleg verliezen.";
