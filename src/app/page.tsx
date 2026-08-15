"use client";

import React, { useState } from "react";
import { MENU_ITEMS } from "@/data/menu-data";
import { MenuItem } from "@/types/restaurant";
import { CylinderMenuCarousel } from "@/components/restaurant/CylinderMenuCarousel";
import { DishDetailModal } from "@/components/restaurant/DishDetailModal";
import { toast } from "sonner";
import { MadeWithDyad } from "@/components/made-with-dyad";

export default function RestaurantMenuPage() {
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDish = (dish: MenuItem) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  const handleAddToCart = (dish: MenuItem, quantity: number, notes?: string) => {
    toast.success(`Added ${quantity}x ${dish.name} to order`, {
      description: `$${(dish.price * quantity).toFixed(2)} • ${notes ? `"${notes}"` : `Ready in ~${dish.prepTime}`}`,
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Bold Atmospheric Luxury Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Deep ambient radiance spots */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-600/20 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-rose-600/15 rounded-full blur-[170px]" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/15 rounded-full blur-[160px]" />

        {/* Subtle grid mesh overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Center 3D Cylinder Carousel */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center p-4">
        <CylinderMenuCarousel
          items={MENU_ITEMS}
          onSelectItem={handleOpenDish}
          animationDuration={34}
          cardWidth={260}
        />
      </main>

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
      <footer className="relative z-10 w-full py-3">
        <MadeWithDyad />
      </footer>
    </div>
  );
}