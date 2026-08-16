"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface Chef3DCharacterProps {
  className?: string;
  imageSrc?: string;
}

export function Chef3DCharacter({
  className,
  imageSrc = "dyad-media://media/bold-badger-bob/.dyad/media/4ed13bbf469718326bee283f8bf1bf01c834a9b55fbad911915caf745e013c1e.jpg",
}: Chef3DCharacterProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Subtle interactive parallax tilt on hover with zero continuous CPU loops
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setRotateX((-y / (rect.height / 2)) * 8);
    setRotateY((x / (rect.width / 2)) * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex flex-col items-center justify-center select-none [perspective:900px] pointer-events-auto",
        className
      )}
    >
      {/* 3D Still Character Rig */}
      <div
        className="relative transition-transform duration-300 ease-out will-change-transform transform-gpu flex items-center justify-center"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Warm Ambient Glow Aura */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-red-600/30 via-orange-500/35 to-amber-400/25 blur-3xl pointer-events-none -z-10" />

        {/* High performance cutout presentation with gradient masking */}
        <div className="relative w-[280px] sm:w-[350px] md:w-[400px] h-[280px] sm:h-[350px] md:h-[400px] flex items-center justify-center overflow-visible">
          <img
            src={imageSrc}
            alt="Chef with Pizza"
            className="w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] drop-shadow-[0_0_25px_rgba(249,115,22,0.3)] [mask-image:radial-gradient(ellipse_at_center,black_62%,transparent_74%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_62%,transparent_74%)]"
            loading="eager"
            draggable={false}
          />
        </div>
      </div>

      {/* Static Ground Floor Shadow */}
      <div className="w-48 sm:w-64 h-5 bg-black/80 rounded-full blur-lg pointer-events-none -mt-4" />
    </div>
  );
}