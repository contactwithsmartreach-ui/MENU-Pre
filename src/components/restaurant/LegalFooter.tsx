"use client";

import React, { useState } from "react";
import { LegalModals } from "./LegalModals";
import { ShieldCheck, FileText, Cookie, UtensilsCrossed } from "lucide-react";

export function LegalFooter() {
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | "cookies" | null>(null);

  return (
    <>
      <LegalModals activeModal={activeModal} onClose={() => setActiveModal(null)} />

      <footer className="relative z-20 w-full bg-[#080302] border-t border-orange-500/30 text-neutral-400 pt-16 pb-20 px-6 sm:px-12 mt-32">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-8">
          {/* Brand Header */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300">
              L&apos;Aura Sahara
            </h3>
            <p className="text-xs font-serif uppercase tracking-[0.25em] text-neutral-500">
              Haute Gastronomie & Expérience 3D
            </p>
          </div>

          {/* Divider Line */}
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

          {/* Legal Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-serif uppercase tracking-widest">
            <button
              type="button"
              onClick={() => setActiveModal("privacy")}
              className="flex items-center gap-1.5 text-neutral-300 hover:text-orange-400 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Politique de Confidentialité</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("terms")}
              className="flex items-center gap-1.5 text-neutral-300 hover:text-orange-400 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-orange-500" />
              <span>Conditions d&apos;Utilisation</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("cookies")}
              className="flex items-center gap-1.5 text-neutral-300 hover:text-orange-400 transition-colors cursor-pointer"
            >
              <Cookie className="w-4 h-4 text-orange-500" />
              <span>Politique des Cookies</span>
            </button>
          </div>

          {/* Copyright & Info */}
          <div className="flex flex-col items-center space-y-2 pt-4 border-t border-white/5 w-full">
            <p className="text-[11px] text-neutral-500 font-mono">
              &copy; {new Date().getFullYear()} L&apos;Aura Sahara Restaurant. Tous droits réservés. 742 Evergreen Terrace, Sahara District.
            </p>
            <p className="text-[10px] text-orange-400/80 font-mono">
              Commandes & Réservations directes : 0659242630
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}