"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { playSoftClickSound } from "@/lib/audio";

interface SaharaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primaryText?: string;
  hoverText?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function SaharaButton({
  primaryText = "EXPLORE",
  hoverText = "SAHARA",
  className,
  size = "lg",
  onClick,
  ...props
}: SaharaButtonProps) {
  const sizeClasses = {
    sm: "px-7 py-3 text-xs tracking-[0.2em]",
    md: "px-10 py-4 text-sm sm:text-base tracking-[0.25em]",
    lg: "px-14 sm:px-16 py-5 sm:py-6 text-base sm:text-lg tracking-[0.28em]",
    xl: "px-16 sm:px-20 py-6 sm:py-7 text-lg sm:text-xl tracking-[0.3em]",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSoftClickSound();
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group relative overflow-hidden rounded-full cursor-pointer z-10 select-none will-change-transform transform-gpu",
        "bg-gradient-to-r from-red-500 via-orange-500 to-amber-500",
        "shadow-2xl shadow-red-600/40 hover:shadow-[0_0_45px_rgba(249,115,22,0.7)]",
        "uppercase font-serif font-black text-transparent transition-all duration-300",
        "after:absolute after:rounded-full after:bg-red-50/95 after:h-[86%] after:w-[97%] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:transition-all",
        "hover:scale-105 active:scale-95",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="opacity-0">{primaryText}</span>

      <p className="absolute inset-0 z-40 flex items-center justify-center font-extrabold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent transition-transform duration-300 group-hover:-translate-y-full tracking-[0.25em]">
        {primaryText}
      </p>

      <p className="absolute inset-0 z-40 flex items-center justify-center font-black bg-gradient-to-r from-red-700 via-rose-700 to-orange-700 bg-clip-text text-transparent translate-y-full transition-transform duration-300 group-hover:translate-y-0 tracking-[0.28em]">
        {hoverText}
      </p>

      <svg
        className="absolute w-full h-full scale-x-125 rotate-180 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 opacity-75 group-hover:-translate-y-[45%] transition-transform duration-300 pointer-events-none"
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