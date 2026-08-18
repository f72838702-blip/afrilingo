// AfriLingo — assemblage de phrase par tap-to-add/remove (pas de lib DnD).
// Supporte le RTL N'Ko : la ligne réponse prend dir={direction}, les jetons s'ajoutent
// dans l'ordre logique (le 1er tap = début logique = droite en RTL).
"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SentenceAssemblyExercise } from "@/types";
import {
  validateAnswer,
  shuffle,
  type SentenceAssemblyAnswer,
} from "@/lib/exercise-engine";
import { Button } from "../ui/button";
import { AudioPlayer } from "../audio-player";
import { cn } from "@/lib/format";

export function SentenceAssembly({
  exercise,
  onResult,
}: {
  exercise: SentenceAssemblyExercise;
  onResult: (correct: boolean) => void;
}) {
  // Banque mélangée. Chaque jeton est identifié par son index initial dans bank.
  const bank = useMemo(() => exercise.bank, [exercise]);
  const [shuffled] = useState(() => shuffle(bank.map((_, i) => i)));

  const [used, setUsed] = useState<number[]>([]); // indexes (dans bank) assemblés, ordre logique
  const [phase, setPhase] = useState<"play" | "feedback">("play");

  const correct = validateAnswer(exercise, {
    tokens: used.map((i) => bank[i]),
  } as SentenceAssemblyAnswer);

  const add = (bankIdx: number) => {
    if (phase === "feedback" || used.includes(bankIdx)) return;
    setUsed((u) => [...u, bankIdx]);
  };
  const removeAt = (pos: number) => {
    if (phase === "feedback") return;
    setUsed((u) => u.filter((_, i) => i !== pos));
  };

  const isNko = exercise.bankScript === "nko";
  const fontFamily = isNko ? "font-nko" : "font-sans";

  return (
    <div className="flex flex-col gap-5">
      {exercise.prompt?.fr && (
        <p className="text-center text-sm text-muted">{exercise.prompt.fr}</p>
      )}

      {/* Cible attendue (aperçu) + bouton écouter si audio dispo */}
      <div className="flex items-center justify-center gap-2">
        {exercise.target.fr && (
          <p className="text-center text-base font-semibold text-cream">
            « {exercise.target.fr} »
          </p>
        )}
        {exercise.target.audio && (
          <AudioPlayer
            audioId={exercise.target.audio}
            label="Écouter la phrase cible"
            size="sm"
          />
        )}
      </div>

      {/* Ligne réponse (dir = direction de l'exercice) */}
      <div
        dir={exercise.direction}
        className={cn(
          "min-h-20 rounded-2xl border-2 border-dashed border-line bg-surface-2 p-3",
          "flex flex-wrap items-center gap-2",
          phase === "feedback" && (correct ? "border-ok" : "border-bad")
        )}
      >
        {used.length === 0 && (
          <span className="w-full text-center text-sm text-muted">
            Touche les mots pour construire la phrase
          </span>
        )}
        <AnimatePresence initial={false}>
          {used.map((bankIdx, pos) => (
            <motion.button
              key={`${bankIdx}-${pos}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => removeAt(pos)}
              className={cn(
                "rounded-xl border-2 px-3 py-2 text-lg font-semibold transition-colors",
                phase === "feedback"
                  ? correct
                    ? "border-ok bg-ok/15 text-cream"
                    : "border-bad bg-bad/15 text-cream"
                  : "border-terre bg-terre/10 text-cream hover:bg-terre/20",
                fontFamily
              )}
            >
              {bank[bankIdx]}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Banque de jetons */}
      <div
        dir={exercise.direction}
        className="flex flex-wrap items-center gap-2 rounded-2xl bg-surface p-3"
      >
        {shuffled.map((bankIdx) => {
          const isUsed = used.includes(bankIdx);
          return (
            <button
              key={bankIdx}
              disabled={phase === "feedback" || isUsed}
              onClick={() => add(bankIdx)}
              className={cn(
                "rounded-xl border-2 px-3 py-2 text-lg font-semibold transition-all",
                isUsed
                  ? "border-line bg-transparent opacity-30"
                  : "border-line bg-surface-2 text-cream hover:bg-surface-3 active:scale-95",
                fontFamily
              )}
            >
              {bank[bankIdx]}
            </button>
          );
        })}
      </div>

      {phase === "play" ? (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={used.length === 0}
          onClick={() => setPhase("feedback")}
        >
          Vérifier
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "rounded-xl p-3 text-center text-sm font-semibold",
              correct ? "bg-ok/20 text-ok" : "bg-bad/20 text-bad"
            )}
          >
            {correct
              ? "Bien joué !"
              : `Réponse : ${exercise.target.nko ?? exercise.target.latin ?? ""}`}
          </div>
          <Button variant="success" size="lg" fullWidth onClick={() => onResult(correct)}>
            Continuer
          </Button>
        </div>
      )}
    </div>
  );
}