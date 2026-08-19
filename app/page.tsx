// AfriLingo — page d'accueil : catalogue des cours + objectif quotidien.
// Multi-cours illimité : la liste vient du registre (data/courses/index.ts).
// Ajouter un cours au registre → il apparaît ici automatiquement.
"use client";

import { TopBar } from "@/components/top-bar";
import { CourseCard } from "@/components/course-card";
import { useProgress } from "@/lib/progress-store";
import { useTodayKey } from "@/lib/use-today-key";
import { allCourses } from "@/lib/course-loader";
import { XP_PER_LESSON } from "@/lib/constants";
import { Nko } from "@/components/direction-text";

export default function Home() {
  const progress = useProgress();
  const today = useTodayKey();
  const courses = allCourses();
  // Objectif quotidien : ≥1 leçon complétée AUJOURD'HUI (historique des jours actifs).
  // SSR-safe : `today` est null au 1er render → 0/1 (état neutre).
  const lessonsToday = today && progress.activeDates.includes(today) ? 1 : 0;
  const dailyGoal = 1; // 1 leçon / jour

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-md px-4 pb-16">
        {/* Titre */}
        <div className="py-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-ocre">
            Apprends les langues d&apos;Afrique
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-cream">AfriLingo</h1>
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

        {/* Catalogue de cours */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-cream">Mes cours</h2>
          <span className="text-xs text-muted">{courses.length} disponible{courses.length > 1 ? "s" : ""}</span>
        </div>
        <div className="space-y-3">
          {courses.map((c) => (
            <CourseCard key={c.course_id} course={c} />
          ))}
        </div>

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