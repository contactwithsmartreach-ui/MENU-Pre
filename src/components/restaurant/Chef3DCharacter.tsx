"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Chef3DCharacterProps {
  className?: string;
  imageSrc?: string;
}

export function Chef3DCharacter({
  className,
  imageSrc = "dyad-media://media/bold-badger-bob/.dyad/media/4ed13bbf469718326bee283f8bf1bf01c834a9b55fbad911915caf745e013c1e.jpg",
}: Chef3DCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCutoutReady, setIsCutoutReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [mouseLight, setMouseLight] = useState({ x: 50, y: 50 });

  // High-fidelity background isolation with edge despill & anti-aliased matting
  useEffect(() => {
    let isCancelled = false;
    const img = new Image();

    img.onload = () => {
      if (isCancelled) return;
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const w = img.naturalWidth || 1000;
        const h = img.naturalHeight || 1000;
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Sample background color from multiple perimeter locations
        const samplePoints = [
          [3, 3],
          [w - 4, 3],
          [3, h - 4],
          [w - 4, h - 4],
          [Math.floor(w / 2), 3],
          [Math.floor(w * 0.2), 3],
          [Math.floor(w * 0.8), 3],
          [3, Math.floor(h / 2)],
          [w - 4, Math.floor(h / 2)],
        ];

        let bgR = 0,
          bgG = 0,
          bgB = 0;
        samplePoints.forEach(([x, y]) => {
          const idx = (Math.floor(y) * w + Math.floor(x)) * 4;
          bgR += data[idx];
          bgG += data[idx + 1];
          bgB += data[idx + 2];
        });
        bgR /= samplePoints.length;
        bgG /= samplePoints.length;
        bgB /= samplePoints.length;

        // Multi-stage matte extraction with edge despill
        const innerThreshold = 38;
        const outerThreshold = 78;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Perceptually weighted color distance
          const dr = r - bgR;
          const dg = g - bgG;
          const db = b - bgB;
          const dist = Math.sqrt(0.299 * dr * dr + 0.587 * dg * dg + 0.114 * db * db);

          if (dist < innerThreshold) {
            data[i + 3] = 0;
          } else if (dist < outerThreshold) {
            const alphaFactor = (dist - innerThreshold) / (outerThreshold - innerThreshold);
            // Smooth hermite interpolation for organic soft edges
            const smoothAlpha = alphaFactor * alphaFactor * (3 - 2 * alphaFactor);
            data[i + 3] = Math.floor(data[i + 3] * smoothAlpha);

            // Despill: remove background hue fringe from edge pixels
            data[i] = Math.min(255, Math.max(0, data[i] + (data[i] - bgR) * (1 - smoothAlpha) * 0.4));
            data[i + 1] = Math.min(255, Math.max(0, data[i] + (data[i] - bgG) * (1 - smoothAlpha) * 0.4));
            data[i + 2] = Math.min(255, Math.max(0, data[i] + (data[i] - bgB) * (1 - smoothAlpha) * 0.4));
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setIsCutoutReady(true);
      } catch {
        setHasError(true);
      }
    };

    img.onerror = () => {
      if (!isCancelled) setHasError(true);
    };

    img.src = imageSrc;

    return () => {
      isCancelled = true;
    };
  }, [imageSrc]);

  // Subtle interactive studio lighting tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouseLight({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative flex flex-col items-center justify-end select-none pointer-events-auto group",
        className
      )}
    >
      {/* Volumetric Warm Rim Lighting */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full bg-gradient-to-tr from-amber-600/25 via-orange-500/25 to-red-600/15 blur-[80px] pointer-events-none -z-20" />

      {/* Main Character Body Stage */}
      <div className="relative flex items-center justify-center">
        {/* Dynamic Studio Key Lighting Glint */}
        <div
          className="pointer-events-none absolute -inset-6 rounded-full opacity-60 transition-opacity duration-300 -z-10"
          style={{
            background: `radial-gradient(350px circle at ${mouseLight.x}% ${mouseLight.y}%, rgba(251, 146, 60, 0.25), rgba(239, 68, 68, 0.06) 45%, transparent 70%)`,
          }}
        />

        {/* Processed High-Def Cutout Canvas */}
        <canvas
          ref={canvasRef}
          className={cn(
            "w-[260px] sm:w-[320px] md:w-[360px] h-auto object-contain transition-all duration-300 will-change-transform transform-gpu",
            "filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] drop-shadow-[0_0_25px_rgba(249,115,22,0.3)]",
            isCutoutReady && !hasError ? "block opacity-100" : "hidden"
          )}
        />

        {/* Fallback Image */}
        {(!isCutoutReady || hasError) && (
          <div className="relative w-[260px] sm:w-[320px] md:w-[360px] aspect-square flex items-center justify-center">
            <img
              src={imageSrc}
              alt="3D Chef Character"
              className="w-full h-full object-contain mix-blend-lighten filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]"
              loading="eager"
            />
          </div>
        )}
      </div>
    </div>
  );
}