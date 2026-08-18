// AfriLingo — provider de progression : charge l'état au mount et lance la
// régénération des cœurs (intervalle 30s + visibilitychange).
"use client";

import { useEffect } from "react";
import { tickHearts } from "@/lib/progress-store";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1er tick au mount (charge + regen via ensureLoaded).
    tickHearts();
    const interval = window.setInterval(() => tickHearts(), 30_000);
    const onVis = () => {
      if (document.visibilityState === "visible") tickHearts();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <>{children}</>;
}