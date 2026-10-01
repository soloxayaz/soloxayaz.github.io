import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Search } from "lucide-react";
import { loadLiveRepos, ownerLabels, staticRepos, type Repo } from "@/lib/repos";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Reveal, SectionLabel } from "@/components/reveal";

const GLYPHS = "!<>-_\\/[]{}=+*^?#0123456789abcdef";
type Group = "all" | "soloxayaz" | "htr-tech";
type Sort = "stars" | "name";

const groupOf = (r: Repo): Exclude<Group, "all"> => (r.owner === "soloxayaz" ? "soloxayaz" : "htr-tech");
const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n));

/** Letters decode from noise to the real name each time the row is hovered or focused. */
function useScramble(text: string, reduced: boolean) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  useEffect(() => {
    setOut(text);
    return () => cancelAnimationFrame(raf.current);
  }, [text]);

  const run = useCallback(() => {
    if (reduced) return;
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const dur = 520;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const next = [...text]
        .map((ch, i) =>
          i < p * text.length * 1.15 ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        )
        .join("");
      setOut(p < 1 ? next : text);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [text, reduced]);

  return [out, run] as const;
}

function Count({ to }: { to: number }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    if (reduced) {
      setN(to);
      prev.current = to;
      return;
    }
    const from = prev.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 800);
      setN(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, reduced]);

  return <>{fmt(n)}</>;
}

function Row({
  repo,
  index,
  open,
  onToggle,
  reduced,
}: {
  repo: Repo;
  index: number;
  open: boolean;
  onToggle: () => void;
  reduced: boolean;
}) {
  const [shown, scramble] = useScramble(repo.name, reduced);
  const pushed = repo.pushed ? new Date(repo.pushed).toLocaleDateString([], { year: "numeric", month: "short" }) : null;

  return (
    <li className="border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        onMouseEnter={scramble}
        onFocus={scramble}
        className="type-row group grid w-full items-baseline gap-x-6 gap-y-2 py-6 text-left sm:grid-cols-[3rem_1fr_auto]"
      >
        <span className="font-mono text-xs text-accent tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-display text-4xl leading-[0.95] tracking-tight text-paper [overflow-wrap:anywhere] sm:text-6xl md:text-7xl">
          <span className="sr-only">{repo.name}</span>
          {[...shown].map((ch, k) => (
            <span key={k} aria-hidden="true" className="ch" style={{ "--i": k } as CSSProperties}>
              {ch}
            </span>
          ))}
        </span>
        <span className="font-mono text-2xs tracking-[0.14em] text-dim uppercase sm:text-right">
          {repo.lang ?? "no language"} · ★ {fmt(repo.stars)}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: easeOut }}
          >
            <div className="grid gap-6 pb-8 sm:grid-cols-[3rem_1fr]">
              <span aria-hidden="true" />
              <div>
                <p className="max-w-xl text-base leading-relaxed text-paper">
                  {repo.desc || "No description on GitHub."}
                </p>
                <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] tracking-wide text-dim">
                  <span>
                    {repo.owner}
                    {ownerLabels[repo.owner] ? ` · ${ownerLabels[repo.owner]}` : ""}
                  </span>
                  {repo.fork && <span>fork</span>}
                  {repo.archived && <span>archived</span>}
                  {pushed && <span>last push {pushed}</span>}
                </p>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="link-draw mt-6 inline-flex w-fit items-center gap-2 font-mono text-xs tracking-[0.16em] text-accent uppercase"
                >
                  open on github
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function ReposBoard() {
  const reduced = Boolean(useReducedMotion());
  const [repos, setRepos] = useState<Repo[]>(staticRepos);
  const [status, setStatus] = useState<"loading" | "live" | "snapshot">("loading");
  const [group, setGroup] = useState<Group>("all");
  const [sort, setSort] = useState<Sort>("stars");
  const [q, setQ] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    loadLiveRepos(ac.signal)
      .then((list) => {
        setRepos(list);
        setStatus("live");
      })
      .catch(() => {
        if (!ac.signal.aborted) setStatus("snapshot");
      });
    return () => ac.abort();
  }, []);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return repos
      .filter((r) => (group === "all" || groupOf(r) === group) && r.name.toLowerCase().includes(needle))
      .sort((a, b) => (sort === "stars" ? b.stars - a.stars || a.name.localeCompare(b.name) : a.name.localeCompare(b.name)));
  }, [repos, group, sort, q]);

  const count = (g: Group) => repos.filter((r) => g === "all" || groupOf(r) === g).length;
  const stars = repos.reduce((n, r) => n + r.stars, 0);
  const names = useMemo(() => repos.map((r) => r.name), [repos]);
  const loop = [...names, ...names];

  return (
    <section id="repos" className="relative z-10 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="02">repositories</SectionLabel>

        <Reveal>
          <h2 className="type-row font-display text-6xl leading-none tracking-tight text-paper italic sm:text-8xl">
            {[..."every repo."].map((ch, k) => (
              <span key={k} aria-hidden="true" className="ch" style={{ "--i": k } as CSSProperties}>
                {ch === " " ? "\u00a0" : ch}
              </span>
            ))}
            <span className="sr-only">every repo.</span>
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-dim">
            Public repositories from github.com/soloxayaz and github.com/htr-tech. Hover a name to
            decode it, tap to open the details.
          </p>
          <p
            role="status"
            className={cn(
              "mt-3 font-mono text-[11px] tracking-[0.14em] uppercase",
              status === "live" ? "text-accent" : "text-dim",
            )}
          >
            {status === "live"
              ? "live from github"
              : status === "loading"
                ? "syncing with github…"
                : "offline snapshot · may be incomplete"}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-line md:grid-cols-4">
          {(
            [
              ["repositories", repos.length],
              ["soloxayaz", count("soloxayaz")],
              ["htr-tech", count("htr-tech")],
              ["stars", stars],
            ] as [string, number][]
          ).map(([label, n]) => (
            <div key={label} className="bg-ink px-5 py-6">
              <p className="font-display text-3xl tracking-tight text-paper tabular-nums sm:text-4xl">
                <Count to={n} />
              </p>
              <p className="mt-2 font-mono text-[11px] tracking-[0.16em] text-dim uppercase">{label}</p>
            </div>
          ))}
        </div>

        <div className="marquee-pause my-12 space-y-2 overflow-hidden" aria-hidden="true">
          {[false, true].map((rev) => (
            <div key={String(rev)} className="overflow-hidden">
              <div
                className={cn(
                  "marquee-track outline-type flex w-max gap-8 font-display text-5xl whitespace-nowrap sm:text-7xl",
                  rev && "marquee-rev",
                )}
              >
                {(rev ? [...loop].reverse() : loop).map((n, i) => (
                  <span key={`${n}-${i}`}>{n}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <LayoutGroup>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by account">
              {(["all", "soloxayaz", "htr-tech"] as Group[]).map((g) => {
                const on = group === g;
                return (
                  <button
                    key={g}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setGroup(g)}
                    className={cn(
                      "relative h-11 min-w-11 overflow-hidden rounded-full px-4 font-mono text-2xs tracking-[0.16em] uppercase transition-colors duration-200",
                      on ? "text-ink" : "text-dim hover:text-paper",
                    )}
                  >
                    {on && (
                      <motion.span
                        layoutId={reduced ? undefined : "repo-pill"}
                        className="absolute inset-0 rounded-full bg-paper"
                        transition={{ duration: 0.28, ease: easeOut }}
                      />
                    )}
                    <span className="relative z-10">{g}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>

          <div className="flex items-center gap-4">
            <label className="flex h-11 items-center gap-2 border-b border-line focus-within:border-accent">
              <Search className="size-4 text-dim" aria-hidden="true" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="search repos"
                aria-label="Search repositories"
                className="w-40 bg-transparent font-mono text-xs text-paper outline-none placeholder:text-dim/70"
              />
            </label>
            <button
              type="button"
              onClick={() => setSort((s) => (s === "stars" ? "name" : "stars"))}
              className="h-11 font-mono text-2xs tracking-[0.16em] text-dim uppercase hover:text-paper"
            >
              sort: {sort === "stars" ? "stars" : "a–z"}
            </button>
          </div>
        </div>

        <p className="mb-2 font-mono text-[11px] tracking-[0.14em] text-dim uppercase">
          showing {visible.length} of {repos.length}
        </p>

        {visible.length === 0 ? (
          <p className="border-t border-line py-10 font-display text-2xl text-paper italic">
            No repository matches &ldquo;{q}&rdquo;.{" "}
            <button type="button" onClick={() => setQ("")} className="link-draw font-mono text-xs not-italic tracking-[0.16em] text-accent uppercase">
              clear search
            </button>
          </p>
        ) : (
          <ol className="border-t border-line">
            {visible.map((r, i) => {
              const key = `${r.owner}/${r.name}`;
              return (
                <Row
                  key={key}
                  repo={r}
                  index={i}
                  reduced={reduced}
                  open={openKey === key}
                  onToggle={() => setOpenKey((k) => (k === key ? null : key))}
                />
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
