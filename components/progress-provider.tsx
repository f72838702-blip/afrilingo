// AfriLingo — provider de progression : réhydrate le store Zustand depuis
// localStorage au mount, lance la régénération des cœurs (intervalle 30s +
// visibilitychange) et synchronise l'état entre onglets (storage event).
"use client";

import { useEffect } from "react";
import { tickHearts, rehydrateProgress } from "@/lib/progress-store";
import { PROGRESS_STORAGE_KEY } from "@/lib/constants";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1) Réhydrate le store Zustand depuis localStorage (skipHydration: true).
    rehydrateProgress();
    // 2) 1er tick : régénération des cœurs selon le temps écoulé.
    tickHearts();

    const interval = window.setInterval(() => tickHearts(), 30_000);
    const onVis = () => {
      if (document.visibilityState === "visible") {
        rehydrateProgress();
        tickHearts();
      }
    };
    // Sync cross-tab : une autre fenêtre a écrit → on réhydrate.
    const onStorage = (e: StorageEvent) => {
      if (e.key === PROGRESS_STORAGE_KEY) rehydrateProgress();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return <>{children}</>;
}