// AfriLingo — moteur d'exercices (logique pure).
// Validation par type + normalisation tolérante (strip des diacritiques tonaux N'Ko U+07EB–U+07F3).
// Le registry des composants React vit dans components/exercise-renderer.tsx (lib reste pur).

import type {
  CharacterMatchExercise,
  CharacterTraceExercise,
  Exercise,
  ListenAndTypeExercise,
  MatchingExercise,
  MultipleChoiceExercise,
  SentenceAssemblyExercise,
} from "@/types";

// ---- Réponses typées par exercice ----

export interface MultipleChoiceAnswer {
  selected: number; // index d'option
}
export interface MatchingAnswer {
  /** leftId → rightId (les ids sont les positions, sérialisés en string). */
  mapping: Record<number, number>;
}
export interface SentenceAssemblyAnswer {
  tokens: string[]; // ordre des jetons assemblés
}
export interface CharacterTraceAnswer {
  coverage: number; // 0..1
}
export interface CharacterMatchAnswer {
  glyph: string; // glyphe sélectionné
}
export interface ListenAndTypeAnswer {
  text: string;
}

export type ExerciseAnswer =
  | MultipleChoiceAnswer
  | MatchingAnswer
  | SentenceAssemblyAnswer
  | CharacterTraceAnswer
  | CharacterMatchAnswer
  | ListenAndTypeAnswer;

// ---- Normalisation ----

/** Strip les diacritiques tonaux/nasaux N'Ko (U+07EB–U+07F3). */
export function stripNkoTones(s: string): string {
  let out = "";
  for (const ch of s) {
    const cp = ch.codePointAt(0)!;
    if (cp >= 0x07eb && cp <= 0x07f3) continue;
    out += ch;
  }
  return out;
}

/** Normalisation de comparaison : trim, lowercase, collapse spaces, strip tons N'Ko. */
export function normalize(s: string): string {
  return stripNkoTones(s.trim().toLowerCase()).replace(/\s+/g, " ");
}

// ---- Validation par type (union discriminée → TS narrow) ----

export function validateAnswer(ex: Exercise, ans: ExerciseAnswer): boolean {
  switch (ex.type) {
    case "multiple_choice":
      return validateMultipleChoice(ex, ans as MultipleChoiceAnswer);
    case "matching":
      return validateMatching(ex, ans as MatchingAnswer);
    case "sentence_assembly":
      return validateSentenceAssembly(ex, ans as SentenceAssemblyAnswer);
    case "character_trace":
      return validateCharacterTrace(ex, ans as CharacterTraceAnswer);
    case "character_match":
      return validateCharacterMatch(ex, ans as CharacterMatchAnswer);
    case "listen_and_type":
      return validateListenAndType(ex, ans as ListenAndTypeAnswer);
  }
}

function validateMultipleChoice(
  ex: MultipleChoiceExercise,
  ans: MultipleChoiceAnswer
): boolean {
  const opt = ex.options[ans.selected];
  return !!opt && opt.correct;
}

function validateMatching(ex: MatchingExercise, ans: MatchingAnswer): boolean {
  // Chaque paire i : la réponse doit mapper leftIndex i → rightIndex i.
  for (let i = 0; i < ex.pairs.length; i++) {
    if (ans.mapping[i] !== i) return false;
  }
  return true;
}

function validateSentenceAssembly(
  ex: SentenceAssemblyExercise,
  ans: SentenceAssemblyAnswer
): boolean {
  const got = normalize(ans.tokens.join(" "));
  const wantNko = ex.target.nko ? normalize(ex.target.nko) : null;
  const wantLatin = ex.target.latin ? normalize(ex.target.latin) : null;
  if (wantNko && got === wantNko) return true;
  if (wantLatin && got === wantLatin) return true;
  return false;
}

function validateCharacterTrace(
  ex: CharacterTraceExercise,
  ans: CharacterTraceAnswer
): boolean {
  return ans.coverage >= ex.coverageTarget;
}

function validateCharacterMatch(
  ex: CharacterMatchExercise,
  ans: CharacterMatchAnswer
): boolean {
  const opt = ex.options.find((o) => o.glyph === ans.glyph);
  return !!opt && opt.correct;
}

function validateListenAndType(
  ex: ListenAndTypeExercise,
  ans: ListenAndTypeAnswer
): boolean {
  const got = normalize(ans.text);
  return ex.accept.some((a) => normalize(a) === got);
}

// ---- Utilitaires ----

/** Mélange (Fisher-Yates) — variante déterministe par index fourni (pas de Math.random : on prend un seed). */
export function shuffle<T>(arr: readonly T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Mélange les options d'un QCM (retourne un nouveau tableau d'options mélangées). */
export function shuffleOptions<T extends { correct?: boolean }>(
  options: readonly T[]
): T[] {
  return shuffle(options);
}