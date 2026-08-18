// AfriLingo — cours phare : Français ↔ N'Ko.
// Module « Salutations & Courtoisie » — 3 leçons × 6 exercices.
// Vocabulaire vérifié (cf. data/vocab/fr-nko-greetings.ts & -numbers.ts).
// Une sentence_assembly en N'Ko RTL showcase le dir="rtl".

import type { Course } from "@/types";

export const FR_NKO_COURSE: Course = {
  course_id: "fr-nko",
  source_language: "fr",
  target_language: "nko",
  target_script_direction: "rtl",
  title: "N'Ko — Salutations & Courtoisie",
  title_nko: "ߒߞߏ",
  description:
    "Apprends à saluer, remercier et prendre congé en mandingue, écrit en N'Ko (ߒߞߏ).",
  modules: [
    {
      id: "mod_1",
      title: "Salutations & Courtoisie",
      title_nko: "ߞߊߣߌ ߞߣߌ",
      description: "Premiers mots, politesse et formules de congé.",
      lessons: [
        {
          id: "less_1_1",
          title: "Premiers mots",
          rewardXp: 50,
          exercises: [
            {
              id: "e1",
              type: "multiple_choice",
              question: {
                fr: "Comment dit-on « bonjour » en N'Ko ?",
              },
              display: "nko+latin",
              options: [
                { text: { nko: "ߌ ߣߌ ߗߋ", latin: "i ni cɛ", audio: "nko/g1" }, correct: true },
                { text: { nko: "ߞߋߣߋ", latin: "kɛnɛ", audio: "nko/g6" }, correct: false },
                { text: { nko: "ߖߋ", latin: "jɛ", audio: "nko/g8" }, correct: false },
                { text: { nko: "ߢߋ", latin: "ɲɛ", audio: "nko/g10" }, correct: false },
              ],
            },
            {
              id: "e2",
              type: "character_trace",
              glyph: "ߋ",
              latin: "ɛ",
              meaning: "Voyelle ɛ — comme dans « cɛ » (cɛ = ߗߋ)",
              coverageTarget: 0.6,
            },
            {
              id: "e3",
              type: "matching",
              prompt: { fr: "Associe chaque salutation à son sens." },
              pairs: [
                { left: { nko: "ߌ ߣߌ ߗߋ", latin: "i ni cɛ", audio: "nko/g1" }, right: { fr: "Bonjour" } },
                { left: { nko: "ߐ ߣߌ ߗߋ", latin: "ɔ ni cɛ", audio: "nko/g4" }, right: { fr: "Et bonjour à toi" } },
                { left: { nko: "ߌ ߣߌ ߛߎ", latin: "i ni su", audio: "nko/g3" }, right: { fr: "Bonsoir" } },
                { left: { nko: "ߞߋߣߋ", latin: "kɛnɛ", audio: "nko/g6" }, right: { fr: "Ça va" } },
              ],
            },
            {
              id: "e4",
              type: "multiple_choice",
              question: {
                nko: "ߌ ߞߊ ߞߋߣߋ ߥߊ?",
                latin: "i ka kɛnɛ wa?",
                audio: "nko/g5",
              },
              display: "nko+latin",
              audioFirst: true,
              options: [
                { text: { fr: "Comment vas-tu ?" }, correct: true },
                { text: { fr: "Bonsoir" }, correct: false },
                { text: { fr: "Merci" }, correct: false },
                { text: { fr: "Au revoir" }, correct: false },
              ],
            },
            {
              id: "e5",
              type: "sentence_assembly",
              target: {
                nko: "ߌ ߣߌ ߗߋ",
                latin: "i ni cɛ",
                fr: "Bonjour",
                audio: "nko/g1",
              },
              bank: ["ߌ", "ߣߌ", "ߗߋ"],
              bankScript: "nko",
              direction: "rtl",
            },
            {
              id: "e6",
              type: "listen_and_type",
              audio: "nko/g1",
              accept: ["i ni cɛ", "i ni ce", "ini cɛ", "ini ce"],
              displayHint: { fr: "Mot attendu : « bonjour »" },
            },
          ],
        },
        {
          id: "less_1_2",
          title: "Politesse & moments",
          rewardXp: 50,
          exercises: [
            {
              id: "e1",
              type: "multiple_choice",
              question: { fr: "Comment dit-on « bon après-midi » en N'Ko ?" },
              display: "nko+latin",
              options: [
                { text: { nko: "ߌ ߣߌ ߕߌߟߍ", latin: "i ni tile", audio: "nko/g2" }, correct: true },
                { text: { nko: "ߌ ߣߌ ߛߎ", latin: "i ni su", audio: "nko/g3" }, correct: false },
                { text: { nko: "ߞߋߣߋ", latin: "kɛnɛ", audio: "nko/g6" }, correct: false },
                { text: { nko: "ߞߊߣ ߓߋߣ", latin: "k'an bɛn", audio: "nko/g7" }, correct: false },
              ],
            },
            {
              id: "e2",
              type: "character_match",
              prompt: { fr: "Quel glyphe N'Ko représente le chiffre 3 ?" },
              options: [
                { glyph: "߃", correct: true },
                { glyph: "߂", correct: false },
                { glyph: "߄", correct: false },
                { glyph: "߁", correct: false },
              ],
            },
            {
              id: "e3",
              type: "matching",
              prompt: { fr: "Associe les formules de politesse." },
              pairs: [
                { left: { nko: "ߌ ߣߌ ߗߋ", latin: "i ni cɛ", audio: "nko/g1" }, right: { fr: "Bonjour" } },
                { left: { nko: "ߌ ߣߌ ߕߌߟߍ", latin: "i ni tile", audio: "nko/g2" }, right: { fr: "Bon après-midi" } },
                { left: { nko: "ߌ ߣߌ ߛߎ", latin: "i ni su", audio: "nko/g3" }, right: { fr: "Bonsoir" } },
                { left: { nko: "ߞߊߣ ߓߋߣ", latin: "k'an bɛn", audio: "nko/g7" }, right: { fr: "Au revoir" } },
                { left: { nko: "ߖߋ", latin: "jɛ", audio: "nko/g8" }, right: { fr: "Paix" } },
              ],
            },
            {
              id: "e4",
              type: "multiple_choice",
              question: { fr: "Que signifie le mot « jɛ » (ߖߋ) ?" },
              display: "nko+latin",
              options: [
                { text: { fr: "Paix / lumière" }, correct: true },
                { text: { fr: "Unité" }, correct: false },
                { text: { fr: "Visage" }, correct: false },
                { text: { fr: "Nuit" }, correct: false },
              ],
            },
            {
              id: "e5",
              type: "sentence_assembly",
              target: {
                nko: "ߌ ߣߌ ߛߎ",
                latin: "i ni su",
                fr: "Bonsoir",
                audio: "nko/g3",
              },
              bank: ["ߛߎ", "ߌ", "ߣߌ"],
              bankScript: "nko",
              direction: "rtl",
            },
            {
              id: "e6",
              type: "character_trace",
              glyph: "ߌ",
              latin: "i",
              meaning: "Voyelle i — comme dans « i » (toi)",
              coverageTarget: 0.6,
            },
          ],
        },
        {
          id: "less_1_3",
          title: "Au revoir & sagesse",
          rewardXp: 50,
          exercises: [
            {
              id: "e1",
              type: "multiple_choice",
              question: { fr: "Comment dit-on « au revoir » en N'Ko ?" },
              display: "nko+latin",
              options: [
                { text: { nko: "ߞߊߣ ߓߋߣ", latin: "k'an bɛn", audio: "nko/g7" }, correct: true },
                { text: { nko: "ߌ ߣߌ ߗߋ", latin: "i ni cɛ", audio: "nko/g1" }, correct: false },
                { text: { nko: "ߖߋ", latin: "jɛ", audio: "nko/g8" }, correct: false },
                { text: { nko: "ߞߍߟߍߣߦߊ", latin: "kelenya", audio: "nko/g9" }, correct: false },
              ],
            },
            {
              id: "e2",
              type: "sentence_assembly",
              target: {
                nko: "ߞߊߣ ߓߋߣ",
                latin: "k'an bɛn",
                fr: "Au revoir",
                audio: "nko/g7",
              },
              bank: ["ߓߋߣ", "ߞߊߣ"],
              bankScript: "nko",
              direction: "rtl",
            },
            {
              id: "e3",
              type: "listen_and_type",
              audio: "nko/g7",
              accept: ["k'an bɛn", "k'an ben", "kan ben", "kan bɛn"],
              displayHint: { fr: "Mot attendu : « au revoir »" },
            },
            {
              id: "e4",
              type: "character_match",
              prompt: { fr: "Quel glyphe N'Ko représente le chiffre 1 ?" },
              options: [
                { glyph: "߁", correct: true },
                { glyph: "߂", correct: false },
                { glyph: "߃", correct: false },
                { glyph: "߉", correct: false },
              ],
            },
            {
              id: "e5",
              type: "multiple_choice",
              question: {
                fr: "Proverbe : « kelenya bɛ duguɲa » signifie…",
              },
              display: "nko+latin",
              options: [
                { text: { fr: "L'unité fait la force" }, correct: true },
                { text: { fr: "La paix intérieure" }, correct: false },
                { text: { fr: "Bonjour à tous" }, correct: false },
                { text: { fr: "Au revoir bientôt" }, correct: false },
              ],
            },
            {
              id: "e6",
              type: "matching",
              prompt: { fr: "Révision : associe chaque terme à son sens." },
              pairs: [
                { left: { nko: "ߌ ߣߌ ߗߋ", latin: "i ni cɛ", audio: "nko/g1" }, right: { fr: "Bonjour" } },
                { left: { nko: "ߞߋߣߋ", latin: "kɛnɛ", audio: "nko/g6" }, right: { fr: "Ça va" } },
                { left: { nko: "ߞߊߣ ߓߋߣ", latin: "k'an bɛn", audio: "nko/g7" }, right: { fr: "Au revoir" } },
                { left: { nko: "ߖߋ", latin: "jɛ", audio: "nko/g8" }, right: { fr: "Paix" } },
                { left: { nko: "ߞߍߟߍߣߦߊ", latin: "kelenya", audio: "nko/g9" }, right: { fr: "Unité" } },
              ],
            },
          ],
        },
      ],
    },
  ],
};