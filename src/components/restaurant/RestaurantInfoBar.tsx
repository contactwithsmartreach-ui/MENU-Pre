"use client";

import React, { useState } from "react";
import { Clock, MapPin, Wifi, QrCode, ExternalLink, PhoneCall, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function RestaurantInfoBar() {
  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);

  const wifiPassword = "Sahara_Luxury_Guest_2025";

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(wifiPassword);
    setCopiedWifi(true);
    toast.success("Wi-Fi password copied to clipboard!");
    setTimeout(() => setCopiedWifi(false), 3000);
  };

  const handleOpenMaps = () => {
    toast.info("Opening Google Maps directions", {
      description: "742 Evergreen Terrace, Sahara District, CA 90210",
    });
    window.open("https://maps.google.com/?q=742+Evergreen+Terrace+Sahara+District+CA", "_blank");
  };

  const handleCall = () => {
    toast.success("Calling L'Aura Sahara", {
      description: "0659242630 • Direct Order Hotline",
    });
    window.location.href = "tel:0659242630";
  };

  return (
    <>
      <div className="relative z-30 w-full max-w-5xl mx-auto px-4 my-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 sm:p-4 rounded-3xl bg-neutral-950/90 backdrop-blur-2xl border border-orange-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white">
          
          {/* 1. Live Hours & Status */}
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-neutral-900/60 border border-orange-500/20">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-600 to-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-green-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] font-serif uppercase tracking-wider text-green-400 font-bold">
                  Open Now
                </span>
              </div>
              <span className="text-xs text-neutral-300 truncate font-light">
                Until 10:00 PM &bull; Tap to Call
              </span>
            </div>
            <button
              type="button"
              onClick={handleCall}
              className="ml-auto p-2 rounded-xl bg-orange-500/20 border border-orange-400/40 text-orange-300 hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
              title="Tap to Call"
            >
              <PhoneCall className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Address & Google Maps Directions */}
          <button
            type="button"
            onClick={handleOpenMaps}
            className="group flex items-center gap-3 p-2.5 rounded-2xl bg-neutral-900/60 border border-orange-500/20 hover:border-orange-400/60 transition-all text-left cursor-pointer shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[11px] font-serif uppercase tracking-wider text-orange-300 font-bold flex items-center gap-1">
                <span>Location</span>
                <ExternalLink className="w-3 h-3 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <span className="text-xs text-neutral-300 truncate font-light">
                742 Evergreen Terrace, CA
              </span>
            </div>
          </button>

          {/* 3. Wi-Fi QR Code & Connection */}
          <button
            type="button"
            onClick={() => setIsWifiModalOpen(true)}
            className="group flex items-center gap-3 p-2.5 rounded-2xl bg-neutral-900/60 border border-orange-500/20 hover:border-orange-400/60 transition-all text-left cursor-pointer shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-sky-500/30 group-hover:scale-105 transition-transform">
              <Wifi className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[11px] font-serif uppercase tracking-wider text-sky-300 font-bold flex items-center gap-1">
                <span>Free Guest Wi-Fi</span>
                <QrCode className="w-3 h-3 text-sky-400" />
              </span>
              <span className="text-xs text-neutral-300 truncate font-light">
                Tap to view QR & password
              </span>
            </div>
          </button>

        </div>
      </div>

      {/* Wi-Fi QR Code Modal */}
      <Dialog open={isWifiModalOpen} onOpenChange={setIsWifiModalOpen}>
        <DialogContent className="sm:max-w-sm bg-[#0c0605] text-white border border-orange-500/30 rounded-3xl p-6 text-center">
          <DialogHeader className="space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center mx-auto mb-2">
              <Wifi className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-serif text-amber-400">
              L&apos;Aura Guest Wi-Fi
            </DialogTitle>
            <p className="text-xs text-neutral-400">
              Scan the virtual QR code or copy the password below to connect.
            </p>
          </DialogHeader>

          <div className="my-6 p-4 rounded-2xl bg-white flex flex-col items-center justify-center shadow-inner">
            <div className="w-48 h-48 bg-neutral-900 rounded-xl flex flex-col items-center justify-center p-3 text-center border-4 border-neutral-950">
              <QrCode className="w-28 h-28 text-orange-400 mb-2" />
              <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">
                WIFI: Sahara_Guest
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-neutral-900 border border-orange-500/20 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Password</p>
                <p className="text-sm font-mono font-bold text-amber-300">{wifiPassword}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyWifi}
                className="px-3 py-1.5 rounded-lg bg-orange-500 text-neutral-950 text-xs font-bold hover:bg-orange-400 transition-colors cursor-pointer"
              >
                {copiedWifi ? <CheckCircle2 className="w-4 h-4 text-neutral-950" /> : "Copy"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}