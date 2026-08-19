// AfriLingo — hook SSR-safe pour la clé du jour courant ("YYYY-MM-DD").
// Renvoie null au 1er render (serveur ET client) → pas de mismatch d'hydration,
// puis la clé réelle après le mount. Utilisé par l'objectif quotidien et le
// calendrier de série pour ne pas dépendre de `new Date()` pendant le SSR.

"use client";

import { useEffect, useState } from "react";
import { todayKey } from "./streak";

export function useTodayKey(): string | null {
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    setKey(todayKey());
  }, []);
  return key;
}