"use client";

import React, { useEffect, useState } from "react";
import { SaharaButton } from "./SaharaButton";
import { ChevronDown, ChefHat, Sparkles, Compass } from "lucide-react";

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

  // Cinematic scroll calculations for camera tracking & flair
  const translateY = scrollY * 0.42;
  const scale = Math.max(0.7, 1 - scrollY * 0.0008);
  const opacity = Math.max(0, 1 - scrollY * 0.0025);
  const rotate = scrollY * 0.12;

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[92vh] flex flex-col items-center justify-between px-4 pt-12 pb-8 text-center select-none overflow-hidden">
      {/* Luxury Brand Subtitle */}
      <div className="relative z-10 max-w-3xl space-y-3 mt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs sm:text-sm font-serif tracking-[0.25em] uppercase mb-2 backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Cinematic Gastronomy Exhibition</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-200 drop-shadow-[0_15px_35px_rgba(249,115,22,0.35)]">
          L&apos;AURA SAHARA
        </h1>
        
        <p className="text-sm sm:text-base text-neutral-300/80 font-light tracking-wide max-w-lg mx-auto">
          Immerse your senses in our rotating 3D cylinder anthology of rare masterwork dishes & craft elixirs.
        </p>
      </div>

      {/* Cinematic Camera-Following Chef Hat Skill Stage */}
      <div className="relative z-20 my-6 flex flex-col items-center justify-center">
        <div
          className="relative flex flex-col items-center group cursor-pointer will-change-transform transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
            opacity,
          }}
          onClick={onScrollToMenu}
        >
          <div className="absolute -inset-6 bg-gradient-to-r from-red-500/20 via-orange-500/30 to-amber-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 pointer-events-none animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300 border-2 border-orange-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(249,115,22,0.6)] flex items-center justify-center text-neutral-900 transform group-hover:scale-110 transition-transform duration-300">
            <ChefHat className="w-14 h-14 sm:w-16 sm:h-16 text-neutral-900 stroke-[1.5]" />
          </div>
          <div className="w-16 h-4 bg-black/70 rounded-full blur-md mt-2" />
        </div>
      </div>

      {/* Explore Menu CTA */}
      <div className="relative z-30 flex flex-col items-center gap-5 pb-4">
        <div
          className="relative drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
          style={{
            WebkitBoxReflect:
              "below 10px linear-gradient(to bottom, transparent 40%, rgba(249, 115, 22, 0.4) 100%)",
          }}
        >
          <SaharaButton
            onClick={onScrollToMenu}
            primaryText="EXPLORE ANTHOLOGY"
            hoverText="ENTER 3D CYLINDER"
            size="lg"
          />
        </div>

        <button
          type="button"
          onClick={onScrollToMenu}
          className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-[0.25em] text-orange-300/80 hover:text-white transition-colors mt-1 animate-bounce cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-orange-400 animate-spin" style={{ animationDuration: "10s" }} />
          <span>Scroll to rotate cylinder experience</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}