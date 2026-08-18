# AfriLingo ߒߞߏ

**Apprends les langues africaines** — une PWA web mobile type Duolingo pour apprendre le **N'Ko** (ߒߞߏ), l'écriture des langues mandingues.

> Cours phare : **Français ↔ N'Ko** — module « Salutations & Courtoisie » (3 leçons, 18 exercices, 6 types d'exercices).

## Aperçu

- **Micro-leçons interactives** : QCM, association, assemblage de phrase (RTL), tracé de glyphe au doigt, reconnaissance de chiffres N'Ko, écoute & frappe.
- **N'Ko RTL** : police `Noto Sans NKo` auto-hébergée, `dir="rtl"` par bloc, comparaison tolérante aux diacritiques tonaux.
- **Gamification** : cœurs (régénération 5 h), XP, série de jours (streak), 5 badges, ligue.
- **PWA installable + hors-ligne** : service worker hand-written (cache-first pour audio/police, stale-while-revalidate pour l'app shell).
- **Local-first, aucun backend** : progression en `localStorage`, données de cours en TypeScript. Audio synthétisé (FR `speechSynthesis` + ton N'Ko Web Audio + translittération — aucun TTS N'Ko public n'existe ; chemin d'upgrade pour de vrais enregistrements).

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5 · Tailwind v4 (CSS-first, sans `tailwind.config.js`) · framer-motion · lucide-react.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
# ou prod (SW actif, testable hors-ligne)
npm run build && npm run start
```

Pour tester le hors-ligne en dev : ajoute `?sw=1` à l'URL (le SW est désactivé en dev par défaut pour éviter le cache stale).

## Scripts

| Script | Rôle |
|---|---|
| `npm run dev` | Dev (Turbopack) |
| `npm run build` | Build de production |
| `npm run start` | Serveur prod (SW actif) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `next lint` |

## Architecture

```
app/            Routes (home, lesson/[id], lesson/[id]/complete, profile, offline)
components/      UI, exercices (6 types), lesson-runner, progress provider, SW register
lib/            progress-store (localStorage + useSyncExternalStore), exercise-engine,
                course-loader (repository), audio, rtl, streak, badges, constants
data/           courses/fr-nko, vocab, proverbs, audio-manifest, badges, leagues
types/          Discriminated unions d'exercices
public/         sw.js, fonts/NotoSansNKo-Regular.ttf, icons PNG
scripts/        gen-icons.mjs (PNG pur, zéro dépendance)
```

## Ajouter du vrai audio N'Ko

1. Dépose un fichier `.webm` dans `public/audio/nko/` (ex. `g1.webm`).
2. Dans `data/audio-manifest.ts`, ajoute `url: "/audio/nko/g1.webm"` à l'entrée `nko/g1`.

L'app utilisera automatiquement le vrai fichier (cache-first via le SW) à la place de la synthèse — **sans changement de code**.

## À propos du N'Ko

Le N'Ko (ߒߞߏ) a été inventé en 1949 par **Solomana Kanté** pour transcrire les langues mandingues (Bambara, Maninka, Dyula…). Il s'écrit de **droite à gauche**. Les chiffres N'Ko occupent atypiquement le **début** du bloc Unicode (U+07C0–U+07C9), et les diacritiques tonaux se trouvent en U+07EB–U+07F3.

## Licence

Code : MIT. Police `Noto Sans NKo` : SIL Open Font License (cf. `public/fonts/LICENSE-NotoSansNKo.txt`).