"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ChefCharacterStageProps {
  onInteract?: () => void;
  className?: string;
}

export function ChefCharacterStage({ onInteract, className }: ChefCharacterStageProps) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Subtle interactive parallax effect based on mouse cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onInteract}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onInteract?.()}
      className={cn(
        "relative w-full flex flex-col items-center justify-end select-none cursor-pointer group",
        className
      )}
    >
      {/* 1. Volumetric Amber/Red Atmospheric Backlight */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[460px] bg-gradient-to-t from-red-600/35 via-orange-500/30 to-amber-400/20 rounded-full blur-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-700" />

      {/* 2. Character Model Wrapper with Parallax & Subtle Idle Floating Motion */}
      <div
        className="relative z-20 flex flex-col items-center justify-end transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y - (isHovered ? 8 : 0)}px, 0) scale(${isHovered ? 1.03 : 1})`,
        }}
      >
        {/* The 3D Character Cutout */}
        <div className="relative w-[280px] sm:w-[380px] md:w-[460px] lg:w-[520px] aspect-[4/5] flex items-end justify-center filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]">
          {/* High-res transparent master chef render / culinary figurine with rim lighting */}
          <img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1200&auto=format&fit=crop"
            alt="L'Aura Sahara Master Chef"
            className="w-full h-full object-contain object-bottom pointer-events-none transition-transform duration-700 [mask-image:radial-gradient(ellipse_at_center,black_65%,transparent_98%)] rounded-3xl"
            draggable={false}
          />

          {/* Sahara Golden Rim Light Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-orange-500/10 to-amber-300/20 mix-blend-screen pointer-events-none rounded-3xl" />
        </div>

        {/* 3. Realistic Multi-Layered Floor & Contact Shadows onto the Button Below */}
        <div className="relative -mt-6 sm:-mt-8 flex flex-col items-center pointer-events-none z-10">
          {/* Deep Core Occlusion Contact Shadow */}
          <div
            className={cn(
              "w-36 sm:w-56 md:w-64 h-5 sm:h-7 bg-black/90 rounded-full blur-sm transition-all duration-300",
              isHovered ? "scale-90 opacity-70" : "scale-100 opacity-95"
            )}
          />
          {/* Diffuse Wide Ambient Floor Shadow */}
          <div
            className={cn(
              "w-56 sm:w-80 md:w-96 h-8 sm:h-12 bg-black/70 rounded-full blur-lg -mt-3 transition-all duration-300",
              isHovered ? "scale-95 opacity-60" : "scale-100 opacity-80"
            )}
          />
          {/* Warm Amber Radiance bounce on the ground */}
          <div className="w-48 sm:w-72 h-4 bg-orange-600/30 rounded-full blur-md -mt-4" />
        </div>
      </div>
    </div>
  );
}