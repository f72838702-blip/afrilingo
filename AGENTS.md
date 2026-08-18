<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AfriLingo — conventions projet

## Stack
Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 (CSS-first, **pas de `tailwind.config.js`** ; tokens dans `app/globals.css` via `@theme`) + framer-motion + lucide-react. Alias `@/*` → racine. npm. Pas de `src/`.

## Architecture
**Local-first, AUCUN backend.** Pas de Supabase/DB/auth. Les données de cours sont en TS dans `data/` (chargées via `lib/course-loader.ts` en style repository — interface conçue pour brancher Supabase plus tard sans refactor, mais non implémenté). La progression est en `localStorage` (`lib/progress-store.ts`, clé `afrilingo:progress:v1`).

## N'Ko & RTL
- Le N'Ko (Unicode U+07C0–U+07FF) s'écrit **RTL**. Le chrome de l'app reste LTR français ; seuls les blocs de contenu N'Ko passent en `dir="rtl"` via le composant `<Nko>` (`components/direction-text.tsx`).
- Police auto-hébergée : `@font-face` dans `globals.css` pointant vers `public/fonts/NotoSansNKo-Regular.ttf` (OFL). **NE PAS** utiliser `next/font/google` pour le N'Ko (subset latin, build-time fetch casse). `unicode-range: U+07C0-07FF` → le Latin reste sur Inter.
- Unicode N'Ko : **chiffres en début de bloc** (U+07C0–U+07C9), diacritiques tonaux U+07EB–U+07F3. La comparaison tolérante aux tons strippe U+07EB–U+07F3 (`lib/exercise-engine.ts`).

## Audio
Aucun fichier audio binaire commité. `lib/audio.ts` synthétise : FR via `speechSynthesis` (lang fr-FR), N'Ko via ton Web Audio + lecture de la translittération Latin (aucun TTS N'Ko n'existe). `data/audio-manifest.ts` = source de vérité ; setter `url` → l'app utilise le fichier réel (`public/audio/nko/`). **iOS** : `speechSynthesis` doit être déclenché par un user gesture (les boutons le sont) — ne jamais auto-play.

## PWA
Service worker **hand-written** `public/sw.js` (pas de `next-pwa` — incompatible Next 16/Turbopack). Enregistré par `components/service-worker-register.tsx`, **gated** `NODE_ENV==="production" || ?sw=1` (dev reste SW-free pour éviter le cache stale). Pour tester l'offline en dev : ajouter `?sw=1` à l'URL. Cache-first pour `/audio/*`, SWR pour l'app shell.

## Gamification
- Cœurs : 3 max, -1 par erreur, regen **5h/cœur**. `regenHearts()` au mount du `ProgressProvider` + intervalle 30s + `visibilitychange`.
- Streak : `touchStreak()` appelé **dans `completeLesson`** (style Duolingo : on étend le streak en finissant une leçon, pas en ouvrant l'app). today=no-op, yesterday=+1, sinon=1.

## Scripts
`npm run dev` (Turbopack), `npm run build`, `npm run start` (prod, SW actif), `npm run typecheck` (`tsc --noEmit` — catcher le narrowing des unions discriminées), `npm run lint`.

## Scope du MVP (ce qui est IN)
1 cours `fr-nko`, 1 module « Salutations & Courtoisie » (3 leçons, ~18 exercices), 6 types d'exercices (`multiple_choice`, `matching`, `sentence_assembly`, `character_trace`, `character_match`, `listen_and_type`), gamification (XP/cœurs/streak/5 badges/league mock), RTL N'Ko + police self-hostée, audio synthétisé + upgrade path, PWA installable + offline, palette africaine dark-first mobile-first, proverbes culturels.

## Explicitement OUT
Pas de backend/Supabase/DB/auth ; pas de reconnaissance vocale réelle (listen_and_type = comparaison texte, exos parlés skip) ; pas d'enregistrements audio réels (drop-in plus tard) ; pas de leagues backend/multiplayer (mock) ; pas de community studio/authoring UI ; pas de full i18n/next-intl (chrome FR, RTL par bloc) ; pas de reconnaissance handwriting stroke-order (trace = coverage du glyphe) ; pas de lib DnD (tap-to-add/remove) ; pas d'autres langues (Fulfulde/Hausa/Wolof/Yoruba archivés via le type `Course`) ; pas de SRS ; pas de gem shop/ads/premium ; pas de tests automatisés (vérif E2E manuelle).

## Régénération des icônes
`node scripts/gen-icons.mjs` régénère `public/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (PNG pur, zéro dép). L'icône d'onglet/apple est générée par code (`app/icon.tsx`, `app/apple-icon.tsx` via `next/og`).