import { useEffect } from "react";
import { motion } from "motion/react";
import { useIntro } from "@/hooks/use-intro";
import { easeOut } from "@/lib/motion";
import { site } from "@/lib/content";

export function IntroCurtain() {
  const { completeIntro } = useIntro();

  useEffect(() => {
    const t = window.setTimeout(completeIntro, 1680);
    return () => window.clearTimeout(t);
  }, [completeIntro]);

  return (
    <motion.div
      className="fixed inset-0 z-intro flex flex-col items-center justify-center bg-ink"
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 0.7, ease: easeOut } }}
      role="dialog"
      aria-label="Intro"
    >
      <p className="intro-copy mb-6 font-mono text-xs tracking-[0.22em] text-dim uppercase">
        system online
      </p>
      <p className="font-display text-5xl tracking-tight text-paper sm:text-7xl">
        {site.display}
      </p>
      <span className="intro-line mt-10 h-px w-16 origin-left bg-accent" />
      <button
        type="button"
        onClick={completeIntro}
        className="absolute right-5 bottom-6 font-mono text-2xs tracking-[0.18em] text-dim uppercase hover:text-paper"
      >
        skip
      </button>
    </motion.div>
  );
}
