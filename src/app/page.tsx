"use client";

import React, { useState, useRef, useCallback } from "react";
import { MENU_ITEMS } from "@/data/menu-data";
import { MenuItem } from "@/types/restaurant";
import { CombinedCylinderMenu } from "@/components/restaurant/CombinedCylinderMenu";
import { DishDetailModal } from "@/components/restaurant/DishDetailModal";
import { HeroPlateScrollExperience } from "@/components/restaurant/HeroPlateScrollExperience";
import { VerticalSpotlightNavbar } from "@/components/restaurant/VerticalSpotlightNavbar";
import { MenuSectionDivider } from "@/components/restaurant/MenuSectionDivider";
import { SpatialBackground } from "@/components/restaurant/SpatialBackground";
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
    toast.success(`Added ${quantity}x ${dish.name} to spatial order`, {
      description: `$${(dish.price * quantity).toFixed(2)} • ${
        notes ? `"${notes}"` : `Ready in ~${dish.prepTime}`
      }`,
    });
  };

  const smoothScrollToMenu = useCallback(() => {
    const targetElement = cylinderContainerRef.current || menuSectionRef.current;
    
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - 12;

      if (Math.abs(window.scrollY - targetY) > 50) {
        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });
      }
    }
  }, []);

  const handleCategorySelect = (index: number) => {
    setActiveCategoryIdx(index);
    smoothScrollToMenu();
  };

  return (
    <div className="relative min-h-screen w-full bg-transparent text-neutral-100 flex flex-col items-center justify-between select-none overflow-x-hidden">
      {/* Spatial Transparent Background & Holographic Orbs */}
      <SpatialBackground />

      {/* Part 1: Top Hero Section with Floating Plate Experience */}
      <HeroPlateScrollExperience onScrollToMenu={smoothScrollToMenu} />

      {/* Transitional Section Separation Divider */}
      <MenuSectionDivider />

      {/* Part 2: Interactive 3D Cylinder Gastronomy Menu wrapped in Spatial Glass */}
      <section
        ref={menuSectionRef}
        id="cylinder-menu"
        className="relative z-10 w-full flex flex-col items-center justify-start pt-1 pb-8 px-2 sm:px-6"
      >
        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center lg:items-center justify-center gap-3 lg:gap-2 max-w-7xl mx-auto py-1 spatial-glass rounded-3xl p-4 sm:p-8 spatial-glow">
          {/* Vertical Spatial Spotlight Navbar */}
          <div className="shrink-0 flex items-center justify-center lg:pr-4 z-30">
            <VerticalSpotlightNavbar
              items={CATEGORY_ITEMS}
              activeIndex={activeCategoryIdx}
              onItemClick={(_, idx) => handleCategorySelect(idx)}
            />
          </div>

          {/* Dedicated 3D Cylinder Menu */}
          <div
            ref={cylinderContainerRef}
            className="flex-1 w-full flex items-center justify-center overflow-visible scroll-mt-6"
          >
            <CombinedCylinderMenu
              items={filteredItems}
              onSelectItem={handleOpenDish}
            />
          </div>
        </div>

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
        <footer className="relative z-10 w-full py-4 mt-6 text-center">
          <MadeWithDyad />
        </footer>
      </section>
    </div>
  );
}