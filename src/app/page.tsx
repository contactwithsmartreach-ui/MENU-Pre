"use client";

import React, { useState } from "react";
import { MENU_ITEMS } from "@/data/menu-data";
import { MenuItem, CartItem } from "@/types/restaurant";
import { CylinderMenuCarousel } from "@/components/restaurant/CylinderMenuCarousel";
import { DishDetailModal } from "@/components/restaurant/DishDetailModal";
import { OrderDrawer } from "@/components/restaurant/OrderDrawer";
import { toast } from "sonner";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ShoppingBag } from "lucide-react";

const CATEGORIES = ["All", "Chef Specials", "Starters", "Mains", "Desserts", "Cocktails"] as const;

export default function RestaurantMenuPage() {
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredItems = selectedCategory === "All"
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === selectedCategory);

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleOpenDish = (dish: MenuItem) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  const handleAddToCart = (dish: MenuItem, quantity: number, notes?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + quantity, specialInstructions: notes || item.specialInstructions }
            : item
        );
      }
      return [...prev, { dish, quantity, specialInstructions: notes }];
    });

    toast.success(`Added ${quantity}x ${dish.name} to order`, {
      description: `$${(dish.price * quantity).toFixed(2)} • Tap the Order button to review.`,
    });
  };

  const handleQuickAdd = (dish: MenuItem) => {
    handleAddToCart(dish, 1);
  };

  const handleUpdateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(dishId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.dish.id === dishId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0504] text-neutral-100 flex flex-col items-center justify-between overflow-hidden select-none">
      {/* Sahara Sunset Ambient Glowing Atmospheric Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Sahara Sunset Solar Core */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-red-600/25 via-orange-500/25 to-pink-600/15 rounded-full blur-[180px] animate-pulse duration-1000" />
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-amber-500/20 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-[600px] h-[450px] bg-red-700/20 rounded-full blur-[170px]" />

        {/* Topographic Dune Wave Lines in background */}
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-[55%] opacity-15 pointer-events-none"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bg-sahara-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(37, 99%, 67%)" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="hsl(316, 73%, 52%)" />
            </linearGradient>
          </defs>
          <path
            fill="url(#bg-sahara-grad)"
            d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,213.3C672,224,768,192,864,165.3C960,139,1056,117,1152,128C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>

        {/* Subtle Stardust Texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(249, 115, 22, 0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Header with Brand & Table Order Button */}
      <header className="relative z-20 w-full pt-5 px-4 sm:px-8 flex flex-col items-center gap-3">
        <div className="w-full flex items-center justify-between max-w-5xl">
          <div className="w-10 sm:w-24" /> {/* Spacer for symmetry */}

          <h1 className="text-xl sm:text-2xl font-serif font-black tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300">
            L&apos;AURA SAHARA
          </h1>

          {/* Table Order Cart Drawer Button */}
          <button
            type="button"
            onClick={() => setIsOrderDrawerOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-orange-500/40 hover:border-orange-400 text-orange-200 hover:text-white transition-all shadow-md shadow-orange-500/20 active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-serif font-semibold hidden sm:inline">Order</span>
            {totalCartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-[11px] flex items-center justify-center animate-pulse">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full py-1 px-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-serif uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold shadow-md shadow-orange-500/30 border-0"
                  : "bg-neutral-950/70 border border-orange-500/30 text-orange-200/80 hover:text-white hover:border-orange-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Center 3D Cylinder Carousel */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center p-2">
        <CylinderMenuCarousel
          key={selectedCategory}
          items={filteredItems}
          onSelectItem={handleOpenDish}
          onQuickAdd={handleQuickAdd}
          animationDuration={36}
          cardWidth={260}
        />
      </main>

      {/* Dish Detail Dialog */}
      <DishDetailModal
        dish={selectedDish}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDish(null);
        }}
        onAddToCart={handleAddToCart}
      />

      {/* Table Order Summary Drawer */}
      <OrderDrawer
        isOpen={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Footer */}
      <footer className="relative z-10 w-full py-2">
        <MadeWithDyad />
      </footer>
    </div>
  );
}