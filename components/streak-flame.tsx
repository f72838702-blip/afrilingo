// AfriLingo — flamme de streak (série de jours).
"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/format";

export function StreakFlame({
  days,
  className,
}: {
  days: number;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      aria-label={`Série de ${days} jour${days > 1 ? "s" : ""}`}
    >
      <Flame className={cn("h-5 w-5", days > 0 ? "text-gold" : "text-surface-3")} />
      <span className={cn("text-sm font-bold", days > 0 ? "text-gold" : "text-muted")}>
        {days}
      </span>
    </div>
  );
}