// AfriLingo — bouton lecteur audio réutilisable.
//  • N'Ko : HTML5 `new Audio('/audio/nko/…')` (le `url` du manifest). AUCUNE
//    synthèse vocale pour le N'Ko (consigne projet). Si le fichier manque ou
//    échoue, on joue une animation d'onde visuelle temporaire — sans bloquer
//    l'UI ni générer d'erreur console (on n'arme pas `new Audio` tant qu'aucun
//    fichier n'est déclaré, pour éviter les 404 network).
//  • FR (consignes) : speechSynthesis fr-FR autorisé (fallback) — pas concerné
//    par l'interdiction qui vise le N'Ko.
//  • Bouton « Vitesse lente (0.75x) » : ralentit la lecture (playbackRate ou rate).
// Déclenché par user gesture (OK iOS).

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, AlertCircle, Gauge } from "lucide-react";
import { getAudioEntry } from "@/data/audio-manifest";
import { speakFr, warmAudioContext } from "@/lib/audio";
import { cn } from "@/lib/format";

type PlayState = "idle" | "loading" | "playing" | "error";

const DIMS: Record<"sm" | "md" | "lg", { box: string; icon: string }> = {
  sm: { box: "h-9 w-9", icon: "h-4 w-4" },
  md: { box: "h-12 w-12", icon: "h-5 w-5" },
  lg: { box: "h-14 w-14", icon: "h-7 w-7" },
};

// Durée du feedback visuel (onde) quand on n'a pas de fichier (N'Ko) ou si la
// lecture fichier est bloquée — borne l'animation pour ne jamais bloquer l'UI.
const VISUAL_FEEDBACK_MS = 1100;

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
  const [slow, setSlow] = useState(false);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const visualTimer = useRef<number | null>(null);

  const entry = getAudioEntry(audioId);
  const hasFile = !!entry?.url;
  const isFr = entry?.lang === "fr";

  // Nettoyage au démontage.
  useEffect(() => {
    return () => {
      if (visualTimer.current) window.clearTimeout(visualTimer.current);
      const a = audioElRef.current;
      if (a) {
        a.onended = null;
        a.onerror = null;
        a.onplay = null;
        a.pause();
      }
    };
  }, []);

  const runVisualFeedback = useCallback(() => {
    setState("playing");
    if (visualTimer.current) window.clearTimeout(visualTimer.current);
    visualTimer.current = window.setTimeout(
      () => setState("idle"),
      VISUAL_FEEDBACK_MS
    );
  }, []);

  const onPlay = useCallback(() => {
    warmAudioContext();

    // audioId inconnu du manifest → feedback visuel gracieux (pas de throw).
    if (!entry) {
      runVisualFeedback();
      return;
    }

    // FR (consigne) : speechSynthesis autorisée.
    if (isFr && !hasFile) {
      speakFr(entry.fr ?? entry.latin ?? "", slow);
      runVisualFeedback();
      return;
    }

    // N'Ko sans fichier : PAS de synthèse (consigne). Feedback visuel seulement.
    // On n'arme pas `new Audio` → aucun 404 network, aucune erreur console.
    if (!hasFile) {
      runVisualFeedback();
      return;
    }

    // Fichier réel (N'Ko ou FR) : balise HTML5 <audio> dédiée, pilotée par events.
    // On réutilise le même élément pour éviter les fuites.
    let a = audioElRef.current;
    if (!a) {
      a = new Audio();
      a.preload = "auto";
      audioElRef.current = a;
    }
    a.src = entry.url!;
    a.playbackRate = slow ? 0.75 : 1;
    a.onplay = () => setState("playing");
    a.onended = () => setState("idle");
    a.onpause = () => setState("idle");
    a.onerror = () => {
      // Fichier injoignable (404/offline) → feedback visuel, pas d'erreur console
      // (on ne relance pas la synthèse N'Ko : interdit par la consigne).
      runVisualFeedback();
    };

    setState("loading");
    const p = a.play();
    if (p && typeof p.then === "function") {
      p.then(() => setState("playing")).catch(() => runVisualFeedback());
    }
  }, [entry, hasFile, isFr, slow, runVisualFeedback]);

  const dims = DIMS[size];
  const showWave = state === "playing";

  return (
    <span className={cn("relative inline-flex items-center gap-1", className)}>
      <button
        onClick={onPlay}
        aria-label={label}
        type="button"
        className={cn(
          "grid place-items-center rounded-full transition active:scale-95",
          state === "error"
            ? "bg-bad/20 text-bad"
            : showWave
              ? "bg-jade/20 text-jade"
              : "bg-surface-2 text-gold hover:bg-surface-3",
          dims.box
        )}
      >
        {state === "error" ? (
          <AlertCircle className={dims.icon} />
        ) : showWave ? (
          <WaveIcon className={dims.icon} />
        ) : (
          <Volume2 className={dims.icon} />
        )}
      </button>

      {/* Bouton vitesse lente 0.75x */}
      <button
        onClick={() => setSlow((s) => !s)}
        type="button"
        aria-pressed={slow}
        aria-label="Vitesse lente 0,75x"
        title="Vitesse lente (0,75x)"
        className={cn(
          "grid place-items-center rounded-full transition active:scale-95",
          size === "sm" ? "h-6 w-6" : "h-8 w-8",
          slow
            ? "bg-ocre/25 text-ocre"
            : "bg-surface-2 text-muted hover:bg-surface-3"
        )}
      >
        <Gauge className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>

      {/* Animation d'onde visuelle (lecteur en cours / fallback sans fichier). */}
      {showWave && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 rounded-full ring-2 ring-jade/30 motion-safe:animate-ping"
        />
      )}
    </span>
  );
}

/** Petite animation d'onde (barres égualiseur) pour le feedback visuel. */
function WaveIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-end justify-center gap-[2px]", className)}
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[2px] origin-bottom rounded-full bg-current motion-safe:animate-[nko-wave_0.7s_ease-in-out_infinite]"
          style={{ height: "100%", animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  );
}