// AfriLingo — bouton primitif (hand-rolled, pas de shadcn).
"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-terre text-cream hover:bg-terre-2 active:bg-terre shadow-[0_4px_0_#7a3f20]",
  secondary:
    "bg-surface-2 text-cream hover:bg-surface-3 active:bg-surface-3 border border-line",
  ghost: "bg-transparent text-cream hover:bg-surface-2",
  danger:
    "bg-rose text-cream hover:brightness-110 active:brightness-95 shadow-[0_4px_0_#8a3a36]",
  success:
    "bg-jade text-cream hover:bg-jade-2 active:bg-jade-2 shadow-[0_4px_0_#1d5a42]",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-xl",
  md: "h-12 px-5 text-base rounded-2xl",
  lg: "h-14 px-6 text-lg rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", fullWidth, className, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:translate-y-0.5 disabled:opacity-40 disabled:shadow-none disabled:active:translate-y-0",
          VARIANTS[variant],
          SIZES[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);