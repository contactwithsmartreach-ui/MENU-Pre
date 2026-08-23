"use client";

import React, { useRef, useEffect, useState, memo } from "react";
import { MenuItem } from "@/types/restaurant";
import { MENU_ITEMS } from "@/data/menu-data";
import { cn } from "@/lib/utils";
import { Star, Flame, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeaturedFoodGridProps {
  onSelectItem: (item: MenuItem) => void;
  className?: string;
}

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
          "before:rounded-2xl before:absolute before:content-[''] before:bg-neutral-700 before:right-3 before:top-0 before:w-[320px] sm:before:w-[380px] before:h-48 before:-z-10 group-hover:before:right-1.5 before:transition-all before:duration-300",
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
  const featuredDishes = MENU_ITEMS.slice(0, 10);

  return (
    <section
      className={cn(
        "relative w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 z-20 overflow-hidden",
        className
      )}
    >
      {/* Grid of 10 Cards strictly 2 per line with high performance scroll reveal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 gap-x-8 py-6">
        {featuredDishes.map((dish, index) => (
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