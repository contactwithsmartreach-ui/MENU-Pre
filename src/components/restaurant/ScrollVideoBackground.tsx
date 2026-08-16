"use client";

import React, { useEffect, useRef, useState } from "react";

export function ScrollVideoBackground() {
  const videoUrl = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let currentProgress = 0;

    const handleLoadedData = () => {
      setIsVideoReady(true);
      video.pause();
    };

    video.addEventListener("loadeddata", handleLoadedData);

    const render = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const targetProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      
      // Smooth lerp
      currentProgress += (targetProgress - currentProgress) * 0.12;

      if (video.duration && !isNaN(video.duration)) {
        const targetTime = currentProgress * (video.duration - 0.05);
        if (Math.abs(video.currentTime - targetTime) > 0.03) {
          video.currentTime = targetTime;
        }
      }

      // Resize canvas to cover viewport
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth * Math.min(window.devicePixelRatio, 2);
        canvas.height = window.innerHeight * Math.min(window.devicePixelRatio, 2);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (video.readyState >= 2) {
        // Draw object-cover
        const hRatio = canvas.width / video.videoWidth;
        const vRatio = canvas.height / video.videoHeight;
        const ratio = Math.max(hRatio, vRatio);
        const centerShiftX = (canvas.width - video.videoWidth * ratio) / 2;
        const centerShiftY = (canvas.height - video.videoHeight * ratio) / 2;

        ctx.drawImage(
          video,
          0,
          0,
          video.videoWidth,
          video.videoHeight,
          centerShiftX,
          centerShiftY,
          video.videoWidth * ratio,
          video.videoHeight * ratio
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-[#0a0a0a] overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        src={videoUrl}
        className="hidden"
        muted
        playsInline
        preload="auto"
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isVideoReady ? "opacity-90" : "opacity-0"
        }`}
      />
      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-transparent to-[#0a0a0a]/90" />
    </div>
  );
}