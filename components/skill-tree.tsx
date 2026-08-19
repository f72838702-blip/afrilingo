// AfriLingo — arbre de compétences (skill tree) : module phare + modules verrouillés.
"use client";

import { useProgress } from "@/lib/progress-store";
import { getLessonChain, FLAGSHIP_COURSE_ID } from "@/lib/course-loader";
import type { Lesson } from "@/types";
import { SkillNode, type NodeState, type SkillNodeData } from "./skill-node";
import { Lock } from "lucide-react";

/** Décalage horizontal sinusoïdal pour un chemin sinueux (style Duolingo). */
const OFFSETS = [0, 48, 64, 32, -16, -40, 0];

/**
 * Calcule l'état d'une leçon selon la progression (déverrouillage séquentiel).
 * `currentLessonIndex` = indice de la prochaine leçon à faire (= nombre de
 * leçons complétées). La leçon à cet indice obtient l'état "current" (rebond
 * style Duolingo) ; les suivantes sont verrouillées ; les précédentes sont
 * complétées.
 */
function lessonState(
  lesson: Lesson,
  index: number,
  currentLessonIndex: number,
  completed: string[]
): NodeState {
  if (completed.includes(lesson.id)) return "completed";
  if (index === currentLessonIndex) return "current";
  // Edge : une leçon antérieure non complétée mais atteignable (ex. progression
  // non séquentielle) → déverrouillée et tappable, sans rebond.
  if (index < currentLessonIndex) return "unlocked";
  return "locked";
}

export function SkillTree() {
  const progress = useProgress();
  const chain = getLessonChain(FLAGSHIP_COURSE_ID);

  const nodes: SkillNodeData[] = chain.map((l, i) => ({
    lessonId: l.id,
    title: l.title,
    state: lessonState(l, i, progress.currentLessonIndex, progress.completedLessons),
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

      {/* Modules verrouillés (placeholder futur) */}
      {["Nombres & quantités", "Famille & liens", "Voyages & directions"].map(
        (title) => (
          <div
            key={title}
            className="flex flex-col items-center gap-2 opacity-50"
            aria-label={`Module ${title} (verrouillé)`}
          >
            <div className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-line bg-surface-2 text-muted">
              <Lock className="h-6 w-6" />
            </div>
            <span className="max-w-[7rem] text-center text-xs text-muted">
              {title}
            </span>
          </div>
        )
      )}
    </div>
  );
}