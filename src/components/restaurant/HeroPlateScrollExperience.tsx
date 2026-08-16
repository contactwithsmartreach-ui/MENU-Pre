"use client";

import React, { useEffect, useState } from "react";
import { SaharaButton } from "./SaharaButton";
import { MeltingCandleText } from "./MeltingCandleText";
import { ChevronDown, UtensilsCrossed } from "lucide-react";

interface HeroPlateScrollExperienceProps {
  onScrollToMenu: () => void;
}

export function HeroPlateScrollExperience({ onScrollToMenu }: HeroPlateScrollExperienceProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const progress = Math.min(Math.max(scrollY / 600, 0), 1);
  const translateY = progress * 80;
  const scale = 1 - progress * 0.1;
  const rotateDeg = progress * 35;

  return (
    <section className="relative w-full min-h-[80vh] sm:min-h-screen flex flex-col items-center justify-between px-4 pt-8 pb-6 sm:pb-10 text-center select-none overflow-hidden [contain:layout_style]">
      {/* Hero Headline & Melting Candle Wax Story */}
      <div className="relative z-10 max-w-2xl space-y-4 mt-2">
        <MeltingCandleText text="L'AURA SAHARA" />
        
        <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-light max-w-lg mx-auto leading-relaxed pt-2">
          Where desert embers ignite culinary mastery. Experience our rotating
          3D cylinder gastronomy theater.
        </p>
      </div>

      {/* Floating Realistic Culinary Plate Stage */}
      <div className="relative z-10 my-2 sm:my-4 flex flex-col items-center justify-center -mb-8 sm:-mb-12">
        {/* Outer Radiant Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 via-orange-500/20 to-amber-400/15 rounded-full blur-2xl transform scale-105 pointer-events-none" />

        {/* 3D Moving Plate Container */}
        <div
          style={{
            transform: `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotateDeg}deg)`,
            willChange: "transform",
          }}
          className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full p-3 sm:p-4 bg-gradient-to-b from-amber-500/20 via-neutral-900/90 to-black border-2 border-orange-500/40 shadow-2xl cursor-pointer group transform-gpu"
          onClick={onScrollToMenu}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onScrollToMenu()}
        >
          {/* Ceramic Dish Rim Layer */}
          <div className="w-full h-full rounded-full p-2 sm:p-3 bg-[#120a08] border border-orange-400/30 flex items-center justify-center overflow-hidden relative">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop"
                alt="Culinary Masterpiece"
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10 pointer-events-none rounded-full" />
            </div>

            {/* Center Floating Tag on Plate */}
            <div className="absolute top-4 inset-x-0 flex justify-center pointer-events-none">
              <span className="bg-neutral-950/90 border border-orange-400/40 px-3 py-1 rounded-full text-[10px] sm:text-xs font-serif uppercase tracking-widest text-orange-200 shadow-md flex items-center gap-1.5">
                <UtensilsCrossed className="w-3 h-3 text-orange-400" />
                Chef&apos;s Signature
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Floor Shadow */}
        <div
          style={{
            transform: `scale(${1 - progress * 0.2})`,
            opacity: Math.max(0.3, 0.7 - progress),
          }}
          className="w-48 sm:w-64 h-5 bg-black/80 rounded-full blur-lg mt-2 transition-opacity"
        />
      </div>

      {/* CTA Button & Scroll Indicator with Floor Reflection */}
      <div className="relative z-30 flex flex-col items-center gap-5 pt-2 pb-2">
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