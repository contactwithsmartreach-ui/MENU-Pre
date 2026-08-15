"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MenuItem } from "@/types/restaurant";
import { cn } from "@/lib/utils";
import {
  Star,
  Clock,
  Flame,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SaharaButton } from "./SaharaButton";

export interface CylinderMenuCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MenuItem[];
  onSelectItem?: (item: MenuItem) => void;
  autoSpinSpeed?: number;
}

export function CylinderMenuCarousel({
  items,
  onSelectItem,
  className,
  ...props
}: CylinderMenuCarouselProps) {
  const N = items.length;
  const angleStep = 360 / Math.max(N, 1);

  const [activeIndex, setActiveIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive radius calculation
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const radius = isMobile ? 145 : 220;
  const plateSize = isMobile ? 64 : 88;

  // Refs for physics & drag gesture
  const startAngleRef = useRef(0);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const centerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wheelContainerRef = useRef<HTMLDivElement>(null);

  // Rotate smoothly to a specific dish index
  const goToIndex = useCallback(
    (targetIdx: number) => {
      const normalizedIdx = ((targetIdx % N) + N) % N;
      setActiveIndex(normalizedIdx);

      // Rotate target dish to top (270deg or 90deg depending on orientation)
      const targetAngle = -normalizedIdx * angleStep;

      // Find shortest angular distance
      setRotationAngle((curr) => {
        const diff = ((((targetAngle - curr) % 360) + 540) % 360) - 180;
        return curr + diff;
      });

      setIsAutoSpinning(false);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        setIsAutoSpinning(true);
      }, 5000);
    },
    [N, angleStep]
  );

  const handleNext = () => goToIndex(activeIndex + 1);
  const handlePrev = () => goToIndex(activeIndex - 1);

  // Gentle ambient slow spin
  useEffect(() => {
    let lastTime = performance.now();
    const spinLoop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isAutoSpinning && !isDragging) {
        setRotationAngle((prev) => {
          const next = (prev + 3.5 * delta) % 360;
          // Determine active index from top position (-90 deg offset)
          const normalized = (((-next % 360) + 360) % 360);
          const rawIdx = Math.round(normalized / angleStep) % N;
          if (rawIdx !== activeIndex) {
            setActiveIndex(rawIdx);
          }
          return next;
        });
      }

      animFrameRef.current = requestAnimationFrame(spinLoop);
    };

    animFrameRef.current = requestAnimationFrame(spinLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoSpinning, isDragging, activeIndex, angleStep, N]);

  // Pointer drag to spin circle
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!wheelContainerRef.current) return;
    setIsDragging(true);
    setIsAutoSpinning(false);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);

    const rect = wheelContainerRef.current.getBoundingClientRect();
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startAngleRef.current = rotationAngle;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Fallback
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const { x: cx, y: cy } = centerRef.current;

    // Calculate rotational angle from center
    const startAngle = Math.atan2(startYRef.current - cy, startXRef.current - cx);
    const currAngle = Math.atan2(e.clientY - cy, e.clientX - cx);
    const deltaDeg = ((currAngle - startAngle) * 180) / Math.PI;

    const newAngle = startAngleRef.current + deltaDeg;
    setRotationAngle(newAngle);

    // Update active index
    const normalized = (((-newAngle % 360) + 360) % 360);
    const rawIdx = Math.round(normalized / angleStep) % N;
    setActiveIndex(rawIdx);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Fallback
    }

    // Snap to closest dish
    goToIndex(activeIndex);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "Enter" && activeDish) {
      e.preventDefault();
      onSelectItem?.(activeDish);
    }
  };

  const activeDish = items[activeIndex] || items[0];

  if (!items.length) {
    return (
      <div className="py-20 text-center text-neutral-400 font-serif">
        No dishes available in this category.
      </div>
    );
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 py-4 select-none focus:outline-none",
        className
      )}
      {...props}
    >
      {/* LEFT: INTERACTIVE CIRCULAR DISH WHEEL */}
      <div className="relative flex flex-col items-center justify-center shrink-0">
        {/* Ambient Ring Glow */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-red-600/20 via-orange-500/25 to-amber-400/20 blur-3xl pointer-events-none" />

        {/* Circular Wheel Container */}
        <div
          ref={wheelContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
          style={{
            width: radius * 2 + plateSize + 20,
            height: radius * 2 + plateSize + 20,
          }}
        >
          {/* Subtle Outer Track Ring */}
          <div
            className="absolute rounded-full border border-orange-500/25 pointer-events-none"
            style={{
              width: radius * 2,
              height: radius * 2,
            }}
          />

          {/* Dotted Orbit Path Accent */}
          <div
            className="absolute rounded-full border border-dashed border-orange-400/20 pointer-events-none animate-[spin_60s_linear_infinite]"
            style={{
              width: radius * 2 + 30,
              height: radius * 2 + 30,
            }}
          />

          {/* CENTER CORE: Active Plate Showcase */}
          <div
            onClick={() => activeDish && onSelectItem?.(activeDish)}
            role="button"
            tabIndex={0}
            className="group relative rounded-full p-2 bg-gradient-to-br from-orange-500/30 via-neutral-900/90 to-black border-2 border-orange-500/60 shadow-[0_0_40px_rgba(249,115,22,0.35)] cursor-pointer z-20 hover:scale-105 transition-transform duration-300"
            style={{
              width: isMobile ? 128 : 176,
              height: isMobile ? 128 : 176,
            }}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden border border-orange-400/40">
              {activeDish && (
                <>
                  <img
                    src={activeDish.image}
                    alt={activeDish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-2.5 text-center">
                    <span className="text-[10px] sm:text-xs font-serif font-black uppercase text-orange-200 tracking-wider truncate max-w-full">
                      {activeDish.name}
                    </span>
                    <span className="text-[11px] sm:text-xs font-serif font-bold text-amber-400">
                      ${activeDish.price}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Quick Tap Badge Indicator */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-neutral-950/90 border border-orange-400/50 px-2 py-0.5 rounded-full text-[9px] font-serif uppercase tracking-widest text-orange-300 flex items-center gap-1 shadow-lg whitespace-nowrap">
              <UtensilsCrossed className="w-2.5 h-2.5 text-orange-400" />
              <span>Tap to Pick</span>
            </div>
          </div>

          {/* CIRCULAR DISH ITEMS ORBITING AROUND CENTER */}
          {items.map((dish, idx) => {
            const itemAngleDeg = idx * angleStep + rotationAngle;
            const itemAngleRad = (itemAngleDeg * Math.PI) / 180;
            const x = Math.cos(itemAngleRad) * radius;
            const y = Math.sin(itemAngleRad) * radius;
            const isSelected = activeIndex === idx;

            return (
              <div
                key={dish.id}
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(idx);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Select ${dish.name}`}
                className={cn(
                  "absolute rounded-full transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer",
                  "flex items-center justify-center p-1 group/plate",
                  isSelected
                    ? "z-30 scale-125 ring-2 ring-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.8)]"
                    : "z-10 opacity-70 hover:opacity-100 hover:scale-110 shadow-lg"
                )}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  width: plateSize,
                  height: plateSize,
                }}
              >
                {/* Ceramic Plate Dish Rim */}
                <div className="w-full h-full rounded-full bg-gradient-to-b from-neutral-800 to-black p-1 border border-orange-500/40 overflow-hidden relative shadow-inner">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover rounded-full group-hover/plate:scale-110 transition-transform duration-300"
                    draggable={false}
                  />

                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-transparent to-white/20 pointer-events-none rounded-full" />

                  {/* Price Tag Pill */}
                  <div className="absolute bottom-0.5 inset-x-0 flex justify-center pointer-events-none">
                    <span className="bg-neutral-950/90 text-orange-300 font-serif font-black text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full border border-orange-400/30 shadow">
                      ${dish.price}
                    </span>
                  </div>
                </div>

                {/* Orbiting Ember Glow on Selected */}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-amber-300 rounded-full shadow-[0_0_10px_rgba(249,115,22,1)] animate-ping" />
                )}
              </div>
            );
          })}
        </div>

        {/* Circular Wheel Controls */}
        <div className="flex items-center gap-4 mt-2 z-20">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous dish"
            className="w-9 h-9 rounded-full bg-neutral-950/90 border border-orange-500/40 flex items-center justify-center text-orange-300 hover:text-white hover:border-orange-400 hover:scale-110 active:scale-95 transition-all shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-serif uppercase tracking-widest text-orange-200/80">
            Dish {activeIndex + 1} of {N}
          </span>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next dish"
            className="w-9 h-9 rounded-full bg-neutral-950/90 border border-orange-500/40 flex items-center justify-center text-orange-300 hover:text-white hover:border-orange-400 hover:scale-110 active:scale-95 transition-all shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RIGHT: FOCUSED ACTIVE MEAL CARD FOR INSTANT ORDERING */}
      {activeDish && (
        <div className="relative w-full max-w-md bg-neutral-950/90 backdrop-blur-2xl border border-orange-500/35 rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(249,115,22,0.15)] flex flex-col gap-4">
          {/* Card Header & Badges */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif uppercase tracking-wider text-[11px] border-0">
                {activeDish.category}
              </Badge>
              {activeDish.isSignature && (
                <Badge className="bg-neutral-900 border border-orange-400/40 text-amber-300 text-[11px]">
                  <Sparkles className="w-3 h-3 mr-1 fill-amber-300" />
                  Chef Signature
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 text-amber-300 font-bold text-xs bg-neutral-900/90 px-2.5 py-1 rounded-full border border-orange-500/30">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{activeDish.rating}</span>
              <span className="text-neutral-500 font-normal">({activeDish.reviewsCount})</span>
            </div>
          </div>

          {/* Dish Title & Price */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl sm:text-2xl font-serif font-black text-white tracking-wide">
              {activeDish.name}
            </h3>
            <div className="text-2xl sm:text-3xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 whitespace-nowrap">
              ${activeDish.price}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            {activeDish.description}
          </p>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs text-orange-200/80 pt-1 border-t border-orange-500/20">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              {activeDish.prepTime}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              {activeDish.calories} kcal
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {activeDish.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium bg-neutral-900/80 border border-orange-500/20 px-2 py-0.5 rounded-full text-orange-200/75"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Button to Pick / Order */}
          <div className="pt-2">
            <SaharaButton
              onClick={() => onSelectItem?.(activeDish)}
              primaryText={`PICK • $${activeDish.price}`}
              hoverText="ADD TO ORDER"
              size="md"
              className="w-full py-3.5"
            />
          </div>
        </div>
      )}
    </div>
  );
}