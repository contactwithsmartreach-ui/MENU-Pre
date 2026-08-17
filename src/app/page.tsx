"use client";

import React, { useState, useRef, useCallback } from "react";
import { MENU_ITEMS } from "@/data/menu-data";
import { MenuItem, CartItem } from "@/types/restaurant";
import { CombinedCylinderMenu } from "@/components/restaurant/CombinedCylinderMenu";
import { DishDetailModal } from "@/components/restaurant/DishDetailModal";
import { HeroPlateScrollExperience } from "@/components/restaurant/HeroPlateScrollExperience";
import { VerticalSpotlightNavbar } from "@/components/restaurant/VerticalSpotlightNavbar";
import { MenuSectionDivider } from "@/components/restaurant/MenuSectionDivider";
import { SidebarNav } from "@/components/restaurant/SidebarNav";
import { OrderDrawer } from "@/components/restaurant/OrderDrawer";
import Auralis from "@/components/ui/auralis";
import { toast } from "sonner";
import { MadeWithDyad } from "@/components/made-with-dyad";

const CATEGORY_ITEMS = [
  { label: "All", id: "All" },
  { label: "Pizza", id: "Pizza" },
  { label: "Burgers", id: "Burgers" },
  { label: "Tacos", id: "Tacos" },
  { label: "Plates", id: "Plates" },
  { label: "Dessert", id: "Dessert" },
  { label: "Drinks", id: "Drinks" },
];

export default function RestaurantMenuPage() {
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number>(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);

  const selectedCategory = CATEGORY_ITEMS[activeCategoryIdx].id;
  const menuSectionRef = useRef<HTMLDivElement>(null);
  const cylinderContainerRef = useRef<HTMLDivElement>(null);

  // Filter items based on category selection
  const filteredItems =
    selectedCategory === "All"
      ? MENU_ITEMS
      : selectedCategory === "Pizza"
      ? MENU_ITEMS.filter((item) => item.category === "Mains" || item.tags.some(t => t.toLowerCase().includes("pizza") || t.toLowerCase().includes("pasta")))
      : selectedCategory === "Burgers"
      ? MENU_ITEMS.filter((item) => item.category === "Chef Specials")
      : selectedCategory === "Tacos"
      ? MENU_ITEMS.filter((item) => item.category === "Starters")
      : selectedCategory === "Plates"
      ? MENU_ITEMS.filter((item) => item.category === "Mains")
      : selectedCategory === "Dessert"
      ? MENU_ITEMS.filter((item) => item.category === "Desserts")
      : selectedCategory === "Drinks"
      ? MENU_ITEMS.filter((item) => item.category === "Cocktails")
      : MENU_ITEMS;

  const handleOpenDish = (dish: MenuItem) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  const handleAddToCart = (dish: MenuItem, quantity: number, notes?: string) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prevCart.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { dish, quantity, specialInstructions: notes }];
    });

    toast.success(`Added ${quantity}x ${dish.name} to order`, {
      description: `$${(dish.price * quantity).toFixed(2)} • Ready in ~${dish.prepTime}`,
    });
  };

  const handleUpdateQuantity = (dishId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.dish.id === dishId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Smooth scrolling to center the cylinder cards
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
    <div className="relative min-h-screen w-full bg-[#0a0504] text-neutral-100 flex flex-col items-center justify-between select-none overflow-x-hidden">
      {/* 1. Full-Page Ambient WebGL Auralis Background with layered noise, glowing light & film grain */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Auralis height="100%" intensity={1.15} speed={0.9} />
        {/* Soft Vignette Overlay for Crisp Contrast */}
        <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[1px] pointer-events-none" />
      </div>

      {/* Premium Animated Sidebar Nav (Icon Only) */}
      <SidebarNav />

      {/* Order Drawer Sheet */}
      <OrderDrawer
        isOpen={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Part 1: Top Hero Section with Floating Plate Experience */}
      <HeroPlateScrollExperience onScrollToMenu={smoothScrollToMenu} />

      {/* Transitional Section Separation Divider */}
      <MenuSectionDivider />

      {/* Part 2: Interactive 3D Cylinder Gastronomy Menu */}
      <section
        ref={menuSectionRef}
        id="cylinder-menu"
        className="relative z-10 w-full flex flex-col items-center justify-start pt-1 pb-8 px-2 sm:px-6"
      >
        {/* Main Presentation Area: Vertical Spotlight Navbar Tightly Coupled with 3D Cylinder */}
        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center lg:items-center justify-center gap-3 lg:gap-2 max-w-7xl mx-auto py-1">
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
        <footer className="relative z-10 w-full py-3 mt-4">
          <MadeWithDyad />
        </footer>
      </section>
    </div>
  );
}