// AfriLingo — écran de fin de leçon : XP gagnée, streak, badge, proverbe du jour.
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Sparkles, ArrowRight } from "lucide-react";
import { useProgress } from "@/lib/progress-store";
import { XP_PER_LESSON } from "@/lib/constants";
import { proverbOfDay } from "@/data/proverbs";
import { BADGES_BY_ID } from "@/data/badges";
import { BadgeCard } from "@/components/badge-card";
import { Button } from "@/components/ui/button";
import { Nko, Lat } from "@/components/direction-text";
import { getNextLesson, FLAGSHIP_COURSE_ID } from "@/lib/course-loader";

export default function CompletePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const progress = useProgress();

  // Proverbe du jour (index calendaire — Date OK côté client).
  const [proverb] = useState(() => {
    const idx = Math.floor(Date.now() / 86_400_000);
    return proverbOfDay(idx);
  });

  // Le dernier badge obtenu (pour la révélation), heuristique simple.
  const lastBadge = progress.badges[progress.badges.length - 1];
  const badge = lastBadge ? BADGES_BY_ID[lastBadge] : null;

  const next = id ? getNextLesson(FLAGSHIP_COURSE_ID, id) : null;

  return (
    <div className="mx-auto max-w-md px-4 pb-16 pt-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <div className="text-6xl">🎉</div>
        <h1 className="text-2xl font-extrabold text-cream">Leçon terminée !</h1>

        {/* XP */}
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-6 py-4">
          <Sparkles className="h-7 w-7 text-gold" />
          <div className="text-left">
            <p className="text-2xl font-extrabold text-gold">+{XP_PER_LESSON}</p>
            <p className="text-xs text-muted">XP gagnés</p>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-6 py-4">
          <Flame className="h-7 w-7 text-gold" />
          <div className="text-left">
            <p className="text-2xl font-extrabold text-gold">
              {progress.streakDays}
            </p>
            <p className="text-xs text-muted">
              jour{progress.streakDays > 1 ? "s" : ""} de série
            </p>
          </div>
        </div>

        {/* Badge révélé */}
        {badge && (
          <div className="w-full max-w-xs">
            <motion.div
              initial={{ rotate: -8, y: 10, opacity: 0 }}
              animate={{ rotate: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <BadgeCard badge={badge} earned />
            </motion.div>
          </div>
        )}

        {/* Proverbe du jour */}
        <div className="w-full rounded-2xl border border-ocre/30 bg-surface-2 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ocre">
            Proverbe du jour
          </p>
          {proverb.nko && (
            <Nko className="block text-xl text-gold" dir="rtl">
              {proverb.nko}
            </Nko>
          )}
          <Lat className="block text-base font-semibold text-cream">
            {proverb.latin}
          </Lat>
          <p className="mt-2 text-sm italic text-muted">« {proverb.fr} »</p>
          <p className="mt-1 text-[11px] text-muted">{proverb.note}</p>
        </div>

        {/* CTA */}
        <div className="flex w-full flex-col gap-2">
          {next ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => router.push(`/lesson/${next.id}`)}
            >
              Leçon suivante <ArrowRight className="h-5 w-5" />
            </Button>
          ) : (
            <div className="rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-gold">
              🏆 Module terminé ! Tu maîtrises les salutations en N&apos;Ko.
            </div>
          )}
          <Link
            href="/"
            className="text-center text-sm font-semibold text-terre hover:underline"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </motion.div>
    </div>
  );
}