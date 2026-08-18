"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MenuItem } from "@/types/restaurant";
import { cn } from "@/lib/utils";
import { Star, Eye, Plus, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
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

  const [activeItem, setActiveItem] = useState<MenuItem>(items[0] || null);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 390
  );

  const cylinderRef = useRef<HTMLDivElement>(null);
  const currentRotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isHorizontalDragRef = useRef(false);
  const isAutoSpinningRef = useRef(true);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const autoResumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setViewportWidth(w);
      setIsMobile(w < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardWidth = isMobile
    ? Math.min(Math.round(viewportWidth * 0.7), 260)
    : 280;

  const cardHeight = Math.round(cardWidth * 1.36);

  const radius =
    Math.round(cardWidth / (2 * Math.tan(Math.PI / Math.max(N, 3)))) +
    (isMobile ? 16 : 28);

  const setTransform = useCallback(
    (deg: number) => {
      currentRotationRef.current = deg;
      if (cylinderRef.current) {
        cylinderRef.current.style.transform = `translate3d(0, 0, -${radius}px) rotateY(${deg}deg)`;
      }
    },
    [radius]
  );

  useEffect(() => {
    currentRotationRef.current = 0;
    targetRotationRef.current = 0;
    velocityRef.current = 0;
    isTransitioningRef.current = false;
    activeIndexRef.current = 0;
    setActiveItem(items[0] || null);
    setTransform(0);
  }, [items, setTransform]);

  useEffect(() => {
    let lastTime = performance.now();
    let lastIndex = 0;

    const renderLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;

      if (isDraggingRef.current && isHorizontalDragRef.current) {
        setTransform(currentRotationRef.current);
      } else if (isTransitioningRef.current) {
        const diff = targetRotationRef.current - currentRotationRef.current;
        if (Math.abs(diff) > 0.05) {
          currentRotationRef.current += diff * Math.min(10.0 * dt, 0.28);
          setTransform(currentRotationRef.current);
        } else {
          currentRotationRef.current = targetRotationRef.current;
          setTransform(currentRotationRef.current);
          isTransitioningRef.current = false;
        }
      } else {
        if (Math.abs(velocityRef.current) > 0.01) {
          currentRotationRef.current += velocityRef.current;
          targetRotationRef.current = currentRotationRef.current;
          velocityRef.current *= 0.94;
          setTransform(currentRotationRef.current);
        } else if (isAutoSpinningRef.current) {
          const ambientSpeed = 2.4;
          currentRotationRef.current += ambientSpeed * dt;
          targetRotationRef.current = currentRotationRef.current;
          setTransform(currentRotationRef.current);
        }
      }

      const normalizedRot = ((-currentRotationRef.current % 360) + 360) % 360;
      const currentFront = Math.round(normalizedRot / angleStep) % N;
      if (currentFront !== lastIndex) {
        lastIndex = currentFront;
        activeIndexRef.current = currentFront;
        if (items[currentFront]) {
          setActiveItem(items[currentFront]);
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [items, setTransform, angleStep, N]);

  const rotateToIndex = useCallback(
    (index: number, openModal = false, item?: MenuItem) => {
      if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current);
      isAutoSpinningRef.current = false;
      velocityRef.current = 0;
      isTransitioningRef.current = true;

      const targetAngle = -index * angleStep;
      const current = currentRotationRef.current;
      const diff = (((targetAngle - current + 180) % 360) + 360) % 360 - 180;
      targetRotationRef.current = current + diff;

      activeIndexRef.current = index;
      if (items[index]) {
        setActiveItem(items[index]);
      }

      if (openModal && item) {
        onSelectItem(item);
      }

      autoResumeTimeoutRef.current = setTimeout(() => {
        isAutoSpinningRef.current = true;
      }, 4000);
    },
    [angleStep, items, onSelectItem]
  );

  const stepRotate = useCallback(
    (direction: "prev" | "next") => {
      const newActive =
        direction === "next"
          ? (activeIndexRef.current + 1) % N
          : (activeIndexRef.current - 1 + N) % N;

      rotateToIndex(newActive, false, items[newActive]);
    },
    [N, rotateToIndex, items]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current);
    isDraggingRef.current = true;
    isHorizontalDragRef.current = false;
    isTransitioningRef.current = false;
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
      const instantVelocity = (stepX / dt) * 8;

      const sensitivity = isMobile ? 0.28 : 0.2;
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

    velocityRef.current = Math.max(Math.min(velocityRef.current, 2.2), -2.2);

    autoResumeTimeoutRef.current = setTimeout(() => {
      isAutoSpinningRef.current = true;
    }, 4000);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 4) {
      if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current);
      isAutoSpinningRef.current = false;
      isTransitioningRef.current = false;

      const impulse = (e.deltaX > 0 ? -1 : 1) * Math.min(Math.abs(e.deltaX) * 0.012, 0.35);
      velocityRef.current += impulse;

      autoResumeTimeoutRef.current = setTimeout(() => {
        isAutoSpinningRef.current = true;
      }, 4000);
    }
  };

  const handleCardClick = (dish: MenuItem, index: number) => {
    if (dragDistanceRef.current > 8) return;
    rotateToIndex(index, false);
    onSelectItem(dish);
  };

  return (
    <div
      onWheel={handleWheel}
      className={cn(
        "w-full flex flex-col items-center justify-start relative select-none gap-2 sm:gap-4 overflow-hidden py-4",
        className
      )}
    >
      <div
        className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{ height: cardHeight + 40, perspective: "1200px" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          ref={cylinderRef}
          className="absolute w-full h-full transform-gpu will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            transform: `translate3d(0, 0, -${radius}px) rotateY(0deg)`,
          }}
        >
          {items.map((dish, i) => {
            const cardAngle = i * angleStep;
            const isSelected = activeIndexRef.current === i;

            return (
              <div
                key={dish.id || i}
                onClick={() => handleCardClick(dish, i)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform cursor-pointer transition-shadow duration-300 group"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                }}
              >
                <div
                  className={cn(
                    "w-full h-full rounded-2xl overflow-hidden flex flex-col justify-between border bg-card/90 shadow-lg transition-all duration-300 relative",
                    isSelected
                      ? "border-amber-500/80 shadow-2xl shadow-amber-500/20 ring-2 ring-amber-400/40"
                      : "border-border/60 hover:border-amber-500/40"
                  )}
                >
                  <div className="relative w-full h-[55%] overflow-hidden bg-muted">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    {dish.isSignature && (
                      <Badge className="absolute top-2 left-2 bg-amber-500 text-black font-semibold text-xs px-2 py-0.5 shadow-md flex items-center gap-1 border-0">
                        <Sparkles className="w-3 h-3 fill-black" /> Signature
                      </Badge>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow">
                      <span>${dish.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 bg-card/95">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h3 className="font-bold text-sm sm:text-base line-clamp-1 text-foreground">
                          {dish.name}
                        </h3>
                        {dish.rating && (
                          <div className="flex items-center gap-0.5 text-amber-500 text-xs font-medium shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{dish.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-2">
                      <span className="text-[11px] text-muted-foreground italic">
                        {dish.category}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectItem(dish);
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-2">
        <button
          type="button"
          onClick={() => stepRotate("prev")}
          className="p-2.5 rounded-full bg-card border border-border/80 shadow-md hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Previous item"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card/80 border border-border/50 rounded-full shadow-sm">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => rotateToIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                activeIndexRef.current === i
                  ? "w-6 bg-amber-500 shadow-sm"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
              aria-label={`Go to item ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => stepRotate("next")}
          className="p-2.5 rounded-full bg-card border border-border/80 shadow-md hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Next item"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {activeItem && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium bg-card/60 px-4 py-1.5 rounded-full border border-border/40 mt-1 shadow-xs animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Viewing: <strong className="text-foreground">{activeItem.name}</strong></span>
        </div>
      )}
    </div>
  );
}