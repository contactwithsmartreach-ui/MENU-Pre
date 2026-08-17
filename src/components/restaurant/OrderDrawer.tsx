"use client";

import React from "react";
import { CartItem } from "@/types/restaurant";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { SaharaButton } from "./SaharaButton";

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onRemoveItem: (dishId: string) => void;
  onClearCart: () => void;
}

export function OrderDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: OrderDrawerProps) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  );
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  const handleCheckout = () => {
    toast.success("Order Placed Successfully!", {
      description: "Our master chefs have received your culinary request.",
    });
    onClearCart();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-[#0c0605] text-white border-orange-500/30 w-full sm:max-w-md flex flex-col p-6">
        <SheetHeader className="text-left border-b border-orange-500/20 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-serif text-amber-400 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Your Table Order
            </SheetTitle>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-orange-300/70 hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <SheetDescription className="text-xs text-neutral-400">
            {cart.length === 0
              ? "Your dining order is currently empty."
              : `${cart.reduce((c, i) => c + i.quantity, 0)} items prepared for your table`}
          </SheetDescription>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-orange-500/20 flex items-center justify-center text-neutral-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-white">No dishes selected yet</p>
              <p className="text-xs text-neutral-400 max-w-xs">
                Spin through our cylinder menu and click any signature dish to add it to your order.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {cart.map((item) => (
              <div
                key={item.dish.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/80 border border-orange-500/20"
              >
                <img
                  src={item.dish.image}
                  alt={item.dish.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {item.dish.name}
                  </h4>
                  <p className="text-xs text-amber-400 font-serif font-bold">
                    ${(item.dish.price * item.quantity).toFixed(2)}
                  </p>
                  {item.specialInstructions && (
                    <p className="text-[11px] text-neutral-400 italic truncate mt-0.5">
                      &ldquo;{item.specialInstructions}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 bg-neutral-950 border border-orange-500/20 rounded-full px-2 py-1">
                  <button
                    type="button"
                    onClick={() =>
                      item.quantity === 1
                        ? onRemoveItem(item.dish.id)
                        : onUpdateQuantity(item.dish.id, item.quantity - 1)
                    }
                    className="text-neutral-400 hover:text-white p-0.5"
                  >
                    {item.quantity === 1 ? (
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    ) : (
                      <Minus className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="text-xs font-semibold w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateQuantity(item.dish.id, item.quantity + 1)
                    }
                    className="text-neutral-400 hover:text-white p-0.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="border-t border-orange-500/20 pt-4 space-y-4 pb-2">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-neutral-400 text-xs">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400 text-xs">
                <span>Estimated Tax (8.25%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold font-serif text-base pt-1 border-t border-orange-500/20">
                <span>Total</span>
                <span className="text-amber-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="w-full flex justify-center pt-2">
              <SaharaButton
                onClick={handleCheckout}
                primaryText={`CONFIRM • $${total.toFixed(2)}`}
                hoverText="CHECKOUT"
                size="md"
                className="w-full"
              />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}