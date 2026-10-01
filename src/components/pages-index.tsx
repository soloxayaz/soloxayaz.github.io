import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { nav } from "@/lib/content";
import { Reveal, SectionLabel } from "@/components/reveal";

/** Home-page index: one animated row per page. */
export function PagesIndex() {
  return (
    <section id="pages" className="relative z-10 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="00">explore</SectionLabel>
        <ol className="border-t border-line">
          {nav.map((item, i) => (
            <li key={item.id}>
              <Reveal delay={0.05 * i}>
                <Link
                  to={item.to}
                  className="group grid items-baseline gap-2 border-b border-line py-7 sm:grid-cols-[4rem_1fr_auto] sm:gap-8"
                >
                  <span className="font-mono text-xs text-accent tabular-nums">0{i + 1}</span>
                  <span>
                    <span className="block font-display text-3xl text-paper transition-transform duration-300 ease-out group-hover:translate-x-2 sm:text-5xl">
                      {item.label}
                    </span>
                    <span className="mt-2 block text-sm text-dim">{item.blurb}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="hidden size-5 text-dim transition-[color,transform] duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent sm:block"
                  />
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
