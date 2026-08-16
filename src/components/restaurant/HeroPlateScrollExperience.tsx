"use client";

import React, { useEffect, useState } from "react";
import { SaharaButton } from "./SaharaButton";
import { ChevronDown, ChefHat } from "lucide-react";
import { ScrollPlateCanvas } from "./ScrollPlateCanvas";

interface HeroPlateScrollExperienceProps {
  onScrollToMenu: () => void;
}

export function HeroPlateScrollExperience({ onScrollToMenu }: HeroPlateScrollExperienceProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax calculations for floating elements
  const translateY = scrollY * 0.28;
  const scale = Math.max(0.8, 1 - scrollY * 0.0008);
  const opacity = Math.max(0, 1 - scrollY * 0.0025);
  const rotate = scrollY * 0.1;

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[92vh] flex flex-col items-center justify-between px-4 pt-12 pb-8 sm:pb-12 text-center select-none overflow-hidden [contain:layout_style]">
      {/* Hero Headline */}
      <div className="relative z-10 max-w-3xl space-y-3 mt-2">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 drop-shadow-[0_12px_30px_rgba(249,115,22,0.45)]">
          L&apos;AURA SAHARA
        </h1>
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-orange-200/80 font-serif font-semibold">
          High Gastronomy &bull; 3D Interactive Culinary Journey
        </p>
      </div>

      {/* Realistic Porcelain Plate Stage (Scroll-Scrubbed with 3D Canvas Physics) */}
      <div
        id="character-stage-container"
        className="relative z-10 my-2 flex flex-col items-center justify-center w-full max-w-2xl h-[260px] sm:h-[340px] md:h-[380px]"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 via-orange-500/20 to-amber-400/15 rounded-full blur-3xl transform scale-110 pointer-events-none" />
        <ScrollPlateCanvas className="relative z-10 w-full h-full" />
      </div>

      {/* CTA Button & Chef Hat Standing on Top Side with Sahara Floor Reflection */}
      <div className="relative z-30 flex flex-col items-center gap-5 pt-2 pb-2">
        {/* Animated Realistic Chef Hat Following Camera on Scroll */}
        <div
          className="relative flex flex-col items-center group cursor-pointer will-change-transform transition-transform duration-75 ease-out -mb-2"
          style={{
            transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
            opacity,
          }}
          onClick={onScrollToMenu}
        >
          <div className="absolute -inset-4 bg-orange-500/25 rounded-full blur-xl group-hover:bg-orange-500/40 transition-all duration-300 pointer-events-none animate-pulse" />
          <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-gradient-to-b from-white via-neutral-100 to-neutral-300 border-2 border-orange-400/60 shadow-[0_15px_35px_rgba(0,0,0,0.7),0_0_25px_rgba(249,115,22,0.55)] flex items-center justify-center text-neutral-900 transform group-hover:scale-110 transition-transform duration-300">
            <ChefHat className="w-11 h-11 sm:w-13 sm:h-13 text-neutral-950 stroke-[1.75]" />
          </div>
          <div className="w-14 h-3 bg-black/70 rounded-full blur-md mt-1.5" />
        </div>

        {/* Sahara Button with Liquid Floor Reflection */}
        <div
          className="relative drop-shadow-[0_14px_30px_rgba(0,0,0,0.9)]"
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
          className="flex items-center gap-1.5 text-[11px] sm:text-xs font-serif uppercase tracking-[0.2em] text-orange-300/80 hover:text-orange-200 transition-colors mt-2 animate-bounce cursor-pointer"
        >
          <span>Scroll down to interact</span>
          <ChevronDown className="w-4 h-4 text-orange-400" />
        </button>
      </div>
    </section>
  );
}