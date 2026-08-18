// AfriLingo — profil : XP, niveau, calendrier streak, badges, league, reset.
"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useProgress, resetProgress } from "@/lib/progress-store";
import { last7Days } from "@/lib/streak";
import { BADGES } from "@/data/badges";
import { BadgeCard } from "@/components/badge-card";
import { LeagueCard } from "@/components/league-card";
import { TranslitToggle } from "@/components/translit-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/format";

export default function ProfilePage() {
  const progress = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const week = last7Days();
  const level = Math.floor(progress.totalXp / 100) + 1;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
          <Link
            href="/"
            aria-label="Retour"
            className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-cream hover:bg-surface-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold text-cream">Profil</h1>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-4 py-6 pb-20">
        {/* Stats principales */}
        <div className="grid grid-cols-3 gap-3">
          <Stat label="XP total" value={progress.totalXp} accent="text-gold" />
          <Stat label="Niveau" value={level} accent="text-jade" />
          <Stat
            label="Série"
            value={`${progress.streakDays}j`}
            accent="text-ocre"
          />
        </div>

        {/* Calendrier streak 7j */}
        <section className="rounded-3xl border border-line bg-surface p-4">
          <h2 className="mb-3 text-sm font-bold text-cream">7 derniers jours</h2>
          <div className="flex justify-between gap-2">
            {week.map((day) => {
              const active = progress.lastActiveDate === day;
              const d = new Date(day);
              const label = ["D", "L", "M", "M", "J", "V", "S"][d.getDay()];
              return (
                <div
                  key={day}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 rounded-xl py-2",
                    active ? "bg-gold/15" : "bg-surface-2"
                  )}
                >
                  <span className="text-[10px] text-muted">{label}</span>
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      active ? "bg-gold" : "bg-surface-3"
                    )}
                  />
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-center text-xs text-muted">
            Record : {progress.longestStreak} jour{progress.longestStreak > 1 ? "s" : ""}
          </p>
        </section>

        {/* Affichage translittération */}
        <section className="rounded-3xl border border-line bg-surface p-4">
          <h2 className="mb-3 text-sm font-bold text-cream">
            Affichage du texte
          </h2>
          <TranslitToggle />
        </section>

        {/* Badges */}
        <section>
          <h2 className="mb-3 text-sm font-bold text-cream">Badges</h2>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((b) => (
              <BadgeCard
                key={b.id}
                badge={b}
                earned={progress.badges.includes(b.id)}
              />
            ))}
          </div>
        </section>

        {/* League */}
        <section>
          <h2 className="mb-3 text-sm font-bold text-cream">Ligue</h2>
          <LeagueCard />
        </section>

        {/* Reset */}
        <section className="rounded-3xl border border-line bg-surface p-4">
          <h2 className="mb-2 text-sm font-bold text-cream">Réinitialiser</h2>
          <p className="mb-3 text-xs text-muted">
            Efface ta progression, tes XP et tes badges. Action irréversible.
          </p>
          {confirmReset ? (
            <div className="flex gap-2">
              <Button
                variant="danger"
                size="sm"
                fullWidth
                onClick={() => {
                  resetProgress();
                  setConfirmReset(false);
                }}
              >
                Confirmer
              </Button>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => setConfirmReset(false)}
              >
                Annuler
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => setConfirmReset(true)}
            >
              <RotateCcw className="h-4 w-4" /> Réinitialiser la progression
            </Button>
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-3 text-center">
      <p className={cn("text-2xl font-extrabold", accent)}>{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}