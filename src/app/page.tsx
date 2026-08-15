"use client";

import React, { useState, useMemo } from "react";
import { MENU_ITEMS } from "@/data/menu-data";
import { MenuItem, CartItem } from "@/types/restaurant";
import { CylinderMenuCarousel } from "@/components/restaurant/CylinderMenuCarousel";
import { DishDetailModal } from "@/components/restaurant/DishDetailModal";
import { OrderDrawer } from "@/components/restaurant/OrderDrawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Sparkles,
  ShoppingBag,
  Play,
  Pause,
  RotateCw,
  Wine,
  UtensilsCrossed,
  ChefHat,
  Flame,
} from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const CATEGORIES = ["All", "Starters", "Chef Specials", "Mains", "Desserts", "Cocktails"] as const;

export default function RestaurantMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<number>(36);
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return MENU_ITEMS;
    return MENU_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleOpenDish = (dish: MenuItem) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  const handleQuickAdd = (dish: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(dish, 1);
  };

  const addToCart = (dish: MenuItem, quantity: number, notes?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                specialInstructions: notes || item.specialInstructions,
              }
            : item
        );
      }
      return [...prev, { dish, quantity, specialInstructions: notes }];
    });

    toast.success(`Added ${quantity}x ${dish.name} to order`, {
      description: `$${(dish.price * quantity).toFixed(2)} • Ready in ~${dish.prepTime}`,
    });
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.dish.id === dishId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Bold Atmospheric Luxury Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Deep ambient radiance spots */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-amber-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[550px] h-[550px] bg-rose-600/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-32 left-1/3 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-[150px]" />

        {/* Subtle grid mesh overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Header Bar */}
      <header className="relative z-20 w-full px-6 py-5 sm:px-12 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-neutral-950/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                L&apos;AURA
              </span>
              <Badge
                variant="outline"
                className="text-[10px] text-amber-400 border-amber-500/30 px-1.5 py-0 uppercase tracking-widest"
              >
                Haute Cuisine
              </Badge>
            </div>
            <p className="text-[11px] text-neutral-400 tracking-wide">
              Interactive 3D Tasting Menu
            </p>
          </div>
        </div>

        {/* Action button: Table Cart */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-full shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">My Table Order</span>
            {totalCartCount > 0 && (
              <span className="bg-neutral-950 text-amber-400 text-xs font-extrabold px-2 py-0.5 rounded-full ml-1">
                {totalCartCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-6 pb-2 max-w-7xl mx-auto w-full">
        {/* Hero Title Section */}
        <div className="text-center space-y-2 mb-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold px-4 py-1 rounded-full backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
            <span>Interactive 3D Cylinder Experience</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight text-white">
            Curated Culinary Carousel
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Hover over dishes to pause rotation, click to inspect ingredients, or tap the quick-add plus icon to order directly.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap my-2 p-1.5 bg-neutral-900/60 border border-white/10 rounded-full backdrop-blur-lg">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/30 scale-105"
                    : "text-neutral-300 hover:text-white hover:bg-neutral-800/80"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* 3D Animated Cylinder Section */}
        <div className="w-full flex-1 flex items-center justify-center my-2 min-h-[480px]">
          <CylinderMenuCarousel
            items={filteredItems}
            onSelectItem={handleOpenDish}
            onQuickAdd={handleQuickAdd}
            animationDuration={speed}
            isPaused={isPaused}
            cardWidth={260}
          />
        </div>

        {/* Carousel Control Bar */}
        <div className="flex items-center gap-4 bg-neutral-900/70 border border-white/10 px-5 py-2 rounded-full backdrop-blur-md shadow-xl text-xs text-neutral-300">
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors font-medium"
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Resume Spin
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                Pause Spin
              </>
            )}
          </button>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <RotateCw className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-400">Speed:</span>
            <div className="flex gap-1">
              {[
                { label: "Slow", val: 48 },
                { label: "Norm", val: 36 },
                { label: "Fast", val: 22 },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSpeed(s.val)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    speed === s.val
                      ? "bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Dish Modal Dialog */}
      <DishDetailModal
        dish={selectedDish}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDish(null);
        }}
        onAddToCart={addToCart}
      />

      {/* Order Cart Slideover Drawer */}
      <OrderDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
      />

      {/* Footer */}
      <footer className="relative z-10 w-full py-2">
        <MadeWithDyad />
      </footer>
    </div>
  );
}