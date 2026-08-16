"use client";

import React from "react";
import { SaharaButton } from "./SaharaButton";
import { ChevronDown } from "lucide-react";
import { Chef3DCharacter } from "./Chef3DCharacter";

interface HeroPlateScrollExperienceProps {
  onScrollToMenu: () => void;
}

export function HeroPlateScrollExperience({ onScrollToMenu }: HeroPlateScrollExperienceProps) {
  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[92vh] flex flex-col items-center justify-between px-4 pt-8 pb-8 text-center select-none overflow-hidden [contain:layout_style]">
      {/* Hero Headline */}
      <div className="relative z-20 max-w-2xl space-y-2 mt-2">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 drop-shadow-[0_10px_25px_rgba(249,115,22,0.3)]">
          L&apos;AURA SAHARA
        </h1>
      </div>

      {/* Unified Character & Button Pedestal Stage */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-md my-auto">
        {/* 3D Chef Character */}
        <div className="relative z-10 -mb-7 sm:-mb-9">
          <Chef3DCharacter />
        </div>

        {/* Character's Direct Physical Contact & Ambient Shadow Cast Onto the Button */}
        <div className="relative z-20 w-full flex flex-col items-center pointer-events-none -mb-3">
          {/* Ultra-crisp Core Contact Occlusion right where feet touch the button */}
          <div className="w-28 sm:w-36 h-2 bg-neutral-950/95 rounded-full blur-[2px] shadow-[0_2px_8px_rgba(0,0,0,0.95)]" />
          {/* Soft Diffuse Shadow draped over the button surface */}
          <div className="w-44 sm:w-56 h-3 bg-neutral-950/80 rounded-full blur-md -mt-1" />
        </div>

        {/* Explore Menu Button (Acting as physical stage) with ground mirror reflection */}
        <div
          className="relative z-30 drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
          style={{
            WebkitBoxReflect:
              "below 10px linear-gradient(to bottom, transparent 35%, rgba(249, 115, 22, 0.4) 100%)",
          }}
        >
          <SaharaButton
            onClick={onScrollToMenu}
            primaryText="EXPLORE MENU"
            hoverText="TASTE THE SAHARA"
            size="lg"
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-30 flex flex-col items-center pb-2">
        <button
          type="button"
          onClick={onScrollToMenu}
          className="flex items-center gap-1 text-[11px] sm:text-xs font-serif uppercase tracking-widest text-orange-300/75 hover:text-orange-200 transition-colors animate-bounce cursor-pointer"
        >
          <span>Scroll down to interact</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}