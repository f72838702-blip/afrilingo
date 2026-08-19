// AfriLingo — carte de cours (catalogue home).
// Affiche un cours : titre, glyphe/titre N'Ko, description, progression
// (leçons complétées / total) et un CTA vers /course/[courseId].
"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import type { Course } from "@/types";
import { getLessonChain } from "@/lib/course-loader";
import { useProgress } from "@/lib/progress-store";
import { Nko } from "./direction-text";
import { cn } from "@/lib/format";

export function CourseCard({ course }: { course: Course }) {
  const progress = useProgress();
  const chain = getLessonChain(course.course_id);
  const total = chain.length;
  const done = chain.filter((l) => progress.completedLessons.includes(l.id)).length;
  const started = done > 0;
  const complete = total > 0 && done === total;

  return (
    <Link
      href={`/course/${course.course_id}`}
      className="block rounded-2xl border border-line bg-surface p-4 transition hover:border-ocre/50 hover:bg-surface-2"
      aria-label={`Cours ${course.title}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-cream">{course.title}</h3>
          {course.title_nko && (
            <Nko className="mt-1 text-2xl text-gold" dir="rtl">
              {course.title_nko}
            </Nko>
          )}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold",
            complete
              ? "bg-jade/20 text-jade"
              : started
                ? "bg-ocre/20 text-ocre"
                : "bg-surface-3 text-muted"
          )}
        >
          {complete ? "Terminé" : started ? "En cours" : "Nouveau"}
        </span>
      </div>

      {course.description && (
        <p className="mt-2 line-clamp-2 text-xs text-muted">{course.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        {/* Progression */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted">
            {complete ? (
              <CheckCircle2 className="h-4 w-4 text-jade" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
            <span>
              {done}/{total} leçons
            </span>
          </div>
        </div>
        <span className="flex items-center gap-1 text-sm font-semibold text-terre">
          {started ? "Continuer" : "Commencer"}{" "}
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>

      {/* Barre de progression */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-jade to-gold transition-all"
          style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
        />
      </div>
    </Link>
  );
}