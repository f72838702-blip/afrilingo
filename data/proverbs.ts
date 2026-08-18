// AfriLingo — proverbes mandingues (sagesse culturelle).
// Inspirés de la recherche lexicale (analogies : grain=pivot, rencontre=loi fondamentale).
// N'Ko renseigné uniquement sur les mots épellerables (kelenya, jɛ, ɲɛ).
// Affichés en QCM culturel + révélation « proverbe du jour » sur l'écran de fin.

export interface Proverb {
  id: string;
  /** Énoncé manding (translittération Latin). */
  latin: string;
  /** Énoncé N'Ko (partiel si certains mots non couverts). */
  nko?: string;
  /** Sens en français. */
  fr: string;
  /** Morale / note culturelle. */
  note: string;
}

export const PROVERBS: Proverb[] = [
  {
    id: "p1",
    latin: "kelenya bɛ duguɲa",
    nko: "ߞߍߟߍߣߦߊ",
    fr: "L'unité fait la force",
    note: "kelenya = unité. Un village uni ne se brise pas : valeur fondatrice de la société mandingue.",
  },
  {
    id: "p2",
    latin: "jɛ kɔnɔ, nɛ tɛ",
    nko: "ߖߋ",
    fr: "Là où règne la paix, il n'y a pas de querelle",
    note: "jɛ = paix / lumière. La paix (jɛ) est le socle de toute rencontre humaine.",
  },
  {
    id: "p3",
    latin: "ɲɛ bɛ a la, a bɛ yen",
    nko: "ߢߋ",
    fr: "L'œil est sur la chose, et la chose est là",
    note: "ɲɛ = œil / visage. Ce qu'on regarde attentivement finit par se révéler.",
  },
  {
    id: "p4",
    latin: "k'a bɛn, a bɛn",
    fr: "Que cela se rencontre, et cela se rencontrera",
    note: "Rencontre = loi fondamentale. Le destin se tisse dans les rencontres (méditation mandingue).",
  },
];

export const PROVERB_BY_ID: Record<string, Proverb> = Object.fromEntries(
  PROVERBS.map((p) => [p.id, p])
);

/** Proverbe du jour (déterministe, sans Date.now : index basé sur le jour calendaire lu au call). */
export function proverbOfDay(dayIndex: number): Proverb {
  return PROVERBS[dayIndex % PROVERBS.length];
}