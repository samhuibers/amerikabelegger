import { createHash } from "node:crypto";
import {
  getLatestQuarter,
  getPortfolio,
  getPreviousPortfolio,
  investors,
  portfolioPeriod,
  positionChanges,
  topPositions,
  type Portfolio,
} from "@/lib/content";
import { formatDate, formatQuarter, formatRoughShare, formatWeight } from "@/lib/format";

/*
 * De posts voor X: welke er bestaan, wanneer ze uitgaan en wat erin staat.
 * Niet in lib/content.ts, want een post is geen opgeslagen inhoud maar iets dat
 * daaruit berekend wordt. De voorvertoning en later de Telegram-route lezen hier.
 */

/** Kleurnamen uit `tokens` in app/kaart/shell.tsx. Een naam, geen hexwaarde: lib/ importeert niet uit app/. */
type Accent = "brass" | "giants" | "growers" | "moonshots";

/**
 * Elk posttype, ook de nog niet gebouwde. De kaartband en de voorvertoning
 * lezen label en kleur hier, zodat een gekozen kaartontwerp voor alle types
 * tegelijk geldt. `null` is nog niet besloten (zie TODO.md).
 */
export const postTypes = {
  topbelegger: {
    label: "Topbelegger van de week",
    accent: "brass",
    slot: "Vrijdag 15:00",
    status: "Kaart en tekst klaar",
  },
  kwartaalseizoen: {
    label: "Kwartaalseizoen",
    accent: "brass",
    slot: "Maandag tot en met donderdag 15:00, twee weken na elke 13F-deadline",
    status: "Kaart en tekst klaar",
  },
  "wall-street-gisteren": {
    label: "Wall Street gisteren",
    accent: null,
    slot: "Maandag tot en met vrijdag 07:30",
    status: "Wacht op een bron voor koersdata",
  },
  giant: {
    label: "Giant van de week",
    accent: "giants",
    slot: "Dinsdag 15:00",
    status: "Na de lancering; wacht op de bedrijventabel",
  },
  grower: {
    label: "Grower van de week",
    accent: "growers",
    slot: "Woensdag 15:00",
    status: "Na de lancering; wacht op de bedrijventabel",
  },
  moonshot: {
    label: "Moonshot van de week",
    accent: "moonshots",
    slot: "Donderdag 15:00",
    status: "Na de lancering; wacht op de bedrijventabel",
  },
  "week-vooruit": {
    label: "Week vooruit",
    accent: null,
    slot: "Maandag 15:00",
    status: "Na de lancering; wacht op een kalender met kwartaalcijfers",
  },
  alert: {
    label: "Alert",
    accent: null,
    slot: null,
    status: "Na de lancering; wacht op het volgen van 13D/13G-meldingen",
  },
} satisfies Record<string, { label: string; accent: Accent | null; slot: string | null; status: string }>;

export type PostType = keyof typeof postTypes;

export type Post = {
  type: PostType;
  /** De postdag als kalenderdatum in Amsterdam: "2026-11-13". */
  date: string;
  /** Klaar om te plaatsen. */
  text: string;
  /** Pad van de kaart-PNG. */
  card: string;
};

/** Langer mag een post op X niet zijn, geteld met `xLength`. */
export const X_LIMIT = 280;

/*
 * Tekens zoals X ze telt (twitter-text, versie 3): Latijnse letters, cijfers en
 * gewone leestekens tellen 1, al het andere 2. Dat zijn emoji, maar ook de echte
 * min (U+2212) en de smalle harde spatie (U+202F) uit lib/format.ts. Emoji die
 * uit meerdere tekens bestaan telt X als 2 en wij hoger, maar emoji gebruiken we niet.
 */
const singleWeight = [
  [0, 4351],
  [8192, 8205],
  [8208, 8223],
  [8242, 8247],
];

export function xLength(text: string) {
  let length = 0;
  for (const char of text.normalize("NFC")) {
    const code = char.codePointAt(0)!;
    length += singleWeight.some(([low, high]) => code >= low && code <= high) ? 1 : 2;
  }
  return length;
}

/*
 * Rekenen met kalenderdagen gebeurt in dagnummers (dagen sinds 1 januari 1970,
 * in UTC). Zo kent een week altijd zeven dagen, ook rond de zomertijd.
 */
const DAY = 24 * 60 * 60 * 1000;
const dayNumber = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / DAY;
const isoDay = (day: number) => new Date(day * DAY).toISOString().slice(0, 10);
const weekday = (day: number) => new Date(day * DAY).getUTCDay();
const THURSDAY = 4;
const FRIDAY = 5;

/**
 * Welke dag het nu in Amsterdam is, als "2026-10-27". De server draait in UTC,
 * en tussen middernacht en 01:00 (02:00 in de zomer) is het daar nog gisteren.
 * De Canadese notatie is toevallig precies het ISO-formaat.
 */
export function amsterdamDate(now: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam" }).format(now);
}

/** De eerste Topbelegger van de week. Waarschijnlijk, nog niet definitief (TODO.md). */
const ROTATION_START = "2026-11-13";

/*
 * Iedereen één keer voordat iemand terugkomt. Bekende namen eerst voor de
 * lancering, daarna door elkaar, en nooit twee weken achter elkaar dezelfde
 * stijl (ook niet van week 30 terug naar week 1).
 */
const rotation = [
  "warren-buffett",
  "bill-ackman",
  "howard-marks",
  "li-lu",
  "chase-coleman",
  "terry-smith",
  "david-tepper",
  "seth-klarman",
  "david-einhorn",
  "mohnish-pabrai",
  "chuck-akre",
  "stephen-mandel",
  "bill-nygren",
  "daniel-loeb",
  "prem-watsa",
  "pat-dorsey",
  "leon-cooperman",
  "chris-hohn",
  "henry-ellenbogen",
  "thomas-russo",
  "mason-hawkins",
  "glenn-greenberg",
  "francois-rochon",
  "alex-roepers",
  "john-rogers",
  "lee-ainslie",
  "david-rolfe",
  "wallace-weitz",
  "josh-tarasoff",
  "arnold-van-den-berg",
];

// Gooit al bij het laden, zodat een belegger die aan `investors` wordt
// toegevoegd niet stilletjes wordt overgeslagen.
const roster = new Set(investors.map((investor) => investor.slug));
if (rotation.length !== roster.size || new Set(rotation).size !== rotation.length || !rotation.every((slug) => roster.has(slug))) {
  throw new Error("De rotatie in lib/posts.ts moet elke slug uit `investors` precies één keer bevatten.");
}
if (weekday(dayNumber(ROTATION_START)) !== FRIDAY) {
  throw new Error("ROTATION_START in lib/posts.ts moet een vrijdag zijn.");
}

/*
 * Drie openingszinnen, op weeknummer, zodat twee weken achter elkaar nooit
 * hetzelfde beginnen. Geen voornaamwoorden: daar hebben we geen bron voor.
 */
const openings = [
  (name: string, firm: string) => `Topbelegger van de week: ${name} (${firm}).`,
  (name: string, firm: string) => `Deze week uitgelicht: ${name} (${firm}).`,
  (name: string, firm: string) => `Waarin belegt ${name} (${firm})?`,
];

/**
 * De Topbelegger-post op `date` (een vrijdag vanaf ROTATION_START). Elk getal
 * komt uit de data en gaat door lib/format.ts. Geen links (die kosten via de API
 * $ 0,20 per post en kosten bereik) en geen adviestaal.
 */
export async function topbeleggerPost(date: string): Promise<Post> {
  const week = (dayNumber(date) - dayNumber(ROTATION_START)) / 7;
  const slug = rotation[week % rotation.length];
  const investor = investors.find((i) => i.slug === slug)!;
  const portfolio = await getPortfolio(slug);
  if (!portfolio) throw new Error(`Geen 13F voor ${slug}.`);

  // Hetzelfde aantal als de profielpagina: elke aandelenklasse telt mee.
  const count = portfolio.holdings.filter((h) => h.shareType === "SH" && !h.putCall).length;
  const positions = topPositions(portfolio, Infinity);
  const top = positions.slice(0, 3);
  const share = top.reduce((sum, position) => sum + position.weight, 0);
  const period = portfolioPeriod(portfolio);
  const cashtags = top.flatMap((position) => (position.ticker ? [`$${position.ticker}`] : []));

  const lines = [
    openings[week % openings.length](investor.name, investor.firm),
    "",
    positions.length > 3
      ? `Top 3 van ${count} aandelenposities (samen ${formatRoughShare(share)}):`
      : "Alle aandelenposities:",
    ...top.map((position) => `${position.name} ${formatWeight(position.weight)}`),
    "",
    `Bron: 13F over ${formatQuarter(period.quarter, period.year)}, ingediend bij de SEC op ${formatDate(period.filed)}.`,
  ];
  const text = lines.join("\n");
  // Cashtags zijn het enige dat weg kan. Wordt het daarna nog te lang, dan toont de voorvertoning dat.
  const withCashtags = `${text}\n\n${cashtags.join(" ")}`;

  return {
    type: "topbelegger",
    date,
    text: cashtags.length && xLength(withCashtags) <= X_LIMIT ? withCashtags : text,
    card: `/kaart/topbelegger/${slug}`,
  };
}

/** De eerstvolgende `count` posts vanaf `from` (zelf meegeteld). Voorlopig alleen de vrijdagse Topbelegger. */
export function upcomingPosts(from: string, count: number) {
  let day = Math.max(dayNumber(from), dayNumber(ROTATION_START));
  day += (FRIDAY - weekday(day) + 7) % 7;
  return Promise.all(Array.from({ length: count }, (_, i) => topbeleggerPost(isoDay(day + 7 * i))));
}

/*
 * Kwartaalseizoen: vier keer per jaar neemt "Wat kochten en verkochten de
 * topbeleggers?" twee weken lang de 15:00-posts van maandag tot en met
 * donderdag over. Vrijdag blijft Topbelegger van de week.
 */

/**
 * De 13F-deadline voor het kwartaal dat op `quarterEnd` eindigt: 45 dagen
 * later, en valt dat in een weekend of op Presidents' Day (de derde maandag
 * van februari), dan de eerstvolgende werkdag. Andere Amerikaanse feestdagen
 * vallen nooit op een 13F-deadline.
 */
function filingDeadline(quarterEnd: string) {
  const isPresidentsDay = (day: number) => {
    const date = new Date(day * DAY);
    return date.getUTCMonth() === 1 && weekday(day) === 1 && date.getUTCDate() >= 15 && date.getUTCDate() <= 21;
  };
  let day = dayNumber(quarterEnd) + 45;
  while (weekday(day) === 0 || weekday(day) === 6 || isPresidentsDay(day)) day++;
  return day;
}

/** De postdagen van een seizoen: maandag tot en met donderdag in de tien werkdagen na de deadline. */
export function seasonDays(quarterEnd: string) {
  const days = [];
  let day = filingDeadline(quarterEnd);
  for (let weekdays = 0; weekdays < 10; ) {
    day++;
    if (weekday(day) === 0 || weekday(day) === 6) continue;
    weekdays++;
    if (weekday(day) <= THURSDAY) days.push(isoDay(day));
  }
  return days;
}

/*
 * Wie op welke dag: er wordt niets opgeslagen over wat al geplaatst is, dus de
 * volgorde volgt alleen uit de data. Eerst wie op tijd indiende, in de volgorde
 * van de rotatie (bekende namen eerst); daarna de laatkomers, op indieningsdatum.
 * Wie niets nieuws kocht en niets helemaal verkocht, heeft geen nieuws.
 */
async function seasonOrder(quarterEnd: string) {
  const deadline = filingDeadline(quarterEnd);
  const candidates = [];
  for (const slug of rotation) {
    const latest = await getPortfolio(slug);
    const previous = await getPreviousPortfolio(slug);
    if (!latest || !previous || latest.period !== quarterEnd) continue;
    const changes = positionChanges(latest, previous);
    if (changes.added.length || changes.sold.length) {
      candidates.push({ slug, latest, changes, late: dayNumber(latest.filed) > deadline });
    }
  }
  const late = candidates.filter((c) => c.late).sort((a, b) => a.latest.filed.localeCompare(b.latest.filed));
  return [...candidates.filter((c) => !c.late), ...late];
}

/** De eerste `count`, en de rest als aantal. */
function shortList<T>(items: T[], count: number, line: (item: T) => string) {
  const rest = items.length - count;
  return [...items.slice(0, count).map(line), ...(rest > 0 ? [`en nog ${rest} kleinere`] : [])];
}

/*
 * De tekst met zoveel mogelijk namen: drie per lijst, anders twee, anders één,
 * telkens eerst met cashtags. Een korte post houdt alles, een lange levert het
 * minst belangrijke het eerst in. De kaart toont altijd drie per lijst.
 */
function seasonText(
  name: string,
  firm: string,
  latest: Portfolio,
  changes: ReturnType<typeof positionChanges>,
) {
  const period = portfolioPeriod(latest);
  let text = "";
  for (const count of [3, 2, 1]) {
    text = [
      `Wat kocht en verkocht ${name} (${firm})?`,
      ...(changes.added.length
        ? ["", "Nieuw:", ...shortList(changes.added, count, (p) => `${p.name} ${formatWeight(p.weight)}`)]
        : []),
      ...(changes.sold.length ? ["", "Helemaal verkocht:", ...shortList(changes.sold, count, (p) => p.name)] : []),
      "",
      `Bron: 13F over ${formatQuarter(period.quarter, period.year)}, ingediend bij de SEC op ${formatDate(period.filed)}.`,
    ].join("\n");
    const shown = [...changes.added.slice(0, count), ...changes.sold.slice(0, count)];
    const cashtags = shown.flatMap((position) => (position.ticker ? [`$${position.ticker}`] : []));
    const withCashtags = `${text}\n\n${cashtags.join(" ")}`;
    if (cashtags.length && xLength(withCashtags) <= X_LIMIT) return withCashtags;
    if (xLength(text) <= X_LIMIT) return text;
  }
  // Ook met één naam per lijst te lang: de voorvertoning toont het.
  return text;
}

/** De posts van het seizoen na het kwartaal dat op `quarterEnd` eindigt, één per postdag. */
export async function seasonPosts(quarterEnd: string): Promise<Post[]> {
  const order = await seasonOrder(quarterEnd);
  return seasonDays(quarterEnd)
    .slice(0, order.length)
    .map((date, i) => {
      const { slug, latest, changes } = order[i];
      const investor = investors.find((inv) => inv.slug === slug)!;
      return {
        type: "kwartaalseizoen",
        date,
        text: seasonText(investor.name, investor.firm, latest, changes),
        card: `/kaart/kwartaalseizoen/${slug}`,
      };
    });
}

const QUARTER_ENDS = ["03-31", "06-30", "09-30", "12-31"];

/** Het seizoen van het nieuwste kwartaal in de data: wat de voorvertoning toont. */
export async function latestSeasonPosts() {
  const { year, quarter } = await getLatestQuarter();
  return seasonPosts(`${year}-${QUARTER_ENDS[quarter - 1]}`);
}

/*
 * Welke post op een dag uitgaat. Er wordt niets opgeslagen tussen voorstel en
 * goedkeuring: de knop in Telegram draagt type, datum en vingerafdruk, en bij
 * de tik rekent `postFor` dezelfde post opnieuw uit.
 */

/** De post van `type` op `date`, of `null` als dat type die dag niets heeft. */
export async function postFor(type: string, date: string): Promise<Post | null> {
  if (type === "topbelegger") {
    return weekday(dayNumber(date)) === FRIDAY && date >= ROTATION_START ? topbeleggerPost(date) : null;
  }
  if (type === "kwartaalseizoen") {
    const year = Number(date.slice(0, 4));
    const quarterEnd = [year - 1, year]
      .flatMap((y) => QUARTER_ENDS.map((end) => `${y}-${end}`))
      .find((end) => seasonDays(end).includes(date));
    return quarterEnd ? ((await seasonPosts(quarterEnd)).find((post) => post.date === date) ?? null) : null;
  }
  return null;
}

/** De post van 15:00 op `date`: in een seizoen Kwartaalseizoen (ma–do), op vrijdag Topbelegger. */
export async function todaysPost(date: string) {
  return (await postFor("kwartaalseizoen", date)) ?? (await postFor("topbelegger", date));
}

/** Acht tekens die veranderen zodra tekst, kaart, type of datum verandert. */
export function postFingerprint(post: Post) {
  return createHash("sha256").update(JSON.stringify(post)).digest("hex").slice(0, 8);
}
