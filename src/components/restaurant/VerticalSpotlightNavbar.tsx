"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Pizza,
  Sandwich,
  Flame,
  Utensils,
  ChefHat,
  Cake,
  Wine,
} from "lucide-react";

export interface NavItem {
  label: string;
  href?: string;
  id: string;
  icon?: React.ReactNode;
}

export interface VerticalSpotlightNavbarProps {
  items: NavItem[];
  className?: string;
  onItemClick?: (item: NavItem, index: number) => void;
  activeIndex: number;
}

export function VerticalSpotlightNavbar({
  items,
  className,
  onItemClick,
  activeIndex,
}: VerticalSpotlightNavbarProps) {
  const totalRadio = items.length;

  const getIcon = (id: string) => {
    switch (id) {
      case "All":
        return <Sparkles className="w-4 h-4 text-amber-300" />;
      case "Pizzas":
        return <Pizza className="w-4 h-4 text-orange-400" />;
      case "Burgers":
        return <Sandwich className="w-4 h-4 text-amber-400" />;
      case "Chef Specials":
        return <Flame className="w-4 h-4 text-red-400" />;
      case "Starters":
        return <Utensils className="w-4 h-4 text-orange-300" />;
      case "Mains":
        return <ChefHat className="w-4 h-4 text-amber-200" />;
      case "Desserts":
        return <Cake className="w-4 h-4 text-pink-300" />;
      case "Cocktails":
        return <Wine className="w-4 h-4 text-amber-300" />;
      default:
        return <Sparkles className="w-4 h-4 text-orange-300" />;
    }
  };

  return (
    <div className={cn("relative flex flex-col items-start select-none py-2", className)}>
      <div
        className="radio-container"
        style={
          {
            "--main-color": "#f7e479",
            "--main-color-opacity": "rgba(247, 228, 121, 0.14)",
            "--total-radio": totalRadio,
          } as React.CSSProperties
        }
      >
        {items.map((item, index) => {
          const inputId = `menu-cat-${index}`;
          const isChecked = activeIndex === index;

          return (
            <React.Fragment key={item.id}>
              <input
                type="radio"
                id={inputId}
                name="menu-category-radio"
                checked={isChecked}
                onChange={() => onItemClick?.(item, index)}
                className="hidden"
              />
              <label
                htmlFor={inputId}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-300 text-sm sm:text-base font-serif uppercase tracking-widest font-bold",
                  isChecked
                    ? "text-[#f7e479] drop-shadow-[0_0_14px_rgba(247,228,121,0.6)] translate-x-1"
                    : "text-neutral-400 hover:text-amber-200 hover:translate-x-0.5"
                )}
              >
                <span className="shrink-0 flex items-center justify-center">
                  {getIcon(item.id)}
                </span>
                <span className="whitespace-nowrap">{item.label}</span>
              </label>
            </React.Fragment>
          );
        })}

        {/* Glider Container & Moving Glow */}
        <div className="glider-container">
          <div
            className="glider"
            style={{
              transform: `translateY(${activeIndex * 100}%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}