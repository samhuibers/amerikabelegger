import { Masthead } from "@/components/masthead";
import { Seal } from "@/components/seal";
import { principles, team } from "@/lib/content";

/*
 * The page where the site explains itself, so the rule that outranks the rest
 * is stated here in public rather than only in the style guide: we collect and
 * order, we do not research. Every line below was checked against that.
 *
 * No photographs — they are homepage-only. The people are carried by a name, a
 * role and two sentences, on a hairline grid.
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

        {/* <Team /> — withheld on purpose. See the note above the function. */}
      </div>
    </>
  );
}

/*
 * NOT RENDERED. "Wie wij zijn" is finished but deliberately withheld from the
 * public site for now, by decision of the owner — three of the four bios are
 * assembled from public sources and one is still placeholder scaffolding, so
 * the section stays off until the people in it have signed off on their own
 * text and roles.
 *
 * Kept as an uncalled component rather than commented-out JSX so it still
 * typechecks and still moves when `team` or the tokens change. To publish it,
 * render <Team /> where the marker above sits and delete this note. If it is
 * still dark at the next cleanup, delete the function and `team` with it —
 * this is a parked section, not a permanent switch.
 */
function Team() {
  return (
    <section aria-labelledby="team" className="mt-20">
      <h2 id="team" className="font-display text-display-m">
        Wie wij zijn
      </h2>
      <div className="scotch-rule mt-4 max-w-reading" />
      <p className="mt-6 max-w-reading text-body-l">
        Vier mensen uit de contentmarketing en de media, met tientallen jaren
        ervaring in het bouwen van merken en redacties. Wij zijn klein, en dat is
        een keuze: het betekent dat elke rubriek een naam heeft en dat wij snel
        kunnen bijsturen als blijkt dat iets beter kan.
      </p>

      {/*
       * Hairline grid rather than cards: borders on paper are `ink/15`, and a
       * bordered box per person would read as the shadowed-card pattern the
       * style guide rules out.
       */}
      <ul className="mt-10 grid border-t border-ink/15 md:grid-cols-2">
        {team.map((member) => (
          <li
            key={member.name}
            className="border-b border-ink/15 py-8 md:odd:border-r md:odd:pr-10 md:even:pl-10"
          >
            <h3 className="font-display text-display-s">{member.name}</h3>
            {/* Not brass: brass on paper is 2.64:1 and structural only. */}
            <p className="mt-1 text-body-s font-medium text-ink">
              {member.role}
            </p>
            <p className="mt-3 max-w-reading text-body-s text-ink-soft">
              {member.bio}
            </p>
            <a
              href={member.href}
              className="mt-4 inline-block text-body-s text-ink underline underline-offset-4 hover:text-seal"
            >
              LinkedIn
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
