import { useEffect } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { useClock } from "@/hooks/use-clock";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function Ambient() {
  const { tod, mounted } = useClock();
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.tod = tod;
  }, [tod, mounted]);

  useEffect(() => {
    if (reduced) return;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight * 0.28;
    let cx = mx;
    let cy = my;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    let raf = 0;
    const tick = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      document.documentElement.style.setProperty("--mx", `${cx}px`);
      document.documentElement.style.setProperty("--my", `${cy}px`);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <>
      <div className="glow" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-px origin-left bg-accent"
        style={{ scaleX: reduced ? 0 : progress }}
      />
    </>
  );
}
