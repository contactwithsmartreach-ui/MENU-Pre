"use client";

import React from "react";
import { SaharaButton } from "./SaharaButton";
import { ChevronDown } from "lucide-react";
import { ChefCharacterStage } from "./ChefCharacterStage";

interface HeroPlateScrollExperienceProps {
  onScrollToMenu: () => void;
}

export function HeroPlateScrollExperience({ onScrollToMenu }: HeroPlateScrollExperienceProps) {
  return (
    <section className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col items-center justify-between px-4 pt-8 pb-6 sm:pb-10 text-center select-none overflow-hidden [contain:layout_style]">
      {/* Hero Headline */}
      <div className="relative z-10 max-w-2xl space-y-2 mt-2">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 drop-shadow-[0_10px_25px_rgba(249,115,22,0.35)]">
          L&apos;AURA SAHARA
        </h1>
      </div>

      {/* 3D Character Standing Directly on the Pedestal / Explore Button */}
      <div className="relative z-20 flex flex-col items-center justify-end w-full max-w-2xl -my-4 sm:-my-6">
        {/* Oversized Character */}
        <ChefCharacterStage onInteract={onScrollToMenu} />

        {/* Pedestal Explore Menu Button with Realistic Contact & Mirror Reflection */}
        <div className="relative z-30 -mt-3 sm:-mt-5 flex flex-col items-center gap-4">
          <div
            className="relative drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
            style={{
              WebkitBoxReflect:
                "below 6px linear-gradient(to bottom, transparent 45%, rgba(249, 115, 22, 0.45) 100%)",
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
      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-30 flex flex-col items-center mt-4">
        <button
          type="button"
          onClick={onScrollToMenu}
          className="flex items-center gap-1.5 text-[11px] sm:text-xs font-serif uppercase tracking-widest text-orange-300/75 hover:text-orange-200 transition-colors animate-bounce cursor-pointer"
        >
          <span>Scroll down to interact</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}