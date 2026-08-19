// AfriLingo — chargeur de cours (style repository, synchrone depuis data/).
// Interface conçue pour brancher Supabase plus tard sans refactor : on lirait
// `getCourse()` depuis une table au lieu d'un import statique. Le consommateur reste identique.
//
// Multi-cours illimité : le registre `data/courses/index.ts` est l'unique source.
// Ajouter un cours = une ligne dans le registre ; tout le reste (catalogue,
// skill-tree, leçons, progression) le découvre automatiquement.

import type { Course, Lesson, Module } from "@/types";
import { COURSES_REGISTRY } from "@/data/courses";

const COURSES: Record<string, Course> = Object.fromEntries(
  COURSES_REGISTRY.map((c) => [c.course_id, c])
);

/** Tous les cours enregistrés (ordre du registre). */
export function allCourses(): Course[] {
  return COURSES_REGISTRY;
}

export function getCourse(courseId: string): Course | null {
  return COURSES[courseId] ?? null;
}

export function getModule(courseId: string, moduleId: string): Module | null {
  return getCourse(courseId)?.modules.find((m) => m.id === moduleId) ?? null;
}

export function getLesson(courseId: string, lessonId: string): Lesson | null {
  for (const m of getCourse(courseId)?.modules ?? []) {
    const l = m.lessons.find((x) => x.id === lessonId);
    if (l) return l;
  }
  return null;
}

/** Chaîne linéaire de toutes les leçons du cours (pour déverrouillage séquentiel). */
export function getLessonChain(courseId: string): Lesson[] {
  const c = getCourse(courseId);
  if (!c) return [];
  return c.modules.flatMap((m) => m.lessons);
}

/** La leçon suivante dans la chaîne, ou null si c'était la dernière. */
export function getNextLesson(courseId: string, lessonId: string): Lesson | null {
  const chain = getLessonChain(courseId);
  const idx = chain.findIndex((l) => l.id === lessonId);
  if (idx < 0 || idx + 1 >= chain.length) return null;
  return chain[idx + 1];
}

/**
 * Résout le cours propriétaire d'une leçon par son id (reverss-lookup sur tous les
 * cours). Utile car le routage est `/lesson/[id]` (id de leçon global, sans cours
 * dans l'URL). Retourne null si la leçon n'existe dans aucun cours.
 */
export function findCourseByLessonId(lessonId: string): Course | null {
  for (const c of COURSES_REGISTRY) {
    for (const m of c.modules) {
      if (m.lessons.some((l) => l.id === lessonId)) return c;
    }
  }
  return null;
}

/** Récupère une leçon dans n'importe quel cours (id global). */
export function getLessonAnywhere(lessonId: string): Lesson | null {
  const c = findCourseByLessonId(lessonId);
  return c ? getLesson(c.course_id, lessonId) : null;
}

/** Id du premier cours du registre (défaut pour l'UI quand aucun cours choisi). */
export const FLAGSHIP_COURSE_ID = COURSES_REGISTRY[0]?.course_id ?? "fr-nko";