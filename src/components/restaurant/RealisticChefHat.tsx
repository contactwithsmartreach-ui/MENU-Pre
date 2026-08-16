"use client";

import React, { useState, useEffect } from "react";

export function RealisticChefHat() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 12;
      const y = (e.clientY / innerHeight - 0.5) * 10;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);<dyad-write path="src/components/restaurant/RealisticChefHat.tsx" description="Remove floating stars and adjust dimensions so the chef hat sits naturally atop the button">
"use client";

import React, { useState, useEffect } from "react";

export function RealisticChefHat() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 12;
      const y = (e.clientY / innerHeight - 0.5) * 10;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none group pointer-events-none">
      {/* Radiant Amber & Ember Core Glow behind the Hat */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-orange-600/30 via-amber-500/20 to-red-500/10 rounded-full blur-2xl scale-105" />

      {/* 3D Hat Container reacting with gentle perspective */}
      <div
        className="relative z-20 flex flex-col items-center transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `perspective(900px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)`,
        }}
      >
        {/* Realistic Chef Hat SVG Graphic without stars */}
        <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-64 md:h-64 flex items-center justify-center">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)] filter"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="hat-dome-base" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#f7f2ea" />
                <stop offset="70%" stopColor="#e3d6c6" />
                <stop offset="100%" stopColor="#bfaea0" />
              </linearGradient>

              <linearGradient id="band-gold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="30%" stopColor="#fde68a" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              <linearGradient id="headband-cloth" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f3eee8" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ded1c3" />
              </linearGradient>

              <radialGradient id="ember-warm-glow" cx="50%" cy="80%" r="60%">
                <stop offset="0%" stopColor="rgba(249, 115, 22, 0.4)" />
                <stop offset="60%" stopColor="rgba(239, 68, 68, 0.15)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Backdrop Volume Silhouette */}
            <path
              d="M 120 280 C 70 200, 100 120, 180 90 C 210 50, 290 50, 320 90 C 400 120, 430 200, 380 280 Z"
              fill="url(#hat-dome-base)"
            />

            {/* Left Puff Volume */}
            <path
              d="M 135 280 C 80 220, 105 130, 180 110 C 195 180, 170 240, 135 280 Z"
              fill="#ffffff"
              opacity="0.92"
            />

            {/* Center Front Main Puff */}
            <path
              d="M 175 110 C 210 65, 290 65, 325 110 C 310 180, 290 250, 250 280 C 210 250, 190 180, 175 110 Z"
              fill="#ffffff"
            />

            {/* Right Puff Volume with Warm Shadowing */}
            <path
              d="M 325 110 C 400 130, 420 220, 365 280 C 330 240, 310 180, 325 110 Z"
              fill="#ebdccb"
              opacity="0.9"
            />

            {/* Top Crown Master Folds & Curves */}
            <ellipse cx="250" cy="85" rx="65" ry="30" fill="#ffffff" />
            <ellipse cx="180" cy="115" rx="45" ry="25" fill="#fdfbf7" />
            <ellipse cx="320" cy="115" rx="45" ry="25" fill="#f5ede3" />
            <ellipse cx="125" cy="175" rx="35" ry="40" fill="#f7f1e8" />
            <ellipse cx="375" cy="175" rx="35" ry="40" fill="#e5d4c0" />

            {/* Vertical Pleat Creases */}
            <path d="M 175 110 Q 185 200 190 280" stroke="#baa894" strokeWidth="4.5" fill="none" opacity="0.6" />
            <path d="M 215 90 Q 220 195 220 280" stroke="#d5c7b7" strokeWidth="4" fill="none" opacity="0.7" />
            <path d="M 250 85 Q 250 190 250 280" stroke="#e8ded2" strokeWidth="4.5" fill="none" opacity="0.8" />
            <path d="M 285 90 Q 280 195 280 280" stroke="#9e8c79" strokeWidth="5" fill="none" opacity="0.7" />
            <path d="M 325 110 Q 315 200 310 280" stroke="#877563" strokeWidth="5.5" fill="none" opacity="0.8" />

            {/* Warm Ember Glow Overlay */}
            <path
              d="M 120 280 C 70 200, 100 120, 180 90 C 210 50, 290 50, 320 90 C 400 120, 430 200, 380 280 Z"
              fill="url(#ember-warm-glow)"
              style={{ mixBlendMode: "color-dodge" }}
            />

            {/* Lower Headband Base Structure */}
            <path
              d="M 140 280 L 360 280 L 350 370 Q 250 385 150 370 Z"
              fill="url(#headband-cloth)"
            />

            {/* Luxury Gold Trim Ribbon Accent along Base */}
            <path
              d="M 145 350 L 355 350 L 350 366 Q 250 380 150 366 Z"
              fill="url(#band-gold)"
            />

            {/* Headband Horizontal Crease Line */}
            <path
              d="M 142 295 Q 250 305 358 295"
              stroke="#baa894"
              strokeWidth="2.5"
              fill="none"
              opacity="0.65"
            />

            {/* Front Center Sahara Crest */}
            <circle cx="250" cy="330" r="14" fill="url(#band-gold)" />
            <circle cx="250" cy="330" r="8" fill="#17100e" />
            <polygon points="250,324 253,332 250,336 247,332" fill="#fbbf24" />
          </svg>
        </div>
      </div>
    </div>
  );
}