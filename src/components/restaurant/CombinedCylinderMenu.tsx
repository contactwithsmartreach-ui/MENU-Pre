"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MenuItem } from "@/types/restaurant";
import { cn } from "@/lib/utils";
import {
  Star,
  Eye,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
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
  const N = Math.max(items.length, 1);
  const angleStep = 360 / N;

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFrontIndex, setActiveFrontIndex] = useState<number>(0);
  const [isSwitchingCategory, setIsSwitchingCategory] = useState(false);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 390
  );

  // High-performance refs
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

  // Responsive sizing
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setViewportWidth(w);
      setIsMobile(w < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardWidth = isMobile
    ? Math.min(Math.round(viewportWidth * 0.70), 250)
    : 280;

  const cardHeight = Math.round(cardWidth * 1.35);

  const radius =
    Math.round(cardWidth / (2 * Math.tan(Math.PI / Math.max(N, 3)))) +
    (isMobile ? 15 : 30);

  // Direct transform setter using will-change and translate3d for GPU acceleration
  const setTransform = useCallback(
    (deg: number) => {
      currentRotationRef.current = deg;
      if (cylinderRef.current) {
        cylinderRef.current.style.transform = `translate3d(0, 0, -${radius}px) rotateY(${deg}deg)`;
      }
    },
    [radius]
  );

  // Smooth Category Switch Effect
  const prevItemsRef = useRef(items);
  useEffect(() => {
    if (prevItemsRef.current !== items) {
      prevItemsRef.current = items;
      setIsSwitchingCategory(true);
      setActiveFrontIndex(0);
      currentRotationRef.current = 0;
      targetRotationRef.current = 0;
      velocityRef.current = 0;
      isTransitioningToTargetRef.current = false;
      setTransform(0);

      const timer = setTimeout(() => {
        setIsSwitchingCategory(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [items, setTransform]);

  // RequestAnimationFrame animation loop with throttled calculations
  useEffect(() => {
    let lastTime = performance.now();
    let lastCalculatedFront = 0;

    const renderLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;

      if (isDraggingRef.current && isHorizontalDragRef.current) {
        setTransform(currentRotationRef.current);
      } else if (isTransitioningToTargetRef.current) {
        const diff = targetRotationRef.current - currentRotationRef.current;
        if (Math.abs(diff) > 0.05) {
          currentRotationRef.current += diff * Math.min(10.0 * dt, 0.3);
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
          velocityRef.current *= 0.92;
          setTransform(currentRotationRef.current);
        } else if (isAutoSpinningRef.current && hoveredIdx === null && !isSwitchingCategory) {
          const ambientSpeed = 2.0;
          currentRotationRef.current += ambientSpeed * dt;
          targetRotationRef.current = currentRotationRef.current;
          setTransform(currentRotationRef.current);
        }
      }

      const normalizedRot = ((-currentRotationRef.current % 360) + 360) % 360;
      const currentFront = Math.round(normalizedRot / angleStep) % N;
      if (currentFront !== lastCalculatedFront) {
        lastCalculatedFront = currentFront;
        setActiveFrontIndex(currentFront);
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [hoveredIdx, isSwitchingCategory, setTransform, angleStep, N]);

  const rotateToIndex = useCallback(
    (index: number, openModal = false, item?: MenuItem) => {
      if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current);
      isAutoSpinningRef.current = false;
      velocityRef.current = 0;
      isTransitioningToTargetRef.current = true;

      setActiveFrontIndex(index);

      const targetAngle = -index * angleStep;
      const current = currentRotationRef.current;
      const diff = (((targetAngle - current + 180) % 360) + 360) % 360 - 180;
      targetRotationRef.current = current + diff;

      if (openModal && item) {
        onSelectItem(item);
      }

      autoResumeTimeoutRef.current = setTimeout(() => {
        isAutoSpinningRef.current = true;
      }, 4000);
    },
    [angleStep, onSelectItem]
  );

  const stepRotate = useCallback(
    (direction: "prev" | "next") => {
      const newActive =
        direction === "next"
          ? (activeFrontIndex + 1) % N
          : (activeFrontIndex - 1 + N) % N;

      rotateToIndex(newActive, false, items[newActive]);
    },
    [activeFrontIndex, N, rotateToIndex, items]
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
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 6) {
        isDraggingRef.current = false;
        return;
      }
      if (Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
        isHorizontalDragRef.current = true;
        isAutoSpinningRef.current = false;
      }
    }

    if (isHorizontalDragRef.current) {
      const stepX = e.clientX - lastPointerXRef.current;
      dragDistanceRef.current += Math.abs(stepX);

      const now = performance.now();
      const dt = Math.max(now - lastPointerTimeRef.current, 8);
      const instantVelocity = (stepX / dt) * 8;

      const sensitivity = isMobile ? 0.22 : 0.14;
      currentRotationRef.current -= stepX * sensitivity;
      targetRotationRef.current = currentRotationRef.current;

      velocityRef.current =
        velocityRef.current * 0.3 - instantVelocity * 0.7 * sensitivity;

      lastPointerXRef.current = e.clientX;
      lastPointerTimeRef.current = now;
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current && !isHorizontalDragRef.current) return;
    isDraggingRef.current = false;
    isHorizontalDragRef.current = false;

    velocityRef.current = Math.max(Math.min(velocityRef.current, 1.8), -1.8);

    autoResumeTimeoutRef.current = setTimeout(() => {
      isAutoSpinningRef.current = true;
    }, 3500);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 4) {
      if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current);
      isAutoSpinningRef.current = false;
      isTransitioningToTargetRef.current = false;

      const impulse = (e.deltaX > 0 ? -1 : 1) * Math.min(Math.abs(e.deltaX) * 0.01, 0.3);
      velocityRef.current += impulse;

      autoResumeTimeoutRef.current = setTimeout(() => {
        isAutoSpinningRef.current = true;
      }, 3500);
    }
  };

  const handleCardClick = (dish: MenuItem, index: number) => {
    if (dragDistanceRef.current > 8) return;
    rotateToIndex(index, false);
    onSelectItem(dish);
  };

  const currentFrontDish = items[activeFrontIndex] || items[0];

  return (
    <div
      onWheel={handleWheel}
      className={cn(
        "w-full flex flex-col items-center justify-start relative select-none gap-2 sm:gap-4 pb-6 overflow-visible",
        className
      )}
    >
      {/* 3D Cylinder Stage */}
      <div
        className="relative w-full min-h-[540px] sm:min-h-[620px] md:min-h-[680px] flex items-center justify-center overflow-visible touch-pan-y cursor-grab active:cursor-grabbing pt-4 pb-32"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Floor Reflection Gradient Pool */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[600px] h-24 bg-gradient-to-r from-red-600/20 via-orange-500/25 to-amber-400/20 blur-2xl rounded-full opacity-70" />

        <div
          className={cn(
            "relative w-full h-full flex items-center justify-center [perspective-origin:50%_40%] transition-opacity duration-150 overflow-visible",
            isSwitchingCategory ? "opacity-30 scale-95" : "opacity-100 scale-100"
          )}
          style={{
            perspective: isMobile ? "900px" : "1300px",
          }}
        >
          {/* Rotating Cylinder Core with will-change-transform */}
          <div
            ref={cylinderRef}
            className="relative w-0 h-0 [transform-style:preserve-3d] will-change-transform transform-gpu overflow-visible"
            style={{
              transform: `translate3d(0, 0, -${radius}px) rotateY(${currentRotationRef.current}deg)`,
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
                    "group absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[22px] sm:rounded-[28px] overflow-hidden cursor-pointer",
                    "border border-orange-500/30 bg-[#0d0706] shadow-xl transition-colors duration-150 transform-gpu",
                    "hover:border-orange-400 hover:shadow-[0_15px_40px_rgba(249,115,22,0.4)] active:scale-[0.98]",
                    isHovered && "z-30"
                  )}
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    // Preserved smooth high-end reflection
                    WebkitBoxReflect:
                      "below 6px linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.2) 80%, rgba(249, 115, 22, 0.35) 100%)",
                  }}
                >
                  {/* Dish Image Background */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0504] via-[#0a0504]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/25 via-orange-500/15 to-transparent mix-blend-color-dodge opacity-80" />
                  </div>

                  {/* Top Bar Badges */}
                  <div className="relative z-10 p-3 sm:p-3.5 flex items-center justify-between w-full pointer-events-none">
                    {dish.isSignature ? (
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[10px] shadow-sm border-0 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
                        Signature
                      </Badge>
                    ) : (
                      <span className="text-[10px] font-serif uppercase tracking-widest text-orange-200 bg-neutral-950/85 px-2.5 py-0.5 rounded-full border border-orange-500/30 backdrop-blur-md">
                        {dish.category}
                      </span>
                    )}

                    <div className="flex items-center gap-1 bg-neutral-950/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-orange-500/30 text-amber-300 text-[11px] font-bold shadow-sm">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>

                  {/* Hover Badge */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-opacity duration-150",
                      isHovered ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white font-serif tracking-widest uppercase px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg border border-orange-200/50 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>ORDER</span>
                    </span>
                  </div>

                  {/* Bottom Dish Information */}
                  <div className="absolute bottom-0 inset-x-0 z-10 p-3 sm:p-4 pt-6 bg-gradient-to-t from-[#0a0504] via-[#0a0504]/95 to-transparent flex flex-col justify-end pointer-events-none">
                    <h3 className="text-sm sm:text-base font-serif font-bold text-white tracking-wide truncate group-hover:text-orange-300 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-300 line-clamp-2 mt-0.5 font-light leading-relaxed">
                      {dish.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-orange-500/25 flex items-center justify-between">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[10px] font-serif text-orange-400 font-bold">$</span>
                        <span className="text-base sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-serif">
                          {dish.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs text-orange-200/70 font-mono">
                          {dish.prepTime}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center text-orange-300 group-hover:bg-orange-500 group-hover:text-neutral-950 transition-colors shadow-sm">
                          <Plus className="w-3 h-3 stroke-[2.5]" />
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

      {/* Floating Controls */}
      <div className="relative z-40 w-full max-w-3xl px-4 flex flex-col items-center gap-3 sm:gap-4 mt-4 sm:mt-6 pb-4">
        <div className="relative w-full max-w-xl flex items-center justify-between px-1 sm:px-6">
          {/* Previous Button */}
          <button
            type="button"
            aria-label="Rotate Previous Dish"
            onClick={() => stepRotate("prev")}
            style={{
              WebkitBoxReflect:
                "below 0px linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.3))",
            }}
            className="w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg group-hover:shadow-xl shadow-red-600 relative overflow-hidden group text-transparent cursor-pointer z-10 after:absolute after:rounded-full after:bg-red-200 after:h-[85%] after:w-[95%] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 hover:saturate-[1.15] active:saturate-[1.4]"
          >
            <ChevronLeft className="absolute z-40 w-5 h-5 text-neutral-950 stroke-[3] transition-transform duration-200 group-hover:scale-110" />
            <svg
              className="absolute w-full h-full scale-x-125 rotate-180 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 group-hover:animate-none animate-pulse group-hover:-translate-y-[45%] transition-all duration-300 pointer-events-none"
              viewBox="0 0 2400 800"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="sssurf-grad-prev" y2="100%" x2="50%" y1="0%" x1="50%">
                  <stop offset="0%" stopOpacity="1" stopColor="hsl(37, 99%, 67%)"></stop>
                  <stop offset="100%" stopOpacity="1" stopColor="hsl(316, 73%, 52%)"></stop>
                </linearGradient>
              </defs>
              <g transform="matrix(1,0,0,1,0,-91.0877685546875)" fill="url(#sssurf-grad-prev)">
                <path
                  opacity="0.84"
                  transform="matrix(1,0,0,1,0,210)"
                  d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z"
                ></path>
              </g>
            </svg>
          </button>

          {/* Center Front Dish Display */}
          {currentFrontDish && (
            <button
              type="button"
              onClick={() => onSelectItem(currentFrontDish)}
              className="flex flex-col items-center justify-center text-center cursor-pointer group px-3 py-1 transition-transform hover:scale-105"
            >
              <span className="text-sm sm:text-base font-serif font-bold text-white tracking-wide group-hover:text-orange-300 transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] truncate max-w-[190px] sm:max-w-xs">
                {currentFrontDish.name}
              </span>
              <span className="text-xs text-amber-400 font-serif font-semibold mt-0.5 tracking-wider drop-shadow-md flex items-center gap-1.5">
                <span>${currentFrontDish.price}</span>
                <span className="text-orange-400/60">&bull;</span>
                <span className="text-orange-300/90 underline underline-offset-4">Click to Order</span>
              </span>
            </button>
          )}

          {/* Next Button */}
          <button
            type="button"
            aria-label="Rotate Next Dish"
            onClick={() => stepRotate("next")}
            style={{
              WebkitBoxReflect:
                "below 0px linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.3))",
            }}
            className="w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg group-hover:shadow-xl shadow-red-600 relative overflow-hidden group text-transparent cursor-pointer z-10 after:absolute after:rounded-full after:bg-red-200 after:h-[85%] after:w-[95%] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 hover:saturate-[1.15] active:saturate-[1.4]"
          >
            <ChevronRight className="absolute z-40 w-5 h-5 text-neutral-950 stroke-[3] transition-transform duration-200 group-hover:scale-110" />
            <svg
              className="absolute w-full h-full scale-x-125 rotate-180 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 group-hover:animate-none animate-pulse group-hover:-translate-y-[45%] transition-all duration-300 pointer-events-none"
              viewBox="0 0 2400 800"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="sssurf-grad-next" y2="100%" x2="50%" y1="0%" x1="50%">
                  <stop offset="0%" stopOpacity="1" stopColor="hsl(37, 99%, 67%)"></stop>
                  <stop offset="100%" stopOpacity="1" stopColor="hsl(316, 73%, 52%)"></stop>
                </linearGradient>
              </defs>
              <g transform="matrix(1,0,0,1,0,-91.0877685546875)" fill="url(#sssurf-grad-next)">
                <path
                  opacity="1"
                  transform="matrix(1,0,0,1,0,245)"
                  d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z"
                ></path>
              </g>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}