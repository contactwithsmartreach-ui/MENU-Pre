"use client";

import React from "react";
import { SaharaButton } from "./SaharaButton";
import { Chef3DCharacter } from "./Chef3DCharacter";
import { ChevronDown } from "lucide-react";

interface HeroPlateScrollExperienceProps {
  onScrollToMenu: () => void;
}

export function HeroPlateScrollExperience({ onScrollToMenu }: HeroPlateScrollExperienceProps) {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-between px-4 pt-6 sm:pt-10 pb-8 text-center select-none overflow-hidden [contain:layout_style]">
      {/* Hero Headline */}
      <div className="relative z-10 max-w-3xl space-y-2 mt-2">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black tracking-[0.16em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 drop-shadow-[0_10px_25px_rgba(249,115,22,0.3)]">
          L&apos;AURA SAHARA
        </h1>
      </div>

      {/* Hero Centerpiece: Very Large 3D Chef Character standing on the button */}
      <div className="relative z-20 flex flex-col items-center justify-center my-0 sm:-my-2">
        {/* 3D Character with precise edge preservation and border removal */}
        <Chef3DCharacter
          onClick={onScrollToMenu}
          className="-mb-3 sm:-mb-6"
        />

        {/* CTA Button as the Pedestal with Realistic Ground Reflection */}
        <div
          className="relative z-30 drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
          style={{
            WebkitBoxReflect:
              "below 8px linear-gradient(to bottom, transparent 40%, rgba(249, 115, 22, 0.45) 100%)",
          }}
        >
          <SaharaButton
            onClick={onScrollToMenu}
            primaryText="EXPLORE MENU"
            hoverText="TASTE THE SAHARA"
            size="xl"
          />
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-30 flex flex-col items-center gap-1 pt-4">
        <button
          type="button"
          onClick={onScrollToMenu}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-serif uppercase tracking-widest text-orange-300/80 hover:text-orange-200 transition-colors animate-bounce cursor-pointer py-1"
        >
          <span>Scroll down to interact</span>
          <ChevronDown className="w-4 h-4 text-orange-400" />
        </button>
      </div>
    </section>
  );
}