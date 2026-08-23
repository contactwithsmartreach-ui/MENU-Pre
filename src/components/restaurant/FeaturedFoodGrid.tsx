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

  // Take 10 top dishes for the grid showcase
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
        "relative w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 z-20 overflow-hidden",
        className
      )}
    >
      {/* Category Title with Slide-in from Left Animation */}
      <div
        className={cn(
          "flex flex-col items-start mb-8 sm:mb-12 transition-all duration-700 ease-out transform",
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
          Explorez notre sélection complète avec reflets et animations fluides au défilement.
        </p>
      </div>

      {/* 10 Food Cards Grid with Staggered Scale-up & Fade */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {featuredDishes.map((dish, index) => {
          // Calculate staggered delay based on index
          const delayClass = `delay-[${index * 75}ms]`;

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
                  "below 4px linear-gradient(to bottom, transparent 65%, rgba(0, 0, 0, 0.12) 85%, rgba(249, 115, 22, 0.22) 100%)",
              }}
              className={cn(
                "group relative rounded-[24px] overflow-hidden cursor-pointer",
                "border border-orange-500/30 bg-[#0d0706] text-white shadow-xl",
                "transition-all duration-500 ease-out transform-gpu hover:-translate-y-2 hover:border-orange-400 hover:shadow-[0_20px_45px_rgba(249,115,22,0.4)]",
                isVisible
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-8"
              )}
            >
              {/* Dish Image Background */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0706] via-[#0d0706]/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/25 via-orange-500/15 to-transparent mix-blend-color-dodge opacity-85" />

                {/* Top Badge */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
                  {dish.isSignature ? (
                    <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif tracking-wider uppercase px-2.5 py-0.5 rounded-full text-[10px] shadow-md border-0">
                      <Flame className="w-3 h-3 fill-current mr-1 text-amber-200" />
                      Signature
                    </Badge>
                  ) : (
                    <span className="text-[10px] font-serif uppercase tracking-widest text-orange-200 bg-neutral-950/80 px-2 py-0.5 rounded-full border border-orange-500/30 backdrop-blur-md">
                      {dish.category}
                    </span>
                  )}

                  <div className="flex items-center gap-1 bg-neutral-950/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-orange-500/30 text-amber-300 text-[11px] font-bold shadow-md">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{dish.rating}</span>
                  </div>
                </div>

                {/* Hover Quick Action */}
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white font-serif tracking-widest uppercase px-4 py-2 rounded-full text-[11px] font-bold shadow-xl border border-orange-200/50 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>VOIR DÉTAILS</span>
                  </span>
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="p-4 pt-2 bg-[#0d0706] flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-serif font-bold text-white tracking-wide truncate group-hover:text-orange-300 transition-colors">
                    {dish.name}
                  </h3>
                  <p className="text-[11px] text-neutral-300 line-clamp-2 mt-1 font-light leading-snug">
                    {dish.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-orange-500/25 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-serif">
                    {dish.price.toLocaleString()} DA
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleCallOrder(dish, e)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 border border-green-400/50 text-white hover:brightness-110 transition-all shadow-sm cursor-pointer text-[10px] font-serif uppercase font-bold"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Commander</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}