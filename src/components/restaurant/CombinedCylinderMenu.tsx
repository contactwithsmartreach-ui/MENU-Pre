"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MenuItem } from "@/types/restaurant";
import { cn } from "@/lib/utils";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
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

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDishIndex, setSelectedDishIndex] = useState<number>(0);

  const cylinderRef = useRef<HTMLDivElement>(null);
  const currentRotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const isTransitioningToTargetRef = useRef(false);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isAutoSpinningRef = useRef(true);
  const isHorizontalDragRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const autoResumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const cardWidth = isMobile ? 260 : 380;
  const radius =
    Math.round(cardWidth / 2 / Math.tan(Math.PI / Math.max(N, 1))) +
    (isMobile ? 20 : 40);

  const setTransform = useCallback(
    (deg: number) => {
      currentRotationRef.current = deg;
      if (cylinderRef.current) {
        cylinderRef.current.style.transform = `translateZ(-${radius}px) rotateY(${deg}deg)`;
      }
    },
    [radius]
  );

  useEffect(() => {
    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (isDraggingRef.current && isHorizontalDragRef.current) {
        setTransform(currentRotationRef.current);
      } else if (isTransitioningToTargetRef.current) {
        const diff = targetRotationRef.current - currentRotationRef.current;
        if (Math.abs(diff) > 0.05) {
          currentRotationRef.current += diff * Math.min(5.5 * dt, 0.18);
          setTransform(currentRotationRef.current);
        } else {
          currentRotationRef.current = targetRotationRef.current;
          setTransform(currentRotationRef.current);
          isTransitioningToTargetRef.current = false;
        }
      } else {
        if (Math.abs(velocityRef.current) > 0.01) {
          currentRotationRef.current += velocityRef.current;
          targetRotationRef.current = currentRotationRef.current;
          velocityRef.current *= 0.965;
          setTransform(currentRotationRef.current);
        } else if (isAutoSpinningRef.current && hoveredIdx === null) {
          const ambientSpeed = 2.4;
          currentRotationRef.current += ambientSpeed * dt;
          targetRotationRef.current = currentRotationRef.current;
          setTransform(currentRotationRef.current);
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [hoveredIdx, setTransform]);

  const rotateToIndex = useCallback(
    (index: number, openModal = false, item?: MenuItem) => {
      if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current);
      isAutoSpinningRef.current = false;
      velocityRef.current = 0;
      isTransitioningToTargetRef.current = true;

      setSelectedDishIndex(index);

      const targetAngle = -index * angleStep;
      const current = currentRotationRef.current;
      const diff = (((targetAngle - current + 180) % 360) + 360) % 360 - 180;
      targetRotationRef.current = current + diff;

      if (openModal && item) {
        onSelectItem(item);
      }

      autoResumeTimeoutRef.current = setTimeout(() => {
        isAutoSpinningRef.current = true;
      }, 5500);
    },
    [angleStep, onSelectItem]
  );

  const stepRotate = useCallback(
    (direction: "prev" | "next") => {
      const newActive =
        direction === "next"
          ? (selectedDishIndex + 1) % N
          : (selectedDishIndex - 1 + N) % N;

      rotateToIndex(newActive, false, items[newActive]);
    },
    [selectedDishIndex, N, rotateToIndex, items]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current);
    isDraggingRef.current = true;
    isHorizontalDragRef.current = false;
    isTransitioningToTargetRef.current = false;
    dragDistanceRef.current = 0;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;

    if (!isHorizontalDragRef.current) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
        isDraggingRef.current = false;
        return;
      }
      if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
        isHorizontalDragRef.current = true;
        isAutoSpinningRef.current = false;
      }
    }

    if (isHorizontalDragRef.current) {
      const stepX = e.clientX - lastPointerXRef.current;
      dragDistanceRef.current += Math.abs(stepX);

      const now = performance.now();
      const dt = Math.max(now - lastPointerTimeRef.current, 10);
      const instantVelocity = (stepX / dt) * 10;

      const sensitivity = isMobile ? 0.24 : 0.18;
      currentRotationRef.current -= stepX * sensitivity;
      targetRotationRef.current = currentRotationRef.current;

      velocityRef.current =
        velocityRef.current * 0.5 - instantVelocity * 0.5 * sensitivity;

      lastPointerXRef.current = e.clientX;
      lastPointerTimeRef.current = now;
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current && !isHorizontalDragRef.current) return;
    isDraggingRef.current = false;
    isHorizontalDragRef.current = false;

    velocityRef.current = Math.max(Math.min(velocityRef.current, 2.5), -2.5);

    autoResumeTimeoutRef.current = setTimeout(() => {
      isAutoSpinningRef.current = true;
    }, 4500);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 4) {
      if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current);
      isAutoSpinningRef.current = false;
      isTransitioningToTargetRef.current = false;

      const impulse = (e.deltaX > 0 ? -1 : 1) * Math.min(Math.abs(e.deltaX) * 0.015, 0.5);
      velocityRef.current += impulse;

      autoResumeTimeoutRef.current = setTimeout(() => {
        isAutoSpinningRef.current = true;
      }, 4000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        stepRotate("prev");
      } else if (e.key === "ArrowRight") {
        stepRotate("next");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stepRotate]);

  const handleCardClick = (dish: MenuItem, index: number) => {
    if (dragDistanceRef.current > 8) return;
    setSelectedDishIndex(index);
    rotateToIndex(index, false);
    onSelectItem(dish);
  };

  const normalizedRot = ((-currentRotationRef.current % 360) + 360) % 360;
  const frontIndex = Math.round(normalizedRot / angleStep) % N;
  const currentFrontDish = items[frontIndex] || items[0];

  return (
    <div
      onWheel={handleWheel}
      className={cn(
        "w-full flex flex-col items-center justify-between relative select-none gap-6 sm:gap-10 pb-16 overflow-hidden",
        className
      )}
    >
      {/* 1. FLUID 3D CYLINDER STAGE WITH GLASS REFLECTIONS */}
      <div
        className="relative w-full min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] flex items-center justify-center overflow-visible touch-pan-y cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Iridescent White Floor Glow & Mirror Stage */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 w-[650px] sm:w-[920px] h-40 bg-gradient-to-r from-amber-200/50 via-white/80 to-rose-200/50 blur-3xl rounded-full opacity-90" />

        {/* 3D Perspective Stage */}
        <div
          className="relative w-full h-full flex items-center justify-center [perspective-origin:50%_50%]"
          style={{
            perspective: isMobile ? "1100px" : "1550px",
          }}
        >
          {/* Rotating Cylinder Core */}
          <div
            ref={cylinderRef}
            className="relative w-0 h-0 [transform-style:preserve-3d] will-change-transform transform-gpu"
            style={{
              transform: `translateZ(-${radius}px) rotateY(${currentRotationRef.current}deg)`,
            }}
          >
            {items.map((dish, i) => {
              const itemAngle = i * angleStep;
              const isHovered = hoveredIdx === i;

              return (
                <div
                  key={dish.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(dish, i);
                  }}
                  onMouseEnter={() => !isMobile && setHoveredIdx(i)}
                  onMouseLeave={() => !isMobile && setHoveredIdx(null)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCardClick(dish, i);
                    }
                  }}
                  className={cn(
                    "group absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[32px] sm:rounded-[40px] overflow-hidden cursor-pointer",
                    "border border-white/80 bg-white/70 backdrop-blur-2xl transition-all duration-300 transform-gpu",
                    "shadow-[0_20px_50px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)]",
                    "hover:border-amber-400 hover:shadow-[0_25px_60px_rgba(245,158,11,0.25),inset_0_1px_2px_rgba(255,255,255,1)] hover:scale-[1.02] active:scale-[0.98]",
                    isHovered && "z-30 ring-2 ring-amber-400/60"
                  )}
                  style={{
                    width: `${cardWidth}px`,
                    aspectRatio: "7/10",
                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    // High-Gloss White Glass Floor Reflection
                    WebkitBoxReflect:
                      "below 14px linear-gradient(to bottom, transparent 65%, rgba(255, 255, 255, 0.75) 100%)",
                  }}
                >
                  {/* Dish Image Background */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent mix-blend-overlay opacity-80" />
                  </div>

                  {/* Top Glass Bar Badges */}
                  <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between w-full pointer-events-none">
                    {dish.isSignature ? (
                      <Badge className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white font-serif tracking-wider uppercase px-3.5 py-1.5 rounded-full text-xs shadow-md shadow-orange-500/30 border-0 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-100 fill-amber-100 animate-pulse" />
                        Signature
                      </Badge>
                    ) : (
                      <span className="text-xs sm:text-sm font-serif uppercase tracking-widest text-neutral-800 bg-white/85 px-3.5 py-1.5 rounded-full border border-white/70 backdrop-blur-md shadow-sm font-semibold">
                        {dish.category}
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/80 text-amber-600 text-xs sm:text-sm font-bold shadow-md">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>

                  {/* Floating Action Badge on Hover */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-all duration-200",
                      isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    )}
                  >
                    <span className="bg-white/95 backdrop-blur-xl text-neutral-950 font-serif tracking-widest uppercase px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-xl shadow-black/20 border border-white flex items-center gap-2">
                      <Eye className="w-4 h-4 text-amber-600" />
                      <span>CLICK TO ORDER</span>
                    </span>
                  </div>

                  {/* Bottom Dish Information Glass Overlay */}
                  <div className="absolute bottom-0 inset-x-0 z-10 p-5 sm:p-7 pt-16 bg-gradient-to-t from-neutral-950/95 via-neutral-950/70 to-transparent flex flex-col justify-end pointer-events-none text-white">
                    <h3 className="text-lg sm:text-2xl font-serif font-bold text-white tracking-wide truncate group-hover:text-amber-300 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 mt-1.5 font-light leading-relaxed">
                      {dish.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-serif text-amber-300 font-bold">$</span>
                        <span className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-200 to-white font-serif">
                          {dish.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs sm:text-sm text-amber-200/90 font-mono">
                          {dish.prepTime}
                        </span>
                        <div className="w-9 h-9 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white transition-all shadow-md">
                          <Plus className="w-4 h-4 stroke-[2.5]" />
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

      {/* 2. FLOATING TEXT & GLASS BUTTON CONTROLS */}
      <div className="relative z-40 w-full max-w-3xl px-4 flex flex-col items-center gap-6 mt-8 sm:mt-12">
        {/* Glassmorphic Floating Control Cluster */}
        <div className="relative w-full max-w-xl flex items-center justify-between px-2 sm:px-6">
          {/* Previous Glass Button */}
          <button
            type="button"
            aria-label="Rotate Previous Dish"
            onClick={() => stepRotate("prev")}
            className={cn(
              "group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full shrink-0 flex items-center justify-center transition-all duration-300 cursor-pointer",
              "bg-white/80 backdrop-blur-xl border border-white/80 text-neutral-800",
              "shadow-[0_10px_25px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] hover:border-amber-400 hover:text-amber-600 active:scale-90 hover:scale-110"
            )}
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Center Floating Glass Dish Pill */}
          {currentFrontDish && (
            <button
              type="button"
              onClick={() => onSelectItem(currentFrontDish)}
              className="flex flex-col items-center justify-center text-center cursor-pointer group px-5 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all hover:scale-105 hover:bg-white/90"
            >
              <span className="text-base sm:text-lg font-serif font-bold text-neutral-900 tracking-wide group-hover:text-amber-700 transition-colors truncate max-w-[240px] sm:max-w-xs">
                {currentFrontDish.name}
              </span>
              <span className="text-xs sm:text-sm text-amber-600 font-serif font-bold mt-0.5 tracking-wider flex items-center gap-2">
                <span>${currentFrontDish.price}</span>
                <span className="text-neutral-300">&bull;</span>
                <span className="text-neutral-600 group-hover:text-amber-700 underline underline-offset-2">Click to Order</span>
              </span>
            </button>
          )}

          {/* Next Glass Button */}
          <button
            type="button"
            aria-label="Rotate Next Dish"
            onClick={() => stepRotate("next")}
            className={cn(
              "group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full shrink-0 flex items-center justify-center transition-all duration-300 cursor-pointer",
              "bg-white/80 backdrop-blur-xl border border-white/80 text-neutral-800",
              "shadow-[0_10px_25px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] hover:border-amber-400 hover:text-amber-600 active:scale-90 hover:scale-110"
            )}
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}