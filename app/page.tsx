// AfriLingo — page d'accueil : skill tree + barre supérieure + objectif quotidien.
"use client";

import { TopBar } from "@/components/top-bar";
import { SkillTree } from "@/components/skill-tree";
import { useProgress } from "@/lib/progress-store";
import { useTodayKey } from "@/lib/use-today-key";
import { XP_PER_LESSON } from "@/lib/constants";
import { Nko } from "@/components/direction-text";

export default function Home() {
  const progress = useProgress();
  const today = useTodayKey();
  // Objectif quotidien : ≥1 leçon complétée AUJOURD'HUI (basé sur l'historique
  // des jours actifs, pas sur le cumul total des leçons). SSR-safe : `today`
  // est null au 1er render → 0/1 (état neutre, pas de mismatch d'hydration).
  const lessonsToday = today && progress.activeDates.includes(today) ? 1 : 0;
  const dailyGoal = 1; // 1 leçon / jour

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-md px-4 pb-16">
        {/* Titre du cours */}
        <div className="py-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-ocre">
            Cours phare
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-cream">
            N&apos;Ko — Salutations
          </h1>
          <Nko className="mt-1 block text-3xl text-gold">ߒߞߏ</Nko>
        </div>

        {/* Objectif quotidien */}
        <div className="mb-6 rounded-2xl border border-line bg-surface p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-cream">Objectif quotidien</span>
            <span className="text-muted">
              {Math.min(lessonsToday, dailyGoal)}/{dailyGoal} leçon
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-jade to-gold transition-all"
              style={{
                width: `${Math.min(100, (lessonsToday / dailyGoal) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            Complète une leçon pour valider ta journée (+{XP_PER_LESSON} XP).
          </p>
        </div>

        {/* Skill tree */}
        <SkillTree />

        {/* Note culturelle */}
        <div className="mt-8 rounded-2xl border border-line bg-surface-2 p-4 text-center">
          <p className="text-xs text-muted">
            Le N&apos;Ko (ߒߞߏ) a été inventé en 1949 par Solomana Kante pour
            transcrire les langues mandingues. Il s&apos;écrit de droite à gauche.
          </p>
        </div>
      </main>
    </div>
  );
}