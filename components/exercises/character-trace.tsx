// AfriLingo — tracé de glyphe N'Ko sur canvas (coverage-scored).
// Le glyphe fantôme est dessiné en filigrane ; l'utilisateur dessine au-dessus au pointer.
// Score = points échantillonnés sur le masque du glyphe couverts par l'encre / 24.
// Pas de reconnaissance d'ordre de traits (hors scope). Fallback : character_match.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CharacterTraceExercise } from "@/types";
import { validateAnswer, type CharacterTraceAnswer } from "@/lib/exercise-engine";
import { Button } from "../ui/button";
import { Nko, Lat } from "../direction-text";
import { cn } from "@/lib/format";

const SIZE = 280; // px CSS
const SAMPLES = 24;
const INK_RADIUS = 14; // px : rayon de voisinage pour considérer un point couvert

export function CharacterTrace({
  exercise,
  onResult,
}: {
  exercise: CharacterTraceExercise;
  onResult: (correct: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inkRef = useRef<HTMLCanvasElement | null>(null); // offscreen ink mask
  const samplePts = useRef<{ x: number; y: number }[]>([]);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<"play" | "feedback">("play");
  const [coverage, setCoverage] = useState(0);
  const [hasInk, setHasInk] = useState(false);

  const correct =
    phase === "feedback"
      ? validateAnswer(exercise, { coverage } as CharacterTraceAnswer)
      : false;

  // ---- Init : dessine le glyphe fantôme + calcule les points échantillonnés ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // Ink offscreen.
    const ink = document.createElement("canvas");
    ink.width = SIZE;
    ink.height = SIZE;
    inkRef.current = ink;

    const drawGhost = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.font = `200px "Noto Sans NKo", "Ebrima", sans-serif`;
      ctx.fillStyle = "rgba(139, 92, 246, 0.16)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(exercise.glyph, SIZE / 2, SIZE / 2 + 8);
      computeSamples(ctx);
      setReady(true);
    };

    // Attendre que la police N'Ko soit chargée pour un masque exact.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) {
      fonts.ready.then(drawGhost).catch(drawGhost);
    } else {
      drawGhost();
    }
  }, [exercise.glyph]);

  // ---- Calcule SAMPLES points répartis sur le masque alpha du glyphe ----
  const computeSamples = (ctx: CanvasRenderingContext2D) => {
    const data = ctx.getImageData(0, 0, SIZE, SIZE).data;
    const pts: { x: number; y: number }[] = [];
    for (let y = 0; y < SIZE; y += 4) {
      for (let x = 0; x < SIZE; x += 4) {
        const a = data[(y * SIZE + x) * 4 + 3];
        if (a > 60) pts.push({ x, y });
      }
    }
    // Stratifié : on prend SAMPLES points répartis uniformément.
    const step = Math.max(1, Math.floor(pts.length / SAMPLES));
    samplePts.current = pts.filter((_, i) => i % step === 0).slice(0, SAMPLES);
  };

  // ---- Pointer drawing ----
  const pos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const strokeTo = (p: { x: number; y: number }) => {
    const ink = inkRef.current!;
    const ictx = ink.getContext("2d")!;
    ictx.strokeStyle = "#f2c14e";
    ictx.lineWidth = 14;
    ictx.lineCap = "round";
    ictx.lineJoin = "round";
    ictx.beginPath();
    ictx.moveTo(last.current!.x, last.current!.y);
    ictx.lineTo(p.x, p.y);
    ictx.stroke();
    // Réplique sur le canvas visible (pour le rendu de l'encre).
    const vctx = canvasRef.current!.getContext("2d")!;
    vctx.strokeStyle = "rgba(242, 193, 78, 0.9)";
    vctx.lineWidth = 14;
    vctx.lineCap = "round";
    vctx.lineJoin = "round";
    vctx.beginPath();
    vctx.moveTo(last.current!.x, last.current!.y);
    vctx.lineTo(p.x, p.y);
    vctx.stroke();
    last.current = p;
  };
  const onDown = (e: React.PointerEvent) => {
    if (phase === "feedback") return;
    e.preventDefault();
    drawing.current = true;
    last.current = pos(e);
    setHasInk(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drawing.current || phase === "feedback") return;
    const p = pos(e);
    strokeTo(p);
  };
  const onUp = () => {
    drawing.current = false;
    last.current = null;
  };

  const clearInk = useCallback(() => {
    const ink = inkRef.current;
    if (ink) ink.getContext("2d")!.clearRect(0, 0, SIZE, SIZE);
    // Redessine le fantôme (efface l'encre visible).
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
    ctx.font = `200px "Noto Sans NKo", "Ebrima", sans-serif`;
    ctx.fillStyle = "rgba(139, 92, 246, 0.16)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(exercise.glyph, SIZE / 2, SIZE / 2 + 8);
    ctx.restore();
    setHasInk(false);
    setCoverage(0);
  }, [exercise.glyph]);

  const verify = () => {
    const ink = inkRef.current!;
    const ictx = ink.getContext("2d")!;
    const data = ictx.getImageData(0, 0, SIZE, SIZE).data;
    let covered = 0;
    for (const p of samplePts.current) {
      if (isCovered(data, p.x, p.y)) covered++;
    }
    const cov = samplePts.current.length
      ? covered / samplePts.current.length
      : 0;
    setCoverage(cov);
    setPhase("feedback");
  };

  const isCovered = (data: Uint8ClampedArray, x: number, y: number): boolean => {
    const r = INK_RADIUS;
    for (let dy = -r; dy <= r; dy += 2) {
      for (let dx = -r; dx <= r; dx += 2) {
        const px = Math.round(x + dx);
        const py = Math.round(y + dy);
        if (px < 0 || py < 0 || px >= SIZE || py >= SIZE) continue;
        if (data[(py * SIZE + px) * 4 + 3] > 40) return true;
      }
    }
    return false;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-surface-2 p-4 text-center">
        <p className="text-sm text-muted">Trace ce glyphe N'Ko</p>
        <div className="mt-2 flex items-center justify-center gap-3">
          <Nko className="text-4xl font-semibold text-gold">{exercise.glyph}</Nko>
          <span className="text-cream">=</span>
          <Lat className="text-xl font-bold text-cream">{exercise.latin}</Lat>
        </div>
        <p className="mt-1 text-xs text-muted">{exercise.meaning}</p>
      </div>

      <div className="mx-auto">
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          onPointerCancel={onUp}
          className={cn(
            "touch-none rounded-2xl border-2 bg-ink",
            phase === "feedback"
              ? correct
                ? "border-ok"
                : "border-bad"
              : "border-line"
          )}
          style={{ width: SIZE, height: SIZE }}
          aria-label="Zone de tracé du glyphe"
        />
      </div>

      {phase === "play" ? (
        <div className="flex flex-col gap-2">
          {hasInk && (
            <Button variant="secondary" size="md" fullWidth onClick={clearInk}>
              Effacer
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!hasInk || !ready}
            onClick={verify}
          >
            Vérifier
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "rounded-xl p-3 text-center text-sm font-semibold",
              correct ? "bg-ok/20 text-ok" : "bg-bad/20 text-bad"
            )}
          >
            {correct
              ? `Beau tracé ! (${Math.round(coverage * 100)}% couvert)`
              : `Pas tout à fait — ${Math.round(coverage * 100)}% couvert. Réessaie !`}
          </div>
          <Button variant="success" size="lg" fullWidth onClick={() => onResult(correct)}>
            Continuer
          </Button>
        </div>
      )}
    </div>
  );
}