"use client";

import React, { useState, useRef } from "react";
import { MENU_ITEMS } from "@/data/menu-data";
import { MenuItem } from "@/types/restaurant";
import { CombinedCylinderMenu } from "@/components/restaurant/CombinedCylinderMenu";
import { DishDetailModal } from "@/components/restaurant/DishDetailModal";
import { HeroPlateScrollExperience } from "@/components/restaurant/HeroPlateScrollExperience";
import { VerticalSpotlightNavbar } from "@/components/restaurant/VerticalSpotlightNavbar";
import { MenuSectionDivider } from "@/components/restaurant/MenuSectionDivider";
import { toast } from "sonner";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Sparkles, Award, ShieldCheck, Clock } from "lucide-react";

const CATEGORY_ITEMS = [
  { label: "All Masterpieces", id: "All" },
  { label: "Chef Specials", id: "Chef Specials" },
  { label: "Starters & Crudo", id: "Starters" },
  { label: "Entrées & Mains", id: "Mains" },
  { label: "Artisan Desserts", id: "Desserts" },
  { label: "Craft Cocktails", id: "Cocktails" },
];

export default function RestaurantMenuPage() {
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number>(0);

  const selectedCategory =
    activeCategoryIdx === 2
      ? "Starters"
      : activeCategoryIdx === 3
      ? "Mains"
      : activeCategoryIdx === 4
      ? "Desserts"
      : activeCategoryIdx === 5
      ? "Cocktails"
      : activeCategoryIdx === 1
      ? "Chef Specials"
      : "All";

  const menuSectionRef = useRef<HTMLDivElement>(null);
  const cylinderContainerRef = useRef<HTMLDivElement>(null);

  const filteredItems =
    selectedCategory === "All"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === selectedCategory);

  const handleOpenDish = (dish: MenuItem) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  const handleDishAction = (dish: MenuItem) => {
    toast.success(`Inspecting "${dish.name}"`, {
      description: `Category: ${dish.category} • ${dish.calories} kcal • Rated ${dish.rating}/5.0`,
    });
  };

  const handleCategorySelect = (index: number) => {
    setActiveCategoryIdx(index);
    if (cylinderContainerRef.current) {
      cylinderContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleScrollToMenu = () => {
    menuSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#080302] text-neutral-100 flex flex-col items-center justify-between select-none overflow-x-hidden">
      {/* Sahara Sunset Ambient Glowing Atmospheric Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-to-tr from-red-600/20 via-orange-500/20 to-pink-600/10 rounded-full blur-[200px] animate-pulse duration-1000" />
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[180px]" />
        <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-[650px] h-[500px] bg-red-700/15 rounded-full blur-[190px]" />

        {/* Topographic Dune Wave Lines */}
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-[55%] opacity-10 pointer-events-none"
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
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(249, 115, 22, 0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Part 1: Cinematic Hero Section with Camera-Tracking Chef Hat & Explore Button */}
      <HeroPlateScrollExperience onScrollToMenu={handleScrollToMenu} />

      {/* Luxury Highlights Bar */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-orange-500/20 bg-neutral-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3.5 justify-center sm:justify-start p-2">
          <div className="w-10 h-10 rounded-full bg-orange-500/15 border border-orange-400/40 flex items-center justify-center text-orange-300">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-serif font-bold uppercase tracking-widest text-white">A5 Wagyu & Binchotan</h4>
            <p className="text-[11px] text-neutral-400">Authentic Japanese culinary techniques</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 justify-center sm:justify-start p-2">
          <div className="w-10 h-10 rounded-full bg-orange-500/15 border border-orange-400/40 flex items-center justify-center text-orange-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-serif font-bold uppercase tracking-widest text-white">Artisan Confectionery</h4>
            <p className="text-[11px] text-neutral-400">Hand-crafted daily by master pastry chefs</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 justify-center sm:justify-start p-2">
          <div className="w-10 h-10 rounded-full bg-orange-500/15 border border-orange-400/40 flex items-center justify-center text-orange-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-serif font-bold uppercase tracking-widest text-white">Sustainably Sourced</h4>
            <p className="text-[11px] text-neutral-400">Wild-caught seafood & organic produce</p>
          </div>
        </div>
      </div>

      {/* Transitional Section Separation Divider */}
      <MenuSectionDivider />

      {/* Part 2: Interactive 3D Cylinder Gastronomy Exhibition */}
      <section
        ref={menuSectionRef}
        id="cylinder-menu"
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-between pt-4 pb-16 px-2 sm:px-6"
      >
        <div className="text-center mb-6 space-y-2">
          <span className="text-xs font-serif uppercase tracking-[0.3em] text-orange-400">Interactive 3D Cylinder Gallery</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wider">
            Explore Menu Anthology
          </h2>
        </div>

        {/* Main Presentation Area: Vertical Spotlight Navbar Tightly Coupled with 3D Cylinder */}
        <div className="relative z-10 w-full flex-1 flex flex-col lg:flex-row items-center lg:items-center justify-center gap-6 lg:gap-4 max-w-7xl mx-auto py-2">
          {/* Vertical Spotlight Navbar */}
          <div className="shrink-0 flex items-center justify-center lg:pr-4 z-30">
            <VerticalSpotlightNavbar
              items={CATEGORY_ITEMS}
              activeIndex={activeCategoryIdx}
              onItemClick={(_, idx) => handleCategorySelect(idx)}
            />
          </div>

          {/* Dedicated 3D Cylinder Menu Exhibition */}
          <div
            ref={cylinderContainerRef}
            className="flex-1 w-full flex items-center justify-center overflow-visible scroll-mt-20"
          >
            <CombinedCylinderMenu
              key={selectedCategory}
              items={filteredItems}
              onSelectItem={handleOpenDish}
            />
          </div>
        </div>

        {/* Dish Detail Dialog for Exploration */}
        <DishDetailModal
          dish={selectedDish}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDish(null);
          }}
          onAddToCart={(dish) => handleDishAction(dish)}
        />

        {/* Footer */}
        <footer className="relative z-10 w-full py-6 mt-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 text-center text-xs text-neutral-400 space-y-2">
            <p className="font-serif tracking-widest uppercase text-orange-300">L&apos;AURA SAHARA &bull; FINE DINING EXHIBITION</p>
            <p>Designed for immersive culinary exploration.</p>
            <MadeWithDyad />
          </div>
        </footer>
      </section>
    </div>
  );
}