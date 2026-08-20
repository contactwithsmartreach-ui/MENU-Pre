"use client";

import React, { useState } from "react";
import { Phone, MapPin, Menu, X, Sparkles, Clock, Wifi, Navigation } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { RestaurantInfoModals } from "./RestaurantInfoModals";

export function SidebarNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState<"hours" | "location" | "wifi" | null>(null);

  const handlePhoneClick = () => {
    toast.success("Calling L'Aura Sahara", {
      description: "0659242630 • Direct Order & Table Reservations",
    });
    window.location.href = "tel:0659242630";
  };

  const handleSocialClick = (platform: string) => {
    toast.info(`Connecting to ${platform}`, {
      description: `@laurasahara.dining`,
    });
  };

  return (
    <>
      <RestaurantInfoModals activeModal={activeModal} onClose={() => setActiveModal(null)} />

      {/* Floating Toggle Icon Button in Top-Left Open Space */}
      <div className="fixed top-6 left-6 z-50 flex items-center">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-label="Toggle Menu & Info"
          className="relative p-2.5 flex items-center justify-center cursor-pointer focus:outline-none text-orange-600 hover:text-orange-500 transition-colors drop-shadow-[0_2px_10px_rgba(249,115,22,0.4)]"
        >
          {isExpanded ? (
            <X className="w-8 h-8 stroke-[2.5] text-orange-600" />
          ) : (
            <Menu className="w-8 h-8 stroke-[2.5] text-orange-600" />
          )}
        </motion.button>
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
              className="fixed inset-0 z-40 bg-neutral-950/40 backdrop-blur-md"
            />

            {/* Sidebar Content */}
            <motion.aside
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 sm:w-96 bg-[#e3efed] backdrop-blur-2xl border-r border-orange-500/30 shadow-[20px_0_60px_rgba(0,0,0,0.25)] p-6 flex flex-col justify-between overflow-y-auto text-neutral-900"
            >
              <div className="space-y-5 pt-16">
                {/* Header branding */}
                <div className="space-y-1 pb-4 border-b border-orange-500/20">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Sparkles className="w-4 h-4 fill-orange-600" />
                    <span className="text-xs uppercase font-serif tracking-[0.25cm] font-bold">L&apos;Aura Sahara</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-orange-600 tracking-wide">
                    Gastronomy Portal
                  </h2>
                  <p className="text-xs text-neutral-600 font-light">
                    Explore live hours, map directions, Wi-Fi, and order hotline.
                  </p>
                </div>

                {/* Live Status & Hours Banner */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal("hours");
                    setIsExpanded(false);
                  }}
                  className="group flex items-center justify-between w-full p-3 rounded-2xl bg-white border border-green-500/30 hover:border-green-600 transition-all cursor-pointer shadow-sm text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30 shrink-0 group-hover:scale-105 transition-transform">
                      <Clock className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-600 animate-ping" />
                        <span className="text-xs font-semibold text-neutral-900 group-hover:text-green-700 transition-colors">
                          Open until 11:00 PM
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500">Tap to view full weekly hours</p>
                    </div>
                  </div>
                </button>

                {/* Location Map & Directions Button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal("location");
                    setIsExpanded(false);
                  }}
                  className="group flex items-center justify-between w-full p-3 rounded-2xl bg-white border border-orange-500/30 hover:border-orange-600 transition-all cursor-pointer shadow-sm text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0 group-hover:scale-105 transition-transform">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors">
                        Sanctuary Location & Map
                      </span>
                      <p className="text-[11px] text-neutral-500 truncate max-w-[180px]">742 Evergreen Terrace, CA</p>
                    </div>
                  </div>
                  <MapPin className="w-4 h-4 text-orange-600" />
                </button>

                {/* Wi-Fi QR Code Button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal("wifi");
                    setIsExpanded(false);
                  }}
                  className="group flex items-center justify-between w-full p-3 rounded-2xl bg-white border border-sky-500/30 hover:border-sky-600 transition-all cursor-pointer shadow-sm text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 shrink-0 group-hover:scale-105 transition-transform">
                      <Wifi className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-neutral-900 group-hover:text-sky-600 transition-colors">
                        High-Speed Wi-Fi
                      </span>
                      <p className="text-[11px] text-neutral-500">Scan QR Code & Credentials</p>
                    </div>
                  </div>
                  <Wifi className="w-4 h-4 text-sky-600" />
                </button>

                {/* Direct Order Hotline */}
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-serif uppercase tracking-widest text-orange-600 font-bold">
                    Phone Order Hotline
                  </p>
                  <button
                    type="button"
                    onClick={handlePhoneClick}
                    className="group flex items-center gap-4 w-full p-3.5 rounded-2xl bg-white border border-orange-500/20 hover:border-orange-500/60 transition-all cursor-pointer shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#16a34a] to-[#22c55e] flex items-center justify-center text-white shadow-lg shadow-green-500/30 group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-serif font-semibold text-neutral-900 group-hover:text-green-700 transition-colors">
                        Call to Order
                      </span>
                      <span className="text-[11px] text-green-700 font-mono font-bold">
                        0659242630
                      </span>
                    </div>
                  </button>
                </div>

                {/* Social Channels */}
                <div className="space-y-2 pt-1">
                  <p className="text-[10px] font-serif uppercase tracking-widest text-orange-600 font-bold">
                    Social Channels
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleSocialClick("Instagram")}
                      className="group flex items-center gap-2 p-2.5 rounded-xl bg-white border border-orange-500/25 hover:border-orange-500/60 transition-all cursor-pointer text-left shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-pink-500/20">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-neutral-900 truncate">Instagram</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialClick("Facebook")}
                      className="group flex items-center gap-2 p-2.5 rounded-xl bg-white border border-orange-500/25 hover:border-orange-500/60 transition-all cursor-pointer text-left shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#316FF6] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-blue-500/20">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                          <path d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-neutral-900 truncate">Facebook</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-orange-500/20 text-center">
                <p className="text-[11px] text-neutral-600 font-serif font-medium">Open Daily: 5:00 PM &ndash; Midnight</p>
                <p className="text-[10px] text-green-700 font-mono font-bold mt-0.5">Order Hotline: 0659242630</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}