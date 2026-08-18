// AfriLingo — exercice QCM (choix multiples).
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { MultipleChoiceExercise } from "@/types";
import { validateAnswer, type MultipleChoiceAnswer } from "@/lib/exercise-engine";
import { Button } from "../ui/button";
import { Dual } from "../direction-text";
import { AudioPlayer } from "../audio-player";
import { cn } from "@/lib/format";

type Phase = "select" | "feedback";

export function MultipleChoice({
  exercise,
  onResult,
}: {
  exercise: MultipleChoiceExercise;
  onResult: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("select");

  const correctIdx = exercise.options.findIndex((o) => o.correct);
  const correct = validateAnswer(exercise, { selected: selected ?? -1 } as MultipleChoiceAnswer);

  return (
    <div className="flex flex-col gap-5">
      {/* Question */}
      <div className="rounded-2xl bg-surface-2 p-4 text-center">
        {exercise.audioFirst && exercise.question.audio && (
          <div className="mb-2 flex justify-center">
            <AudioPlayer audioId={exercise.question.audio} label="Écouter la question" size="lg" />
          </div>
        )}
        <p className="text-lg font-semibold text-cream">
          {exercise.question.fr ?? exercise.question.latin ?? exercise.question.nko}
        </p>
        {exercise.question.audio && !exercise.audioFirst && (
          <div className="mt-2 flex justify-center">
            <AudioPlayer audioId={exercise.question.audio} label="Écouter" />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid gap-3">
        {exercise.options.map((o, i) => {
          const isSel = selected === i;
          const isCorrect = i === correctIdx;
          const showCorrect = phase === "feedback" && isCorrect;
          const showWrong = phase === "feedback" && isSel && !isCorrect;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.97 }}
              animate={showWrong ? { x: [0, -8, 8, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              disabled={phase === "feedback"}
              onClick={() => setSelected(i)}
              className={cn(
                "flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-colors",
                showCorrect
                  ? "border-ok bg-ok/15"
                  : showWrong
                    ? "border-bad bg-bad/15"
                    : isSel
                      ? "border-terre bg-terre/10"
                      : "border-line bg-surface-2 hover:bg-surface-3"
              )}
            >
              <Dual
                nko={o.text.nko}
                latin={o.text.latin}
                fr={o.text.fr}
                size="md"
                className="!flex-row !items-center !gap-3"
              />
              {o.text.audio && (
                <AudioPlayer audioId={o.text.audio} label="Écouter" size="sm" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Action */}
      {phase === "select" ? (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={selected === null}
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
            {correct ? "Parfait !" : `Réponse : ${exercise.options[correctIdx].text.fr ?? exercise.options[correctIdx].text.latin ?? exercise.options[correctIdx].text.nko ?? ""}`}
          </div>
          <Button variant="success" size="lg" fullWidth onClick={() => onResult(correct)}>
            Continuer
          </Button>
        </div>
      )}
    </div>
  );
}