"use client";

import React, { useState, useEffect } from "react";
import { ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreloadScreenProps {
  onComplete: () => void;
}

export function PreloadScreen({ onComplete }: PreloadScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Fast simulated preload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 500); // Wait for fade out transition
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 20;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#e3efed] text-neutral-900 transition-opacity duration-500 select-none overflow-hidden",
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      {/* 3D Burger Shop Background Image with Light Blue & White Tint */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/burger-shop-3d.jpg"
          alt="3D Burger Shop Background"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.95] contrast-105 saturate-[0.95]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/25 via-cyan-100/15 to-white/35 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(56,189,248,0.1)_80%]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-6">
        {/* Simple Premium Chef Hat Loader Icon */}
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300 border-2 border-sky-300/60 shadow-[0_15px_35px_rgba(0,0,0,0.3),0_0_25px_rgba(56,189,248,0.4)] flex items-center justify-center text-neutral-900 animate-pulse">
          <ChefHat className="w-10 h-10 text-neutral-900 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-serif tracking-[0.3em] text-cyan-800 font-bold drop-shadow-sm">
            L&apos;Aura Sahara
          </span>
          <h2 className="text-2xl font-serif font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-600 drop-shadow-[0_4px_15px_rgba(249,115,22,0.4)]">
            Preparing Feast
          </h2>
          <p className="text-xs text-neutral-700 font-light tracking-wide">
            Loading immersive 3D gastronomy experience...
          </p>
        </div>

        {/* Minimalist Progress Bar */}
        <div className="w-48 h-1.5 bg-neutral-900/20 rounded-full overflow-hidden border border-sky-300/40">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 transition-all duration-150 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <span className="text-[11px] font-mono text-cyan-900 font-bold tracking-wider">
          {Math.min(progress, 100)}%
        </span>
      </div>
    </div>
  );
}