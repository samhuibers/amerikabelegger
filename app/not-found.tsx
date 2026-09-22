import Link from "next/link";
import { Masthead } from "@/components/masthead";

/*
 * De site had geen eigen 404: alles wat misging viel terug op de Engelse
 * standaardpagina van Next, zonder ticker, koptekst of voettekst. Deze pagina
 * valt binnen de layout en is dus Nederlands, met de rest van het meubilair
 * eromheen.
 */
export const metadata = { title: "Pagina niet gevonden — De Amerikabelegger" };

export default function NotFound() {
  return (
    <>
      <Masthead title="Pagina niet gevonden" />

      <div className="mx-auto max-w-content px-6 pb-20">
        <div className="max-w-reading">
          <p className="text-body-l">
            Deze pagina bestaat niet, of niet meer. Controleer het adres, of
            begin opnieuw op de{" "}
            <Link
              href="/"
              className="text-ink underline underline-offset-4 hover:text-seal"
            >
              voorpagina
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
