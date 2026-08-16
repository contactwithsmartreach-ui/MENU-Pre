"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Utensils } from "lucide-react";

interface ChefMascotScrollerProps {
  onJumpToMenu?: () => void;
}

export function ChefMascotScroller({ onJumpToMenu }: ChefMascotScrollerProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [walkDirection, setWalkDirection] = useState<"right" | "left">("right");
  const [speechText, setSpeechText] = useState<string | null>(null);
  const [mascotMood, setMascotMood] = useState<"sitting" | "jumping" | "walking" | "celebrating">("sitting");
  
  const lastScrollYRef = useRef(0);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const walkStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Quotes when user interacts with the mascot
  const mascotQuotes = [
    "Bon Appétit! 🍲",
    "Watch me do a backflip! 🤸‍♂️",
    "Smells incredible down here! ✨",
    "Spin the cylinder to taste magic! 🔥",
    "Chef's secret recipe loaded! 👨‍🍳",
    "Follow me to the culinary theater!",
  ];

  const handleMascotClick = () => {
    setMascotMood("celebrating");
    const randomQuote = mascotQuotes[Math.floor(Math.random() * mascotQuotes.length)];
    setSpeechText(randomQuote);

    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => {
      setSpeechText(null);
      setMascotMood(scrollY > 120 ? "walking" : "sitting");
    }, 2800);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollYRef.current;

      setScrollY(currentScroll);

      // Determine movement state
      if (Math.abs(delta) > 1.5) {
        setIsWalking(true);
        setWalkDirection(delta > 0 ? "right" : "left");

        if (walkStopTimeoutRef.current) clearTimeout(walkStopTimeoutRef.current);
        walkStopTimeoutRef.current = setTimeout(() => {
          setIsWalking(false);
        }, 180);
      }

      // Transition states based on scroll position
      if (currentScroll < 80) {
        setMascotMood("sitting");
      } else if (currentScroll >= 80 && currentScroll < 350) {
        setMascotMood("jumping");
      } else {
        setMascotMood("walking");
      }

      lastScrollYRef.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      if (walkStopTimeoutRef.current) clearTimeout(walkStopTimeoutRef.current);
    };
  }, []);

  const hasScrolledDown = scrollY > 90;

  // Horizontal walking offset across the screen based on scroll progression
  const scrollProgress = Math.min(scrollY / 1600, 1);
  const dynamicXWalk = Math.sin(scrollY * 0.008) * 120; // gentle pacing back and forth as scrolling

  return (
    <div
      className={cn(
        "z-50 pointer-events-auto transition-all duration-700 ease-out select-none",
        hasScrolledDown
          ? "fixed bottom-6 right-6 sm:right-12"
          : "absolute -top-16 left-1/2 -translate-x-1/2"
      )}
      style={
        hasScrolledDown
          ? {
              transform: `translateX(${dynamicXWalk}px)`,
            }
          : undefined
      }
    >
      {/* Interactive Speech Bubble */}
      {speechText && (
        <div
          className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-amber-400 to-orange-500 text-neutral-950 font-serif font-black text-xs px-3.5 py-1.5 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.8)] border border-white/80 animate-bounce z-30"
          style={{ animationDuration: "1s" }}
        >
          {speechText}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-orange-500" />
        </div>
      )}

      {/* Cartoon Character Body Wrapper */}
      <div
        onClick={handleMascotClick}
        className={cn(
          "relative cursor-pointer transition-transform duration-300 group flex flex-col items-center",
          mascotMood === "jumping" && "scale-110 -translate-y-4 rotate-6",
          mascotMood === "celebrating" && "animate-spin scale-125",
          !hasScrolledDown && "hover:scale-115 animate-bounce",
          hasScrolledDown && isWalking && "scale-105"
        )}
        style={{
          animationDuration: hasScrolledDown ? "0.6s" : "2s",
        }}
      >
        {/* Soft mascot halo aura glow */}
        <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/50 via-amber-400/40 to-red-500/40 rounded-full blur-md opacity-80 group-hover:opacity-100 group-hover:blur-lg transition-all animate-pulse" />

        {/* SVG Cartoon Mascot Character (Petit Flame Chef) */}
        <div
          className={cn(
            "relative w-16 h-20 transition-transform duration-200",
            hasScrolledDown && walkDirection === "left" ? "scale-x-[-1]" : "scale-x-1"
          )}
        >
          <svg
            viewBox="0 0 120 150"
            className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Warm skin & body gradients */}
              <radialGradient id="mascot-face" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="70%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#ea580c" />
              </radialGradient>
              <linearGradient id="mascot-hat" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="75%" stopColor="#f3f4f6" />
                <stop offset="100%" stopColor="#d1d5db" />
              </linearGradient>
              <linearGradient id="mascot-apron" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="mascot-golden-spoon" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            {/* --- Chef Toque / Big Fluffy White Hat --- */}
            <g className="animate-pulse" style={{ animationDuration: "3s" }}>
              {/* Hat Top Puffs */}
              <ellipse cx="60" cy="30" rx="30" ry="18" fill="url(#mascot-hat)" />
              <ellipse cx="38" cy="36" rx="16" ry="14" fill="url(#mascot-hat)" />
              <ellipse cx="82" cy="36" rx="16" ry="14" fill="url(#mascot-hat)" />
              {/* Hat Base Band with Golden Star */}
              <rect x="40" y="44" width="40" height="12" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
              <polygon points="60,46 62,50 66,51 63,54 64,58 60,56 56,58 57,54 54,51 58,50" fill="#f59e0b" />
            </g>

            {/* --- Mascot Head --- */}
            <circle cx="60" cy="72" r="26" fill="url(#mascot-face)" stroke="#c2410c" strokeWidth="1.5" />

            {/* Cute Rosy Cheeks */}
            <ellipse cx="43" cy="80" rx="6" ry="4" fill="#f87171" opacity="0.8" />
            <ellipse cx="77" cy="80" rx="6" ry="4" fill="#f87171" opacity="0.8" />

            {/* Sparkly Cartoon Big Eyes */}
            <g>
              {/* Left Eye */}
              <ellipse cx="48" cy="68" rx="5" ry="6.5" fill="#1e1b4b" />
              <circle cx="46.5" cy="66" r="2.2" fill="#ffffff" />
              <circle cx="49.5" cy="71" r="1" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx="72" cy="68" rx="5" ry="6.5" fill="#1e1b4b" />
              <circle cx="70.5" cy="66" r="2.2" fill="#ffffff" />
              <circle cx="73.5" cy="71" r="1" fill="#ffffff" />
            </g>

            {/* Happy Smile & Tongue */}
            <path
              d="M 52,78 Q 60,88 68,78"
              fill="#991b1b"
              stroke="#450a0a"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 56,83 Q 60,86 64,83"
              fill="#f43f5e"
            />

            {/* Cute Little Tiny Mustache */}
            <path
              d="M 50,75 C 55,73 57,76 60,76 C 63,76 65,73 70,75 C 66,78 63,78 60,77 C 57,78 54,78 50,75 Z"
              fill="#7c2d12"
            />

            {/* --- Mascot Body / Chef Apron --- */}
            <path
              d="M 44,94 Q 38,118 42,124 L 78,124 Q 82,118 76,94 Z"
              fill="url(#mascot-apron)"
              stroke="#9a3412"
              strokeWidth="1"
            />
            {/* Apron Pocket */}
            <rect x="52" y="105" width="16" height="12" rx="3" fill="#ffffff" opacity="0.9" />
            {/* Little Fork sticking out of pocket */}
            <path d="M 58,107 L 58,100 M 56,102 L 60,102 M 56,100 L 56,102 M 60,100 L 60,102" stroke="#ea580c" strokeWidth="1" strokeLinecap="round" />

            {/* --- Animated Hands & Golden Spatula / Ladle --- */}
            {/* Left Hand */}
            <circle cx="34" cy="104" r="6" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
            
            {/* Right Hand holding Golden Spoon */}
            <g className={cn("origin-[86px_104px] transition-transform", isWalking && "rotate-12")}>
              <circle cx="86" cy="104" r="6" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
              {/* Spoon Handle & Bowl */}
              <line x1="84" y1="104" x2="100" y2="82" stroke="url(#mascot-golden-spoon)" strokeWidth="3.5" strokeLinecap="round" />
              <ellipse cx="103" cy="78" rx="6" ry="8" fill="url(#mascot-golden-spoon)" transform="rotate(30 103 78)" />
              {/* Little magical food sparkle spark on spoon */}
              <circle cx="106" cy="72" r="2" fill="#ffffff" className="animate-ping" />
            </g>

            {/* --- Animated Legs / Feet --- */}
            {/* Left Foot */}
            <ellipse
              cx={hasScrolledDown && isWalking ? "46" : "48"}
              cy={hasScrolledDown && isWalking ? "135" : "130"}
              rx="9"
              ry="6"
              fill="#18181b"
              stroke="#ea580c"
              strokeWidth="1"
              className={cn(
                "transition-all duration-150",
                hasScrolledDown && isWalking && "-translate-y-2"
              )}
            />
            {/* Right Foot */}
            <ellipse
              cx={hasScrolledDown && isWalking ? "74" : "72"}
              cy={hasScrolledDown && isWalking ? "130" : "130"}
              rx="9"
              ry="6"
              fill="#18181b"
              stroke="#ea580c"
              strokeWidth="1"
              className={cn(
                "transition-all duration-150",
                hasScrolledDown && isWalking && "translate-y-1"
              )}
            />
          </svg>
        </div>

        {/* Small mascot badge label on hover / bottom */}
        {hasScrolledDown && (
          <div className="mt-0.5 px-2 py-0.5 rounded-full bg-neutral-950/90 border border-orange-500/50 backdrop-blur-md flex items-center gap-1 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[9px] font-serif uppercase tracking-widest text-orange-300 font-bold">
              Chef Guide
            </span>
          </div>
        )}
      </div>
    </div>
  );
}