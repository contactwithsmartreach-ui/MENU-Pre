"use client";

import React, { useRef, useEffect, useState } from "react";
import { MenuItem } from "@/types/restaurant";
import { MENU_ITEMS } from "@/data/menu-data";
import { cn } from "@/lib/utils";
import { Star, Flame, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeaturedFoodGridProps {
  onSelectItem: (item: MenuItem) => void;
  className?: string;
}

export function FeaturedFoodGrid({ onSelectItem, className }: FeaturedFoodGridProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const featuredDishes = MENU_ITEMS.slice(0, 10);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCallOrder = (dish: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = "tel:0659242630";
  };

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 z-20 overflow-hidden",
        className
      )}
    >
      {/* Category Title with Slide-in from Left Animation */}
      <div
        className={cn(
          "flex flex-col items-start mb-12 sm:mb-16 transition-all duration-700 ease-out transform",
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs uppercase font-serif tracking-[0.25em] font-bold text-orange-600">
            Galerie Gastronomique &bull; Sélection Exclusive
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-neutral-900">
          Nos 10 Plats Phares en Surface
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 font-light mt-1">
          Cartes dynamiques avec animation au défilement et effet 3D Uiverse.
        </p>
      </div>

      {/* Grid of 10 Cards with Exact Javierrocadev Animation Structure & Scroll Reveal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-y-20 gap-x-12 py-10 justify-items-center">
        {featuredDishes.map((dish, index) => {
          return (
            <div
              key={dish.id}
              onClick={() => onSelectItem(dish)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectItem(dish)}
              style={{
                transitionDelay: `${index * 80}ms`,
                WebkitBoxReflect:
                  "below 4px linear-gradient(to bottom, transparent 65%, rgba(0, 0, 0, 0.15) 85%, rgba(249, 115, 22, 0.25) 100%)",
              }}
              className={cn(
                "group duration-500 -rotate-12 hover:-rotate-0 hover:skew-x-1 skew-x-0 hover:translate-x-6 hover:translate-y-12 cursor-pointer py-6 transition-all transform-gpu",
                isVisible
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-12"
              )}
            >
              <div
                className={cn(
                  "group-hover:duration-400 relative rounded-2xl w-[320px] sm:w-[380px] h-48 bg-zinc-800 text-gray-50 flex items-center p-4 gap-4",
                  "before:-skew-x-12 before:rounded-2xl before:absolute before:content-[''] before:bg-neutral-700 before:right-3 before:top-0 before:w-[320px] sm:before:w-[380px] before:h-48 before:-z-10",
                  "border border-orange-500/30 shadow-2xl overflow-hidden"
                )}
              >
                {/* Dish Image Container */}
                <div className="relative w-36 h-36 rounded-xl overflow-hidden shrink-0 border border-orange-500/40 bg-neutral-950 shadow-lg">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
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
                      onClick={(e) => handleCallOrder(dish, e)}
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
        })}
      </div>
    </section>
  );
}