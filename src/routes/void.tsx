import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/void")({
  head: () => ({ meta: [{ title: "void · the great ayaz" }] }),
  component: VoidPage,
});

function VoidPage() {
  const [late, setLate] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setLate(true), 8000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-6xl flex-col justify-center px-5 py-24 sm:px-8">
      <p className="font-mono text-xs tracking-[0.2em] text-dim uppercase">hidden</p>
      <h1 className="mt-6 font-display text-4xl text-paper italic sm:text-5xl">
        you weren't supposed to find this
        <span className="blink text-accent">_</span>
      </h1>
      {late && (
        <p className="mt-8 max-w-md text-sm leading-relaxed text-dim">
          ...but since you stayed: nothing here is a secret. it's just quiet.
        </p>
      )}
      <Link
        to="/"
        className="link-draw mt-12 w-fit font-mono text-xs tracking-[0.16em] text-paper uppercase"
      >
        return
      </Link>
    </main>
  );
}
