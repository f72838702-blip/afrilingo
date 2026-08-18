// AfriLingo — préchargement audio d'une leçon (warm-cache).
// Appelé au mount du LessonRunner : précharge tous les audioId référencés par la leçon.

import type { Exercise, Lesson } from "@/types";
import { preloadAudio } from "./audio";

/** Extrait tous les audioId référencés par une leçon (prompts, options, target, listen). */
export function lessonAudioIds(lesson: Lesson): string[] {
  const ids = new Set<string>();
  for (const ex of lesson.exercises) {
    collectFromExercise(ex, ids);
  }
  return [...ids];
}

function collectFromExercise(ex: Exercise, ids: Set<string>): void {
  const push = (audio?: string) => {
    if (audio) ids.add(audio);
  };
  push(ex.prompt?.audio);
  switch (ex.type) {
    case "multiple_choice":
      push(ex.question.audio);
      for (const o of ex.options) push(o.text.audio);
      break;
    case "matching":
      for (const p of ex.pairs) {
        push(p.left.audio);
        push(p.right.audio);
      }
      break;
    case "sentence_assembly":
      push(ex.target.audio);
      break;
    case "character_match":
      // pas d'audio
      break;
    case "character_trace":
      // pas d'audio
      break;
    case "listen_and_type":
      push(ex.audio);
      push(ex.displayHint?.audio);
      break;
  }
}

export function warmLessonAudio(lesson: Lesson): void {
  for (const id of lessonAudioIds(lesson)) preloadAudio(id);
}