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

  // 3D Parallax Tilt state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [floatingY, setFloatingY] = useState(0);

  // Clean studio background removal
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

        // Sample background near borders
        const samplePoints = [
          [3, 3],
          [w - 4, 3],
          [3, h - 4],
          [w - 4, h - 4],
          [Math.floor(w / 2), 3],
        ];

        let bgR = 0;
        let bgG = 0;
        let bgB = 0;

        samplePoints.forEach(([x, y]) => {
          const idx = (y * w + x) * 4;
          bgR += data[idx];
          bgG += data[idx + 1];
          bgB += data[idx + 2];
        });

        bgR /= samplePoints.length;
        bgG /= samplePoints.length;
        bgB /= samplePoints.length;

        // Threshold background removal eliminating light halo & white shadow
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const dist = Math.sqrt(
            (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2
          );

          // Remove pure white/light grey studio background completely
          const isHighBrightness = r > 225 && g > 225 && b > 225;

          if (dist < 48 || isHighBrightness) {
            data[i + 3] = 0;
          } else if (dist < 80) {
            const factor = (dist - 48) / 32;
            data[i + 3] = Math.floor(data[i + 3] * factor);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setIsCutoutReady(true);
      } catch {
        setIsCutoutReady(false);
      }
    };

    img.src = imageSrc;

    return () => {
      isCancelled = true;
    };
  }, [imageSrc]);

  // Smooth floating hover physics
  useEffect(() => {
    let animId: number;
    const start = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - start) / 1000;
      setFloatingY(Math.sin(elapsed * 2) * 7);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 3D Parallax tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setRotateX((-y / (rect.height / 2)) * 12);
    setRotateY((x / (rect.width / 2)) * 16);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex flex-col items-center justify-center select-none [perspective:1000px] pointer-events-auto cursor-pointer",
        className
      )}
    >
      {/* 3D Floating Character Rig */}
      <div
        className="relative transition-transform duration-200 ease-out will-change-transform transform-gpu flex items-center justify-center"
        style={{
          transform: `translateY(${floatingY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Processed Cutout Canvas for the Chef */}
        <canvas
          ref={canvasRef}
          className={cn(
            "w-[280px] sm:w-[360px] md:w-[420px] h-auto object-contain transition-opacity duration-500",
            "drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)]",
            isCutoutReady ? "block opacity-100" : "hidden"
          )}
        />

        {/* Fallback image with dark masking */}
        {!isCutoutReady && (
          <div className="relative w-[280px] sm:w-[360px] md:w-[420px] aspect-square flex items-center justify-center">
            <img
              src={imageSrc}
              alt="3D Chef Character"
              className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]"
              loading="eager"
            />
          </div>
        )}
      </div>

      {/* Floating 3D Ground Shadow directly below the character */}
      <div
        className="w-44 sm:w-60 h-6 bg-black/90 rounded-full blur-xl pointer-events-none transition-transform duration-200 -mt-6"
        style={{
          transform: `scale(${1 - floatingY * 0.02})`,
        }}
      />
    </div>
  );
}