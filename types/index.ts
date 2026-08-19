// AfriLingo — types partagés.
// Les exercices sont une union discriminée par `type` : TypeScript narrow
// automatiquement dans le switch du moteur de rendu (pas de cast manuel).

export type ISO639 = "fr" | "nko";
export type ScriptDir = "ltr" | "rtl";
export type TranslitMode = "nko" | "nko+latin" | "latin";

export type ExerciseType =
  | "multiple_choice"
  | "matching"
  | "sentence_assembly"
  | "character_trace"
  | "character_match"
  | "listen_and_type";

/** Bloc de texte localisé : N'Ko original + translittération Latin + sens FR.
 *  Tous les champs sont optionnels : un mot-cible (matching gauche) peut n'avoir
 *  que nko+latin, un sens (matching droite) que fr, une consigne que fr, etc. */
export interface LocalizedText {
  /** N'Ko original (Unicode U+07C0–U+07FF). */
  nko?: string;
  /** Translittération Latin (ex. "i ni cɛ"). */
  latin?: string;
  /** Sens / énoncé en français. */
  fr?: string;
  /** Identifiant audio (cf. data/audio-manifest.ts). */
  audio?: string;
}

// ---- Cours ----

export interface Course {
  course_id: string; // "fr-nko"
  source_language: ISO639; // "fr"
  target_language: ISO639; // "nko"
  target_script_direction: ScriptDir; // "rtl"
  title: string;
  title_nko?: string;
  description?: string;
  modules: Module[];
}

export interface Module {
  id: string; // "mod_1"
  title: string;
  title_nko?: string;
  description?: string;
  lessons: Lesson[];
  locked?: boolean;
}

export interface Lesson {
  id: string; // "less_1_1"
  title: string;
  title_nko?: string;
  exercises: Exercise[];
  /** XP bonus de complétion (défaut 50). */
  rewardXp: number;
}

// ---- Exercices (union discriminée) ----

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  /** Énoncé / consigne optionnel. */
  prompt?: LocalizedText;
  /** XP par réponse correcte (défaut 10). */
  xp?: number;
}

export interface MultipleChoiceOption {
  text: LocalizedText;
  correct: boolean;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: "multiple_choice";
  question: LocalizedText;
  options: MultipleChoiceOption[];
  display: TranslitMode;
  /** Si true, on joue l'audio de la question avant les options. */
  audioFirst?: boolean;
}

export interface MatchingPair {
  left: LocalizedText; // mot N'Ko
  right: LocalizedText; // sens FR (sans N'Ko)
}

export interface MatchingExercise extends BaseExercise {
  type: "matching";
  pairs: MatchingPair[];
}

export interface SentenceAssemblyExercise extends BaseExercise {
  type: "sentence_assembly";
  target: LocalizedText; // phrase correcte
  /** Jetons mélangés (Latin ou N'Ko selon bankScript). */
  bank: string[];
  bankScript: "nko" | "latin";
  direction: ScriptDir; // rtl pour cible N'Ko
}

export interface CharacterTraceExercise extends BaseExercise {
  type: "character_trace";
  glyph: string; // un codepoint N'Ko
  latin: string; // translittération
  meaning: string; // sens FR
  coverageTarget: number; // 0..1, défaut 0.6
}

export interface CharacterMatchOption {
  glyph: string;
  correct: boolean;
}

export interface CharacterMatchExercise extends BaseExercise {
  type: "character_match";
  prompt: LocalizedText; // "Quel glyphe pour 'kalan' ?"
  options: CharacterMatchOption[];
}

export interface ListenAndTypeExercise extends BaseExercise {
  type: "listen_and_type";
  audio: string; // audioId
  accept: string[]; // translittérations acceptées
  displayHint?: LocalizedText; // indice FR optionnel
}

export type Exercise =
  | MultipleChoiceExercise
  | MatchingExercise
  | SentenceAssemblyExercise
  | CharacterTraceExercise
  | CharacterMatchExercise
  | ListenAndTypeExercise;

// ---- Progression & gamification ----

export type BadgeId =
  | "first_word"
  | "scribe_nko"
  | "griot_mande"
  | "streak_7"
  | "module_1_done";

export interface Progress {
  version: number;
  /** Nom affiché (modifiable, défaut "Apprenant N'Ko"). */
  displayName: string;
  totalXp: number;
  hearts: number;
  lastHeartRegenAt: number; // epoch ms
  completedLessons: string[]; // ids de leçons
  lastActiveDate: string | null; // "YYYY-MM-DD"
  streakDays: number;
  longestStreak: number;
  badges: BadgeId[];
  translitMode: TranslitMode;
  leagueId: string;
  installDismissed: boolean;
  /** Index de la leçon en cours (0 = première leçon du cours phare). */
  currentLessonIndex: number;
}

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  /** Nom d'icône lucide-react. */
  icon: string;
}

export interface Streak {
  days: number;
  lastActiveDate: string | null;
  longest: number;
}

export type LeagueTier = "bronze" | "argent" | "or";

export interface LeagueMember {
  name: string;
  xp: number;
  isYou: boolean;
}

export interface League {
  id: string;
  name: string;
  tier: LeagueTier;
  members: LeagueMember[];
}