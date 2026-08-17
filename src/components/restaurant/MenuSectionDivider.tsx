"use client";

import React from "react";

export function MenuSectionDivider() {
  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto py-6 sm:py-8 px-4 flex items-center justify-center">
      {/* Sleek Minimal Glass Refraction Line with Center Pearl Core */}
      <div className="w-full flex items-center justify-center">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-orange-400/60" />
        <div className="mx-3 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)] animate-pulse" />
        <div className="flex-1 h-px bg-gradient-to-r from-orange-400/60 via-amber-400/40 to-transparent" />
      </div>
    </div>
  );
}