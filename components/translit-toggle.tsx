// AfriLingo — bascule du mode de translittération (persisté dans le progress store).
"use client";

import type { TranslitMode } from "@/types";
import { setTranslitMode } from "@/lib/progress-store";
import { useProgress } from "@/lib/progress-store";
import { cn } from "@/lib/format";

const MODES: { id: TranslitMode; label: string }[] = [
  { id: "nko", label: "N'Ko" },
  { id: "nko+latin", label: "N'Ko + Latin" },
  { id: "latin", label: "Latin" },
];

export function TranslitToggle({ className }: { className?: string }) {
  const p = useProgress();
  return (
    <div
      className={cn("inline-flex rounded-xl bg-surface-2 p-1", className)}
      role="radiogroup"
      aria-label="Affichage du texte"
    >
      {MODES.map((m) => (
        <button
          key={m.id}
          role="radio"
          aria-checked={p.translitMode === m.id}
          onClick={() => setTranslitMode(m.id)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
            p.translitMode === m.id
              ? "bg-terre text-cream"
              : "text-muted hover:text-cream"
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}