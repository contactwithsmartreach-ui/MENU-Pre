"use client";

import React, { useEffect, useState } from "react";
import { SaharaButton } from "./SaharaButton";
import { ChevronDown, ChefHat, ChevronRight } from "lucide-react";

interface HeroPlateScrollExperienceProps {
  onScrollToMenu: () => void;
  onOpenOrder: () => void;
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

  const translateY = scrollY * 0.35;
  const scale = Math.max(0.75, 1 - scrollY * 0.001);
  const opacity = Math.max(0, 1 - scrollY * 0.003);
  const rotate = scrollY * 0.15;

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-between px-5 sm:px-8 md:px-12 pt-28 sm:pt-32 pb-12 md:pb-16 text-white">
      {/* Top row */}
      <div className="flex flex-col gap-8 sm:flex-row justify-between items-start">
        {/* Left service list */}
        <div className="flex flex-col gap-2">
          {["/ AI AUTOMATION", "/ AI INTEGRATION", "/ AI AGENT DEVELOPMENT"].map((item, i) => (
            <span
              key={i}
              className="font-mono text-xs uppercase tracking-[0.15em] text-white/90 drop-shadow-md transition-all duration-700 hover:text-white"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Right intro */}
        <p className="max-w-xs sm:text-right text-lg sm:text-xl leading-relaxed text-white drop-shadow-md">
          We design automation that brings clarity, precision, and efficiency to the way your company operates.
        </p>
      </div>

      {/* Center stage with realistic static chef hat */}
      <div className="relative z-10 my-4 flex flex-col items-center justify-center">
        <div
          className="relative flex flex-col items-center group cursor-pointer will-change-transform transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
            opacity,
          }}
          onClick={onScrollToMenu}
        >
          <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/35 transition-all duration-300 pointer-events-none animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300 border-2 border-orange-400/50 shadow-[0_20px_45px_rgba(0,0,0,0.7),0_0_30px_rgba(249,115,22,0.6)] flex items-center justify-center text-neutral-900 transform group-hover:scale-110 transition-transform duration-300">
            <ChefHat className="w-14 h-14 sm:w-16 sm:h-16 text-neutral-900 stroke-[1.5]" />
          </div>
          <div className="w-16 h-3.5 bg-black/60 rounded-full blur-md mt-2" />
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex flex-col gap-8 md:flex-row items-end justify-between">
        {/* Left headline & badge */}
        <div className="space-y-4">
          <div className="inline-flex items-center border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md rounded-r-lg font-mono text-[11px] uppercase tracking-[0.15em] text-white">
            We Automate 100+ Businesses
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg font-sans">
            Clear. Precise. <br />
            Automated.
          </h1>
        </div>

        {/* Right glass contact card */}
        <div className="flex items-center gap-4 rounded-xl bg-white/15 p-3 backdrop-blur-md border border-white/20 shadow-2xl">
          <img
            src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260728_050334_5b076e26-0ce7-4898-b432-d764190e448f.png&w=1280&q=85"
            alt="Mitha, co-founder of NovaAI"
            className="h-24 w-20 rounded-lg object-cover shadow-md"
          />
          <div className="flex flex-col gap-1.5 pr-2">
            <span className="text-sm font-medium text-white">Talk with Mitha</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">
              Co-founder of NovaAI
            </span>
            <button
              type="button"
              onClick={onScrollToMenu}
              className="mt-1.5 rounded-full bg-white px-4 py-2 text-xs font-medium text-black hover:bg-white/85 transition-colors flex items-center gap-1.5 shadow-md cursor-pointer w-fit"
            >
              <span>Book 15-mins call</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Down Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={onScrollToMenu}
          className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors animate-bounce cursor-pointer"
        >
          <span>Scroll down</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}