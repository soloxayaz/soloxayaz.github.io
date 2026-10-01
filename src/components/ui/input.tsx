import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full border-0 border-b border-line bg-transparent px-0 py-2 font-sans text-base text-paper placeholder:text-dim/70",
        "transition-[border-color] duration-200 ease-out",
        "focus:border-accent focus:outline-none",
        "aria-[invalid=true]:border-dusk",
        className,
      )}
      {...props}
    />
  );
}
