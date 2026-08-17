"use client";

import React from "react";
import { Phone, MapPin, Instagram, Facebook } from "lucide-react";

export function SocialContactBar() {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col items-center gap-3 p-2 bg-neutral-950/80 backdrop-blur-xl border border-orange-500/30 rounded-full shadow-[0_0_25px_rgba(0,0,0,0.8)]">
      {/* Phone Button */}
      <a
        href="tel:+15552345678"
        aria-label="Phone"
        className="w-10 h-10 rounded-full bg-neutral-900 border border-orange-500/30 flex items-center justify-center text-orange-400 hover:text-white hover:bg-gradient-to-tr hover:from-orange-600 hover:to-amber-500 hover:border-orange-300 hover:scale-110 shadow-md transition-all duration-300"
      >
        <Phone className="w-4 h-4" />
      </a>

      {/* Location / Map Button */}
      <a
        href="https://maps.google.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Location"
        className="w-10 h-10 rounded-full bg-neutral-900 border border-orange-500/30 flex items-center justify-center text-red-400 hover:text-white hover:bg-gradient-to-tr hover:from-red-600 hover:to-orange-500 hover:border-red-300 hover:scale-110 shadow-md transition-all duration-300"
      >
        <MapPin className="w-4 h-4" />
      </a>

      {/* Instagram Button */}
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="w-10 h-10 rounded-full bg-neutral-900 border border-orange-500/30 flex items-center justify-center text-pink-400 hover:text-white hover:bg-gradient-to-tr hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 hover:border-pink-300 hover:scale-110 shadow-md transition-all duration-300"
      >
        <Instagram className="w-4 h-4" />
      </a>

      {/* Facebook Button */}
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="w-10 h-10 rounded-full bg-neutral-900 border border-orange-500/30 flex items-center justify-center text-blue-400 hover:text-white hover:bg-gradient-to-tr hover:from-blue-600 hover:to-blue-400 hover:border-blue-300 hover:scale-110 shadow-md transition-all duration-300"
      >
        <Facebook className="w-4 h-4" />
      </a>
    </div>
  );
}