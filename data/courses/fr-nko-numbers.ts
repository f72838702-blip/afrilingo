// AfriLingo — cours N'Ko : Nombres & Chiffres.
// Contenu 100 % vérifié (data/vocab/fr-nko-numbers.ts, charte Unicode U+07C0).
// Noms mandingues vérifiés pour 0-5 (baara, kelen, fila, saba, naani, duru) ;
// 6-9 ne sont que reconnaissance du glyphe (noms non confirmés → exos = glyphe + FR).
// Audio : nko/n0..n5 (fallback speechSynthesis lit le Latin en attendant les fichiers).

import type { Course } from "@/types";

export const FR_NKO_NUMBERS_COURSE: Course = {
  course_id: "fr-nko-nombres",
  source_language: "fr",
  target_language: "nko",
  target_script_direction: "rtl",
  title: "N'Ko — Nombres & Chiffres",
  // Pas de title_nko : la traduction vérifiée en N'Ko n'est pas disponible.
  // On évite d'inventer des glyphes (consigne projet) ; le titre FR + les chiffres
  // N'Ko (߀ à ߉) dans les leçons suffisent.
  description:
    "Apprends à lire, écrire et reconnaître les chiffres N'Ko (߀ à ߉), de zéro à neuf.",
  modules: [
    {
      id: "mod_n1",
      title: "Nombres & Chiffres",
      description: "Chiffres 0 à 9 : lecture, tracé et reconnaissance.",
      lessons: [
        {
          id: "less_n1_1",
          title: "Les chiffres 0 à 3",
          rewardXp: 50,
          exercises: [
            {
              id: "e1",
              type: "character_match",
              prompt: { fr: "Quel glyphe N'Ko représente le chiffre 1 (kelen) ?" },
              options: [
                { glyph: "߁", correct: true },
                { glyph: "߂", correct: false },
                { glyph: "߃", correct: false },
                { glyph: "߀", correct: false },
              ],
            },
            {
              id: "e2",
              type: "multiple_choice",
              question: { fr: "Comment s'écrit « deux » (fila) en N'Ko ?" },
              display: "nko+latin",
              options: [
                { text: { nko: "߂", latin: "fila", audio: "nko/n2" }, correct: true },
                { text: { nko: "߁", latin: "kelen", audio: "nko/n1" }, correct: false },
                { text: { nko: "߃", latin: "saba", audio: "nko/n3" }, correct: false },
                { text: { nko: "߀", latin: "baara", audio: "nko/n0" }, correct: false },
              ],
            },
            {
              id: "e3",
              type: "matching",
              prompt: { fr: "Associe chaque chiffre à son sens." },
              pairs: [
                { left: { nko: "߀", latin: "baara", audio: "nko/n0" }, right: { fr: "Zéro" } },
                { left: { nko: "߁", latin: "kelen", audio: "nko/n1" }, right: { fr: "Un" } },
                { left: { nko: "߂", latin: "fila", audio: "nko/n2" }, right: { fr: "Deux" } },
                { left: { nko: "߃", latin: "saba", audio: "nko/n3" }, right: { fr: "Trois" } },
              ],
            },
            {
              id: "e4",
              type: "character_trace",
              glyph: "߁",
              latin: "kelen",
              meaning: "Chiffre 1 — kelen (un)",
              coverageTarget: 0.6,
            },
            {
              id: "e5",
              type: "listen_and_type",
              audio: "nko/n3",
              accept: ["saba", "3", "trois"],
              displayHint: { fr: "Chiffre attendu : « trois »" },
            },
            {
              id: "e6",
              type: "multiple_choice",
              question: { fr: "Que signifie le chiffre ߀ ?" },
              display: "nko+latin",
              options: [
                { text: { fr: "Zéro" }, correct: true },
                { text: { fr: "Un" }, correct: false },
                { text: { fr: "Deux" }, correct: false },
                { text: { fr: "Trois" }, correct: false },
              ],
            },
          ],
        },
        {
          id: "less_n1_2",
          title: "Chiffres 4 à 5 & reconnaissance 6-9",
          rewardXp: 50,
          exercises: [
            {
              id: "e1",
              type: "character_match",
              prompt: { fr: "Glyphe pour le chiffre 5 (duru) ?" },
              options: [
                { glyph: "߅", correct: true },
                { glyph: "߄", correct: false },
                { glyph: "߁", correct: false },
                { glyph: "߂", correct: false },
              ],
            },
            {
              id: "e2",
              type: "multiple_choice",
              question: { fr: "Comment s'écrit « quatre » (naani) en N'Ko ?" },
              display: "nko+latin",
              options: [
                { text: { nko: "߄", latin: "naani", audio: "nko/n4" }, correct: true },
                { text: { nko: "߅", latin: "duru", audio: "nko/n5" }, correct: false },
                { text: { nko: "߃", latin: "saba", audio: "nko/n3" }, correct: false },
                { text: { nko: "߀", latin: "baara", audio: "nko/n0" }, correct: false },
              ],
            },
            {
              id: "e3",
              type: "matching",
              prompt: { fr: "Associe chaque chiffre à son sens." },
              pairs: [
                { left: { nko: "߄", latin: "naani", audio: "nko/n4" }, right: { fr: "Quatre" } },
                { left: { nko: "߅", latin: "duru", audio: "nko/n5" }, right: { fr: "Cinq" } },
                { left: { nko: "߂", latin: "fila", audio: "nko/n2" }, right: { fr: "Deux" } },
                { left: { nko: "߁", latin: "kelen", audio: "nko/n1" }, right: { fr: "Un" } },
              ],
            },
            {
              id: "e4",
              type: "character_trace",
              glyph: "߅",
              latin: "duru",
              meaning: "Chiffre 5 — duru (cinq)",
              coverageTarget: 0.6,
            },
            {
              id: "e5",
              type: "character_match",
              prompt: { fr: "Quel glyphe représente le chiffre 7 ?" },
              options: [
                { glyph: "߇", correct: true },
                { glyph: "߆", correct: false },
                { glyph: "߈", correct: false },
                { glyph: "߉", correct: false },
              ],
            },
            {
              id: "e6",
              type: "listen_and_type",
              audio: "nko/n5",
              accept: ["duru", "5", "cinq"],
              displayHint: { fr: "Chiffre attendu : « cinq »" },
            },
          ],
        },
        {
          id: "less_n1_3",
          title: "Révision 0 à 9",
          rewardXp: 50,
          exercises: [
            {
              id: "e1",
              type: "matching",
              prompt: { fr: "Associe chaque chiffre à son sens." },
              pairs: [
                { left: { nko: "߀", latin: "baara", audio: "nko/n0" }, right: { fr: "Zéro" } },
                { left: { nko: "߅", latin: "duru", audio: "nko/n5" }, right: { fr: "Cinq" } },
                { left: { nko: "߃", latin: "saba", audio: "nko/n3" }, right: { fr: "Trois" } },
                { left: { nko: "߄", latin: "naani", audio: "nko/n4" }, right: { fr: "Quatre" } },
              ],
            },
            {
              id: "e2",
              type: "multiple_choice",
              question: { fr: "Que signifie le chiffre ߆ ?" },
              display: "nko+latin",
              options: [
                { text: { fr: "Six" }, correct: true },
                { text: { fr: "Sept" }, correct: false },
                { text: { fr: "Huit" }, correct: false },
                { text: { fr: "Neuf" }, correct: false },
              ],
            },
            {
              id: "e3",
              type: "character_match",
              prompt: { fr: "Glyphe pour le chiffre 2 (fila) ?" },
              options: [
                { glyph: "߂", correct: true },
                { glyph: "߁", correct: false },
                { glyph: "߃", correct: false },
                { glyph: "߄", correct: false },
              ],
            },
            {
              id: "e4",
              type: "listen_and_type",
              audio: "nko/n1",
              accept: ["kelen", "1", "un"],
              displayHint: { fr: "Chiffre attendu : « un »" },
            },
            {
              id: "e5",
              type: "multiple_choice",
              question: { fr: "Comment s'écrit « zéro » (baara) en N'Ko ?" },
              display: "nko+latin",
              options: [
                { text: { nko: "߀", latin: "baara", audio: "nko/n0" }, correct: true },
                { text: { nko: "߁", latin: "kelen", audio: "nko/n1" }, correct: false },
                { text: { nko: "߅", latin: "duru", audio: "nko/n5" }, correct: false },
                { text: { nko: "߃", latin: "saba", audio: "nko/n3" }, correct: false },
              ],
            },
            {
              id: "e6",
              type: "character_trace",
              glyph: "߃",
              latin: "saba",
              meaning: "Chiffre 3 — saba (trois)",
              coverageTarget: 0.6,
            },
          ],
        },
      ],
    },
  ],
};