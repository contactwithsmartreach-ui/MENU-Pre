"use client";

import React, { useEffect, useRef } from "react";
import { ChevronDown, ChefHat } from "lucide-react";

interface HeroPlateScrollExperienceProps {
  onScrollToMenu: () => void;
}

export function HeroPlateScrollExperience({ onScrollToMenu }: HeroPlateScrollExperienceProps) {
  const hatRef = useRef<HTMLDivElement>(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          if (hatRef.current) {
            const scrollY = window.scrollY;
            const translateY = Math.min(scrollY * 0.28, 130);
            const scale = Math.max(0.8, 1 - scrollY * 0.0008);
            const opacity = Math.max(0.15, 1 - scrollY * 0.0025);
            const rotate = (scrollY * 0.12) % 360;

            hatRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotate}deg)`;
            hatRef.current.style.opacity = `${opacity}`;
          }
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full min-h-[75vh] sm:min-h-[85vh] flex flex-col items-center justify-center px-4 pt-16 pb-32 text-center select-none overflow-hidden [contain:layout_style]">
      {/* 3D Burger Shop Background Image with Light Blue & White Tint & Smooth Bottom Fade */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/burger-shop-3d.jpg"
          alt="3D Burger Shop Background"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.95] contrast-105 saturate-[0.95]"
          loading="eager"
          fetchPriority="high"
        />
        {/* Luxurious Light Blue & Luminous White Professional Tint */}
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/25 via-cyan-100/15 to-white/35 mix-blend-overlay" />
        
        {/* Subtle radial sheen for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(56,189,248,0.1)_80%]" />

        {/* Smooth Bottom Edge Fade into Page Background (#e3efed) */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#e3efed]/60 to-[#e3efed]" />
      </div>

      {/* Hero Headline */}
      <div className="relative z-10 max-w-2xl space-y-3 mt-2">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 drop-shadow-[0_12px_30px_rgba(249,115,22,0.6)] pt-2">
          L&apos;AURA SAHARA
        </h1>
        <p className="text-xs sm:text-sm font-serif uppercase tracking-[0.3em] text-neutral-200 drop-shadow-md">
          Immersive 3D Gastronomy Experience
        </p>
      </div>

      {/* Interactive Chef Hat replacing the welcome button */}
      <div className="relative z-30 flex flex-col items-center gap-6 pt-8 pb-8">
        <div
          ref={hatRef}
          className="relative flex flex-col items-center group cursor-pointer will-change-transform transform-gpu"
          onClick={onScrollToMenu}
        >
          <div className="absolute -inset-4 bg-sky-400/30 rounded-full blur-2xl group-hover:bg-orange-500/40 transition-opacity duration-300 pointer-events-none animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300 border-2 border-orange-400/80 shadow-[0_20px_40px_rgba(0,0,0,0.7),0_0_30px_rgba(249,115,22,0.5)] flex items-center justify-center text-neutral-900 transform group-hover:scale-110 transition-transform duration-200">
            <ChefHat className="w-12 h-12 sm:w-14 sm:h-14 text-neutral-900 stroke-[1.5]" />
          </div>
          <div className="w-12 h-3 bg-black/50 rounded-full blur-sm mt-1.5" />
          <span className="mt-3 text-xs font-serif uppercase tracking-[0.25em] text-amber-200 font-bold drop-shadow-md bg-neutral-950/80 px-4 py-1.5 rounded-full border border-orange-500/40">
            Tap to Enter Kitchen
          </span>
        </div>

        <button
          type="button"
          onClick={onScrollToMenu}
          className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-widest text-cyan-100 hover:text-white transition-colors mt-1 animate-bounce cursor-pointer drop-shadow-md"
        >
          <span>Explore Cylinder Menu</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}