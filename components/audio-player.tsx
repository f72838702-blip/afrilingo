// AfriLingo — bouton lecteur audio (déclenché par user gesture → OK iOS).
"use client";

import { Volume2 } from "lucide-react";
import { playAudio, warmAudioContext } from "@/lib/audio";
import { cn } from "@/lib/format";

export function AudioPlayer({
  audioId,
  className,
  label = "Écouter",
  size = "md",
}: {
  audioId: string;
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const onPlay = () => {
    warmAudioContext();
    playAudio(audioId);
  };
  const dims =
    size === "sm" ? "h-9 w-9" : size === "lg" ? "h-14 w-14" : "h-12 w-12";
  const icon = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-7 w-7" : "h-5 w-5";
  return (
    <button
      onClick={onPlay}
      aria-label={label}
      className={cn(
        "grid place-items-center rounded-full bg-surface-2 text-gold hover:bg-surface-3 active:scale-95 transition",
        dims,
        className
      )}
    >
      <Volume2 className={icon} />
    </button>
  );
}