// AfriLingo — exercice « écoute et tape » (comparaison de texte, pas de reconnaissance vocale).
"use client";

import { useState } from "react";
import type { ListenAndTypeExercise } from "@/types";
import {
  normalize,
  validateAnswer,
  type ListenAndTypeAnswer,
} from "@/lib/exercise-engine";
import { Button } from "../ui/button";
import { AudioPlayer } from "../audio-player";
import { Lat } from "../direction-text";
import { cn } from "@/lib/format";

export function ListenAndType({
  exercise,
  onResult,
}: {
  exercise: ListenAndTypeExercise;
  onResult: (correct: boolean) => void;
}) {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"play" | "feedback">("play");
  const correct = validateAnswer(exercise, { text } as ListenAndTypeAnswer);
  const accepted = exercise.accept[0] ?? "";

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-surface-2 p-5 text-center">
        <p className="mb-3 text-sm text-muted">Écoute et tape ce que tu entends</p>
        <div className="flex justify-center">
          <AudioPlayer audioId={exercise.audio} label="Réécouter" size="lg" />
        </div>
      </div>

      <input
        type="text"
        value={text}
        disabled={phase === "feedback"}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && text.trim() && phase === "play")
            setPhase("feedback");
        }}
        placeholder="Ta réponse (translittération Latin)…"
        className={cn(
          "h-14 w-full rounded-2xl border-2 bg-surface-2 px-4 text-lg text-cream outline-none",
          phase === "feedback"
            ? correct
              ? "border-ok"
              : "border-bad"
            : "border-line focus:border-terre"
        )}
      />

      {phase === "play" ? (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!text.trim()}
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
            {correct ? "Exact !" : `Réponse : ${accepted}`}
          </div>
          <Button variant="success" size="lg" fullWidth onClick={() => onResult(correct)}>
            Continuer
          </Button>
        </div>
      )}
    </div>
  );
}