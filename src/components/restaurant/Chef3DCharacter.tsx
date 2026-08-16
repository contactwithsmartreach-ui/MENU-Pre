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
  const [isReady, setIsReady] = useState(false);

  // 3D Parallax Tilt state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [floatingY, setFloatingY] = useState(0);

  // Automated intelligent background isolation on canvas
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
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

      // Sample background color from corners
      const samplePoints = [
        [4, 4],
        [w - 5, 4],
        [4, h - 5],
        [w - 5, h - 5],
        [w / 2, 4],
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

      // Clean background removal with soft edge thresholding
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance from background
        const dist = Math.sqrt(
          (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2
        );

        if (dist < 42) {
          data[i + 3] = 0; // Transparent
        } else if (dist < 75) {
          // Soft antialiased feathered transition
          const alphaFactor = (dist - 42) / (75 - 42);
          data[i + 3] = Math.floor(data[i + 3] * alphaFactor);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setIsReady(true);
    };
  }, [imageSrc]);

  // Smooth floating animation
  useEffect(() => {
    let animId: number;
    let start = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - start) / 1000;
      setFloatingY(Math.sin(elapsed * 2) * 8);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 3D Mouse Parallax interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setRotateX((-y / (rect.height / 2)) * 14);
    setRotateY((x / (rect.width / 2)) * 18);
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
        {/* Soft Desert Ember Backlight directly contouring the chef */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-red-600/30 via-orange-500/40 to-amber-400/30 blur-2xl pointer-events-none -z-10 animate-pulse" />

        {/* Processed Cutout Canvas for the Chef & Pizza */}
        <canvas
          ref={canvasRef}
          className={cn(
            "w-[290px] sm:w-[380px] md:w-[440px] h-auto object-contain transition-all duration-700",
            "drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] drop-shadow-[0_0_25px_rgba(249,115,22,0.35)]",
            isReady ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        />
      </div>

      {/* Floating 3D Pedestal Shadow directly below the character */}
      <div
        className="w-44 sm:w-60 h-6 bg-black/85 rounded-full blur-xl pointer-events-none transition-transform duration-200 -mt-6"
        style={{
          transform: `scale(${1 - floatingY * 0.02})`,
        }}
      />
    </div>
  );
}