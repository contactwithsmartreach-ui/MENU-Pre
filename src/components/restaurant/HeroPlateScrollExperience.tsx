"use client";

import React, { useEffect, useState } from "react";
import { SaharaButton } from "./SaharaButton";
import { ChevronDown, ChefHat } from "lucide-react";

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

  const translateY = scrollY * 0.35;
  const scale = Math.max(0.75, 1 - scrollY * 0.001);
  const opacity = Math.max(0, 1 - scrollY * 0.003);
  const rotate = scrollY * 0.15;

  return (
    <section className="relative w-full min-h-[75vh] sm:min-h-[85vh] flex flex-col items-center justify-between px-4 pt-12 pb-6 sm:pb-10 text-center select-none overflow-hidden [contain:layout_style]">
      {/* Hero Headline */}
      <div className="relative z-10 max-w-2xl space-y-2 mt-2">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 drop-shadow-[0_4px_15px_rgba(249,115,22,0.18)]">
          L&apos;AURA SAHARA
        </h1>
        <p className="text-xs sm:text-sm font-serif uppercase tracking-[0.3em] text-neutral-500 font-medium">
          Haute Gastronomy &bull; 3D Interactive Dining
        </p>
      </div>

      {/* Glassmorphic Radial Light Core */}
      <div
        id="character-stage-container"
        className="relative z-10 my-4 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[220px] w-full max-w-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/40 via-orange-100/40 to-rose-200/30 rounded-full blur-3xl transform scale-110 pointer-events-none" />
      </div>

      {/* CTA Button & Glass Reflective Chef Hat */}
      <div className="relative z-30 flex flex-col items-center gap-6 pt-2 pb-2">
        {/* Animated Scrolling Chef Hat */}
        <div
          className="relative flex flex-col items-center group cursor-pointer will-change-transform transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
            opacity,
          }}
          onClick={onScrollToMenu}
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 to-amber-300/30 rounded-full blur-xl group-hover:opacity-100 transition-all duration-300 pointer-events-none animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/80 backdrop-blur-2xl border-2 border-white shadow-[0_15px_35px_rgba(0,0,0,0.08),inset_0_2px_4px_rgba(255,255,255,1)] flex items-center justify-center text-neutral-800 transform group-hover:scale-110 transition-transform duration-300">
            <ChefHat className="w-12 h-12 sm:w-14 sm:h-14 text-neutral-800 stroke-[1.5]" />
          </div>
          {/* Glass Podium Shadow */}
          <div className="w-14 h-3 bg-neutral-900/10 rounded-full blur-md mt-1.5" />
        </div>

        {/* Sahara Button with Glass Floor Reflection */}
        <div
          className="relative"
          style={{
            WebkitBoxReflect:
              "below 8px linear-gradient(to bottom, transparent 40%, rgba(255, 255, 255, 0.6) 100%)",
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
          className="flex items-center gap-1 text-[11px] sm:text-xs font-serif uppercase tracking-widest text-neutral-600 hover:text-neutral-900 transition-colors mt-2 animate-bounce cursor-pointer"
        >
          <span>Scroll down to interact</span>
          <ChevronDown className="w-4 h-4 text-amber-600" />
        </button>
      </div>
    </section>
  );
}