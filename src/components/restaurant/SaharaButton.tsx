"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SaharaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primaryText?: string;
  hoverText?: string;
  size?: "sm" | "md" | "lg" | "icon";
  children?: React.ReactNode;
  icon?: React.ReactNode;
  glow?: boolean;
}

export function SaharaButton({
  primaryText,
  hoverText,
  size = "md",
  children,
  icon,
  glow = true,
  className,
  ...props
}: SaharaButtonProps) {
  const displayText = primaryText || (typeof children === "string" ? children : "");
  const hoverContent = hoverText || displayText;

  const sizeClasses = {
    sm: "px-4 py-2 text-[11px] min-h-[36px]",
    md: "px-6 py-3 text-xs sm:text-sm min-h-[44px]",
    lg: "px-8 py-3.5 text-sm sm:text-base min-h-[52px]",
    icon: "w-11 h-11 sm:w-12 sm:h-12 p-0 flex items-center justify-center min-h-[44px]",
  };

  return (
    <div className="relative group inline-flex items-center justify-center">
      {/* Outer ambient glow */}
      {glow && (
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500 animate-pulse pointer-events-none" />
      )}

      {/* Button Body matching Enter Menu button styling */}
      <button
        className={cn(
          "relative overflow-hidden rounded-full font-serif font-bold uppercase tracking-[0.18em] transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center gap-2",
          "bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white shadow-[0_4px_20px_rgba(249,115,22,0.6)]",
          "border border-amber-200/40 hover:border-amber-100/80 hover:shadow-[0_0_28px_rgba(249,115,22,0.85)]",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Shimmer light sweep */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

        {icon && <span className="relative z-10 shrink-0">{icon}</span>}

        {/* Text sliding transition if hoverText is provided */}
        {hoverText && primaryText ? (
          <span className="relative z-10 block overflow-hidden h-4 sm:h-5">
            <span className="block transform transition-transform duration-300 group-hover:-translate-y-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {primaryText}
            </span>
            <span className="block transform transition-transform duration-300 -translate-y-full group-hover:translate-y-[-100%] text-amber-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {hoverText}
            </span>
          </span>
        ) : (
          <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center gap-2">
            {children || displayText}
          </span>
        )}
      </button>
    </div>
  );
}