// AfriLingo — vocabulaire N'Ko : Salutations & courtoisie.
// Formes vérifiées (dictionnaire Malidaba Maninka + phrasebook Wikivoyage Bambara).
// Seuls les glyphes N'Ko épelerables depuis la carte lettre→son vérifiée sont renseignés
// (mots à « g » ambigu non couverts par la police de base omis du champ nko).
// Diacritiques tonaux (U+07EB–U+07F3) omis en MVP — la comparaison les strippe de toute façon.

import type { LocalizedText } from "@/types";

export interface VocabEntry extends LocalizedText {
  id: string;
}

export const GREETINGS: VocabEntry[] = [
  {
    id: "g1",
    latin: "i ni cɛ",
    nko: "ߌ ߣߌ ߗߋ",
    fr: "Bonjour / Salut (salutation générale)",
    audio: "nko/g1",
  },
  {
    id: "g2",
    latin: "i ni tile",
    nko: "ߌ ߣߌ ߕߌߟߍ",
    fr: "Bon après-midi (litt. tu et le soleil)",
    audio: "nko/g2",
  },
  {
    id: "g3",
    latin: "i ni su",
    nko: "ߌ ߣߌ ߛߎ",
    fr: "Bonsoir (litt. tu et la nuit)",
    audio: "nko/g3",
  },
  {
    id: "g4",
    latin: "ɔ ni cɛ",
    nko: "ߐ ߣߌ ߗߋ",
    fr: "Et bonjour à toi (réponse à i ni cɛ)",
    audio: "nko/g4",
  },
  {
    id: "g5",
    latin: "i ka kɛnɛ wa?",
    nko: "ߌ ߞߊ ߞߋߣߋ ߥߊ?",
    fr: "Comment vas-tu ? (litt. tu es bien ?)",
    audio: "nko/g5",
  },
  {
    id: "g6",
    latin: "kɛnɛ",
    nko: "ߞߋߣߋ",
    fr: "Ça va / je vais bien (bien, sain)",
    audio: "nko/g6",
  },
  {
    id: "g7",
    latin: "k'an bɛn",
    nko: "ߞߊߣ ߓߋߣ",
    fr: "Au revoir (litt. que nous nous rencontrions)",
    audio: "nko/g7",
  },
  {
    id: "g8",
    latin: "jɛ",
    nko: "ߖߋ",
    fr: "Paix / lumière (souhait de paix)",
    audio: "nko/g8",
  },
  {
    id: "g9",
    latin: "kelenya",
    nko: "ߞߍߟߍߣߦߊ",
    fr: "Unité / à bientôt (litt. fait d'être un)",
    audio: "nko/g9",
  },
  {
    id: "g10",
    latin: "ɲɛ",
    nko: "ߢߋ",
    fr: "Visage / œil (litt. le devant)",
    audio: "nko/g10",
  },
];

/** Table d'accès rapide par id. */
export const GREETINGS_BY_ID: Record<string, VocabEntry> = Object.fromEntries(
  GREETINGS.map((g) => [g.id, g])
);