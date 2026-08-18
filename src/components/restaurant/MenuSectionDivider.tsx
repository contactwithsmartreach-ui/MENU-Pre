"use client";

import React from "react";

export function MenuSectionDivider() {
  return (
    <div className="relative z-20 w-full max-w-4xl mx-auto -mt-12 sm:-mt-16 py-4 sm:py-6 px-4 flex items-center justify-center pointer-events-none">
      {/* Sleek Minimal Ember Line with Center Glowing Core */}
      <div className="w-full flex items-center justify-center">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-amber-500/80" />
        <div className="mx-3 w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.9),0_0_30px_rgba(239,68,68,0.7)] animate-pulse" />
        <div className="flex-1 h-px bg-gradient-to-r from-amber-500/80 via-orange-500/40 to-transparent" />
      </div>
    </div>
  );
}