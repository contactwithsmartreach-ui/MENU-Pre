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
      style={{
        WebkitBoxReflect:
          "below 2px linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.35))",
      }}
      className={cn(
        "group relative overflow-hidden rounded-full cursor-pointer z-10 select-none",
        "bg-gradient-to-r from-red-500 via-orange-500 to-amber-500",
        "shadow-xl shadow-red-600/30 hover:shadow-2xl hover:shadow-red-500/60",
        "uppercase font-serif tracking-[0.25em] text-transparent transition-all duration-300",
        "after:absolute after:rounded-full after:bg-red-100/90 after:h-[84%] after:w-[96%] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:transition-all",
        "hover:saturate-[1.25] active:saturate-[1.5] active:scale-95",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* Ghost text for layout sizing */}
      <span className="opacity-0">{primaryText}</span>

      {/* Primary Slide-Out Text */}
      <p className="absolute inset-0 z-40 flex items-center justify-center font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent transition-all duration-300 group-hover:-translate-y-full tracking-[0.25em]">
        {primaryText}
      </p>

      {/* Hover Slide-In Text */}
      <p className="absolute inset-0 z-40 flex items-center justify-center font-black bg-gradient-to-r from-red-700 via-rose-700 to-orange-700 bg-clip-text text-transparent translate-y-full transition-all duration-300 group-hover:translate-y-0 tracking-[0.28em]">
        {hoverText}
      </p>

      {/* Dynamic Dune Topography SVG Waves */}
      <svg
        className="absolute w-full h-full scale-x-125 rotate-180 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-pulse group-hover:animate-none group-hover:-translate-y-[45%] transition-all duration-500 opacity-80"
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
            opacity="0.08"
            transform="matrix(1,0,0,1,0,35)"
            d="M 0 305 Q 227 450 600 302 Q 1010 450 1200 343 Q 1379 450 1800 320 Q 2153 450 2400 314 L 2400 800 L 0 800 Z"
          />
          <path
            opacity="0.25"
            transform="matrix(1,0,0,1,0,105)"
            d="M 0 305 Q 227 450 600 302 Q 1010 450 1200 343 Q 1379 450 1800 320 Q 2153 450 2400 314 L 2400 800 L 0 800 Z"
          />
          <path
            opacity="0.55"
            transform="matrix(1,0,0,1,0,175)"
            d="M 0 305 Q 227 450 600 302 Q 1010 450 1200 343 Q 1379 450 1800 320 Q 2153 450 2400 314 L 2400 800 L 0 800 Z"
          />
          <path
            opacity="0.85"
            transform="matrix(1,0,0,1,0,245)"
            d="M 0 305 Q 227 450 600 302 Q 1010 450 1200 343 Q 1379 450 1800 320 Q 2153 450 2400 314 L 2400 800 L 0 800 Z"
          />
        </g>
      </svg>

      {/* Front Crest Wave */}
      <svg
        className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-[28%] group-hover:-translate-y-[33%] group-hover:scale-95 transition-all duration-500 z-30 fill-red-500/90"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,288L9.2,250.7C18.5,213,37,139,55,133.3C73.8,128,92,192,111,224C129.2,256,148,256,166,256C184.6,256,203,256,222,250.7C240,245,258,235,277,213.3C295.4,192,314,160,332,170.7C350.8,181,369,235,388,229.3C406.2,224,425,160,443,122.7C461.5,85,480,75,498,74.7C516.9,75,535,85,554,101.3C572.3,117,591,139,609,170.7C627.7,203,646,245,665,256C683.1,267,702,245,720,245.3C738.5,245,757,267,775,266.7C793.8,267,812,245,831,234.7C849.2,224,868,224,886,218.7C904.6,213,923,203,942,170.7C960,139,978,85,997,53.3C1015.4,21,1034,11,1052,48C1070.8,85,1089,171,1108,197.3C1126.2,224,1145,192,1163,197.3C1181.5,203,1200,245,1218,224C1236.9,203,1255,117,1274,106.7C1292.3,96,1311,160,1329,170.7C1347.7,181,1366,139,1385,128C1403.1,117,1422,139,1431,149.3L1440,160L1440,320L0,320Z"
          fillOpacity="1"
        />
      </svg>
    </button>
  );
}