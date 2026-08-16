"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface Chef3DCharacterProps {
  className?: string;
  imageSrc?: string;
}

export function Chef3DCharacter({
  className,
  imageSrc = "dyad-media://media/bold-badger-bob/.dyad/media/4ed13bbf469718326bee283f8bf1bf01c834a9b55fbad911915caf745e013c1e.jpg",
}: Chef3DCharacterProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center select-none pointer-events-auto",
        className
      )}
    >
      {/* 1. Volumetric Warm Key & Rim Backlighting */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full bg-gradient-to-tr from-amber-600/30 via-orange-500/25 to-red-600/20 blur-[90px] pointer-events-none -z-20" />

      {/* Top Silhouette Rim Highlight Core */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-amber-400/20 blur-3xl pointer-events-none -z-10" />

      {/* 2. Main Character Stage */}
      <div className="relative flex items-center justify-center">
        {/* Guaranteed Browser Native Image Render */}
        <div className="relative w-[300px] sm:w-[380px] md:w-[460px] aspect-square flex items-center justify-center">
          <img
            src={imageSrc}
            alt="3D Chef Character"
            onLoad={() => setIsLoaded(true)}
            className={cn(
              "w-full h-full object-contain filter",
              "drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] drop-shadow-[0_28px_50px_rgba(0,0,0,0.85)] drop-shadow-[0_0_35px_rgba(249,115,22,0.35)] drop-shadow-[0_2px_4px_rgba(251,191,36,0.5)]",
              "transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-95"
            )}
            draggable={false}
            loading="eager"
          />
        </div>
      </div>

      {/* 3. Photorealistic Multi-Tiered Contact & Ambient Ground Shadows */}
      <div className="relative w-full flex flex-col items-center pointer-events-none -mt-8 sm:-mt-10">
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