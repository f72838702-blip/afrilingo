// AfriLingo — vocabulaire N'Ko : Chiffres (U+07C0–U+07C9).
// Les chiffres N'Ko sont atypiquement au DÉBUT du bloc Unicode (U+07C0, pas U+07F0).
// Glyphes 100 % vérifiés depuis la charte officielle Unicode U+07C0.
// Noms mandingues 1–5 confirmés ; 6–9 laissés à la valeur numérique (exos = reconnaissance glyphe).

import type { LocalizedText } from "@/types";

export interface NumberEntry extends LocalizedText {
  id: string;
  value: number;
}

export const NUMBERS: NumberEntry[] = [
  { id: "n0", value: 0, latin: "baara", nko: "߀", fr: "zéro", audio: "nko/n0" },
  { id: "n1", value: 1, latin: "kelen", nko: "߁", fr: "un", audio: "nko/n1" },
  { id: "n2", value: 2, latin: "fila", nko: "߂", fr: "deux", audio: "nko/n2" },
  { id: "n3", value: 3, latin: "saba", nko: "߃", fr: "trois", audio: "nko/n3" },
  { id: "n4", value: 4, latin: "naani", nko: "߄", fr: "quatre", audio: "nko/n4" },
  { id: "n5", value: 5, latin: "duru", nko: "߅", fr: "cinq", audio: "nko/n5" },
  { id: "n6", value: 6, latin: "6", nko: "߆", fr: "six", audio: "nko/n6" },
  { id: "n7", value: 7, latin: "7", nko: "߇", fr: "sept", audio: "nko/n7" },
  { id: "n8", value: 8, latin: "8", nko: "߈", fr: "huit", audio: "nko/n8" },
  { id: "n9", value: 9, latin: "9", nko: "߉", fr: "neuf", audio: "nko/n9" },
];

export const NUMBERS_BY_ID: Record<string, NumberEntry> = Object.fromEntries(
  NUMBERS.map((n) => [n.id, n])
);