import { Masthead } from "@/components/masthead";
import { Seal } from "@/components/seal";
import { principles } from "@/lib/content";

/*
 * The page where the site explains itself, so the rule that outranks the rest
 * is stated here in public rather than only in the style guide: we collect and
 * order, we do not research. Every line below was checked against that.
 */
export default function Page() {
  return (
    <>
      <Masthead
        title="Over ons"
        intro="Wij verzamelen en ordenen wat Amerikaanse beleggers publiceren. Wij voeren geen eigen onderzoek uit."
      />

      <div className="mx-auto max-w-content px-6">
        <div className="max-w-reading">
          <p className="text-body-l">
            De Amerikaanse markt is de best gedocumenteerde ter wereld en
            tegelijk de luidruchtigste. Elke dag publiceren duizenden beleggers,
            analisten en influencers hun kijk op dezelfde handvol aandelen. Er
            valt niet te weinig te lezen — er valt te veel te lezen, en er staat
            zelden bij wie het zei, waar, en wanneer.
          </p>
          <p className="mt-6 text-body-l">
            Daar is De Amerikabelegger voor. Wij volgen wat er in de Verenigde
            Staten wordt gepubliceerd, kiezen eruit wat het volgen waard is en
            brengen het onder in drie categorieën: Giants, Growers en Moonshots.
            Bij elke uitspraak noemen wij de naam, het platform en de datum. Wat
            u ermee doet, blijft aan u.
          </p>
        </div>

        {/*
         * The seal, used for the third time on the site: this paragraph is the
         * editorial voice putting its name to the site's one promise, which is
         * exactly what the mark is reserved for.
         */}
        <div className="mt-12 flex max-w-reading items-start gap-5 bg-ledger p-6">
          <Seal label="Redactie" size={72} />
          <p className="text-body-s text-ink">
            Wij zijn geen analistenhuis en doen niet alsof. Wat wij toevoegen is
            selectie, ordening en context — nooit een berekening of een koersdoel
            van onszelf. Waar wij wel een mening hebben, staat dit merkteken
            erbij, zodat u die mening kunt scheiden van alles wat wij citeren.
          </p>
        </div>

        <section aria-labelledby="principes" className="mt-20">
          <h2 id="principes" className="font-display text-display-m">
            Hoe wij werken
          </h2>
          <div className="scotch-rule mt-4 max-w-reading" />

          <dl className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {principles.map((principle) => (
              <div key={principle.title}>
                <dt className="font-display text-display-s">
                  {principle.title}
                </dt>
                <dd className="mt-3 text-body-s text-ink-soft">
                  {principle.body}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}
