// AfriLingo — audio.
//  • N'Ko : priorité au fichier réel HTML5 (new Audio('/audio/nko/…')) via
//    <AudioPlayer>. En ATTENTE des vrais enregistrements, fallback audible
//    gratuit et offline : speechSynthesis lit la translittération Latin du mot
//    (voix fr-FR — approximation honnête, la translittération Manding se lit avec
//    des valeurs proches du français). Aucun TTS N'Ko/Bambara public n'existe
//    côté client sans backend/CORS, et cela casserait l'offline-first PWA ;
//    on fait donc avec ce qu'on a. Quand `url` est défini, le fichier réel
//    prend la priorité (upgrade path inchangé).
//  • FR (consignes) : speechSynthesis fr-FR (best-effort, offline).
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

/**
 * Lit un audioId hors du <AudioPlayer> (ex: consigne FR ponctuelle).
 *  • FR → speechSynthesis fr-FR.
 *  • N'Ko sans fichier → speechSynthesis lit la translittération Latin (fallback
 *    audible best-effort en attendant les vrais enregistrements).
 *  • N'Ko avec fichier → laissé au <AudioPlayer> (HTML5). Pas de lecture ici.
 */
export function playAudio(audioId: string, slow = false): void {
  const entry = getAudioEntry(audioId);
  if (!entry) return;
  if (entry.lang === "fr") {
    speakFr(entry.fr ?? entry.latin ?? "", slow);
    return;
  }
  // N'Ko : fallback synthèse de la translittération seulement si pas de fichier.
  if (!entry.url && entry.latin) {
    speakFr(entry.latin, slow);
  }
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