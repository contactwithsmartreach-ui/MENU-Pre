"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href?: string;
  id?: string;
  icon?: React.ReactNode;
}

export interface VerticalSpotlightNavbarProps {
  items?: NavItem[];
  className?: string;
  onItemClick?: (item: NavItem, index: number) => void;
  defaultActiveIndex?: number;
  activeIndex?: number;
}

export function VerticalSpotlightNavbar({
  items = [
    { label: "All", href: "#all" },
    { label: "Chef Specials", href: "#chef" },
    { label: "Starters", href: "#starters" },
    { label: "Mains", href: "#mains" },
    { label: "Desserts", href: "#desserts" },
    { label: "Cocktails", href: "#cocktails" },
  ],
  className,
  onItemClick,
  defaultActiveIndex = 0,
  activeIndex: controlledActiveIndex,
}: VerticalSpotlightNavbarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActiveIndex);
  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;

  const [hoverY, setHoverY] = useState<number | null>(null);

  // Refs for the "light" positions to animate them imperatively on Y-axis
  const spotlightY = useRef(0);
  const ambienceY = useRef(0);

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = nav.getBoundingClientRect();
      const y = e.clientY - rect.top;
      setHoverY(y);

      // Direct update for snappy zero-delay cursor tracking
      spotlightY.current = y;
      nav.style.setProperty("--spotlight-y", `${y}px`);
    };

    const handleMouseLeave = () => {
      setHoverY(null);
      // When mouse leaves, spring the spotlight back to the active item
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
      if (activeItem) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const targetY = itemRect.top - navRect.top + itemRect.height / 2;

        animate(spotlightY.current, targetY, {
          type: "spring",
          stiffness: 220,
          damping: 22,
          onUpdate: (v) => {
            spotlightY.current = v;
            nav.style.setProperty("--spotlight-y", `${v}px`);
          },
        });
      }
    };

    nav.addEventListener("mousemove", handleMouseMove);
    nav.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      nav.removeEventListener("mousemove", handleMouseMove);
      nav.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeIndex]);

  // Handle the "Ambience" (Active Item) Vertical Movement
  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);

    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetY = itemRect.top - navRect.top + itemRect.height / 2;

      animate(ambienceY.current, targetY, {
        type: "spring",
        stiffness: 220,
        damping: 22,
        onUpdate: (v) => {
          ambienceY.current = v;
          nav.style.setProperty("--ambience-y", `${v}px`);
        },
      });
    }
  }, [activeIndex]);

  const handleItemClick = (item: NavItem, index: number) => {
    if (controlledActiveIndex === undefined) {
      setInternalActiveIndex(index);
    }
    onItemClick?.(item, index);
  };

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)}>
      <nav
        ref={navRef}
        className={cn(
          "relative rounded-3xl transition-all duration-300 overflow-hidden",
          "bg-neutral-950/85 backdrop-blur-2xl border border-orange-500/30",
          "shadow-[0_15px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(249,115,22,0.12)]",
          "p-1.5 w-44 sm:w-48"
        )}
      >
        {/* Vertical Navigation Items */}
        <ul className="relative flex flex-col w-full z-[10] gap-1">
          {items.map((item, idx) => {
            const isActive = activeIndex === idx;
            return (
              <li key={idx} className="relative w-full flex items-center">
                <button
                  type="button"
                  data-index={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item, idx);
                  }}
                  className={cn(
                    "w-full px-3.5 py-2.5 text-xs sm:text-sm font-serif tracking-wider uppercase text-left transition-colors duration-200 rounded-2xl flex items-center justify-between cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
                    isActive
                      ? "text-white font-bold"
                      : "text-orange-200/60 hover:text-white font-medium"
                  )}
                >
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-amber-300 shadow-[0_0_8px_rgba(251,146,60,1)]" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* 1. Moving Spotlight (Follows Mouse along Y-axis) */}
        <div
          className="pointer-events-none absolute inset-0 w-full h-full z-[1] opacity-0 transition-opacity duration-300"
          style={{
            opacity: hoverY !== null ? 1 : 0,
            background: `
              radial-gradient(
                90px circle at 50% var(--spotlight-y), 
                var(--spotlight-color, rgba(249, 115, 22, 0.25)) 0%, 
                transparent 70%
              )
            `,
          }}
        />

        {/* 2. Active Ambience Glow Indicator along the vertical side */}
        <div
          className="pointer-events-none absolute left-0 top-0 w-full h-full z-[2]"
          style={{
            background: `
              radial-gradient(
                70px circle at 0% var(--ambience-y), 
                var(--ambience-color, rgba(249, 115, 22, 0.45)) 0%, 
                transparent 100%
              )
            `,
          }}
        />

        {/* 3. Left indicator accent line that smoothly moves with ambience */}
        <div
          className="pointer-events-none absolute left-0 w-[3px] h-6 rounded-r-full z-[3] -translate-y-1/2 bg-gradient-to-b from-red-500 via-orange-400 to-amber-300 shadow-[0_0_12px_rgba(251,146,60,0.8)]"
          style={{
            top: "var(--ambience-y, 24px)",
          }}
        />
      </nav>

      {/* Dynamic Colors CSS */}
      <style jsx>{`
        nav {
          --spotlight-color: rgba(249, 115, 22, 0.22);
          --ambience-color: rgba(239, 68, 68, 0.35);
        }
      `}</style>
    </div>
  );
}