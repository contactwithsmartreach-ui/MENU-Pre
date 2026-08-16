"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ChefHatToqueProps {
  className?: string;
}

export function ChefHatToque({ className }: ChefHatToqueProps) {
  return (
    <div
      className={cn(
        "relative pointer-events-none select-none flex items-center justify-center filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]",
        className
      )}
    >
      <svg
        viewBox="0 0 400 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform-gpu"
      >
        <defs>
          {/* Main Crown Volumetric Gradient */}
          <radialGradient
            id="crownGlow"
            cx="48%"
            cy="35%"
            r="65%"
            fx="40%"
            fy="25%"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#F5EDE8" />
            <stop offset="70%" stopColor="#D8C7BC" />
            <stop offset="100%" stopColor="#9C8074" />
          </radialGradient>

          {/* Warm Sahara Rim Lighting */}
          <linearGradient id="saharaRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFAA5B" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FF6B35" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFD166" stopOpacity="0.8" />
          </linearGradient>

          {/* Deep Crease Shadow */}
          <linearGradient id="creaseShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3C2A21" stopOpacity="0.55" />
            <stop offset="85%" stopColor="#251610" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1A0D08" stopOpacity="0.95" />
          </linearGradient>

          {/* Band Texture Gradient */}
          <linearGradient id="bandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B39B8E" />
            <stop offset="20%" stopColor="#F4EDE8" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="80%" stopColor="#E4D5CC" />
            <stop offset="100%" stopColor="#A88F82" />
          </linearGradient>

          {/* Golden Ambient Backlight */}
          <filter id="ambientGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
          </filter>
        </defs>

        {/* Ambient Backlight Glow behind the hat */}
        <ellipse
          cx="200"
          cy="150"
          rx="140"
          ry="100"
          fill="rgba(249, 115, 22, 0.25)"
          filter="url(#ambientGoldGlow)"
        />

        {/* Back Pleats & Billowing Crown Silhouette */}
        <g id="crown-base">
          <path
            d="M 100 240 C 50 200, 30 140, 75 90 C 105 55, 150 40, 195 45 C 240 35, 295 50, 325 85 C 370 135, 355 200, 300 240 Z"
            fill="url(#crownGlow)"
            stroke="url(#saharaRim)"
            strokeWidth="2.5"
          />

          {/* Far Left Puff */}
          <path
            d="M 100 240 C 45 195, 40 120, 95 85 C 130 65, 145 90, 140 140 C 130 190, 115 220, 100 240 Z"
            fill="url(#crownGlow)"
            opacity="0.95"
          />
          {/* Mid Left Puff */}
          <path
            d="M 125 240 C 105 150, 120 70, 175 60 C 205 55, 205 100, 190 160 C 175 210, 150 235, 125 240 Z"
            fill="url(#crownGlow)"
            opacity="0.9"
          />
          {/* Central Major Puff */}
          <path
            d="M 170 240 C 160 140, 170 50, 215 48 C 260 46, 255 110, 240 170 C 225 215, 195 238, 170 240 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
          {/* Mid Right Puff */}
          <path
            d="M 225 240 C 225 155, 245 70, 290 75 C 330 80, 325 130, 295 180 C 275 215, 245 235, 225 240 Z"
            fill="url(#crownGlow)"
            opacity="0.9"
          />
          {/* Far Right Puff */}
          <path
            d="M 270 240 C 285 190, 310 135, 340 100 C 375 140, 360 200, 300 240 Z"
            fill="url(#crownGlow)"
            opacity="0.95"
          />
        </g>

        {/* Deep Pleat Folds & Fabric Creases */}
        <g id="creases" opacity="0.65">
          <path
            d="M 120 240 Q 135 150 145 95"
            stroke="url(#creaseShadow)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 165 240 Q 175 135 180 75"
            stroke="url(#creaseShadow)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 215 240 Q 220 140 225 70"
            stroke="url(#creaseShadow)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 260 240 Q 255 145 250 85"
            stroke="url(#creaseShadow)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 295 240 Q 305 160 315 110"
            stroke="url(#creaseShadow)"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>

        {/* Crisp Silk Highlights on Pleat Ridges */}
        <g id="silk-highlights" opacity="0.8">
          <path
            d="M 105 230 Q 115 140 130 90"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 150 230 Q 155 130 165 65"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 198 230 Q 200 120 205 55"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 240 230 Q 242 125 242 70"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 280 230 Q 288 140 295 90"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* Base Gathering Shadow */}
        <path
          d="M 98 236 C 145 248, 255 248, 302 236 C 300 245, 100 245, 98 236 Z"
          fill="#1C0F0A"
          opacity="0.7"
        />

        {/* Structured Headband (Toque Base) */}
        <g id="headband">
          <path
            d="M 100 238 C 160 252, 240 252, 300 238 L 305 285 C 245 300, 155 300, 95 285 Z"
            fill="url(#bandGrad)"
            stroke="url(#saharaRim)"
            strokeWidth="2"
          />

          <path
            d="M 140 244 L 138 290"
            stroke="#9C8276"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d="M 200 247 L 200 294"
            stroke="#9C8276"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d="M 260 244 L 262 290"
            stroke="#9C8276"
            strokeWidth="1.5"
            opacity="0.6"
          />

          <path
            d="M 100 239 C 160 253, 240 253, 300 239"
            stroke="#FFB067"
            strokeWidth="2"
            opacity="0.85"
          />
          <path
            d="M 95 284 C 155 299, 245 299, 305 284"
            stroke="#FFB067"
            strokeWidth="2.5"
            opacity="0.9"
          />

          <ellipse
            cx="200"
            cy="270"
            rx="50"
            ry="12"
            fill="#FFFFFF"
            opacity="0.45"
          />
        </g>

        {/* Bottom Cast Shadow */}
        <ellipse
          cx="200"
          cy="295"
          rx="110"
          ry="10"
          fill="#000000"
          opacity="0.8"
          filter="url(#ambientGoldGlow)"
        />
      </svg>
    </div>
  );
}