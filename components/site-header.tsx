"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/content";

/*
 * The only client component on the site. `usePathname` is used for nothing but
 * marking the current page — hover and current states change colour and
 * underline only, never position.
 */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-ink">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-6 py-5 md:flex-row md:items-baseline md:justify-between">
        <Link href="/" className="font-display text-display-s text-paper">
          De Amerikabelegger
        </Link>

        <nav aria-label="Hoofdnavigatie">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navigation.map((item) => {
              const current = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={
                      current
                        ? "text-body font-medium text-brass underline underline-offset-8"
                        : "text-body text-paper hover:text-brass"
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
