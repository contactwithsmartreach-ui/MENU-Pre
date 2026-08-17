"use client";

import React, { useState } from "react";
import { Phone, MapPin, Menu, X, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  onOpenCart?: () => void;
  cartCount?: number;
}

export function SidebarNav({ onOpenCart, cartCount = 0 }: SidebarNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePhoneClick = () => {
    toast.success("Calling L'Aura Sahara", {
      description: "+1 (555) 724-2720 • Valet & Table Reservations",
    });
  };

  const handleLocationClick = () => {
    toast.info("L'Aura Sahara Location", {
      description: "742 Evergreen Terrace, Sahara District, CA 90210",
    });
  };

  const handleSocialClick = (platform: string) => {
    toast.info(`Connecting to ${platform}`, {
      description: `@laurasahara.dining`,
    });
  };

  return (
    <>
      {/* Floating Toggle Pill Button */}
      <div className="fixed top-6 left-6 z-50 flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded((prev) => !prev)}
          className={cn(
            "group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full cursor-pointer transition-all duration-300",
            "bg-neutral-950/90 backdrop-blur-xl border text-white shadow-lg",
            isExpanded
              ? "border-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.4)]"
              : "border-orange-500/30 hover:border-orange-400/80 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          )}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/30">
            {isExpanded ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </div>
          <span className="text-xs font-serif font-bold tracking-widest uppercase text-orange-200 group-hover:text-white">
            {isExpanded ? "Close" : "Menu & Info"}
          </span>
        </motion.button>

        {/* Quick Cart Trigger Pill */}
        {onOpenCart && (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.7)] cursor-pointer border border-orange-300/40"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-serif font-bold tracking-wider">Order</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-neutral-950 text-amber-300 text-[11px] font-bold flex items-center justify-center border border-amber-400/50">
                {cartCount}
              </span>
            )}
          </motion.button>
        )}
      </div>

      {/* Premium Animated Sidebar Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 z-40 bg-neutral-950/80 backdrop-blur-md"
            />

            {/* Sidebar Content */}
            <motion.aside
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 sm:w-96 bg-neutral-950/95 backdrop-blur-2xl border-r border-orange-500/30 shadow-[20px_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(249,115,22,0.2)] p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6 pt-16">
                {/* Header branding */}
                <div className="space-y-1 pb-4 border-b border-orange-500/20">
                  <div className="flex items-center gap-2 text-orange-400">
                    <Sparkles className="w-4 h-4 fill-orange-400" />
                    <span className="text-xs uppercase font-serif tracking-[0.25em]">L&apos;Aura Sahara</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
                    Gastronomy Portal
                  </h2>
                  <p className="text-xs text-neutral-400 font-light">
                    Explore our luxury dining lounge, quick contacts, and socials.
                  </p>
                </div>

                {/* Contact & Location Actions */}
                <div className="space-y-3">
                  <p className="text-[10px] font-serif uppercase tracking-widest text-orange-300/70">
                    Direct Concierge
                  </p>

                  <button
                    type="button"
                    onClick={handlePhoneClick}
                    className="group flex items-center gap-4 w-full p-3.5 rounded-2xl bg-neutral-900/80 border border-orange-500/20 hover:border-orange-400/60 hover:bg-neutral-900 transition-all cursor-pointer shadow-md"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#16a34a] to-[#22c55e] flex items-center justify-center text-white shadow-lg shadow-green-500/30 group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-serif font-semibold text-white group-hover:text-green-400 transition-colors">
                        Call Concierge
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        +1 (555) 724-2720
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleLocationClick}
                    className="group flex items-center gap-4 w-full p-3.5 rounded-2xl bg-neutral-900/80 border border-orange-500/20 hover:border-orange-400/60 hover:bg-neutral-900 transition-all cursor-pointer shadow-md"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ea580c] to-[#f97316] flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
                      <MapPin className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-serif font-semibold text-white group-hover:text-orange-400 transition-colors">
                        Sahara Sanctuary
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        742 Evergreen Terrace, CA
                      </span>
                    </div>
                  </button>
                </div>

                {/* Social Channels */}
                <div className="space-y-3 pt-2">
                  <p className="text-[10px] font-serif uppercase tracking-widest text-orange-300/70">
                    Social Channels
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Instagram */}
                    <button
                      type="button"
                      onClick={() => handleSocialClick("Instagram")}
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/80 border border-orange-500/20 hover:border-orange-400/60 hover:bg-neutral-900 transition-all cursor-pointer shadow-md"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] flex items-center justify-center text-white shadow-lg shadow-pink-600/30 group-hover:scale-105 transition-transform shrink-0">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 448 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                        </svg>
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <span className="text-xs font-semibold text-white truncate">Instagram</span>
                        <span className="text-[10px] text-neutral-400 truncate">@laurasahara</span>
                      </div>
                    </button>

                    {/* Facebook */}
                    <button
                      type="button"
                      onClick={() => handleSocialClick("Facebook")}
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/80 border border-orange-500/20 hover:border-orange-400/60 hover:bg-neutral-900 transition-all cursor-pointer shadow-md"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#316FF6] flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform shrink-0">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 448 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z" />
                        </svg>
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <span className="text-xs font-semibold text-white truncate">Facebook</span>
                        <span className="text-[10px] text-neutral-400 truncate">L&apos;Aura Sahara</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer inside sidebar */}
              <div className="pt-6 border-t border-orange-500/20 text-center">
                <p className="text-[11px] text-neutral-400 font-serif">
                  Open Daily: 5:00 PM – Midnight
                </p>
                <p className="text-[10px] text-orange-400 font-mono mt-0.5">
                  Valet Service Available
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}