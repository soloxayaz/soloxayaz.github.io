import { assets } from "@/lib/content";
import { Reveal, SectionLabel } from "@/components/reveal";


export function Assets() {
  const cells: [string, string, string][] = [
    ["total portfolio value", assets.total, assets.inr],
    ["24h performance", assets.change, assets.changeNote],
    ["largest holding", assets.largest, assets.largestNote],
  ];

  return (
    <section id="assets" className="relative z-10 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="06">asset dashboard</SectionLabel>
        <Reveal>
          <p className="max-w-xl font-display text-3xl text-paper italic sm:text-4xl">
            portfolio monitor.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-dim">
            Initial baseline snapshot. These figures are static, not live prices.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-line md:grid-cols-3">
          {cells.map(([label, value, note], i) => (
            <Reveal key={label} delay={0.06 * i}>
              <div className="h-full bg-ink px-5 py-7">
                <p className="font-mono text-[11px] tracking-[0.16em] text-dim uppercase">
                  {label}
                </p>
                <p className="mt-3 font-display text-3xl tracking-tight text-paper tabular-nums sm:text-4xl">
                  {value}
                </p>
                <p className="mt-2 font-mono text-[11px] text-accent">{note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="font-mono text-xs tracking-[0.2em] text-dim uppercase">holdings</p>
            <ul className="mt-4">
              {assets.holdings.map(([k, v]) => (
                <li
                  key={k}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-4"
                >
                  <span className="font-display text-xl text-paper">{k}</span>
                  <span className="font-mono text-sm text-dim tabular-nums">{v}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="font-mono text-xs tracking-[0.2em] text-dim uppercase">
              the builder&apos;s motto
            </p>
            <p className="mt-4 font-display text-3xl leading-snug text-paper italic">
              “{assets.motto}”
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
