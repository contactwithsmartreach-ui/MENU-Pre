"use client";

import React, { useState, useRef } from "react";
import { MENU_ITEMS } from "@/data/menu-data";
import { MenuItem } from "@/types/restaurant";
import { CombinedCylinderMenu } from "@/components/restaurant/CombinedCylinderMenu";
import { DishDetailModal } from "@/components/restaurant/DishDetailModal";
import { HeroPlateScrollExperience } from "@/components/restaurant/HeroPlateScrollExperience";
import { VerticalSpotlightNavbar } from "@/components/restaurant/VerticalSpotlightNavbar";
import { MenuSectionDivider } from "@/components/restaurant/MenuSectionDivider";
import { ChefScrollShowcase } from "@/components/restaurant/ChefScrollShowcase";
import { RestaurantStorySection } from "@/components/restaurant/RestaurantStorySection";
import { OrderDrawer } from "@/components/restaurant/OrderDrawer";
import { CartItem } from "@/types/restaurant";
import { toast } from "sonner";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);

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
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.dish.id === dish.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          specialInstructions: notes || updated[existingIndex].specialInstructions,
        };
        return updated;
      }
      return [...prevCart, { dish, quantity, specialInstructions: notes }];
    });

    toast.success(`Added ${quantity}x ${dish.name} to order`, {
      description: `$${(dish.price * quantity).toFixed(2)} • ${
        notes ? `"${notes}"` : `Ready in ~${dish.prepTime}`
      }`,
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

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative min-h-screen w-full bg-[#0a0504] text-neutral-100 flex flex-col items-center justify-between select-none overflow-x-hidden">
      {/* Floating Header Order Button */}
      <header className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <Button
          onClick={() => setIsOrderDrawerOpen(true)}
          className="relative bg-neutral-950/90 backdrop-blur-xl border border-orange-500/50 hover:border-orange-400 text-white px-4 py-2.5 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)] flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
        >
          <ShoppingBag className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-serif font-bold uppercase tracking-wider">Table Order</span>
          {totalCartCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
              {totalCartCount}
            </span>
          )}
        </Button>
      </header>

      {/* Sahara Sunset Ambient Glowing Atmospheric Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-red-600/25 via-orange-500/25 to-pink-600/15 rounded-full blur-[180px] animate-pulse duration-1000" />
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-amber-500/20 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-[600px] h-[450px] bg-red-700/20 rounded-full blur-[170px]" />

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

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(249, 115, 22, 0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Part 1: Top Hero Section with Camera-Tracking Chef Hat & CTA */}
      <HeroPlateScrollExperience onScrollToMenu={handleScrollToMenu} />

      {/* Transitional Section Separation Divider */}
      <MenuSectionDivider />

      {/* Part 2: Restaurant Story & Ambiance */}
      <RestaurantStorySection />

      <MenuSectionDivider />

      {/* Part 3: Culinary Craft & Skills Showcase with Camera Scroll Tracking */}
      <ChefScrollShowcase />

      <MenuSectionDivider />

      {/* Part 4: Interactive 3D Cylinder Gastronomy Menu */}
      <section
        ref={menuSectionRef}
        id="cylinder-menu"
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-between pt-6 pb-16 px-2 sm:px-6"
      >
        <div className="text-center space-y-2 mb-6">
          <span className="text-xs font-serif uppercase tracking-[0.3em] text-orange-400">
            Interactive Rotating Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white">
            Explore The 3D Cylinder Menu
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Swipe, drag, or select categories to inspect and order our masterwork courses.
          </p>
        </div>

        <div className="relative z-10 w-full flex-1 flex flex-col lg:flex-row items-center lg:items-center justify-center gap-4 lg:gap-2 max-w-7xl mx-auto py-2">
          <div className="shrink-0 flex items-center justify-center lg:pr-2 z-30">
            <VerticalSpotlightNavbar
              items={CATEGORY_ITEMS}
              activeIndex={activeCategoryIdx}
              onItemClick={(_, idx) => handleCategorySelect(idx)}
            />
          </div>

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

        <DishDetailModal
          dish={selectedDish}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDish(null);
          }}
          onAddToCart={handleAddToCart}
        />

        <OrderDrawer
          isOpen={isOrderDrawerOpen}
          onClose={() => setIsOrderDrawerOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />

        <footer className="relative z-10 w-full py-6 mt-12 border-t border-white/10 text-center">
          <p className="text-xs text-neutral-400 font-serif mb-2">&copy; L&apos;Aura Sahara Luxury Dining Experience. All rights reserved.</p>
          <MadeWithDyad />
        </footer>
      </section>
    </div>
  );
}