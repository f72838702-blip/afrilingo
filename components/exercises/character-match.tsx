// AfriLingo — exercice de reconnaissance de glyphe (chiffre/lettre N'Ko).
"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { CharacterMatchExercise } from "@/types";
import { shuffle, validateAnswer, type CharacterMatchAnswer } from "@/lib/exercise-engine";
import { Button } from "../ui/button";
import { Nko } from "../direction-text";
import { cn } from "@/lib/format";

export function CharacterMatch({
  exercise,
  onResult,
}: {
  exercise: CharacterMatchExercise;
  onResult: (correct: boolean) => void;
}) {
  const options = useMemo(() => shuffle(exercise.options), [exercise]);
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<"play" | "feedback">("play");

  const correct = selected
    ? validateAnswer(exercise, { glyph: selected } as CharacterMatchAnswer)
    : false;
  const correctGlyph = exercise.options.find((o) => o.correct)?.glyph;

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-surface-2 p-4 text-center">
        <p className="text-lg font-semibold text-cream">
          {exercise.prompt.fr}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((o) => {
          const isSel = selected === o.glyph;
          const showCorrect = phase === "feedback" && o.correct;
          const showWrong = phase === "feedback" && isSel && !o.correct;
          return (
            <motion.button
              key={o.glyph}
              whileTap={{ scale: 0.95 }}
              animate={showWrong ? { x: [0, -8, 8, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              disabled={phase === "feedback"}
              onClick={() => setSelected(o.glyph)}
              className={cn(
                "grid h-28 place-items-center rounded-2xl border-2 transition-colors",
                showCorrect
                  ? "border-ok bg-ok/15"
                  : showWrong
                    ? "border-bad bg-bad/15"
                    : isSel
                      ? "border-terre bg-terre/10"
                      : "border-line bg-surface-2 hover:bg-surface-3"
              )}
            >
              <Nko className="text-5xl font-semibold text-cream">{o.glyph}</Nko>
            </motion.button>
          );
        })}
      </div>

      {phase === "play" ? (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!selected}
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
              ? "Correct !"
              : `Réponse : ${correctGlyph ?? ""}`}
          </div>
          <Button variant="success" size="lg" fullWidth onClick={() => onResult(correct)}>
            Continuer
          </Button>
        </div>
      )}
    </div>
  );
}