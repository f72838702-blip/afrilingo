// AfriLingo — store global de progression (Zustand + persist localStorage).
// Source de vérité unique pour l'état de l'apprenant. `lib/progress-store.ts`
// est un adaptateur fin qui ré-exporte la même API que l'ancien store, afin que
// les composants existants n'aient pas à changer.
//
// SSR-safe : `skipHydration: true` → le store démarre sur DEFAULT_PROGRESS côté
// serveur ET au 1er render client (match SSR). La réhydration depuis localStorage
// est déclenchée explicitement par <ProgressProvider> au mount (cf. lib/progress-store.ts
// → rehydrateProgress). Sync cross-tab via l'événement `storage`.

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BadgeId, Progress, TranslitMode } from "@/types";
import {
  HEART_REGEN_MS,
  MAX_HEARTS,
  PROGRESS_STORAGE_KEY,
  PROGRESS_VERSION,
  XP_PER_LESSON,
} from "@/lib/constants";
import { nextStreak } from "@/lib/streak";
import { leagueForXp, DEFAULT_LEAGUE_ID } from "@/data/leagues";
import { newlyEarnedBadges } from "@/lib/badges";

// ---- État par défaut (déterministe, partagé serveur + 1er render client) ----

export const DEFAULT_PROGRESS: Progress = {
  version: PROGRESS_VERSION,
  displayName: "Apprenant N'Ko",
  totalXp: 0,
  hearts: MAX_HEARTS,
  lastHeartRegenAt: 0,
  completedLessons: [],
  lastActiveDate: null,
  streakDays: 0,
  longestStreak: 0,
  badges: [],
  translitMode: "nko+latin",
  leagueId: DEFAULT_LEAGUE_ID,
  installDismissed: false,
  currentLessonIndex: 0,
};

// ---- Helpers purs (régénération de cœurs) ----

/** Régénère les cœurs selon le temps écoulé depuis lastHeartRegenAt. */
export function regenHearts(p: Progress, now: number): Progress {
  if (p.hearts >= MAX_HEARTS) {
    return p.lastHeartRegenAt === now ? p : { ...p, lastHeartRegenAt: now };
  }
  const elapsed = now - (p.lastHeartRegenAt || 0);
  const gained = Math.floor(elapsed / HEART_REGEN_MS);
  if (gained <= 0) return p;
  const hearts = Math.min(MAX_HEARTS, p.hearts + gained);
  const consumed = (gained * HEART_REGEN_MS) % HEART_REGEN_MS;
  const lastHeartRegenAt = now - consumed;
  return { ...p, hearts, lastHeartRegenAt };
}

// ---- Types du store ----

export interface UserState extends Progress {
  // Actions requises par la spec
  completeLesson: (lessonId: string, xpGained: number) => void;
  loseHeart: () => void;
  resetProgress: () => void;
  // Actions conservées (features existantes)
  addXp: (amount: number) => void;
  awardBadge: (id: BadgeId) => void;
  setDisplayName: (name: string) => void;
  setTranslitMode: (mode: TranslitMode) => void;
  dismissInstall: () => void;
  tickHearts: () => void;
  /** Définit l'index de leçon en cours (pour le surlignage sur l'accueil). */
  setCurrentLessonIndex: (index: number) => void;
}

// ---- Store Zustand ----

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PROGRESS,

      completeLesson: (lessonId, xpGained) => {
        const p = get();
        // Rejouer une leçon déjà faite : on étend juste le streak, pas de double XP.
        if (p.completedLessons.includes(lessonId)) {
          const st = nextStreak(p.lastActiveDate, p.streakDays);
          if (st.streakDays === p.streakDays && st.lastActiveDate === p.lastActiveDate) return;
          set({
            streakDays: st.streakDays,
            lastActiveDate: st.lastActiveDate,
            longestStreak: Math.max(p.longestStreak, st.streakDays),
          });
          return;
        }
        const completedLessons = [...p.completedLessons, lessonId];
        const st = nextStreak(p.lastActiveDate, p.streakDays);
        const totalXp = p.totalXp + xpGained;
        const next: Progress = {
          ...p,
          completedLessons,
          streakDays: st.streakDays,
          lastActiveDate: st.lastActiveDate,
          longestStreak: Math.max(p.longestStreak, st.streakDays),
          totalXp,
          leagueId: leagueForXp(totalXp),
          // L'index courant avance à la prochaine leçon non complétée.
          currentLessonIndex: completedLessons.length,
        };
        set(next);
        // Badges dérivés (griot_mande si module fini, streak_7 si ≥7j).
        for (const b of newlyEarnedBadges(next)) get().awardBadge(b);
      },

      loseHeart: () => {
        const p = get();
        if (p.hearts <= 0) return;
        set({ hearts: p.hearts - 1 });
      },

      resetProgress: () => {
        set({ ...DEFAULT_PROGRESS, lastHeartRegenAt: Date.now() });
      },

      addXp: (amount) => {
        const p = get();
        const totalXp = p.totalXp + amount;
        set({ totalXp, leagueId: leagueForXp(totalXp) });
      },

      awardBadge: (id) => {
        const p = get();
        if (p.badges.includes(id)) return;
        set({ badges: [...p.badges, id] });
      },

      setDisplayName: (name) => {
        const p = get();
        const trimmed = name.trim();
        const next = trimmed.length > 0 ? trimmed.slice(0, 40) : DEFAULT_PROGRESS.displayName;
        if (p.displayName === next) return;
        set({ displayName: next });
      },

      setTranslitMode: (mode) => {
        const p = get();
        if (p.translitMode === mode) return;
        set({ translitMode: mode });
      },

      dismissInstall: () => {
        const p = get();
        if (p.installDismissed) return;
        set({ installDismissed: true });
      },

      tickHearts: () => {
        const p = get();
        const regen = regenHearts(p, Date.now());
        if (regen !== p) set(regen);
      },

      setCurrentLessonIndex: (index) => {
        const p = get();
        if (p.currentLessonIndex === index) return;
        set({ currentLessonIndex: index });
      },
    }),
    {
      name: PROGRESS_STORAGE_KEY,
      version: PROGRESS_VERSION,
      skipHydration: true, // SSR-safe : réhydration explicite dans <ProgressProvider>.
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          // SSR : storage noop (pas de localStorage sur le serveur).
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return window.localStorage;
      }),
      // Ne persiste que les données (pas les fonctions d'action).
      partialize: (s) => {
        const {
          completeLesson: _c,
          loseHeart: _l,
          resetProgress: _r,
          addXp: _a,
          awardBadge: _b,
          setDisplayName: _d,
          setTranslitMode: _t,
          dismissInstall: _i,
          tickHearts: _h,
          setCurrentLessonIndex: _s,
          ...data
        } = s;
        return data;
      },
    }
  )
);