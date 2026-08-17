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
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden bg-[#0c0605] text-white border border-orange-500/40 rounded-3xl shadow-[0_25px_60px_rgba(239,68,68,0.25)]">
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0605] via-[#0c0605]/40 to-transparent" />

          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif tracking-wider uppercase border-0">
              {dish.category}
            </Badge>
            {dish.isSignature && (
              <Badge className="bg-neutral-950/80 text-amber-300 border border-orange-400/40 backdrop-blur-md">
                <Sparkles className="w-3 h-3 mr-1 fill-amber-300" />
                Sahara Signature
              </Badge>
            )}
          </div>
        </div>

        <div className="p-6 pt-2 space-y-4 max-h-[60vh] overflow-y-auto">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="text-2xl font-bold font-serif text-white tracking-tight">
                {dish.name}
              </DialogTitle>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-serif whitespace-nowrap">
                ${dish.price}
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-orange-200/70 pt-1">
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <strong className="text-white">{dish.rating}</strong> ({dish.reviewsCount} reviews)
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                {dish.prepTime}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                {dish.calories} kcal
              </span>
            </div>
          </DialogHeader>

          <p className="text-sm text-neutral-300 leading-relaxed font-light">
            {dish.description}
          </p>

          {dish.chefNote && (
            <div className="p-3.5 rounded-2xl bg-orange-950/30 border border-orange-500/25 flex items-start gap-3">
              <Utensils className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-orange-300 font-serif tracking-wide">Chef&apos;s Recommendation</p>
                <p className="text-xs text-neutral-300 mt-0.5 italic">{dish.chefNote}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 pt-1">
            {dish.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium bg-neutral-900 border border-orange-500/20 px-2.5 py-1 rounded-full text-orange-200/80"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-medium text-orange-200/70 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
              Special Requests or Dietary Preferences:
            </label>
            <Textarea
              placeholder="E.g. Sauce on the side, allergies, extra crispy..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-neutral-900/80 border-orange-500/20 focus:border-orange-400 text-sm rounded-xl resize-none h-20 text-neutral-200"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-orange-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-neutral-900/90 border border-orange-500/30 rounded-full px-3 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 text-orange-300/80 hover:text-white transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold text-sm w-4 text-center text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 text-orange-300/80 hover:text-white transition-colors"
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