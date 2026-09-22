import Link from "next/link";
import { Masthead } from "@/components/masthead";
import {
  filings,
  investors,
  styleGroups,
  type Investor,
} from "@/lib/content";
import { formatQuarter } from "@/lib/format";

export const metadata = { title: "Topbeleggers — De Amerikabelegger" };

/*
 * Een index, geen stapel kaarten. Dertig blokken met naam, huis, stijl,
 * horizon, een alinea en een lijst posities is drieduizend woorden waarin elke
 * rij op de vorige lijkt — precies het patroon dat de stijlgids uitsluit.
 *
 * De rij draagt daarom alleen wat je nodig hebt om te kiezen; de alinea en de
 * portefeuille staan op /topbeleggers/[slug]. Er zit bewust geen overlay
 * tussen: de inhoud daarvan zou de kop van die pagina zijn, en een overlay
 * heeft geen URL — op een pagina die om vergelijken vraagt is dat het verkeerde
 * ding om weg te geven.
 */
export default function Page() {
  return (
    <>
      <Masthead title="Topbeleggers" />

      <div className="mx-auto max-w-content px-6 pb-20">
        <Intro />
        <StyleNav />
        {styleGroups.map((group) => (
          <StyleGroup key={group.slug} group={group} />
        ))}
      </div>
    </>
  );
}

function Intro() {
  return (
    <div className="max-w-reading">
      <p className="text-body-l">
        De beste beleggers ter wereld kijken allemaal anders naar de beurs.
        Sommigen zoeken de beste bedrijven voor de komende tien jaar. Anderen
        zoeken juist bedrijven die tijdelijk verkeerd worden gewaardeerd.
      </p>
      {/*
       * "veelgevolgde", niet "grootste": wie de grootste is, is een meting, en
       * die meten wij niet. Het aantal komt uit de lijst zelf — een getal dat
       * met de hand wordt bijgehouden gaat een keer niet mee.
       */}
      <p className="mt-6 text-body-l">
        Op deze pagina volgen we {investors.length} veelgevolgde Amerikaanse
        beleggers met ieder hun eigen aanpak. Bekijk hun portefeuille, ontdek
        hun grootste posities en kijk wat je van hun manier van beleggen kunt
        leren.
      </p>
      <p className="mt-10 text-body-s italic text-ink-soft">
        Portefeuilles staan op de profielpagina&apos;s, op basis van de meest
        recente SEC-data, {formatQuarter(filings.quarter, filings.year)}.
      </p>
    </div>
  );
}

/*
 * Staat ná de inleiding: het is een inhoudsopgave van wat volgt, dus het mag
 * niet vóór de zin staan die uitlegt wat de pagina is.
 *
 * Hier wél een vaste onderstreping. Vijf links in een balk moeten zonder hover
 * als link te lezen zijn; bij de dertig namen hieronder zou datzelfde een muur
 * van strepen opleveren. `hover:text-seal` is hetzelfde patroon als op
 * /over-ons — vijf keer is spaarzaam, dertig keer zou dat niet zijn.
 */
function StyleNav() {
  return (
    <>
      <nav
        aria-label="Stijlen op deze pagina"
        className="mt-12 border-y border-ink/15 py-4"
      >
        {/*
         * "Beleggingsstijl:" staat er omdat vijf losse links in een balk niet
         * zeggen waar ze een keuze uit zijn. Het is geen kopje boven de balk
         * maar de aanhef van de regel zelf, zodat het op één regel meeleest.
         */}
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <p className="text-body-s font-medium text-ink">Beleggingsstijl:</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {styleGroups.map((group) => (
              <li key={group.slug}>
                <a
                  href={`#${group.slug}`}
                  className="text-body-s text-ink underline underline-offset-4 hover:text-seal"
                >
                  {group.label}
                </a>{" "}
                <span className="tabular text-body-s text-ink-soft">
                  {investors.filter((i) => i.styleGroup === group.slug).length}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/*
       * Deze regel is wat de indeling en de kolom Horizon eerlijk houdt. Zonder
       * hem publiceren we een oordeel over echte mensen zonder bron, en dat is
       * exact wat de regel die boven de rest gaat verbiedt.
       *
       * Hier stond eerder dat de indeling de eigen woorden van de beleggers
       * volgde. Dat was niet zo — de stijltermen komen uit een concept van ons.
       * Een herkomst beloven die er niet is, is erger dan er geen beloven.
       */}
      <p className="mt-4 max-w-reading text-body-s text-ink-soft">
        De indeling is van ons. We baseren die op hoe deze beleggers publiek
        over hun aanpak spreken en op wat hun portefeuille laat zien. Wie
        meerdere stijlen bespeelt staat bij de stijl die zijn keuzes het
        sterkst bepaalt. Het is geen rangschikking en geen oordeel over wie het
        beste belegt.
      </p>
    </>
  );
}

function StyleGroup({ group }: { group: (typeof styleGroups)[number] }) {
  const members = investors.filter((i) => i.styleGroup === group.slug);

  return (
    <section aria-labelledby={group.slug} className="mt-20">
      {/*
       * Het id staat op de h2, niet op de section: één id bedient zowel
       * aria-labelledby als het anker, en de browser zet de focus dan op de kop
       * zelf. Koptekst en ticker plakken niet, dus scroll-mt-8 is cosmetisch —
       * zonder valt een aangesprongen kop tegen de rand van het scherm en leest
       * dat als een weergavefout.
       */}
      <h2 id={group.slug} className="scroll-mt-8 font-display text-display-m">
        {group.label}
      </h2>
      <div className="scotch-rule mt-4 max-w-reading" />
      <p className="mt-6 max-w-reading text-body-l text-ink-soft">
        {group.description}
      </p>

      {/*
       * Kolomkoppen: één keer per sectie, en aria-hidden. Elke rij draagt zijn
       * eigen labels mee — zichtbaar op mobiel, md:sr-only op desktop — zodat
       * een schermlezer "Horizon, Zeer lang" bij de waarde hoort en niet één
       * keer losgezongen bovenaan. Vandaar geen echte <table>: een <tr> is niet
       * in een <a> te wikkelen, en dan verdwijnt de rij-als-link.
       */}
      <div
        aria-hidden
        className="mt-10 hidden border-b border-ink/15 pb-2 text-micro text-ink-soft md:grid md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.6fr)_minmax(0,0.9fr)_auto] md:gap-x-6"
      >
        <span>Belegger</span>
        <span>Stijl</span>
        <span>Horizon</span>
        <span className="w-6" />
      </div>

      <ul className="border-t border-ink/15 md:border-t-0">
        {members.map((investor) => (
          <Row key={investor.slug} investor={investor} />
        ))}
      </ul>
    </section>
  );
}

function Row({ investor }: { investor: Investor }) {
  return (
    <li className="border-b border-ink/15">
      {/*
       * De hele rij is de link, en de padding zit op de <a> — daardoor trekt de
       * globale brass focusring om de héle rij en niet om een stuk ervan.
       *
       * Drie signalen dat het een link is, in volgorde van belang: de pijl staat
       * er permanent, want op touch bestaat hover niet en daar mag de affordance
       * niet van afhangen; de naam onderstreept bij hover (kleur of onderstreping
       * is het enige wat de stijlgids toestaat); en de focusring doet de rest.
       *
       * Geen aria-label op de rij: de naam wordt al uit de inhoud berekend en
       * begint met de belegger, dus dertig links klinken dertig keer anders. Een
       * aria-label zou dat vervangen door één korte string en stijl en horizon
       * weggooien.
       */}
      <Link
        href={`/topbeleggers/${investor.slug}`}
        className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-3 py-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.6fr)_minmax(0,0.9fr)_auto]"
      >
        <div className="md:col-start-1 md:row-start-1">
          <h3 className="font-display text-display-s underline-offset-4 group-hover:underline">
            {investor.name}
          </h3>
          <p className="mt-1 text-body-s text-ink-soft">{investor.firm}</p>
        </div>

        {/* Niet brass: brass op papier is 2,64:1 en dus alleen constructief. */}
        <span
          aria-hidden
          className="text-body text-ink-soft md:col-start-4 md:row-start-1 md:justify-self-end"
        >
          &#8594;
        </span>

        {/*
         * Komma's, geen middelpunt: een middelpunt wordt door schermlezers
         * wisselend uitgesproken, een komma levert een natuurlijke pauze.
         */}
        <p className="col-span-2 text-body-s text-ink-soft md:col-span-1 md:col-start-2 md:row-start-1">
          <span className="text-micro md:sr-only">Stijl </span>
          {investor.styleTags.join(", ")}
        </p>

        <p className="col-span-2 text-body-s text-ink-soft md:col-span-1 md:col-start-3 md:row-start-1">
          <span className="text-micro md:sr-only">Horizon </span>
          {investor.horizon}
        </p>
      </Link>
    </li>
  );
}
