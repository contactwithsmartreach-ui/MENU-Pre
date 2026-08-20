"use client";

import React, { useState } from "react";
import { LegalModal, LegalType } from "./LegalModal";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ShieldCheck } from "lucide-react";

export function LegalFooter() {
  const [activeLegal, setActiveLegal] = useState<LegalType>(null);

  return (
    <>
      <LegalModal type={activeLegal} onClose={() => setActiveLegal(null)} />

      <footer className="relative z-20 w-full py-8 mt-12 bg-neutral-950/90 backdrop-blur-xl border-t border-orange-500/20 text-neutral-400 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-orange-400 font-serif font-bold text-base">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>L&apos;AURA SAHARA &bull; GASTRONOMIE 3D</span>
            </div>
            <p className="text-xs text-neutral-400">
              742 Evergreen Terrace, Sahara District, CA &bull; Commandes : 0659242630
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-serif tracking-wider uppercase">
            <button
              type="button"
              onClick={() => setActiveLegal("terms")}
              className="hover:text-orange-400 transition-colors cursor-pointer"
            >
              CGV & CGU
            </button>
            <span className="text-neutral-700">&bull;</span>
            <button
              type="button"
              onClick={() => setActiveLegal("privacy")}
              className="hover:text-orange-400 transition-colors cursor-pointer"
            >
              Confidentialité
            </button>
            <span className="text-neutral-700">&bull;</span>
            <button
              type="button"
              onClick={() => setActiveLegal("cookies")}
              className="hover:text-orange-400 transition-colors cursor-pointer"
            >
              Cookies
            </button>
            <span className="text-neutral-700">&bull;</span>
            <button
              type="button"
              onClick={() => setActiveLegal("mentions")}
              className="hover:text-orange-400 transition-colors cursor-pointer"
            >
              Mentions Légales
            </button>
            <span className="text-neutral-700">&bull;</span>
            <button
              type="button"
              onClick={() => setActiveLegal("accessibility")}
              className="hover:text-orange-400 transition-colors cursor-pointer"
            >
              Accessibilité
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-2">
          <p>&copy; {new Date().getFullYear()} L&apos;Aura Sahara S.A. Tous droits réservés.</p>
          <MadeWithDyad />
        </div>
      </footer>
    </>
  );
}