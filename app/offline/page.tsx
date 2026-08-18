// AfriLingo — page hors-ligne (fallback si navigation offline vers ressource non cachée).
import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <WifiOff className="h-12 w-12 text-muted" />
      <h1 className="text-xl font-bold text-cream">Tu es hors-ligne</h1>
      <p className="max-w-xs text-sm text-muted">
        Cette page n&apos;est pas encore en cache. Reviens quand tu auras du réseau —
        tes leçons terminées restent disponibles hors-ligne.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-terre px-5 py-3 text-sm font-semibold text-cream"
      >
        Réessayer l&apos;accueil
      </Link>
    </div>
  );
}