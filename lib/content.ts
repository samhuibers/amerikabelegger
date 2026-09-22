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
    image: "/images/growers-construction.jpg",
    imageAlt: "Een bouwput met torenkranen en bekistingen, van bovenaf gezien",
  },
  {
    slug: "moonshots",
    label: "Moonshots",
    description: "Speculatief en met grote uitslagen. De loten.",
    image: "/images/moonshots-artemis.jpg",
    imageAlt: "De nachtelijke lancering van Artemis I vanaf Kennedy Space Center in 2022",
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

/*
 * Het kwartaal waarvan de getoonde portefeuilles komen. Nog met de hand gezet
 * — er is nog geen ingest — maar nu op één plek, zodat er na de eerstvolgende
 * SEC-lezing niets in JSX hoeft te veranderen. Zodra de ingest draait komt dit
 * uit die data en verdwijnt deze const.
 */
export const filings = { year: 2026, quarter: 2 as 1 | 2 | 3 | 4 };

/**
 * Altijd in deze volgorde: van geduldig naar reactief. Dat is een leesvolgorde,
 * geen rangschikking — de eerste stijl is niet de beste.
 */
export type StyleGroupSlug =
  | "kwaliteit"
  | "waarde"
  | "contrair"
  | "groei"
  | "activisme";

/**
 * Vijf emmers. Fijner dan dit wordt het een schatting van ons.
 *
 * "Cyclisch" en "Flexibel" worden ieder door één belegger gedragen en dat mag:
 * bij Marks ís de cyclus het onderwerp, en bij Tepper is het ontbreken van een
 * vaste horizon juist de stijl. Die twee samenvoegen tot "Wisselend" gooit het
 * verschil weg tussen meebewegen met de cyclus en helemaal geen vaste termijn
 * aanhouden.
 */
export type Horizon =
  | "Zeer lang"
  | "Lang"
  | "Middellang"
  | "Cyclisch"
  | "Flexibel";

/**
 * Gesloten lijst, met opzet. Los Nederlands per belegger leverde rijen op die
 * onderling niets te vergelijken hadden — de ene rij zei wát er gekocht werd,
 * de andere hoe, de derde waarom. De termen hieronder staan daarom op vier
 * assen, en `styleTags` volgt die volgorde: eerst waar op geselecteerd wordt,
 * dan hoe de portefeuille gebouwd is, dan waarom er gehandeld wordt, dan waar
 * het geld zit.
 *
 * Een union en geen `string[]`: een typefout compileert niet, en dit wordt
 * straks een lookup-tabel in plaats van een vrijetekstkolom.
 *
 * "Compounders" blijft Engels. Het is het woord dat deze beleggers zelf
 * gebruiken, het is courant in de Nederlandse beleggerspers, en de
 * groepsomschrijving van `kwaliteit` legt het één keer uit.
 */
export type StyleTag =
  // Waar ze op selecteren
  | "Waarde"
  | "Diepe waarde"
  | "Kwaliteit"
  | "Groei"
  | "Concurrentievoordeel"
  | "Compounders"
  | "Fundamenteel onderzoek"
  | "Veiligheidsmarge"
  // Hoe ze de portefeuille bouwen
  | "Geconcentreerd"
  | "Kopen en vasthouden"
  | "Kapitaalbehoud"
  // Waarom ze handelen
  | "Contrair"
  | "Marktcycli"
  | "Risicobeheersing"
  | "Macro"
  | "Activisme"
  | "Bijzondere situaties"
  | "Asymmetrisch risico"
  // Waar ze zitten
  | "Technologie"
  | "Industrie"
  | "Wereldwijd"
  | "Verzekeraar";

export type Investor = {
  /** URL-segment van /topbeleggers/[slug]. Uniek, kleine letters, streepjes. */
  slug: string;
  name: string;
  /** Het huis waar vanuit belegd wordt. Nooit een functietitel. */
  firm: string;
  styleGroup: StyleGroupSlug;
  /** Twee of drie, in de asvolgorde van `StyleTag`. */
  styleTags: StyleTag[];
  horizon: Horizon;
  /** Eén alinea op /topbeleggers/[slug]. Wat deze belegger zoekt, niet wat hij bezit. */
  summary: string;
};

export const styleGroups: {
  slug: StyleGroupSlug;
  label: string;
  description: string;
}[] = [
  {
    slug: "kwaliteit",
    label: "Kwaliteit en compounders",
    description:
      "Weinig bedrijven, lang vasthouden. Het rendement moet uit de groei van " +
      "de onderneming zelf komen: winst die keer op keer tegen een hoog " +
      "rendement wordt herinvesteerd — dat zijn de compounders. Een hogere " +
      "prijs is hier aanvaardbaar zolang het bedrijf maar goed genoeg is.",
  },
  {
    slug: "waarde",
    label: "Waarde en veiligheidsmarge",
    description:
      "Gevestigde bedrijven die te doorgronden zijn, gekocht met een verschil " +
      "tussen de prijs en de geschatte waarde. Het gaat om die korting, niet " +
      "om het herstel van een hele sector.",
  },
  {
    slug: "contrair",
    label: "Contrair en cyclisch",
    description:
      "Kopen wat op dat moment onpopulair is: grondstoffen, scheepvaart, " +
      "bedrijven in nood, of een sector die laag in zijn cyclus staat. Zelden " +
      "comfortabel op het moment van kopen, en het wachten kan jaren duren.",
  },
  {
    slug: "groei",
    label: "Groei en technologie",
    description:
      "Bedrijven met een grote markt vóór zich in plaats van marktaandeel in " +
      "een bestaande. Hogere waarderingen worden geaccepteerd zolang de groei " +
      "erachter standhoudt.",
  },
  {
    slug: "activisme",
    label: "Activisme en bijzondere situaties",
    description:
      "De aanleiding is een gebeurtenis of een ingreep: een overname, een " +
      "afsplitsing, een bestuurswissel, of een aandeelhouder die zelf op " +
      "verandering aanstuurt. Posities kunnen groot zijn en korter duren.",
  },
];

/**
 * De beleggers op /topbeleggers. Bron: `docs/thirty_investors.md`.
 *
 * INSLUITINGSREGEL — bij iedere toevoeging opnieuw langslopen. Dit is geen
 * rangschikking en wij bepalen niet wie "de grootste" is. Opgenomen wordt wie
 * (a) belegt vanuit een vehikel dat 13F-plichtig is of publiek rapporteert,
 * (b) nog actief is, en (c) breed genoeg gevolgd wordt dat er publieke
 * uitspraken te citeren zijn. Binnen een stijl alfabetisch op achternaam —
 * nadrukkelijk niet naar omvang of resultaat.
 *
 * DE INDELING IS VAN ONS. Eerder stond hier dat `styleGroup`, `styleTags` en
 * `horizon` de eigen woorden van de beleggers waren. Dat was niet zo, en die
 * belofte staat daarom ook niet meer op de pagina. De indeling is afgeleid uit
 * hoe deze mensen publiek over hun aanpak spreken en hoe hun portefeuille
 * eruitziet. Wie meerdere stijlen bespeelt staat bij de stijl die zijn gedrag
 * het sterkst bepaalt — Ackman en Hohn kopen kwaliteit, maar het is de ingreep
 * in het bedrijf die hen onderscheidt, dus staan ze bij `activisme`.
 *
 * TE CONTROLEREN VOOR PUBLICATIE — stijl, horizon én `summary` komen uit een
 * concept dat door een taalmodel is opgesteld en zijn nergens aan een
 * vindplaats gekoppeld. Dat is precies wat de huisregel niet toestaat: dit zijn
 * echte mensen. Loop per regel na (1) of de persoon nog actief is en het huis
 * nog rapporteert, en (2) of stijl, horizon en alinea terug te voeren zijn op
 * een uitspraak of een filing, met platform en datum. Wat niet te staven is,
 * gaat eruit — niet afgezwakt. De vindplaats zelf hoort op de profielpagina.
 */
export const investors: Investor[] = [
  // Kwaliteit en compounders
  {
    slug: "chuck-akre",
    name: "Chuck Akre",
    firm: "Akre Capital Management",
    styleGroup: "kwaliteit",
    styleTags: ["Kwaliteit", "Compounders", "Kopen en vasthouden"],
    horizon: "Zeer lang",
    summary:
      "Akre zoekt drie dingen: uitstekende bedrijven, uitstekende managers en " +
      "de mogelijkheid om kapitaal langdurig tegen hoge rendementen te " +
      "herinvesteren. Vervolgens wil hij die ondernemingen jarenlang bezitten.",
  },
  {
    slug: "warren-buffett",
    name: "Warren Buffett",
    firm: "Berkshire Hathaway",
    styleGroup: "kwaliteit",
    styleTags: ["Kwaliteit", "Waarde", "Compounders"],
    horizon: "Zeer lang",
    summary:
      "Buffett zoekt bedrijven met sterke concurrentievoordelen, hoge " +
      "rendementen op kapitaal en betrouwbare cashflows. Als hij een geweldig " +
      "bedrijf tegen een redelijke prijs kan kopen, is zijn favoriete " +
      "beleggingshorizon vrijwel onbeperkt.",
  },
  {
    slug: "pat-dorsey",
    name: "Pat Dorsey",
    firm: "Dorsey Asset Management",
    styleGroup: "kwaliteit",
    styleTags: ["Concurrentievoordeel", "Compounders", "Geconcentreerd"],
    horizon: "Lang",
    summary:
      "Dorsey zoekt bedrijven met een economic moat: een concurrentievoordeel " +
      "dat moeilijk te kopiëren is. Zijn strategie concentreert het kapitaal " +
      "in ongeveer 10 tot 15 ondernemingen die volgens hem langdurig waarde " +
      "kunnen laten groeien.",
  },
  {
    slug: "francois-rochon",
    name: "François Rochon",
    firm: "Giverny Capital",
    styleGroup: "kwaliteit",
    styleTags: ["Kwaliteit", "Groei", "Compounders"],
    horizon: "Zeer lang",
    summary:
      "Rochon zoekt bedrijven met sterke concurrentievoordelen, goede " +
      "managementteams en aantrekkelijke groeimogelijkheden. Hij kijkt vooral " +
      "naar wat een onderneming over vijf of tien jaar waard kan zijn.",
  },
  {
    slug: "david-rolfe",
    name: "David Rolfe",
    firm: "Wedgewood Partners",
    styleGroup: "kwaliteit",
    styleTags: ["Kwaliteit", "Geconcentreerd", "Kopen en vasthouden"],
    horizon: "Zeer lang",
    summary:
      "Rolfe wil beleggen als eigenaar van een onderneming. Daarom kiest hij " +
      "slechts een beperkt aantal bedrijven met sterke economische " +
      "eigenschappen en probeert hij zo weinig mogelijk te handelen.",
  },
  {
    slug: "thomas-russo",
    name: "Thomas Russo",
    firm: "Gardner Russo & Quinn",
    styleGroup: "kwaliteit",
    styleTags: ["Kwaliteit", "Compounders", "Wereldwijd"],
    horizon: "Zeer lang",
    summary:
      "Russo zoekt bedrijven die veel kunnen investeren in hun eigen groei. " +
      "Zijn favoriete ondernemingen kunnen jarenlang kapitaal herinvesteren, " +
      "waardoor compounding steeds krachtiger wordt.",
  },
  {
    slug: "terry-smith",
    name: "Terry Smith",
    firm: "Fundsmith",
    styleGroup: "kwaliteit",
    styleTags: ["Kwaliteit", "Compounders", "Kopen en vasthouden"],
    horizon: "Zeer lang",
    summary:
      "Smith zoekt bedrijven met sterke merken, hoge rendementen op kapitaal " +
      "en een lange groeirunway. Zijn filosofie is eenvoudig: koop goede " +
      "bedrijven, betaal een redelijke prijs en handel zo weinig mogelijk.",
  },
  {
    slug: "josh-tarasoff",
    name: "Josh Tarasoff",
    firm: "Greenlea Lane Capital",
    styleGroup: "kwaliteit",
    styleTags: ["Kwaliteit", "Compounders", "Geconcentreerd"],
    horizon: "Zeer lang",
    summary:
      "Tarasoff combineert ideeën van Buffett en Munger met een sterke focus " +
      "op kapitaalallocatie. Hij zoekt bedrijven met duurzame voordelen en " +
      "managementteams die cash verstandig kunnen herinvesteren.",
  },

  // Waarde en veiligheidsmarge
  {
    slug: "leon-cooperman",
    name: "Leon Cooperman",
    firm: "Omega Advisors",
    styleGroup: "waarde",
    styleTags: ["Waarde", "Fundamenteel onderzoek"],
    horizon: "Middellang",
    summary:
      "Cooperman is een klassieke fundamentele belegger. Hij zoekt " +
      "ondernemingen waarvan de beurskoers volgens zijn analyse te " +
      "pessimistisch is ten opzichte van de toekomstige winstcapaciteit en " +
      "kasstromen.",
  },
  {
    slug: "glenn-greenberg",
    name: "Glenn Greenberg",
    firm: "Brave Warrior Advisors",
    styleGroup: "waarde",
    styleTags: ["Kwaliteit", "Fundamenteel onderzoek", "Geconcentreerd"],
    horizon: "Lang",
    summary:
      "Greenberg doet diepgaand fundamenteel onderzoek voordat hij een " +
      "positie inneemt. Hij probeert een onderneming te begrijpen alsof hij " +
      "het hele bedrijf zou moeten kopen.",
  },
  {
    slug: "seth-klarman",
    name: "Seth Klarman",
    firm: "Baupost Group",
    styleGroup: "waarde",
    styleTags: ["Waarde", "Veiligheidsmarge", "Contrair"],
    horizon: "Lang",
    summary:
      "Klarman staat bekend om zijn nadruk op de margin of safety. Hij wil " +
      "voldoende verschil tussen de prijs die hij betaalt en de waarde die hij " +
      "denkt te krijgen, en kan geduldig wachten op de juiste kansen.",
  },
  {
    slug: "li-lu",
    name: "Li Lu",
    firm: "Himalaya Capital",
    styleGroup: "waarde",
    styleTags: ["Waarde", "Kwaliteit", "Geconcentreerd"],
    horizon: "Zeer lang",
    summary:
      "Li Lu zoekt ondernemingen die volgens hem veel meer waard zijn dan de " +
      "marktprijs suggereert. Zijn portefeuille is zeer geconcentreerd en zijn " +
      "beleggingshorizon uitzonderlijk lang.",
  },
  {
    slug: "bill-nygren",
    name: "Bill Nygren",
    firm: "Oakmark Funds",
    styleGroup: "waarde",
    styleTags: ["Waarde", "Fundamenteel onderzoek"],
    horizon: "Lang",
    summary:
      "Nygren zoekt ondernemingen die goedkoper zijn dan hun toekomstige " +
      "economische waarde rechtvaardigt. Hij kijkt daarbij verder dan simpele " +
      "multiples en probeert vooral de toekomstige winstcapaciteit te begrijpen.",
  },
  {
    slug: "wallace-weitz",
    name: "Wallace Weitz",
    firm: "Weitz Investment Management",
    styleGroup: "waarde",
    styleTags: ["Waarde", "Kwaliteit"],
    horizon: "Lang",
    summary:
      "Weitz combineert klassieke value investing met een voorkeur voor " +
      "kwalitatief sterke bedrijven. Hij zoekt ondernemingen die tegen een " +
      "redelijke prijs gekocht kunnen worden en waarvan de intrinsieke waarde " +
      "kan groeien.",
  },

  // Contrair en cyclisch
  {
    slug: "mason-hawkins",
    name: "Mason Hawkins",
    firm: "Southeastern Asset Management",
    styleGroup: "contrair",
    styleTags: ["Diepe waarde", "Contrair"],
    horizon: "Lang",
    summary:
      "Hawkins zoekt bedrijven waarvan de intrinsieke waarde volgens hem " +
      "aanzienlijk hoger ligt dan de beurskoers. Hij heeft het geduld om jaren " +
      "te wachten tot die waarde zichtbaar wordt.",
  },
  {
    slug: "howard-marks",
    name: "Howard Marks",
    firm: "Oaktree Capital Management",
    styleGroup: "contrair",
    styleTags: ["Marktcycli", "Risicobeheersing", "Contrair"],
    horizon: "Cyclisch",
    summary:
      "Marks kijkt vooral naar risico, marktcycli en het gedrag van andere " +
      "beleggers. Zijn uitgangspunt is dat je de toekomst niet perfect hoeft " +
      "te voorspellen als je maar voorkomt dat je op verkeerde momenten te " +
      "veel risico neemt.",
  },
  {
    slug: "mohnish-pabrai",
    name: "Mohnish Pabrai",
    firm: "Pabrai Investments",
    styleGroup: "contrair",
    styleTags: ["Diepe waarde", "Geconcentreerd", "Asymmetrisch risico"],
    horizon: "Lang",
    summary:
      "Pabrai is sterk geïnspireerd door Buffett en Munger. Hij zoekt " +
      "situaties waarin het neerwaartse risico beperkt is, terwijl een " +
      "succesvolle ontwikkeling van het bedrijf een veelvoud van de " +
      "investering kan opleveren.",
  },
  {
    slug: "john-rogers",
    name: "John Rogers",
    firm: "Ariel Investments",
    styleGroup: "contrair",
    styleTags: ["Waarde", "Contrair"],
    horizon: "Lang",
    summary:
      "Rogers zoekt bedrijven die tijdelijk uit de gratie zijn geraakt. Zijn " +
      "aanpak draait om fundamentele analyse, geduld en de overtuiging dat de " +
      "markt op korte termijn emotioneler kan zijn dan de onderliggende waarde " +
      "van een onderneming.",
  },
  {
    slug: "david-tepper",
    name: "David Tepper",
    firm: "Appaloosa Management",
    styleGroup: "contrair",
    styleTags: ["Waarde", "Contrair", "Macro"],
    horizon: "Flexibel",
    summary:
      "Tepper combineert fundamentele analyse met een sterke focus op " +
      "economie, rente en marktsentiment. Hij zoekt situaties waarin de markt " +
      "volgens hem een bedrijf te pessimistisch of juist te optimistisch " +
      "waardeert.",
  },
  {
    slug: "arnold-van-den-berg",
    name: "Arnold Van Den Berg",
    firm: "Century Management",
    styleGroup: "contrair",
    styleTags: ["Waarde", "Kapitaalbehoud"],
    horizon: "Lang",
    summary:
      "Van Den Berg is een klassieke value investor met veel aandacht voor " +
      "waardering, balanskwaliteit en kapitaalbehoud. Hij zoekt bedrijven " +
      "waarbij de markt volgens hem te weinig oog heeft voor de onderliggende " +
      "waarde.",
  },
  {
    slug: "prem-watsa",
    name: "Prem Watsa",
    firm: "Fairfax Financial",
    styleGroup: "contrair",
    styleTags: ["Waarde", "Kopen en vasthouden", "Verzekeraar"],
    horizon: "Zeer lang",
    summary:
      "Watsa combineert verzekeren met beleggen en bouwt daardoor een " +
      "portefeuille vanuit een langetermijnperspectief. Hij zoekt " +
      "ondernemingen die aantrekkelijk gewaardeerd zijn en waarde kunnen " +
      "creëren over vele jaren.",
  },

  // Groei en technologie
  {
    slug: "lee-ainslie",
    name: "Lee Ainslie",
    firm: "Maverick Capital",
    styleGroup: "groei",
    styleTags: ["Groei", "Fundamenteel onderzoek", "Technologie"],
    horizon: "Middellang",
    summary:
      "Ainslie combineert fundamentele analyse met een actieve " +
      "hedgefondsaanpak. Hij zoekt bedrijven waarvan de toekomstige " +
      "winstontwikkeling volgens hem onvoldoende in de huidige koers zit.",
  },
  {
    slug: "chase-coleman",
    name: "Chase Coleman",
    firm: "Tiger Global",
    styleGroup: "groei",
    styleTags: ["Groei", "Technologie"],
    horizon: "Lang",
    summary:
      "Coleman zoekt ondernemingen met enorme groeimarkten en sterke " +
      "competitieve posities. Technologie, internet en digitale platforms " +
      "vormen een belangrijk onderdeel van zijn beleggingswereld.",
  },
  {
    slug: "henry-ellenbogen",
    name: "Henry Ellenbogen",
    firm: "Durable Capital",
    styleGroup: "groei",
    styleTags: ["Groei", "Kwaliteit", "Compounders"],
    horizon: "Lang",
    summary:
      "Ellenbogen zoekt bedrijven die hun concurrentiepositie kunnen " +
      "versterken en daardoor jarenlang kunnen groeien. Hij kijkt vooral naar " +
      "de kwaliteit van het bedrijf en de omvang van de toekomstige markt.",
  },
  {
    slug: "stephen-mandel",
    name: "Stephen Mandel",
    firm: "Lone Pine Capital",
    styleGroup: "groei",
    styleTags: ["Groei", "Kwaliteit", "Geconcentreerd"],
    horizon: "Lang",
    summary:
      "Mandel zoekt bedrijven met grote marktkansen, sterke managementteams " +
      "en het vermogen hun winst langdurig te laten groeien.",
  },

  // Activisme en bijzondere situaties
  {
    slug: "bill-ackman",
    name: "Bill Ackman",
    firm: "Pershing Square",
    styleGroup: "activisme",
    styleTags: ["Kwaliteit", "Geconcentreerd", "Activisme"],
    horizon: "Lang",
    summary:
      "Ackman belegt geconcentreerd in een klein aantal bedrijven waarin hij " +
      "een sterke overtuiging heeft. Hij zoekt hoogwaardige ondernemingen en " +
      "probeert soms als actieve aandeelhouder zelf veranderingen te " +
      "versnellen.",
  },
  {
    slug: "david-einhorn",
    name: "David Einhorn",
    firm: "Greenlight Capital",
    styleGroup: "activisme",
    styleTags: ["Waarde", "Contrair", "Bijzondere situaties"],
    horizon: "Middellang",
    summary:
      "Einhorn zoekt grote verschillen tussen de beurskoers en zijn " +
      "inschatting van de intrinsieke waarde. Hij belegt bovendien in " +
      "bijzondere situaties en gebruikt ook shortposities wanneer hij denkt " +
      "dat verwachtingen te hoog zijn.",
  },
  {
    slug: "chris-hohn",
    name: "Chris Hohn",
    firm: "TCI Fund Management",
    styleGroup: "activisme",
    styleTags: ["Kwaliteit", "Geconcentreerd", "Activisme"],
    horizon: "Lang",
    summary:
      "Hohn bouwt zeer geconcentreerde posities in ondernemingen met sterke " +
      "economische eigenschappen. Vervolgens probeert hij als aandeelhouder " +
      "invloed uit te oefenen op strategie, efficiëntie en kapitaalallocatie.",
  },
  {
    slug: "daniel-loeb",
    name: "Daniel Loeb",
    firm: "Third Point",
    styleGroup: "activisme",
    styleTags: ["Waarde", "Activisme", "Bijzondere situaties"],
    horizon: "Middellang",
    summary:
      "Loeb zoekt situaties waarin een concrete gebeurtenis waarde kan " +
      "ontsluiten. Dat kan een strategische verandering, verkoop van " +
      "activiteiten, fusie of verbetering van kapitaalallocatie zijn.",
  },
  {
    slug: "alex-roepers",
    name: "Alex Roepers",
    firm: "Atlantic Investment Management",
    styleGroup: "activisme",
    styleTags: ["Waarde", "Bijzondere situaties", "Industrie"],
    horizon: "Middellang",
    summary:
      "Roepers richt zich sterk op industriële bedrijven waar operationele " +
      "verbeteringen nog niet volledig in de beurskoers zijn verwerkt. Hij " +
      "zoekt ondernemingen waar winstgevendheid en kasstromen kunnen " +
      "verbeteren.",
  },
];

/** Shown above the ink footer. The promise the whole site is built on. */
export const positioning =
  "De Amerikabelegger verzamelt en ordent wat Amerikaanse beleggers publiceren. " +
  "Wij voeren geen eigen onderzoek uit.";

export const disclaimer =
  "Niets op deze site is beleggingsadvies. Wij geven meningen van derden weer, " +
  "voorzien van bron en datum. Beleggen brengt risico's met zich mee; je kunt je inleg verliezen.";

/*
 * The three working principles, for /over-ons. Three is the whole list — they
 * are the promises the site is judged on, not a values wall. The first one is
 * the rule that outranks the rest in docs/STYLE_GUIDE.md, stated in public.
 */
export const principles = [
  {
    title: "De bron staat erbij",
    body:
      "Elke uitspraak hier is van iemand anders, en die iemand staat erbij: naam, " +
      "platform, datum. Zonder bron plaatsen we het niet.",
  },
  {
    title: "Ordenen is het werk",
    body:
      "Aan Amerikaanse marktcommentaar is geen gebrek. Wij selecteren en wegen wat " +
      "het volgen waard is en brengen het terug tot drie categorieën.",
  },
  {
    title: "Een mening is geen onderzoek",
    body:
      "Waar wij zelf iets vinden, staat Redactie erboven en ziet het er anders uit " +
      "dan alles wat wij citeren. Eigen onderzoek doen wij niet.",
  },
];

/*
 * The four people behind the site, oldest hand first.
 *
 * Bios are drawn from public sources and stay factual: a role line and two
 * sentences is the entire format. No portraits — photography is homepage-only
 * (docs/STYLE_GUIDE.md), and a row of headshots would be the fifth ornament.
 */
export const team: {
  name: string;
  role: string;
  bio: string;
  href: string;
}[] = [
  {
    name: "Aart Lensink",
    role: "Merk en positionering",
    bio:
      "Richtte contentmarketingbureau LVB op en leidde het 27 jaar, daarna managing " +
      "director van iO Campus Utrecht. Contentmarketeer van het Jaar 2018, auteur van " +
      "twee boeken over het vak, en inmiddels zelfstandig merkadviseur voor de " +
      "financiële sector.",
    href: "https://www.linkedin.com/in/aart-lensink-992192/",
  },
  {
    name: "Coen Huibers",
    role: "Redactie en productie",
    bio:
      "Partner bij LVB, sinds de overname onderdeel van iO. Bouwde daar aan video, " +
      "brand publishing en geïntegreerde merkcampagnes — het maakwerk waar deze site " +
      "dagelijks op draait.",
    href: "https://www.linkedin.com/in/coenhuibers/",
  },
  {
    name: "Daniël Lensink",
    role: "AI en distributie",
    bio:
      "AI-native contentmarketeer, werkzaam bij hypotheekverstrekker Frits. Houdt " +
      "bij wat er te halen valt uit nieuwe tooling en waar het handwerk moet blijven.",
    href: "https://www.linkedin.com/in/daniel-lensink/",
  },
  {
    // PLACEHOLDER — nothing verifiable about this Sam Huibers is public, so this
    // bio is invented scaffolding. Replace before the page goes live.
    name: "Sam Huibers",
    role: "Techniek en vormgeving",
    bio:
      "Bouwt en onderhoudt De Amerikabelegger: de site, de vormgeving en de manier " +
      "waarop het archief wordt opgeslagen.",
    href: "https://www.linkedin.com/in/sam-huibers/",
  },
];
