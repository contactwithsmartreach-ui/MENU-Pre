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

  // Parallax and smooth scale/rotate effect based on scroll position
  const translateY = scrollY * 0.35;
  const scale = Math.max(0.75, 1 - scrollY * 0.001);
  const opacity = Math.max(0, 1 - scrollY * 0.003);
  const rotate = scrollY * 0.15;

  return (
    <section className="relative w-full min-h-[48vh] sm:min-h-[56vh] flex flex-col items-center justify-center px-4 pt-6 pb-2 text-center select-none overflow-hidden [contain:layout_style]">
      {/* Hero Headline */}
      <div className="relative z-10 max-w-2xl space-y-1 mt-1">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 drop-shadow-[0_10px_25px_rgba(249,115,22,0.3)]">
          L&apos;AURA SAHARA
        </h1>
        <p className="text-xs sm:text-sm font-serif uppercase tracking-[0.3em] text-orange-200/80">
          Haute Gastronomy Experience
        </p>
      </div>

      {/* CTA Button & Scroll-Following Chef Hat */}
      <div className="relative z-30 flex flex-col items-center gap-4 pt-4 pb-1">
        {/* Animated Scrolling Chef Hat */}
        <div
          className="relative flex flex-col items-center group cursor-pointer will-change-transform transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
            opacity,
          }}
          onClick={onScrollToMenu}
        >
          <div className="absolute -inset-3 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/35 transition-all duration-300 pointer-events-none animate-pulse" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300 border-2 border-orange-400/50 shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(249,115,22,0.5)] flex items-center justify-center text-neutral-900 transform group-hover:scale-110 transition-transform duration-300">
            <ChefHat className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-900 stroke-[1.5]" />
          </div>
          <div className="w-10 h-2.5 bg-black/60 rounded-full blur-md mt-1" />
        </div>

        <div
          className="relative drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
          style={{
            WebkitBoxReflect:
              "below 6px linear-gradient(to bottom, transparent 40%, rgba(249, 115, 22, 0.45) 100%)",
          }}
        >
          <SaharaButton
            onClick={onScrollToMenu}
            primaryText="EXPLORE MENU"
            hoverText="TASTE THE SAHARA"
            size="md"
          />
        </div>

        <button
          type="button"
          onClick={onScrollToMenu}
          className="flex items-center gap-1 text-[11px] font-serif uppercase tracking-widest text-orange-300/75 hover:text-orange-200 transition-colors mt-1 animate-bounce cursor-pointer"
        >
          <span>Scroll to Cylinder</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}