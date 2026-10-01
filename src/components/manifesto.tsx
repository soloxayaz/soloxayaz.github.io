import { motion, useReducedMotion } from "motion/react";
import { beliefs } from "@/lib/content";
import { easeOut } from "@/lib/motion";
import { SectionLabel } from "@/components/reveal";

export function Manifesto() {
  const reduced = useReducedMotion();

  return (
    <section id="manifesto" className="relative z-10 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="05">ethical disclosure & philosophy</SectionLabel>
        <ol className="space-y-8 sm:space-y-10">
          {beliefs.map((b, i) => (
            <motion.li
              key={b}
              className="grid items-baseline gap-3 border-b border-line pb-8 sm:grid-cols-[4rem_1fr] sm:gap-8"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: easeOut }}
            >
              <span className="font-mono text-xs text-accent tabular-nums">
                0{i + 1}
              </span>
              <span className="font-display text-2xl leading-snug text-paper sm:text-4xl md:text-5xl">
                {b}
              </span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
