"use client";

import React from "react";
import { Sparkles, Compass } from "lucide-react";

export function MenuSectionDivider() {
  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto py-12 sm:py-16 px-4 flex flex-col items-center justify-center">
      {/* Ornamental Divider Line with Center Ember Beacon */}
      <div className="w-full flex items-center justify-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-amber-500/60" />
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-950/90 border border-orange-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-serif uppercase tracking-[0.25em] text-orange-200/90 font-bold">
            Interactive Gastronomy
          </span>
          <Compass className="w-3.5 h-3.5 text-orange-400" />
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-amber-500/60 via-orange-500/40 to-transparent" />
      </div>

      {/* Section Header Introduction */}
      <div className="text-center mt-6 space-y-1.5 max-w-xl">
        <h2 className="text-xl sm:text-3xl font-serif font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-amber-200">
          The Cylinder Experience
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
          Swipe, spin, or use the side controllers to rotate through each signature creation.
        </p>
      </div>
    </div>
  );
}