import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

const FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-6xl flex-col justify-center gap-3 px-5 py-24 sm:px-8">
      <span className="text-dusk" aria-hidden="true">
        <TriangleAlert className="size-8" strokeWidth={1.75} />
      </span>
      <h1 className="font-display text-3xl text-paper italic">something went wrong</h1>
      <p className="max-w-md text-sm leading-relaxed break-words text-dim">
        {errorMessage(error)}
      </p>
    </main>
  );
}
