"use client";

import React, { useEffect, useRef, useState } from "react";

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4";

export function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const framesRef = useRef<ImageBitmap[]>([]);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = VIDEO_URL;

    const handleLoadedData = () => {
      setVideoReady(true);
      // Attempt frame caching after a short yield
      setTimeout(() => {
        cacheFrames(video);
      }, 300);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.load();

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);

  const cacheFrames = async (video: HTMLVideoElement) => {
    if (!video.duration || isNaN(video.duration)) return;
    const duration = video.duration;
    const numFrames = Math.min(Math.max(Math.floor(duration * 10), 24), 75);
    const interval = duration / numFrames;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 960;
    canvas.height = 540;

    const bitmaps: ImageBitmap[] = [];
    for (let i = 0; i < numFrames; i++) {
      video.currentTime = i * interval;
      await new Promise((resolve) => {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          resolve(true);
        };
        video.addEventListener("seeked", onSeeked);
      });
      try {
        const bitmap = await createImageBitmap(video);
        bitmaps.push(bitmap);
      } catch {
        // Ignore individual frame extraction errors
      }
    }

    if (bitmaps.length > 0) {
      framesRef.current = bitmaps;
      setIsCached(true);
    }
  };

  useEffect(() => {
    let animationFrameId: number;
    let smoothedProgress = 0;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const progress = Math.max(0, Math.min(1, window.scrollY / scrollHeight));
      
      // Lerp for cinematic smoothness
      smoothedProgress += (progress - smoothedProgress) * 0.12;

      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Handle Canvas DPR
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== window.innerWidth * dpr || canvas.height !== window.innerHeight * dpr) {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const w = window.innerWidth;
      const h = window.innerHeight;

      if (isCached && framesRef.current.length > 0) {
        const frameIndex = Math.min(
          Math.floor(smoothedProgress * framesRef.current.length),
          framesRef.current.length - 1
        );
        const frame = framesRef.current[frameIndex];
        if (frame) {
          drawImageCover(ctx, frame, w, h);
        }
      } else if (video && video.readyState >= 2 && !isNaN(video.duration)) {
        const targetTime = smoothedProgress * (video.duration - 0.05);
        if (Math.abs(video.currentTime - targetTime) > 0.04) {
          video.currentTime = targetTime;
        }
        drawImageCover(ctx, video, w, h);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    animationFrameId = requestAnimationFrame(handleScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isCached]);

  return (
    <div className="fixed inset-0 z-0 bg-[#0a0a0a] overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        muted
        playsInline
        preload="auto"
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
    </div>
  );
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  cw: number,
  ch: number
) {
  const iw = (img as HTMLVideoElement).videoWidth || (img as ImageBitmap).width || cw;
  const ih = (img as HTMLVideoElement).videoHeight || (img as ImageBitmap).height || ch;

  const hRatio = cw / iw;
  const vRatio = ch / ih;
  const ratio = Math.max(hRatio, vRatio);

  const centerShiftX = (cw - iw * ratio) / 2;
  const centerShiftY = (ch - ih * ratio) / 2;

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, 0, 0, iw, ih, centerShiftX, centerShiftY, iw * ratio, ih * ratio);
}