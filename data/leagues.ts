// AfriLingo — leagues (mock statique).
// Pas de backend/multiplayer : la league est un classement fictif qui donne un sentiment
// de progression sociale. Le joueur est inséré selon son XP (mis à jour côté store).

import type { League } from "@/types";

export const LEAGUES: League[] = [
  {
    id: "lg_bronze",
    name: "Ligue Bronze",
    tier: "bronze",
    members: [
      { name: "Awa", xp: 480, isYou: false },
      { name: "Moussa", xp: 310, isYou: false },
      { name: "Toi", xp: 0, isYou: true },
      { name: "Fatoumata", xp: 0, isYou: false },
      { name: "Sékou", xp: 0, isYou: false },
    ],
  },
  {
    id: "lg_argent",
    name: "Ligue Argent",
    tier: "argent",
    members: [
      { name: "Mariam", xp: 1240, isYou: false },
      { name: "Ibrahima", xp: 980, isYou: false },
      { name: "Toi", xp: 0, isYou: true },
      { name: "Bintou", xp: 0, isYou: false },
      { name: "Oumar", xp: 0, isYou: false },
    ],
  },
  {
    id: "lg_or",
    name: "Ligue Or",
    tier: "or",
    members: [
      { name: "Djéli", xp: 3200, isYou: false },
      { name: "Nene", xp: 2750, isYou: false },
      { name: "Toi", xp: 0, isYou: true },
      { name: "Saliou", xp: 0, isYou: false },
      { name: "Kadiatou", xp: 0, isYou: false },
    ],
  },
];

export const LEAGUE_BY_ID: Record<string, League> = Object.fromEntries(
  LEAGUES.map((l) => [l.id, l])
);

/** League par défaut du joueur (avant progression). */
export const DEFAULT_LEAGUE_ID = "lg_bronze";

/** Choisit la league selon l'XP totale (seuils MVP). */
export function leagueForXp(totalXp: number): string {
  if (totalXp >= 1000) return "lg_or";
  if (totalXp >= 300) return "lg_argent";
  return "lg_bronze";
}