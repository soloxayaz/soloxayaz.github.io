import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-dim",
        className,
      )}
      {...props}
    />
  );
}
