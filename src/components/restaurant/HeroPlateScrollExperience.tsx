"use type";

import React from "react";
import { SaharaButton } from "./SaharaButton";
import { ChevronDown } from "lucide-react";

interface HeroPlateScrollExperienceProps {
  onScrollToMenu: () => void;
}

export function HeroPlateScrollExperience({ onScrollToMenu }: HeroPlateScrollExperienceProps) {
  return (
    <section className="relative w-full min-h-[75vh] sm:min-h-[85vh] flex flex-col items-center justify-between px-4 pt-10 pb-6 sm:pb-10 text-center select-none overflow-hidden [contain:layout_style]">
      {/* Hero Headline */}
      <div className="relative z-10 max-w-2xl space-y-2.5 mt-2">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 drop-shadow-[0_10px_25px_rgba(249,115,22,0.3)]">
          L&apos;AURA SAHARA
        </h1>
      </div>

      {/* Empty Stage Slot */}
      <div
        id="character-stage-container"
        className="relative z-10 my-4 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[220px] w-full max-w-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600/15 via-orange-500/15 to-amber-400/10 rounded-full blur-3xl transform scale-105 pointer-events-none" />
      </div>

      {/* CTA Button & Realistic Chef Hat with Floor Reflection */}
      <div className="relative z-30 flex flex-col items-center gap-6 pt-2 pb-2">
        {/* Ultra Realistic 3D-styled Chef Hat (Toque Blanche) */}
        <div 
          className="relative flex flex-col items-center group cursor-pointer mb-1" 
          onClick={onScrollToMenu}
          title="Explore Menu"
        >
          {/* Ambient Warm Glow */}
          <div className="absolute -inset-6 bg-gradient-to-t from-orange-500/30 via-amber-500/20 to-transparent rounded-full blur-2xl group-hover:bg-orange-500/45 transition-all duration-500 pointer-events-none" />

          {/* Hat Puff (Top pleated dome) */}
          <div className="relative w-28 sm:w-32 h-16 sm:h-20 bg-gradient-to-b from-white via-neutral-100 to-neutral-200 rounded-[50%_50%_40%_40%/60%_60%_40%_40%] shadow-[inset_0_-8px_16px_rgba(0,0,0,0.12),inset_0_4px_8px_rgba(255,255,255,0.9),0_12px_25px_rgba(0,0,0,0.4)] border border-neutral-200 flex items-center justify-center transform group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
            {/* Pleat lines for realism */}
            <div className="absolute inset-0 flex justify-around items-center px-3 opacity-30 pointer-events-none">
              <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-neutral-400 to-transparent" />
              <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-neutral-400 to-transparent" />
              <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-neutral-400 to-transparent" />
              <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-neutral-400 to-transparent" />
              <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-neutral-400 to-transparent" />
            </div>
            {/* Subtle highlight sheen */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-3 bg-white/80 rounded-full blur-[2px]" />
          </div>

          {/* Hat Band (Cylinder base) */}
          <div className="relative -mt-3 w-24 sm:w-28 h-8 sm:h-9 bg-gradient-to-r from-neutral-200 via-white to-neutral-200 rounded-lg shadow-[0_8px_20px_rgba(0,0,0,0.35),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-3px_6px_rgba(0,0,0,0.1)] border border-neutral-300 flex items-center justify-center">
            {/* Gold subtle badge accent matching Sahara theme */}
            <div className="w-6 h-1 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 opacity-80 shadow-sm" />
          </div>

          {/* Realistic Floor Shadow */}
          <div className="w-16 h-3 bg-black/70 rounded-full blur-md mt-2 group-hover:w-20 transition-all duration-300" />
        </div>

        <div
          className="relative drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
          style={{
            WebkitBoxReflect:
              "below 8px linear-gradient(to bottom, transparent 40%, rgba(249, 115, 22, 0.45) 100%)",
          }}
        >
          <SaharaButton
            onClick={onScrollToMenu}
            primaryText="EXPLORE MENU"
            hoverText="TASTE THE SAHARA"
            size="lg"
          />
        </div>

        <button
          type="button"
          onClick={onScrollToMenu}
          className="flex items-center gap-1 text-[11px] sm:text-xs font-serif uppercase tracking-widest text-orange-300/75 hover:text-orange-200 transition-colors mt-2 animate-bounce cursor-pointer"
        >
          <span>Scroll down to interact</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}