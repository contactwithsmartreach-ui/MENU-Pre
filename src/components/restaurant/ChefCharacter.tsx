"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ChefCharacterProps {
  className?: string;
}

export function ChefCharacter({ className }: ChefCharacterProps) {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Background removal via edge-connected flood-fill thresholding
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/images/chef-character.png";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // BFS flood-fill from border pixels to isolate the exterior studio background
        const visited = new Uint8Array(w * h);
        const queue: number[] = [];

        // Sample background reference colors from corners
        const cornerIdxs = [0, (w - 1) * 4, ((h - 1) * w) * 4, ((h - 1) * w + (w - 1)) * 4];
        let bgR = 0, bgG = 0, bgB = 0;
        cornerIdxs.forEach((idx) => {
          bgR += data[idx];
          bgG += data[idx + 1];
          bgB += data[idx + 2];
        });
        bgR /= 4;
        bgG /= 4;
        bgB /= 4;

        // Seed outer boundaries
        for (let x = 0; x < w; x++) {
          queue.push(x); // top row
          queue.push((h - 1) * w + x); // bottom row
          visited[x] = 1;
          visited[(h - 1) * w + x] = 1;
        }
        for (let y = 0; y < h; y++) {
          const leftIdx = y * w;
          const rightIdx = y * w + (w - 1);
          if (!visited[leftIdx]) {
            queue.push(leftIdx);
            visited[leftIdx] = 1;
          }
          if (!visited[rightIdx]) {
            queue.push(rightIdx);
            visited[rightIdx] = 1;
          }
        }

        // Color difference tolerance for studio vignette
        const isBackground = (r: number, g: number, b: number) => {
          const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
          // Studio background is neutral/greyish and medium-to-high brightness
          const brightness = (r + g + b) / 3;
          const isNeutral = maxDiff < 26;
          const isLight = brightness > 120;
          return isNeutral && isLight;
        };

        let head = 0;
        while (head < queue.length) {
          const current = queue[head++];
          const cx = current % w;
          const cy = Math.floor(current / w);
          const pIdx = current * 4;

          const r = data[pIdx];
          const g = data[pIdx + 1];
          const b = data[pIdx + 2];

          if (isBackground(r, g, b)) {
            data[pIdx + 3] = 0; // Set transparent

            // Explore 4 neighbors
            const neighbors = [
              cx > 0 ? current - 1 : -1,
              cx < w - 1 ? current + 1 : -1,
              cy > 0 ? current - w : -1,
              cy < h - 1 ? current + w : -1,
            ];

            for (const n of neighbors) {
              if (n >= 0 && !visited[n]) {
                visited[n] = 1;
                queue.push(n);
              }
            }
          }
        }

        // Soft anti-aliasing on boundary edges
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = (y * w + x) * 4;
            if (data[idx + 3] > 0) {
              let transparentNeighbors = 0;
              if (data[((y - 1) * w + x) * 4 + 3] === 0) transparentNeighbors++;
              if (data[((y + 1) * w + x) * 4 + 3] === 0) transparentNeighbors++;
              if (data[(y * w + (x - 1)) * 4 + 3] === 0) transparentNeighbors++;
              if (data[(y * w + (x + 1)) * 4 + 3] === 0) transparentNeighbors++;

              if (transparentNeighbors > 0) {
                data[idx + 3] = Math.round(255 * (1 - transparentNeighbors * 0.18));
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setProcessedImageUrl(canvas.toDataURL("image/png"));
        setIsLoading(false);
      } catch (err) {
        console.error("Image processing fallback", err);
        setProcessedImageUrl("/images/chef-character.png");
        setIsLoading(false);
      }
    };

    img.onerror = () => {
      setProcessedImageUrl("/images/chef-character.png");
      setIsLoading(false);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-end pointer-events-none select-none",
        className
      )}
    >
      {/* 1. Ambient Warm Pedestal Reflection Underneath */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-56 sm:w-72 h-12 bg-gradient-to-r from-red-600/30 via-orange-500/40 to-amber-400/30 rounded-full blur-xl opacity-80 animate-pulse duration-1000" />

      {/* 2. Realistic Multi-Layer Cast Floor Shadow */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-44 sm:w-60 h-7 bg-black/85 rounded-[100%] blur-md" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 sm:w-44 h-4 bg-black rounded-full blur-xs opacity-95" />

      {/* Contact Shadow Pinpoints Directly Under Shoes */}
      <div className="absolute bottom-0.5 left-[42%] -translate-x-1/2 w-10 h-3 bg-black/95 rounded-full blur-[2px]" />
      <div className="absolute bottom-1.5 left-[58%] -translate-x-1/2 w-9 h-3 bg-black/95 rounded-full blur-[2px]" />

      {/* 3. The 3D Chef Character Model Image */}
      <div className="relative z-10 w-60 sm:w-72 md:w-80 h-[330px] sm:h-[400px] md:h-[430px] flex items-end justify-center transition-transform duration-700">
        {processedImageUrl ? (
          <img
            src={processedImageUrl}
            alt="Executive Chef"
            className={cn(
              "max-w-full max-h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] transition-opacity duration-500 will-change-transform transform-gpu animate-[bounce_4s_ease-in-out_infinite]",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            style={{
              animation: "chef-breathe 4.5s ease-in-out infinite",
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes chef-breathe {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.015);
          }
        }
      `}</style>
    </div>
  );
}