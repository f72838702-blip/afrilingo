// AfriLingo — enregistrement du service worker.
// Gated : prod toujours, dev seulement si ?sw=1 (évite le cache stale en dev).
"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    const isProd = process.env.NODE_ENV === "production";
    const hasFlag = new URLSearchParams(window.location.search).get("sw") === "1";
    if (!isProd && !hasFlag) return;
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* échec silencieux : l'app marche sans SW (online) */
      });
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}