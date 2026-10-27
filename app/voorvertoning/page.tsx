import Image from "next/image";
import { connection } from "next/server";
import { Masthead } from "@/components/masthead";
import { isoDate } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { amsterdamDate, postTypes, upcomingPosts, X_LIMIT, xLength, type PostType } from "@/lib/posts";

/*
 * Wat de komende weken op X komt, per posttype, zodat het team kaart en tekst
 * kan beoordelen voordat er iets geplaatst wordt. Niet gelinkt vanaf de site en
 * niet in zoekmachines; er staat niets geheims op, alleen openbare 13F-data.
 */
export const metadata = {
  title: "Voorvertoning — De Amerikabelegger",
  robots: { index: false },
};

export default async function Page() {
  // Hangt af van de dag van vandaag, dus per bezoek renderen en niet bij de build.
  await connection();
  const posts = await upcomingPosts(amsterdamDate(new Date()), 6);
  const unbuilt = (Object.keys(postTypes) as PostType[]).filter((type) => type !== "topbelegger");

  return (
    <>
      <Masthead
        title="Voorvertoning"
        intro="De komende posts voor X, met kaart en tekst. Er wordt hier niets geplaatst."
      />

      <div className="mx-auto max-w-content px-6 pb-20">
        <section aria-labelledby="topbelegger">
          <h2 id="topbelegger" className="font-display text-display-m">
            {postTypes.topbelegger.label}
          </h2>
          <p className="mt-2 text-body-s text-ink-soft">
            {postTypes.topbelegger.slot} · {postTypes.topbelegger.status}
          </p>

          <ol>
            {posts.map((post) => {
              const length = xLength(post.text);
              return (
                <li
                  key={post.date}
                  className="grid gap-6 border-t border-ink/15 py-10 first:mt-8 md:grid-cols-[3fr_2fr]"
                >
                  <Image src={post.card} alt="" width={1600} height={900} unoptimized className="w-full" />
                  <div>
                    <p className="font-medium">{formatDate(isoDate(post.date))}</p>
                    <p className="mt-3 whitespace-pre-line text-body">{post.text}</p>
                    <p className={`tabular mt-4 text-body-s ${length > X_LIMIT ? "font-medium text-seal" : "text-ink-soft"}`}>
                      {length} van {X_LIMIT} tekens{length > X_LIMIT && ": te lang"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section aria-labelledby="nog-niet-gebouwd" className="mt-16">
          <h2 id="nog-niet-gebouwd" className="font-display text-display-m">
            Nog niet gebouwd
          </h2>
          <p className="mt-2 max-w-reading text-body-s text-ink-soft">
            Zo ziet het huidige kaartontwerp eruit bij de andere posttypes. Een
            type zonder gekozen kleur staat in inkt.
          </p>
          <ul className="mt-8 grid gap-x-6 gap-y-10 md:grid-cols-2">
            {unbuilt.map((type) => (
              <li key={type}>
                <Image src={`/kaart/leeg/${type}`} alt="" width={1600} height={900} unoptimized className="w-full" />
                <p className="mt-3 font-medium">{postTypes[type].label}</p>
                <p className="text-body-s text-ink-soft">
                  {postTypes[type].slot ?? "Tijdstip nog niet bepaald"} · {postTypes[type].status}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
