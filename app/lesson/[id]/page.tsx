// AfriLingo — page d'exécution d'une leçon (client, useParams pour Next 16).
"use client";

import { useParams } from "next/navigation";
import { LessonRunner } from "@/components/lesson-runner";

export default function LessonPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) return null;
  return <LessonRunner lessonId={id} />;
}