import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  const [n, setN] = useState(0);

  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-6xl flex-col justify-center px-5 py-24 sm:px-8">
      <p className="font-mono text-xs tracking-[0.2em] text-dim uppercase">lost</p>
      <h1 className="mt-4 font-display text-7xl tracking-tight text-paper sm:text-8xl">404</h1>
      <p className="mt-3 font-display text-2xl text-paper italic sm:text-3xl">
        this page escaped.
      </p>
      <button
        type="button"
        onClick={() => setN((v) => v + 1)}
        className="mt-10 max-w-lg text-left font-mono text-sm leading-relaxed text-dim"
      >
        $ locate requested_page
        <br />
        result: not found
        {n >= 3 && (
          <>
            <br />
            ...it's not coming back. try /void
          </>
        )}
      </button>
      <Link
        to="/"
        className="link-draw mt-10 w-fit font-mono text-xs tracking-[0.16em] text-paper uppercase"
      >
        return home
      </Link>
    </main>
  );
}
