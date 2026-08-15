"use client";

import React, { useState } from "react";
import { MenuItem } from "@/types/restaurant";
import { cn } from "@/lib/utils";
import { Star, Sparkles, Flame } from "lucide-react";
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
      cardWidth = 270,
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
          "w-full h-full min-h-[640px] grid place-items-center overflow-visible select-none py-8",
          className
        )}
        style={{
          perspective: "52em",
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 10% 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 10% 90%, transparent 100%)",
        }}
        {...props}
      >
        <div
          className="grid place-items-center [transform-style:preserve-3d] cursor-pointer transition-[animation-play-state]"
          style={{
            ...customStyle,
            animation: "ry var(--anim-dur) linear infinite",
            animationPlayState: hoveredIdx !== null ? "paused" : "running",
            WebkitBoxReflect:
              "below 24px linear-gradient(to bottom, transparent 40%, rgba(249, 115, 22, 0.25) 100%)",
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
                  "group relative [grid-area:1/1] rounded-[28px] overflow-hidden [backface-visibility:hidden] transition-all duration-500 transform-gpu",
                  "border border-orange-500/30 bg-neutral-950/90 shadow-[0_15px_40px_rgba(239,68,68,0.2)] backdrop-blur-xl",
                  "hover:border-orange-400 hover:shadow-[0_20px_50px_rgba(249,115,22,0.45)] hover:scale-105 hover:saturate-[1.2] active:saturate-[1.4]"
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
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
                    loading="lazy"
                  />
                  {/* Sahara Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-orange-500/20 to-pink-500/10 mix-blend-color-dodge pointer-events-none" />
                </div>

                {/* Badges / Top Bar */}
                <div className="relative z-10 p-4 flex items-center justify-between w-full">
                  {dish.isSignature ? (
                    <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif tracking-wider uppercase hover:from-red-600 hover:to-orange-600 px-3 py-1 rounded-full text-[11px] shadow-lg shadow-red-500/30 border-0">
                      <Flame className="w-3.5 h-3.5 fill-current mr-1 text-amber-200 animate-pulse" />
                      Sahara Pick
                    </Badge>
                  ) : (
                    <span className="text-[11px] font-serif uppercase tracking-widest text-orange-200 bg-neutral-950/75 px-3 py-1 rounded-full backdrop-blur-md border border-orange-500/30 shadow-md">
                      {dish.category}
                    </span>
                  )}

                  <div className="flex items-center gap-1.5 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-orange-500/30 text-amber-300 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{dish.rating}</span>
                  </div>
                </div>

                {/* Center Hover prompt with Sahara Wave Button Vibe */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center z-20 transition-all duration-300 pointer-events-none",
                    isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  )}
                >
                  <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white font-serif tracking-widest uppercase px-4 py-2 rounded-full text-xs font-bold shadow-xl shadow-red-600/40 border border-orange-200/40 backdrop-blur-md">
                    Taste Experience
                  </span>
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-0 inset-x-0 z-10 p-5 pt-12 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent flex flex-col justify-end">
                  <h3 className="text-base font-serif font-bold text-white tracking-wide truncate group-hover:text-orange-300 transition-colors">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-neutral-300/85 line-clamp-1 mt-0.5 font-light">
                    {dish.description}
                  </p>

                  <div className="mt-3.5 pt-2.5 border-t border-orange-500/20 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-serif text-orange-400 font-bold">$</span>
                      <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-serif tracking-tight">
                        {dish.price}
                      </span>
                    </div>

                    <span className="text-xs text-orange-200/70 font-mono tracking-wider">
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