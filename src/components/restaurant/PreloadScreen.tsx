"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreloadScreenProps {
  onComplete: () => void;
}

export function PreloadScreen({ onComplete }: PreloadScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 500);
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 15;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#e3efed] text-neutral-900 transition-opacity duration-500 select-none",
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-orange-600">
            <Sparkles className="w-4 h-4 fill-orange-600" />
            <span className="text-[10px] uppercase font-serif tracking-[0.3em]">L&apos;Aura Sahara</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900 tracking-widest uppercase">
            Preparing Feast
          </h2>
          <p className="text-xs text-neutral-600 font-light">
            Loading immersive 3D gastronomy experience...
          </p>
        </div>

        <div className="w-48 h-1.5 bg-neutral-300 rounded-full overflow-hidden border border-orange-500/30">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 transition-all duration-150 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <span className="text-[11px] font-mono text-orange-700 font-bold tracking-wider">
          {Math.min(progress, 100)}%
        </span>
      </div>
    </div>
  );
}