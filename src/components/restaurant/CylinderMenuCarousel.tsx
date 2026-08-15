"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MenuItem } from "@/types/restaurant";
import { cn } from "@/lib/utils";
import { Star, Flame, Sparkles, ChevronRight, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface CylinderMenuCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MenuItem[];
  onSelectItem?: (item: MenuItem) => void;
  cardWidth?: number;
  autoSpinSpeed?: number;
  animationDuration?: number;
}

export const CylinderMenuCarousel = React.forwardRef<HTMLDivElement, CylinderMenuCarouselProps>(
  (
    {
      items,
      onSelectItem,
      className,
      cardWidth: customCardWidth,
      autoSpinSpeed,
      animationDuration,
      ...props
    },
    ref
  ) => {
    const N = items.length;
    const angleStep = 360 / N;
    const defaultSpeed = autoSpinSpeed ?? (animationDuration ? 360 / animationDuration : 8);

    const [rotationY, setRotationY] = useState(0);
    const [isAutoSpinning, setIsAutoSpinning] = useState(true);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Responsive card width
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 640);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const actualCardWidth = customCardWidth ?? (isMobile ? 220 : 280);

    // Gesture & physics refs
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const startYRef = useRef(0);
    const startRotRef = useRef(0);
    const lastXRef = useRef(0);
    const lastTimeRef = useRef(0);
    const velocityRef = useRef(0);
    const hasMovedRef = useRef(false);
    const animFrameRef = useRef<number | null>(null);
    const momentumFrameRef = useRef<number | null>(null);
    const smoothTargetRotRef = useRef<number | null>(null);

    // Smooth transition to a specific rotation angle (bringing card to front)
    const rotateToAngle = useCallback((targetAngle: number, onComplete?: () => void) => {
      if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
      velocityRef.current = 0;
      setIsAutoSpinning(false);

      // Find shortest rotation path
      let current = rotationY;
      let target = targetAngle;
      
      const diff = ((target - current + 180) % 360 + 360) % 360 - 180;
      const finalTarget = current + diff;

      const startTime = performance.now();
      const duration = 600; // ms
      const startAngle = current;

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const animateSnap = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);

        setRotationY(startAngle + (finalTarget - startAngle) * eased);

        if (progress < 1) {
          momentumFrameRef.current = requestAnimationFrame(animateSnap);
        } else {
          setRotationY(finalTarget);
          onComplete?.();
          // Resume slow auto spin after 4 seconds of inactivity
          setTimeout(() => {
            setIsAutoSpinning(true);
          }, 3500);
        }
      };

      momentumFrameRef.current = requestAnimationFrame(animateSnap);
    }, [rotationY]);

    // Bring specific card index to the front (0 degrees relative to viewer)
    const bringToFront = useCallback((index: number, openModal: boolean = false, item?: MenuItem) => {
      const targetAngle = -index * angleStep;
      rotateToAngle(targetAngle, () => {
        if (openModal && item) {
          onSelectItem?.(item);
        }
      });
    }, [angleStep, rotateToAngle, onSelectItem]);

    // Auto-spin animation loop
    useEffect(() => {
      let previousTimestamp = performance.now();

      const spinLoop = (timestamp: number) => {
        const delta = (timestamp - previousTimestamp) / 1000;
        previousTimestamp = timestamp;

        if (
          isAutoSpinning &&
          !isDraggingRef.current &&
          hoveredIdx === null &&
          Math.abs(velocityRef.current) < 0.05
        ) {
          setRotationY((prev) => (prev + defaultSpeed * delta) % 360);
        }

        animFrameRef.current = requestAnimationFrame(spinLoop);
      };

      animFrameRef.current = requestAnimationFrame(spinLoop);
      return () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    }, [isAutoSpinning, defaultSpeed, hoveredIdx]);

    // Apply smooth inertia gliding on release
    const applyMomentum = useCallback(() => {
      const decay = 0.93;
      const step = () => {
        if (Math.abs(velocityRef.current) > 0.06) {
          setRotationY((prev) => prev - velocityRef.current);
          velocityRef.current *= decay;
          momentumFrameRef.current = requestAnimationFrame(step);
        } else {
          velocityRef.current = 0;
        }
      };
      if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
      momentumFrameRef.current = requestAnimationFrame(step);
    }, []);

    // Pointer events
    const handlePointerDown = (e: React.PointerEvent) => {
      if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);

      isDraggingRef.current = true;
      hasMovedRef.current = false;
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
      lastXRef.current = e.clientX;
      lastTimeRef.current = performance.now();
      startRotRef.current = rotationY;
      velocityRef.current = 0;

      const target = e.currentTarget as HTMLElement;
      try {
        target.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - startXRef.current;
      const deltaY = e.clientY - startYRef.current;

      if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) > 6) {
        hasMovedRef.current = true;
      }

      const sensitivity = isMobile ? 0.44 : 0.35;
      const newRotation = startRotRef.current - deltaX * sensitivity;
      setRotationY(newRotation);

      const now = performance.now();
      const dt = Math.max(now - lastTimeRef.current, 8);
      const instantaneousVelocity = ((e.clientX - lastXRef.current) / dt) * 7;

      velocityRef.current = velocityRef.current * 0.35 + instantaneousVelocity * 0.65;
      lastXRef.current = e.clientX;
      lastTimeRef.current = now;
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }

      if (hasMovedRef.current && Math.abs(velocityRef.current) > 0.35) {
        applyMomentum();
      }
    };

    // Wheel listener for trackpads
    const handleWheel = (e: React.WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      setRotationY((prev) => prev + delta * 0.12);
    };

    // Active dish index calculated from rotation for indicator dots & highlights
    const normalizedRot = ((-rotationY % 360) + 360) % 360;
    const activeIndex = Math.round(normalizedRot / angleStep) % N;
    const activeItem = items[activeIndex];

    const customStyle = {
      "--n": N,
      "--w": `${actualCardWidth}px`,
      "--ba": `calc(1turn / var(--n))`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        onWheel={handleWheel}
        className={cn(
          "w-full h-full min-h-[600px] sm:min-h-[670px] flex flex-col items-center justify-center relative select-none touch-none",
          className
        )}
        {...props}
      >
        {/* 3D Cylinder Stage */}
        <div
          className="w-full flex-1 grid place-items-center cursor-grab active:cursor-grabbing overflow-visible py-2 sm:py-6 touch-none"
          style={{
            perspective: isMobile ? "40em" : "55em",
            maskImage:
              "linear-gradient(90deg, transparent 0%, #000 7% 93%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, #000 7% 93%, transparent 100%)",
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
                "below 14px linear-gradient(to bottom, transparent 50%, rgba(249, 115, 22, 0.2) 100%)",
            }}
          >
            {items.map((dish, i) => {
              // Calculate angular distance to front (0 degrees)
              const cardAngle = ((i * angleStep + rotationY) % 360 + 360) % 360;
              const angleFromFront = Math.min(cardAngle, 360 - cardAngle);
              const isFacingFront = angleFromFront < angleStep * 0.75;
              const isHovered = hoveredIdx === i;

              return (
                <div
                  key={dish.id}
                  onMouseEnter={() => !isMobile && setHoveredIdx(i)}
                  onMouseLeave={() => !isMobile && setHoveredIdx(null)}
                  onClick={(e) => {
                    if (hasMovedRef.current) {
                      e.preventDefault();
                      return;
                    }
                    if (isFacingFront) {
                      // Already in front, open detail modal
                      onSelectItem?.(dish);
                    } else {
                      // Bring this card straight to the front!
                      bringToFront(i, false);
                    }
                  }}
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
                      ? "border-orange-400 shadow-[0_20px_50px_rgba(249,115,22,0.5)] ring-2 ring-orange-500/50 scale-105"
                      : "border-orange-500/25 shadow-[0_10px_25px_rgba(0,0,0,0.5)] opacity-80 hover:opacity-100 hover:border-orange-400 hover:scale-102"
                  )}
                  style={{
                    width: "var(--w)",
                    aspectRatio: "7/10",
                    "--i": i,
                    transform:
                      "rotateY(calc(var(--i) * var(--ba))) translateZ(calc(-1 * (0.5 * var(--w) + 0.5em) / tan(0.5 * var(--ba))))",
                  } as React.CSSProperties}
                >
                  {/* Dish image */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 via-orange-500/20 to-pink-500/10 mix-blend-color-dodge" />
                  </div>

                  {/* Top Bar */}
                  <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between w-full pointer-events-none">
                    {dish.isSignature ? (
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif tracking-wider uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] shadow-lg shadow-red-500/30 border-0">
                        <Flame className="w-3.5 h-3.5 fill-current mr-1 text-amber-200 animate-pulse" />
                        Sahara Pick
                      </Badge>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] font-serif uppercase tracking-widest text-orange-200 bg-neutral-950/80 px-2.5 py-0.5 sm:py-1 rounded-full backdrop-blur-md border border-orange-500/30">
                        {dish.category}
                      </span>
                    )}

                    <div className="flex items-center gap-1 bg-neutral-950/85 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-orange-500/30 text-amber-300 text-[11px] sm:text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>

                  {/* Centered Pick Button on Front Card or Hover */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center z-20 transition-all duration-300 pointer-events-none",
                      isFacingFront || isHovered
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-90"
                    )}
                  >
                    <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white font-serif tracking-widest uppercase px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-xl shadow-red-600/50 border border-orange-200/50 flex items-center gap-1.5">
                      {isFacingFront ? <Eye className="w-3.5 h-3.5" /> : null}
                      <span>{isFacingFront ? "TAP TO PICK" : "ROTATE TO FRONT"}</span>
                    </span>
                  </div>

                  {/* Bottom Dish Information */}
                  <div className="absolute bottom-0 inset-x-0 z-10 p-3.5 sm:p-5 pt-10 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent flex flex-col justify-end pointer-events-none">
                    <h3 className="text-sm sm:text-base font-serif font-bold text-white tracking-wide truncate group-hover:text-orange-300 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-300/85 line-clamp-1 mt-0.5 font-light">
                      {dish.description}
                    </p>

                    <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-orange-500/20 flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[11px] sm:text-xs font-serif text-orange-400 font-bold">$</span>
                        <span className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-serif tracking-tight">
                          {dish.price}
                        </span>
                      </div>

                      <span className="text-[10px] sm:text-xs text-orange-200/70 font-mono tracking-wider">
                        {dish.prepTime}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Pick Front Focal Bar: Always displays the current front card and allows 1-tap view */}
        {activeItem && (
          <div className="relative z-30 mb-2 flex items-center justify-center">
            <button
              type="button"
              onClick={() => onSelectItem?.(activeItem)}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-950/90 border border-orange-500/40 text-left hover:border-orange-400 transition-all shadow-lg shadow-orange-500/20 group active:scale-95"
            >
              <img
                src={activeItem.image}
                alt={activeItem.name}
                className="w-7 h-7 rounded-full object-cover border border-orange-400/50"
              />
              <div className="flex flex-col">
                <span className="text-xs font-serif font-bold text-white group-hover:text-orange-300 transition-colors">
                  {activeItem.name}
                </span>
                <span className="text-[10px] text-orange-400 font-serif font-bold">
                  ${activeItem.price} • Tap to customize
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform ml-1" />
            </button>
          </div>
        )}

        {/* Swipe Indicators / Quick Jump Dots */}
        <div className="relative z-30 flex items-center gap-1.5 mt-1">
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Jump to ${item.name}`}
              onClick={() => bringToFront(idx, false)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                activeIndex === idx
                  ? "w-6 bg-gradient-to-r from-red-500 to-orange-400 shadow-md shadow-orange-500/50"
                  : "w-1.5 bg-orange-500/30 hover:bg-orange-500/60"
              )}
            />
          ))}
        </div>
      </div>
    );
  }
);

CylinderMenuCarousel.displayName = "CylinderMenuCarousel";