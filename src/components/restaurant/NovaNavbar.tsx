"use client";

import React, { useEffect, useState } from "react";
import { Hexagon, Sparkles } from "lucide-react";

interface NovaNavbarProps {
  onOpenOrder: () => void;
  cartCount: number;
}

export function NovaNavbar({ onOpenOrder, cartCount }: NovaNavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-white/20 py-3.5 shadow-2xl"
          : "bg-transparent border-white/15 py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group cursor-pointer">
          <Hexagon className="w-6 h-6 text-white stroke-[1.5] transition-transform group-hover:rotate-45" />
          <span className="text-lg sm:text-xl font-medium tracking-tight text-white font-sans">
            novaai<span className="text-orange-400 font-serif font-bold ml-1">.dine</span>
          </span>
        </a>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-sm text-white/85 font-sans">
          <a href="#cylinder-menu" className="hover:text-white transition-colors flex items-center gap-1.5">
            Projects <span className="font-mono text-[10px] text-white/60">6</span>
          </a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#blog" className="hover:text-white transition-colors">Blog</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>

        {/* Right CTA */}
        <button
          type="button"
          onClick={onOpenOrder}
          className="relative group rounded-md border border-white/20 bg-white/15 backdrop-blur-md px-4 py-2 text-xs sm:px-5 sm:text-sm text-white hover:bg-white/25 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Table Order {cartCount > 0 && `(${cartCount})`}</span>
        </button>
      </div>
    </header>
  );
}