"use client";

import React, { useState, useRef, useCallback, lazy, Suspense } from "react";
import { MENU_ITEMS } from "@/data/menu-data";
import { MenuItem, CartItem } from "@/types/restaurant";
import { DishDetailModal } from "@/components/restaurant/DishDetailModal";
import { HeroPlateScrollExperience } from "@/components/restaurant/HeroPlateScrollExperience";
import { VerticalSpotlightNavbar } from "@/components/restaurant/VerticalSpotlightNavbar";
import { MenuSectionDivider } from "@/components/restaurant/MenuSectionDivider";
import { SidebarNav } from "@/components/restaurant/SidebarNav";
import { OrderDrawer } from "@/components/restaurant/OrderDrawer";
import { PreloadScreen } from "@/components/restaurant/PreloadScreen";
import { FeaturedFoodGrid } from "@/components/restaurant/FeaturedFoodGrid";
import { toast } from "sonner";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Loader2 } from "lucide-react";

const LazyCylinderWrapper = lazy(() =>
  import("@/components/restaurant/LazyCylinderWrapper").then((mod) => ({
    default: mod.LazyCylinderWrapper,
  }))
);

const CATEGORY_ITEMS = [
  { label: "Tout", id: "All" },
  { label: "Pizzas", id: "Pizzas" },
  { label: "Burgers", id: "Burgers" },
  { label: "Tacos", id: "Tacos" },
  { label: "Plats", id: "Plats" },
  { label: "Desserts", id: "Desserts" },
  { label: "Boissons", id: "Boissons" },
];

export default function RestaurantMenuPage() {
  const [isLoading, setIsLoading] = useState(true);
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

    toast.success(`Ajouté ${quantity}x ${dish.name} à la commande`, {
      description: `${(dish.price * quantity).toLocaleString()} DA • Prêt en ~${dish.prepTime}`,
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
    <div className="relative min-h-screen w-full bg-[#e3efed] text-neutral-900 flex flex-col items-center justify-between select-none overflow-x-hidden">
      {isLoading && <PreloadScreen onComplete={() => setIsLoading(false)} />}

      <SidebarNav />

      <OrderDrawer
        isOpen={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden transform-gpu">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-orange-400/15 via-sky-300/20 to-amber-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-[500px] h-[350px] bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <HeroPlateScrollExperience onScrollToMenu={smoothScrollToMenu} />

      <MenuSectionDivider />

      <section
        ref={menuSectionRef}
        id="cylinder-menu"
        className="relative z-10 w-full flex flex-col items-center justify-start pt-6 pb-4 px-2 sm:px-6 bg-gradient-to-b from-[#e3efed] via-[#d4e7e4] to-[#c6dedb]"
      >
        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center lg:items-center justify-center gap-3 lg:gap-2 max-w-7xl mx-auto py-1">
          <div className="shrink-0 flex items-center justify-center lg:pr-2 z-35">
            <VerticalSpotlightNavbar
              items={CATEGORY_ITEMS}
              activeIndex={activeCategoryIdx}
              onItemClick={(_, idx) => handleCategorySelect(idx)}
            />
          </div>

          <div
            ref={cylinderContainerRef}
            className="flex-1 w-full flex items-center justify-center overflow-visible scroll-mt-6"
          >
            <Suspense
              fallback={
                <div className="w-full h-[600px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    <span className="text-xs font-serif uppercase tracking-widest text-neutral-600">
                      Chargement du Menu 3D...
                    </span>
                  </div>
                </div>
              }
            >
              <LazyCylinderWrapper
                items={filteredItems}
                onSelectItem={handleOpenDish}
              />
            </Suspense>
          </div>
        </div>

        {/* Featured Food Grid with Scroll Reveal & Surface Reflections */}
        <FeaturedFoodGrid onSelectItem={handleOpenDish} />

        <DishDetailModal
          dish={selectedDish}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDish(null);
          }}
          onAddToCart={handleAddToCart}
        />

        <footer className="relative z-10 w-full py-3 mt-6 text-neutral-600">
          <MadeWithDyad />
        </footer>
      </section>
    </div>
  );
}