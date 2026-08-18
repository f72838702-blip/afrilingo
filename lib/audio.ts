// AfriLingo — audio : synthèse FR (speechSynthesis) + ton N'Ko (Web Audio) + fallback fichier.
// data/audio-manifest.ts = source de vérité. Si `url` défini → fichier réel (cache-first SW).
// iOS : speechSynthesis doit être déclenché par user gesture (les boutons le sont). Ne jamais auto-play.

import { getAudio } from "@/data/audio-manifest";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (audioCtx) return audioCtx;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  audioCtx = new Ctor();
  return audioCtx;
}

/** Court ton « mot N'Ko » (signal sonore, aucun TTS N'Ko public n'existe). */
function playNkoTone(): void {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

function speak(text: string, lang: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

/** Joue un audioId (bouton — déclenché par user gesture, OK iOS). */
export function playAudio(audioId: string): void {
  const entry = getAudio(audioId);
  if (entry.url) {
    // Fichier réel : priorité (cache-first via le service worker côté fetch).
    const a = new Audio(entry.url);
    void a.play().catch(() => {
      /* lecture bloquée : on retombe sur la synthèse */
      fallbackSynth(entry);
    });
    return;
  }
  fallbackSynth(entry);
}

function fallbackSynth(entry: ReturnType<typeof getAudio>): void {
  if (entry.lang === "nko") {
    playNkoTone();
    if (entry.latin) {
      // Petit délai pour laisser le ton, puis lecture de la translittération.
      window.setTimeout(() => speak(entry.latin!, "fr-FR"), 220);
    }
  } else {
    if (entry.fr) speak(entry.fr, "fr-FR");
    else if (entry.latin) speak(entry.latin, "fr-FR");
  }
}

/** Précharge un fichier audio réel (no-op si synthèse). Appelé au mount d'une leçon. */
export function preloadAudio(audioId: string): void {
  if (typeof window === "undefined") return;
  const entry = getAudio(audioId);
  if (!entry.url) return;
  fetch(entry.url, { cache: "force-cache" }).catch(() => {
    /* ignore : offline-graceful */
  });
}

/** Réveille l'AudioContext (à appeler sur la 1ère interaction utilisateur). */
export function warmAudioContext(): void {
  getCtx();
}