import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.16em] transition-[transform,background-color,color,border-color,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        primary: "bg-paper text-ink hover:bg-accent",
        outline:
          "border border-paper/40 bg-transparent text-paper hover:border-paper hover:bg-paper hover:text-ink",
        ghost: "text-dim hover:text-paper",
      },
      size: {
        md: "h-11 min-h-11 px-5",
        lg: "h-12 min-h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
