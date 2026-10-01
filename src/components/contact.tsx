import { site } from "@/lib/content";
import { ContactForm } from "@/components/contact-form";
import { Reveal, SectionLabel } from "@/components/reveal";

export function Contact() {
  return (
    <section id="contact" className="relative z-10 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="07">dispatch</SectionLabel>
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="font-display text-4xl text-paper italic sm:text-5xl">
              connect with Ayaz.
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-dim">
              For security collaboration, open-source projects, web design queries, or
              technology research exchanges.
            </p>
            <div className="mt-10 space-y-3 font-mono text-xs tracking-[0.16em] text-dim uppercase">
              {site.accounts.map((a) => (
                <a
                  key={a.user}
                  className="link-draw block w-fit text-paper"
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  github · {a.user}
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
