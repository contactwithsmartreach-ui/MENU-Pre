"use client";

import React, { useState } from "react";
import { MenuItem } from "@/types/restaurant";
import { cn } from "@/lib/utils";
import { Star, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface CylinderMenuCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MenuItem[];
  onSelectItem?: (item: MenuItem) => void;
  animationDuration?: number;
  cardWidth?: number;
}

export const CylinderMenuCarousel = React.forwardRef<HTMLDivElement, CylinderMenuCarouselProps>(
  (
    {
      items,
      onSelectItem,
      className,
      animationDuration = 32,
      cardWidth = 260,
      ...props
    },
    ref
  ) => {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const N = items.length;

    const customStyle = {
      "--n": N,
      "--w": `${cardWidth}px`,
      "--ba": `calc(1turn / var(--n))`,
      "--anim-dur": `${animationDuration}s`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn(
          "w-full h-full min-h-[600px] grid place-items-center overflow-visible select-none",
          className
        )}
        style={{
          perspective: "45em",
          maskImage: "linear-gradient(90deg, transparent 0%, #000 12% 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 12% 88%, transparent 100%)",
        }}
        {...props}
      >
        <div
          className="grid place-items-center [transform-style:preserve-3d] cursor-pointer transition-[animation-play-state]"
          style={{
            ...customStyle,
            animation: "ry var(--anim-dur) linear infinite",
            animationPlayState: hoveredIdx !== null ? "paused" : "running",
          }}
        >
          <style>
            {`
              @keyframes ry {
                to { transform: rotateY(1turn); }
              }
            `}
          </style>

          {items.map((dish, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <div
                key={dish.id}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => onSelectItem?.(dish)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onSelectItem?.(dish);
                  }
                }}
                className={cn(
                  "group relative [grid-area:1/1] rounded-3xl overflow-hidden [backface-visibility:hidden] transition-all duration-300 transform-gpu",
                  "border border-amber-500/25 bg-neutral-900/90 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-md",
                  "hover:border-amber-400 hover:shadow-[0_20px_50px_rgba(245,158,11,0.3)] hover:scale-105"
                )}
                style={{
                  width: "var(--w)",
                  aspectRatio: "7/10",
                  "--i": i,
                  transform:
                    "rotateY(calc(var(--i) * var(--ba))) translateZ(calc(-1 * (0.5 * var(--w) + 0.6em) / tan(0.5 * var(--ba))))",
                } as React.CSSProperties}
              >
                {/* Dish image background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
                  <div className="absolute inset-0 bg-amber-950/20 mix-blend-color-dodge pointer-events-none" />
                </div>

                {/* Badges / Top Bar */}
                <div className="relative z-10 p-4 flex items-center justify-between w-full">
                  {dish.isSignature ? (
                    <Badge className="bg-amber-500 text-neutral-950 hover:bg-amber-400 font-semibold px-2.5 py-0.5 rounded-full text-xs shadow-md border-0">
                      <Sparkles className="w-3 h-3 fill-current mr-1" />
                      Chef Pick
                    </Badge>
                  ) : (
                    <span className="text-[11px] font-medium uppercase tracking-wider text-amber-300/90 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                      {dish.category}
                    </span>
                  )}

                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-amber-300 text-xs font-semibold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{dish.rating}</span>
                  </div>
                </div>

                {/* Center Hover prompt */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-200 pointer-events-none",
                    isHovered ? "opacity-100" : "opacity-0"
                  )}
                >
                  <span className="bg-neutral-900/90 text-amber-200 border border-amber-500/40 px-3.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-md shadow-lg">
                    Click to view dish
                  </span>
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-0 inset-x-0 z-10 p-4 pt-10 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent flex flex-col justify-end">
                  <h3 className="text-base font-bold text-white tracking-wide truncate group-hover:text-amber-300 transition-colors">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-neutral-300/90 line-clamp-1 mt-0.5">
                    {dish.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-amber-400 font-serif">$</span>
                      <span className="text-xl font-extrabold text-white font-serif tracking-tight">
                        {dish.price}
                      </span>
                    </div>

                    <span className="text-xs text-neutral-400">
                      {dish.prepTime}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CylinderMenuCarousel.displayName = "CylinderMenuCarousel";