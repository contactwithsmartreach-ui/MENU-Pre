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

      {/* Sahara Sunset Ambient Atmospheric Background matching hero tone */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden transform-gpu bg-[#0a0504]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-sky-500/10 via-orange-500/10 to-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-[500px] h-[350px] bg-sky-600/10 rounded-full blur-3xl" />

        {/* Topographic Dune Wave Lines */}
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-[45%] opacity-10 pointer-events-none"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bg-sahara-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(37, 99%, 67%)" />
              <stop offset="50%" stopColor="#38bdf8" />
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
              "radial-gradient(rgba(56, 189, 248, 0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Part 1: Top Hero Section with Floating Plate Experience */}
      <HeroPlateScrollExperience onScrollToMenu={smoothScrollToMenu} />

      {/* Transitional Section Separation Divider */}
      <MenuSectionDivider />

      {/* Part 2: Interactive 3D Cylinder Gastronomy Menu */}
      <section
        ref={menuSectionRef}
        id="cylinder-menu"
        className="relative z-10 w-full flex flex-col items-center justify-start pt-6 pb-8 px-2 sm:px-6 bg-[#0a0504]"
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