"use client";

import React, { useEffect, useState } from "react";
import { SaharaButton } from "./SaharaButton";
import { ChevronDown, UtensilsCrossed } from "lucide-react";

interface HeroPlateScrollExperienceProps {
  onScrollToMenu: () => void;
}

export function HeroPlateScrollExperience({ onScrollToMenu }: HeroPlateScrollExperienceProps) {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(800);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    const handleResize = () => {
      setWindowHeight(window.innerHeight || 800);
    };

    handleResize();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Calculate scroll progress between 0 (top hero) and 1 (cylinder menu)
  const progress = Math.min(Math.max(scrollY / (windowHeight * 0.85), 0), 1);

  // Dynamic transforms based on scroll progress
  const translateY = progress * 140;
  const scale = 1 - progress * 0.18;
  const rotateDeg = progress * 75;
  const tiltX = (1 - progress) * 12;

  return (
    <section className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col items-center justify-between px-4 pt-12 pb-8 sm:pb-12 text-center select-none overflow-hidden">
      {/* Hero Headline & Story */}
      <div className="relative z-10 max-w-2xl space-y-3 mt-2">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 drop-shadow-[0_10px_35px_rgba(249,115,22,0.35)]">
          L&apos;AURA SAHARA
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-light max-w-lg mx-auto leading-relaxed">
          Where desert embers ignite culinary mastery. Experience our rotating
          3D cylinder gastronomy theater.
        </p>
      </div>

      {/* Floating Realistic Culinary Plate Stage */}
      <div className="relative z-10 my-4 sm:my-6 flex flex-col items-center justify-center">
        {/* Steam Animation Elements */}
        <div className="absolute -top-12 z-30 pointer-events-none opacity-60 flex gap-4">
          <div className="w-10 h-24 bg-gradient-to-t from-orange-200/30 to-transparent rounded-full blur-xl animate-pulse duration-1000 transform -rotate-12" />
          <div className="w-8 h-28 bg-gradient-to-t from-amber-100/40 to-transparent rounded-full blur-xl animate-pulse duration-700 delay-300" />
          <div className="w-12 h-20 bg-gradient-to-t from-orange-300/30 to-transparent rounded-full blur-xl animate-pulse duration-1000 delay-500 transform rotate-12" />
        </div>

        {/* Outer Radiant Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-orange-500/25 to-amber-400/20 rounded-full blur-2xl transform scale-110 pointer-events-none animate-pulse" />

        {/* 3D Moving Plate Container */}
        <div
          style={{
            transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotateDeg}deg) rotateX(${tiltX}deg)`,
            transition: "transform 0.1s ease-out",
          }}
          className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full p-3 sm:p-4 bg-gradient-to-b from-amber-500/20 via-neutral-900/90 to-black border-2 border-orange-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(249,115,22,0.3)] cursor-pointer group"
          onClick={onScrollToMenu}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onScrollToMenu()}
        >
          {/* Ceramic Dish Rim Layer */}
          <div className="w-full h-full rounded-full p-2 sm:p-3 bg-[#120a08] border border-orange-400/30 shadow-inner flex items-center justify-center overflow-hidden relative">
            {/* Cinematic Looping Gourmet Dish Video & Image Showcase */}
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-full scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                poster="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop"
              >
                <source
                  src="https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-gourmet-dish-being-prepared-43093-large.mp4"
                  type="video/mp4"
                />
              </video>

              {/* Gold leaf shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 via-transparent to-amber-300/20 mix-blend-overlay pointer-events-none" />

              {/* Glossy Plate Reflection */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/60 pointer-events-none rounded-full" />
            </div>

            {/* Center Floating Tag on Plate */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
              <span className="bg-neutral-950/85 backdrop-blur-md border border-orange-400/40 px-3 py-1 rounded-full text-[10px] sm:text-xs font-serif uppercase tracking-widest text-orange-200 shadow-lg flex items-center gap-1.5">
                <UtensilsCrossed className="w-3 h-3 text-orange-400" />
                Chef&apos;s Signature
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Floor Shadow beneath Plate */}
        <div
          style={{
            transform: `scale(${1 - progress * 0.4})`,
            opacity: Math.max(0.2, 0.8 - progress),
          }}
          className="w-48 sm:w-64 h-6 bg-black/80 rounded-full blur-xl mt-3 transition-transform"
        />
      </div>

      {/* CTA Button & Scroll Indicator */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <SaharaButton
          onClick={onScrollToMenu}
          primaryText="ENTER CYLINDER MENU"
          hoverText="TASTE THE SAHARA"
          size="md"
        />

        <button
          type="button"
          onClick={onScrollToMenu}
          className="flex items-center gap-1 text-[11px] font-serif uppercase tracking-widest text-orange-300/70 hover:text-orange-200 transition-colors mt-1 animate-bounce"
        >
          <span>Scroll down to interact</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}