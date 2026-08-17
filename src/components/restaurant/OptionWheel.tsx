"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface OptionWheelProps {
  items: string[];
  defaultSelected?: number;
  textColor?: string;
  activeColor?: string;
  side?: "left" | "right" | "center";
  fontSize?: number; // in rem
  spacing?: number;
  curve?: number;
  tilt?: number;
  blur?: number;
  fade?: number;
  smoothing?: number;
  inset?: number;
  loop?: boolean;
  draggable?: boolean;
  soundUrl?: string;
  soundVolume?: number;
  onChange?: (index: number, item: string) => void;
  className?: string;
}

export default function OptionWheel({
  items,
  defaultSelected = 0,
  textColor = "#a6a6a6",
  activeColor = "#ffffff",
  side = "left",
  fontSize = 2.8,
  spacing = 1.35,
  curve = 1,
  tilt = 6,
  blur = 2,
  fade = 0.25,
  smoothing = 200,
  inset = 80,
  loop = false,
  draggable = true,
  soundVolume = 0.5,
  onChange,
  className,
}: OptionWheelProps) {
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
  const [offsetY, setOffsetY] = useState(defaultSelected);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startOffsetRef = useRef(defaultSelected);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const prevIndexRef = useRef(defaultSelected);

  // Synthesize soft tactile spatial clicks via Web Audio API
  const playClickSound = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(soundVolume * 0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // safe fallback
    }
  }, [soundVolume]);

  const selectIndex = useCallback(
    (index: number) => {
      let target = index;
      if (!loop) {
        target = Math.max(0, Math.min(items.length - 1, target));
      } else {
        target = ((target % items.length) + items.length) % items.length;
      }

      setSelectedIndex(target);
      setOffsetY(target);

      if (prevIndexRef.current !== target) {
        prevIndexRef.current = target;
        playClickSound();
        onChange?.(target, items[target]);
      }
    },
    [items, loop, onChange, playClickSound]
  );

  // Pointer Drag Event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    setIsDragging(true);
    startYRef.current = e.clientY;
    startOffsetRef.current = offsetY;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !draggable) return;
    const deltaY = e.clientY - startYRef.current;
    const sensitivity = 0.015;
    let newOffset = startOffsetRef.current - deltaY * sensitivity;

    if (!loop) {
      newOffset = Math.max(-0.5, Math.min(items.length - 0.5, newOffset));
    }

    setOffsetY(newOffset);
    const closestIdx = Math.round(newOffset);
    const clampedClosest = Math.max(0, Math.min(items.length - 1, closestIdx));

    if (clampedClosest !== prevIndexRef.current) {
      prevIndexRef.current = clampedClosest;
      playClickSound();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
    const targetIdx = Math.round(offsetY);
    selectIndex(targetIdx);
  };

  // Wheel event for smooth trackpad / mouse scroll
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.0035;
    let nextOffset = offsetY + delta;
    if (!loop) {
      nextOffset = Math.max(0, Math.min(items.length - 1, nextOffset));
    }
    setOffsetY(nextOffset);
    const targetIdx = Math.round(nextOffset);
    if (targetIdx !== selectedIndex) {
      selectIndex(targetIdx);
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "relative w-full h-[380px] sm:h-[440px] flex items-center justify-center select-none overflow-hidden touch-none",
        draggable && "cursor-grab active:cursor-grabbing",
        className
      )}
      style={{
        perspective: "1200px",
      }}
    >
      {/* Curved Options Track */}
      <div
        className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]"
        style={{
          transition: isDragging ? "none" : `transform ${smoothing}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        {items.map((item, idx) => {
          const dist = idx - offsetY;
          const absDist = Math.abs(dist);

          if (absDist > 4.5) return null;

          const isSelected = Math.round(offsetY) === idx;

          // Compute 3D spatial cylindrical curve transformations
          const angleDeg = dist * 22 * curve;
          const translateZ = -Math.abs(dist) * 45 * curve;
          const translateY = dist * (fontSize * 16 * spacing);
          const rotateX = -dist * tilt;

          // Side-based spatial curve displacement
          let translateX = 0;
          if (side === "left") {
            translateX = -Math.pow(absDist, 1.4) * (inset * 0.45);
          } else if (side === "right") {
            translateX = Math.pow(absDist, 1.4) * (inset * 0.45);
          }

          const itemOpacity = Math.max(0.12, 1 - absDist * fade);
          const itemBlur = Math.min(absDist * blur, 6);
          const itemScale = Math.max(0.72, 1 - absDist * 0.09);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => selectIndex(idx)}
              className={cn(
                "absolute font-serif font-black tracking-wider transition-colors duration-200 cursor-pointer focus:outline-none whitespace-nowrap px-6 py-2 rounded-full",
                isSelected
                  ? "drop-shadow-[0_0_25px_rgba(249,115,22,0.85)] z-30"
                  : "hover:opacity-100 z-10"
              )}
              style={{
                fontSize: `${fontSize}rem`,
                lineHeight: 1.1,
                color: isSelected ? activeColor : textColor,
                opacity: itemOpacity,
                filter: itemBlur > 0.4 ? `blur(${itemBlur}px)` : "none",
                transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${side === "left" ? angleDeg * 0.4 : side === "right" ? -angleDeg * 0.4 : 0}deg) scale(${itemScale})`,
                transformOrigin: side === "left" ? "left center" : side === "right" ? "right center" : "center center",
              }}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Spatial Glow Horizon Indicator */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 border-y border-orange-500/20 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent flex items-center justify-between px-6">
        <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(249,115,22,1)]" />
        <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(249,115,22,1)]" />
      </div>
    </div>
  );
}