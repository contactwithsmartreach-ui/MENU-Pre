"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GradientBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  interactive?: boolean;
}

export function GradientBackground({
  children,
  className,
  ...props
}: GradientBackgroundProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-neutral-950",
        className
      )}
      {...props}
    >
      {/* Dynamic Ambient Gradient Blooms */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Deep Ruby / Sunset Ember Core */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-br from-red-600/25 via-orange-600/20 to-amber-500/10 blur-[130px] opacity-80 animate-pulse"
          style={{ animationDuration: "8s" }}
        />

        {/* Jade / Emerald Celestial Aurora Counterpart */}
        <div
          className="absolute top-[25%] -right-[15%] w-[65vw] h-[65vw] max-w-[850px] max-h-[850px] rounded-full bg-gradient-to-bl from-emerald-600/20 via-teal-500/15 to-orange-500/15 blur-[140px] opacity-75 animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "2s" }}
        />

        {/* Deep Horizon Glow */}
        <div
          className="absolute bottom-[-10%] left-[15%] w-[75vw] h-[60vw] max-w-[1000px] max-h-[750px] rounded-full bg-gradient-to-tr from-amber-600/20 via-rose-700/20 to-teal-800/15 blur-[150px] opacity-70"
        />

        {/* Radial Vignette & Depth Mask */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,2,2,0.7)_80%,rgba(2,1,1,0.95)_100%)]" />

        {/* Subtle Stardust Grain Filter */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.9) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Render children on top */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}

export default GradientBackground;