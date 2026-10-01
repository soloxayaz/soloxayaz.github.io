import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px", amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-10 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.22em] text-dim md:mb-14">
      <span className="text-accent">{index}</span>
      <span>{children}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
