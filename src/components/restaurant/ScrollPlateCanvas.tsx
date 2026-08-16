"use client";

import React, { useEffect, useRef } from "react";

interface ScrollPlateCanvasProps {
  className?: string;
}

export function ScrollPlateCanvas({ className }: ScrollPlateCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const rawProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      targetProgressRef.current = rawProgress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio || 1, 2));
    let height = (canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio || 1, 2));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio || 1, 2);
      height = canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio || 1, 2);
    };
    window.addEventListener("resize", handleResize);

    // Realistic porcelain plate drawing with 3D perspective, specular glints, gold inlay, and drop shadow
    const drawPlate = (progress: number, time: number) => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.48 + Math.sin(time * 0.0012) * 6;

      // Dynamic 3D tilt & rotation based on scroll scrub
      const rotationAngle = progress * Math.PI * 2.2 + time * 0.0003;
      const tilt = Math.cos(progress * Math.PI * 1.5) * 0.12 + 0.38; // Perspective squash
      const plateRadius = Math.min(width, height) * 0.38 * (1 - progress * 0.15);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, tilt);
      ctx.rotate(rotationAngle * 0.25);

      // 1. Soft Ambient Floor Shadow
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, plateRadius * 0.35, plateRadius * 1.18, plateRadius * 1.05, 0, 0, Math.PI * 2);
      const shadowGrad = ctx.createRadialGradient(0, plateRadius * 0.35, 10, 0, plateRadius * 0.35, plateRadius * 1.25);
      shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0.75)");
      shadowGrad.addColorStop(0.5, "rgba(249, 115, 22, 0.15)");
      shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = shadowGrad;
      ctx.fill();
      ctx.restore();

      // 2. Realistic Porcelain Outer Rim
      ctx.beginPath();
      ctx.arc(0, 0, plateRadius, 0, Math.PI * 2);
      const outerRimGrad = ctx.createRadialGradient(
        -plateRadius * 0.3,
        -plateRadius * 0.4,
        plateRadius * 0.2,
        0,
        0,
        plateRadius
      );
      outerRimGrad.addColorStop(0, "#ffffff");
      outerRimGrad.addColorStop(0.4, "#f7f5f0");
      outerRimGrad.addColorStop(0.85, "#e5ded3");
      outerRimGrad.addColorStop(1, "#c9beb0");
      ctx.fillStyle = outerRimGrad;
      ctx.fill();

      // Outer Edge Bevel
      ctx.lineWidth = plateRadius * 0.025;
      const bevelGrad = ctx.createLinearGradient(-plateRadius, -plateRadius, plateRadius, plateRadius);
      bevelGrad.addColorStop(0, "rgba(255,255,255,0.9)");
      bevelGrad.addColorStop(0.5, "rgba(200,190,180,0.6)");
      bevelGrad.addColorStop(1, "rgba(90,75,65,0.8)");
      ctx.strokeStyle = bevelGrad;
      ctx.stroke();

      // 3. Luxurious 24K Gold Inlay Accent Rim
      ctx.beginPath();
      ctx.arc(0, 0, plateRadius * 0.88, 0, Math.PI * 2);
      const goldGrad = ctx.createLinearGradient(
        -plateRadius * 0.8,
        -plateRadius * 0.8,
        plateRadius * 0.8,
        plateRadius * 0.8
      );
      goldGrad.addColorStop(0, "#fbbf24");
      goldGrad.addColorStop(0.3, "#fef08a");
      goldGrad.addColorStop(0.6, "#d97706");
      goldGrad.addColorStop(0.85, "#fef3c7");
      goldGrad.addColorStop(1, "#92400e");
      ctx.lineWidth = Math.max(plateRadius * 0.018, 2);
      ctx.strokeStyle = goldGrad;
      ctx.stroke();

      // 4. Subtle Fluted Marbled Well Depths
      ctx.beginPath();
      ctx.arc(0, 0, plateRadius * 0.72, 0, Math.PI * 2);
      const innerWellGrad = ctx.createRadialGradient(
        -plateRadius * 0.15,
        -plateRadius * 0.2,
        10,
        0,
        0,
        plateRadius * 0.72
      );
      innerWellGrad.addColorStop(0, "#ffffff");
      innerWellGrad.addColorStop(0.6, "#fdfcf9");
      innerWellGrad.addColorStop(0.9, "#ece3d5");
      innerWellGrad.addColorStop(1, "#d1c4b2");
      ctx.fillStyle = innerWellGrad;
      ctx.fill();

      // Inner Deep Well Shadow Ring
      ctx.lineWidth = plateRadius * 0.015;
      ctx.strokeStyle = "rgba(180, 160, 140, 0.4)";
      ctx.stroke();

      // 5. Center Mirror Glaze Specular Glint
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(-plateRadius * 0.25, -plateRadius * 0.22, plateRadius * 0.35, plateRadius * 0.18, -0.35, 0, Math.PI * 2);
      const glintGrad = ctx.createRadialGradient(
        -plateRadius * 0.25,
        -plateRadius * 0.22,
        0,
        -plateRadius * 0.25,
        -plateRadius * 0.22,
        plateRadius * 0.35
      );
      glintGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
      glintGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.35)");
      glintGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = glintGrad;
      ctx.fill();
      ctx.restore();

      // 6. Warm Amber Sahara Light Reflection
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(plateRadius * 0.3, plateRadius * 0.3, plateRadius * 0.4, plateRadius * 0.2, 0.45, 0, Math.PI * 2);
      const amberGlow = ctx.createRadialGradient(
        plateRadius * 0.3,
        plateRadius * 0.3,
        0,
        plateRadius * 0.3,
        plateRadius * 0.3,
        plateRadius * 0.4
      );
      amberGlow.addColorStop(0, "rgba(249, 115, 22, 0.3)");
      amberGlow.addColorStop(0.5, "rgba(239, 68, 68, 0.1)");
      amberGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = amberGlow;
      ctx.fill();
      ctx.restore();

      ctx.restore();
    };

    // Smooth Lerp Animation Loop
    const loop = (timestamp: number) => {
      // Lerp smoothing: smoothed += (target - smoothed) * 0.12
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.12;

      drawPlate(currentProgressRef.current, timestamp);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className || "w-full h-full pointer-events-none"}
    />
  );
}