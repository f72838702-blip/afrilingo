// AfriLingo — composants de texte directionnel.
// <Nko> rend un bloc RTL avec la police N'Ko (uniquement les codepoints N'Ko via unicode-range).
// <Lat> rend un bloc LTR avec la police sans (Inter).
// <Dual> affiche les deux (selon le mode de translittération global).

"use client";

import { useProgress } from "@/lib/progress-store";
import { dirFor } from "@/lib/rtl";
import { cn } from "@/lib/format";
import type { TranslitMode } from "@/types";

interface TextProps {
  children?: string;
  text?: string;
  className?: string;
  /** Forcer la direction (sinon auto-détecté). */
  dir?: "rtl" | "ltr";
}

export function Nko({ children, text, className, dir }: TextProps) {
  const t = text ?? children ?? "";
  return (
    <span dir={dir ?? dirFor(t)} className={cn("font-nko", className)}>
      {t}
    </span>
  );
}

export function Lat({ children, text, className, dir }: TextProps) {
  const t = text ?? children ?? "";
  return (
    <span dir={dir ?? "ltr"} className={cn("font-sans", className)}>
      {t}
    </span>
  );
}

/**
 * Affiche un texte localisé selon le mode de translittération :
 * - "nko" : N'Ko seul (si disponible, sinon latin)
 * - "latin" : translittération Latin seule
 * - "nko+latin" : N'Ko au-dessus, Latin en dessous (plus petit)
 */
export function Dual({
  nko,
  latin,
  fr,
  className,
  audio,
  mode,
  size = "md",
}: {
  nko?: string;
  latin?: string;
  fr?: string;
  className?: string;
  audio?: string;
  mode?: TranslitMode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const progress = useProgress();
  const m: TranslitMode = mode ?? progress.translitMode;

  const sizes = {
    sm: { nko: "text-lg", latin: "text-xs", fr: "text-xs" },
    md: { nko: "text-2xl", latin: "text-sm", fr: "text-sm" },
    lg: { nko: "text-4xl", latin: "text-base", fr: "text-base" },
    xl: { nko: "text-5xl", latin: "text-lg", fr: "text-base" },
  }[size];

  // Choix du contenu principal selon le mode.
  if (m === "latin" && latin) {
    return (
      <span className={cn("flex flex-col items-center", className)}>
        <Lat className={cn("font-semibold", sizes.latin)}>{latin}</Lat>
        {fr && <span className={cn("text-muted", sizes.fr)}>{fr}</span>}
      </span>
    );
  }
  if (m === "nko" && nko) {
    return (
      <span className={cn("flex flex-col items-center", className)}>
        <Nko className={cn("font-semibold", sizes.nko)}>{nko}</Nko>
        {fr && <span className={cn("text-muted", sizes.fr)}>{fr}</span>}
      </span>
    );
  }
  // nko+latin (défaut) : N'Ko au-dessus, Latin en dessous.
  return (
    <span className={cn("flex flex-col items-center gap-1", className)}>
      {nko ? (
        <Nko className={cn("font-semibold", sizes.nko)}>{nko}</Nko>
      ) : latin ? (
        <Lat className={cn("font-semibold", sizes.latin)}>{latin}</Lat>
      ) : null}
      {nko && latin && (
        <Lat className={cn("text-muted", sizes.latin)}>{latin}</Lat>
      )}
      {fr && <span className={cn("text-muted", sizes.fr)}>{fr}</span>}
    </span>
  );
}