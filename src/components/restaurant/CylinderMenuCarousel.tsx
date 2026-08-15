"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MenuItem } from "@/types/restaurant";
import { cn } from "@/lib/utils";
import { Star, Flame, ChevronLeft, ChevronRight, Eye, Utensils, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface CylinderMenuCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MenuItem[];
  onSelectItem?: (item: MenuItem) => void;
  cardWidth?: number;
  autoDwellTime?: number; // Time each card stays front and center in ms (default 3000)
  animationDuration?: number; // Backward-compatible animation duration parameter
  autoSpinSpeed?: number; // Backward-compatible speed parameter
}

export const CylinderMenuCarousel = React.forwardRef<HTMLDivElement, CylinderMenuCarouselProps>(
  (
    {
      items,
      onSelectItem,
      className,
      cardWidth: customCardWidth,
      autoDwellTime = 3000,
      animationDuration,
      autoSpinSpeed,
      ...props
    },
    ref
  ) => {
    const N = items.length;
    const angleStep = 360 / N;

    const [rotationY, setRotationY] = useState(0);
    const [isAutoTouring, setIsAutoTouring] = useState(true);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Responsive card dimensions
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 640);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const actualCardWidth = customCardWidth ?? (isMobile ? 210 : 270);

    // Gesture & physics refs
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const startYRef = useRef(0);
    const startRotRef = useRef(0);
    const lastXRef = useRef(0);
    const lastTimeRef = useRef(0);
    const velocityRef = useRef(0);
    const hasMovedRef = useRef(false);
    const animFrameRef = useRef<number | null>(null);
    const tourTimerRef = useRef<NodeJS.Timeout | null>(null);
    const autoResumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const rotationYRef = useRef(0);

    // Keep ref in sync
    useEffect(() => {
      rotationYRef.current = rotationY;
    }, [rotationY]);

    // Smoothly glide to a specific angle
    const rotateToAngle = useCallback((targetAngle: number, duration = 650, onComplete?: () => void) => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      velocityRef.current = 0;
      setIsTransitioning(true);

      const current = rotationYRef.current;
      const diff = ((targetAngle - current + 180) % 360 + 360) % 360 - 180;
      const finalTarget = current + diff;

      const startTime = performance.now();
      const startAngle = current;

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const animateSnap = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);

        const nextVal = startAngle + (finalTarget - startAngle) * eased;
        setRotationY(nextVal);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animateSnap);
        } else {
          setRotationY(finalTarget);
          setIsTransitioning(false);
          onComplete?.();
        }
      };

      animFrameRef.current = requestAnimationFrame(animateSnap);
    }, []);

    // Bring specific dish index to the front
    const bringToFront = useCallback(
      (index: number, openModal: boolean = false, item?: MenuItem) => {
        if (tourTimerRef.current) clearTimeout(tourTimerRef.current);
        const targetAngle = -index * angleStep;
        rotateToAngle(targetAngle, 650, () => {
          if (openModal && item) {
            onSelectItem?.(item);
          }
        });
      },
      [angleStep, rotateToAngle, onSelectItem]
    );

    // Step to Next dish
    const handleNext = useCallback(() => {
      const normalizedRot = ((-rotationYRef.current % 360) + 360) % 360;
      const currentIdx = Math.round(normalizedRot / angleStep) % N;
      const nextIdx = (currentIdx + 1) % N;
      bringToFront(nextIdx, false);
    }, [angleStep, N, bringToFront]);

    // Step to Previous dish
    const handlePrev = useCallback(() => {
      const normalizedRot = ((-rotationYRef.current % 360) + 360) % 360;
      const currentIdx = Math.round(normalizedRot / angleStep) % N;
      const prevIdx = (currentIdx - 1 + N) % N;
      bringToFront(prevIdx, false);
    }, [angleStep, N, bringToFront]);

    // Keyboard Left/Right controls
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
        if (e.key === " ") {
          e.preventDefault();
          setIsAutoTouring((prev) => !prev);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handlePrev, handleNext]);

    // Auto-Tour Loop: Every `autoDwellTime` ms, smoothly advance to the next card so all get their turn upfront
    useEffect(() => {
      if (!isAutoTouring || isDraggingRef.current || hoveredIdx !== null) {
        if (tourTimerRef.current) clearTimeout(tourTimerRef.current);
        return;
      }

      tourTimerRef.current = setTimeout(() => {
        handleNext();
      }, autoDwellTime);

      return () => {
        if (tourTimerRef.current) clearTimeout(tourTimerRef.current);
      };
    }, [isAutoTouring, rotationY, hoveredIdx, autoDwellTime, handleNext]);

    // Drag & Flick handling
    const handlePointerDown = (e: React.PointerEvent) => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (tourTimerRef.current) clearTimeout(tourTimerRef.current);
      if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current);

      isDraggingRef.current = true;
      hasMovedRef.current = false;
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
      lastXRef.current = e.clientX;
      lastTimeRef.current = performance.now();
      startRotRef.current = rotationYRef.current;
      velocityRef.current = 0;

      const target = e.currentTarget as HTMLElement;
      try {
        target.setPointerCapture(e.pointerId);
      } catch {
        // Fallback
      }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - startXRef.current;
      const deltaY = e.clientY - startYRef.current;

      if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) > 5) {
        hasMovedRef.current = true;
      }

      const sensitivity = isMobile ? 0.45 : 0.38;
      const newRotation = startRotRef.current - deltaX * sensitivity;
      setRotationY(newRotation);

      const now = performance.now();
      const dt = Math.max(now - lastTimeRef.current, 8);
      const instantaneousVelocity = ((e.clientX - lastXRef.current) / dt) * 7;

      velocityRef.current = velocityRef.current * 0.3 + instantaneousVelocity * 0.7;
      lastXRef.current = e.clientX;
      lastTimeRef.current = now;
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Fallback
      }

      // Snap to nearest card
      const currentRot = rotationYRef.current;
      const normalizedRot = ((-currentRot % 360) + 360) % 360;
      let targetIdx = Math.round(normalizedRot / angleStep) % N;

      if (Math.abs(velocityRef.current) > 0.8) {
        if (velocityRef.current > 0) {
          targetIdx = (targetIdx - 1 + N) % N;
        } else {
          targetIdx = (targetIdx + 1) % N;
        }
      }

      bringToFront(targetIdx, false);

      // Resume auto showcase tour after 4s
      autoResumeTimeoutRef.current = setTimeout(() => {
        setIsAutoTouring(true);
      }, 4000);
    };

    const handleWheel = (e: React.WheelEvent) => {
      if (tourTimerRef.current) clearTimeout(tourTimerRef.current);
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      setRotationY((prev) => prev + delta * 0.1);
    };

    // Calculate active dish currently facing front
    const normalizedRot = ((-rotationY % 360) + 360) % 360;
    const activeIndex = Math.round(normalizedRot / angleStep) % N;
    const activeItem = items[activeIndex];

    const customStyle = {
      "--n": N,
      "--w": `${actualCardWidth}px`,
      "--ba": `calc(1turn / var(--n))`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        onWheel={handleWheel}
        className={cn(
          "w-full h-full min-h-[600px] sm:min-h-[680px] flex flex-col items-center justify-between relative select-none touch-none",
          className
        )}
        {...props}
      >
        {/* Left Side Arrow */}
        <button
          type="button"
          aria-label="Previous Dish"
          onClick={handlePrev}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-neutral-950/85 hover:bg-neutral-900 border border-orange-500/40 text-orange-400 hover:text-white flex items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.35)] backdrop-blur-md transition-all hover:scale-110 active:scale-90 cursor-pointer group"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Right Side Arrow */}
        <button
          type="button"
          aria-label="Next Dish"
          onClick={handleNext}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-neutral-950/85 hover:bg-neutral-900 border border-orange-500/40 text-orange-400 hover:text-white flex items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.35)] backdrop-blur-md transition-all hover:scale-110 active:scale-90 cursor-pointer group"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 3D Cylinder Stage */}
        <div
          className="w-full flex-1 grid place-items-center cursor-grab active:cursor-grabbing overflow-visible py-4 sm:py-8 touch-none"
          style={{
            perspective: isMobile ? "46em" : "62em",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className="grid place-items-center [transform-style:preserve-3d] will-change-transform"
            style={{
              ...customStyle,
              transform: `rotateY(${rotationY}deg)`,
              WebkitBoxReflect:
                "below 16px linear-gradient(to bottom, transparent 55%, rgba(249, 115, 22, 0.25) 100%)",
            }}
          >
            {items.map((dish, i) => {
              const cardAngle = ((i * angleStep + rotationY) % 360 + 360) % 360;
              const angleFromFront = Math.min(cardAngle, 360 - cardAngle);
              // Card is considered front-focused if within half a step
              const isFacingFront = angleFromFront < angleStep * 0.55;
              const isHovered = hoveredIdx === i;

              return (
                <div
                  key={dish.id}
                  onMouseEnter={() => !isMobile && setHoveredIdx(i)}
                  onMouseLeave={() => !isMobile && setHoveredIdx(null)}
                  onClick={(e) => {
                    if (hasMovedRef.current) {
                      e.preventDefault();
                      return;
                    }
                    if (isFacingFront) {
                      onSelectItem?.(dish);
                    } else {
                      bringToFront(i, false);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      bringToFront(i, true, dish);
                    }
                  }}
                  className={cn(
                    "group relative [grid-area:1/1] rounded-[26px] sm:rounded-[30px] overflow-hidden [backface-visibility:hidden] transition-all duration-500 transform-gpu cursor-pointer",
                    "border bg-neutral-950/95 backdrop-blur-xl",
                    isFacingFront
                      ? "border-orange-400 shadow-[0_20px_60px_rgba(249,115,22,0.55)] ring-2 ring-orange-500/60 scale-105 sm:scale-110 z-30 opacity-100"
                      : "border-orange-500/25 shadow-[0_10px_25px_rgba(0,0,0,0.6)] opacity-75 hover:opacity-100 hover:border-orange-400 hover:scale-102"
                  )}
                  style={{
                    width: "var(--w)",
                    aspectRatio: "7/10",
                    "--i": i,
                    transform:
                      "rotateY(calc(var(--i) * var(--ba))) translateZ(calc(-1 * (0.5 * var(--w) + 0.5em) / tan(0.5 * var(--ba))))",
                  } as React.CSSProperties}
                >
                  {/* Dish image with glow effect */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className={cn(
                        "w-full h-full object-cover transition-transform duration-700 ease-out",
                        isFacingFront ? "scale-105" : "scale-100 group-hover:scale-108"
                      )}
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-orange-500/20 to-pink-500/10 mix-blend-color-dodge" />
                  </div>

                  {/* Top Bar Badges */}
                  <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between w-full pointer-events-none">
                    {dish.isSignature ? (
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif tracking-wider uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] shadow-lg shadow-red-500/30 border-0">
                        <Flame className="w-3.5 h-3.5 fill-current mr-1 text-amber-200 animate-pulse" />
                        Signature
                      </Badge>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] font-serif uppercase tracking-widest text-orange-200 bg-neutral-950/85 px-2.5 py-0.5 sm:py-1 rounded-full backdrop-blur-md border border-orange-500/30">
                        {dish.category}
                      </span>
                    )}

                    <div className="flex items-center gap-1 bg-neutral-950/85 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-orange-500/30 text-amber-300 text-[11px] sm:text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>

                  {/* Upfront Focus Reveal CTA */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center z-20 transition-all duration-300 pointer-events-none",
                      isFacingFront
                        ? "opacity-100 scale-100"
                        : isHovered
                        ? "opacity-90 scale-95"
                        : "opacity-0 scale-90"
                    )}
                  >
                    <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white font-serif tracking-widest uppercase px-4 py-2 rounded-full text-xs font-bold shadow-xl shadow-red-600/50 border border-orange-200/50 flex items-center gap-2">
                      {isFacingFront ? <Eye className="w-4 h-4" /> : <Utensils className="w-3.5 h-3.5" />}
                      <span>{isFacingFront ? "TAP TO ORDER" : "REVEAL FRONT"}</span>
                    </span>
                  </div>

                  {/* Bottom Dish Information */}
                  <div className="absolute bottom-0 inset-x-0 z-10 p-4 sm:p-5 pt-12 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent flex flex-col justify-end pointer-events-none">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide truncate group-hover:text-orange-300 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-neutral-300/85 line-clamp-1 mt-0.5 font-light">
                      {dish.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-orange-500/20 flex items-center justify-between">
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

        {/* Showcase Tour Controls & Quick Dish Navigator */}
        <div className="relative z-30 w-full max-w-2xl px-4 py-2 flex flex-col items-center gap-2.5">
          {/* Active Front Dish Banner & Tour Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            {activeItem && (
              <button
                type="button"
                onClick={() => onSelectItem?.(activeItem)}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-950/95 border border-orange-500/50 hover:border-orange-400 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] text-left group active:scale-95"
              >
                <img
                  src={activeItem.image}
                  alt={activeItem.name}
                  className="w-8 h-8 rounded-full object-cover border border-orange-400/60"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-serif font-bold text-white group-hover:text-orange-300 transition-colors">
                    {activeItem.name}
                  </span>
                  <span className="text-[10px] text-orange-400 font-serif font-bold">
                    ${activeItem.price} • Tap to view & order
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform ml-1" />
              </button>
            )}

            {/* Auto-Tour Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsAutoTouring((prev) => !prev)}
              aria-label={isAutoTouring ? "Pause Tour" : "Resume Tour"}
              className={cn(
                "flex items-center gap-1.5 text-xs font-serif tracking-wider uppercase px-3.5 py-2 rounded-full border transition-all cursor-pointer",
                isAutoTouring
                  ? "bg-orange-950/60 border-orange-500/40 text-orange-300 hover:bg-orange-900/50"
                  : "bg-neutral-900 border-white/20 text-neutral-400 hover:text-white"
              )}
            >
              {isAutoTouring ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-orange-400" />
                  <span>Touring ({activeIndex + 1}/{N})</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume Tour</span>
                </>
              )}
            </button>
          </div>

          {/* Quick-Pick Thumbnail Strip: Click any dish to bring it upfront immediately */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full px-2.5 py-1.5 scrollbar-none bg-neutral-950/80 backdrop-blur-md rounded-full border border-orange-500/20">
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Show ${item.name}`}
                onClick={() => bringToFront(idx, false)}
                className={cn(
                  "relative rounded-full transition-all duration-300 shrink-0 overflow-hidden cursor-pointer",
                  activeIndex === idx
                    ? "w-8 h-8 ring-2 ring-orange-400 scale-110 shadow-lg shadow-orange-500/50"
                    : "w-6 h-6 opacity-50 hover:opacity-100 hover:scale-105"
                )}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

CylinderMenuCarousel.displayName = "CylinderMenuCarousel";