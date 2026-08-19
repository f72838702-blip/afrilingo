// AfriLingo — évaluation des badges dérivés (après complétion de leçon).
// Les badges événementiels (first_word, scribe_nko, module_1_done) sont attribués
// directement par le lesson-runner au moment de l'événement. Ici on calcule les
// badges dérivés de l'état global : griot_mande (un module 100 % dans N'IMPORTE
// QUEL cours) et streak_7 (≥7j). Multi-cours : on parcourt tous les cours.

import type { BadgeId, Progress } from "@/types";
import { allCourses } from "./course-loader";

/** Badges dérivés que l'état actuel justifie (indépendants d'un événement ponctuel). */
export function evaluateBadges(progress: Progress): BadgeId[] {
  const out: BadgeId[] = [];
  // griot_mande dès qu'un module entier de n'importe quel cours est complété.
  for (const course of allCourses()) {
    for (const mod of course.modules) {
      if (mod.lessons.length === 0) continue;
      if (mod.lessons.every((l) => progress.completedLessons.includes(l.id))) {
        out.push("griot_mande");
      }
    }
  }
  if (progress.streakDays >= 7) out.push("streak_7");
  return out;
}

/** Applique les badges dérivés (évite les doublons avec ceux déjà possédés). */
export function newlyEarnedBadges(progress: Progress): BadgeId[] {
  return evaluateBadges(progress).filter((b) => !progress.badges.includes(b));
}