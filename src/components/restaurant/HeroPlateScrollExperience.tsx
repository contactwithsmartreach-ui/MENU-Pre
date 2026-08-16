"use client";

import React, { useEffect, useState } from "react";
import { SaharaButton } from "./SaharaButton";
import { ChevronDown, Sparkles, Flame, ChefHat } from "lucide-react";

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
  const translateY = progress * 60;
  const scale = 1 - progress * 0.08;

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-screen flex flex-col items-center justify-between px-4 pt-10 pb-8 sm:pb-12 text-center select-none overflow-hidden [contain:layout_style]">
      {/* Hero Headline */}
      <div className="relative z-10 max-w-2xl space-y-2 mt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-950/80 border border-orange-500/30 text-amber-300 text-xs font-serif uppercase tracking-widest shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Haute Gastronomy Theater</span>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-[0.16em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 drop-shadow-[0_12px_30px_rgba(249,115,22,0.35)]">
          L&apos;AURA SAHARA
        </h1>
      </div>

      {/* Main Center Stage: 3D Master Chef Character Seated Dynamically Next to the Big Sahara Button */}
      <div
        style={{
          transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
          willChange: "transform",
        }}
        className="relative z-20 w-full max-w-5xl my-auto py-6 sm:py-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14"
      >
        {/* Sahara Radiant Atmospheric Glow Behind Chef & Button */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[450px] bg-gradient-to-tr from-red-600/30 via-orange-500/35 to-amber-400/20 rounded-full blur-[140px] -z-10" />

        {/* 3D Character Master Chef Stage */}
        <div className="relative group cursor-pointer" onClick={onScrollToMenu}>
          {/* Animated Ember Flame Ring */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-red-600/40 via-orange-500/30 to-amber-400/20 blur-2xl group-hover:scale-110 transition-transform duration-500 pointer-events-none" />

          {/* 3D Chef Character Container */}
          <div className="relative w-72 h-80 sm:w-96 sm:h-[420px] md:w-[440px] md:h-[460px] flex items-center justify-center">
            {/* 3D Master Chef Character Image with Stylized 3D Shader Silhouette */}
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=900&auto=format&fit=crop"
              alt="3D Master Chef"
              className="w-full h-full object-cover object-top rounded-[40px] border-2 border-orange-500/40 shadow-[0_25px_60px_rgba(249,115,22,0.4)] group-hover:scale-105 group-hover:border-orange-400 transition-all duration-500 transform-gpu"
              loading="eager"
            />

            {/* Glowing Desert Sunset Highlight Gradients */}
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-t from-[#0a0504] via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-tr from-red-600/25 via-orange-500/20 to-amber-400/10 mix-blend-color-dodge pointer-events-none" />

            {/* Floating Chef Badge */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-neutral-950/90 backdrop-blur-xl border border-orange-500/30 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/40">
                  <ChefHat className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-serif font-bold text-white">Chef Antoine Sahara</p>
                  <p className="text-[10px] text-amber-300/80 font-mono flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                    Master Gastronomer
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-serif tracking-widest text-orange-200 bg-orange-500/20 border border-orange-400/30 px-2 py-0.5 rounded-full">
                Ready to Serve
              </span>
            </div>
          </div>

          {/* Dynamic Floor Shadow */}
          <div className="w-56 sm:w-72 h-5 bg-black/90 rounded-full blur-xl mx-auto -mt-2" />
        </div>

        {/* Explore Menu Sahara Button with Floor Reflection */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="relative drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
            style={{
              WebkitBoxReflect:
                "below 10px linear-gradient(to bottom, transparent 40%, rgba(249, 115, 22, 0.45) 100%)",
            }}
          >
            <SaharaButton
              onClick={onScrollToMenu}
              primaryText="EXPLORE MENU"
              hoverText="TASTE THE SAHARA"
              size="xl"
            />
          </div>

          <p className="text-xs font-serif tracking-widest uppercase text-orange-300/70">
            Spin &bull; Customize &bull; Order
          </p>
        </div>
      </div>

      {/* Scroll Down Prompt Indicator */}
      <div className="relative z-30 pt-2">
        <button
          type="button"
          onClick={onScrollToMenu}
          className="flex items-center gap-1.5 text-xs font-serif uppercase tracking-[0.2em] text-orange-300/80 hover:text-orange-200 transition-colors animate-bounce cursor-pointer"
        >
          <span>Scroll down to interact with 3D Menu</span>
          <ChevronDown className="w-4 h-4 text-orange-400" />
        </button>
      </div>
    </section>
  );
}