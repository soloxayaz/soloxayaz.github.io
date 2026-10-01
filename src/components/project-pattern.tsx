import { cn } from "@/lib/utils";
import type { Project } from "@/lib/content";

export function ProjectPattern({
  pattern,
  className,
}: {
  pattern: Project["pattern"];
  className?: string;
}) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {pattern === "radial" && <div className="pat-radial absolute inset-0" />}
      {pattern === "lines" && <div className="pat-lines absolute inset-0" />}
      {pattern === "grid" && <div className="pat-grid absolute inset-0" />}
      {pattern === "slash" && <div className="pat-slash absolute inset-0" />}
      {pattern === "dots" && <div className="pat-dots absolute inset-0" />}
      {pattern === "void" && (
        <div className="pat-void absolute inset-0">
          <div className="absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/20" />
        </div>
      )}
      {pattern === "orbit" && (
        <>
          <div className="absolute top-1/2 left-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/30" />
          <div className="absolute top-1/2 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/10" />
          <div className="absolute top-[28%] left-[62%] size-3 rounded-full bg-accent/80" />
        </>
      )}
      {pattern === "wave" && (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="none">
          <path
            d="M0 180 C 80 120, 140 240, 220 170 S 340 90, 400 150"
            fill="none"
            stroke="currentColor"
            className="text-accent/40"
            strokeWidth="1.5"
          />
          <path
            d="M0 210 C 90 150, 150 260, 240 190 S 350 120, 400 180"
            fill="none"
            stroke="currentColor"
            className="text-paper/15"
            strokeWidth="1.5"
          />
        </svg>
      )}
    </div>
  );
}
