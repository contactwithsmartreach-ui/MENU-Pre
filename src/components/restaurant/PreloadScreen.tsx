"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreloadScreenProps {
  onComplete: () => void;
}

export function PreloadScreen({ onComplete }: PreloadScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Smooth progress interval that increments gradually (takes about 1.8 seconds total)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 500);
          }, 300);
          return 100;
        }
        return prev + 3;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#e3efed] text-neutral-900 transition-opacity duration-500 select-none",
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-6">
        {/* Hand Loader appearing instantly */}
        <div className="flex items-center justify-center scale-125 my-4">
          <div className="🤚">
            <div className="🌴"></div>
            <div className="👍"></div>
            <div className="👉"></div>
            <div className="👉"></div>
            <div className="👉"></div>
            <div className="👉"></div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-orange-600">
            <Sparkles className="w-4 h-4 fill-orange-600" />
            <span className="text-[10px] uppercase font-serif tracking-[0.3em]">L&apos;Aura Sahara</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-neutral-900 tracking-widest uppercase">
            Loading Feast
          </h2>
        </div>

        {/* Smooth loading bar */}
        <div className="w-48 h-1.5 bg-neutral-300 rounded-full overflow-hidden border border-orange-500/30">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 transition-all duration-75 ease-linear"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <span className="text-[11px] font-mono text-orange-700 font-bold tracking-wider">
          {Math.min(progress, 100)}%
        </span>
      </div>

      <style jsx>{`
        .🤚 {
          --skin-color: #E4C560;
          --tap-speed: 0.6s;
          --tap-stagger: 0.1s;
          position: relative;
          width: 80px;
          height: 60px;
          margin-left: 80px;
        }

        .🤚:before {
          content: '';
          display: block;
          width: 180%;
          height: 75%;
          position: absolute;
          top: 70%;
          right: 20%;
          background-color: black;
          border-radius: 40px 10px;
          filter: blur(10px);
          opacity: 0.3;
        }

        .🌴 {
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background-color: var(--skin-color);
          border-radius: 10px 40px;
        }

        .👍 {
          position: absolute;
          width: 120%;
          height: 38px;
          background-color: var(--skin-color);
          bottom: -18%;
          right: 1%;
          transform-origin: calc(100% - 20px) 20px;
          transform: rotate(-20deg);
          border-radius: 30px 20px 20px 10px;
          border-bottom: 2px solid rgba(0, 0, 0, 0.1);
          border-left: 2px solid rgba(0, 0, 0, 0.1);
        }

        .👍:after {
          width: 20%;
          height: 60%;
          content: '';
          background-color: rgba(255, 255, 255, 0.3);
          position: absolute;
          bottom: -8%;
          left: 5px;
          border-radius: 60% 10% 10% 30%;
          border-right: 2px solid rgba(0, 0, 0, 0.05);
        }

        .👉 {
          position: absolute;
          width: 80%;
          height: 35px;
          background-color: var(--skin-color);
          bottom: 32%;
          right: 64%;
          transform-origin: 100% 20px;
          animation-duration: calc(var(--tap-speed) * 2);
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          transform: rotate(10deg);
        }

        .👉:before {
          content: '';
          position: absolute;
          width: 140%;
          height: 30px;
          background-color: var(--skin-color);
          bottom: 8%;
          right: 65%;
          transform-origin: calc(100% - 20px) 20px;
          transform: rotate(-60deg);
          border-radius: 20px;
        }

        .👉:nth-child(1) {
          animation-delay: 0s;
          filter: brightness(70%);
          animation-name: tap-upper-1;
        }

        .👉:nth-child(2) {
          animation-delay: var(--tap-stagger);
          filter: brightness(80%);
          animation-name: tap-upper-2;
        }

        .👉:nth-child(3) {
          animation-delay: calc(var(--tap-stagger) * 2);
          filter: brightness(90%);
          animation-name: tap-upper-3;
        }

        .👉:nth-child(4) {
          animation-delay: calc(var(--tap-stagger) * 3);
          filter: brightness(100%);
          animation-name: tap-upper-4;
        }

        @keyframes tap-upper-1 {
          0%, 50%, 100% {
            transform: rotate(10deg) scale(0.4);
          }
          40% {
            transform: rotate(50deg) scale(0.4);
          }
        }

        @keyframes tap-upper-2 {
          0%, 50%, 100% {
            transform: rotate(10deg) scale(0.6);
          }
          40% {
            transform: rotate(50deg) scale(0.6);
          }
        }

        @keyframes tap-upper-3 {
          0%, 50%, 100% {
            transform: rotate(10deg) scale(0.8);
          }
          40% {
            transform: rotate(50deg) scale(0.8);
          }
        }

        @keyframes tap-upper-4 {
          0%, 50%, 100% {
            transform: rotate(10deg) scale(1);
          }
          40% {
            transform: rotate(50deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
}