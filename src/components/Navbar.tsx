"use client";

import React from 'react';
import { Box, Sparkles, Search, ShoppingBag, Heart } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoritesCount: number;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, setSearchQuery, favoritesCount, cartCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Box className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Magnific 3D Menu
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Realistic 3D Objects & Assets</p>
          </div>
        </div>

        <div className="flex-1 max-w-md relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search realistic 3d menu items, burgers, coffee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 rounded-full border border-border text-sm font-medium">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>{favoritesCount}</span>
          </div>

          <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 rounded-full border border-border text-sm font-medium">
            <ShoppingBag className="w-4 h-4 text-purple-600" />
            <span>{cartCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
};