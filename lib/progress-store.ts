// AfriLingo — store de progression (local-first, localStorage, useSyncExternalStore).
// SSR-safe : snapshot serveur = défaut déterministe ; mutations uniquement côté client.
// Sync cross-tab via l'événement `storage`.

import { useSyncExternalStore } from "react";
import type { BadgeId, Progress, TranslitMode } from "@/types";
import {
  HEART_REGEN_MS,
  MAX_HEARTS,
  PROGRESS_STORAGE_KEY,
  PROGRESS_VERSION,
  XP_PER_LESSON,
} from "./constants";
import { loadJSON, saveJSON, isBrowser } from "./storage";
import { nextStreak } from "./streak";
import { leagueForXp, DEFAULT_LEAGUE_ID } from "@/data/leagues";

// ---- État par défaut (déterministe, partagé serveur + premier render client) ----

export const DEFAULT_PROGRESS: Progress = {
  version: PROGRESS_VERSION,
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
};

// ---- Cache module-level (référence stable pour useSyncExternalStore) ----

let current: Progress = DEFAULT_PROGRESS;
let loaded = false;

// ---- Pub/sub ----

type Listener = () => void;
const listeners = new Set<Listener>();

function notify(): void {
  for (const l of listeners) l();
}

export function subscribe(cb: Listener): () => void {
  listeners.add(cb);
  // Sync cross-tab : si une autre fenêtre écrit, on recharge depuis localStorage.
  if (isBrowser()) {
    const onStorage = (e: StorageEvent) => {
      if (e.key === PROGRESS_STORAGE_KEY) {
        current = loadFromStorage() ?? DEFAULT_PROGRESS;
        cb();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(cb);
      window.removeEventListener("storage", onStorage);
    };
  }
  return () => listeners.delete(cb);
}

// ---- Snapshots ----

export function getSnapshot(): Progress {
  ensureLoaded();
  return current;
}

export function getServerSnapshot(): Progress {
  return DEFAULT_PROGRESS;
}

function loadFromStorage(): Progress | null {
  const p = loadJSON<Progress>(PROGRESS_STORAGE_KEY);
  if (!p) return null;
  // Migration légère : on force la version et comble les champs manquants.
  return { ...DEFAULT_PROGRESS, ...p, version: PROGRESS_VERSION };
}

function ensureLoaded(): void {
  if (loaded || !isBrowser()) return;
  loaded = true;
  const p = loadFromStorage();
  if (p) current = regenHearts(p, Date.now());
}

// ---- Mutation interne ----

function commit(next: Progress): void {
  current = next;
  saveJSON(PROGRESS_STORAGE_KEY, next);
  notify();
}

// ---- API publique (mutations) ----

export function setProgress(p: Progress): void {
  commit(p);
}

export function resetProgress(): void {
  commit({ ...DEFAULT_PROGRESS, lastHeartRegenAt: isBrowser() ? Date.now() : 0 });
}

export function addXp(amount: number): void {
  const p = getSnapshot();
  const totalXp = p.totalXp + amount;
  commit({
    ...p,
    totalXp,
    leagueId: leagueForXp(totalXp),
  });
}

export function loseHeart(): void {
  const p = getSnapshot();
  if (p.hearts <= 0) return;
  commit({ ...p, hearts: p.hearts - 1 });
}

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

/** Appelé périodiquement (mount provider + intervalle 30s + visibilitychange). */
export function tickHearts(): void {
  const now = Date.now();
  const p = getSnapshot();
  const regen = regenHearts(p, now);
  if (regen !== p) commit(regen);
}

export function canStartLesson(): boolean {
  return getSnapshot().hearts > 0;
}

export function touchStreak(): void {
  const p = getSnapshot();
  const { streakDays, lastActiveDate } = nextStreak(p.lastActiveDate, p.streakDays);
  if (streakDays === p.streakDays && lastActiveDate === p.lastActiveDate) return;
  commit({
    ...p,
    streakDays,
    lastActiveDate,
    longestStreak: Math.max(p.longestStreak, streakDays),
  });
}

export function completeLesson(lessonId: string): void {
  const p = getSnapshot();
  if (p.completedLessons.includes(lessonId)) {
    // Rejouer une leçon : on donne l'XP de complétion une seule fois, mais on étend le streak.
    touchStreak();
    return;
  }
  const completedLessons = [...p.completedLessons, lessonId];
  let next: Progress = { ...p, completedLessons };
  // Streak style Duolingo : on étend en finissant une leçon.
  const st = nextStreak(p.lastActiveDate, p.streakDays);
  next = {
    ...next,
    streakDays: st.streakDays,
    lastActiveDate: st.lastActiveDate,
    longestStreak: Math.max(p.longestStreak, st.streakDays),
  };
  next = { ...next, totalXp: next.totalXp + XP_PER_LESSON };
  next = { ...next, leagueId: leagueForXp(next.totalXp) };
  commit(next);
}

export function awardBadge(id: BadgeId): void {
  const p = getSnapshot();
  if (p.badges.includes(id)) return;
  commit({ ...p, badges: [...p.badges, id] });
}

export function setTranslitMode(mode: TranslitMode): void {
  const p = getSnapshot();
  if (p.translitMode === mode) return;
  commit({ ...p, translitMode: mode });
}

export function dismissInstall(): void {
  const p = getSnapshot();
  if (p.installDismissed) return;
  commit({ ...p, installDismissed: true });
}

// ---- Hook React ----

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}