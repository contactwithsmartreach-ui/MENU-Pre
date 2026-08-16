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

  // Scale down from 1.4 to 0.7 and drift slightly as the user scrolls
  const scale = Math.max(0.65, 1.4 - scrollY * 0.003);
  const opacity = Math.max(0.2, 1 - scrollY * 0.002);
  const translateY = scrollY * 0.2;

  return (
    <section className="relative w-full min-h-[75vh] sm:min-h-[85vh] flex flex-col items-center justify-between px-4 pt-6 pb-6 sm:pb-10 text-center select-none overflow-hidden [contain:layout_style]">
      {/* Giant Floating Chef Hat at the Very Top of the Screen */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-transform duration-75 ease-out"
        style={{
          transform: `translateX(-50%) translateY(${translateY}px) scale(${scale})`,
          opacity,
        }}
      >
        <div className="relative flex flex-col items-center">
          <div className="absolute -inset-8 bg-gradient-to-r from-red-500/20 via-orange-500/30 to-amber-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300 border-2 border-orange-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(249,115,22,0.6)] flex items-center justify-center text-neutral-900">
            <ChefHat className="w-16 h-16 sm:w-20 sm:h-20 text-neutral-900 stroke-[1.5]" />
          </div>
          <div className="w-20 h-4 bg-black/70 rounded-full blur-lg mt-2" />
        </div>
      </div>

      {/* Hero Headline */}
      <div className="relative z-10 max-w-2xl space-y-2.5 mt-20 sm:mt-24">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 drop-shadow-[0_10px_25px_rgba(249,115,22,0.3)]">
          L&apos;AURA SAHARA
        </h1>
      </div>

      {/* Empty Stage Slot */}
      <div
        id="character-stage-container"
        className="relative z-10 my-4 flex flex-col items-center justify-center min-h-[140px] sm:min-h-[180px] w-full max-w-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600/15 via-orange-500/15 to-amber-400/10 rounded-full blur-3xl transform scale-105 pointer-events-none" />
      </div>

      {/* CTA Button & Scroll Indicator */}
      <div className="relative z-30 flex flex-col items-center gap-6 pt-2 pb-2">
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