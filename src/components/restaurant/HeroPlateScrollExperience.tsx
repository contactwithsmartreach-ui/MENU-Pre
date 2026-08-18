"use client";

import React, { useEffect, useRef } from "react";
import { SaharaButton } from "./SaharaButton";
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
    <section className="relative w-full min-h-[58vh] sm:min-h-[66vh] flex flex-col items-center justify-center px-4 pt-12 pb-8 text-center select-none overflow-hidden [contain:layout_style]">
      {/* 3D Burger Shop Background Image with White/Luminous Gradient Overlays & Faded Edges */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/burger-shop-3d.jpg"
          alt="3D Burger Shop Background"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.75] contrast-105 saturate-[0.85]"
        />
        {/* Soft luminous white/amber gradient overlay & radial vignette for faded edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0504] via-amber-50/10 to-white/30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0504]/80 via-transparent to-[#0a0504]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0504]/90 via-transparent to-[#0a0504]" />
      </div>

      {/* Hero Headline */}
      <div className="relative z-10 max-w-2xl space-y-2 mt-2">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 drop-shadow-[0_10px_25px_rgba(249,115,22,0.5)]">
          L&apos;AURA SAHARA
        </h1>
        <p className="text-xs sm:text-sm font-serif uppercase tracking-[0.3em] text-orange-200/90 drop-shadow-md">
          Haute Gastronomy Experience
        </p>
      </div>

      {/* CTA Button & Scroll-Following Chef Hat */}
      <div className="relative z-30 flex flex-col items-center gap-6 pt-6 pb-4">
        {/* Hardware-accelerated Scrolling Chef Hat */}
        <div
          ref={hatRef}
          className="relative flex flex-col items-center group cursor-pointer will-change-transform transform-gpu"
          onClick={onScrollToMenu}
        >
          <div className="absolute -inset-3 bg-orange-500/20 rounded-full blur-lg group-hover:bg-orange-500/35 transition-opacity duration-300 pointer-events-none" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300 border-2 border-orange-400/50 shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(249,115,22,0.5)] flex items-center justify-center text-neutral-900 transform group-hover:scale-105 transition-transform duration-200">
            <ChefHat className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-900 stroke-[1.5]" />
          </div>
          <div className="w-10 h-2.5 bg-black/60 rounded-full blur-sm mt-1" />
        </div>

        {/* Exact Sahara Button Component */}
        <div className="relative pt-1 pb-4">
          <SaharaButton
            onClick={onScrollToMenu}
            primaryText="WELCOME"
            hoverText="SAHARA"
            size="lg"
          />
        </div>

        <button
          type="button"
          onClick={onScrollToMenu}
          className="flex items-center gap-1 text-[11px] font-serif uppercase tracking-widest text-orange-300 hover:text-orange-200 transition-colors mt-2 animate-bounce cursor-pointer drop-shadow-md"
        >
          <span>Explore Cylinder Menu</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}