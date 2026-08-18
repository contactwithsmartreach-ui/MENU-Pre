"use client";

import React, { useState, useEffect } from "react";
import { MenuItem } from "@/types/restaurant";
import { CombinedCylinderMenu } from "./CombinedCylinderMenu";
import { Loader2 } from "lucide-react";

interface LazyCylinderWrapperProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
}

export function LazyCylinderWrapper({ items, onSelectItem }: LazyCylinderWrapperProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="text-xs font-serif uppercase tracking-widest text-neutral-600">
            Preparing 3D Gastronomy...
          </span>
        </div>
      </div>
    );
  }

  return <CombinedCylinderMenu items={items} onSelectItem={onSelectItem} />;
}