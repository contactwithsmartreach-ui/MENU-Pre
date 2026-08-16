"use client";

import React, { useEffect, useState } from "react";
import { SaharaButton } from "./SaharaButton";
import { ChevronDown, ChefHat, Sparkles } from "lucide-react";

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

  // Scroll tracking calculations for parallax and cinematic depth
  const translateY = scrollY * 0.35;
  const textTranslateY = scrollY * 0.2;
  const scale = Math.max(0.75, 1 - scrollY * 0.001);
  const opacity = Math.max(0, 1 - scrollY * 0.003);
  const textOpacity = Math.max(0, 1 - scrollY * 0.0025);
  const rotate = scrollY * 0.15;

  return (
    <section className="relative w-full min-h-[75vh] sm:min-h-[85vh] flex flex-col items-center justify-between px-4 pt-10 pb-6 sm:pb-10 text-center select-none overflow-hidden [contain:layout_style]">
      {/* Hero Headline & Scroll-Tracking Presentation Text */}
      <div className="relative z-10 max-w-3xl space-y-3 mt-2">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 drop-shadow-[0_10px_25px_rgba(249,115,22,0.3)]">
          L&apos;AURA SAHARA
        </h1>

        <div
          className="will-change-transform transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(${textTranslateY}px)`,
            opacity: textOpacity,
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/80 border border-orange-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="text-xs sm:text-sm font-serif uppercase tracking-[0.25em] text-orange-200">
              Interactive 3D Cylinder Gastronomy Experience
            </span>
          </div>
        </div>
      </div>

      {/* Empty Stage Slot */}
      <div
        id="character-stage-container"
        className="relative z-10 my-4 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[220px] w-full max-w-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600/15 via-orange-500/15 to-amber-400/10 rounded-full blur-3xl transform scale-105 pointer-events-none" />
      </div>

      {/* CTA Button & Scroll-Following Chef Hat with Floor Reflection */}
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
          <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/35 transition-all duration-300 pointer-events-none animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300 border-2 border-orange-400/50 shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(249,115,22,0.5)] flex items-center justify-center text-neutral-900 transform group-hover:scale-110 transition-transform duration-300">
            <ChefHat className="w-12 h-12 sm:w-14 sm:h-14 text-neutral-900 stroke-[1.5]" />
          </div>
          <div className="w-12 h-3 bg-black/60 rounded-full blur-md mt-1.5" />
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