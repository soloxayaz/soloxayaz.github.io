import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full resize-y border-0 border-b border-line bg-transparent px-0 py-2 font-sans text-base text-paper placeholder:text-dim/70",
        "transition-[border-color] duration-200 ease-out",
        "focus:border-accent focus:outline-none",
        "aria-[invalid=true]:border-dusk",
        className,
      )}
      {...props}
    />
  );
}
