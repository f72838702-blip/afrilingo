// AfriLingo — écran de chargement (suspense fallback).
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-surface-3 border-t-gold" />
      <p className="text-sm text-muted">Chargement…</p>
    </div>
  );
}