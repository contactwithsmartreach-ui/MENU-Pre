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

const CATEGORY_ITEMS = [
  { label: "All Items", id: "All" },
  { label: "Chef Specials", id: "Chef Specials" },
  { label: "Starters", id: "Starters" },
  { label: "Mains", id: "Mains" },
  { label: "Desserts", id: "Desserts" },
  { label: "Cocktails", id: "Cocktails" },
];

export default function RestaurantMenuPage() {
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number>(0);

  const selectedCategory = CATEGORY_ITEMS[activeCategoryIdx].id;
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

  const handleAddToCart = (dish: MenuItem, quantity: number, notes?: string) => {
    toast.success(`Added ${quantity}x ${dish.name} to order`, {
      description: `$${(dish.price * quantity).toFixed(2)} • ${
        notes ? `"${notes}"` : `Ready in ~${dish.prepTime}`
      }`,
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
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#fafaf9] via-[#f5f5f4] to-[#f4f2ee] text-neutral-900 flex flex-col items-center justify-between select-none overflow-x-hidden">
      {/* Translucent Glassmorphism Atmosphere & Soft Ambient Prismatic Glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Soft Pearlescent & Gold Aura Blooms */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-tr from-amber-200/40 via-orange-200/35 to-rose-200/30 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-10 w-[600px] h-[600px] bg-gradient-to-br from-orange-200/30 to-amber-100/40 rounded-full blur-[130px]" />
        <div className="absolute bottom-20 right-10 w-[700px] h-[550px] bg-gradient-to-tl from-rose-200/30 via-orange-100/40 to-amber-200/35 rounded-full blur-[150px]" />

        {/* Crystalline Glass Geometric Overlay Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Soft Dune Glass Surface Waves */}
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-[45%] opacity-25 pointer-events-none"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="glass-dune-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#fb923c" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            fill="url(#glass-dune-grad)"
            d="M0,160L48,154.7C96,149,192,139,288,149.3C384,160,480,192,576,197.3C672,203,768,181,864,160C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Part 1: Top Hero Section with Floating Chef Hat & Glass Reflective Experience */}
      <HeroPlateScrollExperience onScrollToMenu={handleScrollToMenu} />

      {/* Glassmorphic Section Separation Divider */}
      <MenuSectionDivider />

      {/* Part 2: Interactive 3D Cylinder Gastronomy Menu */}
      <section
        ref={menuSectionRef}
        id="cylinder-menu"
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-between pt-4 pb-12 px-2 sm:px-6"
      >
        {/* Main Presentation Area: Vertical Spotlight Navbar Tightly Coupled with 3D Cylinder */}
        <div className="relative z-10 w-full flex-1 flex flex-col lg:flex-row items-center lg:items-center justify-center gap-6 lg:gap-4 max-w-7xl mx-auto py-2">
          {/* Vertical Spotlight Navbar */}
          <div className="shrink-0 flex items-center justify-center lg:pr-2 z-30">
            <VerticalSpotlightNavbar
              items={CATEGORY_ITEMS}
              activeIndex={activeCategoryIdx}
              onItemClick={(_, idx) => handleCategorySelect(idx)}
            />
          </div>

          {/* Dedicated 3D Cylinder Menu */}
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

        {/* Dish Detail Glass Dialog */}
        <DishDetailModal
          dish={selectedDish}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDish(null);
          }}
          onAddToCart={handleAddToCart}
        />

        {/* Footer */}
        <footer className="relative z-10 w-full py-4 mt-8 text-center text-xs text-neutral-500">
          <MadeWithDyad />
        </footer>
      </section>
    </div>
  );
}