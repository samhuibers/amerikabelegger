import { Masthead } from "@/components/masthead";

export default function Page() {
  return (
    <>
      <Masthead title="Topbeleggers" />

      <div className="mx-auto max-w-content px-6 pb-20">
        <div className="max-w-reading">
          <p className="text-body-l">
            De beste beleggers ter wereld kijken allemaal anders naar de beurs.
            Sommigen zoeken de beste bedrijven voor de komende tien jaar. Anderen
            zoeken juist bedrijven die tijdelijk verkeerd worden gewaardeerd.
          </p>
          <p className="mt-6 text-body-l">
            Op deze pagina volgen we dertig beleggers met ieder hun eigen aanpak.
            Bekijk hun portefeuille, ontdek hun grootste posities en kijk wat je
            van hun manier van beleggen kunt leren.
          </p>

          {/*
           * HARDCODED KWARTAAL — moet mee met de data. Deze regel noemt het
           * kwartaal waarvan de getoonde portefeuilles komen, en staat er los
           * van of de ingest heeft gedraaid. Zodra wij nieuwe SEC-data
           * inlezen en tonen (Q3 2026 en verder), moet "Q2 2026" hieronder
           * meeveranderen, anders staat er een onwaarheid op de pagina.
           *
           * Bij de eerstvolgende ingest: het kwartaal uit de data laten komen
           * in plaats van uit deze JSX — zodra er een echte bron is, hoort het
           * via `lib/content.ts` te lopen, net als alle andere content.
           */}
          <p className="mt-10 text-body-s italic text-ink-soft">
            Portefeuilles: meest recente SEC-data, Q2 2026.
          </p>
        </div>
      </div>
    </>
  );
}
