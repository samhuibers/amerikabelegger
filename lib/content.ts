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
    image: "/images/post-youtube-index.jpg",
    imageAlt: "Schermafbeelding van een YouTube-video van Macro Daily",
    href: "#",
  },
  {
    platform: "TikTok",
    kind: "Video",
    title: "Drie vragen die je stelt voor je een small cap koopt",
    source: "Small-cap jager",
    date: new Date(2026, 8, 5),
    image: "/images/post-tiktok-smallcap.jpg",
    imageAlt: "Schermafbeelding van een TikTok-video van @smallcaphunter",
    href: "#",
  },
  {
    platform: "X",
    kind: "Draad",
    title: "Wat de cijfers van dit kwartaal wel en niet zeggen",
    source: "Halfgeleider-analist",
    date: new Date(2026, 8, 7),
    image: "/images/post-x-chips.jpg",
    imageAlt: "Schermafbeelding van een draad op X van @chipcheck",
    href: "#",
  },
  {
    platform: "Substack",
    kind: "Nieuwsbrief",
    title: "De week waarin iedereen het over marges had",
    source: "Waardebelegger",
    date: new Date(2026, 8, 9),
    image: "/images/post-substack-margins.jpg",
    imageAlt: "Schermafbeelding van een Substack-post van The Value Letter",
    href: "#",
  },
  {
    platform: "Instagram",
    kind: "Post",
    title: "Wat een winstwaarschuwing wel en niet betekent",
    source: "Beleggingscoach",
    date: new Date(2026, 8, 10),
    image: "/images/post-instagram-warning.jpg",
    imageAlt: "Schermafbeelding van een Instagram-carrousel van @investingcoach",
    href: "#",
  },
  {
    platform: "X",
    kind: "Draad",
    title: "De rentecurve, en waarom iedereen er iets anders in leest",
    source: "Obligatiehandelaar",
    date: new Date(2026, 8, 11),
    image: "/images/post-x-rates.jpg",
    imageAlt: "Schermafbeelding van een draad op X van @bonddesk",
    href: "#",
  },
  {
    platform: "YouTube",
    kind: "Video",
    title: "Een kwartaal vol herzieningen, stap voor stap",
    source: "Sectoranalist",
    date: new Date(2026, 8, 12),
    image: "/images/post-youtube-revisions.jpg",
    imageAlt: "Schermafbeelding van een YouTube-video van Sector Watch",
    href: "#",
  },
  {
    platform: "Instagram",
    kind: "Post",
    title: "Drie dingen die deze week opvielen",
    source: "Marktcommentator",
    date: new Date(2026, 8, 14),
    image: "/images/post-instagram-week.jpg",
    imageAlt: "Schermafbeelding van een Instagram-carrousel van @marketnotes",
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
