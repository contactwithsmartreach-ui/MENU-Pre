"use client";

import React, { useState } from "react";
import { MenuItem } from "@/types/restaurant";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  Flame,
  Clock,
  UtensilsCrossed,
  X,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SaharaButton } from "./SaharaButton";

export interface DishDetailModalProps {
  dish?: MenuItem | null;
  item?: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (dish: MenuItem, quantity: number, notes?: string) => void;
  onOrderNow?: (item: MenuItem, quantity: number) => void;
}

export function DishDetailModal({
  dish,
  item,
  isOpen,
  onClose,
  onAddToCart,
  onOrderNow,
}: DishDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  const activeDish = dish || item;
  if (!activeDish) return null;

  const handleOrder = () => {
    if (onAddToCart) {
      onAddToCart(activeDish, quantity);
    }
    if (onOrderNow) {
      onOrderNow(activeDish, quantity);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[540px] p-0 bg-neutral-950 border border-orange-500/40 text-white rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(249,115,22,0.35)]">
        {/* Header Image Stage */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src={activeDish.image}
            alt={activeDish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

          {/* Close button with Sahara glow */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white flex items-center justify-center border border-amber-300/60 shadow-[0_0_15px_rgba(249,115,22,0.7)] hover:scale-110 active:scale-95 transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Floating Badges */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeDish.isSignature ? (
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif uppercase tracking-wider px-3 py-1 rounded-full text-xs shadow-lg border-0 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-amber-200" />
                  Chef&apos;s Signature
                </Badge>
              ) : (
                <span className="text-xs font-serif uppercase tracking-widest text-orange-200 bg-neutral-950/80 px-3 py-1 rounded-full backdrop-blur-md border border-orange-500/30">
                  {activeDish.category}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-950/90 backdrop-blur-md px-3 py-1 rounded-full border border-orange-500/40 text-amber-300 text-xs font-bold shadow-lg">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{activeDish.rating} (120+ reviews)</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="text-xl sm:text-2xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-200">
                {activeDish.name}
              </DialogTitle>
              <div className="flex items-baseline gap-0.5 shrink-0">
                <span className="text-sm font-serif text-orange-400 font-bold">$</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-serif">
                  {(activeDish.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>
            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              {activeDish.description}
            </p>
          </DialogHeader>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 py-2 border-y border-orange-500/20 text-xs font-serif">
            <div className="flex items-center gap-2 text-neutral-300">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Prep: <strong className="text-white">{activeDish.prepTime || "15-20 min"}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <UtensilsCrossed className="w-4 h-4 text-orange-400" />
              <span>Cuisine: <strong className="text-white">Sahara Modern</strong></span>
            </div>
          </div>

          {/* Ingredients list */}
          {activeDish.ingredients && activeDish.ingredients.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs uppercase font-serif tracking-wider text-orange-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured Ingredients
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeDish.ingredients.map((ingredient: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-neutral-900 border border-orange-500/20 text-neutral-300 px-2.5 py-1 rounded-full font-serif"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA */}
          <div className="pt-3 flex items-center justify-between gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 bg-neutral-900/90 border border-orange-500/30 rounded-full px-3 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease Quantity"
                className="w-7 h-7 rounded-full bg-neutral-800 text-orange-300 hover:text-white hover:bg-neutral-700 flex items-center justify-center transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-serif font-bold text-base w-4 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase Quantity"
                className="w-7 h-7 rounded-full bg-neutral-800 text-orange-300 hover:text-white hover:bg-neutral-700 flex items-center justify-center transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Redesigned Order CTA matching SaharaButton */}
            <div className="flex-1">
              <SaharaButton
                onClick={handleOrder}
                primaryText="ADD TO EXPERIENCE"
                hoverText="TASTE GASTRONOMY"
                size="md"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}