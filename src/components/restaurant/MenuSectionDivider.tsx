"use client";

import React from "react";

export function MenuSectionDivider() {
  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto py-6 sm:py-8 px-4 flex items-center justify-center">
      {/* Sleek Minimal Ember Line with Center Glowing Core */}
      <div className="w-full flex items-center justify-center">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-amber-500/60" />
        <div className="mx-3 w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.9),0_0_24px_rgba(239,68,68,0.6)] animate-pulse" />
        <div className="flex-1 h-px bg-gradient-to-r from-amber-500/60 via-orange-500/30 to-transparent" />
      </div>
    </div>
  );
}