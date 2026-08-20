"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Clock,
  MapPin,
  Wifi,
  Phone,
  Navigation,
  CheckCircle2,
  ExternalLink,
  QrCode,
  Compass,
} from "lucide-react";
import { toast } from "sonner";

interface RestaurantInfoModalsProps {
  activeModal: "hours" | "location" | "wifi" | null;
  onClose: () => void;
}

export function RestaurantInfoModals({ activeModal, onClose }: RestaurantInfoModalsProps) {
  const [copiedWifi, setCopiedWifi] = useState(false);

  const handleCopyWifi = () => {
    navigator.clipboard.writeText("Sahara_Guest_5G");
    setCopiedWifi(true);
    toast.success("Mot de passe Wi-Fi copié !", {
      description: "Réseau : Sahara_Guest_5G (Mot de passe : saharavip2025)",
    });
    setTimeout(() => setCopiedWifi(false), 3000);
  };

  return (
    <>
      <Dialog open={activeModal === "hours"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md bg-[#e3efed] text-neutral-900 border-orange-500/30 rounded-3xl p-6 shadow-[0_25px_60px_rgba(249,115,22,0.2)]">
          <DialogHeader className="space-y-2 border-b border-orange-500/20 pb-4 text-left">
            <div className="flex items-center gap-2 text-orange-600">
              <Clock className="w-5 h-5 animate-pulse" />
              <span className="text-xs uppercase font-serif tracking-[0.2em] font-bold">Heures d&apos;Ouverture</span>
            </div>
            <DialogTitle className="text-xl font-serif font-bold text-orange-600">
              Horaires L&apos;Aura Sahara
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-600">
              Nous acceptons les visites sans rendez-vous et les commandes téléphoniques.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-orange-500/20 shadow-sm">
              <span className="text-sm font-serif text-neutral-800 font-semibold">Lundi - Jeudi</span>
              <span className="text-xs font-mono text-orange-600 font-bold">17h00 - 23h00</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-orange-500/20 shadow-sm">
              <span className="text-sm font-serif text-neutral-800 font-semibold">Vendredi - Samedi</span>
              <span className="text-xs font-mono text-orange-600 font-bold">16h30 - 00h00</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-orange-500/20 shadow-sm">
              <span className="text-sm font-serif text-neutral-800 font-semibold">Dimanche (Brunch & Dîner)</span>
              <span className="text-xs font-mono text-orange-600 font-bold">12h00 - 22h00</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-600 animate-ping" />
                <span className="text-xs font-semibold text-green-700">Actuellement Ouvert & Commandes Actives</span>
              </div>
              <a
                href="tel:0659242630"
                className="text-xs font-serif font-bold text-white bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 shadow-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Appeler</span>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "location"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-2xl bg-[#e3efed] text-neutral-900 border-orange-500/30 rounded-3xl p-6 shadow-[0_25px_60px_rgba(249,115,22,0.2)] overflow-hidden">
          <DialogHeader className="space-y-1 border-b border-orange-500/20 pb-4 text-left">
            <div className="flex items-center gap-2 text-orange-600">
              <Navigation className="w-5 h-5 animate-pulse" />
              <span className="text-xs uppercase font-serif tracking-[0.2em] font-bold">Localisation & Accès</span>
            </div>
            <DialogTitle className="text-xl font-serif font-bold text-orange-600">
              742 Evergreen Terrace, Quartier Sahara, CA 90210
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-600">
              Service voiturier disponible à l&apos;entrée principale nord.
            </DialogDescription>
          </DialogHeader>

          <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-orange-500/30 bg-white my-2 shadow-inner">
            <div className="absolute inset-0 bg-sky-50/50 opacity-90" />
            <svg
              className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path d="M 0 100 Q 250 50 500 180 T 800 250" fill="none" stroke="#f97316" strokeWidth="6" opacity="0.6" />
              <path d="M 120 0 Q 180 200 350 400" fill="none" stroke="#38bdf8" strokeWidth="4" opacity="0.5" />
              <path d="M 0 280 Q 300 200 600 350" fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.4" />
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="relative flex items-center justify-center">
                <span className="absolute -inset-4 rounded-full bg-orange-500/30 animate-ping" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-600/40 border-2 border-white">
                  <MapPin className="w-5 h-5 fill-current" />
                </div>
              </div>
              <div className="bg-white/90 border border-orange-500/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-serif font-bold text-orange-600 shadow-xl mt-2 whitespace-nowrap">
                L&apos;Aura Sahara Restaurant
              </div>
            </div>

            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md border border-orange-500/20 p-2 rounded-xl flex items-center gap-1.5 text-xs text-neutral-700 font-mono shadow-sm">
              <Compass className="w-4 h-4 text-orange-600 animate-spin" style={{ animationDuration: "12s" }} />
              <span>N 34.0522&deg; W 118.2437&deg;</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <div className="text-xs text-neutral-600">
              Besoin d&apos;itinéraires ou d&apos;aide pour le voiturier ?
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-serif font-bold text-xs shadow-lg hover:brightness-110 transition-all"
            >
              <span>Ouvrir dans Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "wifi"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-sm bg-[#e3efed] text-neutral-900 border-orange-500/30 rounded-3xl p-6 shadow-[0_25px_60px_rgba(249,115,22,0.2)] text-center">
          <DialogHeader className="space-y-2 border-b border-orange-500/20 pb-4 text-center">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-600">
              <Wifi className="w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-serif font-bold text-orange-600">
              Wi-Fi Invité Haut Débit
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-600">
              Scannez le QR code ou cliquez ci-dessous pour copier les identifiants.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="w-44 h-44 rounded-2xl bg-white p-3 shadow-2xl flex items-center justify-center border-4 border-orange-500/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-amber-500/10 pointer-events-none" />
              <div className="w-full h-full border-4 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center p-2 text-neutral-900">
                <QrCode className="w-24 h-24 text-neutral-900 stroke-[1.5]" />
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase mt-1 text-neutral-700">SAHARA VIP</span>
              </div>
            </div>

            <div className="space-y-1 w-full bg-white/80 p-3 rounded-2xl border border-orange-500/20 shadow-sm">
              <p className="text-xs text-neutral-600">Nom du réseau : <strong className="text-neutral-900 font-mono">Sahara_Guest_5G</strong></p>
              <p className="text-xs text-neutral-600">Mot de passe : <strong className="text-orange-600 font-mono">saharavip2025</strong></p>
            </div>

            <button
              type="button"
              onClick={handleCopyWifi}
              className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-serif font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              {copiedWifi ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Identifiants Copiés !</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4" />
                  <span>Copier le Mot de Passe Wi-Fi</span>
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}