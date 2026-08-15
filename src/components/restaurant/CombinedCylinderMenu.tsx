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
  const [selectedDishIndex, setSelectedDishIndex] = useState<number>(0);

  // Runway horizontal ref for sideways cards
  const runwayRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const cardWidth = isMobile ? 180 : 250;

  // Gesture and animation refs for 3D cylinder
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

  // Scroll center helper for runway card
  const scrollCardToCenter = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    if (!runwayRef.current) return;
    const container = runwayRef.current;
    const cards = container.querySelectorAll<HTMLElement>("[data-dish-card]");
    const targetCard = cards[index];
    if (targetCard) {
      isProgrammaticScrollRef.current = true;
      const targetLeft = targetCard.offsetLeft - container.clientWidth / 2 + targetCard.clientWidth / 2;
      container.scrollTo({ left: targetLeft, behavior });
      
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 500);
    }
  }, []);

  // Smooth rotation transition for 3D cylinder
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

  // Bring a dish to front of 3D cylinder and center in horizontal deck
  const bringToFront = useCallback(
    (index: number, openModal: boolean = false, item?: MenuItem) => {
      setSelectedDishIndex(index);
      scrollCardToCenter(index);

      const targetAngle = -index * angleStep;
      rotateToAngle(targetAngle, () => {
        if (openModal && item) {
          onSelectItem(item);
        }
      });
    },
    [angleStep, rotateToAngle, scrollCardToCenter, onSelectItem]
  );

  // Step left/right navigation button
  const stepRotate = useCallback(
    (direction: "prev" | "next") => {
      const newActive = direction === "next"
        ? (selectedDishIndex + 1) % N
        : (selectedDishIndex - 1 + N) % N;

      bringToFront(newActive, false, items[newActive]);
    },
    [selectedDishIndex, N, bringToFront, items]
  );

  // Auto-spin 3D cylinder loop
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

  // Horizontal scroll runway active item detection
  const handleRunwayScroll = () => {
    if (isProgrammaticScrollRef.current || !runwayRef.current) return;

    const container = runwayRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const cards = container.querySelectorAll<HTMLElement>("[data-dish-card]");

    let closestIdx = 0;
    let closestDist = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    if (closestIdx !== selectedDishIndex) {
      setSelectedDishIndex(closestIdx);
      const targetAngle = -closestIdx * angleStep;
      rotateToAngle(targetAngle);
    }
  };

  useEffect(() => {
    scrollCardToCenter(0, "instant");
  }, [scrollCardToCenter]);

  const customStyle = {
    "--n": N,
    "--w": `${cardWidth}px`,
    "--ba": `calc(1turn / var(--n))`,
  } as React.CSSProperties;

  const handleCylinderCardClick = (dish: MenuItem, index: number, isFacingFront: boolean) => {
    if (hasMovedSignificantlyRef.current) return;
    setSelectedDishIndex(index);
    scrollCardToCenter(index);
    if (isFacingFront) {
      onSelectItem(dish);
    } else {
      bringToFront(index, false);
    }
  };

  const handleSidewaysCardClick = (dish: MenuItem, index: number) => {
    bringToFront(index, false);
  };

  return (
    <div
      onWheel={handleWheel}
      className={cn(
        "w-full flex flex-col items-center justify-between relative select-none gap-2 sm:gap-3",
        className
      )}
    >
      {/* 1. UPPER STAGE: 3D Cylinder Gastronomy Carousel */}
      <div className="relative w-full min-h-[440px] sm:min-h-[500px] flex items-center justify-center">
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

      {/* 2. GAP CONTROLS: Left and Right vibrant full orange glowing stepper buttons */}
      <div className="relative z-40 w-full max-w-xl px-4 flex items-center justify-between my-2">
        {/* Left Full Orange Glowing Button */}
        <div className="relative group">
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 blur-lg opacity-80 group-hover:opacity-100 group-hover:blur-xl transition-all duration-300 animate-pulse" />
          <button
            type="button"
            aria-label="Rotate Previous Dish"
            onClick={() => stepRotate("prev")}
            className={cn(
              "relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer",
              "bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-neutral-950 font-black",
              "border-2 border-amber-300/80 shadow-[0_0_30px_rgba(249,115,22,0.85),0_0_50px_rgba(239,68,68,0.5)]",
              "hover:scale-110 hover:shadow-[0_0_45px_rgba(249,115,22,1),0_0_70px_rgba(239,68,68,0.8)] active:scale-95"
            )}
          >
            <ChevronLeft className="w-6 h-6 text-neutral-950 stroke-[3] transition-transform group-hover:-translate-x-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]" />
          </button>
        </div>

        {/* Right Full Orange Glowing Button */}
        <div className="relative group">
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 blur-lg opacity-80 group-hover:opacity-100 group-hover:blur-xl transition-all duration-300 animate-pulse" />
          <button
            type="button"
            aria-label="Rotate Next Dish"
            onClick={() => stepRotate("next")}
            className={cn(
              "relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer",
              "bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-neutral-950 font-black",
              "border-2 border-amber-300/80 shadow-[0_0_30px_rgba(249,115,22,0.85),0_0_50px_rgba(239,68,68,0.5)]",
              "hover:scale-110 hover:shadow-[0_0_45px_rgba(249,115,22,1),0_0_70px_rgba(239,68,68,0.8)] active:scale-95"
            )}
          >
            <ChevronRight className="w-6 h-6 text-neutral-950 stroke-[3] transition-transform group-hover:translate-x-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]" />
          </button>
        </div>
      </div>

      {/* 3. LOWER STAGE: Sideways Melting Down Cards Runway with Faded Smoked Purple Interiors */}
      <div className="w-full max-w-7xl px-2 sm:px-4 flex flex-col items-center">
        {/* Horizontal Scrolling Strip */}
        <div
          ref={runwayRef}
          onScroll={handleRunwayScroll}
          className="w-full flex items-end gap-5 sm:gap-7 overflow-x-auto scrollbar-none py-6 sm:py-10 snap-x snap-mandatory scroll-smooth px-[calc(50%-100px)] sm:px-[calc(50%-125px)] overflow-y-visible"
        >
          {items.map((dish, index) => {
            const isSelected = selectedDishIndex === index;

            return (
              <div
                key={dish.id}
                data-dish-card
                onClick={() => {
                  if (isSelected) {
                    onSelectItem(dish);
                  } else {
                    handleSidewaysCardClick(dish, index);
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    if (isSelected) onSelectItem(dish);
                    else handleSidewaysCardClick(dish, index);
                  }
                }}
                className={cn(
                  "group relative shrink-0 cursor-pointer transition-all duration-500 ease-out snap-center select-none flex flex-col items-center",
                  isSelected
                    ? "w-[210px] sm:w-[260px] z-30 scale-110 sm:scale-115 -translate-y-2"
                    : "w-[145px] sm:w-[175px] z-10 scale-95 opacity-55 hover:opacity-85 hover:scale-100 grayscale-[0.2] hover:grayscale-0"
                )}
              >
                {/* OUTSIDE CARD TITLE: Big, Hard, Simple, Pure White Text */}
                <div className="w-full text-center mb-2 px-1">
                  <h4
                    className={cn(
                      "text-white font-sans font-black tracking-tight leading-tight uppercase line-clamp-1 transition-all duration-300",
                      isSelected
                        ? "text-sm sm:text-base md:text-lg opacity-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                        : "text-xs sm:text-sm opacity-65 group-hover:opacity-100"
                    )}
                  >
                    {dish.name}
                  </h4>
                </div>

                {/* Outer Purple/Orange Molten Heat Glow on Active */}
                {isSelected && (
                  <div className="absolute -inset-3 top-8 bg-gradient-to-b from-purple-600/30 via-orange-500/25 to-violet-900/40 rounded-[36px] blur-2xl pointer-events-none -z-10 animate-pulse" />
                )}

                {/* Melting Card Shell Wrapper with Smoked Faded Purple Interior */}
                <div
                  className={cn(
                    "relative w-full rounded-t-[30px] rounded-b-[18px] overflow-hidden p-3 flex flex-col justify-between transition-all duration-300",
                    // Faded smoked purple gradient backdrop
                    "bg-gradient-to-b from-[#24133b] via-[#160c26] to-[#0c0517]",
                    "border-t-2 border-x",
                    isSelected
                      ? "border-t-amber-300 border-x-purple-400/80 shadow-[0_0_35px_rgba(168,85,247,0.4),0_0_25px_rgba(249,115,22,0.3),0_15px_30px_rgba(0,0,0,0.9)]"
                      : "border-t-purple-400/30 border-x-purple-500/20 shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
                  )}
                >
                  {/* Subtle Faded Purple Shimmer Mist inside card */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-violet-800/10 to-transparent pointer-events-none" />

                  {/* Top Molten Viscous Wax Drip Overlay Layer */}
                  <div className="absolute top-0 inset-x-0 h-5 pointer-events-none z-20 overflow-hidden opacity-95">
                    <svg
                      viewBox="0 0 200 30"
                      preserveAspectRatio="none"
                      className="w-full h-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
                    >
                      <defs>
                        <linearGradient id={`top-melt-${dish.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                          <stop offset="60%" stopColor="#c084fc" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.6" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0,0 L 200,0 L 200,8 C 185,8 180,22 170,22 C 160,22 155,6 142,6 C 130,6 126,18 116,18 C 105,18 100,4 88,4 C 74,4 70,26 56,26 C 45,26 40,8 26,8 C 14,8 8,18 0,18 Z"
                        fill={`url(#top-melt-${dish.id})`}
                      />
                      {/* Specular Wax Highlight line */}
                      <path
                        d="M 0,4 C 8,14 14,5 26,5 C 40,5 45,22 56,22 C 70,22 74,2 88,2 C 100,2 105,15 116,15 C 126,15 130,4 142,4 C 155,4 160,19 170,19 C 180,19 185,5 200,5"
                        fill="none"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>

                  {/* Dish Image inside soft purple-tinted frame */}
                  <div
                    className={cn(
                      "relative w-full rounded-[22px] overflow-hidden mb-2.5 transition-all duration-300 z-10",
                      isSelected
                        ? "h-32 sm:h-40 ring-1 ring-purple-400/50 shadow-inner"
                        : "h-22 sm:h-26"
                    )}
                  >
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120722] via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/25 via-transparent to-amber-500/15 mix-blend-color-dodge" />

                    {/* Badges on Image */}
                    {dish.isSignature ? (
                      <span
                        className={cn(
                          "absolute top-2 left-2 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white font-serif uppercase tracking-wider font-bold shadow-md shadow-red-500/40 flex items-center gap-1",
                          isSelected ? "px-2 py-0.5 text-[10px]" : "px-1.5 py-0.5 text-[9px]"
                        )}
                      >
                        <Sparkles className="w-2.5 h-2.5 text-amber-200" />
                        Signature
                      </span>
                    ) : (
                      isSelected && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#180a2b]/85 backdrop-blur-md border border-purple-400/40 text-purple-200 font-serif text-[9px] uppercase tracking-wider">
                          {dish.category}
                        </span>
                      )
                    )}

                    <div className="absolute bottom-2 right-2 flex items-center gap-0.5 text-amber-300 text-[10px] font-bold bg-[#120722]/90 px-1.5 py-0.5 rounded-md backdrop-blur-md border border-purple-500/30">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>

                  {/* Info Text in Faded Purple interior */}
                  <div className="flex-1 flex flex-col justify-between relative z-10 px-1">
                    <div>
                      {isSelected ? (
                        <p className="text-[11px] text-purple-200/80 line-clamp-2 mt-0.5 font-light leading-snug">
                          {dish.description}
                        </p>
                      ) : (
                        <p className="text-[10px] text-purple-300/70 truncate mt-0.5 uppercase tracking-wider font-semibold">
                          {dish.category}
                        </p>
                      )}
                    </div>

                    {/* Price & Action */}
                    <div
                      className={cn(
                        "mt-2.5 pt-2 flex items-center justify-between transition-colors",
                        isSelected ? "border-t border-purple-500/30" : "border-t border-purple-400/10"
                      )}
                    >
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs font-serif text-amber-400 font-bold">$</span>
                        <span
                          className={cn(
                            "font-serif font-extrabold tracking-tight",
                            isSelected
                              ? "text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-200"
                              : "text-sm text-purple-200"
                          )}
                        >
                          {dish.price}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "rounded-full flex items-center justify-center transition-all duration-300",
                          isSelected
                            ? "w-7 h-7 bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105"
                            : "w-5 h-5 bg-purple-950/80 border border-purple-400/20 text-purple-300 group-hover:bg-orange-500 group-hover:text-neutral-950"
                        )}
                      >
                        {isSelected ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. REALISTIC LIQUID MELTING DRIP FRAME: Organic viscous drips with glass-like tears & physics */}
                <div className="relative -mt-1 w-full pointer-events-none overflow-visible">
                  <svg
                    viewBox="0 0 200 48"
                    preserveAspectRatio="none"
                    className={cn(
                      "w-full h-9 sm:h-12 transition-all duration-500 filter",
                      isSelected
                        ? "drop-shadow-[0_8px_14px_rgba(168,85,247,0.35)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                        : "drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)]"
                    )}
                  >
                    <defs>
                      {/* Fluid Melting Gradient: Faded Purple into Molten Sunset Amber */}
                      <linearGradient id={`melt-grad-${dish.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={isSelected ? "#1b0a33" : "#120722"} />
                        <stop offset="45%" stopColor={isSelected ? "#7e22ce" : "#4c1d95"} stopOpacity="0.95" />
                        <stop offset="85%" stopColor={isSelected ? "#ea580c" : "#9333ea"} />
                        <stop offset="100%" stopColor={isSelected ? "#f59e0b" : "#c084fc"} />
                      </linearGradient>

                      {/* Molten Glow Rim Highlight */}
                      <linearGradient id={`glow-rim-${dish.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="40%" stopColor="#fb923c" />
                        <stop offset="80%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#e879f9" />
                      </linearGradient>
                    </defs>

                    {/* Smooth Organic Viscous Drip Silhouette */}
                    <path
                      d="M 0,0 
                         L 200,0 
                         L 200,6 
                         C 192,6 189,16 183,16 
                         C 177,16 175,5 166,5 
                         C 157,5 153,38 144,38 
                         C 137,38 135,12 127,12 
                         C 119,12 117,26 109,26 
                         C 101,26 97,7 89,7 
                         C 81,7 76,44 66,44 
                         C 58,44 56,14 46,14 
                         C 36,14 32,30 22,30 
                         C 14,30 10,8 0,8 
                         Z"
                      fill={`url(#melt-grad-${dish.id})`}
                    />

                    {/* Specular Liquid Light Contour Reflection */}
                    <path
                      d="M 0,8 
                         C 10,8 14,30 22,30 
                         C 32,30 36,14 46,14 
                         C 56,14 58,44 66,44 
                         C 76,44 81,7 89,7 
                         C 97,7 101,26 109,26 
                         C 117,26 119,12 127,12 
                         C 135,12 137,38 144,38 
                         C 153,38 157,5 166,5 
                         C 175,5 177,16 183,16 
                         C 189,16 192,6 200,6"
                      fill="none"
                      stroke={isSelected ? `url(#glow-rim-${dish.id})` : "rgba(192,132,252,0.35)"}
                      strokeWidth={isSelected ? "2.2" : "1.2"}
                      strokeLinecap="round"
                    />

                    {/* Realistic Detached Viscous Wax Teardrops */}
                    {isSelected && (
                      <>
                        {/* Teardrop under main drip (x: 66) */}
                        <g className="animate-pulse">
                          <ellipse
                            cx="66"
                            cy="50"
                            rx="2.6"
                            ry="3.4"
                            fill="#f59e0b"
                            className="drop-shadow-[0_0_8px_rgba(245,158,11,1)]"
                          />
                          {/* Inner glossy highlight on teardrop */}
                          <circle cx="65" cy="48.5" r="0.9" fill="#fff" opacity="0.8" />
                        </g>

                        {/* Teardrop under secondary drip (x: 144) */}
                        <g className="animate-pulse delay-200">
                          <ellipse
                            cx="144"
                            cy="45"
                            rx="2.2"
                            ry="2.8"
                            fill="#fb923c"
                            className="drop-shadow-[0_0_7px_rgba(251,146,60,1)]"
                          />
                          <circle cx="143.2" cy="43.8" r="0.7" fill="#fff" opacity="0.8" />
                        </g>
                      </>
                    )}
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}