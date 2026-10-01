import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/lib/content";
import { useClock } from "@/hooks/use-clock";
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/motion";

export function SiteHeader() {
  const { time, session, mounted } = useClock();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const active = nav.find((n) => pathname === n.to || pathname.startsWith(`${n.to}/`))?.id ?? "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color] duration-300 ease-out",
        scrolled ? "border-b border-line bg-ink" : "border-b border-transparent bg-ink/80",
      )}
    >
      {/* Same gutter + max-width nesting as the page sections, so edges line up. */}
      <div className="px-5 sm:px-8">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4">
          <Link
            to="/"
            className="font-mono text-sm tracking-tight text-paper transition-colors duration-200 hover:text-accent"
          >
            {site.name}
          </Link>

          <nav aria-label="main" className="hidden shrink-0 items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                aria-current={active === item.id ? "page" : undefined}
                className={cn(
                  "relative flex h-11 items-center px-3 font-mono text-xs tracking-[0.16em] uppercase transition-colors duration-200",
                  active === item.id ? "text-paper" : "text-dim hover:text-paper",
                )}
              >
                {active === item.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 bottom-2 h-px bg-accent"
                    transition={{ duration: 0.25, ease: easeOut }}
                  />
                )}
                {item.label}
              </Link>
            ))}
          </nav>

          <p className="hidden shrink-0 font-mono text-2xs tracking-wide text-dim tabular-nums xl:block">
            {mounted ? (
              <>
                {time} · {session}
              </>
            ) : (
              <span>session --:--</span>
            )}
          </p>

          <button
            type="button"
            className="relative flex size-11 items-center justify-center text-paper lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative size-5">
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-[opacity,filter,transform] duration-300",
                  open ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]",
                )}
              >
                <X className="size-5" />
              </span>
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-[opacity,filter,transform] duration-300",
                  open ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none",
                )}
              >
                <Menu className="size-5" />
              </span>
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="overflow-hidden border-t border-line bg-ink lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: easeOut }}
          >
            <nav className="flex flex-col px-5 py-4" aria-label="mobile">
              {nav.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3, ease: easeOut }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    aria-current={active === item.id ? "page" : undefined}
                    className={cn(
                      "flex h-12 items-center justify-between font-display text-2xl",
                      active === item.id ? "text-accent" : "text-paper",
                    )}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-2xs text-dim">0{i + 1}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
