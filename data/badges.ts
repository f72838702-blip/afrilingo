// AfriLingo — badges (gamification).
// 5 badges MVP. icône = nom lucide-react (typé loosement côté composant).

import type { Badge } from "@/types";

export const BADGES: Badge[] = [
  {
    id: "first_word",
    name: "Premier mot",
    description: "Réponds correctement à ton premier exercice.",
    icon: "Sparkles",
  },
  {
    id: "scribe_nko",
    name: "Scribe N'Ko",
    description: "Trace un glyphe N'Ko avec succès.",
    icon: "PenTool",
  },
  {
    id: "module_1_done",
    name: "Première leçon",
    description: "Termine ta première leçon (n'importe quel cours).",
    icon: "BookOpen",
  },
  {
    id: "griot_mande",
    name: "Griot Mandé",
    description: "Complète un module entier (n'importe quel cours).",
    icon: "Crown",
  },
  {
    id: "streak_7",
    name: "Flamme mandingue",
    description: "Atteins une série de 7 jours consécutifs.",
    icon: "Flame",
  },
];

export const BADGES_BY_ID: Record<string, Badge> = Object.fromEntries(
  BADGES.map((b) => [b.id, b])
);