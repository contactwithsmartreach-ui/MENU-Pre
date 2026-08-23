"use client";

import React, { useRef, useEffect, useState, memo } from "react";
import { MenuItem, MenuCategory } from "@/types/restaurant";
import { MENU_ITEMS } from "@/data/menu-data";
import { cn } from "@/lib/utils";
import { Star, Flame, PhoneCall, ChevronDown, Check, Utensils, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeaturedFoodGridProps {
  onSelectItem: (item: MenuItem) => void;
  className?: string;
}

const CATEGORIES: { id: MenuCategory | "All"; label: string }[] = [
  { id: "All", label: "Toutes les Catégories" },
  { id: "Pizzas", label: "Pizzas" },
  { id: "Burgers", label: "Burgers" },
  { id: "Tacos", label: "Tacos" },
  { id: "Plats", label: "Plats Principaux" },
  { id: "Desserts", label: "Desserts" },
  { id: "Boissons", label: "Boissons" },
];

const AnimatedCard = memo(function AnimatedCard({
  dish,
  index,
  onSelectItem,
}: {
  dish: MenuItem;
  index: number;
  onSelectItem: (item: MenuItem) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -100px 0px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCallOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = "tel:0659242630";
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onSelectItem(dish)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectItem(dish)}
      style={{
        transitionDelay: `${(index % 2) * 60}ms`,
      }}
      className={cn(
        "group duration-500 ease-out cursor-pointer py-4 transition-all transform-gpu w-full flex justify-center will-change-transform",
        isVisible
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-12"
      )}
    >
      <div
        className={cn(
          "relative rounded-2xl w-[320px] sm:w-[380px] h-48 bg-zinc-800 text-gray-50 flex items-center p-4 gap-4",
          "border border-orange-500/30 shadow-xl overflow-hidden hover:-translate-y-1 transition-transform duration-200"
        )}
      >
        {/* Dish Image Container */}
        <div className="relative w-36 h-36 rounded-xl overflow-hidden shrink-0 border border-orange-500/40 bg-neutral-950 shadow-md">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-2 left-2">
            {dish.isSignature ? (
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif tracking-wider uppercase px-2 py-0.5 rounded-full text-[9px] shadow-md border-0">
                <Flame className="w-2.5 h-2.5 fill-current mr-0.5 text-amber-200" />
                Signature
              </Badge>
            ) : (
              <span className="text-[9px] font-serif uppercase tracking-widest text-orange-200 bg-neutral-950/80 px-2 py-0.5 rounded-full border border-orange-500/30 backdrop-blur-md">
                {dish.category}
              </span>
            )}
          </div>
        </div>

        {/* Card Content & Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1 h-full">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-serif uppercase tracking-widest text-amber-300 font-thin">
                {dish.category} &bull; {dish.prepTime}
              </span>
              <div className="flex items-center gap-1 bg-neutral-950 px-2 py-0.5 rounded-full border border-orange-500/30 text-amber-300 text-xs font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{dish.rating}</span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide truncate group-hover:text-amber-300 transition-colors">
              {dish.name}
            </h3>
            <p className="text-xs text-neutral-300/85 line-clamp-2 font-light leading-snug">
              {dish.description}
            </p>
          </div>

          <div className="pt-2 border-t border-neutral-700 flex items-center justify-between">
            <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-serif">
              {dish.price.toLocaleString()} DA
            </span>

            <button
              type="button"
              onClick={handleCallOrder}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 border border-green-400/50 text-white hover:brightness-110 transition-all shadow-md cursor-pointer text-[10px] font-serif uppercase font-bold"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Commander</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export function FeaturedFoodGrid({ onSelectItem, className }: FeaturedFoodGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | "All">("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDishes =
    selectedCategory === "All"
      ? MENU_ITEMS.slice(0, 10)
      : MENU_ITEMS.filter((item) => item.category === selectedCategory);

  const currentLabel =
    CATEGORIES.find((c) => c.id === selectedCategory)?.label || "Toutes les Catégories";

  return (
    <section
      className={cn(
        "relative w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 z-20 overflow-hidden",
        className
      )}
    >
      {/* Category Selection High-Contrast Text Trigger */}
      <div ref={dropdownRef} className="relative flex flex-col items-center justify-center mb-12 z-30">
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className={cn(
            "group relative flex items-center gap-3 px-4 py-2 cursor-pointer transition-all duration-300",
            "bg-transparent border-0 outline-none text-center"
          )}
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
              <span className="text-xs uppercase font-serif tracking-[0.25em] text-orange-400/90 font-bold">
                Filtrer par Catégorie
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-4xl font-serif font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 drop-shadow-[0_4px_16px_rgba(249,115,22,0.5)] group-hover:scale-105 transition-transform duration-300">
                {currentLabel}
              </span>
              <div className="w-9 h-9 rounded-full bg-orange-500/10 border border-orange-500/40 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-orange-400 transition-transform duration-300",
                    isDropdownOpen && "rotate-180 text-amber-300"
                  )}
                />
              </div>
            </div>
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full mt-4 w-80 p-2.5 rounded-2xl bg-zinc-950/95 backdrop-blur-2xl border border-orange-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.9)] animate-in fade-in-0 zoom-in-95 duration-200 z-40 ring-1 ring-white/10">
            <div className="flex flex-col gap-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer group/item",
                      isSelected
                        ? "bg-gradient-to-r from-red-600/30 via-orange-600/30 to-amber-600/30 border border-amber-400/60 text-amber-200 font-bold shadow-lg shadow-orange-950/50"
                        : "hover:bg-gradient-to-r hover:from-zinc-900 hover:to-neutral-900 text-neutral-300 hover:text-white border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        isSelected ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] scale-125" : "bg-neutral-600 group-hover/item:bg-orange-400"
                      )} />
                      <span className="text-sm font-serif tracking-wide">{cat.label}</span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid of Cards with smooth scroll reveal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 gap-x-8 py-6">
        {filteredDishes.map((dish, index) => (
          <AnimatedCard
            key={dish.id}
            dish={dish}
            index={index}
            onSelectItem={onSelectItem}
          />
        ))}
      </div>
    </section>
  );
}