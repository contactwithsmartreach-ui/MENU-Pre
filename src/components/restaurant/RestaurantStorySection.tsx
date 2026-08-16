"use client";

import React from "react";
import { Utensils, ShieldCheck, Clock, MapPin } from "lucide-react";

export function RestaurantStorySection() {
  return (
    <section className="relative w-full max-w-6xl mx-auto py-16 px-4 sm:px-6 z-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-serif uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" />
            <span>Sahara Oasis &bull; Est. 2024</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight leading-tight">
            Where Desert Serenity Meets Gastronomic Mastery
          </h2>
          <p className="text-sm text-neutral-300 font-light leading-relaxed">
            L&apos;Aura Sahara is conceived as an immersive sanctuary for discerning epicureans. Our revolving 3D culinary cylinder brings every dish into your immediate visual sphere before it touches your table.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">A5 Certified</h4>
                <p className="text-[11px] text-neutral-400">100% Genuine Wagyu</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Freshly Prepared</h4>
                <p className="text-[11px] text-neutral-400">Made-to-order dishes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-orange-500/40 shadow-[0_25px_60px_rgba(249,115,22,0.25)]">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop"
            alt="Restaurant Dining Area"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}