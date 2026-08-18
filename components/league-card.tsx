// AfriLingo — carte de league (mock statique, joueur inséré selon XP).
"use client";

import { useProgress } from "@/lib/progress-store";
import { LEAGUE_BY_ID, leagueForXp } from "@/data/leagues";
import type { LeagueMember } from "@/types";
import { cn } from "@/lib/format";
import { Crown } from "lucide-react";

const TIER_LABEL: Record<string, string> = {
  bronze: "Bronze",
  argent: "Argent",
  or: "Or",
};

export function LeagueCard() {
  const p = useProgress();
  const leagueId = leagueForXp(p.totalXp);
  const league = LEAGUE_BY_ID[leagueId] ?? LEAGUE_BY_ID["lg_bronze"];

  // Insère l'XP réelle du joueur dans les membres.
  const members: LeagueMember[] = league.members
    .map((m) => (m.isYou ? { ...m, xp: p.totalXp } : m))
    .sort((a, b) => b.xp - a.xp);

  return (
    <div className="rounded-3xl border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-gold" />
          <h3 className="text-sm font-bold text-cream">{league.name}</h3>
        </div>
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-semibold text-muted">
          Tier {TIER_LABEL[league.tier]}
        </span>
      </div>
      <ol className="space-y-2">
        {members.map((m, i) => (
          <li
            key={m.name + i}
            className={cn(
              "flex items-center justify-between rounded-xl px-3 py-2 text-sm",
              m.isYou ? "bg-terre/20 ring-1 ring-terre" : "bg-surface-2"
            )}
          >
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "w-5 text-right text-xs font-bold",
                  i === 0 ? "text-gold" : "text-muted"
                )}
              >
                {i + 1}
              </span>
              <span className={m.isYou ? "font-bold text-cream" : "text-cream"}>
                {m.name}
              </span>
            </span>
            <span className="text-xs font-semibold text-muted">{m.xp} XP</span>
          </li>
        ))}
      </ol>
    </div>
  );
}