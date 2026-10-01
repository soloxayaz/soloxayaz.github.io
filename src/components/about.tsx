import { about, focus, now, stats } from "@/lib/content";
import { Reveal, SectionLabel } from "@/components/reveal";

export function About() {
  return (
    <section id="about" className="relative z-10 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="03">about</SectionLabel>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="font-display text-3xl leading-snug text-paper sm:text-4xl md:text-5xl">
              {about.lead}
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-dim sm:text-lg">
              {about.body}
            </p>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-5">
            <p className="font-mono text-xs tracking-[0.2em] text-dim uppercase">at a glance</p>
            <div className="mb-8" />
            <dl className="space-y-6">
              {now.items.map(([k, v], i) => (
                <Reveal key={k} delay={0.04 * i}>
                  <dt className="font-mono text-[11px] tracking-[0.16em] text-dim uppercase">
                    {k}
                  </dt>
                  <dd className="mt-1 font-display text-xl text-paper italic">{v}</dd>
                </Reveal>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-line md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={0.05 * i}>
              <div className="bg-ink px-5 py-6">
                <p className="font-display text-3xl tracking-tight text-paper tabular-nums sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-2 font-mono text-[11px] tracking-[0.16em] text-dim uppercase">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-24">
          <SectionLabel index="03.1">security & research</SectionLabel>
          <div className="grid gap-10 md:grid-cols-3">
            {focus.map((f, i) => (
              <Reveal key={f.title} delay={0.08 * i}>
                <h3 className="font-display text-2xl text-paper">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-dim">{f.body}</p>
                <p className="mt-4 font-mono text-[11px] tracking-wide text-accent">
                  {f.tags.join(" / ")}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
