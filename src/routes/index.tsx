import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Hero } from "@/components/hero";
import { PagesIndex } from "@/components/pages-index";

export const Route = createFileRoute("/")({ component: Home });

/** Old single-page anchors (/#work …) now live on their own pages. */
const LEGACY = {
  work: "/work",
  about: "/about",
  skills: "/skills",
  manifesto: "/manifesto",
  contact: "/contact",
} as const;

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    if (id in LEGACY) {
      void navigate({ to: LEGACY[id as keyof typeof LEGACY], replace: true });
      return;
    }
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [navigate]);

  return (
    <main>
      <Hero />
      <PagesIndex />
    </main>
  );
}
