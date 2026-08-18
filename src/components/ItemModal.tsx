"use client";

import React, { useState } from 'react';
import { MenuItem3D } from '../data/menu3dItems';
import { X, Heart, ShoppingBag, Download, Check, Sparkles, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ItemModalProps {
  item: MenuItem3D | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  isInCart: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCart: (id: string) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  item,
  isOpen,
  onClose,
  isFavorite,
  isInCart,
  onToggleFavorite,
  onToggleCart,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen || !item) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      toast.success(`Successfully downloaded ${item.title}`);
      setTimeout(() => setDownloaded(false), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative bg-muted flex items-center justify-center p-6 min-h-[300px] md:min-h-[450px]">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-contain max-h-[400px] rounded-xl shadow-lg"
          />
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white">
              {item.tag}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              item.badge === 'Premium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
            }`}>
              {item.badge}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Magnific 3D Collection - {item.category}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{item.title}</h2>

            <p className="text-muted-foreground text-sm leading-relaxed">
              High-quality 3D render asset grabbed directly from Magnific 3D menu collection. Perfect for modern web design, restaurant menu interfaces, digital marketing banners, and immersive UI projects.
            </p>

            <div className="py-4 border-y border-border space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Source URL:</span>
                <a 
                  href="https://www.magnific.com/free-photos-vectors/3d-menu/3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Magnific 3D Menu #3</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Format:</span>
                <span className="font-medium">High-Res Image / PSD Vector</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">License:</span>
                <span className="font-medium">{item.badge} Asset</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                {downloaded ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                <span>{downloading ? 'Preparing Asset...' : downloaded ? 'Downloaded!' : 'Download 3D Asset'}</span>
              </button>

              <button
                onClick={() => onToggleFavorite(item.id)}
                className={`p-3 rounded-xl border border-border transition-all flex items-center justify-center ${
                  isFavorite ? 'bg-rose-500 text-white border-rose-500' : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
                title="Favorite"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => {
                onToggleCart(item.id);
                toast(isInCart ? "Removed from collection" : "Added to collection");
              }}
              className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm border transition-all flex items-center justify-center gap-2 ${
                isInCart 
                  ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 border-purple-300 dark:border-purple-800' 
                  : 'bg-muted/50 hover:bg-muted text-foreground border-border'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isInCart ? 'Remove from My Collection' : 'Add to My Collection'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};