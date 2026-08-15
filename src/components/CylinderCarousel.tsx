"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CarouselImage {
  src: string;
  alt?: string;
  title?: string;
  category?: string;
}

export interface CylinderCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: CarouselImage[];
  containerClassName?: string;
  cardClassName?: string;
  animationDuration?: number; // in seconds
  cardWidth?: number; // in pixels
  onCardClick?: (image: CarouselImage, index: number) => void;
}

export const CylinderCarousel = React.forwardRef<HTMLDivElement, CylinderCarouselProps>(
  (
    {
      images,
      className,
      containerClassName,
      cardClassName,
      animationDuration = 32,
      cardWidth = 260,
      onCardClick,
      ...props
    },
    ref
  ) => {
    const N = images.length;
    
    const customStyle = {
      "--n": N,
      "--w": `${cardWidth}px`,
      "--ba": `calc(1turn / var(--n))`,
      "--anim-dur": `${animationDuration}s`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn(
          "w-full h-[550px] sm:h-[650px] grid place-items-center overflow-hidden relative select-none",
          className
        )}
        style={{
          perspective: "50em",
          maskImage: "linear-gradient(90deg, transparent, #000 15% 85%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 15% 85%, transparent)",
        }}
        {...props}
      >
        <div
          className={cn(
            "grid place-items-center [transform-style:preserve-3d] cursor-grab active:cursor-grabbing hover:[animation-play-state:paused]",
            containerClassName
          )}
          style={{
            ...customStyle,
            animation: "ry var(--anim-dur) linear infinite",
          }}
        >
          <style>
            {`
              @keyframes ry {
                to { transform: rotateY(1turn); }
              }
            `}
          </style>
          
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => onCardClick?.(img, i)}
              className={cn(
                "[grid-area:1/1] relative group rounded-2xl overflow-hidden [backface-visibility:hidden] shadow-2xl transition-transform duration-300 hover:scale-105 border border-white/10 bg-black/40",
                cardClassName
              )}
              style={{
                width: "var(--w)",
                aspectRatio: "3/4",
                "--i": i,
                transform: "rotateY(calc(var(--i) * var(--ba))) translateZ(calc(-1 * (0.5 * var(--w) + 1.5em) / tan(0.5 * var(--ba))))",
              } as React.CSSProperties}
            >
              <img
                src={img.src}
                alt={img.alt || `Carousel image ${i}`}
                className="w-full h-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
                {img.category && (
                  <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-1">
                    {img.category}
                  </span>
                )}
                {img.title && (
                  <h3 className="text-lg font-bold tracking-tight text-white/95">
                    {img.title}
                  </h3>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

CylinderCarousel.displayName = "CylinderCarousel";