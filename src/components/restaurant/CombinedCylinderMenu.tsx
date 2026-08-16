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

  const cardWidth = isMobile ? 210 : 290;
  // Radius calculation in pixels for stable, hit-testable positive translateZ
  const radius = Math.round((cardWidth / 2) / Math.tan(Math.PI / Math.max(N, 1))) + (isMobile ? 30 : 60);

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
      }, 350);
    }
  }, []);

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
      const duration = 300;
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

  const stepRotate = useCallback(
    (direction: "prev" | "next") => {
      const newActive = direction === "next"
        ? (selectedDishIndex + 1) % N
        : (selectedDishIndex - 1 + N) % N;

      bringToFront(newActive, false, items[newActive]);
    },
    [selectedDishIndex, N, bringToFront, items]
  );

  // Auto-spin RAF loop
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

  // Direct Card Click Handler (Guaranteed click execution)
  const handleCardClick = (dish: MenuItem, index: number) => {
    if (hasDraggedRef.current) return;
    setSelectedDishIndex(index);
    scrollCardToCenter(index);
    onSelectItem(dish);
  };

  // Drag handlers on background stage
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

  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-between relative select-none gap-3 sm:gap-5",
        className
      )}
    >
      {/* 1. UPPER STAGE: 3D Cylinder Gastronomy Carousel with raycast-safe positive geometry */}
      <div
        className="relative w-full min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden"
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            perspective: isMobile ? "900px" : "1200px",
            perspectiveOrigin: "50% 50%",
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
              // Calculate if card is currently facing towards the viewer
              const currentAngle = ((itemAngle + rotationY) % 360 + 360) % 360;
              const isFront = currentAngle < 65 || currentAngle > 295;

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
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[28px] sm:rounded-[34px] overflow-hidden cursor-pointer",
                    "border border-orange-500/30 bg-[#0d0706] shadow-2xl transition-all duration-200",
                    isFront
                      ? "opacity-100 ring-1 ring-orange-400/40 hover:scale-105 hover:border-orange-400 hover:ring-2 hover:ring-orange-400/80"
                      : "opacity-75 hover:opacity-100 hover:scale-105"
                  )}
                  style={{
                    width: `${cardWidth}px`,
                    aspectRatio: "7/10",
                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {/* Dish Image */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                  </div>

                  {/* Top Bar */}
                  <div className="relative z-10 p-3.5 sm:p-5 flex items-center justify-between w-full pointer-events-none">
                    {dish.isSignature ? (
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif tracking-wider uppercase px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[11px] sm:text-xs shadow-md border-0">
                        <Flame className="w-3.5 h-3.5 fill-current mr-1 text-amber-200" />
                        Signature
                      </Badge>
                    ) : (
                      <span className="text-[11px] sm:text-xs font-serif uppercase tracking-widest text-orange-200 bg-neutral-950/80 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-orange-500/30">
                        {dish.category}
                      </span>
                    )}

                    <div className="flex items-center gap-1 bg-neutral-950/90 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-orange-500/30 text-amber-300 text-xs sm:text-sm font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>

                  {/* Callout Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                    <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white font-serif tracking-widest uppercase px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 border border-orange-200/50">
                      <Eye className="w-4 h-4" />
                      <span>VIEW DISH</span>
                    </span>
                  </div>

                  {/* Bottom Details */}
                  <div className="absolute bottom-0 inset-x-0 z-10 p-4 sm:p-6 pt-10 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent flex flex-col justify-end pointer-events-none">
                    <h3 className="text-base sm:text-lg lg:text-xl font-serif font-bold text-white tracking-wide truncate">
                      {dish.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 mt-1 font-light leading-snug">
                      {dish.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-orange-500/20 flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs sm:text-sm font-serif text-orange-400 font-bold">$</span>
                        <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif">
                          {dish.price}
                        </span>
                      </div>

                      <span className="text-xs sm:text-sm text-orange-200/70 font-mono">
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

      {/* 2. GAP CONTROLS: Left and Right vibrant full orange stepper buttons */}
      <div className="relative z-40 w-full max-w-xl px-4 flex items-center justify-between my-2">
        {/* Left Full Orange Button */}
        <div className="relative group">
          <button
            type="button"
            aria-label="Rotate Previous Dish"
            onClick={() => stepRotate("prev")}
            className={cn(
              "relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-transform duration-150 cursor-pointer",
              "bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-neutral-950 font-black",
              "border-2 border-amber-300/80 shadow-[0_0_20px_rgba(249,115,22,0.6)] active:scale-95 hover:scale-105"
            )}
          >
            <ChevronLeft className="w-6 h-6 text-neutral-950 stroke-[3]" />
          </button>
        </div>

        {/* Right Full Orange Button */}
        <div className="relative group">
          <button
            type="button"
            aria-label="Rotate Next Dish"
            onClick={() => stepRotate("next")}
            className={cn(
              "relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-transform duration-150 cursor-pointer",
              "bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-neutral-950 font-black",
              "border-2 border-amber-300/80 shadow-[0_0_20px_rgba(249,115,22,0.6)] active:scale-95 hover:scale-105"
            )}
          >
            <ChevronRight className="w-6 h-6 text-neutral-950 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* 3. LOWER STAGE: Sideways Cards Runway */}
      <div className="w-full max-w-7xl px-2 sm:px-4 flex flex-col items-center [contain:content]">
        <div
          ref={runwayRef}
          onScroll={handleRunwayScroll}
          className="w-full flex items-end gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-4 sm:py-6 snap-x snap-mandatory scroll-smooth px-[calc(50%-100px)] sm:px-[calc(50%-125px)]"
        >
          {items.map((dish, index) => {
            const isSelected = selectedDishIndex === index;

            return (
              <div
                key={dish.id}
                data-dish-card
                onClick={() => {
                  setSelectedDishIndex(index);
                  scrollCardToCenter(index);
                  bringToFront(index, false);
                  onSelectItem(dish);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedDishIndex(index);
                    scrollCardToCenter(index);
                    bringToFront(index, false);
                    onSelectItem(dish);
                  }
                }}
                className={cn(
                  "group relative shrink-0 cursor-pointer transition-all duration-300 ease-out snap-center select-none flex flex-col items-center will-change-transform transform-gpu",
                  isSelected
                    ? "w-[210px] sm:w-[260px] z-30 scale-105 sm:scale-110 -translate-y-1"
                    : "w-[145px] sm:w-[175px] z-10 scale-95 opacity-60 hover:opacity-100 hover:scale-100"
                )}
              >
                {/* OUTSIDE CARD TITLE */}
                <div className="w-full text-center mb-2 px-1">
                  <h4
                    className={cn(
                      "text-white font-sans font-black leading-none uppercase line-clamp-1 transition-opacity",
                      isSelected
                        ? "text-base sm:text-lg md:text-xl tracking-wider opacity-100 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                        : "text-xs sm:text-sm tracking-wide opacity-75 group-hover:opacity-100"
                    )}
                  >
                    {dish.name}
                  </h4>
                </div>

                {/* Card Shell */}
                <div
                  className={cn(
                    "relative w-full rounded-t-[26px] rounded-b-[16px] overflow-hidden p-3 flex flex-col justify-between transition-all duration-200",
                    "bg-[#1c0e2d] border-t-2 border-x",
                    isSelected
                      ? "border-t-amber-300 border-x-purple-400/80 shadow-2xl ring-1 ring-amber-400/30"
                      : "border-t-purple-400/30 border-x-purple-500/20 shadow-md group-hover:border-purple-400/60"
                  )}
                >
                  {/* Dish Image */}
                  <div
                    className={cn(
                      "relative w-full rounded-[18px] overflow-hidden mb-2.5 transition-all duration-200 z-10",
                      isSelected
                        ? "h-32 sm:h-40 ring-1 ring-purple-400/50"
                        : "h-22 sm:h-26"
                    )}
                  >
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120722] via-transparent to-transparent" />

                    {dish.isSignature ? (
                      <span
                        className={cn(
                          "absolute top-2 left-2 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white font-serif uppercase tracking-wider font-bold shadow px-2 py-0.5 text-[9px] flex items-center gap-1"
                        )}
                      >
                        <Sparkles className="w-2.5 h-2.5 text-amber-200" />
                        Signature
                      </span>
                    ) : (
                      isSelected && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#180a2b]/90 border border-purple-400/40 text-purple-200 font-serif text-[9px] uppercase tracking-wider">
                          {dish.category}
                        </span>
                      )
                    )}

                    <div className="absolute bottom-2 right-2 flex items-center gap-0.5 text-amber-300 text-[10px] font-bold bg-[#120722]/90 px-1.5 py-0.5 rounded-md border border-purple-500/30">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>

                  {/* Info Text */}
                  <div className="flex-1 flex flex-col justify-between relative z-10 px-1">
                    <div>
                      {isSelected ? (
                        <p className="text-[11px] text-purple-200 line-clamp-2 mt-0.5 font-light leading-snug">
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
                        "mt-2 pt-1.5 flex items-center justify-between",
                        isSelected ? "border-t border-purple-500/30" : "border-t border-purple-400/10"
                      )}
                    >
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs font-serif text-amber-400 font-bold">$</span>
                        <span
                          className={cn(
                            "font-serif font-extrabold tracking-tight",
                            isSelected
                              ? "text-lg sm:text-xl text-amber-300"
                              : "text-sm text-purple-200"
                          )}
                        >
                          {dish.price}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "rounded-full flex items-center justify-center transition-transform",
                          isSelected
                            ? "w-7 h-7 bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-md"
                            : "w-5 h-5 bg-purple-950/80 border border-purple-400/20 text-purple-300 group-hover:bg-orange-500 group-hover:text-neutral-950"
                        )}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Drip Graphic */}
                <div className="relative -mt-1 w-full pointer-events-none overflow-hidden">
                  <svg
                    viewBox="0 0 200 36"
                    preserveAspectRatio="none"
                    className="w-full h-7 sm:h-9"
                  >
                    <path
                      d="M 0,0 L 200,0 L 200,6 C 192,6 189,14 183,14 C 177,14 175,5 166,5 C 157,5 153,28 144,28 C 137,28 135,10 127,10 C 119,10 117,20 109,20 C 101,20 97,6 89,6 C 81,6 76,32 66,32 C 58,32 56,12 46,12 C 36,12 32,22 22,22 C 14,22 10,7 0,7 Z"
                      fill={isSelected ? "#7e22ce" : "#3b1754"}
                    />
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