// AfriLingo — exercice d'association (matching). Tap-to-select : on choisit un côté
// gauche puis un côté droit pour former une paire. Pas de lib DnD (pièges tactiles).
// Stocke mapping[leftIdx] = rightOrigIdx ; correct ssi mapping[i]===i pour tout i.
"use client";

import { useMemo, useState } from "react";
import type { MatchingExercise } from "@/types";
import { validateAnswer, shuffle, type MatchingAnswer } from "@/lib/exercise-engine";
import { Button } from "../ui/button";
import { Nko, Lat } from "../direction-text";
import { cn } from "@/lib/format";

export function Matching({
  exercise,
  onResult,
}: {
  exercise: MatchingExercise;
  onResult: (correct: boolean) => void;
}) {
  // rightDisplay[pos] = index original de la paire affichée à cette position.
  const rightDisplay = useMemo(
    () => shuffle(exercise.pairs.map((_, i) => i)),
    [exercise]
  );

  const [leftSel, setLeftSel] = useState<number | null>(null);
  const [mapping, setMapping] = useState<Record<number, number>>({});
  const [phase, setPhase] = useState<"play" | "feedback">("play");

  const allPaired = Object.keys(mapping).length === exercise.pairs.length;
  const correct = validateAnswer(exercise, { mapping } as MatchingAnswer);

  const usedRight = new Set(Object.values(mapping));

  const onLeft = (i: number) => {
    if (phase === "feedback" || mapping[i] !== undefined) return;
    setLeftSel(i);
  };
  const onRight = (pos: number) => {
    if (phase === "feedback" || leftSel === null) return;
    const origIdx = rightDisplay[pos];
    if (usedRight.has(origIdx)) return;
    setMapping((m) => ({ ...m, [leftSel]: origIdx }));
    setLeftSel(null);
  };

  return (
    <div className="flex flex-col gap-5">
      {exercise.prompt?.fr && (
        <p className="text-center text-sm text-muted">{exercise.prompt.fr}</p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {/* Colonne gauche : mots N'Ko */}
        <div className="grid gap-3">
          {exercise.pairs.map((p, i) => {
            const paired = mapping[i] !== undefined;
            const isSel = leftSel === i;
            return (
              <button
                key={i}
                disabled={phase === "feedback" || paired}
                onClick={() => onLeft(i)}
                className={cn(
                  "min-h-14 rounded-2xl border-2 p-3 text-center transition-colors",
                  paired
                    ? "border-transparent bg-transparent opacity-30"
                    : isSel
                      ? "border-terre bg-terre/10"
                      : "border-line bg-surface-2 hover:bg-surface-3"
                )}
              >
                {p.left.nko ? (
                  <Nko className="text-xl font-semibold">{p.left.nko}</Nko>
                ) : (
                  <Lat className="text-base font-semibold">{p.left.latin}</Lat>
                )}
                {p.left.latin && p.left.nko && (
                  <Lat className="mt-0.5 block text-[10px] text-muted">
                    {p.left.latin}
                  </Lat>
                )}
              </button>
            );
          })}
        </div>
        {/* Colonne droite : sens FR mélangés */}
        <div className="grid gap-3">
          {rightDisplay.map((origIdx, pos) => {
            const used = usedRight.has(origIdx);
            return (
              <button
                key={pos}
                disabled={phase === "feedback" || used || leftSel === null}
                onClick={() => onRight(pos)}
                className={cn(
                  "min-h-14 rounded-2xl border-2 p-3 text-center text-sm font-medium transition-colors",
                  used
                    ? "border-transparent bg-transparent opacity-30"
                    : leftSel !== null
                      ? "border-jade bg-surface-2 hover:bg-surface-3"
                      : "border-line bg-surface-2"
                )}
              >
                {exercise.pairs[origIdx].right.fr}
              </button>
            );
          })}
        </div>
      </div>

      {phase === "play" ? (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!allPaired}
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
              ? "Toutes les paires sont correctes !"
              : "Certaines paires sont à revoir."}
          </div>
          <Button
            variant="success"
            size="lg"
            fullWidth
            onClick={() => onResult(correct)}
          >
            Continuer
          </Button>
        </div>
      )}
    </div>
  );
}