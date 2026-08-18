// AfriLingo — helpers de dates (streak).
// Date.now() autorisé ici (lib runtime client, pas dans un workflow script).

/** "YYYY-MM-DD" en temps local. */
export function todayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Différence en jours calendaires entre deux clés "YYYY-MM-DD" (b - a). */
export function dayDiff(aKey: string, bKey: string): number {
  const a = parseKey(aKey);
  const b = parseKey(bKey);
  if (!a || !b) return 0;
  const MS = 24 * 60 * 60 * 1000;
  return Math.round((b.getTime() - a.getTime()) / MS);
}

function parseKey(key: string): Date | null {
  const [y, m, d] = key.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/**
 * Calcule le nouveau streak.
 * - today (déjà actif) → no-op (same streak)
 * - yesterday → +1
 * - sinon (rupture ou 1ère fois) → 1
 */
export function nextStreak(
  lastActiveDate: string | null,
  streakDays: number,
  now: Date = new Date()
): { streakDays: number; lastActiveDate: string } {
  const today = todayKey(now);
  if (lastActiveDate === today) {
    return { streakDays, lastActiveDate: today };
  }
  if (lastActiveDate && dayDiff(lastActiveDate, today) === 1) {
    return { streakDays: streakDays + 1, lastActiveDate: today };
  }
  return { streakDays: 1, lastActiveDate: today };
}

/** Les 7 derniers jours en clés "YYYY-MM-DD" (du plus ancien au plus récent). */
export function last7Days(now: Date = new Date()): string[] {
  const out: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(todayKey(d));
  }
  return out;
}