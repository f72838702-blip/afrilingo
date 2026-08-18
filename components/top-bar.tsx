// AfriLingo — barre supérieure (cœurs / XP / streak) + lien profil.
"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useProgress } from "@/lib/progress-store";
import { Hearts } from "./hearts";
import { StreakFlame } from "./streak-flame";

export function TopBar() {
  const p = useProgress();
  return (
    <header className="sticky top-0 z-30 bg-ink/80 backdrop-blur-md border-b border-line">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <Hearts hearts={p.hearts} />
        <div className="flex items-center gap-4">
          <div
            className="rounded-full bg-surface px-3 py-1 text-sm font-bold text-gold"
            aria-label={`XP total ${p.totalXp}`}
          >
            {p.totalXp} XP
          </div>
          <StreakFlame days={p.streakDays} />
        </div>
        <Link
          href="/profile"
          aria-label="Profil"
          className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-cream hover:bg-surface-3"
        >
          <User className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}