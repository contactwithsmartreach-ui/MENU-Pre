"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MenuItem } from "@/types/restaurant";
import { cn } from "@/lib/utils";
import { Star, Flame, ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface CylinderMenuCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MenuItem[];
  onSelectItem?: (item: MenuItem) => void;
  cardWidth?: number;
  autoSpinSpeed?: number;
  animationDuration?: number;
}

export const CylinderMenuCarousel = React.forwardRef<HTMLDivElement, CylinderMenuCarouselProps>(
  (
    {
      items,
      onSelectItem,
      className,
      cardWidth: customCardWidth,
      autoSpinSpeed,
      animationDuration,
      ...props
    },
    ref
  ) => {
    const N = items.length;
    const angleStep = 360 / N;
    const effectiveSpeed = autoSpinSpeed ?? (animationDuration ? 360 / animationDuration : 10);

    const [rotationY, setRotationY] = useState(0);
    const [isAutoSpinning, setIsAutoSpinning] = useState(true);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Dynamic responsive card width
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
    const momentumFrameRef = useRef<number | null>(null);

    // Auto-spin animation loop
    useEffect(() => {
      let previousTimestamp = performance.now();

      const spinLoop = (timestamp: number) => {
        const delta = (timestamp - previousTimestamp) / 1000;
        previousTimestamp = timestamp;

        if (
          isAutoSpinning &&
          !isDraggingRef.current &&
          hoveredIdx === null &&
          Math.abs(velocityRef.current) < 0.05
        ) {
          setRotationY((prev) => (prev + effectiveSpeed * delta) % 360);
        }

        animFrameRef.current = requestAnimationFrame(spinLoop);
      };

      animFrameRef.current = requestAnimationFrame(spinLoop);
      return () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    }, [isAutoSpinning, effectiveSpeed, hoveredIdx]);

    // Apply smooth inertia gliding on release
    const applyMomentum = useCallback(() => {
      const decay = 0.92;
      const step = () => {
        if (Math.abs(velocityRef.current) > 0.08) {
          setRotationY((prev) => prev - velocityRef.current);
          velocityRef.current *= decay;
          momentumFrameRef.current = requestAnimationFrame(step);
        } else {
          velocityRef.current = 0;
        }
      };
      if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
      momentumFrameRef.current = requestAnimationFrame(step);
    }, []);

    // Pointer events (Mobile Touch + Desktop Mouse unified)
    const handlePointerDown = (e: React.PointerEvent) => {
      if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);

      isDraggingRef.current = true;
      hasMovedRef.current = false;
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
      lastXRef.current = e.clientX;
      lastTimeRef.current = performance.now();
      startRotRef.current = rotationY;
      velocityRef.current = 0;

      const target = e.currentTarget as HTMLElement;
      try {
        target.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - startXRef.current;
      const deltaY = e.clientY - startYRef.current;

      // Check if real movement occurred
      if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) > 8) {
        hasMovedRef.current = true;
      }

      // Responsive sensitivity
      const sensitivity = isMobile ? 0.48 : 0.38;
      const newRotation = startRotRef.current - deltaX * sensitivity;
      setRotationY(newRotation);

      const now = performance.now();
      const dt = Math.max(now - lastTimeRef.current, 8);
      const instantaneousVelocity = ((e.clientX - lastXRef.current) / dt) * 7.5;

      // Smoothed velocity tracking
      velocityRef.current = velocityRef.current * 0.4 + instantaneousVelocity * 0.6;
      lastXRef.current = e.clientX;
      lastTimeRef.current = now;
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }

      if (hasMovedRef.current && Math.abs(velocityRef.current) > 0.4) {
        applyMomentum();
      }
    };

    // Wheel listener for trackpads & mice
    const handleWheel = (e: React.WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      setRotationY((prev) => prev + delta * 0.14);
    };

    // Step Navigation
    const stepNext = useCallback(() => {
      if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
      velocityRef.current = 0;
      setRotationY((prev) => prev - angleStep);
    }, [angleStep]);

    const stepPrev = useCallback(() => {
      if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
      velocityRef.current = 0;
      setRotationY((prev) => prev + angleStep);
    }, [angleStep]);

    const resetPosition = () => {
      if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
      velocityRef.current = 0;
      setRotationY(0);
    };

    // Active dish index calculated from rotation for indicator dots
    const normalizedRot = ((-rotationY % 360) + 360) % 360;
    const activeIndex = Math.round(normalizedRot / angleStep) % N;

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
          "w-full h-full min-h-[580px] sm:min-h-[640px] flex flex-col items-center justify-center relative select-none touch-none",
          className
        )}
        {...props}
      >
        {/* 3D Cylinder Stage */}
        <div
          className="w-full flex-1 grid place-items-center cursor-grab active:cursor-grabbing overflow-visible py-4 sm:py-8 touch-none"
          style={{
            perspective: isMobile ? "38em" : "54em",
            maskImage:
              "linear-gradient(90deg, transparent 0%, #000 8% 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, #000 8% 92%, transparent 100%)",
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
                "below 16px linear-gradient(to bottom, transparent 45%, rgba(249, 115, 22, 0.22) 100%)",
            }}
          >
            {items.map((dish, i) => {
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
                    onSelectItem?.(dish);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onSelectItem?.(dish);
                    }
                  }}
                  className={cn(
                    "group relative [grid-area:1/1] rounded-[24px] sm:rounded-[28px] overflow-hidden [backface-visibility:hidden] transition-all duration-300 transform-gpu",
                    "border border-orange-500/35 bg-neutral-950/95 shadow-[0_12px_35px_rgba(239,68,68,0.22)] backdrop-blur-xl",
                    "hover:border-orange-400 hover:shadow-[0_20px_50px_rgba(249,115,22,0.45)] hover:scale-105 hover:saturate-[1.2] active:scale-95 active:saturate-[1.3]"
                  )}
                  style={{
                    width: "var(--w)",
                    aspectRatio: "7/10",
                    "--i": i,
                    transform:
                      "rotateY(calc(var(--i) * var(--ba))) translateZ(calc(-1 * (0.5 * var(--w) + 0.5em) / tan(0.5 * var(--ba))))",
                  } as React.CSSProperties}
                >
                  {/* Dish image */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-orange-500/20 to-pink-500/10 mix-blend-color-dodge" />
                  </div>

                  {/* Top Bar */}
                  <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between w-full pointer-events-none">
                    {dish.isSignature ? (
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif tracking-wider uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] shadow-lg shadow-red-500/30 border-0">
                        <Flame className="w-3 h-3 fill-current mr-1 text-amber-200 animate-pulse" />
                        Sahara Pick
                      </Badge>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] font-serif uppercase tracking-widest text-orange-200 bg-neutral-950/80 px-2.5 py-0.5 sm:py-1 rounded-full backdrop-blur-md border border-orange-500/30">
                        {dish.category}
                      </span>
                    )}

                    <div className="flex items-center gap-1 bg-neutral-950/85 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-orange-500/30 text-amber-300 text-[11px] sm:text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>

                  {/* Hover / Tap Hint */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center z-20 transition-all duration-300 pointer-events-none",
                      isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    )}
                  >
                    <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white font-serif tracking-widest uppercase px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-xl shadow-red-600/40 border border-orange-200/40">
                      Tap to View
                    </span>
                  </div>

                  {/* Bottom Dish Information */}
                  <div className="absolute bottom-0 inset-x-0 z-10 p-3.5 sm:p-5 pt-10 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent flex flex-col justify-end pointer-events-none">
                    <h3 className="text-sm sm:text-base font-serif font-bold text-white tracking-wide truncate group-hover:text-orange-300 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-300/85 line-clamp-1 mt-0.5 font-light">
                      {dish.description}
                    </p>

                    <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-orange-500/20 flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[11px] sm:text-xs font-serif text-orange-400 font-bold">$</span>
                        <span className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-serif tracking-tight">
                          {dish.price}
                        </span>
                      </div>

                      <span className="text-[10px] sm:text-xs text-orange-200/70 font-mono tracking-wider">
                        {dish.prepTime}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Swipe Indicators / Quick Jump Dots */}
        <div className="relative z-30 flex items-center gap-1.5 my-2">
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Jump to ${item.name}`}
              onClick={() => {
                if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
                velocityRef.current = 0;
                setRotationY(-idx * angleStep);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                activeIndex === idx
                  ? "w-6 bg-gradient-to-r from-red-500 to-orange-400 shadow-md shadow-orange-500/50"
                  : "w-1.5 bg-orange-500/30 hover:bg-orange-500/60"
              )}
            />
          ))}
        </div>

        {/* Mobile-Friendly Tactile Control Dock */}
        <div className="relative z-30 flex items-center gap-2 sm:gap-3 bg-neutral-950/85 backdrop-blur-xl border border-orange-500/30 p-1.5 sm:p-2 px-3 sm:px-4 rounded-full shadow-[0_10px_30px_rgba(239,68,68,0.25)]">
          <button
            type="button"
            onClick={stepPrev}
            aria-label="Rotate Previous"
            className="p-2 sm:p-2.5 text-orange-300 hover:text-white hover:bg-orange-500/20 active:bg-orange-500/40 rounded-full transition-colors active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsAutoSpinning((prev) => !prev)}
            aria-label={isAutoSpinning ? "Pause Auto-Rotation" : "Start Auto-Rotation"}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-orange-500/40 text-[11px] sm:text-xs uppercase tracking-widest font-serif font-bold text-orange-200 hover:text-white active:scale-95"
          >
            {isAutoSpinning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current text-orange-400" />
                <span className="hidden xs:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-orange-400" />
                <span className="hidden xs:inline">Spin</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={stepNext}
            aria-label="Rotate Next"
            className="p-2 sm:p-2.5 text-orange-300 hover:text-white hover:bg-orange-500/20 active:bg-orange-500/40 rounded-full transition-colors active:scale-90"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="h-4 w-px bg-orange-500/30 mx-0.5 sm:mx-1" />

          <button
            type="button"
            onClick={resetPosition}
            aria-label="Reset Rotation"
            title="Reset position"
            className="p-2 text-orange-400/80 hover:text-orange-200 hover:bg-orange-500/20 active:bg-orange-500/40 rounded-full transition-colors active:scale-90"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }
);

CylinderMenuCarousel.displayName = "CylinderMenuCarousel";