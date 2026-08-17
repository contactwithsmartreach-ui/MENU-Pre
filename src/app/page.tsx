"use client";

import React, { useState, useRef } from "react";
import { MENU_ITEMS } from "@/data/menu-data";
import { MenuItem } from "@/types/restaurant";
import { CombinedCylinderMenu } from "@/components/restaurant/CombinedCylinderMenu";
import { DishDetailModal } from "@/components/restaurant/DishDetailModal";
import { HeroPlateScrollExperience } from "@/components/restaurant/HeroPlateScrollExperience";
import { VerticalSpotlightNavbar } from "@/components/restaurant/VerticalSpotlightNavbar";
import { MenuSectionDivider } from "@/components/restaurant/MenuSectionDivider";
import { CurvedFoodExperience } from "@/components/restaurant/CurvedFoodExperience";
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
    <div className="relative min-h-screen w-full bg-[#0a0504] text-neutral-100 flex flex-col items-center justify-between select-none overflow-x-hidden">
      {/* Sahara Sunset Ambient Glowing Atmospheric Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Sahara Sunset Solar Core */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-red-600/25 via-orange-500/25 to-pink-600/15 rounded-full blur-[180px] animate-pulse duration-1000" />
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-amber-500/20 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-[600px] h-[450px] bg-red-700/20 rounded-full blur-[170px]" />

        {/* Topographic Dune Wave Lines */}
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

      {/* Part 1: Top Hero Section with Floating Plate Experience */}
      <HeroPlateScrollExperience onScrollToMenu={handleScrollToMenu} />

      {/* Transitional Section Separation Divider */}
      <MenuSectionDivider />

      {/* Part 2: Interactive 3D Cylinder Gastronomy Menu */}
      <section
        ref={menuSectionRef}
        id="cylinder-menu"
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-between pt-4 pb-8 px-2 sm:px-6"
      >
        {/* Main Presentation Area: Vertical Spotlight Navbar Tightly Coupled with 3D Cylinder */}
        <div className="relative z-10 w-full flex-1 flex flex-col lg:flex-row items-center lg:items-center justify-center gap-4 lg:gap-2 max-w-7xl mx-auto py-2">
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
      </section>

      {/* Separation Divider Between Cylinder Menu and Curved OptionWheel Menu */}
      <MenuSectionDivider />

      {/* Part 3: Spatial UI Curved OptionWheel Food Spectrum */}
      <CurvedFoodExperience onSelectDish={handleOpenDish} />

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

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 mt-8">
        <MadeWithDyad />
      </footer>
    </div>
  );
}