"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MenuItem } from "@/types/restaurant";
import { cn } from "@/lib/utils";
import {
  Star,
  Flame,
  ChevronLeft,
  ChevronRight,
  Eye,
  Utensils,
  Plus,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface CombinedCylinderMenuProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  className?: string;
}

export function CombinedCylinderMenu({
  items,
  onSelectItem,
  className,
}: CombinedCylinderMenuProps) {
  const N = items.length;
  const angleStep = 360 / Math.max(N, 1);
  const defaultSpeed = 7; // degrees per sec

  const [rotationY, setRotationY] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Runway horizontal ref for auto-scrolling sideways cards
  const runwayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const cardWidth = isMobile ? 180 : 250;

  // Gesture and animation refs
  const isDraggingRef = useRef(false);
  const hasCapturedPointerRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startRotRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const hasMovedSignificantlyRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const momentumFrameRef = useRef<number | null>(null);
  const autoResumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Active item calculation
  const normalizedRot = ((-rotationY % 360) + 360) % 360;
  const activeIndex = Math.round(normalizedRot / angleStep) % N;
  const activeItem = items[activeIndex] || items[0];

  // Auto-scroll runway when activeIndex changes
  useEffect(() => {
    if (!runwayRef.current) return;
    const activeThumb = runwayRef.current.children[activeIndex] as HTMLElement;
    if (activeThumb) {
      const container = runwayRef.current;
      const scrollTarget =
        activeThumb.offsetLeft - container.clientWidth / 2 + activeThumb.clientWidth / 2;
      container.scrollTo({ left: scrollTarget, behavior: "smooth" });
    }
  }, [activeIndex]);

  // Smooth rotation transition
  const rotateToAngle = useCallback(
    (targetAngle: number, onComplete?: () => void) => {
      if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
      if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current);

      velocityRef.current = 0;
      setIsAutoSpinning(false);

      const current = rotationY;
      const diff = (((targetAngle - current + 180) % 360) + 360) % 360 - 180;
      const finalTarget = current + diff;

      const startTime = performance.now();
      const duration = 400;
      const startAngle = current;
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);

        setRotationY(startAngle + (finalTarget - startAngle) * eased);

        if (progress < 1) {
          momentumFrameRef.current = requestAnimationFrame(animate);
        } else {
          setRotationY(finalTarget);
          onComplete?.();
          autoResumeTimeoutRef.current = setTimeout(() => {
            setIsAutoSpinning(true);
          }, 3500);
        }
      };

      momentumFrameRef.current = requestAnimationFrame(animate);
    },
    [rotationY]
  );

  const bringToFront = useCallback(
    (index: number, openModal: boolean = false, item?: MenuItem) => {
      const targetAngle = -index * angleStep;
      rotateToAngle(targetAngle, () => {
        if (openModal && item) {
          onSelectItem(item);
        }
      });
    },
    [angleStep, rotateToAngle, onSelectItem]
  );

  const stepRotate = useCallback(
    (direction: "prev" | "next") => {
      if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
      if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current);

      setIsAutoSpinning(false);
      const delta = direction === "next" ? -angleStep : angleStep;
      const target = rotationY + delta;

      const startTime = performance.now();
      const duration = 320;
      const startAngle = rotationY;
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);

        setRotationY(startAngle + delta * eased);

        if (progress < 1) {
          momentumFrameRef.current = requestAnimationFrame(animate);
        } else {
          setRotationY(target);
          autoResumeTimeoutRef.current = setTimeout(() => {
            setIsAutoSpinning(true);
          }, 3500);
        }
      };

      momentumFrameRef.current = requestAnimationFrame(animate);
    },
    [angleStep, rotationY]
  );

  // Auto-spin RAF loop
  useEffect(() => {
    let prev = performance.now();

    const loop = (timestamp: number) => {
      const delta = (timestamp - prev) / 1000;
      prev = timestamp;

      if (
        isAutoSpinning &&
        !isDraggingRef.current &&
        hoveredIdx === null &&
        Math.abs(velocityRef.current) < 0.05
      ) {
        setRotationY((p) => (p + defaultSpeed * delta) % 360);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoSpinning, defaultSpeed, hoveredIdx]);

  // Inertia momentum
  const applyMomentum = useCallback(() => {
    const decay = 0.92;
    const step = () => {
      if (Math.abs(velocityRef.current) > 0.05) {
        setRotationY((p) => p - velocityRef.current);
        velocityRef.current *= decay;
        momentumFrameRef.current = requestAnimationFrame(step);
      } else {
        velocityRef.current = 0;
      }
    };
    if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
    momentumFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Cylinder Pointer interaction
  const handlePointerDown = (e: React.PointerEvent) => {
    if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
    if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current);

    isDraggingRef.current = true;
    hasMovedSignificantlyRef.current = false;
    hasCapturedPointerRef.current = false;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    startRotRef.current = rotationY;
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;

    if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
      hasMovedSignificantlyRef.current = true;
      if (!hasCapturedPointerRef.current) {
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          hasCapturedPointerRef.current = true;
        } catch {
          // safe fallback
        }
      }
    }

    if (hasMovedSignificantlyRef.current) {
      const sensitivity = isMobile ? 0.46 : 0.38;
      const newRotation = startRotRef.current - deltaX * sensitivity;
      setRotationY(newRotation);

      const now = performance.now();
      const dt = Math.max(now - lastTimeRef.current, 8);
      const instV = ((e.clientX - lastXRef.current) / dt) * 8;

      velocityRef.current = velocityRef.current * 0.3 + instV * 0.7;
      lastXRef.current = e.clientX;
      lastTimeRef.current = now;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (hasCapturedPointerRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // safe fallback
      }
      hasCapturedPointerRef.current = false;
    }

    if (hasMovedSignificantlyRef.current && Math.abs(velocityRef.current) > 0.3) {
      applyMomentum();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    setRotationY((prev) => prev + delta * 0.15);
  };

  const customStyle = {
    "--n": N,
    "--w": `${cardWidth}px`,
    "--ba": `calc(1turn / var(--n))`,
  } as React.CSSProperties;

  const handleCylinderCardClick = (dish: MenuItem, index: number, isFacingFront: boolean) => {
    if (hasMovedSignificantlyRef.current) return;
    if (isFacingFront) {
      onSelectItem(dish);
    } else {
      bringToFront(index, false);
    }
  };

  return (
    <div
      onWheel={handleWheel}
      className={cn(
        "w-full flex flex-col items-center justify-between relative select-none gap-6",
        className
      )}
    >
      {/* 1. UPPER STAGE: 3D Cylinder Gastronomy Carousel */}
      <div className="relative w-full min-h-[480px] sm:min-h-[550px] flex items-center justify-center">
        {/* Left Glowing Stepper Arrow */}
        <div className="absolute left-2 sm:left-4 z-40 flex items-center justify-center">
          <button
            type="button"
            aria-label="Rotate Previous"
            onClick={() => stepRotate("prev")}
            className={cn(
              "group relative w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer",
              "bg-neutral-950/85 backdrop-blur-xl border border-orange-500/40 text-orange-200",
              "shadow-[0_0_20px_rgba(249,115,22,0.35),0_10px_25px_rgba(0,0,0,0.8)]",
              "hover:scale-110 hover:border-orange-400 hover:text-white hover:shadow-[0_0_35px_rgba(249,115,22,0.8)] active:scale-95"
            )}
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/30 via-orange-500/30 to-amber-500/20 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
            <ChevronLeft className="w-5 h-5 relative z-10 transition-transform group-hover:-translate-x-0.5" />
          </button>
        </div>

        {/* Right Glowing Stepper Arrow */}
        <div className="absolute right-2 sm:right-4 z-40 flex items-center justify-center">
          <button
            type="button"
            aria-label="Rotate Next"
            onClick={() => stepRotate("next")}
            className={cn(
              "group relative w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer",
              "bg-neutral-950/85 backdrop-blur-xl border border-orange-500/40 text-orange-200",
              "shadow-[0_0_20px_rgba(249,115,22,0.35),0_10px_25px_rgba(0,0,0,0.8)]",
              "hover:scale-110 hover:border-orange-400 hover:text-white hover:shadow-[0_0_35px_rgba(249,115,22,0.8)] active:scale-95"
            )}
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/30 to-red-500/30 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
            <ChevronRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* 3D Cylinder Scene */}
        <div
          className="w-full flex-1 grid place-items-center cursor-grab active:cursor-grabbing overflow-visible py-2 touch-pan-y"
          style={{
            perspective: isMobile ? "44em" : "60em",
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
                "below 10px linear-gradient(to bottom, transparent 65%, rgba(249, 115, 22, 0.2) 100%)",
            }}
          >
            {items.map((dish, i) => {
              const cardAngle = ((i * angleStep + rotationY) % 360 + 360) % 360;
              const angleFromFront = Math.min(cardAngle, 360 - cardAngle);
              const isFacingFront = angleFromFront < angleStep * 0.75;
              const isSideVisible = angleFromFront < 110;
              const isHovered = hoveredIdx === i;

              return (
                <div
                  key={dish.id}
                  onMouseEnter={() => !isMobile && setHoveredIdx(i)}
                  onMouseLeave={() => !isMobile && setHoveredIdx(null)}
                  onClick={() => handleCylinderCardClick(dish, i, isFacingFront)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      bringToFront(i, true, dish);
                    }
                  }}
                  className={cn(
                    "group relative [grid-area:1/1] rounded-[24px] sm:rounded-[28px] overflow-hidden [backface-visibility:hidden] transition-all duration-300 transform-gpu cursor-pointer",
                    "border bg-neutral-950/95 backdrop-blur-xl",
                    isFacingFront
                      ? "border-orange-400 shadow-[0_20px_50px_rgba(249,115,22,0.55)] ring-2 ring-orange-500/50 scale-105 z-30 opacity-100"
                      : isSideVisible
                      ? "border-orange-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.7)] opacity-90 hover:opacity-100 hover:border-orange-400 hover:scale-105 z-20"
                      : "border-orange-500/20 opacity-40 hover:opacity-80 z-10"
                  )}
                  style={{
                    width: "var(--w)",
                    aspectRatio: "7/10",
                    "--i": i,
                    transform:
                      "rotateY(calc(var(--i) * var(--ba))) translateZ(calc(-1 * (0.5 * var(--w) + 0.5em) / tan(0.5 * var(--ba))))",
                  } as React.CSSProperties}
                >
                  {/* Dish Image */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-orange-500/20 to-pink-500/10 mix-blend-color-dodge" />
                  </div>

                  {/* Top Bar */}
                  <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between w-full pointer-events-none">
                    {dish.isSignature ? (
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif tracking-wider uppercase px-2.5 py-0.5 rounded-full text-[10px] shadow-lg shadow-red-500/30 border-0">
                        <Flame className="w-3.5 h-3.5 fill-current mr-1 text-amber-200 animate-pulse" />
                        Signature
                      </Badge>
                    ) : (
                      <span className="text-[10px] font-serif uppercase tracking-widest text-orange-200 bg-neutral-950/80 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-orange-500/30">
                        {dish.category}
                      </span>
                    )}

                    <div className="flex items-center gap-1 bg-neutral-950/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-orange-500/30 text-amber-300 text-[11px] font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>

                  {/* Interactive Button Overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center z-20 transition-all duration-200 pointer-events-none",
                      isFacingFront || isHovered
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-90"
                    )}
                  >
                    <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white font-serif tracking-widest uppercase px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-xl shadow-red-600/50 border border-orange-200/50 flex items-center gap-1.5">
                      {isFacingFront ? <Eye className="w-3.5 h-3.5" /> : <Utensils className="w-3.5 h-3.5" />}
                      <span>{isFacingFront ? "VIEW DETAILS" : "BRING FORWARD"}</span>
                    </span>
                  </div>

                  {/* Bottom Details */}
                  <div className="absolute bottom-0 inset-x-0 z-10 p-3.5 sm:p-5 pt-8 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent flex flex-col justify-end pointer-events-none">
                    <h3 className="text-sm sm:text-base font-serif font-bold text-white tracking-wide truncate group-hover:text-orange-300 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-300/85 line-clamp-1 mt-0.5 font-light">
                      {dish.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-orange-500/20 flex items-center justify-between">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs font-serif text-orange-400 font-bold">$</span>
                        <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-serif">
                          {dish.price}
                        </span>
                      </div>

                      <span className="text-[10px] text-orange-200/70 font-mono">
                        {dish.prepTime}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. LOWER STAGE: Synchronized Sideways Cards Runway */}
      <div className="w-full max-w-5xl px-2 sm:px-4 flex flex-col items-center gap-3">
        {/* Runway Title & Active Spotlight Info */}
        <div className="w-full flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse shadow-[0_0_8px_rgba(249,115,22,1)]" />
            <span className="text-[11px] sm:text-xs font-serif uppercase tracking-[0.2em] text-orange-300/90 font-bold">
              Sideways Quick-Deck &bull; Pick Any Dish
            </span>
          </div>

          {activeItem && (
            <button
              type="button"
              onClick={() => onSelectItem(activeItem)}
              className="text-xs text-amber-300 hover:text-white font-serif flex items-center gap-1 transition-colors"
            >
              <span>Current Spotlight: <strong className="text-white font-bold">{activeItem.name}</strong></span>
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            </button>
          )}
        </div>

        {/* Sideways Cards Horizontal Scrolling Strip */}
        <div
          ref={runwayRef}
          className="w-full flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-2 px-1 snap-x snap-mandatory scroll-smooth"
        >
          {items.map((dish, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={dish.id}
                onClick={() => {
                  bringToFront(index, false);
                  onSelectItem(dish);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    bringToFront(index, false);
                    onSelectItem(dish);
                  }
                }}
                className={cn(
                  "group relative shrink-0 w-[150px] sm:w-[190px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 snap-center p-2.5 flex flex-col justify-between",
                  "bg-neutral-950/90 backdrop-blur-xl border",
                  isActive
                    ? "border-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.45)] ring-2 ring-orange-500/50 scale-[1.03] bg-gradient-to-b from-neutral-900 to-neutral-950"
                    : "border-orange-500/25 hover:border-orange-400/70 hover:scale-[1.02] opacity-80 hover:opacity-100"
                )}
              >
                {/* Thumbnail Image */}
                <div className="relative w-full h-24 sm:h-28 rounded-xl overflow-hidden mb-2">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                  
                  {dish.isSignature && (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-red-600/90 text-white font-serif text-[9px] uppercase tracking-wider font-bold">
                      Signature
                    </span>
                  )}

                  <div className="absolute bottom-1 right-1.5 flex items-center gap-0.5 text-amber-300 text-[10px] font-bold bg-neutral-950/80 px-1.5 py-0.5 rounded-md backdrop-blur-md">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span>{dish.rating}</span>
                  </div>
                </div>

                {/* Info Text */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className={cn(
                      "text-xs sm:text-sm font-serif font-bold truncate transition-colors",
                      isActive ? "text-orange-300" : "text-white group-hover:text-orange-200"
                    )}>
                      {dish.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                      {dish.category}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-2 pt-1.5 border-t border-orange-500/20 flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                      ${dish.price}
                    </span>

                    <div className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-300 group-hover:bg-orange-500 group-hover:text-neutral-950 transition-colors">
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}