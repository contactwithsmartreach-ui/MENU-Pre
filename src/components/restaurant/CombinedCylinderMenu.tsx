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
  const defaultSpeed = 5; // degrees per sec

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDishIndex, setSelectedDishIndex] = useState<number>(0);
  const [rotationY, setRotationY] = useState(0);

  // Cylinder stage refs
  const isAutoSpinningRef = useRef(true);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startRotRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const animFrameRef = useRef<number | null>(null);
  const momentumFrameRef = useRef<number | null>(null);
  const autoResumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const cardWidth = isMobile ? 220 : 310;
  // Dynamic radius calculation in pixels for stable, raycast-friendly 3D geometry
  const radius = Math.round((cardWidth / 2) / Math.tan(Math.PI / Math.max(N, 1))) + (isMobile ? 35 : 70);

  // Smooth rotate to target
  const rotateToAngle = useCallback(
    (targetAngle: number, onComplete?: () => void) => {
      if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
      if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current);

      isAutoSpinningRef.current = false;

      const current = rotationY;
      const diff = (((targetAngle - current + 180) % 360) + 360) % 360 - 180;
      const finalTarget = current + diff;

      const startTime = performance.now();
      const duration = 320;
      const startAngle = current;
      const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);

        setRotationY(startAngle + (finalTarget - startAngle) * eased);

        if (progress < 1) {
          momentumFrameRef.current = requestAnimationFrame(animate);
        } else {
          setRotationY(finalTarget);
          onComplete?.();
          autoResumeTimeoutRef.current = setTimeout(() => {
            isAutoSpinningRef.current = true;
          }, 3500);
        }
      };

      momentumFrameRef.current = requestAnimationFrame(animate);
    },
    [rotationY]
  );

  const bringToFront = useCallback(
    (index: number, openModal: boolean = false, item?: MenuItem) => {
      setSelectedDishIndex(index);

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
      const newActive = direction === "next"
        ? (selectedDishIndex + 1) % N
        : (selectedDishIndex - 1 + N) % N;

      bringToFront(newActive, false, items[newActive]);
    },
    [selectedDishIndex, N, bringToFront, items]
  );

  // Continuous auto-spin RAF loop
  useEffect(() => {
    let prev = performance.now();

    const loop = (timestamp: number) => {
      const delta = (timestamp - prev) / 1000;
      prev = timestamp;

      if (
        isAutoSpinningRef.current &&
        !isDraggingRef.current &&
        hoveredIdx === null
      ) {
        setRotationY((prevRot) => (prevRot + defaultSpeed * delta) % 360);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [defaultSpeed, hoveredIdx]);

  // Card click handler: opens modal and focuses dish
  const handleCardClick = (dish: MenuItem, index: number) => {
    if (hasDraggedRef.current) return;
    setSelectedDishIndex(index);
    onSelectItem(dish);
  };

  // Drag handlers on stage
  const handleStageMouseDown = (e: React.MouseEvent) => {
    if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
    if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current);

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startRotRef.current = rotationY;
  };

  const handleStageMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasDraggedRef.current = true;
      const sensitivity = isMobile ? 0.44 : 0.35;
      setRotationY(startRotRef.current - deltaX * sensitivity);
    }
  };

  const handleStageMouseUp = () => {
    isDraggingRef.current = false;
    if (hasDraggedRef.current) {
      autoResumeTimeoutRef.current = setTimeout(() => {
        isAutoSpinningRef.current = true;
      }, 3000);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      startXRef.current = e.touches[0].clientX;
      startRotRef.current = rotationY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasDraggedRef.current = true;
      setRotationY(startRotRef.current - deltaX * 0.44);
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    if (hasDraggedRef.current) {
      autoResumeTimeoutRef.current = setTimeout(() => {
        isAutoSpinningRef.current = true;
      }, 3000);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    setRotationY((prev) => prev + delta * 0.12);
  };

  // Find the currently front-facing dish
  const normalizedRot = ((-rotationY % 360) + 360) % 360;
  const currentFrontIndex = Math.round(normalizedRot / angleStep) % N;
  const currentFrontDish = items[currentFrontIndex];

  return (
    <div
      onWheel={handleWheel}
      className={cn(
        "w-full flex flex-col items-center justify-between relative select-none gap-6 sm:gap-8 pb-10",
        className
      )}
    >
      {/* 1. 3D CYLINDER ROTATING STAGE WITH FLOOR REFLECTIONS */}
      <div
        className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] flex items-center justify-center overflow-visible"
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Soft Ambient Light Base Below Cylinder */}
        <div className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 w-[480px] sm:w-[680px] h-24 bg-gradient-to-r from-red-600/30 via-orange-500/40 to-amber-400/30 blur-3xl rounded-full" />

        {/* 3D Perspective Viewport */}
        <div
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{
            perspective: isMobile ? "920px" : "1300px",
            perspectiveOrigin: "50% 48%",
          }}
        >
          {/* Rotating Cylinder Core */}
          <div
            className="relative w-0 h-0 [transform-style:preserve-3d] will-change-transform transition-transform duration-75"
            style={{
              transform: `translateZ(-${radius}px) rotateY(${rotationY}deg)`,
            }}
          >
            {items.map((dish, i) => {
              const itemAngle = i * angleStep;
              // Calculate facing angle
              const currentAngle = ((itemAngle + rotationY) % 360 + 360) % 360;
              const isFront = currentAngle < 55 || currentAngle > 305;
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
                    "group absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[30px] sm:rounded-[36px] overflow-hidden cursor-pointer",
                    "border border-orange-500/40 bg-[#0d0706] shadow-2xl transition-all duration-200",
                    isFront
                      ? "opacity-100 ring-2 ring-orange-400/80 border-orange-400 shadow-[0_20px_50px_rgba(249,115,22,0.4)] scale-105"
                      : "opacity-80 hover:opacity-100 hover:scale-105 hover:border-orange-400"
                  )}
                  style={{
                    width: `${cardWidth}px`,
                    aspectRatio: "7/10",
                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    // Glass floor reflection underneath each card
                    WebkitBoxReflect:
                      "below 14px linear-gradient(to bottom, transparent 65%, rgba(249, 115, 22, 0.32) 100%)",
                  }}
                >
                  {/* Dish Image Background */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0504] via-[#0a0504]/45 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/25 via-orange-500/15 to-transparent mix-blend-color-dodge" />
                  </div>

                  {/* Top Bar Badges */}
                  <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between w-full pointer-events-none">
                    {dish.isSignature ? (
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif tracking-wider uppercase px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[11px] sm:text-xs shadow-lg shadow-red-500/40 border-0 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                        Signature
                      </Badge>
                    ) : (
                      <span className="text-[11px] sm:text-xs font-serif uppercase tracking-widest text-orange-200 bg-neutral-950/85 px-3 py-1 rounded-full border border-orange-500/30 backdrop-blur-md">
                        {dish.category}
                      </span>
                    )}

                    <div className="flex items-center gap-1 bg-neutral-950/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-orange-500/30 text-amber-300 text-xs sm:text-sm font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>

                  {/* Hover / Front Quick Action Indicator */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-all duration-200",
                      isHovered || isFront ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    )}
                  >
                    <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white font-serif tracking-widest uppercase px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-2xl shadow-red-500/60 border border-orange-200/60 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>CLICK TO ORDER</span>
                    </span>
                  </div>

                  {/* Bottom Dish Information */}
                  <div className="absolute bottom-0 inset-x-0 z-10 p-4 sm:p-6 pt-12 bg-gradient-to-t from-[#0a0504] via-[#0a0504]/95 to-transparent flex flex-col justify-end pointer-events-none">
                    <h3 className="text-base sm:text-xl font-serif font-bold text-white tracking-wide truncate group-hover:text-orange-300 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 mt-1 font-light leading-snug">
                      {dish.description}
                    </p>

                    <div className="mt-3.5 pt-2.5 border-t border-orange-500/25 flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs sm:text-sm font-serif text-orange-400 font-bold">$</span>
                        <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-serif">
                          {dish.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-orange-200/70 font-mono">
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
      </div>

      {/* 2. GLOWING NAVIGATION CONTROLS & ACTIVE DISH QUICK BAR */}
      <div className="relative z-40 w-full max-w-xl px-4 flex flex-col items-center gap-4 mt-6">
        {/* Previous & Next Stepper Buttons */}
        <div className="flex items-center justify-between w-full max-w-md">
          <button
            type="button"
            aria-label="Rotate Previous Dish"
            onClick={() => stepRotate("prev")}
            className={cn(
              "group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer",
              "bg-neutral-950/90 backdrop-blur-xl border border-orange-500/50 text-orange-200 shadow-[0_0_25px_rgba(249,115,22,0.4)]",
              "hover:scale-110 hover:border-orange-400 hover:text-white hover:shadow-[0_0_35px_rgba(249,115,22,0.8)] active:scale-95"
            )}
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Center Quick Tap Current Dish Badge */}
          {currentFrontDish && (
            <button
              type="button"
              onClick={() => onSelectItem(currentFrontDish)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-950/90 border border-orange-500/40 hover:border-orange-400 hover:scale-105 transition-all shadow-lg text-left cursor-pointer group"
            >
              <img
                src={currentFrontDish.image}
                alt={currentFrontDish.name}
                className="w-7 h-7 rounded-full object-cover border border-orange-400/60"
              />
              <div className="flex flex-col">
                <span className="text-xs font-serif font-bold text-white group-hover:text-orange-300 transition-colors truncate max-w-[140px] sm:max-w-[200px]">
                  {currentFrontDish.name}
                </span>
                <span className="text-[10px] text-amber-400 font-serif font-bold">
                  ${currentFrontDish.price} &bull; Tap to View
                </span>
              </div>
            </button>
          )}

          <button
            type="button"
            aria-label="Rotate Next Dish"
            onClick={() => stepRotate("next")}
            className={cn(
              "group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer",
              "bg-neutral-950/90 backdrop-blur-xl border border-orange-500/50 text-orange-200 shadow-[0_0_25px_rgba(249,115,22,0.4)]",
              "hover:scale-110 hover:border-orange-400 hover:text-white hover:shadow-[0_0_35px_rgba(249,115,22,0.8)] active:scale-95"
            )}
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Quick-Jump Miniature Thumbnail Navigation Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full px-3 py-1.5 scrollbar-none bg-neutral-950/80 backdrop-blur-md rounded-full border border-orange-500/30 shadow-lg">
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Jump to ${item.name}`}
              onClick={() => bringToFront(idx, false)}
              className={cn(
                "relative rounded-full transition-all duration-200 shrink-0 overflow-hidden cursor-pointer",
                currentFrontIndex === idx
                  ? "w-8 h-8 ring-2 ring-orange-400 scale-110 shadow-lg shadow-orange-500/50"
                  : "w-6 h-6 opacity-60 hover:opacity-100 hover:scale-110 hover:ring-1 hover:ring-amber-300"
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