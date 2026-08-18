// AfriLingo — évaluation des badges dérivés (après complétion de leçon).
// Les badges événementiels (first_word, scribe_nko, module_1_done) sont attribués
// directement par le lesson-runner au moment de l'événement. Ici on calcule les
// badges dérivés de l'état global : griot_mande (module 100%) et streak_7 (≥7j).

import type { BadgeId, Progress } from "@/types";
import { FLAGSHIP_COURSE_ID, getCourse } from "./course-loader";

/** Badges dérivés que l'état actuel justifie (indépendants d'un événement ponctuel). */
export function evaluateBadges(
  progress: Progress,
  courseId: string = FLAGSHIP_COURSE_ID
): BadgeId[] {
  const out: BadgeId[] = [];
  const course = getCourse(courseId);
  if (course) {
    for (const mod of course.modules) {
      const allDone = mod.lessons.every((l) =>
        progress.completedLessons.includes(l.id)
      );
      if (allDone && mod.lessons.length > 0) {
        // Pour le MVP, le module unique → griot_mande.
        out.push("griot_mande");
      }
    }
  }
  if (progress.streakDays >= 7) out.push("streak_7");
  return out;
}

/** Applique les badges dérivés (évite les doublons avec ceux déjà possédés). */
export function newlyEarnedBadges(
  progress: Progress,
  courseId: string = FLAGSHIP_COURSE_ID
): BadgeId[] {
  return evaluateBadges(progress, courseId).filter(
    (b) => !progress.badges.includes(b)
  );
}