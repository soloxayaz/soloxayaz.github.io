import { Link } from "@tanstack/react-router";
import { beliefs, site } from "@/lib/content";
import { useClock } from "@/hooks/use-clock";

export function SiteFooter() {
  const { time, day, session, mounted, tod } = useClock();
  const loop = [...beliefs, ...beliefs];

  return (
    <footer className="relative z-10 mt-8 border-t border-line">
      <div className="overflow-hidden border-b border-line py-4">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap font-display text-xl text-dim italic sm:text-2xl">
          {loop.map((b, i) => (
            <span key={`${b}-${i}`} className="flex items-center gap-10">
              {b}
              <span className="text-accent" aria-hidden="true">
                /
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-3">
        <div>
          <p className="font-mono text-sm text-paper">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-dim">
            cybersecurity, development, web design and open source, as{" "}
            <a
              className="link-draw text-paper"
              href={site.github}
              target="_blank"
              rel="noreferrer"
            >
              {site.handle}
            </a>
            .
          </p>
        </div>

        <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-[0.16em] text-dim">
          {site.accounts.map((a) => (
            <a
              key={a.user}
              className="link-draw w-fit text-paper"
              href={a.url}
              target="_blank"
              rel="noreferrer"
            >
              github · {a.user}
            </a>
          ))}
          <Link className="link-draw w-fit text-paper" to="/void">
            void
          </Link>
          <button
            type="button"
            className="link-draw w-fit text-left text-paper"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            back to top
          </button>
        </div>

        <div className="font-mono text-xs leading-relaxed text-dim tabular-nums md:text-right">
          <p>{mounted ? `${time} ${day}` : "—"}</p>
          <p>session {mounted ? session : "--:--"}</p>
          <p>palette {mounted ? tod : "—"}</p>
          <p className="mt-4">educational use · authorized testing only</p>
          <p className="mt-1">keys: g then h / w / r / n / s / m / a / j</p>
        </div>
      </div>
    </footer>
  );
}
