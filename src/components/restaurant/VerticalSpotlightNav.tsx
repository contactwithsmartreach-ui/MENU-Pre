"use client";

import React from "react";
import { Sparkles, Compass, Flame, Coffee, Wine, UtensilsCrossed, CakeSlice } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerticalSpotlightNavProps {
  categories: readonly string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: <Sparkles className="w-4 h-4" />,
  "Chef Specials": <Flame className="w-4 h-4" />,
  Starters: <UtensilsCrossed className="w-4 h-4" />,
  Mains: <Compass className="w-4 h-4" />,
  Desserts: <CakeSlice className="w-4 h-4" />,
  Cocktails: <Wine className="w-4 h-4" />,
};

export function VerticalSpotlightNav({
  categories,
  selectedCategory,
  onSelectCategory,
}: VerticalSpotlightNavProps) {
  return (
    <aside className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-2 p-2 bg-neutral-950/80 backdrop-blur-xl border border-orange-500/30 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div className="px-3 py-1.5 border-b border-orange-500/20 text-[10px] font-serif uppercase tracking-widest text-orange-300/70 text-center">
        Categories
      </div>
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={cn(
              "group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 text-left font-serif text-xs uppercase tracking-wider cursor-pointer",
              isSelected
                ? "bg-gradient-to-r from-red-600/90 to-orange-500/90 text-white font-bold shadow-lg shadow-orange-500/40 border border-orange-400/50 translate-x-1"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900/80 border border-transparent"
            )}
          >
            <span
              className={cn(
                "transition-colors",
                isSelected ? "text-amber-200" : "text-orange-400 group-hover:text-amber-300"
              )}
            >
              {CATEGORY_ICONS[cat] || <Sparkles className="w-4 h-4" />}
            </span>
            <span className="whitespace-nowrap">{cat}</span>
            {isSelected && (
              <span className="absolute -left-1 w-1.5 h-5 bg-amber-400 rounded-full animate-pulse" />
            )}
          </button>
        );
      })}
    </aside>
  );
}