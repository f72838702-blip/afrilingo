// AfriLingo — barre de progression segmentée (un segment par exercice de la leçon).
"use client";

import { cn } from "@/lib/format";

export function ExerciseProgressBar({
  current,
  total,
  className,
}: {
  current: number; // index de l'exercice en cours (0-based)
  total: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-1 items-center gap-1.5", className)} role="progressbar" aria-label="Progression de la leçon">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-2.5 flex-1 rounded-full transition-colors",
            i < current
              ? "bg-jade"
              : i === current
                ? "bg-gold"
                : "bg-surface-3"
          )}
        />
      ))}
    </div>
  );
}