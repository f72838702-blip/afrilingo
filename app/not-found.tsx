// AfriLingo — page 404.
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-6xl font-extrabold text-ocre">404</p>
      <h1 className="text-xl font-bold text-cream">Page introuvable</h1>
      <p className="max-w-xs text-sm text-muted">
        Cette page n&apos;existe pas encore. Reprenons depuis l&apos;accueil.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-terre px-5 py-3 text-sm font-semibold text-cream"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}