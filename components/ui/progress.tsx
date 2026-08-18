// AfriLingo — barre de progression primitive.
import { cn } from "@/lib/format";

export function ProgressBar({
  value,
  max = 1,
  className,
  barClassName,
}: {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className={cn("h-2.5 w-full rounded-full bg-surface-3 overflow-hidden", className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-jade to-ocre transition-all duration-300",
          barClassName
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}