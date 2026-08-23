"use client";

import React, { useRef, useEffect, useState } from "react";
import { MenuItem } from "@/types/restaurant";
import { MENU_ITEMS } from "@/data/menu-data";
import { cn } from "@/lib/utils";
import { Star, Flame, PhoneCall, Utensils } from "lucide-react";
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
          Cartes dynamiques inspirées du design interactif avec reflets et animations fluides.
        </p>
      </div>

      {/* Grid of 10 Cards with Uiverse Skew/Rotation Animation Structure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-y-20 gap-x-12 py-10">
        {featuredDishes.map((dish, index) => {
          return (
            <div
              key={dish.id}
              onClick={() => onSelectItem(dish)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectItem(dish)}
              style={{
                transitionDelay: `${index * 60}ms`,
                WebkitBoxReflect:
                  "below 4px linear-gradient(to bottom, transparent 65%, rgba(0, 0, 0, 0.15) 85%, rgba(249, 115, 22, 0.25) 100%)",
              }}
              className={cn(
                "group origin-bottom-right duration-500 -rotate-6 sm:-rotate-12 hover:-rotate-0 hover:-skew-x-12 skew-x-0 hover:-translate-x-4 hover:translate-y-8 cursor-pointer py-4",
                isVisible
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-8"
              )}
            >
              <div
                className={cn(
                  "duration-500 group-hover:duration-400 relative rounded-2xl w-full max-w-xl h-44 sm:h-52 bg-neutral-900 text-gray-50 flex items-center p-4 sm:p-6 gap-4 sm:gap-6",
                  "before:-skew-x-12 before:rounded-2xl before:absolute before:content-[''] before:bg-neutral-800 before:right-3 before:top-0 before:w-full before:h-full before:-z-10 group-hover:before:-right-3 group-hover:before:skew-x-12 before:duration-500 group-hover:duration-500",
                  "border border-orange-500/30 shadow-2xl overflow-hidden"
                )}
              >
                {/* Dish Image Container */}
                <div className="relative w-32 sm:w-44 h-32 sm:h-40 rounded-xl overflow-hidden shrink-0 border border-orange-500/40 bg-neutral-950 shadow-lg">
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
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-serif uppercase tracking-widest text-orange-400 font-bold">
                        {dish.category} &bull; {dish.prepTime}
                      </span>
                      <div className="flex items-center gap-1 bg-neutral-950 px-2 py-0.5 rounded-full border border-orange-500/30 text-amber-300 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{dish.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-xl font-serif font-bold text-white tracking-wide truncate group-hover:text-orange-300 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-neutral-300/85 line-clamp-2 font-light leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-orange-500/20 flex items-center justify-between">
                    <span className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-serif">
                      {dish.price.toLocaleString()} DA
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleCallOrder(dish, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 border border-green-400/50 text-white hover:brightness-110 transition-all shadow-md cursor-pointer text-[11px] font-serif uppercase font-bold"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
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