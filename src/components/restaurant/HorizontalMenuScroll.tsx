"use client";

import React, { useRef, useState, useEffect } from "react";
import { MenuItem } from "@/types/restaurant";
import { cn } from "@/lib/utils";
import { Star, Flame, ChevronLeft, ChevronRight, Plus, Eye, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HorizontalMenuScrollProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  className?: string;
}

export function HorizontalMenuScroll({
  items,
  onSelectItem,
  className,
}: HorizontalMenuScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollability();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScrollability, { passive: true });
      window.addEventListener("resize", checkScrollability);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 300;
    const offset = direction === "left" ? -cardWidth * 1.5 : cardWidth * 1.5;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  // Convert vertical mouse wheel into horizontal scroll when hovering the runway
  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollContainerRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollContainerRef.current.scrollLeft += e.deltaY * 0.9;
    }
  };

  return (
    <div className={cn("relative w-full py-4", className)}>
      {/* Left Navigation Glow Button */}
      <button
        type="button"
        aria-label="Scroll menu left"
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className={cn(
          "absolute -left-2 sm:left-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300",
          "bg-neutral-950/90 backdrop-blur-xl border border-orange-500/40 text-orange-200 shadow-[0_0_25px_rgba(249,115,22,0.4)]",
          canScrollLeft
            ? "hover:scale-110 hover:border-orange-400 hover:text-white hover:shadow-[0_0_35px_rgba(249,115,22,0.8)] cursor-pointer opacity-100"
            : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Right Navigation Glow Button */}
      <button
        type="button"
        aria-label="Scroll menu right"
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className={cn(
          "absolute -right-2 sm:right-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300",
          "bg-neutral-950/90 backdrop-blur-xl border border-orange-500/40 text-orange-200 shadow-[0_0_25px_rgba(249,115,22,0.4)]",
          canScrollRight
            ? "hover:scale-110 hover:border-orange-400 hover:text-white hover:shadow-[0_0_35px_rgba(249,115,22,0.8)] cursor-pointer opacity-100"
            : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Horizontal Cards Runway */}
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-6 px-4 sm:px-12 snap-x snap-mandatory scroll-smooth"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {items.map((dish) => {
          const isHovered = hoveredId === dish.id;

          return (
            <div
              key={dish.id}
              onClick={() => onSelectItem(dish)}
              onMouseEnter={() => setHoveredId(dish.id)}
              onMouseLeave={() => setHoveredId(null)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectItem(dish)}
              className={cn(
                "group relative shrink-0 w-[240px] sm:w-[280px] aspect-[7/10] rounded-[26px] overflow-hidden transition-all duration-300 cursor-pointer snap-center",
                "bg-neutral-950/90 backdrop-blur-xl border border-orange-500/30",
                "shadow-[0_15px_35px_rgba(0,0,0,0.8)]",
                isHovered
                  ? "scale-[1.03] border-orange-400 shadow-[0_20px_50px_rgba(249,115,22,0.45)] ring-2 ring-orange-500/40 -translate-y-1.5"
                  : "hover:border-orange-400/80"
              )}
            >
              {/* Dish Image Background */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-orange-500/20 to-amber-500/15 mix-blend-color-dodge" />
              </div>

              {/* Top Tags Bar */}
              <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between w-full pointer-events-none">
                {dish.isSignature ? (
                  <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif tracking-wider uppercase px-2.5 py-0.5 rounded-full text-[10px] shadow-lg shadow-red-500/30 border-0">
                    <Flame className="w-3.5 h-3.5 fill-current mr-1 text-amber-200 animate-pulse" />
                    Sahara Signature
                  </Badge>
                ) : (
                  <span className="text-[10px] sm:text-[11px] font-serif uppercase tracking-widest text-orange-200 bg-neutral-950/80 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-orange-500/30">
                    {dish.category}
                  </span>
                )}

                <div className="flex items-center gap-1 bg-neutral-950/85 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-orange-500/30 text-amber-300 text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{dish.rating}</span>
                </div>
              </div>

              {/* Hover Quick Action Beacon */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center z-20 transition-all duration-200 pointer-events-none",
                  isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
                )}
              >
                <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white font-serif tracking-widest uppercase px-4 py-2 rounded-full text-xs font-bold shadow-xl shadow-red-600/60 border border-orange-200/50 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>VIEW & ORDER</span>
                </span>
              </div>

              {/* Bottom Dish Information */}
              <div className="absolute bottom-0 inset-x-0 z-10 p-4 sm:p-5 pt-8 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent flex flex-col justify-end pointer-events-none">
                <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide truncate group-hover:text-orange-300 transition-colors">
                  {dish.name}
                </h3>
                <p className="text-xs text-neutral-300/85 line-clamp-2 mt-0.5 font-light leading-snug">
                  {dish.description}
                </p>

                <div className="mt-3 pt-2.5 border-t border-orange-500/25 flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-serif text-orange-400 font-bold">$</span>
                    <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-serif tracking-tight">
                      {dish.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-orange-200/70 font-mono">
                      {dish.prepTime}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center text-orange-300 group-hover:bg-orange-500 group-hover:text-neutral-950 transition-colors">
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}