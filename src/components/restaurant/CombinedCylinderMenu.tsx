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

  // High-performance DOM transform & smooth physics tracking
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

  // Responsive geometry: larger cards with calibrated perspective
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Generously enlarged card dimensions
  const cardWidth = isMobile ? 260 : 380;
  // Natural cylinder radius to keep larger cards within view without screen overflow
  const radius =
    Math.round(cardWidth / 2 / Math.tan(Math.PI / Math.max(N, 1))) +
    (isMobile ? 20 : 40);

  // Apply smooth transform directly to the DOM for 60fps+ fluid rendering
  const setTransform = useCallback(
    (deg: number) => {
      currentRotationRef.current = deg;
      if (cylinderRef.current) {
        cylinderRef.current.style.transform = `translateZ(-${radius}px) rotateY(${deg}deg)`;
      }
    },
    [radius]
  );

  // Silky Smooth Physics Animation Loop
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

  // Smooth cinematic glide to specific dish index
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

  // Pointer & Drag Handlers
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

  // Horizontal wheel / trackpad
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

  // Keyboard navigation
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
        "w-full flex flex-col items-center justify-between relative select-none gap-8 sm:gap-14 pb-12 overflow-hidden",
        className
      )}
    >
      {/* 1. FLUID 3D CYLINDER STAGE */}
      <div
        className="relative w-full min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] flex items-center justify-center overflow-visible touch-pan-y cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Sahara Radiant Floor Glow */}
        <div className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 w-[600px] sm:w-[880px] h-36 bg-gradient-to-r from-red-600/35 via-orange-500/40 to-amber-400/35 blur-3xl rounded-full opacity-80" />

        {/* 3D Perspective Stage Container */}
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
                    "border border-orange-500/35 bg-[#0d0706] shadow-2xl transition-all duration-300 transform-gpu",
                    "hover:border-orange-400 hover:shadow-[0_25px_60px_rgba(249,115,22,0.45)] hover:ring-2 hover:ring-orange-400/80 active:scale-[0.98]",
                    isHovered && "z-30"
                  )}
                  style={{
                    width: `${cardWidth}px`,
                    aspectRatio: "7/10",
                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    // Liquid Glass Floor Reflection
                    WebkitBoxReflect:
                      "below 16px linear-gradient(to bottom, transparent 65%, rgba(249, 115, 22, 0.3) 100%)",
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0504] via-[#0a0504]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-orange-500/20 to-transparent mix-blend-color-dodge opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Top Bar Badges */}
                  <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between w-full pointer-events-none">
                    {dish.isSignature ? (
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif tracking-wider uppercase px-3.5 py-1.5 rounded-full text-xs shadow-lg shadow-red-500/50 border-0 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200 animate-pulse" />
                        Signature
                      </Badge>
                    ) : (
                      <span className="text-xs sm:text-sm font-serif uppercase tracking-widest text-orange-200 bg-neutral-950/85 px-3.5 py-1.5 rounded-full border border-orange-500/30 backdrop-blur-md">
                        {dish.category}
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 bg-neutral-950/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-orange-500/30 text-amber-300 text-xs sm:text-sm font-bold shadow-md">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
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
                    <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white font-serif tracking-widest uppercase px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-2xl shadow-red-600/60 border border-orange-200/60 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>CLICK TO ORDER</span>
                    </span>
                  </div>

                  {/* Bottom Dish Information */}
                  <div className="absolute bottom-0 inset-x-0 z-10 p-5 sm:p-7 pt-16 bg-gradient-to-t from-[#0a0504] via-[#0a0504]/95 to-transparent flex flex-col justify-end pointer-events-none">
                    <h3 className="text-lg sm:text-2xl font-serif font-bold text-white tracking-wide truncate group-hover:text-orange-300 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 mt-1.5 font-light leading-relaxed">
                      {dish.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-orange-500/25 flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-serif text-orange-400 font-bold">$</span>
                        <span className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-serif">
                          {dish.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs sm:text-sm text-orange-200/70 font-mono">
                          {dish.prepTime}
                        </span>
                        <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center text-orange-300 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-neutral-950 transition-all shadow-md">
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

      {/* 2. GLOWING NAVIGATION CONTROLS & CURVED DOCK */}
      <div className="relative z-40 w-full max-w-2xl px-4 flex flex-col items-center gap-5 mt-4 sm:mt-8">
        {/* Curved Glass Control Dock */}
        <div className="relative flex items-center justify-between w-full max-w-lg p-2 sm:p-2.5 rounded-[9999px] bg-gradient-to-b from-neutral-900/90 via-black/95 to-neutral-950/95 border border-orange-500/40 shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_30px_rgba(249,115,22,0.2)] backdrop-blur-2xl">
          {/* Subtle curved inner top highlight */}
          <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />

          {/* Previous Stepper Button */}
          <button
            type="button"
            aria-label="Rotate Previous Dish"
            onClick={() => stepRotate("prev")}
            className={cn(
              "group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full shrink-0 flex items-center justify-center transition-all duration-300 cursor-pointer",
              "bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-neutral-950 font-black",
              "border border-amber-300/80 shadow-[0_0_20px_rgba(249,115,22,0.5)] active:scale-90 hover:scale-105"
            )}
          >
            <ChevronLeft className="w-6 h-6 text-neutral-950 stroke-[3] group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Curved Center Focused Dish Card */}
          {currentFrontDish && (
            <button
              type="button"
              onClick={() => onSelectItem(currentFrontDish)}
              className="flex items-center gap-2.5 sm:gap-3.5 px-3 sm:px-5 py-2 rounded-full bg-neutral-950/80 hover:bg-neutral-900/90 border border-orange-500/30 hover:border-orange-400/80 transition-all text-left cursor-pointer group mx-1 sm:mx-2 flex-1 justify-center max-w-[280px] sm:max-w-none shadow-inner"
            >
              <img
                src={currentFrontDish.image}
                alt={currentFrontDish.name}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-orange-400/80 shadow-md shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-serif font-bold text-white group-hover:text-orange-300 transition-colors truncate">
                  {currentFrontDish.name}
                </span>
                <span className="text-[10px] sm:text-[11px] text-amber-400 font-serif font-semibold truncate">
                  ${currentFrontDish.price} &bull; Tap to Order
                </span>
              </div>
            </button>
          )}

          {/* Next Stepper Button */}
          <button
            type="button"
            aria-label="Rotate Next Dish"
            onClick={() => stepRotate("next")}
            className={cn(
              "group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full shrink-0 flex items-center justify-center transition-all duration-300 cursor-pointer",
              "bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-neutral-950 font-black",
              "border border-amber-300/80 shadow-[0_0_20px_rgba(249,115,22,0.5)] active:scale-90 hover:scale-105"
            )}
          >
            <ChevronRight className="w-6 h-6 text-neutral-950 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Quick-Jump Miniature Navigation Rail */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full px-4 py-2 scrollbar-none bg-neutral-950/85 backdrop-blur-xl rounded-full border border-orange-500/35 shadow-xl">
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Jump directly to ${item.name}`}
              onClick={() => rotateToIndex(idx, false)}
              className={cn(
                "relative rounded-full transition-all duration-300 shrink-0 overflow-hidden cursor-pointer",
                frontIndex === idx
                  ? "w-9 h-9 ring-2 ring-orange-400 scale-110 shadow-[0_0_15px_rgba(249,115,22,0.6)]"
                  : "w-6 h-6 opacity-50 hover:opacity-100 hover:scale-110 hover:ring-1 hover:ring-amber-300"
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