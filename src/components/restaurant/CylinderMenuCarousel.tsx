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
  autoSpinSpeed?: number; // degrees per second
  animationDuration?: number; // duration in seconds for a full 360 rotation
}

export const CylinderMenuCarousel = React.forwardRef<HTMLDivElement, CylinderMenuCarouselProps>(
  (
    {
      items,
      onSelectItem,
      className,
      cardWidth = 270,
      autoSpinSpeed,
      animationDuration,
      ...props
    },
    ref
  ) => {
    const N = items.length;
    const angleStep = 360 / N;

    // Determine speed in deg/s (fallback to animationDuration if passed)
    const effectiveSpeed = autoSpinSpeed ?? (animationDuration ? 360 / animationDuration : 12);

    const [rotationY, setRotationY] = useState(0);
    const [isAutoSpinning, setIsAutoSpinning] = useState(true);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const startRotRef = useRef(0);
    const hasDraggedRef = useRef(false);
    const lastXRef = useRef(0);
    const velocityRef = useRef(0);
    const reqAnimRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);

    // Auto-spin animation frame loop
    useEffect(() => {
      const updateFrame = (time: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = time;
        const delta = (time - lastTimeRef.current) / 1000;
        lastTimeRef.current = time;

        if (isAutoSpinning && !isDraggingRef.current && hoveredIdx === null) {
          setRotationY((prev) => (prev + effectiveSpeed * delta) % 360);
        }

        reqAnimRef.current = requestAnimationFrame(updateFrame);
      };

      reqAnimRef.current = requestAnimationFrame(updateFrame);
      return () => {
        if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
      };
    }, [isAutoSpinning, effectiveSpeed, hoveredIdx]);

    // Pointer Drag handlers
    const handlePointerDown = (e: React.PointerEvent) => {
      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      startXRef.current = e.clientX;
      lastXRef.current = e.clientX;
      startRotRef.current = rotationY;
      velocityRef.current = 0;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - startXRef.current;
      if (Math.abs(deltaX) > 6) {
        hasDraggedRef.current = true;
      }
      const sensitivity = 0.35; // degrees per pixel
      const newRot = startRotRef.current - deltaX * sensitivity;
      setRotationY(newRot);

      velocityRef.current = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore if already released
      }
    };

    // Wheel listener for horizontal or vertical scrolling
    const handleWheel = (e: React.WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      setRotationY((prev) => prev + delta * 0.12);
    };

    // Step Navigation
    const stepNext = useCallback(() => {
      setRotationY((prev) => prev - angleStep);
    }, [angleStep]);

    const stepPrev = useCallback(() => {
      setRotationY((prev) => prev + angleStep);
    }, [angleStep]);

    const resetPosition = () => {
      setRotationY(0);
    };

    // Keyboard Arrow navigation
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
          stepPrev();
        } else if (e.key === "ArrowRight") {
          stepNext();
        } else if (e.key === " ") {
          setIsAutoSpinning((prev) => !prev);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [stepNext, stepPrev]);

    const customStyle = {
      "--n": N,
      "--w": `${cardWidth}px`,
      "--ba": `calc(1turn / var(--n))`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        onWheel={handleWheel}
        className={cn(
          "w-full h-full min-h-[640px] flex flex-col items-center justify-center relative select-none",
          className
        )}
        {...props}
      >
        {/* 3D Cylinder Stage */}
        <div
          className="w-full flex-1 grid place-items-center cursor-grab active:cursor-grabbing overflow-visible py-8"
          style={{
            perspective: "54em",
            maskImage:
              "linear-gradient(90deg, transparent 0%, #000 10% 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, #000 10% 90%, transparent 100%)",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className="grid place-items-center [transform-style:preserve-3d] transition-transform duration-100 ease-out"
            style={{
              ...customStyle,
              transform: `rotateY(${rotationY}deg)`,
              WebkitBoxReflect:
                "below 24px linear-gradient(to bottom, transparent 40%, rgba(249, 115, 22, 0.25) 100%)",
            }}
          >
            {items.map((dish, i) => {
              const isHovered = hoveredIdx === i;
              return (
                <div
                  key={dish.id}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={(e) => {
                    if (hasDraggedRef.current) {
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
                    "group relative [grid-area:1/1] rounded-[28px] overflow-hidden [backface-visibility:hidden] transition-all duration-300 transform-gpu",
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
                      draggable={false}
                    />
                    {/* Sahara Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-orange-500/20 to-pink-500/10 mix-blend-color-dodge pointer-events-none" />
                  </div>

                  {/* Badges / Top Bar */}
                  <div className="relative z-10 p-4 flex items-center justify-between w-full pointer-events-none">
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
                  <div className="absolute bottom-0 inset-x-0 z-10 p-5 pt-12 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent flex flex-col justify-end pointer-events-none">
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

        {/* Sahara Interactive Control Dock */}
        <div className="relative z-30 flex items-center gap-3 bg-neutral-950/80 backdrop-blur-xl border border-orange-500/30 p-2 px-4 rounded-full shadow-[0_10px_30px_rgba(239,68,68,0.25)] mt-4">
          <button
            type="button"
            onClick={stepPrev}
            aria-label="Rotate Previous"
            className="p-2 text-orange-300 hover:text-white hover:bg-orange-500/20 rounded-full transition-colors active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsAutoSpinning((prev) => !prev)}
            aria-label={isAutoSpinning ? "Pause Auto-Rotation" : "Start Auto-Rotation"}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-orange-500/40 text-xs uppercase tracking-widest font-serif font-bold text-orange-200 hover:text-white hover:border-orange-400 transition-all active:scale-95"
          >
            {isAutoSpinning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current text-orange-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-orange-400" />
                <span>Auto Spin</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={stepNext}
            aria-label="Rotate Next"
            className="p-2 text-orange-300 hover:text-white hover:bg-orange-500/20 rounded-full transition-colors active:scale-90"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="h-4 w-px bg-orange-500/30 mx-1" />

          <button
            type="button"
            onClick={resetPosition}
            aria-label="Reset Rotation"
            title="Reset position"
            className="p-2 text-orange-400/80 hover:text-orange-200 hover:bg-orange-500/20 rounded-full transition-colors active:scale-90"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }
);

CylinderMenuCarousel.displayName = "CylinderMenuCarousel";