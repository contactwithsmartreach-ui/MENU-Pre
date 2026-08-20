"use client";

import React, { useState } from "react";
import { Clock, MapPin, Wifi, PhoneCall, Sparkles, Navigation } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function RestaurantInfoBar() {
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);

  // Check if restaurant is currently open (e.g. 5 PM to midnight)
  const now = new Date();
  const currentHour = now.getHours();
  const isOpen = currentHour >= 17 || currentHour < 1;
  const statusText = isOpen ? "Open Now • Closes at 12:00 AM" : "Closed • Opens Today at 5:00 PM";

  const handlePhoneClick = () => {
    toast.success("Calling L'Aura Sahara", {
      description: "0659242630 • Connecting phone call for table order...",
    });
    window.location.href = "tel:0659242630";
  };

  const handleDirectionsClick = () => {
    toast.success("Opening Google Maps Directions", {
      description: "742 Evergreen Terrace, Sahara District, CA 90210",
    });
    window.open("https://maps.google.com/?q=742+Evergreen+Terrace+Sahara+District", "_blank");
  };

  const handleWifiClick = () => {
    setIsWifiModalOpen(true);
    toast.info("Wi-Fi Details", {
      description: "Scan QR code or tap to copy Wi-Fi password.",
    });
  };

  const handleCopyWifi = () => {
    navigator.clipboard.writeText("SaharaGastronomy2025!");
    toast.success("Wi-Fi Password Copied!", {
      description: "Network: L_Aura_Sahara_Guest",
    });
  };

  return (
    <>
      {/* Top Professional Info Bar */}
      <div className="relative z-40 w-full bg-neutral-950/95 border-b border-orange-500/25 py-2.5 px-3 sm:px-6 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Live Status & Hours */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              {isOpen ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              )}
            </span>
            <div className="flex items-center gap-1.5 font-serif text-neutral-300">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span className="font-semibold text-white">{statusText}</span>
              <span className="text-neutral-500 hidden sm:inline">(&bull; Valet parking available)</span>
            </div>
          </div>

          {/* Quick Action Pills: Directions, Wi-Fi, Call Hotline */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Google Maps Directions */}
            <button
              type="button"
              onClick={handleDirectionsClick}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-orange-500/20 hover:border-orange-400 text-neutral-300 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>Directions</span>
              <Navigation className="w-3 h-3 text-neutral-500 ml-0.5" />
            </button>

            {/* Wi-Fi QR Code */}
            <button
              type="button"
              onClick={handleWifiClick}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-orange-500/20 hover:border-orange-400 text-neutral-300 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <Wifi className="w-3.5 h-3.5 text-sky-400" />
              <span>Guest Wi-Fi</span>
            </button>

            {/* Direct Phone Call Button */}
            <button
              type="button"
              onClick={handlePhoneClick}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 border border-green-400/50 text-white font-semibold hover:brightness-110 transition-all cursor-pointer shadow-md"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              <span>Call: 0659242630</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wi-Fi Virtual QR Code Dialog */}
      <Dialog open={isWifiModalOpen} onOpenChange={setIsWifiModalOpen}>
        <DialogContent className="sm:max-w-sm bg-[#0c0605] text-white border-orange-500/40 rounded-3xl p-6 text-center">
          <DialogHeader className="space-y-1 pb-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 mb-2">
              <Wifi className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-serif text-white font-bold">
              High-Speed Guest Wi-Fi
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="bg-white p-4 rounded-2xl mx-auto w-48 h-48 flex items-center justify-center shadow-lg border-4 border-orange-500/30">
              <div className="w-full h-full bg-neutral-900 rounded-lg flex flex-col items-center justify-center p-2 text-center text-white">
                <Sparkles className="w-8 h-8 text-orange-400 mb-1" />
                <span className="text-[10px] font-mono tracking-widest text-orange-300 uppercase">
                  L&apos;AURA SAHARA
                </span>
                <span className="text-xs font-bold text-white mt-1">SCAN FOR WIFI</span>
                <span className="text-[9px] text-neutral-400 mt-0.5">Network: L_Aura_Guest</span>
              </div>
            </div>

            <div className="space-y-1 bg-neutral-900/80 p-3 rounded-xl border border-orange-500/20">
              <p className="text-xs text-neutral-400">Network Name:</p>
              <p className="text-xs font-mono font-bold text-white">L_Aura_Sahara_Guest</p>
              <p className="text-xs text-neutral-400 pt-1">Password:</p>
              <p className="text-xs font-mono font-bold text-amber-400 select-all">SaharaGastronomy2025!</p>
            </div>

            <button
              type="button"
              onClick={handleCopyWifi}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-neutral-950 font-serif font-bold text-xs uppercase tracking-widest shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              Copy Password
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}