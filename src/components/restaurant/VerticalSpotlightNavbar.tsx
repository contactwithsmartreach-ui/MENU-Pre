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
    { label: "All Items", id: "All" },
    { label: "Chef Specials", id: "Chef Specials" },
    { label: "Starters", id: "Starters" },
    { label: "Mains", id: "Mains" },
    { label: "Desserts", id: "Desserts" },
    { label: "Cocktails", id: "Cocktails" },
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
        "relative flex flex-col items-center lg:items-start select-none py-4 px-2",
        className
      )}
    >
      {/* Background Soft Glow centered behind the active element */}
      <div
        className="pointer-events-none absolute left-0 w-44 h-44 -translate-x-8 bg-gradient-to-r from-red-600/30 via-orange-500/35 to-amber-400/25 rounded-full blur-3xl transition-all duration-500 ease-out"
        style={{
          transform: `translateY(${activeIndex * 48 - 20}px)`,
        }}
      />

      {/* Pure Floating Typography List */}
      <ul
        ref={listRef}
        className="relative flex flex-col items-center lg:items-start gap-2.5 sm:gap-3.5 z-10 [perspective:1000px]"
      >
        {items.map((item, idx) => {
          const distance = Math.abs(activeIndex - idx);
          const isActive = activeIndex === idx;

          // Clear, legible depth scaling with elevated visibility
          let scale = 1;
          let opacity = 1;
          let translateZ = 0;

          if (isActive) {
            scale = 1.18;
            opacity = 1;
            translateZ = 20;
          } else if (distance === 1) {
            scale = 0.96;
            opacity = 0.75;
            translateZ = -15;
          } else if (distance === 2) {
            scale = 0.88;
            opacity = 0.55;
            translateZ = -35;
          } else {
            scale = 0.82;
            opacity = 0.42;
            translateZ = -55;
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
                  "group relative py-1 px-3 text-left transition-all duration-300 cursor-pointer focus:outline-none flex items-center gap-3",
                  "hover:!opacity-100 hover:scale-105"
                )}
              >
                {/* Leading Ember Indicator */}
                {isActive ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-500 to-amber-300 shadow-[0_0_14px_rgba(249,115,22,1),0_0_24px_rgba(239,68,68,0.9)] shrink-0 animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400/50 shadow-[0_0_8px_rgba(249,115,22,0.4)] group-hover:bg-amber-300 group-hover:shadow-[0_0_12px_rgba(251,191,36,0.9)] transition-all shrink-0" />
                )}

                {/* Course Label with Enhanced Luminance */}
                <span
                  className={cn(
                    "font-serif tracking-widest uppercase transition-all duration-300 truncate",
                    isActive
                      ? "text-base sm:text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-amber-200 drop-shadow-[0_0_22px_rgba(249,115,22,0.85)]"
                      : "text-xs sm:text-sm font-semibold text-orange-200/80 drop-shadow-[0_0_10px_rgba(249,115,22,0.25)] group-hover:text-amber-200 group-hover:drop-shadow-[0_0_16px_rgba(249,115,22,0.7)]"
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