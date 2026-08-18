// AfriLingo — bouton lecteur audio réutilisable.
// Utilise la balise HTML5 <audio> quand un fichier réel est dispo dans le manifest
// (data/audio-manifest.ts → url). Sinon, fallback synthèse (lib/audio.ts : ton N'Ko +
// speechSynthesis FR) avec un feedback visuel doux (anneau pulsé). Ne crash jamais :
// audioId inconnu → état "error" géré gracieusement.
//
// États : idle → loading → playing → idle (ou error). Déclenché par user gesture (OK iOS).

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, Loader2, AlertCircle } from "lucide-react";
import { getAudioEntry } from "@/data/audio-manifest";
import { playAudio, warmAudioContext } from "@/lib/audio";
import { cn } from "@/lib/format";

type PlayState = "idle" | "loading" | "playing" | "error";

const DIMS: Record<"sm" | "md" | "lg", { box: string; icon: string }> = {
  sm: { box: "h-9 w-9", icon: "h-4 w-4" },
  md: { box: "h-12 w-12", icon: "h-5 w-5" },
  lg: { box: "h-14 w-14", icon: "h-7 w-7" },
};

// Durée du feedback visuel pour le fallback synthèse (ton + lecture Latin).
const SYNTH_FEEDBACK_MS = 900;

export function AudioPlayer({
  audioId,
  className,
  label = "Écouter",
  size = "md",
}: {
  audioId: string;
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [state, setState] = useState<PlayState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthTimer = useRef<number | null>(null);

  const entry = getAudioEntry(audioId);
  const hasFile = !!entry?.url;

  // Nettoyage au démontage : on stoppe tout.
  useEffect(() => {
    return () => {
      if (synthTimer.current) window.clearTimeout(synthTimer.current);
      const a = audioRef.current;
      if (a) {
        a.pause();
        a.removeAttribute("src");
        a.load();
      }
    };
  }, []);

  const fallbackSynth = useCallback(() => {
    // Pas de fichier réel → synthèse (ton N'Ko + lecture de la translittération).
    // On ne capture pas l'erreur de playAudio : la synthèse est best-effort et
    // ne lève jamais (speechSynthesis absent = no-op silencieux).
    warmAudioContext();
    try {
      playAudio(audioId);
    } catch {
      /* silencieux : la synthèse ne doit jamais planter l'UI */
    }
    setState("playing");
    if (synthTimer.current) window.clearTimeout(synthTimer.current);
    synthTimer.current = window.setTimeout(() => setState("idle"), SYNTH_FEEDBACK_MS);
  }, [audioId]);

  const onPlay = useCallback(() => {
    warmAudioContext();

    // AudioId inconnu du manifest → état d'erreur gracieux (pas de throw).
    if (!entry) {
      setState("error");
      if (synthTimer.current) window.clearTimeout(synthTimer.current);
      synthTimer.current = window.setTimeout(() => setState("idle"), 1800);
      return;
    }

    // Pas de fichier réel → fallback synthèse + feedback visuel.
    if (!hasFile || !entry.url) {
      fallbackSynth();
      return;
    }

    // Fichier réel : on passe par la balise <audio> dédiée (état piloté par ses events).
    const a = audioRef.current;
    if (!a) {
      // <audio> non monté (SSR) — retombe sur la synthèse.
      fallbackSynth();
      return;
    }
    // Relit le même fichier si on re-clique.
    try {
      a.currentTime = 0;
    } catch {
      /* certains navigateurs lèvent si pas prêt — ignoré */
    }
    setState("loading");
    const p = a.play();
    if (p && typeof p.then === "function") {
      p.then(() => setState("playing")).catch(() => {
        // Lecture bloquée (autoplay policy) ou fichier injoignable → synthèse.
        fallbackSynth();
      });
    }
  }, [entry, hasFile, fallbackSynth]);

  const dims = DIMS[size];

  return (
    <span className="relative inline-flex">
      {/* Balise HTML5 <audio> dédiée — uniquement si un fichier réel existe. */}
      {hasFile && entry?.url && (
        <audio
          ref={audioRef}
          src={entry.url}
          preload="none"
          onWaiting={() => setState("loading")}
          onPlaying={() => setState("playing")}
          onEnded={() => setState("idle")}
          onPause={() => setState("idle")}
          onError={() => {
            // Fichier injoignable (404/offline) → retombe sur la synthèse.
            fallbackSynth();
          }}
          className="hidden"
          aria-hidden="true"
        />
      )}

      <button
        onClick={onPlay}
        aria-label={label}
        type="button"
        className={cn(
          "grid place-items-center rounded-full transition active:scale-95",
          state === "error"
            ? "bg-bad/20 text-bad"
            : state === "playing"
              ? "bg-jade/25 text-jade"
              : "bg-surface-2 text-gold hover:bg-surface-3",
          dims.box,
          className
        )}
      >
        {state === "loading" ? (
          <Loader2 className={cn("animate-spin", dims.icon)} />
        ) : state === "error" ? (
          <AlertCircle className={dims.icon} />
        ) : (
          <Volume2
            className={cn(dims.icon, state === "playing" && "animate-pulse")}
          />
        )}
      </button>

      {/* Anneau pulsé en feedback visuel pendant la lecture (synthèse ou fichier). */}
      {state === "playing" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-jade/40 motion-safe:animate-ping"
        />
      )}
    </span>
  );
}