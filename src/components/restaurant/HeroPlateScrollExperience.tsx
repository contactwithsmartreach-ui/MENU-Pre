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

  // Parallax and smooth scale/rotate effect based on scroll position for the top floating hat
  const translateY = scrollY * 0.15;
  const scale = Math.max(0.85, 1 - scrollY * 0.0005);
  const rotate = scrollY * 0.25;

  return (
    <section className="relative w-full min-h-[75vh] sm:min-h-[85vh] flex flex-col items-center justify-between px-4 pt-10 pb-6 sm:pb-10 text-center select-none overflow-hidden [contain:layout_style]">
      {/* Floating Scroll-Following Chef Hat at the Top of the Screen */}
      <div
        className="fixed top-6 right-6 sm:right-10 z-50 flex flex-col items-center group cursor-pointer will-change-transform transition-transform duration-75 ease-out pointer-events-auto"
        style={{
          transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
        }}
        onClick={onScrollToMenu}
        title="Scroll down to explore menu"
      >
        <div className="absolute -inset-3 bg-orange-500/30 rounded-full blur-xl group-hover:bg-orange-500/50 transition-all duration-300 pointer-events-none animate-pulse" />
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300 border-2 border-orange-400/70 shadow-[0_10px_25px_rgba(0,0,0,0.5),0_0_20px_rgba(249,115,22,0.6)] flex items-center justify-center text-neutral-900 transform group-hover:scale-110 transition-transform duration-300">
          <ChefHat className="w-8 h-8 sm:w-9 sm:h-9 text-neutral-900 stroke-[1.5]" />
        </div>
      </div>

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