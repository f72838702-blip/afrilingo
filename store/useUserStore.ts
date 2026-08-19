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
import { nextStreak, todayKey } from "@/lib/streak";
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
  activeDates: [],
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
  // Préserve la progression PARTIELLE vers le prochain cœur : on avance
  // lastHeartRegenAt du temps réellement consommé (gained * HEART_REGEN_MS),
  // pas jusqu'à `now` — sinon on perd le reste (< 5h) à chaque tick.
  const lastHeartRegenAt = (p.lastHeartRegenAt || 0) + gained * HEART_REGEN_MS;
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
}

// ---- Store Zustand ----

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PROGRESS,

      completeLesson: (lessonId, xpGained) => {
        const p = get();
        const today = todayKey();
        // Marque le jour comme actif (historique cumulé pour le calendrier de série
        // et l'objectif quotidien). Dédup : on ne pousse pas si déjà présent.
        const activeDates = p.activeDates.includes(today)
          ? p.activeDates
          : [...p.activeDates, today];
        // Rejouer une leçon déjà faite : on étend juste le streak + jour actif,
        // pas de double XP ni de re-complétion.
        if (p.completedLessons.includes(lessonId)) {
          const st = nextStreak(p.lastActiveDate, p.streakDays);
          if (
            st.streakDays === p.streakDays &&
            st.lastActiveDate === p.lastActiveDate &&
            activeDates === p.activeDates
          )
            return;
          set({
            streakDays: st.streakDays,
            lastActiveDate: st.lastActiveDate,
            longestStreak: Math.max(p.longestStreak, st.streakDays),
            activeDates,
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
          activeDates,
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
          ...data
        } = s;
        return data;
      },
    }
  )
);