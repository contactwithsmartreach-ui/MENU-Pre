"use client";

import React from "react";
import { Sparkles, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BamziShowcaseSection() {
  const showcaseImages = [
    {
      id: "bamzi-preview-1",
      title: "Bamzi Luxury Restaurant Template - Aperçu Principal",
      url: "https://cdn.dribbble.com/userupload/37125399/file/original-769e0b86f702b69834898016b20738eb.png?resize=1600x1200&vertical=center",
      tag: "Design UI/UX 3D",
    },
    {
      id: "bamzi-preview-2",
      title: "Bamzi Template Complet - Présentation UX",
      url: "https://cdn.dribbble.com/userupload/37125400/file/original-36f3af3ae192d39790ca7cd05a8a2c48.jpg?resize=1600x7857&vertical=center",
      tag: "Présentation Intégrale",
    },
  ];

  return (
    <section className="relative z-20 w-full max-w-6xl mx-auto px-4 py-16 my-12 border-t border-orange-500/30">
      <div className="flex flex-col items-center text-center space-y-3 mb-12">
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-serif uppercase tracking-[0.25em] font-bold">
            Inspiration & Template Original
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
          Bamzi Sushi & Ramen Luxury Template
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-xl font-light">
          Extraits directement de la source Dribbble officielle via Google DevTools et intégrés en bas de page pour harmoniser le style haut de gamme.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {showcaseImages.map((item, idx) => (
          <div
            key={item.id}
            className="group relative rounded-3xl overflow-hidden bg-white border border-orange-500/30 shadow-[0_20px_50px_rgba(249,115,22,0.15)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(249,115,22,0.3)] flex flex-col"
          >
            <div className="p-4 sm:p-6 bg-neutral-900 text-white flex items-center justify-between border-b border-orange-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-orange-200">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Source : Dribbble Shot #25691507 (Shuvo Huq)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/40 text-[10px] uppercase font-serif tracking-widest">
                  {item.tag}
                </Badge>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-500 hover:text-neutral-950 flex items-center justify-center transition-colors text-white cursor-pointer"
                  title="Ouvrir l'image en taille réelle"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="relative w-full bg-neutral-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden max-h-[850px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-transparent to-amber-500/5 pointer-events-none" />
              <img
                src={item.url}
                alt={item.title}
                className={idx === 1 ? "w-full object-contain max-h-[750px] rounded-2xl shadow-2xl" : "w-full object-cover max-h-[600px] rounded-2xl shadow-2xl"}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}