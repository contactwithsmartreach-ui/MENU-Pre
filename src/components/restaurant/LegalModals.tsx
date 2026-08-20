"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShieldCheck, FileText, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

interface LegalModalsProps {
  activeModal: "privacy" | "terms" | "cookies" | null;
  onClose: () => void;
}

export function LegalModals({ activeModal, onClose }: LegalModalsProps) {
  const [canScrollTop, setCanScrollTop] = useState(false);
  const [canScrollBottom, setCanScrollBottom] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setCanScrollTop(scrollTop > 15);
    setCanScrollBottom(scrollTop < scrollHeight - clientHeight - 15);
  };

  return (
    <>
      {/* Privacy Policy Modal */}
      <Dialog open={activeModal === "privacy"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-xl bg-[#0c0605] text-white border-orange-500/40 rounded-3xl p-6 shadow-[0_25px_60px_rgba(239,68,68,0.25)] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="space-y-2 border-b border-orange-500/20 pb-4 text-left shrink-0">
            <div className="flex items-center gap-2 text-orange-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs uppercase font-serif tracking-widest font-bold">Confidentialité</span>
            </div>
            <DialogTitle className="text-xl font-serif font-bold text-white">
              Politique de Confidentialité
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Dernière mise à jour : Mai 2025
            </DialogDescription>
          </DialogHeader>

          <div className="relative flex-1 overflow-hidden my-2">
            {/* Top Fade Gradient */}
            <div
              className={cn(
                "absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#0c0605] to-transparent pointer-events-none z-10 transition-opacity duration-300",
                canScrollTop ? "opacity-100" : "opacity-0"
              )}
            />

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="h-full overflow-y-auto space-y-4 text-xs text-neutral-300 leading-relaxed font-light pr-2 scrollbar-none"
            >
              <section className="space-y-1.5 pt-2">
                <h3 className="font-serif font-bold text-orange-300 text-sm">1. Collecte des Informations</h3>
                <p>
                  Chez L&apos;Aura Sahara, nous recueillons uniquement les informations nécessaires au traitement de vos réservations de table, de vos commandes de plats et à l&apos;amélioration de votre expérience gastronomique interactive (numéro de téléphone, nom et préférences alimentaires).
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif font-bold text-orange-300 text-sm">2. Utilisation des Données</h3>
                <p>
                  Vos données personnelles ne sont jamais vendues ou partagées à des tiers non autorisés. Elles servent exclusivement à la gestion de votre service en salle, la livraison ou le contact téléphonique pour vos commandes au 0659242630.
                </p>
              </section>

              <section className="space-y-1.5 pb-2">
                <h3 className="font-serif font-bold text-orange-300 text-sm">3. Sécurité</h3>
                <p>
                  Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos données contre tout accès non autorisé, altération ou divulgation.
                </p>
              </section>
            </div>

            {/* Bottom Fade Gradient */}
            <div
              className={cn(
                "absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#0c0605] to-transparent pointer-events-none z-10 transition-opacity duration-300",
                canScrollBottom ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Modal */}
      <Dialog open={activeModal === "terms"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-xl bg-[#0c0605] text-white border-orange-500/40 rounded-3xl p-6 shadow-[0_25px_60px_rgba(239,68,68,0.25)] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="space-y-2 border-b border-orange-500/20 pb-4 text-left shrink-0">
            <div className="flex items-center gap-2 text-orange-400">
              <FileText className="w-5 h-5" />
              <span className="text-xs uppercase font-serif tracking-widest font-bold">Conditions</span>
            </div>
            <DialogTitle className="text-xl font-serif font-bold text-white">
              Conditions Générales de Service
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Règlement intérieur & Commandes en ligne
            </DialogDescription>
          </DialogHeader>

          <div className="relative flex-1 overflow-hidden my-2">
            <div
              className={cn(
                "absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#0c0605] to-transparent pointer-events-none z-10 transition-opacity duration-300",
                canScrollTop ? "opacity-100" : "opacity-0"
              )}
            />

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="h-full overflow-y-auto space-y-4 text-xs text-neutral-300 leading-relaxed font-light pr-2 scrollbar-none"
            >
              <section className="space-y-1.5 pt-2">
                <h3 className="font-serif font-bold text-orange-300 text-sm">1. Réservations & Commandes</h3>
                <p>
                  Toute commande passée via notre application ou confirmée par téléphone au 0659242630 engage le client. Les prix affichés sont en Dinars Algériens (DA) toutes taxes comprises.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif font-bold text-orange-300 text-sm">2. Annulations & Retards</h3>
                <p>
                  En cas de retard supérieur à 20 minutes pour une table réservée, nous vous prions de bien vouloir nous en informer par téléphone. Les commandes en préparation ne sont pas annulables.
                </p>
              </section>

              <section className="space-y-1.5 pb-2">
                <h3 className="font-serif font-bold text-orange-300 text-sm">3. Propriété Intellectuelle</h3>
                <p>
                  L&apos;ensemble du contenu de ce site (visuels 3D, design du menu cylindre, photographies de plats, textes) est la propriété exclusive de L&apos;Aura Sahara. Toute reproduction est interdite.
                </p>
              </section>
            </div>

            <div
              className={cn(
                "absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#0c0605] to-transparent pointer-events-none z-10 transition-opacity duration-300",
                canScrollBottom ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Cookies Policy Modal */}
      <Dialog open={activeModal === "cookies"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-xl bg-[#0c0605] text-white border-orange-500/40 rounded-3xl p-6 shadow-[0_25px_60px_rgba(239,68,68,0.25)] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="space-y-2 border-b border-orange-500/20 pb-4 text-left shrink-0">
            <div className="flex items-center gap-2 text-orange-400">
              <Cookie className="w-5 h-5" />
              <span className="text-xs uppercase font-serif tracking-widest font-bold">Cookies</span>
            </div>
            <DialogTitle className="text-xl font-serif font-bold text-white">
              Politique relative aux Cookies
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Gestion des traceurs et préférences de navigation
            </DialogDescription>
          </DialogHeader>

          <div className="relative flex-1 overflow-hidden my-2">
            <div
              className={cn(
                "absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#0c0605] to-transparent pointer-events-none z-10 transition-opacity duration-300",
                canScrollTop ? "opacity-100" : "opacity-0"
              )}
            />

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="h-full overflow-y-auto space-y-4 text-xs text-neutral-300 leading-relaxed font-light pr-2 scrollbar-none"
            >
              <section className="space-y-1.5 pt-2">
                <h3 className="font-serif font-bold text-orange-300 text-sm">1. Qu&apos;est-ce qu&apos;un cookie ?</h3>
                <p>
                  Un cookie est un petit fichier texte stocké sur votre appareil lors de votre visite sur notre site web. Il permet de mémoriser vos préférences d&apos;affichage et d&apos;optimiser les performances de notre menu 3D interactif.
                </p>
              </section>

              <section className="space-y-1.5 pb-2">
                <h3 className="font-serif font-bold text-orange-300 text-sm">2. Cookies utilisés</h3>
                <p>
                  Nous utilisons uniquement des cookies de session essentiels au fonctionnement du panier de commande et à la fluidité de la rotation du cylindre 3D. Aucun traceur publicitaire intrusif n&apos;est installé.
                </p>
              </section>
            </div>

            <div
              className={cn(
                "absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#0c0605] to-transparent pointer-events-none z-10 transition-opacity duration-300",
                canScrollBottom ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}