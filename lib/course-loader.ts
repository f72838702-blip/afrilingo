// AfriLingo — chargeur de cours (style repository, synchrone depuis data/).
// Interface conçue pour brancher Supabase plus tard sans refactor : on lirait
// `getCourse()` depuis une table au lieu d'un import statique. Le consommateur reste identique.

import type { Course, Lesson, Module } from "@/types";
import { FR_NKO_COURSE } from "@/data/courses/fr-nko";

const COURSES: Record<string, Course> = {
  "fr-nko": FR_NKO_COURSE,
};

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

/** Id de cours phare (utilisé par l'UI Home). */
export const FLAGSHIP_COURSE_ID = "fr-nko";