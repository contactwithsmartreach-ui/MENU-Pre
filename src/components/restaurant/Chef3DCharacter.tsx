"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Chef3DCharacterProps {
  className?: string;
  onClick?: () => void;
}

export function Chef3DCharacter({ className, onClick }: Chef3DCharacterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/images/chef-character.png";

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const w = img.naturalWidth;
      const h = img.naturalHeight;
      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // 1. Sample outer border corners to dynamically establish background color profile
      const cornerSamples: [number, number, number][] = [];
      const samplePoints = [
        [4, 4],
        [w - 5, 4],
        [4, h - 5],
        [w - 5, h - 5],
        [Math.floor(w / 2), 4],
        [4, Math.floor(h / 2)],
        [w - 5, Math.floor(h / 2)],
      ];

      for (const [sx, sy] of samplePoints) {
        const idx = (sy * w + sx) * 4;
        cornerSamples.push([data[idx], data[idx + 1], data[idx + 2]]);
      }

      // Calculate mean background color
      const bgR = cornerSamples.reduce((s, c) => s + c[0], 0) / cornerSamples.length;
      const bgG = cornerSamples.reduce((s, c) => s + c[1], 0) / cornerSamples.length;
      const bgB = cornerSamples.reduce((s, c) => s + c[2], 0) / cornerSamples.length;

      // 2. Strict Flood Fill from perimeter only
      const visited = new Uint8Array(w * h);
      const queue = new Int32Array(w * h);
      let head = 0;
      let tail = 0;

      // Color distance helper
      const colorDist = (r: number, g: number, b: number) => {
        const dr = r - bgR;
        const dg = g - bgG;
        const db = b - bgB;
        return Math.sqrt(dr * dr + dg * dg + db * db);
      };

      // Determine if a pixel belongs to outer background
      // Safe threshold: background has low chroma and is close to sampled studio background
      const isBackground = (pIdx: number) => {
        const idx = pIdx * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        const dist = colorDist(r, g, b);

        // Check if neutral background tone (low saturation & matching background brightness)
        const maxVal = Math.max(r, g, b);
        const minVal = Math.min(r, g, b);
        const saturation = maxVal === 0 ? 0 : (maxVal - minVal) / maxVal;

        // If high saturation (skin, hair, gold, colored ingredients/utensils), it's definitely the character!
        if (saturation > 0.18) return false;

        // If distance from background color is small and saturation is low, it's the backdrop
        return dist < 38;
      };

      // Seed all 4 outer edges of image
      for (let x = 0; x < w; x++) {
        queue[tail++] = x; // Top row
        queue[tail++] = (h - 1) * w + x; // Bottom row
      }
      for (let y = 1; y < h - 1; y++) {
        queue[tail++] = y * w; // Left col
        queue[tail++] = y * w + (w - 1); // Right col
      }

      // BFS flood fill starting strictly from boundary
      while (head < tail) {
        const p = queue[head++];
        if (visited[p]) continue;
        visited[p] = 1;

        if (isBackground(p)) {
          // Transparent
          data[p * 4 + 3] = 0;

          const cx = p % w;
          const cy = Math.floor(p / w);

          if (cx > 0 && !visited[p - 1]) queue[tail++] = p - 1;
          if (cx < w - 1 && !visited[p + 1]) queue[tail++] = p + 1;
          if (cy > 0 && !visited[p - w]) queue[tail++] = p - w;
          if (cy < h - 1 && !visited[p + w]) queue[tail++] = p + w;
        }
      }

      // 3. Remove any rectangular bounding frame borders / border artifacts along the edges
      const edgeMargin = Math.max(4, Math.floor(Math.min(w, h) * 0.015));
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (x < edgeMargin || x >= w - edgeMargin || y < edgeMargin || y >= h - edgeMargin) {
            const p = y * w + x;
            const idx = p * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            // Clear thin border frame lines if close to frame colors or low saturation
            if (colorDist(r, g, b) < 65 || (Math.max(r, g, b) - Math.min(r, g, b) < 25)) {
              data[idx + 3] = 0;
            }
          }
        }
      }

      // 4. Smooth Alpha Feathering along extracted character edges
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const p = y * w + x;
          const idx = p * 4;
          if (data[idx + 3] > 0) {
            // Check neighbor transparency count
            const topA = data[(p - w) * 4 + 3];
            const btmA = data[(p + w) * 4 + 3];
            const lftA = data[(p - 1) * 4 + 3];
            const rgtA = data[(p + 1) * 4 + 3];

            if (topA === 0 || btmA === 0 || lftA === 0 || rgtA === 0) {
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];
              if (colorDist(r, g, b) < 45) {
                data[idx + 3] = Math.floor(data[idx + 3] * 0.65);
              }
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setIsProcessed(true);
    };
  }, []);

  // 3D Parallax tracking on cursor movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-end select-none cursor-pointer group",
        className
      )}
    >
      {/* 3D Character Parallax Wrapper */}
      <div
        className="relative z-20 flex items-center justify-center transition-transform duration-300 ease-out will-change-transform transform-gpu"
        style={{
          transform: `perspective(1100px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg) translateY(${mousePos.y * 0.4}px)`,
        }}
      >
        {/* Sahara Fire & Ember Rim Backlight Glow */}
        <div className="absolute -inset-8 bg-gradient-to-t from-red-600/35 via-orange-500/30 to-amber-400/25 blur-3xl rounded-full opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Clean Processed 3D Character Canvas */}
        <canvas
          ref={canvasRef}
          className={cn(
            "w-80 sm:w-[440px] md:w-[500px] lg:w-[540px] max-w-[92vw] h-auto object-contain transition-all duration-500 ease-out drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] group-hover:scale-[1.03]",
            !isProcessed && "opacity-0",
            isProcessed && "opacity-100 animate-in fade-in zoom-in-95 duration-500"
          )}
        />

        {/* Fallback image */}
        {!isProcessed && (
          <img
            src="/images/chef-character.png"
            alt="3D Master Chef Character"
            className="w-80 sm:w-[440px] md:w-[500px] lg:w-[540px] max-w-[92vw] h-auto object-contain opacity-30 blur-sm"
          />
        )}
      </div>

      {/* Realistic Ground Contact Shadows */}
      <div className="relative -mt-8 sm:-mt-10 z-10 flex flex-col items-center pointer-events-none">
        {/* Foot contact shadow */}
        <div className="w-44 sm:w-60 h-5 sm:h-6 bg-black/95 rounded-full blur-md" />
        {/* Soft radial ground shadow casting onto the button */}
        <div
          className="w-64 sm:w-84 h-8 sm:h-10 bg-black/75 rounded-full blur-xl -mt-3 transition-transform duration-300"
          style={{
            transform: `scale(${1 + Math.abs(mousePos.x) * 0.02})`,
          }}
        />
      </div>
    </div>
  );
}