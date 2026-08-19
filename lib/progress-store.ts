// AfriLingo — adaptateur de progression (source de vérité : store Zustand).
// Ce module préserve l'API publique de l'ancien store (useSyncExternalStore)
// afin que les composants existants n'aient pas à changer. Tout est désormais
// géré par Zustand dans store/useUserStore.ts (persist localStorage + actions).
//
// SSR-safe : `useProgress` = hook Zustand (rend l'état par défaut côté serveur,
// réhydraté au mount du ProgressProvider). `getSnapshot`/`subscribe` exposés
// pour les usages non-hook (ex: lecture fraîche dans un callback du lesson-runner).

"use client";

import type { BadgeId, Progress, TranslitMode } from "@/types";
import {
  DEFAULT_PROGRESS,
  regenHearts,
  useUserStore,
  type UserState,
} from "@/store/useUserStore";
import { XP_PER_LESSON } from "./constants";

// ---- Snapshots / subscribe (compatibilité useSyncExternalStore) ----

/** Hook React : souscrit à l'état Zustand (rend un Progress). */
export function useProgress(): Progress {
  // useUserStore() renvoie UserState (Progress + actions) ; on ne retourne que
  // les données via une projection stable pour éviter de fuiter les actions.
  return useUserStore((s) => s);
}

/** Lecture fraîche hors hook (dans un callback). */
export function getSnapshot(): Progress {
  return useUserStore.getState();
}

/** Snapshot serveur (déterministe, pour useSyncExternalStore si besoin). */
export function getServerSnapshot(): Progress {
  return DEFAULT_PROGRESS;
}

/** Abonnement aux changements (compatibilité useSyncExternalStore). */
export function subscribe(cb: () => void): () => void {
  return useUserStore.subscribe(cb);
}

// ---- Réhydration + sync cross-tab (appelé par ProgressProvider) ----

/** Réhydrate le store depuis localStorage (côté client, après le mount). */
export function rehydrateProgress(): void {
  void useUserStore.persist.rehydrate();
}

// ---- Mutations publiques (délèguent aux actions du store Zustand) ----

export function setProgress(p: Progress): void {
  useUserStore.setState(p);
}

export function resetProgress(): void {
  useUserStore.getState().resetProgress();
}

export function addXp(amount: number): void {
  useUserStore.getState().addXp(amount);
}

export function loseHeart(): void {
  useUserStore.getState().loseHeart();
}

/** Appelé périodiquement (mount provider + intervalle 30s + visibilitychange). */
export function tickHearts(): void {
  useUserStore.getState().tickHearts();
}

export function canStartLesson(): boolean {
  return useUserStore.getState().hearts > 0;
}

// NOTE : `touchStreak()` a été retiré (code mort). Le streak et le jour actif
// sont désormais étendus exclusivement dans `completeLesson` (style Duolingo).

export function completeLesson(lessonId: string, xpGained: number = XP_PER_LESSON): void {
  useUserStore.getState().completeLesson(lessonId, xpGained);
}

export function awardBadge(id: BadgeId): void {
  useUserStore.getState().awardBadge(id);
}

export function setTranslitMode(mode: TranslitMode): void {
  useUserStore.getState().setTranslitMode(mode);
}

export function setDisplayName(name: string): void {
  useUserStore.getState().setDisplayName(name);
}

export function dismissInstall(): void {
  useUserStore.getState().dismissInstall();
}

// ---- Re-exports pour les consommateurs qui importent ces symboles ----

export { DEFAULT_PROGRESS, regenHearts };
export type { UserState };