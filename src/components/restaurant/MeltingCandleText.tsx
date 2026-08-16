"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MeltingCandleTextProps {
  text?: string;
  className?: string;
}

export function MeltingCandleText({
  text = "L'AURA SAHARA",
  className,
}: MeltingCandleTextProps) {
  return (
    <div className={cn("relative inline-flex flex-col items-center select-none", className)}>
      {/* SVG Gooey / Melting Distortion Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="candle-melt-filter" x="-20%" y="-20%" width="140%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.04"
              numOctaves="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="9s"
                values="0.012 0.035;0.018 0.05;0.012 0.035"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Candle wax gradient */}
          <linearGradient id="waxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="90%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
        </defs>
      </svg>

      {/* Candle Flame Flicker Glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-gradient-to-b from-amber-400/30 via-orange-500/20 to-transparent blur-2xl pointer-events-none animate-pulse" />

      {/* Main Melting Typography with Distorted Wax Texture */}
      <div className="relative group">
        {/* Deep molten under-glow */}
        <h1
          aria-hidden="true"
          className="absolute inset-0 text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-[0.18em] uppercase text-orange-500/50 blur-lg select-none"
        >
          {text}
        </h1>

        {/* Primary Heat-Melted Font with filter */}
        <h1
          style={{ filter: "url(#candle-melt-filter)" }}
          className="relative text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-orange-400 to-red-600 drop-shadow-[0_12px_24px_rgba(249,115,22,0.45)]"
        >
          {text}
        </h1>

        {/* Hanging & Dripping Liquid Candle Wax Drips */}
        <div className="absolute -bottom-5 sm:-bottom-7 inset-x-0 flex justify-around pointer-events-none px-2 overflow-visible">
          {/* Wax Drip 1 */}
          <div className="flex flex-col items-center animate-[waxDrip_3.4s_ease-in-out_infinite]">
            <span className="w-1.5 sm:w-2 h-4 sm:h-6 bg-gradient-to-b from-red-600 to-orange-500 rounded-b-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,1)] -mt-1" />
          </div>

          {/* Wax Drip 2 */}
          <div className="flex flex-col items-center animate-[waxDrip_4.2s_ease-in-out_infinite_0.8s]">
            <span className="w-1 sm:w-1.5 h-6 sm:h-9 bg-gradient-to-b from-red-600 to-amber-500 rounded-b-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-300 rounded-full shadow-[0_0_12px_rgba(251,191,36,1)] -mt-1" />
          </div>

          {/* Wax Drip 3 (Center Tear) */}
          <div className="flex flex-col items-center animate-[waxDrip_3.8s_ease-in-out_infinite_1.5s]">
            <span className="w-2 sm:w-2.5 h-7 sm:h-11 bg-gradient-to-b from-red-600 via-orange-500 to-amber-400 rounded-b-full shadow-[0_0_12px_rgba(249,115,22,0.9)]" />
            <span className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 bg-amber-300 rounded-full shadow-[0_0_14px_rgba(251,191,36,1)] -mt-1.5 animate-ping opacity-60" />
          </div>

          {/* Wax Drip 4 */}
          <div className="flex flex-col items-center animate-[waxDrip_4.6s_ease-in-out_infinite_2.1s]">
            <span className="w-1.5 sm:w-2 h-5 sm:h-8 bg-gradient-to-b from-red-600 to-orange-400 rounded-b-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,1)] -mt-1" />
          </div>

          {/* Wax Drip 5 */}
          <div className="flex flex-col items-center animate-[waxDrip_3.2s_ease-in-out_infinite_0.4s]">
            <span className="w-1 sm:w-1.5 h-4 sm:h-6 bg-gradient-to-b from-red-600 to-amber-500 rounded-b-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-300 rounded-full shadow-[0_0_10px_rgba(251,191,36,1)] -mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}