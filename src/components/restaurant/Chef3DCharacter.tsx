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

  // Intelligent background removal via corner flood-fill preserving white chef clothes
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/images/chef-character.png";

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const w = canvas.width;
      const h = canvas.height;

      // Visited mask for flood fill from edges
      const visited = new Uint8Array(w * h);
      const queue: number[] = [];

      // Helper to check if pixel is background grayish/white vignette
      const isBgPixel = (idx: number) => {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        // Background is neutral gray (low saturation, medium-high luminance)
        return maxDiff < 28 && luminance > 115;
      };

      // Seed all 4 outer borders into the flood fill queue
      for (let x = 0; x < w; x++) {
        queue.push(x, 0);
        queue.push(x, h - 1);
      }
      for (let y = 0; y < h; y++) {
        queue.push(0, y);
        queue.push(w - 1, y);
      }

      // Flood fill to strip outside background without eroding inner white hat/jacket
      let head = 0;
      while (head < queue.length) {
        const cx = queue[head++];
        const cy = queue[head++];
        const pIdx = cy * w + cx;

        if (visited[pIdx]) continue;
        visited[pIdx] = 1;

        const dataIdx = pIdx * 4;

        if (isBgPixel(dataIdx)) {
          // Calculate distance from character edge for smooth feathering
          data[dataIdx + 3] = 0; // Transparent

          // 4-directional expansion
          if (cx > 0 && !visited[pIdx - 1]) queue.push(cx - 1, cy);
          if (cx < w - 1 && !visited[pIdx + 1]) queue.push(cx + 1, cy);
          if (cy > 0 && !visited[pIdx - w]) queue.push(cx, cy - 1);
          if (cy < h - 1 && !visited[pIdx + w]) queue.push(cx, cy + 1);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setIsProcessed(true);
    };
  }, []);

  // Subtle interactive 3D parallax tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
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
      {/* Dynamic 3D Character Stage */}
      <div
        className="relative z-20 flex items-center justify-center transition-transform duration-300 ease-out will-change-transform transform-gpu"
        style={{
          transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg) translateY(${mousePos.y * 0.5}px)`,
        }}
      >
        {/* Ambient character backlight & rim glow */}
        <div className="absolute -inset-4 bg-gradient-to-t from-red-600/30 via-orange-500/25 to-amber-400/20 blur-3xl rounded-full opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Dynamic Processed Transparent 3D Character Canvas */}
        <canvas
          ref={canvasRef}
          className={cn(
            "w-72 sm:w-96 md:w-[420px] lg:w-[480px] h-auto object-contain transition-all duration-700 ease-out drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] group-hover:scale-105",
            !isProcessed && "opacity-0",
            isProcessed && "opacity-100 animate-in fade-in zoom-in-95 duration-500"
          )}
        />

        {/* Fallback image while canvas processes */}
        {!isProcessed && (
          <img
            src="/images/chef-character.png"
            alt="3D Master Chef"
            className="w-72 sm:w-96 md:w-[420px] lg:w-[480px] h-auto object-contain opacity-40 blur-sm"
          />
        )}
      </div>

      {/* Realistic Ground Contact Shadows directly above the button */}
      <div className="relative -mt-6 sm:-mt-8 z-10 flex flex-col items-center pointer-events-none">
        {/* Footprint Contact Ambient Occlusion */}
        <div className="w-36 sm:w-52 h-4 sm:h-5 bg-black/90 rounded-full blur-md" />
        {/* Soft Radial Ground Shadow casting onto the pedestal button */}
        <div
          className="w-48 sm:w-72 h-6 sm:h-8 bg-black/70 rounded-full blur-xl -mt-2.5 transition-transform duration-300"
          style={{
            transform: `scale(${1 + Math.abs(mousePos.x) * 0.02})`,
          }}
        />
      </div>
    </div>
  );
}