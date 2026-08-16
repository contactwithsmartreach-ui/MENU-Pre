"use client";

import React from "react";

export function ScrollVideoBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-[#0a0a0a] overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#120806] via-[#0a0a0a] to-[#070404]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-red-600/10 via-orange-500/15 to-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}