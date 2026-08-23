"use client";

import React, { useState } from "react";
import { Phone, MapPin, Menu, X, Wifi, Navigation, Sparkles, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { RestaurantInfoModals } from "./RestaurantInfoModals";

export function SidebarNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState<"hours" | "location" | "wifi" | null>(null);

  const handlePhoneClick = () => {
    toast.success("Appel de L'Aura Sahara", {
      description: "0659242630 • Commandes & Réservations de Tables",
    });
    window.location.href = "tel:0659242630";
  };

  const handleSocialClick = (platform: string) => {
    toast.info(`Connexion à ${platform}`, {
      description: `@laurasahara.dining`,
    });
  };

  return (
    <>
      <RestaurantInfoModals activeModal={activeModal} onClose={() => setActiveModal(null)} />

      {/* Floating Toggle Button */}
      <div className="fixed top-6 left-6 z-50 flex items-center">
        <motion.button
          whileHover={{ scale: 1.12, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-label="Basculer le Menu & Info"
          className="relative group p-3.5 flex items-center justify-center rounded-2xl bg-neutral-950/85 backdrop-blur-xl border border-orange-500/40 text-orange-400 shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_40px_rgba(249,115,22,0.6)] transition-all duration-300 cursor-pointer focus:outline-none"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-red-500/20 via-orange-500/20 to-amber-500/10 opacity-75 group-hover:opacity-100 transition-opacity" />
          {isExpanded ? (
            <X className="w-6 h-6 stroke-[2.5] relative z-10 text-white" />
          ) : (
            <Menu className="w-6 h-6 stroke-[2.5] relative z-10 text-orange-400 group-hover:text-white transition-colors" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 z-40 bg-neutral-950/70 backdrop-blur-md"
            />

            {/* Luxury Slide-out Sidebar */}
            <motion.aside
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 sm:w-96 bg-gradient-to-b from-neutral-950 via-[#0d0706] to-neutral-950 text-white border-r border-orange-500/40 shadow-[30px_0_80px_rgba(0,0,0,0.8)] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-500/15 via-red-500/10 to-transparent pointer-events-none rounded-bl-full blur-3xl" />

              <div className="relative z-10 space-y-6 pt-12">
                {/* Brand Header inside Sidebar */}
                <div className="flex items-center gap-3.5 pb-6 border-b border-orange-500/25">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-orange-500 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-orange-600/40 border border-orange-300/40 shrink-0">
                    <Sparkles className="w-6 h-6 text-amber-200 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                      L&apos;Aura Sahara
                    </h2>
                    <p className="text-[11px] font-serif uppercase tracking-widest text-neutral-400">
                      Gastronomie & Bar 3D
                    </p>
                  </div>
                </div>

                {/* Quick Navigation Cards */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal("location");
                      setIsExpanded(false);
                    }}
                    className="group flex items-center justify-between w-full p-4 rounded-2xl bg-neutral-900/90 hover:bg-gradient-to-r hover:from-red-950/40 hover:to-orange-950/40 border border-orange-500/30 hover:border-orange-400 transition-all duration-300 cursor-pointer shadow-lg text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0 group-hover:scale-105 transition-transform">
                        <Navigation className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-serif font-semibold text-white group-hover:text-orange-300 transition-colors block">
                          Localisation & Plan
                        </span>
                        <span className="text-[11px] text-neutral-400 truncate block max-w-[180px]">
                          742 Evergreen Terrace, CA
                        </span>
                      </div>
                    </div>
                    <MapPin className="w-4 h-4 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal("wifi");
                      setIsExpanded(false);
                    }}
                    className="group flex items-center justify-between w-full p-4 rounded-2xl bg-neutral-900/90 hover:bg-gradient-to-r hover:from-sky-950/40 hover:to-cyan-950/40 border border-sky-500/30 hover:border-sky-400 transition-all duration-300 cursor-pointer shadow-lg text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 shrink-0 group-hover:scale-105 transition-transform">
                        <Wifi className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-serif font-semibold text-white group-hover:text-sky-300 transition-colors block">
                          Wi-Fi Haut Débit
                        </span>
                        <span className="text-[11px] text-neutral-400 block">
                          QR Code & Identifiants VIP
                        </span>
                      </div>
                    </div>
                    <Wifi className="w-4 h-4 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Direct Phone Order Section */}
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-serif uppercase tracking-[0.2em] text-orange-400 font-bold px-1">
                    Ligne Directe de Commande
                  </p>
                  <button
                    type="button"
                    onClick={handlePhoneClick}
                    className="group flex items-center justify-between w-full p-4 rounded-2xl bg-gradient-to-r from-green-950/60 via-emerald-950/50 to-neutral-900 border border-green-500/40 hover:border-green-400 transition-all duration-300 cursor-pointer shadow-xl"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#16a34a] to-[#22c55e] flex items-center justify-center text-white shadow-lg shadow-green-500/40 group-hover:scale-105 transition-transform">
                        <Phone className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs sm:text-sm font-serif font-bold text-white group-hover:text-green-300 transition-colors">
                          Appeler pour Commander
                        </span>
                        <span className="text-xs text-green-400 font-mono font-bold tracking-wide">
                          0659242630
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-green-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Social Media Links */}
                <div className="space-y-2 pt-1">
                  <p className="text-[10px] font-serif uppercase tracking-[0.2em] text-orange-400 font-bold px-1">
                    Réseaux Sociaux
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialClick("Instagram")}
                      className="group flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/90 border border-orange-500/25 hover:border-pink-500/60 transition-all cursor-pointer text-left shadow-md hover:bg-neutral-800"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-pink-500/30">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-white truncate">Instagram</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialClick("Facebook")}
                      className="group flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/90 border border-orange-500/25 hover:border-blue-500/60 transition-all cursor-pointer text-left shadow-md hover:bg-neutral-800"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#316FF6] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-blue-500/30">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                          <path d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-white truncate">Facebook</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="relative z-10 pt-6 mt-6 border-t border-orange-500/25 text-center space-y-1">
                <p className="text-xs text-neutral-300 font-serif font-medium">
                  Ouvert 7j/7 : 17h00 &ndash; Minuit
                </p>
                <p className="text-[11px] text-green-400 font-mono font-bold tracking-wide">
                  Service Voiturier &bull; 0659242630
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}