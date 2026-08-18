# Audio N'Ko — guide d'ajout

Pour le MVP, **aucun fichier audio n'est commité**. Le son est synthétisé à l'exécution :

- **Français** : `speechSynthesis` (voix OS, `fr-FR`) — fiable et hors-ligne.
- **N'Ko** : un court ton Web Audio (signal « mot N'Ko ») + lecture de la **translittération Latin** via `speechSynthesis` (`fr-FR`). Aucun TTS N'Ko n'existe publiquement. L'UI le mentionne honnêtement (« prononciation : translittération »).

## Ajouter un vrai enregistrement

1. Dépose un fichier audio dans ce dossier, par exemple `g1.webm` (ou `.mp3`). Format recommandé : **WebM/Opus 16 kbps** (léger, offline-friendly), sinon MP3 64 kbps.
2. Dans `data/audio-manifest.ts`, ajoute `url: "/audio/nko/g1.webm"` à l'entrée `g1`.

C'est tout — l'app utilisera automatiquement le vrai fichier (cache-first via le service worker) au lieu de la synthèse, **sans changement de code**.

## Convention de nommage

Les `audioId` correspondent aux entrées de `data/audio-manifest.ts` (`g1`, `g2`, … pour greetings ; `n0`–`n9` pour les chiffres ; `f1`… pour la famille). Le fichier doit porter le même nom : `{audioId}.webm`.

## Enregistrement

- Voix native, micro correct, pièce calme.
- Normalise à -16 LUFS, coupe les silences début/fin (~150 ms).
- Un locuteur mandingophone natif par variante (Bambara/Maninka).