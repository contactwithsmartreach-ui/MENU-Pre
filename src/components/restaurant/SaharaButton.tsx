"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SaharaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primaryText?: string;
  hoverText?: string;
  size?: "sm" | "md" | "lg";
}

export function SaharaButton({
  primaryText = "EXPLORE",
  hoverText = "SAHARA",
  className,
  size = "md",
  onClick,
  ...props
}: SaharaButtonProps) {
  const sizeClasses = {
    sm: "px-6 py-2.5 text-xs",
    md: "px-10 py-3.5 text-sm",
    lg: "px-12 py-4 text-base",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-full cursor-pointer z-10 select-none will-change-transform transform-gpu",
        "bg-gradient-to-r from-red-500 via-orange-500 to-amber-500",
        "shadow-xl shadow-red-600/30 hover:shadow-2xl hover:shadow-red-500/50",
        "uppercase font-serif tracking-[0.25em] text-transparent transition-transform duration-200",
        "after:absolute after:rounded-full after:bg-red-100/90 after:h-[84%] after:w-[96%] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:transition-all",
        "active:scale-95",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* Ghost text for layout sizing */}
      <span className="opacity-0">{primaryText}</span>

      {/* Primary Slide-Out Text */}
      <p className="absolute inset-0 z-40 flex items-center justify-center font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent transition-transform duration-300 group-hover:-translate-y-full tracking-[0.25em]">
        {primaryText}
      </p>

      {/* Hover Slide-In Text */}
      <p className="absolute inset-0 z-40 flex items-center justify-center font-black bg-gradient-to-r from-red-700 via-rose-700 to-orange-700 bg-clip-text text-transparent translate-y-full transition-transform duration-300 group-hover:translate-y-0 tracking-[0.28em]">
        {hoverText}
      </p>

      {/* Dynamic Dune Topography SVG Waves */}
      <svg
        className="absolute w-full h-full scale-x-125 rotate-180 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 opacity-70 group-hover:-translate-y-[45%] transition-transform duration-300"
        viewBox="0 0 2400 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sahara-wave-grad" y2="100%" x2="50%" y1="0%" x1="50%">
            <stop offset="0%" stopOpacity="1" stopColor="hsl(37, 99%, 67%)" />
            <stop offset="100%" stopOpacity="1" stopColor="hsl(316, 73%, 52%)" />
          </linearGradient>
        </defs>
        <g transform="matrix(1,0,0,1,0,-91.08)" fill="url(#sahara-wave-grad)">
          <path
            opacity="0.25"
            transform="matrix(1,0,0,1,0,105)"
            d="M 0 305 Q 227 450 600 302 Q 1010 450 1200 343 Q 1379 450 1800 320 Q 2153 450 2400 314 L 2400 800 L 0 800 Z"
          />
          <path
            opacity="0.6"
            transform="matrix(1,0,0,1,0,175)"
            d="M 0 305 Q 227 450 600 302 Q 1010 450 1200 343 Q 1379 450 1800 320 Q 2153 450 2400 314 L 2400 800 L 0 800 Z"
          />
          <path
            opacity="0.9"
            transform="matrix(1,0,0,1,0,245)"
            d="M 0 305 Q 227 450 600 302 Q 1010 450 1200 343 Q 1379 450 1800 320 Q 2153 450 2400 314 L 2400 800 L 0 800 Z"
          />
        </g>
      </svg>
    </button>
  );
}