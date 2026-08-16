"use client";

import React, { useState, useRef } from "react";
import { MENU_ITEMS } from "@/data/menu-data";
import { MenuItem, CartItem } from "@/types/restaurant";
import { CombinedCylinderMenu } from "@/components/restaurant/CombinedCylinderMenu";
import { DishDetailModal } from "@/components/restaurant/DishDetailModal";
import { HeroPlateScrollExperience } from "@/components/restaurant/HeroPlateScrollExperience";
import { VerticalSpotlightNavbar } from "@/components/restaurant/VerticalSpotlightNavbar";
import { MenuSectionDivider } from "@/components/restaurant/MenuSectionDivider";
import { ScrollVideoBackground } from "@/components/restaurant/ScrollVideoBackground";
import { NovaNavbar } from "@/components/restaurant/NovaNavbar";
import { NovaSectionTwo } from "@/components/restaurant/NovaSectionTwo";
import { OrderDrawer } from "@/components/restaurant/OrderDrawer";
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

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
    setCart((prev) => {
      const existingIdx = prev.findIndex((i) => i.dish.id === dish.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        if (notes) updated[existingIdx].specialInstructions = notes;
        return updated;
      }
      return [...prev, { dish, quantity, specialInstructions: notes }];
    });

    toast.success(`Added ${quantity}x ${dish.name} to order`, {
      description: `$${(dish.price * quantity).toFixed(2)} • ${
        notes ? `"${notes}"` : `Ready in ~${dish.prepTime}`
      }`,
    });
  };

  const handleUpdateQuantity = (dishId: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.dish.id === dishId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
    toast.info("Item removed from order");
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
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col justify-between selection:bg-white/20">
      {/* Scroll-scrubbed CloudFront Video Background */}
      <ScrollVideoBackground />

      <div className="relative z-10 flex flex-col w-full">
        {/* Fixed Cinematic Navbar */}
        <NovaNavbar onOpenOrder={() => setIsOrderOpen(true)} cartCount={totalCartCount} />

        {/* Section One: Hero */}
        <HeroPlateScrollExperience
          onScrollToMenu={handleScrollToMenu}
          onOpenOrder={() => setIsOrderOpen(true)}
        />

        {/* Mid Spacer so scroll video can scrub smoothly */}
        <div className="h-[60vh] sm:h-[80vh]" aria-hidden="true" />

        {/* Section Two: Capability */}
        <NovaSectionTwo onScrollToMenu={handleScrollToMenu} />

        {/* Transitional Section Separation Divider */}
        <MenuSectionDivider />

        {/* Interactive 3D Cylinder Gastronomy Menu */}
        <section
          ref={menuSectionRef}
          id="cylinder-menu"
          className="relative z-10 w-full min-h-screen flex flex-col items-center justify-between pt-8 pb-16 px-2 sm:px-6"
        >
          <div className="relative z-10 w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-2 max-w-7xl mx-auto py-2">
            <div className="shrink-0 flex items-center justify-center lg:pr-2 z-30">
              <VerticalSpotlightNavbar
                items={CATEGORY_ITEMS}
                activeIndex={activeCategoryIdx}
                onItemClick={(_, idx) => handleCategorySelect(idx)}
              />
            </div>

            <div
              ref={cylinderContainerRef}
              className="flex-1 w-full flex items-center justify-center overflow-visible scroll-mt-24"
            >
              <CombinedCylinderMenu
                key={selectedCategory}
                items={filteredItems}
                onSelectItem={handleOpenDish}
              />
            </div>
          </div>
        </section>

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

        {/* Order Drawer Sheet */}
        <OrderDrawer
          isOpen={isOrderOpen}
          onClose={() => setIsOrderOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />

        {/* Footer */}
        <footer className="relative z-10 w-full py-8 text-center text-xs text-white/60">
          <MadeWithDyad />
        </footer>
      </div>
    </div>
  );
}