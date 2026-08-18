// AfriLingo — prompt d'installation PWA (beforeinstallprompt) + bannière dismissable.
"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { useProgress, dismissInstall } from "@/lib/progress-store";
import { Button } from "./ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const progress = useProgress();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );

  useEffect(() => {
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  if (!deferred || progress.installDismissed) return null;

  const onInstall = async () => {
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-2xl border border-line bg-surface-2/95 p-4 shadow-xl backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-terre/20 text-gold">
          <Download className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-cream">Installer AfriLingo</p>
          <p className="text-xs text-muted">
            Accès hors-ligne et icône sur ton écran d'accueil.
          </p>
        </div>
        <button
          onClick={() => dismissInstall()}
          aria-label="Fermer"
          className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-3"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <Button size="sm" fullWidth className="mt-3" onClick={onInstall}>
        Installer
      </Button>
    </div>
  );
}