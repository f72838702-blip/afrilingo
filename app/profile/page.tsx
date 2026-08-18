// AfriLingo — profil : nom modifiable, stats (XP/série/leçons/badges),
// calendrier streak, choix de la langue cible, badges, ligue, reset.
"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw, Check, Pencil, Lock } from "lucide-react";
import { useState } from "react";
import {
  useProgress,
  resetProgress,
  setDisplayName,
} from "@/lib/progress-store";
import { last7Days } from "@/lib/streak";
import { BADGES } from "@/data/badges";
import { BadgeCard } from "@/components/badge-card";
import { LeagueCard } from "@/components/league-card";
import { TranslitToggle } from "@/components/translit-toggle";
import { Button } from "@/components/ui/button";
import { Nko } from "@/components/direction-text";
import { cn } from "@/lib/format";

/** Langues cibles : N'Ko est le seul cours actif en MVP. Les autres sont annoncées. */
const TARGET_LANGUAGES: {
  id: string;
  name: string;
  script: string;
  available: boolean;
}[] = [
  { id: "nko", name: "N'Ko", script: "ߒߞߏ", available: true },
  { id: "bambara", name: "Bambara", script: "Bamanankan", available: false },
  { id: "wolof", name: "Wolof", script: "Wolof", available: false },
  { id: "yoruba", name: "Yoruba", script: "Yorùbá", available: false },
];

export default function ProfilePage() {
  const progress = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const week = last7Days();
  const level = Math.floor(progress.totalXp / 100) + 1;
  const lessonsDone = progress.completedLessons.length;
  const badgesEarned = progress.badges.length;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
          <Link
            href="/"
            aria-label="Retour"
            className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-cream hover:bg-surface-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold text-cream">Profil</h1>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-4 py-6 pb-20">
        {/* Nom de l'apprenant (modifiable) */}
        <DisplayNameEditor
          value={progress.displayName}
          onSave={(name) => setDisplayName(name)}
        />

        {/* Stats principales */}
        <div className="grid grid-cols-2 gap-3">
          <Stat label="XP total" value={progress.totalXp} accent="text-gold" />
          <Stat label="Série" value={`${progress.streakDays}j`} accent="text-ocre" />
          <Stat label="Leçons complétées" value={lessonsDone} accent="text-jade" />
          <Stat label="Badges débloqués" value={`${badgesEarned}/${BADGES.length}`} accent="text-terre" />
        </div>

        {/* Calendrier streak 7j */}
        <section className="rounded-3xl border border-line bg-surface p-4">
          <h2 className="mb-3 text-sm font-bold text-cream">7 derniers jours</h2>
          <div className="flex justify-between gap-2">
            {week.map((day) => {
              const active = progress.lastActiveDate === day;
              const d = new Date(day);
              const label = ["D", "L", "M", "M", "J", "V", "S"][d.getDay()];
              return (
                <div
                  key={day}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 rounded-xl py-2",
                    active ? "bg-gold/15" : "bg-surface-2"
                  )}
                >
                  <span className="text-[10px] text-muted">{label}</span>
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      active ? "bg-gold" : "bg-surface-3"
                    )}
                  />
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-center text-xs text-muted">
            Record : {progress.longestStreak} jour{progress.longestStreak > 1 ? "s" : ""}
          </p>
        </section>

        {/* Langue cible d'apprentissage */}
        <section className="rounded-3xl border border-line bg-surface p-4">
          <h2 className="mb-3 text-sm font-bold text-cream">
            Langue apprise
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {TARGET_LANGUAGES.map((lang) => {
              const active = lang.available && lang.id === "nko";
              return (
                <div
                  key={lang.id}
                  className={cn(
                    "relative rounded-2xl border-2 p-3 text-center transition-colors",
                    active
                      ? "border-terre bg-terre/10"
                      : "border-line bg-surface-2 opacity-60"
                  )}
                  aria-label={`Langue ${lang.name}${lang.available ? "" : " (bientôt disponible)"}`}
                >
                  {lang.id === "nko" ? (
                    <Nko className="text-2xl font-semibold text-gold">{lang.script}</Nko>
                  ) : (
                    <p className="text-lg font-semibold text-cream">{lang.script}</p>
                  )}
                  <p className="mt-1 text-xs font-medium text-cream">{lang.name}</p>
                  {active ? (
                    <span className="mt-1 inline-block rounded-full bg-terre/20 px-2 py-0.5 text-[10px] font-bold text-terre">
                      En cours
                    </span>
                  ) : (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-medium text-muted">
                      <Lock className="h-3 w-3" /> Bientôt disponible
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Affichage translittération */}
        <section className="rounded-3xl border border-line bg-surface p-4">
          <h2 className="mb-3 text-sm font-bold text-cream">
            Affichage du texte
          </h2>
          <TranslitToggle />
        </section>

        {/* Badges */}
        <section>
          <h2 className="mb-3 text-sm font-bold text-cream">Badges</h2>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((b) => (
              <BadgeCard
                key={b.id}
                badge={b}
                earned={progress.badges.includes(b.id)}
              />
            ))}
          </div>
        </section>

        {/* League */}
        <section>
          <h2 className="mb-3 text-sm font-bold text-cream">Ligue</h2>
          <LeagueCard />
        </section>

        {/* Reset */}
        <section className="rounded-3xl border border-line bg-surface p-4">
          <h2 className="mb-2 text-sm font-bold text-cream">Réinitialiser</h2>
          <p className="mb-3 text-xs text-muted">
            Efface ta progression, tes XP et tes badges. Action irréversible.
          </p>
          {confirmReset ? (
            <div className="flex gap-2">
              <Button
                variant="danger"
                size="sm"
                fullWidth
                onClick={() => {
                  resetProgress();
                  setConfirmReset(false);
                }}
              >
                Confirmer
              </Button>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => setConfirmReset(false)}
              >
                Annuler
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => setConfirmReset(true)}
            >
              <RotateCcw className="h-4 w-4" /> Réinitialiser la progression
            </Button>
          )}
        </section>
      </main>
    </div>
  );
}

/** Éditeur de nom : affiche le nom + bouton crayon → input + bouton valider. */
function DisplayNameEditor({
  value,
  onSave,
}: {
  value: string;
  onSave: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  // Resynchronise le brouillon quand la valeur externe change (ex: reset).
  if (!editing && draft !== value) setDraft(value);

  const commit = () => {
    onSave(draft);
    setEditing(false);
  };

  return (
    <section className="rounded-3xl border border-line bg-surface p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-terre to-ocre text-xl font-extrabold text-ink">
          {value.charAt(0).toUpperCase()}
        </div>
        {editing ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              autoFocus
              value={draft}
              maxLength={40}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") {
                  setDraft(value);
                  setEditing(false);
                }
              }}
              placeholder="Ton nom"
              className="h-10 flex-1 rounded-xl border-2 border-line bg-surface-2 px-3 text-sm text-cream outline-none focus:border-terre"
            />
            <button
              onClick={commit}
              aria-label="Valider le nom"
              className="grid h-10 w-10 place-items-center rounded-xl bg-jade/20 text-jade hover:bg-jade/30"
            >
              <Check className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <p className="text-base font-bold text-cream">{value}</p>
              <p className="text-[11px] text-muted">Apprenant N'Ko</p>
            </div>
            <button
              onClick={() => {
                setDraft(value);
                setEditing(true);
              }}
              aria-label="Modifier le nom"
              className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-muted hover:bg-surface-3 hover:text-cream"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-3 text-center">
      <p className={cn("text-2xl font-extrabold", accent)}>{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}