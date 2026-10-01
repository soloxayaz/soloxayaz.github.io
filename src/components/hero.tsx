import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { site, thoughts } from "@/lib/content";
import { useClock } from "@/hooks/use-clock";
import { useIntro } from "@/hooks/use-intro";
import { easeOut } from "@/lib/motion";
import { Button } from "@/components/ui/button";

function SplitWords({
  text,
  delay,
  className,
}: {
  text: string;
  delay: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block pr-[0.28em]"
            initial={reduced ? false : { y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.7, delay: delay + i * 0.06, ease: easeOut }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const { time, day, session, mounted } = useClock();
  const { ready } = useIntro();
  const reduced = useReducedMotion();
  const [thought, setThought] = useState(0);
  const start = ready || Boolean(reduced);

  useEffect(() => {
    if (!start) return;
    const t = window.setInterval(() => {
      setThought((n) => (n + 1) % thoughts.length);
    }, 4200);
    return () => window.clearInterval(t);
  }, [start]);

  const scrollToPages = () => {
    document.getElementById("pages")?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section className="relative z-10 flex min-h-[calc(100dvh-4rem)] flex-col justify-center px-5 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <motion.p
          className="mb-8 font-mono text-2xs tracking-[0.18em] text-dim uppercase sm:text-xs"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          system online // security research & build log
          <span className="mx-2 text-line">·</span>
          <span className="tabular-nums">
            {mounted ? `${time} ${day} · session ${session}` : "loading session"}
          </span>
        </motion.p>

        <h1 className="overflow-hidden font-display text-hero leading-none tracking-tight text-paper">
          <motion.span
            className="block"
            initial={reduced ? false : { y: "110%" }}
            animate={start ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            {site.display}
          </motion.span>
        </h1>

        <p className="mt-8 max-w-xl font-display text-3xl leading-tight text-paper italic sm:text-4xl md:text-5xl">
          {start ? (
            <SplitWords text={site.tagline} delay={0.25} />
          ) : (
            <span className="opacity-0">{site.tagline}</span>
          )}
        </p>

        <motion.p
          className="mt-6 max-w-md text-base leading-relaxed text-dim sm:text-lg"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={start ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.55, delay: 0.55, ease: easeOut }}
        >
          {site.blurb}
        </motion.p>

        <motion.p
          className="mt-8 min-h-6 font-mono text-sm text-accent"
          initial={reduced ? false : { opacity: 0 }}
          animate={start ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.7 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={thoughts[thought]}
              className="inline-block"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: easeOut }}
            >
              {thoughts[thought]}
              <span className="blink">_</span>
            </motion.span>
          </AnimatePresence>
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap items-center gap-3"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={start ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: easeOut }}
        >
          <Button asChild>
            <Link to="/work">view projects</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/repos">all repositories</Link>
          </Button>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={scrollToPages}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 font-mono text-2xs tracking-[0.2em] text-dim uppercase"
        initial={reduced ? false : { opacity: 0 }}
        animate={start ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.1 }}
      >
        <motion.span
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4" />
        </motion.span>
        scroll
      </motion.button>
    </section>
  );
}
