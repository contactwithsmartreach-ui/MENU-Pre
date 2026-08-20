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
    <section className="relative w-full min-h-[75vh] sm:min-h-[85vh] flex flex-col items-center justify-between px-4 pt-16 pb-16 text-center select-none overflow-hidden [contain:layout_style]">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop"
          alt="3D Burger Shop Background"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.95] contrast-105 saturate-[0.95]"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/25 via-cyan-100/15 to-white/35 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(56,189,248,0.1)_80%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#e3efed]/60 to-[#e3efed]" />
      </div>

      <div className="relative z-10 max-w-2xl space-y-3 mt-2">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 drop-shadow-[0_12px_30px_rgba(249,115,22,0.6)] pt-2">
          L&apos;AURA SAHARA
        </h1>
        <p className="text-xs sm:text-sm font-serif uppercase tracking-[0.3em] text-neutral-200 drop-shadow-md">
          Expérience de Gastronomie 3D Immersive
        </p>
      </div>

      <div className="my-auto" />

      <div className="relative z-30 flex flex-col items-center gap-4 pt-8 pb-4">
        <div
          ref={hatRef}
          className="relative flex flex-col items-center group cursor-pointer will-change-transform transform-gpu"
          onClick={onScrollToMenu}
        >
          <div className="absolute -inset-3 bg-sky-400/20 rounded-full blur-xl group-hover:bg-orange-500/35 transition-opacity duration-300 pointer-events-none" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300 border-2 border-sky-300/60 shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(56,189,248,0.4)] flex items-center justify-center text-neutral-900 transform group-hover:scale-105 transition-transform duration-200">
            <ChefHat className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-900 stroke-[1.5]" />
          </div>
          <div className="w-10 h-2.5 bg-black/60 rounded-full blur-sm mt-1" />
        </div>

        <div className="relative pt-1 pb-2">
          <SaharaButton
            onClick={onScrollToMenu}
            primaryText="BIENVENUE"
            hoverText="SAHARA"
            size="lg"
          />
        </div>

        <button
          type="button"
          onClick={onScrollToMenu}
          className="flex items-center gap-1 text-[11px] font-serif uppercase tracking-widest text-cyan-200 hover:text-white transition-colors mt-1 animate-bounce cursor-pointer drop-shadow-md"
        >
          <span>Explorer le Menu Cylindre</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}