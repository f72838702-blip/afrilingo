// AfriLingo — arbre de compétences (skill tree) d'un cours.
// Reçoit un `courseId` : affiche la chaîne de leçons de ce cours. La leçon
// courante (prochaine à faire) est dérivée par cours depuis `completedLessons`
// (première leçon non complétée du cours) → pas besoin d'index stocké, et ça
// marche pour un nombre illimité de cours.
"use client";

import { useProgress } from "@/lib/progress-store";
import { getLessonChain } from "@/lib/course-loader";
import type { Lesson } from "@/types";
import { SkillNode, type NodeState, type SkillNodeData } from "./skill-node";

/** Décalage horizontal sinusoïdal pour un chemin sinueux (style Duolingo). */
const OFFSETS = [0, 48, 64, 32, -16, -40, 0];

/**
 * Calcule l'état d'une leçon selon la progression (déverrouillage séquentiel).
 * `currentIndex` = indice de la prochaine leçon à faire dans CE cours (= nombre
 * de leçons complétées de la chaîne). La leçon à cet indice obtient "current"
 * (rebond style Duolingo) ; les suivantes sont verrouillées ; les précédentes
 * sont complétées.
 */
function lessonState(
  lesson: Lesson,
  index: number,
  currentIndex: number,
  completed: string[]
): NodeState {
  if (completed.includes(lesson.id)) return "completed";
  if (index === currentIndex) return "current";
  // Edge : une leçon antérieure non complétée mais atteignable → déverrouillée.
  if (index < currentIndex) return "unlocked";
  return "locked";
}

export function SkillTree({ courseId }: { courseId: string }) {
  const progress = useProgress();
  const chain = getLessonChain(courseId);
  // Index courant dérivé : 1ère leçon non complétée de ce cours.
  const currentIndex = chain.findIndex((l) => !progress.completedLessons.includes(l.id));

  const nodes: SkillNodeData[] = chain.map((l, i) => ({
    lessonId: l.id,
    title: l.title,
    state: lessonState(l, i, currentIndex, progress.completedLessons),
    href: `/lesson/${l.id}`,
  }));

  return (
    <div className="flex flex-col items-center gap-7 py-6">
      {nodes.map((n, i) => (
        <div
          key={n.lessonId}
          style={{ marginLeft: `${OFFSETS[i % OFFSETS.length]}px` }}
        >
          <SkillNode node={n} />
        </div>
      ))}
    </div>
  );
}