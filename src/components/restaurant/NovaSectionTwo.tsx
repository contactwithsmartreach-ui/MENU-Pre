"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

interface NovaSectionTwoProps {
  onScrollToMenu: () => void;
}

export function NovaSectionTwo({ onScrollToMenu }: NovaSectionTwoProps) {
  const capabilities = [
    {
      id: "01",
      title: "Real-time vision",
      body: "Reads context as it happens and surfaces what matters before you ask.",
    },
    {
      id: "02",
      title: "Layered insight",
      body: "Moves from rough outline to sharp output without losing the thread.",
    },
    {
      id: "03",
      title: "Adaptive speed",
      body: "Learns your cadence and tightens every pass as you work.",
    },
  ];

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-between px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-12 md:pb-16 text-white">
      {/* Top row */}
      <div className="flex flex-col gap-8 sm:flex-row justify-between items-start">
        <div className="inline-flex items-center border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md rounded-r-lg font-mono text-[11px] uppercase tracking-[0.15em] text-white">
          Insight On Demand
        </div>
        <p className="max-w-sm sm:text-right text-lg sm:text-xl leading-relaxed text-white drop-shadow-md">
          Our AI doesn&apos;t just respond — it interprets, sharpens, and delivers the signal you need.
        </p>
      </div>

      {/* Bottom area */}
      <div className="flex-1 flex flex-col md:flex-row items-end justify-between gap-16 py-12">
        {/* Left column */}
        <div className="max-w-xl">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg font-sans">
            Learn to see <br />
            brilliantly.
          </h2>
          <p className="mt-6 max-w-md text-sm sm:text-base text-white/80 drop-shadow-md leading-relaxed">
            From the first sketch to the final render, Nova turns raw intent into decisions your team can act on — quietly, precisely, at speed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onScrollToMenu}
              className="rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-medium text-black hover:bg-white/85 transition-colors flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <span>Run the demo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onScrollToMenu}
              className="rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-5 py-2.5 text-xs sm:text-sm text-white hover:bg-white/20 transition-colors shadow-lg cursor-pointer"
            >
              Free consultation
            </button>
          </div>
        </div>

        {/* Right frosted capability panel */}
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md px-5 sm:px-6 shadow-2xl">
          {capabilities.map((cap, i) => (
            <div
              key={cap.id}
              className={`flex gap-5 py-5 ${
                i !== capabilities.length - 1 ? "border-b border-white/15" : ""
              } group cursor-pointer`}
              onClick={onScrollToMenu}
            >
              <span className="font-mono text-[11px] tracking-[0.15em] text-white/55 pt-1">
                {cap.id}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-amber-200 transition-colors">
                    {cap.title}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                  {cap.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}