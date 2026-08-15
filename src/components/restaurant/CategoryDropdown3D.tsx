"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryDropdown3DProps {
  categories: readonly string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryDropdown3D: React.FC<CategoryDropdown3DProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative z-50 flex flex-col items-center">
      {/* Upfront Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "relative group px-5 py-2 rounded-full flex items-center gap-2.5 transition-all duration-300 transform-gpu cursor-pointer",
          "bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white font-serif uppercase tracking-widest text-xs font-black",
          "shadow-[0_0_25px_rgba(249,115,22,0.6)] border border-orange-300/60 ring-2 ring-orange-500/40",
          "hover:scale-105 active:scale-95"
        )}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
        <span className="drop-shadow-sm">{selectedCategory}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-orange-100 transition-transform duration-300",
            isOpen ? "rotate-180 text-white" : ""
          )}
        />
      </button>

      {/* 3D Depth Receding Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-2.5 w-60 p-2.5 rounded-2xl flex flex-col gap-1.5",
            "bg-neutral-950/95 border border-orange-500/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]",
            "animate-in fade-in-0 zoom-in-95 duration-200 origin-top"
          )}
          style={{
            perspective: "600px",
          }}
        >
          <div className="px-3 py-1 text-[10px] font-mono tracking-widest text-orange-400/70 uppercase border-b border-orange-500/15">
            Filter Menu Course
          </div>

          <div className="flex flex-col gap-1 mt-1 [transform-style:preserve-3d]">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-3.5 py-2 rounded-xl text-xs font-serif uppercase tracking-wider flex items-center justify-between transition-all duration-300 cursor-pointer transform-gpu",
                    isSelected
                      ? "bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold shadow-lg shadow-orange-500/40 border border-orange-300/40 opacity-100 z-10"
                      : "text-orange-200/50 bg-neutral-900/40 border border-transparent opacity-40 hover:opacity-100 hover:text-white hover:bg-neutral-900/80 hover:border-orange-500/30"
                  )}
                  style={{
                    transform: isSelected
                      ? "translateZ(12px) scale(1.02)"
                      : "translateZ(-8px) scale(0.92)",
                  }}
                >
                  <span className="truncate">{cat}</span>
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 text-amber-200" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500/30" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};