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

      {/* 3D Chef Character Interactive Slot */}
      <div className="relative z-10 my-0 flex flex-col items-center justify-center w-full max-w-lg -mb-10 sm:-mb-14">
        <Chef3DCharacter />
      </div>

      {/* Explore Menu CTA Button & Scroll Indicator with Floor Reflection */}
      <div className="relative z-30 flex flex-col items-center gap-5 pt-0 pb-2">
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
          className="flex items-center gap-1 text-[11px] sm:text-xs font-serif uppercase tracking-widest text-orange-300/75 hover:text-orange-200 transition-colors mt-1 animate-bounce cursor-pointer"
        >
          <span>Scroll down to interact</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}