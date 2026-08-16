"use client";

import React, { useEffect, useState } from "react";
import { Flame, Sparkles, Award, Utensils, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChefScrollShowcase() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(window.scrollY / (totalHeight || 1), 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-12 px-4 sm:px-6 z-20">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-serif uppercase tracking-[0.3em] text-orange-400">
          Mastery in Motion
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-wide">
          Culinary Artistry & Craft
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
          Scroll down to watch our master kitchen execute precision techniques in real-time camera focus.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Skill Card 1 */}
        <div
          className={cn(
            "relative p-6 rounded-3xl bg-neutral-900/80 border transition-all duration-500 overflow-hidden group",
            scrollProgress > 0.15 && scrollProgress < 0.6
              ? "border-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.35)] scale-105 bg-gradient-to-br from-neutral-900 via-orange-950/20 to-neutral-900"
              : "border-orange-500/20 opacity-80 hover:opacity-100"
          )}
        >
          <div className="absolute top-0 right-0 p-4 text-orange-500/20 group-hover:text-orange-500/40 transition-colors">
            <Flame className="w-16 h-16" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-red-500/30">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-serif font-bold text-white mb-1">Binchotan Charring</h3>
          <p className="text-xs text-neutral-300 leading-relaxed font-light">
            Reaching 1,000&deg;C over Kishu white charcoal for pristine smokey depth and zero acrid taint.
          </p>
        </div>

        {/* Skill Card 2 */}
        <div
          className={cn(
            "relative p-6 rounded-3xl bg-neutral-900/80 border transition-all duration-500 overflow-hidden group",
            scrollProgress >= 0.4 && scrollProgress < 0.85
              ? "border-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.35)] scale-105 bg-gradient-to-br from-neutral-900 via-amber-950/20 to-neutral-900"
              : "border-orange-500/20 opacity-80 hover:opacity-100"
          )}
        >
          <div className="absolute top-0 right-0 p-4 text-amber-500/20 group-hover:text-amber-500/40 transition-colors">
            <Sparkles className="w-16 h-16" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-neutral-950 font-black mb-4 shadow-lg shadow-amber-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-bold text-white mb-1">Molecular Emulsion</h3>
          <p className="text-xs text-neutral-300 leading-relaxed font-light">
            Merging cold-extracted aromatic oils with micro-silk purées for velvet textures on the palate.
          </p>
        </div>

        {/* Skill Card 3 */}
        <div
          className={cn(
            "relative p-6 rounded-3xl bg-neutral-900/80 border transition-all duration-500 overflow-hidden group",
            scrollProgress >= 0.7
              ? "border-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.35)] scale-105 bg-gradient-to-br from-neutral-900 via-red-950/20 to-neutral-900"
              : "border-orange-500/20 opacity-80 hover:opacity-100"
          )}
        >
          <div className="absolute top-0 right-0 p-4 text-red-500/20 group-hover:text-red-500/40 transition-colors">
            <Award className="w-16 h-16" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-pink-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-pink-500/30">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-bold text-white mb-1">A5 Grand Cru Sourcing</h3>
          <p className="text-xs text-neutral-300 leading-relaxed font-light">
            Direct allocation from Miyazaki prefecture & sustainable Hokkaido deep-sea fisheries.
          </p>
        </div>
      </div>
    </div>
  );
}