"use client";

import React from 'react';
import { Sparkles, Layers, ArrowRight, Download } from 'lucide-react';

interface HeroBannerProps {
  onExplore: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExplore }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-950 to-background text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(120,50,255,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.1),transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Extracted via Chrome DevTools from Magnific</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Realistic 3D Menu <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              Objects & Assets
            </span>
          </h1>

          <p className="text-lg text-purple-200/80 max-w-2xl mx-auto lg:mx-0">
            Explore high-resolution 3D renders, isometric vectors, and realistic food photography extracted directly from Magnific 3D menu collection.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={onExplore}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all flex items-center gap-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/90">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>20+ Curated 3D Assets</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
            <img
              src="https://img.magnific.com/premium-photo/big-strawberry-pink-glazed-donut-character-mascot-with-blank-wooden-menu-blackboards-outdoor-display-yellow-background-3d-rendering_476612-17736.jpg?semt=ais_hybrid&w=740&q=80"
              alt="3D Donut Mascot"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-pink-500 text-white text-xs font-bold uppercase tracking-wider">
                  Featured 3D Render
                </span>
                <h3 className="text-xl font-bold text-white mt-2">Glazed Donut Character Mascot</h3>
                <p className="text-xs text-gray-300">Magnific 3D Menu Collection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};