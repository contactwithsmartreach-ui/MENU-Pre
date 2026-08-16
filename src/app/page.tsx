"use client";

import React, { useState, useRef } from "react";
import { MENU_ITEMS } from "@/data/menu-data";
import { MenuItem } from "@/types/restaurant";
import { CombinedCylinderMenu } from "@/components/restaurant/CombinedCylinderMenu";
import { DishDetailModal } from "@/components/restaurant/DishDetailModal";
import { HeroPlateScrollExperience } from "@/components/restaurant/HeroPlateScrollExperience";
import { VerticalSpotlightNavbar } from "@/components/restaurant/VerticalSpotlightNavbar";
import { MenuSectionDivider } from "@/components/restaurant/MenuSectionDivider";
import { ScrollVideoBackground } from "@/components/restaurant/ScrollVideoBackground";
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
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-neutral-100 flex flex-col items-center justify-between select-none overflow-x-hidden">
      {/* Scroll-scrubbed cinematic video background */}
      <ScrollVideoBackground />

      {/* Part 1: Top Hero Section with Floating Plate & Chef Hat */}
      <div className="relative z-10 w-full">
        <HeroPlateScrollExperience onScrollToMenu={handleScrollToMenu} />
      </div>

      {/* Spacer for scroll-scrubbing video timeline */}
      <div className="h-[80vh] w-full pointer-events-none" aria-hidden="true" />

      {/* Transitional Section Separation Divider */}
      <div className="relative z-10 w-full">
        <MenuSectionDivider />
      </div>

      {/* Part 2: Interactive 3D Cylinder Gastronomy Menu */}
      <section
        ref={menuSectionRef}
        id="cylinder-menu"
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-between pt-4 pb-12 px-2 sm:px-6"
      >
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
      </section>
    </div>
  );
}