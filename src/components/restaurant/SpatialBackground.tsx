"use client";

import React, { useEffect, useState } from "react";

export function SpatialBackground() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden transform-gpu bg-transparent">
      {/* Interactive Spatial Mouse Spotlight Tracker */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full transition-transform duration-700 ease-out blur-[120px] opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.35) 0%, rgba(239,68,68,0.15) 50%, transparent 80%)",
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Spatial Holographic Floating Orbs */}
      <div className="absolute top-[10%] left-[15%] w-[450px] h-[450px] bg-gradient-to-tr from-orange-600/20 via-red-600/15 to-transparent rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-amber-500/15 via-orange-600/20 to-transparent rounded-full blur-[110px]" />

      {/* Spatial Grid & Geometric Accents */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(249,115,22,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(249,115,22,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90" />
    </div>
  );
}