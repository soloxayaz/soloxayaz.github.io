import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { IntroContext } from "@/hooks/use-intro";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { Ambient } from "@/components/ambient";
import { IntroCurtain } from "@/components/intro-curtain";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { RoutePath } from "@/lib/content";
import { easeOut } from "@/lib/motion";

const INTRO_KEY = "ap-intro";

/** `g` then a letter jumps between pages. */
const KEYMAP: Record<string, RoutePath> = {
  h: "/",
  w: "/work",
  n: "/about",
  s: "/skills",
  r: "/repos",
  m: "/manifesto",
  a: "/assets",
  j: "/contact",
  v: "/void",
};

/**
 * Mounted once in the root route, so the ambient glow, header, footer and intro
 * persist across pages. Only the page content inside swaps (and animates in).
 */
export function PageShell({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // The intro curtain only plays when the visit starts on the home page.
  const [showIntro, setShowIntro] = useState(() => pathname === "/");
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  const completeIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* ignore */
    }
    setShowIntro(false);
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {
      seen = false;
    }
    if (reduced || seen) setShowIntro(false);
  }, [reduced]);

  useEffect(() => {
    if (!showIntro) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showIntro]);

  useEffect(() => {
    let g = 0;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (g && Date.now() - g < 1200) {
        const to = KEYMAP[e.key];
        if (to) {
          if (window.location.pathname === to) {
            window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
          } else {
            void navigate({ to });
          }
        }
        g = 0;
      } else if (e.key === "g") {
        g = Date.now();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, reduced]);

  const ctx = useMemo(
    () => ({
      showIntro,
      ready: !showIntro,
      completeIntro,
    }),
    [showIntro, completeIntro],
  );

  return (
    <IntroContext.Provider value={ctx}>
      <Ambient />
      <AnimatePresence>{showIntro ? <IntroCurtain key="intro" /> : null}</AnimatePresence>
      <div className="relative z-10">
        <SiteHeader />
        {/* Re-keyed per page: each page eases in; the first paint is left alone. */}
        <motion.div
          key={pathname}
          initial={firstRender.current || reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          {children}
        </motion.div>
        <SiteFooter />
      </div>
    </IntroContext.Provider>
  );
}
