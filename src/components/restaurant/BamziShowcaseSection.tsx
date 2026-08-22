"use client";

import React, { useState } from "react";
import { Sparkles, ExternalLink, Image as ImageIcon, ZoomIn, Download, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BamziShowcaseSection() {
  const [activeModalImage, setActiveModalImage] = useState<{ url: string; title: string } | null>(null);

  const showcaseImages = [
    {
      id: "bamzi-preview-1",
      title: "Bamzi Luxury Restaurant Template - Aperçu Principal",
      url: "https://cdn.dribbble.com/userupload/37125399/file/original-769e0b86f702b69834898016b20738eb.png?resize=1600x1200&vertical=center",
      downloadUrl: "https://cdn.dribbble.com/userupload/37125399/file/original-769e0b86f702b69834898016b20738eb.png",
      tag: "Design UI/UX 3D",
    },
    {
      id: "bamzi-preview-2",
      title: "Bamzi Template Complet - Présentation UX",
      url: "https://cdn.dribbble.com/userupload/37125400/file/original-36f3af3ae192d39790ca7cd05a8a2c48.jpg?resize=1600x7857&vertical=center",
      downloadUrl: "https://cdn.dribbble.com/userupload/37125400/file/original-36f3af3ae192d39790ca7cd05a8a2c48.jpg",
      tag: "Présentation Intégrale",
    },
  ];

  return (
    <section className="relative z-20 w-full max-w-6xl mx-auto px-4 py-16 my-12 border-t border-orange-500/30">
      <div className="flex flex-col items-center text-center space-y-3 mb-12">
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600">
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
                <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/40 text-[10px] uppercase font-serif tracking-widest hidden sm:inline-flex">
                  {item.tag}
                </Badge>
                
                <button
                  onClick={() => setActiveModalImage({ url: item.downloadUrl, title: item.title })}
                  className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-neutral-950 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Agrandir</span>
                </button>

                <a
                  href={item.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
                  title="Télécharger l'image originale"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div 
              onClick={() => setActiveModalImage({ url: item.downloadUrl, title: item.title })}
              className="relative w-full bg-neutral-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden max-h-[850px] cursor-zoom-in group/img"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-transparent to-amber-500/5 pointer-events-none" />
              <img
                src={item.url}
                alt={item.title}
                className={idx === 1 ? "w-full object-contain max-h-[750px] rounded-2xl shadow-2xl transition-transform duration-500 group-hover/img:scale-[1.01]" : "w-full object-cover max-h-[600px] rounded-2xl shadow-2xl transition-transform duration-500 group-hover/img:scale-[1.01]"}
                loading="lazy"
              />
              <div className="absolute bottom-4 right-4 bg-neutral-900/80 backdrop-blur-md text-orange-300 px-3 py-1.5 rounded-full text-xs font-serif border border-orange-500/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Cliquez pour zoomer</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeModalImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="w-full max-w-7xl flex items-center justify-between mb-4 text-white">
            <h3 className="text-base sm:text-lg font-serif font-bold text-orange-200">
              {activeModalImage.title}
            </h3>
            <div className="flex items-center gap-3">
              <a
                href={activeModalImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-orange-500 text-neutral-950 text-xs font-medium flex items-center gap-1.5 hover:bg-orange-400 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger HD</span>
              </a>
              <button
                onClick={() => setActiveModalImage(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="relative w-full flex-1 flex items-center justify-center overflow-auto p-2">
            <img
              src={activeModalImage.url}
              alt={activeModalImage.title}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-orange-500/30"
            />
          </div>
        </div>
      )}
    </section>
  );
}