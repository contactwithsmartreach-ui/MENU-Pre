"use client";

import React, { useState } from "react";
import { Clock, MapPin, Wifi, Phone, ExternalLink } from "lucide-react";
import { RestaurantInfoModals } from "./RestaurantInfoModals";
import { toast } from "sonner";

export function BottomInfoBar() {
  const [activeModal, setActiveModal] = useState<"hours" | "location" | "wifi" | null>(null);

  const handlePhoneClick = () => {
    toast.success("Calling L'Aura Sahara", {
      description: "0659242630 • Direct Order Hotline",
    });
    window.location.href = "tel:0659242630";
  };

  return (
    <>
      <RestaurantInfoModals activeModal={activeModal} onClose={() => setActiveModal(null)} />

      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 mt-8 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-3xl bg-neutral-900/90 backdrop-blur-2xl border border-orange-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {/* 1. Hours & Status */}
          <button
            type="button"
            onClick={() => setActiveModal("hours")}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-neutral-950/80 border border-green-500/30 hover:border-green-400 transition-all cursor-pointer text-left shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-400/40 flex items-center justify-center text-green-400 shrink-0 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                <span className="text-xs font-serif font-bold text-white group-hover:text-green-400 transition-colors">
                  Open until 11:00 PM
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 mt-0.5 truncate">Tap to view weekly schedule</span>
            </div>
          </button>

          {/* 2. Map & Location */}
          <button
            type="button"
            onClick={() => setActiveModal("location")}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-neutral-950/80 border border-orange-500/30 hover:border-orange-400 transition-all cursor-pointer text-left shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 shrink-0 group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-serif font-bold text-white group-hover:text-orange-300 transition-colors">
                Sanctuary Location
              </span>
              <span className="text-[11px] text-neutral-400 mt-0.5 truncate">742 Evergreen Terrace, CA</span>
            </div>
          </button>

          {/* 3. Wi-Fi QR & Credentials */}
          <button
            type="button"
            onClick={() => setActiveModal("wifi")}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-neutral-950/80 border border-sky-500/30 hover:border-sky-400 transition-all cursor-pointer text-left shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
              <Wifi className="w-6 h-6" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-serif font-bold text-white group-hover:text-sky-300 transition-colors">
                Guest Wi-Fi QR
              </span>
              <span className="text-[11px] text-neutral-400 mt-0.5 truncate">Sahara_Guest_5G</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}