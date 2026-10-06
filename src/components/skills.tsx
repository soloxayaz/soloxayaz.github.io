import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { skillGroups as fallbackSkillGroups } from "@/lib/content";
import { fetchSkillGroups } from "@/lib/portfolio-data";
import { easeOut } from "@/lib/motion";
import { Reveal, SectionLabel } from "@/components/reveal";

export function Skills() {
  const reduced = useReducedMotion();
  const [skillGroups, setSkillGroups] = useState(fallbackSkillGroups);

  useEffect(() => {
    let active = true;

    fetchSkillGroups().then((remoteGroups) => {
      if (active && remoteGroups.length > 0) {
        setSkillGroups(remoteGroups);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="skills" className="relative z-10 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="04">tech stack</SectionLabel>
        <Reveal>
          <p className="mb-14 max-w-lg font-display text-3xl text-paper italic sm:text-4xl">
            languages, frameworks, databases and environments used across projects.
          </p>
        </Reveal>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, gi) => (
            <Reveal key={group.id} delay={gi * 0.08}>
              <p className="mb-5 font-mono text-xs tracking-[0.2em] text-accent uppercase">
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map((item, i) => (
                  <motion.li
                    key={item.name}
                    className="group flex items-baseline justify-between gap-4 border-b border-line py-3"
                    initial={reduced ? false : { opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.04 * i, duration: 0.4, ease: easeOut }}
                  >
                    <span className="font-display text-xl text-paper">{item.name}</span>
                    <span className="max-w-[50%] text-right font-mono text-[11px] tracking-wide text-dim transition-colors duration-200 group-hover:text-accent">
                      {item.hint}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
