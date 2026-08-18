"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Star } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gray-950 text-white">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url('/images/hero-burger.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50 backdrop-blur-[2px]" />
      </div>

      <div className="relative container mx-auto px-4 py-20 flex flex-col items-start justify-center z-10 max-w-6xl">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-md animate-fade-in">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>Voted #1 Craft Burger Joint in Town</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-3xl">
          Sizzling Perfection in <span className="text-amber-500">Every Single Bite</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
          Crafted with 100% Angus beef, freshly baked artisan brioche buns, and our secret signature sauce. Taste the ultimate gourmet burger experience today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-amber-500/20">
            <Link href="/menu">
              Order Online <ShoppingBag className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-gray-700 bg-black/40 hover:bg-white/10 text-white font-semibold text-lg px-8 py-6 rounded-xl backdrop-blur-md">
            <Link href="/menu">
              Explore Menu <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6 md:gap-12 mt-16 pt-12 border-t border-white/10 w-full max-w-2xl">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-amber-500">100%</div>
            <div className="text-xs md:text-sm text-gray-400 mt-1">Fresh Angus Beef</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-amber-500">15 min</div>
            <div className="text-xs md:text-sm text-gray-400 mt-1">Average Delivery</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-amber-500">4.9 ★</div>
            <div className="text-xs md:text-sm text-gray-400 mt-1">Over 2,500 Reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
}