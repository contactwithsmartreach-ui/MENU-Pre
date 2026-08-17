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
      {/* Background Soft Frosted Aura */}
      <div
        className="pointer-events-none absolute left-0 w-56 h-56 -translate-x-10 bg-gradient-to-r from-orange-200/50 via-amber-200/60 to-rose-100/40 rounded-full blur-3xl transition-all duration-500 ease-out"
        style={{
          transform: `translateY(${activeIndex * 60 - 30}px)`,
        }}
      />

      {/* Pure Floating Glassmorphic Typography List */}
      <ul
        ref={listRef}
        className="relative flex flex-col items-center lg:items-start gap-3 sm:gap-5 z-10 [perspective:1200px]"
      >
        {items.map((item, idx) => {
          const distance = Math.abs(activeIndex - idx);
          const isActive = activeIndex === idx;

          let scale = 1;
          let opacity = 1;
          let translateZ = 0;

          if (isActive) {
            scale = 1.2;
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
                {/* Leading Glass Pearl Bead */}
                {isActive ? (
                  <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-red-500 to-amber-500 shadow-[0_0_12px_rgba(249,115,22,0.8)] shrink-0 animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-amber-400 group-hover:shadow-[0_0_10px_rgba(251,191,36,0.8)] transition-all shrink-0" />
                )}

                {/* Bold Large Course Label */}
                <span
                  className={cn(
                    "font-serif tracking-widest uppercase transition-all duration-300 whitespace-nowrap",
                    isActive
                      ? "text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-950 via-amber-900 to-neutral-900 drop-shadow-sm"
                      : "text-base sm:text-lg md:text-xl font-bold text-neutral-600 group-hover:text-amber-800"
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