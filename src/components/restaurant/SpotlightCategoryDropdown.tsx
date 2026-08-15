"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Flame,
  Utensils,
  ChefHat,
  Cake,
  Wine,
  ChevronDown,
  Check,
} from "lucide-react";

export interface CategoryOption {
  id: string;
  name: string;
  count?: number;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
}

export const CATEGORY_CONFIG: CategoryOption[] = [
  {
    id: "All",
    name: "Full Collection",
    icon: Sparkles,
    tagline: "Explore all culinary creations",
  },
  {
    id: "Chef Specials",
    name: "Chef Specials",
    icon: Flame,
    tagline: "Signature masterwork dishes",
  },
  {
    id: "Starters",
    name: "Starters & Crudo",
    icon: Utensils,
    tagline: "Palate awakening appetizers",
  },
  {
    id: "Mains",
    name: "Entrées & Mains",
    icon: ChefHat,
    tagline: "Prime meats, seafood & pastas",
  },
  {
    id: "Desserts",
    name: "Artisan Desserts",
    icon: Cake,
    tagline: "Sweet finales & confectionary",
  },
  {
    id: "Cocktails",
    name: "Craft Cocktails",
    icon: Wine,
    tagline: "Smoked elixirs & spirits",
  },
];

interface SpotlightCategoryDropdownProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

export function SpotlightCategoryDropdown({
  selectedCategory,
  onSelectCategory,
  className,
}: SpotlightCategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0, opacity: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCategory =
    CATEGORY_CONFIG.find((c) => c.id === selectedCategory) || CATEGORY_CONFIG[0];
  const CurrentIcon = currentCategory.icon;

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Spotlight cursor tracking inside dropdown
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dropdownRef.current) return;
    const rect = dropdownRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setSpotlightPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative z-50 flex flex-col items-center", className)}
    >
      {/* Dropdown Trigger Button with Glowing Border */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          "group relative flex items-center justify-between gap-3 px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300",
          "bg-neutral-950/90 backdrop-blur-xl border text-white shadow-lg",
          isOpen
            ? "border-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.4)] scale-[1.02]"
            : "border-orange-500/30 hover:border-orange-400/80 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(249,115,22,0.25)]"
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-red-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/30">
            <CurrentIcon className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-serif tracking-widest text-orange-300/70 leading-none">
              Menu Course
            </span>
            <span className="text-xs sm:text-sm font-serif font-bold text-white tracking-wide">
              {currentCategory.name}
            </span>
          </div>
        </div>

        <ChevronDown
          className={cn(
            "w-4 h-4 text-orange-400 transition-transform duration-300 ml-1",
            isOpen && "rotate-180 text-amber-300"
          )}
        />
      </button>

      {/* Vertical Spotlight Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "absolute top-full mt-2 w-72 sm:w-80 p-2 rounded-2xl overflow-hidden",
            "bg-neutral-950/95 backdrop-blur-2xl border border-orange-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(249,115,22,0.15)]",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}
        >
          {/* Dynamic Cursor Spotlight Radial Glow */}
          <div
            className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-2xl"
            style={{
              opacity: spotlightPos.opacity,
              background: `radial-gradient(160px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(249, 115, 22, 0.22), transparent 80%)`,
            }}
          />

          <div className="relative z-10 flex flex-col gap-1">
            <div className="px-3 py-1.5 border-b border-white/5 mb-1 flex items-center justify-between">
              <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-orange-300/60">
                Filter Cylinder Course
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                {CATEGORY_CONFIG.length} Courses
              </span>
            </div>

            {CATEGORY_CONFIG.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "group relative flex items-center justify-between w-full p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer",
                    isSelected
                      ? "bg-gradient-to-r from-red-500/20 via-orange-500/20 to-amber-500/10 border border-orange-400/40 text-white shadow-inner"
                      : "hover:bg-white/5 text-neutral-300 hover:text-white border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 shrink-0",
                        isSelected
                          ? "bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-md shadow-orange-500/30 scale-105"
                          : "bg-neutral-900 border border-white/10 text-neutral-400 group-hover:text-orange-300 group-hover:border-orange-500/40 group-hover:scale-105"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span
                        className={cn(
                          "text-xs sm:text-sm font-serif font-semibold tracking-wide truncate",
                          isSelected
                            ? "text-orange-300 font-bold"
                            : "group-hover:text-white"
                        )}
                      >
                        {cat.name}
                      </span>
                      <span className="text-[11px] text-neutral-400 group-hover:text-neutral-300 truncate font-light">
                        {cat.tagline}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400 flex items-center justify-center text-orange-400 shrink-0 ml-2">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}