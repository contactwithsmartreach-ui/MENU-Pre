"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShieldCheck, FileText, Cookie } from "lucide-react";

interface LegalModalsProps {
  activeModal: "privacy" | "terms" | "cookies" | null;
  onClose: () => void;
}

export function LegalModals({ activeModal, onClose }: LegalModalsProps) {
  return (
    <>
      {/* Privacy Policy Modal */}
      <Dialog open={activeModal === "privacy"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-xl bg-transparent text-neutral-900 border-0 shadow-none p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader className="space-y-2 border-b border-orange-500/20 pb-4 text-left">
            <div className="flex items-center gap-2 text-orange-600">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs uppercase font-serif tracking-widest font-bold">Confidentialité</span>
            </div>
            <DialogTitle className="text-xl font-serif font-bold text-neutral-900">
              Politique de Confidentialité
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-600">
              Dernière mise à jour : Mai 2025
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4 text-xs text-neutral-800 leading-relaxed font-light">
            <section className="space-y-1.5">
              <h3 className="font-serif font-bold text-orange-700 text-sm">1. Collecte des Informations</h3>
              <p>
                Chez L&apos;Aura Sahara, nous recueillons uniquement les informations nécessaires au traitement de vos réservations de table, de vos commandes de plats et à l&apos;amélioration de votre expérience gastronomique interactive (numéro de téléphone, nom et préférences alimentaires).
              </p>
            </section>

            <section className="space-y-1.5">
              <h3 className="font-serif font-bold text-orange-700 text-sm">2. Utilisation des Données</h3>
              <p>
                Vos données personnelles ne sont jamais vendues ou partagées à des tiers non autorisés. Elles servent exclusivement à la gestion de votre service en salle, la livraison ou le contact téléphonique pour vos commandes au 0659242630.
              </p>
            </section>

            <section className="space-y-1.5">
              <h3 className="font-serif font-bold text-orange-700 text-sm">3. Sécurité</h3>
              <p>
                Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos données contre tout accès non autorisé, altération ou divulgation.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Modal */}
      <Dialog open={activeModal === "terms"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-xl bg-transparent text-neutral-900 border-0 shadow-none p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader className="space-y-2 border-b border-orange-500/20 pb-4 text-left">
            <div className="flex items-center gap-2 text-orange-600">
              <FileText className="w-5 h-5" />
              <span className="text-xs uppercase font-serif tracking-widest font-bold">Conditions</span>
            </div>
            <DialogTitle className="text-xl font-serif font-bold text-neutral-900">
              Conditions Générales de Service
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-600">
              Règlement intérieur & Commandes en ligne
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4 text-xs text-neutral-800 leading-relaxed font-light">
            <section className="space-y-1.5">
              <h3 className="font-serif font-bold text-orange-700 text-sm">1. Réservations & Commandes</h3>
              <p>
                Toute commande passée via notre application ou confirmée par téléphone au 0659242630 engage le client. Les prix affichés sont en Dinars Algériens (DA) toutes taxes comprises.
              </p>
            </section>

            <section className="space-y-1.5">
              <h3 className="font-serif font-bold text-orange-700 text-sm">2. Annulations & Retards</h3>
              <p>
                En cas de retard supérieur à 20 minutes pour une table réservée, nous vous prions de bien vouloir nous en informer par téléphone. Les commandes en préparation ne sont pas annulables.
              </p>
            </section>

            <section className="space-y-1.5">
              <h3 className="font-serif font-bold text-orange-700 text-sm">3. Propriété Intellectuelle</h3>
              <p>
                L&apos;ensemble du contenu de ce site (visuels 3D, design du menu cylindre, photographies de plats, textes) est la propriété exclusive de L&apos;Aura Sahara. Toute reproduction est interdite.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cookies Policy Modal */}
      <Dialog open={activeModal === "cookies"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-xl bg-transparent text-neutral-900 border-0 shadow-none p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader className="space-y-2 border-b border-orange-500/20 pb-4 text-left">
            <div className="flex items-center gap-2 text-orange-600">
              <Cookie className="w-5 h-5" />
              <span className="text-xs uppercase font-serif tracking-widest font-bold">Cookies</span>
            </div>
            <DialogTitle className="text-xl font-serif font-bold text-neutral-900">
              Politique relative aux Cookies
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-600">
              Gestion des traceurs et préférences de navigation
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4 text-xs text-neutral-800 leading-relaxed font-light">
            <section className="space-y-1.5">
              <h3 className="font-serif font-bold text-orange-700 text-sm">1. Qu&apos;est-ce qu&apos;un cookie ?</h3>
              <p>
                Un cookie est un petit fichier texte stocké sur votre appareil lors de votre visite sur notre site web. Il permet de mémoriser vos préférences d&apos;affichage et d&apos;optimiser les performances de notre menu 3D interactif.
              </p>
            </section>

            <section className="space-y-1.5">
              <h3 className="font-serif font-bold text-orange-700 text-sm">2. Cookies utilisés</h3>
              <p>
                Nous utilisons uniquement des cookies de session essentiels au fonctionnement du panier de commande et à la fluidité de la rotation du cylindre 3D. Aucun traceur publicitaire intrusif n&apos;est installé.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}