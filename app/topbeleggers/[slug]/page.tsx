import { notFound } from "next/navigation";
import { Masthead } from "@/components/masthead";
import { investors } from "@/lib/content";

/*
 * De alinea staat er nu; de portefeuille volgt zodra de EDGAR-data er is.
 *
 * dynamicParams = false: een slug die niet in `investors` staat wordt een 404
 * en niet een lege pagina met een verzonnen titel erboven.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return investors.map((investor) => ({ slug: investor.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/topbeleggers/[slug]">) {
  const { slug } = await params;
  const investor = investors.find((i) => i.slug === slug);
  return { title: `${investor?.name ?? "Belegger"} — De Amerikabelegger` };
}

// `params` is in deze versie van Next een promise en moet gewacht worden; de
// synchrone vorm is verouderd.
export default async function Page({
  params,
}: PageProps<"/topbeleggers/[slug]">) {
  const { slug } = await params;
  const investor = investors.find((i) => i.slug === slug);

  if (!investor) notFound();

  return (
    <>
      <Masthead title={investor.name} intro={investor.firm} />

      <div className="mx-auto max-w-content px-6 pb-20">
        <div className="max-w-reading">
          <p className="text-body-l">
            {investor.styleTags.join(", ")}. Horizon: {investor.horizon}.
          </p>
          <p className="mt-6 text-body-l">{investor.summary}</p>
          <p className="mt-10 text-body-s italic text-ink-soft">
            De portefeuille volgt. Zodra die er staat, staat erbij waar de
            omschrijving hierboven vandaan komt: naam, platform en datum.
          </p>
        </div>
      </div>
    </>
  );
}
