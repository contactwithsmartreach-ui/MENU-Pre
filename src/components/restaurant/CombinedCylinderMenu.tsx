"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MenuItem } from "@/types/restaurant";
import { cn } from "@/lib/utils";
import {
  Star,
  PhoneCall,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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

  const cylinderRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
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
    ? Math.min(Math.round(viewportWidth * 0.68), 240)
    : 280;

  const cardHeight = Math.round(cardWidth * 1.35);

  const radius =
    Math.round(cardWidth / (2 * Math.tan(Math.PI / Math.max(N, 3)))) +
    (isMobile ? 12 : 24);

  const setTransform = useCallback(
    (deg: number) => {
      currentRotationRef.current = deg;
      if (cylinderRef.current) {
        cylinderRef.current.style.transform = `translate3d(0, 0, -${radius}px) rotateY(${deg}deg)`;
      }
    },
    [radius]
  );

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
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [items, setTransform]);

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
          currentRotationRef.current += diff * Math.min(14.0 * dt, 0.4);
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
          velocityRef.current *= 0.88;
          setTransform(currentRotationRef.current);
        } else if (isAutoSpinningRef.current && hoveredIdx === null && !isSwitchingCategory) {
          const ambientSpeed = 1.5;
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
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
        isDraggingRef.current = false;
        return;
      }
      if (Math.abs(deltaX) > 5 && Math.abs(deltaX) > Math.abs(deltaY)) {
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
        velocityRef.current * 0.2 - instantVelocity * 0.8 * sensitivity;

      lastPointerXRef.current = e.clientX;
      lastPointerTimeRef.current = now;
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current && !isHorizontalDragRef.current) return;
    isDraggingRef.current = false;
    isHorizontalDragRef.current = false;

    velocityRef.current = Math.max(Math.min(velocityRef.current, 1.5), -1.5);

    autoResumeTimeoutRef.current = setTimeout(() => {
      isAutoSpinningRef.current = true;
    }, 3000);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 3) {
      if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current);
      isAutoSpinningRef.current = false;
      isTransitioningToTargetRef.current = false;

      const impulse = (e.deltaX > 0 ? -1 : 1) * Math.min(Math.abs(e.deltaX) * 0.008, 0.25);
      velocityRef.current += impulse;

      autoResumeTimeoutRef.current = setTimeout(() => {
        isAutoSpinningRef.current = true;
      }, 3000);
    }
  };

  const handleCallOrder = (dish: MenuItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    toast.success(`Appel au 0659242630 pour commander ${dish.name}`, {
      description: `Prix : ${dish.price.toLocaleString()} DA • Connexion de l'appel...`,
    });
    window.location.href = "tel:0659242630";
  };

  const currentFrontDish = items[activeFrontIndex] || items[0];

  return (
    <div
      onWheel={handleWheel}
      className={cn(
        "w-full flex flex-col items-center justify-start relative select-none gap-2 sm:gap-4 pb-6 overflow-visible [content-visibility:auto]",
        className
      )}
    >
      <div
        ref={stageRef}
        className="relative w-full min-h-[500px] sm:min-h-[580px] md:min-h-[640px] flex items-center justify-center overflow-visible touch-pan-y cursor-grab active:cursor-grabbing pt-4 pb-28"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] max-w-[550px] h-20 bg-gradient-to-r from-red-600/15 via-orange-500/20 to-amber-400/15 blur-2xl rounded-full opacity-60" />

        <div
          className={cn(
            "relative w-full h-full flex items-center justify-center [perspective-origin:50%_40%] transition-opacity duration-100 overflow-visible",
            isSwitchingCategory ? "opacity-30 scale-95" : "opacity-100 scale-100"
          )}
          style={{
            perspective: isMobile ? "800px" : "1200px",
          }}
        >
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
                    rotateToIndex(i, false);
                    onSelectItem(dish);
                  }}
                  onMouseEnter={() => !isMobile && setHoveredIdx(i)}
                  onMouseLeave={() => !isMobile && setHoveredIdx(null)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      rotateToIndex(i, false);
                      onSelectItem(dish);
                    }
                  }}
                  className={cn(
                    "group absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[22px] sm:rounded-[26px] overflow-hidden cursor-pointer",
                    "border border-orange-500/30 bg-[#0d0706] shadow-lg transition-colors duration-150 transform-gpu [backface-visibility:hidden]",
                    "hover:border-orange-400 hover:shadow-[0_15px_35px_rgba(249,115,22,0.35)] active:scale-[0.98]",
                    isHovered && "z-30"
                  )}
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    transform: `translate3d(0,0,0) rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    WebkitBoxReflect:
                      "below 4px linear-gradient(to bottom, transparent 65%, rgba(0, 0, 0, 0.15) 85%, rgba(249, 115, 22, 0.25) 100%)",
                  }}
                >
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
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 via-orange-500/10 to-transparent mix-blend-color-dodge opacity-85" />
                  </div>

                  <div className="relative z-10 p-3 flex items-center justify-between w-full pointer-events-none">
                    {dish.isSignature ? (
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif tracking-wider uppercase px-2 py-0.5 rounded-full text-[10px] shadow-sm border-0 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
                        Signature
                      </Badge>
                    ) : (
                      <span className="text-[10px] font-serif uppercase tracking-widest text-orange-200 bg-neutral-950/85 px-2 py-0.5 rounded-full border border-orange-500/30 backdrop-blur-md">
                        {dish.category}
                      </span>
                    )}

                    <div className="flex items-center gap-1 bg-neutral-950/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-orange-500/30 text-amber-300 text-[11px] font-bold shadow-sm">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-150",
                      isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleCallOrder(dish, e)}
                      className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 text-white font-serif tracking-widest uppercase px-5 py-2.5 rounded-full text-xs font-bold shadow-xl border border-emerald-200/50 flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                      <span>COMMANDER</span>
                    </button>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 z-10 p-3 pt-5 bg-gradient-to-t from-[#0a0504] via-[#0a0504]/95 to-transparent flex flex-col justify-end pointer-events-none">
                    <h3 className="text-sm font-serif font-bold text-white tracking-wide truncate group-hover:text-orange-300 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-[11px] text-neutral-300 line-clamp-2 mt-0.5 font-light leading-snug">
                      {dish.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-orange-500/25 flex items-center justify-between pointer-events-auto">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-sm sm:text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-serif">
                          {dish.price.toLocaleString()} DA
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleCallOrder(dish, e)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 border border-green-400/50 text-white hover:brightness-110 transition-all shadow-sm cursor-pointer text-[10px] font-serif uppercase font-bold"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>COMMANDER</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-40 w-full max-w-3xl px-4 flex flex-col items-center gap-3 mt-2 pb-4">
        <div className="relative w-full max-w-xl flex items-center justify-between px-1 sm:px-6">
          <button
            type="button"
            aria-label="Plat Précédent"
            onClick={() => stepRotate("prev")}
            className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all text-neutral-950 cursor-pointer z-10"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-950 stroke-[3]" />
          </button>

          {currentFrontDish && (
            <div className="flex flex-col items-center justify-center text-center group px-3 py-1">
              <span className="text-sm sm:text-base font-serif font-bold text-white tracking-wide drop-shadow-md truncate max-w-[190px] sm:max-w-xs">
                {currentFrontDish.name}
              </span>
              <button
                type="button"
                onClick={(e) => handleCallOrder(currentFrontDish, e)}
                className="text-xs text-white font-serif font-semibold mt-1 tracking-wider flex items-center gap-1.5 bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-1.5 rounded-full border border-green-400/50 hover:brightness-110 transition-all cursor-pointer shadow-lg"
              >
                <PhoneCall className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>{currentFrontDish.price.toLocaleString()} DA &bull; COMMANDER</span>
              </button>
            </div>
          )}

          <button
            type="button"
            aria-label="Plat Suivant"
            onClick={() => stepRotate("next")}
            className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all text-neutral-950 cursor-pointer z-10"
          >
            <ChevronRight className="w-5 h-5 text-neutral-950 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}