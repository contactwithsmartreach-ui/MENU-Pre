"use client";

import React, { useState } from 'react';
import { MenuItem3D } from '../data/menu3dItems';
import { Heart, ShoppingBag, Eye, Download, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ItemCardProps {
  item: MenuItem3D;
  isFavorite: boolean;
  isInCart: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCart: (id: string) => void;
  onPreview: (item: MenuItem3D) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isFavorite,
  isInCart,
  onToggleFavorite,
  onToggleCart,
  onPreview,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      toast.success(`Downloaded asset: ${item.title}`);
      setTimeout(() => setDownloaded(false), 3000);
    }, 1000);
  };

  return (
    <div 
      onClick={() => onPreview(item)}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(item);
            }}
            className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-black text-xs font-semibold flex items-center gap-1.5 shadow-md backdrop-blur-sm transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview 3D</span>
          </button>
          
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-black shadow-md backdrop-blur-sm transition-all"
            title="Download Asset"
          >
            {downloaded ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
          </button>
        </div>

        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            item.badge === 'Premium' 
              ? 'bg-amber-500 text-white shadow-sm' 
              : 'bg-emerald-500 text-white shadow-sm'
          }`}>
            {item.badge}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/60 backdrop-blur-md text-white">
            {item.tag}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
            toast(isFavorite ? "Removed from favorites" : "Added to favorites");
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFavorite 
              ? 'bg-rose-500 text-white' 
              : 'bg-black/40 text-white hover:bg-black/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">
            {item.category}
          </div>
          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-purple-600 transition-colors">
            {item.title}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">Magnific 3D Asset</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCart(item.id);
              toast(isInCart ? "Removed from collection list" : "Added to collection list");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              isInCart 
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20' 
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isInCart ? 'Collected' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};