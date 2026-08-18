// AfriLingo — helpers localStorage SSR-safe.
// Next 16 rend sur serveur : window/storage n'existent pas. On gardearde tout côté client.

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadJSON<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota dépassé ou mode privé : on ignore silencieusement (MVP local-first non critique).
  }
}

export function removeJSON(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}