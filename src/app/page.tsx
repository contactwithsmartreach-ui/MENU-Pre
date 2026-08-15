"use client";

import React, { useState } from "react";
import { CylinderCarousel, CarouselImage } from "@/components/CylinderCarousel";
import { FeaturedModal } from "@/components/FeaturedModal";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Layers, Compass, Play, Pause, RotateCw, Eye } from "lucide-react";

const GALLERY_IMAGES: CarouselImage[] = [
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    title: "Quantum Flux",
    category: "Abstract 3D",
    alt: "Abstract 3D render with glowing neon waves"
  },
  {
    src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=800",
    title: "Neon Genesis",
    category: "Cyberpunk",
    alt: "Cyberpunk cityscape with neon lights"
  },
  {
    src: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&q=80&w=800",
    title: "Ether Spheres",
    category: "Digital Art",
    alt: "Floating chrome spheres in minimal dark studio"
  },
  {
    src: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800",
    title: "Chromatic Void",
    category: "Surrealism",
    alt: "Surreal ethereal landscape with neon glow"
  },
  {
    src: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800",
    title: "Prismatic Wave",
    category: "Motion Art",
    alt: "Vibrant iridescent fluid motion sculpture"
  },
  {
    src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800",
    title: "Neural Network",
    category: "AI Visuals",
    alt: "AI generated abstract neural network structure"
  },
  {
    src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800",
    title: "Modernist Matrix",
    category: "Fine Art",
    alt: "Abstract textured modern art installation"
  },
  {
    src: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&q=80&w=800",
    title: "Cyber Horizon",
    category: "Futurism",
    alt: "Futuristic glowing grid landscape horizon"
  }
];

export default function Home() {
  const [speed, setSpeed] = useState<number>(32);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<CarouselImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleCardClick = (image: CarouselImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-purple-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-zinc-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Layers className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Cylinder3D
            </h1>
            <p className="text-xs text-zinc-400 font-medium">Immersive Spatial Carousel</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Interactive 3D Stage
          </span>
          <Button 
            variant="outline" 
            className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-xs font-medium"
            onClick={() => alert("Explore the 3D cylinder below! Click any card to inspect or use controls to adjust speed.")}
          >
            <Compass className="mr-1.5 h-3.5 w-3.5 text-indigo-400" /> Guide
          </Button>
        </div>
      </header>

      {/* Main Hero & Carousel Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={13} /> Next-Gen CSS 3D Transforms
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Spatial Gallery Experience
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Smooth GPU-accelerated cylindrical perspective rotation. Hover over cards to pause rotation, or click any piece to launch high-resolution modal inspection.
          </p>
        </div>

        {/* 3D Carousel Component Container */}
        <div className="w-full relative py-4">
          <CylinderCarousel
            images={GALLERY_IMAGES}
            animationDuration={isPaused ? 99999 : speed}
            cardWidth={260}
            onCardClick={handleCardClick}
          />
        </div>

        {/* Controls Toolbar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-6 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 px-6 py-4 rounded-2xl shadow-2xl max-w-md w-full mx-auto">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Rotation Speed</span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 text-xs font-medium"
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
              {isPaused ? "Resume" : "Pause"}
            </button>
          </div>
          <div className="w-full flex items-center gap-3">
            <span className="text-xs text-zinc-500 font-mono">Fast</span>
            <Slider
              value={[64 - speed]}
              min={10}
              max={60}
              step={2}
              onValueChange={(val) => setSpeed(64 - val[0])}
              className="cursor-pointer"
            />
            <span className="text-xs text-zinc-500 font-mono">Slow</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} Cylinder3D Showcase. Built with React & Tailwind CSS.</p>
        <MadeWithDyad />
      </footer>

      {/* Featured Item Modal */}
      <FeaturedModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}