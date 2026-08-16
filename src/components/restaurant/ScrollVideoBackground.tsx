"use client";

import React, { useEffect, useRef, useState } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4";

export function ScrollVideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [canvasActive, setCanvasActive] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animationFrameId: number;
    let smoothedProgress = 0;
    let isMounted = true;

    video.src = VIDEO_URL;
    video.load();

    const handleLoadedMetadata = () => {
      if (!isMounted) return;
      setIsVideoReady(true);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    const render = () => {
      if (!isMounted) return;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min(Math.max(window.scrollY / scrollHeight, 0), 1) : 0;

      // Smooth lerp progress
      smoothedProgress += (progress - smoothedProgress) * 0.12;

      if (video.duration && !isNaN(video.duration)) {
        const targetTime = smoothedProgress * (video.duration - 0.05);
        if (Math.abs(video.currentTime - targetTime) > 0.03) {
          video.currentTime = targetTime;
        }
      }

      const ctx = canvas.getContext("2d");
      if (ctx && video.readyState >= 2) {
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = window.innerWidth * dpr;
          canvas.height = window.innerHeight * dpr;
          ctx.scale(dpr, dpr);
        }

        const cw = window.innerWidth;
        const ch = window.innerHeight;
        const vw = video.videoWidth || 1920;
        const vh = video.videoHeight || 1080;

        const hRatio = cw / vw;
        const vRatio = ch / vh;
        const scale = Math.max(hRatio, vRatio);
        const centerShiftX = (cw - vw * scale) / 2;
        const centerShiftY = (ch - vh * scale) / 2;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(video, 0, 0, vw, vh, centerShiftX, centerShiftY, vw * scale, vh * scale);
        setCanvasActive(true);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-[#0a0a0a] overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-0"
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          canvasActive ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Cinematic dark tint overlay for high contrast */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
    </div>
  );
}