"use client";

import React, { useState } from "react";
import { Phone, MapPin, X, Wifi, Navigation, ExternalLink } from "lucide-react";
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

      {/* Floating Toggle Button with Pure Neon Orange 3 bars and no background box */}
      <div className="fixed top-6 left-6 z-50 flex items-center">
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-label="Basculer le Menu & Info"
          className="relative group p-2.5 flex items-center justify-center bg-transparent focus:outline-none cursor-pointer"
        >
          {isExpanded ? (
            <X className="w-8 h-8 stroke-[2.5] relative z-10 text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,1)]" />
          ) : (
            <div className="relative z-10 flex flex-col justify-between w-7 h-5">
              <span className="w-full h-0.5 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,1)]" />
              <span className="w-full h-0.5 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,1)]" />
              <span className="w-full h-0.5 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,1)]" />
            </div>
          )}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md will-change-[opacity]"
            />

            {/* Luxury Slide-out Sidebar with butter-smooth high-performance spring physics */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
                mass: 0.8,
              }}
              style={{ willChange: "transform" }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 sm:w-96 bg-black text-white border-r border-orange-500/50 shadow-[30px_0_80px_rgba(249,115,22,0.25)] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto transform-gpu"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 pointer-events-none rounded-bl-full blur-3xl" />

              <div className="relative z-10 space-y-6 pt-12">
                {/* Quick Navigation Cards */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal("location");
                      setIsExpanded(false);
                    }}
                    className="group flex items-center justify-between w-full p-4 rounded-2xl bg-neutral-950 hover:bg-neutral-900 border border-orange-500/30 hover:border-orange-500 transition-all duration-300 cursor-pointer shadow-lg text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-black border border-orange-500 flex items-center justify-center text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.3)] shrink-0 group-hover:scale-105 transition-transform">
                        <Navigation className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-serif font-semibold text-white group-hover:text-orange-400 transition-colors block">
                          Localisation & Plan
                        </span>
                        <span className="text-[11px] text-neutral-400 truncate block max-w-[180px]">
                          742 Evergreen Terrace, CA
                        </span>
                      </div>
                    </div>
                    <MapPin className="w-4 h-4 text-orange-500 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal("wifi");
                      setIsExpanded(false);
                    }}
                    className="group flex items-center justify-between w-full p-4 rounded-2xl bg-neutral-950 hover:bg-neutral-900 border border-sky-500/30 hover:border-sky-400 transition-all duration-300 cursor-pointer shadow-lg text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-black border border-sky-500 flex items-center justify-center text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)] shrink-0 group-hover:scale-105 transition-transform">
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
                    className="group flex items-center justify-between w-full p-4 rounded-2xl bg-neutral-950 hover:bg-neutral-900 border border-green-500/40 hover:border-green-400 transition-all duration-300 cursor-pointer shadow-xl"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-black border border-green-500 flex items-center justify-center text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)] group-hover:scale-105 transition-transform">
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
                      className="group flex items-center gap-2.5 p-3 rounded-xl bg-neutral-950 border border-orange-500/25 hover:border-pink-500/60 transition-all cursor-pointer text-left shadow-md hover:bg-neutral-900"
                    >
                      <div className="w-8 h-8 rounded-lg bg-black border border-pink-500/50 flex items-center justify-center text-pink-400 shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(236,72,153,0.2)]">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-white truncate">Instagram</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialClick("Facebook")}
                      className="group flex items-center gap-2.5 p-3 rounded-xl bg-neutral-950 border border-orange-500/25 hover:border-blue-500/60 transition-all cursor-pointer text-left shadow-md hover:bg-neutral-900"
                    >
                      <div className="w-8 h-8 rounded-lg bg-black border border-blue-500/50 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(59,130,246,0.2)]">
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
              <div className="relative z-10 pt-6 mt-6 border-t border-orange-500/30 text-center space-y-1">
                <p className="text-xs text-orange-400 font-serif font-medium">
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