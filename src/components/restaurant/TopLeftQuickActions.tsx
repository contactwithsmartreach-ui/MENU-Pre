"use client";

import React from "react";
import { Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export function TopLeftQuickActions() {
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
    <div className="fixed top-24 left-3 sm:left-5 z-50 flex flex-col items-center gap-2.5">
      {/* 1. Phone Button */}
      <button
        type="button"
        aria-label="Call Restaurant"
        onClick={handlePhoneClick}
        className="group relative flex justify-center items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-950/90 backdrop-blur-xl border border-emerald-500/40 text-emerald-400 hover:text-white hover:bg-emerald-600 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:scale-105 cursor-pointer"
      >
        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
      </button>

      {/* 2. Location Button */}
      <button
        type="button"
        aria-label="Restaurant Location"
        onClick={handleLocationClick}
        className="group relative flex justify-center items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-950/90 backdrop-blur-xl border border-orange-500/40 text-orange-400 hover:text-white hover:bg-orange-600 transition-all duration-300 shadow-[0_0_15px_rgba(249,115,22,0.25)] hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] hover:scale-105 cursor-pointer"
      >
        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
      </button>

      {/* 3. Instagram Button */}
      <button
        type="button"
        aria-label="Instagram Profile"
        onClick={() => handleSocialClick("Instagram")}
        className="group relative flex justify-center items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-950/90 backdrop-blur-xl border border-pink-500/40 text-pink-400 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-600 hover:to-purple-600 transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.25)] hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:scale-105 cursor-pointer"
      >
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
          fill="currentColor"
          viewBox="0 0 448 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
        </svg>
      </button>

      {/* 4. Facebook Button */}
      <button
        type="button"
        aria-label="Facebook Page"
        onClick={() => handleSocialClick("Facebook")}
        className="group relative flex justify-center items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-950/90 backdrop-blur-xl border border-blue-500/40 text-blue-400 hover:text-white hover:bg-blue-600 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.25)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:scale-105 cursor-pointer"
      >
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
          fill="currentColor"
          viewBox="0 0 448 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z" />
        </svg>
      </button>
    </div>
  );
}