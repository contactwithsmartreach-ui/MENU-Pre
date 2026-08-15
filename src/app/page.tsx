"use client";

import React, { useState } from "react";
import { SAMPLE_MENU_ITEMS } from "@/data/restaurantData";
import { MenuItem, MenuCategory } from "@/types/restaurant";
import { CombinedCylinderMenu } from "@/components/restaurant/CombinedCylinderMenu";
import { HeroPlateScrollExperience } from "@/components/restaurant/HeroPlateScrollExperience";
import { DishDetailModal } from "@/components/restaurant/DishDetailModal";
import { SaharaButton } from "@/components/restaurant/SaharaButton";
import { toast } from "sonner";
import {
  UtensilsCrossed,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

const CATEGORIES: { id: MenuCategory; label: string }[] = [
  { id: "all", label: "Full Vault" },
  { id: "starters", label: "Embers & Starters" },
  { id: "mains", label: "Desert Mains" },
  { id: "desserts", label: "Sweet Mirages" },
  { id: "drinks", label: "Oasis Elixirs" },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>("all");
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const filteredItems: MenuItem[] =
    selectedCategory === "all"
      ? SAMPLE_MENU_ITEMS
      : SAMPLE_MENU_ITEMS.filter((item: MenuItem) => item.category === selectedCategory);

  const handleScrollToMenu = () => {
    const menuEl = document.getElementById("cylinder-menu-section");
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectDish = (dish: MenuItem) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  const handleAddToCart = (dish: MenuItem, quantity: number) => {
    setCartCount((prev) => prev + quantity);
    toast.success(`Added ${quantity}x ${dish.name} to experience order`, {
      description: `$${(dish.price * quantity).toFixed(2)} added to tasting tab`,
    });
  };

  return (
    <main className="min-h-screen bg-[#070206] text-white selection:bg-orange-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Desert Atmosphere Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-b from-orange-600/15 via-purple-900/10 to-transparent rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-10 right-0 w-[450px] h-[450px] bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-neutral-950/80 border-b border-orange-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 p-0.5 shadow-[0_0_15px_rgba(249,115,22,0.8)]">
            <div className="w-full h-full bg-neutral-950 rounded-full flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-orange-400" />
            </div>
          </div>
          <span className="font-serif font-black tracking-[0.2em] text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-white">
            L&apos;AURA SAHARA
          </span>
        </div>

        {/* Cart Action Button styled with Sahara glow */}
        <SaharaButton
          size="sm"
          onClick={() =>
            toast.info(`Current Tab: ${cartCount} items selected for dining experience.`)
          }
          icon={<ShoppingBag className="w-4 h-4" />}
          primaryText={`TAB (${cartCount})`}
          hoverText="RESERVE"
        />
      </header>

      {/* Hero Section */}
      <HeroPlateScrollExperience onScrollToMenu={handleScrollToMenu} />

      {/* 3D Gastronomy & Runway Section */}
      <section
        id="cylinder-menu-section"
        className="relative z-10 w-full min-h-screen py-10 sm:py-16 flex flex-col items-center justify-center gap-6"
      >
        <div className="text-center space-y-2 px-4 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-400/40 text-purple-200 text-xs font-serif tracking-widest uppercase shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Interactive 3D Cylinder Gastronomy</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-300 uppercase">
            Curated Sahara Tasting Menu
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light">
            Drag the 3D rotating cylinder or scroll the molten cards below to inspect each dish.
          </p>
        </div>

        {/* Category Filter Pills styled in SaharaButton aesthetics */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 max-w-3xl">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <SaharaButton
                key={cat.id}
                size="sm"
                glow={isActive}
                onClick={() => setSelectedCategory(cat.id)}
                className={
                  isActive
                    ? "!bg-gradient-to-r !from-red-600 !via-orange-500 !to-amber-500 !text-white ring-2 ring-amber-300/60"
                    : "!bg-neutral-950/80 !text-neutral-300 !border-orange-500/20 hover:!text-white hover:!border-orange-400"
                }
              >
                {cat.label}
              </SaharaButton>
            );
          })}
        </div>

        {/* Main Combined 3D Cylinder & Runway Experience */}
        <div className="w-full flex-1 flex items-center justify-center overflow-visible">
          <CombinedCylinderMenu
            key={selectedCategory}
            items={filteredItems}
            onSelectItem={handleSelectDish}
          />
        </div>
      </section>

      {/* Dish Detail Inspection Modal */}
      <DishDetailModal
        dish={selectedDish}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
}