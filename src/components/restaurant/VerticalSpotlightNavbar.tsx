"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href?: string;
  id?: string;
  icon?: React.ReactNode;
}

export interface VerticalSpotlightNavbarProps {
  items?: NavItem[];
  className?: string;
  onItemClick?: (item: NavItem, index: number) => void;
  defaultActiveIndex?: number;
  activeIndex?: number;
}

export function VerticalSpotlightNavbar({
  items = [
    { label: "Pizza", id: "Pizza" },
    { label: "Burgers", id: "Burgers" },
    { label: "Tacos", id: "Tacos" },
    { label: "Plates", id: "Plates" },
  ],
  className,
  onItemClick,
  defaultActiveIndex = 0,
  activeIndex: controlledActiveIndex,
}: VerticalSpotlightNavbarProps) {
  const [internalActiveIndex, setInternalActiveIndex] = React.useState(defaultActiveIndex);
  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;
  const listRef = useRef<HTMLUListElement>(null);

  const handleItemClick = (item: NavItem, index: number) => {
    if (controlledActiveIndex === undefined) {
      setInternalActiveIndex(index);
    }
    onItemClick?.(item, index);
  };

  // Allow mouse wheel scrolling across categories for fast transitions
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 20) {
      if (e.deltaY > 0 && activeIndex < items.length - 1) {
        handleItemClick(items[activeIndex + 1], activeIndex + 1);
      } else if (e.deltaY < 0 && activeIndex > 0) {
        handleItemClick(items[activeIndex - 1], activeIndex - 1);
      }
    }
  };

  return (
    <div
      onWheel={handleWheel}
      className={cn(
        "relative flex flex-col items-center lg:items-start select-none py-2 px-1 sm:px-3 z-30",
        className
      )}
    >
      {/* Background Radiant Glow centered behind the active element */}
      <div
        className="pointer-events-none absolute left-0 w-60 h-60 -translate-x-10 bg-gradient-to-r from-red-600/35 via-orange-500/40 to-amber-400/30 rounded-full blur-3xl transition-all duration-500 ease-out"
        style={{
          transform: `translateY(${activeIndex * 60 - 30}px)`,
        }}
      />

      {/* Pure Floating Typography List - Larger & Closer to the Cylinder */}
      <ul
        ref={listRef}
        className="relative flex flex-col items-center lg:items-start gap-3 sm:gap-5 z-10 [perspective:1200px]"
      >
        {items.map((item, idx) => {
          const distance = Math.abs(activeIndex - idx);
          const isActive = activeIndex === idx;

          // Clear, bold depth scaling with elevated visibility
          let scale = 1;
          let opacity = 1;
          let translateZ = 0;

          if (isActive) {
            scale = 1.22;
            opacity = 1;
            translateZ = 25;
          } else if (distance === 1) {
            scale = 0.98;
            opacity = 0.8;
            translateZ = -10;
          } else if (distance === 2) {
            scale = 0.9;
            opacity = 0.6;
            translateZ = -30;
          } else {
            scale = 0.84;
            opacity = 0.45;
            translateZ = -45;
          }

          return (
            <li
              key={idx}
              className="relative flex items-center transition-transform duration-300 ease-out will-change-transform"
              style={{
                transform: `scale(${scale}) translateZ(${translateZ}px)`,
              }}
            >
              <button
                type="button"
                onClick={() => handleItemClick(item, idx)}
                style={{
                  opacity,
                }}
                className={cn(
                  "group relative py-1.5 px-3 sm:px-4 text-left transition-all duration-300 cursor-pointer focus:outline-none flex items-center gap-3 sm:gap-4",
                  "hover:!opacity-100 hover:scale-105 active:scale-95"
                )}
              >
                {/* Leading Radiant Ember Beacon */}
                {isActive ? (
                  <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-red-500 to-amber-300 shadow-[0_0_18px_rgba(249,115,22,1),0_0_30px_rgba(239,68,68,0.9)] shrink-0 animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-orange-400/50 shadow-[0_0_10px_rgba(249,115,22,0.4)] group-hover:bg-amber-300 group-hover:shadow-[0_0_16px_rgba(251,191,36,0.9)] transition-all shrink-0" />
                )}

                {/* Bold Large Course Label */}
                <span
                  className={cn(
                    "font-serif tracking-widest uppercase transition-all duration-300 whitespace-nowrap",
                    isActive
                      ? "text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-amber-200 drop-shadow-[0_0_25px_rgba(249,115,22,0.85)]"
                      : "text-base sm:text-lg md:text-xl font-bold text-orange-200/85 drop-shadow-[0_0_10px_rgba(249,115,22,0.2)] group-hover:text-amber-200 group-hover:drop-shadow-[0_0_20px_rgba(249,115,22,0.7)]"
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}