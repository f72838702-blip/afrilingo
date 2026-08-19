// AfriLingo — page d'un cours : en-tête (titre + glyphe N'Ko) + skill tree.
// Route: /course/[courseId]. Le cours vient du registre (multi-cours illimité).
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCourse } from "@/lib/course-loader";
import { SkillTree } from "@/components/skill-tree";
import { TopBar } from "@/components/top-bar";
import { Nko } from "@/components/direction-text";

export default function CoursePage() {
  const params = useParams<{ courseId: string }>();
  const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;
  const course = courseId ? getCourse(courseId) : null;

  if (!course) {
    return (
      <div className="min-h-screen">
        <TopBar />
        <main className="mx-auto max-w-md px-4 py-10 text-center">
          <p className="text-muted">Cours introuvable.</p>
          <Link href="/" className="mt-4 inline-block text-terre hover:underline">
            Retour à l&apos;accueil
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-md px-4 pb-16">
        {/* Retour */}
        <Link
          href="/"
          className="mt-3 inline-flex items-center gap-1 text-sm text-muted hover:text-cream"
        >
          <ArrowLeft className="h-4 w-4" /> Tous les cours
        </Link>

        {/* En-tête du cours */}
        <div className="py-4 text-center">
          <h1 className="text-2xl font-extrabold text-cream">{course.title}</h1>
          {course.title_nko && (
            <Nko className="mt-1 block text-3xl text-gold" dir="rtl">
              {course.title_nko}
            </Nko>
          )}
          {course.description && (
            <p className="mx-auto mt-2 max-w-xs text-xs text-muted">
              {course.description}
            </p>
          )}
        </div>

        {/* Skill tree du cours */}
        <SkillTree courseId={course.course_id} />

        {/* Note culturelle (propres au cours, si description présente) */}
        {course.modules[0]?.description && (
          <div className="mt-6 rounded-2xl border border-line bg-surface-2 p-4 text-center">
            <p className="text-xs text-muted">{course.modules[0].description}</p>
          </div>
        )}
      </main>
    </div>
  );
}