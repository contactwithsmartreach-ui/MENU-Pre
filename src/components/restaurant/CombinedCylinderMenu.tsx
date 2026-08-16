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

      {/* 3. LOWER STAGE: Sideways Cards Runway styled to match "ENTER CYLINDER MENU" Sahara theme */}
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
                    ? "w-[220px] sm:w-[270px] z-30 scale-110 sm:scale-115 -translate-y-2"
                    : "w-[145px] sm:w-[175px] z-10 scale-95 opacity-55 hover:opacity-85 hover:scale-100 grayscale-[0.25] hover:grayscale-0"
                )}
              >
                {/* OUTSIDE CARD TITLE: Big, Hard, Chunky, Solid White Header */}
                <div className="w-full text-center mb-2.5 px-1">
                  <h4
                    className={cn(
                      "text-white font-sans font-black leading-none uppercase line-clamp-1 transition-all duration-300",
                      isSelected
                        ? "text-base sm:text-lg md:text-xl tracking-wider opacity-100 drop-shadow-[0_4px_12px_rgba(0,0,0,1)] stroke-white"
                        : "text-xs sm:text-sm tracking-wide opacity-75 group-hover:opacity-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                    )}
                    style={{
                      WebkitTextStroke: isSelected ? "0.5px rgba(255,255,255,0.7)" : "none",
                      textShadow: isSelected
                        ? "0 0 1px #fff, 0 2px 8px rgba(0,0,0,0.9)"
                        : "none",
                    }}
                  >
                    {dish.name}
                  </h4>
                </div>

                {/* Outer Ember Glow (matching SaharaButton radiance) */}
                <div
                  className={cn(
                    "absolute -inset-2.5 top-7 rounded-[32px] bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 blur-xl pointer-events-none -z-10 transition-opacity duration-500",
                    isSelected ? "opacity-90 animate-pulse" : "opacity-0 group-hover:opacity-40"
                  )}
                />

                {/* Card Outer Gradient Border Shell */}
                <div
                  className={cn(
                    "relative w-full rounded-[26px] p-[2px] transition-all duration-500 shadow-2xl",
                    isSelected
                      ? "bg-gradient-to-tr from-red-600 via-orange-500 to-amber-300 shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_35px_rgba(249,115,22,0.6)]"
                      : "bg-gradient-to-b from-orange-500/40 via-neutral-800/80 to-stone-900 border border-orange-500/20 shadow-[0_10px_25px_rgba(0,0,0,0.8)] group-hover:bg-gradient-to-tr group-hover:from-orange-600/80 group-hover:to-amber-400/80"
                  )}
                >
                  {/* Card Interior Container (Deep Obsidian Ceramic with Amber Glows) */}
                  <div className="relative w-full h-full rounded-[24px] overflow-hidden p-3 bg-gradient-to-b from-[#140b08] via-[#0d0705] to-[#050302] flex flex-col justify-between">
                    {/* Interior Shimmer & Ember Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/15 via-orange-500/10 to-amber-300/10 pointer-events-none" />
                    <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />

                    {/* Dish Image Frame */}
                    <div
                      className={cn(
                        "relative w-full rounded-[18px] overflow-hidden mb-2.5 transition-all duration-300 z-10 border border-orange-500/30",
                        isSelected
                          ? "h-32 sm:h-40 ring-1 ring-amber-400/60 shadow-inner"
                          : "h-22 sm:h-26"
                      )}
                    >
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0503] via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-red-600/25 via-transparent to-amber-400/15 mix-blend-overlay" />

                      {/* Signature / Category Badge */}
                      {dish.isSignature ? (
                        <span
                          className={cn(
                            "absolute top-2 left-2 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-white font-serif uppercase tracking-wider font-bold shadow-md shadow-red-500/40 flex items-center gap-1",
                            isSelected ? "px-2.5 py-0.5 text-[10px]" : "px-1.5 py-0.5 text-[9px]"
                          )}
                        >
                          <Flame className="w-2.5 h-2.5 fill-amber-200 text-amber-200 animate-pulse" />
                          Signature
                        </span>
                      ) : (
                        isSelected && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-neutral-950/85 backdrop-blur-md border border-orange-500/40 text-orange-200 font-serif text-[9px] uppercase tracking-wider">
                            {dish.category}
                          </span>
                        )
                      )}

                      {/* Rating Badge */}
                      <div className="absolute bottom-2 right-2 flex items-center gap-0.5 text-amber-300 text-[10px] font-bold bg-[#0d0705]/90 px-2 py-0.5 rounded-md backdrop-blur-md border border-orange-500/40 shadow-md">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        <span>{dish.rating}</span>
                      </div>
                    </div>

                    {/* Info Text in Desert Obsidian Interior */}
                    <div className="flex-1 flex flex-col justify-between relative z-10 px-1">
                      <div>
                        {isSelected ? (
                          <p className="text-[11px] text-neutral-300 line-clamp-2 mt-0.5 font-light leading-snug">
                            {dish.description}
                          </p>
                        ) : (
                          <p className="text-[10px] text-orange-300/80 truncate mt-0.5 uppercase tracking-wider font-semibold">
                            {dish.category}
                          </p>
                        )}
                      </div>

                      {/* Price & Action Section (Styled like Sahara Button accents) */}
                      <div
                        className={cn(
                          "mt-2.5 pt-2 flex items-center justify-between transition-colors border-t",
                          isSelected ? "border-orange-500/30" : "border-orange-500/15"
                        )}
                      >
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-xs font-serif text-amber-400 font-bold">$</span>
                          <span
                            className={cn(
                              "font-serif font-extrabold tracking-tight",
                              isSelected
                                ? "text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 drop-shadow-[0_2px_10px_rgba(249,115,22,0.4)]"
                                : "text-sm text-orange-200"
                            )}
                          >
                            {dish.price}
                          </span>
                        </div>

                        {/* Button pill matching Enter Cylinder Menu Button aesthetic */}
                        <div
                          className={cn(
                            "rounded-full flex items-center justify-center transition-all duration-300 font-serif",
                            isSelected
                              ? "px-3 py-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-neutral-950 font-black text-[10px] uppercase tracking-wider shadow-[0_0_15px_rgba(249,115,22,0.8)] border border-amber-200 scale-105"
                              : "w-6 h-6 bg-neutral-900 border border-orange-500/40 text-orange-400 group-hover:bg-orange-500 group-hover:text-neutral-950"
                          )}
                        >
                          {isSelected ? (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3 stroke-[2.5]" />
                              VIEW
                            </span>
                          ) : (
                            <Plus className="w-3 h-3 stroke-[2.5]" />
                          )}
                        </div>
                      </div>
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