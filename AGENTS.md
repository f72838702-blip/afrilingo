<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AfriLingo — conventions projet

## Stack
Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 (CSS-first, **pas de `tailwind.config.js`** ; tokens dans `app/globals.css` via `@theme`) + framer-motion + lucide-react. Alias `@/*` → racine. npm. Pas de `src/`.

## Architecture
**Local-first, AUCUN backend.** Pas de Supabase/DB/auth. Les données de cours sont en TS dans `data/` (chargées via `lib/course-loader.ts` en style repository — interface conçue pour brancher Supabase plus tard sans refactor, mais non implémenté). La progression est gérée par **Zustand** (`store/useUserStore.ts`, persist localStorage, clé `afrilingo:progress:v2`) ; `lib/progress-store.ts` est un **adaptateur fin** qui ré-exporte l'API publique (useProgress, completeLesson, loseHeart, resetProgress, etc.) pour que les composants n'aient pas à changer. Réhydration explicite dans `ProgressProvider` (`skipHydration: true` → SSR-safe) + sync cross-tab via l'événement `storage`.

## Cours (multi-cours illimité)
- **Registre** : `data/courses/index.ts` = `COURSES_REGISTRY: Course[]`. **Pour ajouter un cours : crée `data/courses/<id>.ts` (exporte un `Course`) + ajoute-le au tableau. AUCUNE autre modification** — le catalogue home, le skill-tree, les leçons et la progression le prennent en charge automatiquement.
- `lib/course-loader.ts` : `allCourses()`, `getCourse(id)`, `getLessonChain(id)`, `getNextLesson(id, lessonId)`, `findCourseByLessonId(lessonId)` (reverse-lookup, car le routage est `/lesson/[id]` sans cours dans l'URL). `FLAGSHIP_COURSE_ID` = 1er cours du registre (défaut, peu utilisé).
- **Contraintes** : `course_id` unique ; ids de leçons **globalement uniques** (tous cours confondus, car `completedLessons` est un flat `string[]` et `/lesson/[id]` résout le cours par id de leçon).
- **Routes** : `/` = catalogue de cours (cartes avec progression) ; `/course/[courseId]` = skill tree du cours ; `/lesson/[id]` = leçon (résout le cours via `findCourseByLessonId`) ; `/lesson/[id]/complete` = fin.
- **Progression multi-cours** : `completedLessons` (flat, ids uniques) marche pour N cours. L'index de leçon courante est **dérivé par cours** dans `skill-tree` (première leçon non complétée de la chaîne du cours) — plus de `currentLessonIndex` stocké. `evaluateBadges` parcourt **tous** les cours (griot_mande = un module 100% dans n'importe quel cours).

## N'Ko & RTL
- Le N'Ko (Unicode U+07C0–U+07FF) s'écrit **RTL**. Le chrome de l'app reste LTR français ; seuls les blocs de contenu N'Ko passent en `dir="rtl"` via le composant `<Nko>` (`components/direction-text.tsx`).
- Police auto-hébergée : `@font-face` dans `globals.css` pointant vers `public/fonts/NotoSansNKo-Regular.ttf` (OFL). **NE PAS** utiliser `next/font/google` pour le N'Ko (subset latin, build-time fetch casse). `unicode-range: U+07C0-07FF` → le Latin reste sur Inter.
- Unicode N'Ko : **chiffres en début de bloc** (U+07C0–U+07C9), diacritiques tonaux U+07EB–U+07F3. La comparaison tolérante aux tons strippe U+07EB–U+07F3 (`lib/exercise-engine.ts`).

## Audio
Aucun fichier audio binaire commité (les vrais enregistrements N'Ko seront ajoutés plus tard). **N'Ko : priorité au fichier réel HTML5 `new Audio('/audio/nko/…')` via `<AudioPlayer>`. En attente des fichiers, fallback audible gratuit et offline : `speechSynthesis` lit la translittération Latin du mot (voix fr-FR — approximation honnête, la translittération Manding se lit avec des valeurs proches du français ; aucun TTS N'Ko/Bambara public n'existe côté client sans backend/CORS, ce qui casserait l'offline-first PWA).** Si le fichier échoue (404/offline), on retombe aussi sur ce fallback. On n'arme `new Audio` que si `url` est déclaré → pas de 404 network inutile. Bouton « Vitesse lente (0,75x) » (playbackRate fichier ou rate speechSynthesis). FR (consignes) : `speechSynthesis` fr-FR. SFX leçon (succès/échec) : ton Web Audio court dans `lib/audio.ts` `playSfx()`. `data/audio-manifest.ts` = source de vérité ; setter `url` → l'app utilise le fichier réel (`public/audio/nko/`). **iOS** : `speechSynthesis`/`AudioContext` doivent être déclenchés par un user gesture (les boutons le sont) — ne jamais auto-play.

## PWA
Service worker **hand-written** `public/sw.js` (pas de `next-pwa` — incompatible Next 16/Turbopack). Enregistré par `components/service-worker-register.tsx`, **gated** `NODE_ENV==="production" || ?sw=1` (dev reste SW-free pour éviter le cache stale). Pour tester l'offline en dev : ajouter `?sw=1` à l'URL. Cache-first pour `/audio/*`, SWR pour l'app shell.

## Gamification
- Cœurs : 3 max, -1 par erreur, regen **5h/cœur**. `regenHearts()` au mount du `ProgressProvider` + intervalle 30s + `visibilitychange`. **Préserve la progression partielle** vers le prochain cœur (`lastHeartRegenAt += gained * HEART_REGEN_MS`, pas de reset à `now`).
- Streak : étendu **dans `completeLesson`** (style Duolingo : on étend le streak en finissant une leçon, pas en ouvrant l'app). today=no-op, yesterday=+1, sinon=1. `touchStreak()` a été retiré (code mort).
- **`activeDates: string[]`** (clés "YYYY-MM-DD") : jours où ≥1 leçon a été complétée (historique cumulé). Poussé (dédup) dans `completeLesson`. Sert au calendrier de série (profil, plusieurs jours surlignés) et à l'objectif quotidien (accueil, ≥1 leçon aujourd'hui via `useTodayKey` SSR-safe).
- **Replay** : rejouer une leçon déjà terminée n'octroie **ni XP par bonne réponse ni XP de complétion** (anti-farming) — mais étend toujours le streak et marque le jour actif.
- `currentLessonIndex` (= `completedLessons.length`) pilote le surlignage « current » (rebond) du skill-tree sur la prochaine leçon à faire.

## Scripts
`npm run dev` (Turbopack), `npm run build`, `npm run start` (prod, SW actif), `npm run typecheck` (`tsc --noEmit` — catcher le narrowing des unions discriminées), `npm run lint`.

## Scope du MVP (ce qui est IN)
1 cours `fr-nko`, 1 module « Salutations & Courtoisie » (3 leçons, ~18 exercices), 6 types d'exercices (`multiple_choice`, `matching`, `sentence_assembly`, `character_trace`, `character_match`, `listen_and_type`), gamification (XP/cœurs/streak/5 badges/league mock), RTL N'Ko + police self-hostée, audio synthétisé + upgrade path, PWA installable + offline, palette africaine dark-first mobile-first, proverbes culturels.

## Explicitement OUT
Pas de backend/Supabase/DB/auth ; pas de reconnaissance vocale réelle (listen_and_type = comparaison texte, exos parlés skip) ; pas d'enregistrements audio réels (drop-in plus tard) ; pas de leagues backend/multiplayer (mock) ; pas de community studio/authoring UI ; pas de full i18n/next-intl (chrome FR, RTL par bloc) ; pas de reconnaissance handwriting stroke-order (trace = coverage du glyphe) ; pas de lib DnD (tap-to-add/remove) ; pas d'autres langues (Fulfulde/Hausa/Wolof/Yoruba archivés via le type `Course`) ; pas de SRS ; pas de gem shop/ads/premium ; pas de tests automatisés (vérif E2E manuelle).

## Régénération des icônes
`node scripts/gen-icons.mjs` régénère `public/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (PNG pur, zéro dép). L'icône d'onglet/apple est générée par code (`app/icon.tsx`, `app/apple-icon.tsx` via `next/og`).