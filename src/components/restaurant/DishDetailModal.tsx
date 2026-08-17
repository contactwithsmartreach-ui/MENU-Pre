"use client";

import React, { useState } from "react";
import { MenuItem } from "@/types/restaurant";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star, Clock, Flame, Sparkles, Plus, Minus, Utensils, MessageSquare } from "lucide-react";
import { SaharaButton } from "./SaharaButton";

interface DishDetailModalProps {
  dish: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: MenuItem, quantity: number, notes?: string) => void;
}

export function DishDetailModal({
  dish,
  isOpen,
  onClose,
  onAddToCart,
}: DishDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  if (!dish) return null;

  const handleAdd = () => {
    onAddToCart(dish, quantity, notes.trim() || undefined);
    setQuantity(1);
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden bg-white/90 backdrop-blur-3xl text-neutral-900 border border-white/90 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/30 to-transparent" />

          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif tracking-wider uppercase border-0 shadow-sm">
              {dish.category}
            </Badge>
            {dish.isSignature && (
              <Badge className="bg-white/90 text-amber-700 border border-white shadow-sm backdrop-blur-md">
                <Sparkles className="w-3 h-3 mr-1 fill-amber-600 text-amber-600" />
                Sahara Signature
              </Badge>
            )}
          </div>
        </div>

        <div className="p-6 pt-2 space-y-4 max-h-[60vh] overflow-y-auto">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="text-2xl font-bold font-serif text-neutral-900 tracking-tight">
                {dish.name}
              </DialogTitle>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600 font-serif whitespace-nowrap">
                ${dish.price}
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-neutral-600 pt-1">
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <strong className="text-neutral-900">{dish.rating}</strong> ({dish.reviewsCount} reviews)
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                {dish.prepTime}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Flame className="w-3.5 h-3.5 text-red-600" />
                {dish.calories} kcal
              </span>
            </div>
          </DialogHeader>

          <p className="text-sm text-neutral-700 leading-relaxed font-light">
            {dish.description}
          </p>

          {dish.chefNote && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-start gap-3">
              <Utensils className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-900 font-serif tracking-wide">Chef&apos;s Recommendation</p>
                <p className="text-xs text-neutral-700 mt-0.5 italic">{dish.chefNote}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 pt-1">
            {dish.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium bg-neutral-100 border border-neutral-200/80 px-2.5 py-1 rounded-full text-neutral-700"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-medium text-neutral-700 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              Special Requests or Dietary Preferences:
            </label>
            <Textarea
              placeholder="E.g. Sauce on the side, allergies, extra crispy..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-white/80 border-neutral-200 focus:border-amber-500 text-sm rounded-xl resize-none h-20 text-neutral-800 placeholder:text-neutral-400"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-neutral-100/90 border border-neutral-200 rounded-full px-3 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 text-neutral-600 hover:text-neutral-950 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold text-sm w-4 text-center text-neutral-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 flex justify-end">
              <SaharaButton
                onClick={handleAdd}
                primaryText={`ADD • $${(dish.price * quantity).toFixed(2)}`}
                hoverText="CONFIRM"
                size="md"
                className="w-full py-4"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}