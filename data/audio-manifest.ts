// AfriLingo — manifest audio (source de vérité).
// Si `url` est défini → l'app utilise le fichier réel (cache-first via le service worker).
// Sinon → fallback synthèse : FR via speechSynthesis (fr-FR), N'Ko via ton Web Audio + lecture
// de la translittération Latin (aucun TTS N'Ko public n'existe). Cf. lib/audio.ts.

export interface AudioEntry {
  /** Langue : "fr" (synthèse FR) ou "nko" (ton + translittération). */
  lang: "fr" | "nko";
  /** URL du fichier réel si disponible (ex. "/audio/nko/g1.webm"). */
  url?: string;
  /** Translittération Latin lue pour le fallback N'Ko (et FR si pas de voix). */
  latin?: string;
  /** Texte FR lu (pour les prompts/consignes). */
  fr?: string;
}

export const AUDIO_MANIFEST: Record<string, AudioEntry> = {
  // Salutations
  "nko/g1": { lang: "nko", latin: "i ni cɛ" },
  "nko/g2": { lang: "nko", latin: "i ni tile" },
  "nko/g3": { lang: "nko", latin: "i ni su" },
  "nko/g4": { lang: "nko", latin: "ɔ ni cɛ" },
  "nko/g5": { lang: "nko", latin: "i ka kɛnɛ wa" },
  "nko/g6": { lang: "nko", latin: "kɛnɛ" },
  "nko/g7": { lang: "nko", latin: "k'an bɛn" },
  "nko/g8": { lang: "nko", latin: "jɛ" },
  "nko/g9": { lang: "nko", latin: "kelenya" },
  "nko/g10": { lang: "nko", latin: "ɲɛ" },
  // Chiffres
  "nko/n0": { lang: "nko", latin: "baara" },
  "nko/n1": { lang: "nko", latin: "kelen" },
  "nko/n2": { lang: "nko", latin: "fila" },
  "nko/n3": { lang: "nko", latin: "saba" },
  "nko/n4": { lang: "nko", latin: "naani" },
  "nko/n5": { lang: "nko", latin: "duru" },
  // Prompts FR (consignes)
  "fr/how_are_you": { lang: "fr", fr: "Comment dit-on « comment vas-tu ? » en N'Ko ?" },
  "fr/listen_type": { lang: "fr", fr: "Écoute et tape ce que tu entends" },
};

/** Récupère une entrée (lève si absente — le data doit rester cohérent). */
export function getAudio(id: string): AudioEntry {
  const e = AUDIO_MANIFEST[id];
  if (!e) throw new Error(`Audio manquant dans le manifest : ${id}`);
  return e;
}