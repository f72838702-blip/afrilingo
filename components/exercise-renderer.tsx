// AfriLingo — dispatcher d'exercices. Narrow via discriminant `ex.type` (pas de cast).
// Chaque composant prend son exercice typé et un callback onResult(correct).
"use client";

import type { Exercise } from "@/types";
import { MultipleChoice } from "./exercises/multiple-choice";
import { Matching } from "./exercises/matching";
import { SentenceAssembly } from "./exercises/sentence-assembly";
import { CharacterTrace } from "./exercises/character-trace";
import { CharacterMatch } from "./exercises/character-match";
import { ListenAndType } from "./exercises/listen-and-type";

export function ExerciseRenderer({
  exercise,
  onResult,
}: {
  exercise: Exercise;
  onResult: (correct: boolean) => void;
}) {
  switch (exercise.type) {
    case "multiple_choice":
      return <MultipleChoice exercise={exercise} onResult={onResult} />;
    case "matching":
      return <Matching exercise={exercise} onResult={onResult} />;
    case "sentence_assembly":
      return <SentenceAssembly exercise={exercise} onResult={onResult} />;
    case "character_trace":
      return <CharacterTrace exercise={exercise} onResult={onResult} />;
    case "character_match":
      return <CharacterMatch exercise={exercise} onResult={onResult} />;
    case "listen_and_type":
      return <ListenAndType exercise={exercise} onResult={onResult} />;
  }
}