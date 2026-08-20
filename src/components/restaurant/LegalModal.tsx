"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShieldCheck, FileText, Lock, Cookie, Scale } from "lucide-react";

export type LegalType = "terms" | "privacy" | "cookies" | "mentions" | "accessibility" | null;

interface LegalModalProps {
  type: LegalType;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  if (!type) return null;

  const titles = {
    terms: "Conditions Générales de Vente & d'Utilisation",
    privacy: "Politique de Confidentialité",
    cookies: "Gestion des Cookies",
    mentions: "Mentions Légales",
    accessibility: "Accessibilité Numérique",
  };

  const icons = {
    terms: FileText,
    privacy: Lock,
    cookies: Cookie,
    mentions: Scale,
    accessibility: ShieldCheck,
  };

  const IconComponent = icons[type] || FileText;

  return (
    <Dialog open={!!type} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-[#e3efed] text-neutral-900 border-orange-500/30 rounded-3xl p-6 shadow-[0_25px_60px_rgba(249,115,22,0.2)] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-2 border-b border-orange-500/20 pb-4 text-left">
          <div className="flex items-center gap-2 text-orange-600">
            <IconComponent className="w-5 h-5" />
            <span className="text-xs uppercase font-serif tracking-[0.2em] font-bold">
              Conformité & Juridique
            </span>
          </div>
          <DialogTitle className="text-xl font-serif font-bold text-orange-600">
            {titles[type]}
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-600">
            Dernière mise à jour : 1er Janvier 2025 • L&apos;Aura Sahara S.A.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 text-xs text-neutral-700 leading-relaxed font-light">
          {type === "terms" && (
            <>
              <h3 className="font-bold text-sm font-serif text-neutral-900">1. Objet et Champ d&apos;Application</h3>
              <p>
                Les présentes Conditions Générales de Vente (CGV) régissent l&apos;ensemble des commandes de plats, réservations et prestations de services effectuées auprès du restaurant L&apos;Aura Sahara, situé au 742 Evergreen Terrace, Sahara District, CA 90210.
              </p>
              <h3 className="font-bold text-sm font-serif text-neutral-900">2. Commandes et Validation</h3>
              <p>
                Toute commande passée via notre plateforme interactive 3D ou par téléphone au 0659242630 implique l&apos;acceptation sans réserve des présentes CGV. Les prix sont indiqués en dollars américains ($) toutes taxes comprises (TTC).
              </p>
              <h3 className="font-bold text-sm font-serif text-neutral-900">3. Annulation et Remboursement</h3>
              <p>
                En raison de la nature artisanale et immédiate de nos préparations culinaires, toute commande validée et en cours de préparation ne peut faire l&apos;objet d&apos;un remboursement en cas d&apos;annulation tardive.
              </p>
            </>
          )}

          {type === "privacy" && (
            <>
              <h3 className="font-bold text-sm font-serif text-neutral-900">1. Collecte des Données Personnelles</h3>
              <p>
                L&apos;Aura Sahara s&apos;engage à protéger la vie privée de ses clients. Les informations recueillies lors de vos commandes ou réservations (nom, numéro de téléphone, préférences alimentaires) sont strictement confidentielles et ne sont jamais revendues à des tiers.
              </p>
              <h3 className="font-bold text-sm font-serif text-neutral-900">2. Utilisation et Finalité</h3>
              <p>
                Vos données sont utilisées exclusivement pour le traitement de vos commandes, l&apos;optimisation de votre expérience gastronomique en salle et la gestion de votre service voiturier.
              </p>
              <h3 className="font-bold text-sm font-serif text-neutral-900">3. Vos Droits (RGPD / CCPA)</h3>
              <p>
                Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données en contactant notre délégué à la protection des données par téléphone ou via notre formulaire de contact.
              </p>
            </>
          )}

          {type === "cookies" && (
            <>
              <h3 className="font-bold text-sm font-serif text-neutral-900">1. Qu&apos;est-ce qu&apos;un Cookie ?</h3>
              <p>
                Un cookie est un petit fichier texte stocké sur votre appareil lors de la navigation sur notre site. Il permet de mémoriser vos préférences d&apos;affichage, votre panier et d&apos;analyser le trafic de notre menu 3D.
              </p>
              <h3 className="font-bold text-sm font-serif text-neutral-900">2. Cookies Essentiels et Analytiques</h3>
              <p>
                Nous utilisons des cookies strictement nécessaires au fonctionnement de l&apos;application interactive ainsi que des traceurs de performance anonymes pour améliorer la fluidité de nos animations 3D.
              </p>
            </>
          )}

          {type === "mentions" && (
            <>
              <h3 className="font-bold text-sm font-serif text-neutral-900">1. Informations Éditeur</h3>
              <p>
                <strong>Raison Sociale :</strong> L&apos;Aura Sahara Gastronomie S.A.<br />
                <strong>Siège Social :</strong> 742 Evergreen Terrace, Sahara District, CA 90210<br />
                <strong>Téléphone :</strong> 0659242630<br />
                <strong>Capital Social :</strong> 500 000 USD
              </p>
              <h3 className="font-bold text-sm font-serif text-neutral-900">2. Directeur de la Publication</h3>
              <p>Chef Exécutif & Directeur Général de L&apos;Aura Sahara.</p>
              <h3 className="font-bold text-sm font-serif text-neutral-900">3. Hébergement</h3>
              <p>Hébergé sur infrastructure cloud hautement disponible et sécurisée (Vercel Inc. & AWS).</p>
            </>
          )}

          {type === "accessibility" && (
            <>
              <h3 className="font-bold text-sm font-serif text-neutral-900">1. Notre Engagement</h3>
              <p>
                L&apos;Aura Sahara s&apos;engage à rendre son expérience culinaire numérique accessible à tous, conformément aux normes WCAG 2.1 niveau AA.
              </p>
              <h3 className="font-bold text-sm font-serif text-neutral-900">2. Fonctionnalités d&apos;Accessibilité</h3>
              <p>
                Navigation au clavier optimisée, contrastes de couleurs rigoureux, compatibilité avec les lecteurs d&apos;écran et alternatives textuelles pour l&apos;ensemble de nos visuels et animations 3D.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}