// AfriLingo — audio.
//  • N'Ko : lecture via fichiers HTML5 (new Audio('/audio/nko/…')) — le composant
//    <AudioPlayer> s'en charge. AUCUNE synthèse vocale pour le N'Ko (consigne du
//    projet) : si le fichier manque, feedback visuel (onde) sans erreur console.
//  • FR (consignes) : speechSynthesis fr-FR autorisé (best-effort, offline).
//  • SFX leçon : petit son Web Audio pour succès/échec (UI, pas de la parole).
// data/audio-manifest.ts = source de vérité ; `url` défini → fichier réel.
// iOS : speechSynthesis/AudioContext doivent être déclenchés par un user gesture
// (les boutons le sont) — ne jamais auto-play.

import { getAudioEntry } from "@/data/audio-manifest";

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

/** Réveille l'AudioContext (à appeler sur la 1ère interaction utilisateur). */
export function warmAudioContext(): void {
  getCtx();
}

/** Lit un texte FR via speechSynthesis (consignes). Best-effort, jamais de throw. */
export function speakFr(text: string, slow = false): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    u.rate = slow ? 0.7 : 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    /* silencieux */
  }
}

/** Joue un audioId FR (synthèse) — utilisé en fallback FR hors du AudioPlayer. */
export function playAudio(audioId: string, slow = false): void {
  const entry = getAudioEntry(audioId);
  if (!entry) return;
  if (entry.lang === "fr") {
    speakFr(entry.fr ?? entry.latin ?? "", slow);
  }
  // N'Ko : géré par <AudioPlayer> (HTML5). Pas de synthèse ici.
}

/**
 * SFX de feedback leçon (Web Audio) : succès (deux notes ascendantes) ou échec
 * (note grave brève). Aucun fichier, aucun TTS — juste un signal UI.
 */
export function playSfx(kind: "correct" | "wrong"): void {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();
  const now = ctx.currentTime;
  const notes = kind === "correct" ? [523.25, 783.99] : [196.0];
  const dur = kind === "correct" ? 0.12 : 0.22;
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = kind === "correct" ? "sine" : "square";
    const start = now + i * dur;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.2, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur);
  });
}

/** Précharge un fichier audio réel (no-op si synthèse). Appelé au mount d'une leçon. */
export function preloadAudio(audioId: string): void {
  if (typeof window === "undefined") return;
  const entry = getAudioEntry(audioId);
  if (!entry?.url) return;
  fetch(entry.url, { cache: "force-cache" }).catch(() => {
    /* ignore : offline-graceful */
  });
}