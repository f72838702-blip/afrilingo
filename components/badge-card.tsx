// AfriLingo — carte de badge (obtenu ou verrouillé).
"use client";

import * as Icon from "lucide-react";
import type { Badge, BadgeId } from "@/types";
import { cn } from "@/lib/format";

export function BadgeCard({
  badge,
  earned,
  className,
}: {
  badge: Badge;
  earned: boolean;
  className?: string;
}) {
  const LucideIcon =
    (Icon as unknown as Record<string, Icon.LucideIcon>)[badge.icon] ??
    Icon.Award;
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border p-3 text-center",
        earned
          ? "border-gold/40 bg-gold/10"
          : "border-line bg-surface-2 opacity-60",
        className
      )}
      aria-label={`Badge ${badge.name}${earned ? " obtenu" : " verrouillé"}`}
    >
      <div
        className={cn(
          "grid h-12 w-12 place-items-center rounded-xl",
          earned ? "bg-gold text-ink" : "bg-surface-3 text-muted"
        )}
      >
        <LucideIcon className="h-6 w-6" />
      </div>
      <div>
        <p className={cn("text-xs font-bold", earned ? "text-gold" : "text-muted")}>
          {badge.name}
        </p>
        <p className="text-[10px] leading-tight text-muted">{badge.description}</p>
      </div>
    </div>
  );
}

export { type BadgeId };