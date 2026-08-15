"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CarouselImage } from "./CylinderCarousel";
import { Sparkles, ArrowUpRight, Heart } from "lucide-react";

interface FeaturedModalProps {
  image: CarouselImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FeaturedModal({ image, isOpen, onClose }: FeaturedModalProps) {
  const [liked, setLiked] = React.useState(false);

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-white p-0 overflow-hidden rounded-3xl">
        <div className="relative h-72 sm:h-96 w-full">
          <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <button 
            onClick={() => setLiked(!liked)}
            className="absolute top-4 right-4 p-3 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
          >
            <Heart className={liked ? "fill-rose-500 text-rose-500" : "text-white"} size={20} />
          </button>
        </div>
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {image.category || "Featured Gallery"}
            </span>
            <span className="text-xs text-zinc-400">High-Res Visual</span>
          </div>
          <DialogHeader className="text-left space-y-2">
            <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
              {image.title || "Immersive 3D Experience"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-sm sm:text-base">
              Explore immersive spatial curation. Hover over the 3D cylinder to pause rotation, or click any card to inspect high-definition details in true cinematic focus.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6 flex-1 sm:flex-none"
              onClick={() => {
                alert(`Saved "${image.title}" to your inspiration board!`);
                onClose();
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" /> Save to Collection
            </Button>
            <Button 
              variant="outline" 
              className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 rounded-full px-6 flex-1 sm:flex-none"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}