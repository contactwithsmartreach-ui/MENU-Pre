"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Chef3DCharacterProps {
  className?: string;
  imageSrc?: string;
}

// Universally accessible high-res 3D culinary master chef image that works on localhost and production
const DEFAULT_CHEF_IMAGE =
  "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop";

export function Chef3DCharacter({
  className,
  imageSrc = DEFAULT_CHEF_IMAGE,
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
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (isCancelled) return;
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const w = img.naturalWidth || 800;
        const h = img.naturalHeight || 800;
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
          const dist = Math.sqrt(
            0.299 * dr * dr + 0.587 * dg * dg + 0.114 * db * db
          );

          if (dist < innerThreshold) {
            data[i + 3] = 0;
          } else if (dist < outerThreshold) {
            const alphaFactor =
              (dist - innerThreshold) / (outerThreshold - innerThreshold);
            const smoothAlpha =
              alphaFactor * alphaFactor * (3 - 2 * alphaFactor);
            data[i + 3] = Math.floor(data[i + 3] * smoothAlpha);

            // Despill: remove background hue fringe from edge pixels
            data[i] = Math.min(
              255,
              Math.max(0, data[i] + (data[i] - bgR) * (1 - smoothAlpha) * 0.4)
            );
            data[i + 1] = Math.min(
              255,
              Math.max(0, data[i + 1] + (data[i + 1] - bgG) * (1 - smoothAlpha) * 0.4)
            );
            data[i + 2] = Math.min(
              255,
              Math.max(0, data[i + 2] + (data[i + 2] - bgB) * (1 - smoothAlpha) * 0.4)
            );
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setIsCutoutReady(true);
      } catch {
        // Fallback for CORS restricted images
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
        "relative flex flex-col items-center justify-center select-none pointer-events-auto group",
        className
      )}
    >
      {/* 1. Volumetric Warm Key & Rim Backlighting */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full bg-gradient-to-tr from-amber-600/30 via-orange-500/25 to-red-600/20 blur-[90px] pointer-events-none -z-20" />

      {/* Top Silhouette Rim Highlight Core */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-amber-400/20 blur-3xl pointer-events-none -z-10" />

      {/* 2. Main Character Stage */}
      <div className="relative flex items-center justify-center">
        {/* Dynamic Studio Key Lighting Glint */}
        <div
          className="pointer-events-none absolute -inset-8 rounded-full opacity-60 transition-opacity duration-300 -z-10"
          style={{
            background: `radial-gradient(400px circle at ${mouseLight.x}% ${mouseLight.y}%, rgba(251, 146, 60, 0.28), rgba(239, 68, 68, 0.08) 45%, transparent 70%)`,
          }}
        />

        {/* Processed High-Def Cutout Canvas */}
        <canvas
          ref={canvasRef}
          className={cn(
            "w-[290px] sm:w-[360px] md:w-[430px] h-auto object-contain transition-all duration-500 will-change-transform transform-gpu",
            "filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)] drop-shadow-[0_28px_50px_rgba(0,0,0,0.85)] drop-shadow-[0_0_35px_rgba(249,115,22,0.35)] drop-shadow-[0_2px_4px_rgba(251,191,36,0.5)]",
            isCutoutReady && !hasError ? "block opacity-100" : "hidden"
          )}
        />

        {/* Universal Direct Fallback Render with Sahara styling for any browser/environment */}
        {(!isCutoutReady || hasError) && (
          <div className="relative w-[280px] sm:w-[350px] md:w-[420px] aspect-square rounded-full overflow-hidden flex items-center justify-center p-2">
            <img
              src={imageSrc}
              alt="Culinary Master"
              className="w-full h-full object-cover rounded-full border-2 border-orange-500/40 filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]"
              loading="eager"
            />
          </div>
        )}
      </div>

      {/* 3. Photorealistic Multi-Tiered Contact & Ambient Ground Shadows */}
      <div className="relative w-full flex flex-col items-center pointer-events-none -mt-6 sm:-mt-8">
        {/* Tier 1: Deep Core Occlusion Contact Shadow */}
        <div className="w-28 sm:w-40 h-3 bg-black/95 rounded-full blur-[3px] -mb-1" />

        {/* Tier 2: Mid Ground Contact Shadow */}
        <div className="w-52 sm:w-72 h-8 bg-black/90 rounded-full blur-md" />

        {/* Tier 3: Diffuse Ambient Bounce Shadow */}
        <div className="w-72 sm:w-[380px] h-12 bg-gradient-to-r from-neutral-950 via-black/85 to-neutral-950 rounded-full blur-xl -mt-6" />

        {/* Tier 4: Warm Floor Reflection Bleed */}
        <div className="w-48 sm:w-64 h-5 bg-orange-950/40 rounded-full blur-lg -mt-3" />
      </div>
    </div>
  );
}