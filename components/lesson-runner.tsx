// AfriLingo — orchestrateur de leçon : progression, cœurs, XP, badges, fin.
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import type { Exercise } from "@/types";
import { findCourseByLessonId, getLesson } from "@/lib/course-loader";
import { warmLessonAudio } from "@/lib/audio-cache";
import { playSfx, warmAudioContext } from "@/lib/audio";
import {
  addXp,
  awardBadge,
  completeLesson,
  getSnapshot,
  loseHeart,
  useProgress,
} from "@/lib/progress-store";
import { tickHearts } from "@/lib/progress-store";
import { newlyEarnedBadges } from "@/lib/badges";
import { XP_PER_CORRECT } from "@/lib/constants";
import { ExerciseProgressBar } from "./exercise-progress-bar";
import { Hearts } from "./hearts";
import { XpBurst } from "./xp-burst";
import { ExerciseRenderer } from "./exercise-renderer";
import { Button } from "./ui/button";

export function LessonRunner({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const progress = useProgress();
  const [index, setIndex] = useState(0);
  const [burst, setBurst] = useState(false);
  const burstTimer = useRef<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // Résout le cours propriétaire de la leçon (routage par id de leçon, multi-cours).
  const course = findCourseByLessonId(lessonId);
  const lesson = course ? getLesson(course.course_id, lessonId) : null;

  // Rejouer une leçon déjà terminée ? (pas d'XP par bonne réponse pour éviter
  // le farming infini — la complétion finale est aussi no-op côté XP dans le store).
  const isReplay = progress.completedLessons.includes(lessonId);

  useEffect(() => {
    tickHearts();
  }, []);

  useEffect(() => {
    if (lesson) warmLessonAudio(lesson);
  }, [lesson]);

  // Cœurs à 0 → game over. Reset si les cœurs reviennent (regen) — sinon l'écran
  // restait collé même avec des cœurs de nouveau disponibles.
  useEffect(() => {
    if (progress.hearts <= 0 && !progress.completedLessons.includes(lessonId)) {
      setGameOver(true);
    } else if (progress.hearts > 0 && gameOver) {
      setGameOver(false);
    }
  }, [progress.hearts, lessonId, progress.completedLessons, gameOver]);

  if (!lesson) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted">Leçon introuvable.</p>
        <Link href="/" className="mt-4 inline-block text-terre">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const exercises: Exercise[] = lesson.exercises;
  const current = exercises[index];

  const handleResult = (correct: boolean) => {
    // Feedback sonore (Web Audio) : succès (deux notes) / échec (note grave).
    // Déclenché par le clic utilisateur → OK iOS.
    warmAudioContext();
    playSfx(correct ? "correct" : "wrong");

    if (correct) {
      // Pas d'XP par bonne réponse en replay (anti-farming) — la 1ère
      // complétion donne déjà XP_PER_CORRECT × bonnes réponses + XP_PER_LESSON.
      if (!isReplay) addXp(XP_PER_CORRECT);
      awardBadge("first_word");
      // Burst visuel.
      setBurst(true);
      if (burstTimer.current) window.clearTimeout(burstTimer.current);
      burstTimer.current = window.setTimeout(() => setBurst(false), 700);
    } else {
      loseHeart();
    }
    // Badge scribe pour le trace (peu importe réussite, dès qu'on a tracé et validé).
    if (current.type === "character_trace" && correct) awardBadge("scribe_nko");

    // Cœurs épuisés ?
    const heartsAfter = correct ? progress.hearts : progress.hearts - 1;
    if (heartsAfter <= 0 && !progress.completedLessons.includes(lessonId)) {
      setGameOver(true);
      return;
    }

    // Avance ou termine.
    if (index + 1 >= exercises.length) {
      completeLesson(lessonId);
      awardBadge("module_1_done");
      // Badges dérivés (griot_mande si module fini, streak_7 si ≥7j).
      const fresh = getSnapshot();
      for (const b of newlyEarnedBadges(fresh)) awardBadge(b);
      router.push(`/lesson/${lessonId}/complete`);
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (gameOver) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="text-5xl">💔</div>
        <h2 className="text-xl font-bold text-cream">Cœurs épuisés !</h2>
        <p className="max-w-xs text-sm text-muted">
          Reviens dans quelques heures — tes cœurs se régénèrent (1 toutes les 5 h).
        </p>
        <Button variant="primary" size="lg" onClick={() => router.push("/")}>
          Retour à l&apos;accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-32 pt-4">
      {/* Header : progression + cœurs + fermer */}
      <div className="flex items-center gap-3 pb-1">
        <Link href="/" aria-label="Quitter la leçon" className="text-muted hover:text-cream">
          <X className="h-6 w-6" />
        </Link>
        <ExerciseProgressBar current={index} total={exercises.length} />
        <Hearts hearts={progress.hearts} />
      </div>
      <p className="mb-3 text-center text-[11px] font-medium text-muted">
        Exercice {Math.min(index + 1, exercises.length)} / {exercises.length}
      </p>

      {/* Burst XP (masqué en replay : pas d'XP gagnée) */}
      <div className="relative">
        <XpBurst amount={XP_PER_CORRECT} show={burst && !isReplay} />
        <div className="pt-6">
          <ExerciseRenderer
            key={current.id}
            exercise={current}
            onResult={handleResult}
          />
        </div>
      </div>
    </div>
  );
}