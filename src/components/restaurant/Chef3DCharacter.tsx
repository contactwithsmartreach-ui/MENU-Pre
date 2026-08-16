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

  // Background isolation with safe fallback
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

        const w = img.naturalWidth || 600;
        const h = img.naturalHeight || 600;
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Sample background color from outer border samples
        const samplePoints = [
          [2, 2],
          [w - 3, 2],
          [2, h - 3],
          [w - 3, h - 3],
          [Math.floor(w / 2), 2],
        ];

        let bgR = 0,
          bgG = 0,
          bgB = 0;
        samplePoints.forEach(([x, y]) => {
          const idx = (y * w + x) * 4;
          bgR += data[idx];
          bgG += data[idx + 1];
          bgB += data[idx + 2];
        });
        bgR /= samplePoints.length;
        bgG /= samplePoints.length;
        bgB /= samplePoints.length;

        // Threshold background removal with feathering
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const dist = Math.sqrt(
            (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2
          );

          if (dist < 40) {
            data[i + 3] = 0;
          } else if (dist < 72) {
            const factor = (dist - 40) / 32;
            data[i + 3] = Math.floor(data[i + 3] * factor);
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

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col items-center justify-center select-none pointer-events-auto",
        className
      )}
    >
      {/* 3D Character Rig without floating animation */}
      <div className="relative flex items-center justify-center">
        {/* Desert Ember Backlight Aura */}
        <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-red-600/35 via-orange-500/40 to-amber-400/30 blur-2xl pointer-events-none -z-10 opacity-70" />

        {/* Processed Cutout Canvas for the Chef */}
        <canvas
          ref={canvasRef}
          className={cn(
            "w-[280px] sm:w-[360px] md:w-[420px] h-auto object-contain transition-opacity duration-500",
            "drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]",
            isCutoutReady && !hasError ? "block opacity-100" : "hidden"
          )}
        />

        {/* Fallback Direct Render if canvas pixel reading isn't supported */}
        {(!isCutoutReady || hasError) && (
          <div className="relative w-[280px] sm:w-[360px] md:w-[420px] aspect-square rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={imageSrc}
              alt="3D Chef Character"
              className="w-full h-full object-contain rounded-full mix-blend-lighten drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
              loading="eager"
            />
          </div>
        )}
      </div>

      {/* Static Floor Shadow */}
      <div className="w-44 sm:w-60 h-6 bg-black/85 rounded-full blur-xl pointer-events-none -mt-6" />
    </div>
  );
}