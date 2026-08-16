"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedTooltip, AnimatedTooltipVariant } from "@/components/ui/animated-tooltip";
import { cn } from "@/lib/utils";
import { Sparkles, Flame, Utensils, Pizza, Wine, Cake, Coffee, Plus, Check } from "lucide-react";
import { toast } from "sonner";

interface FoodSubItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  variant: AnimatedTooltipVariant;
  calories: number;
  prepTime: string;
}

interface FoodCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  items: FoodSubItem[];
}

const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: "pizzas",
    name: "Artisan Pizzas",
    icon: Pizza,
    tagline: "Wood-fired Napoletana crusts",
    items: [
      {
        id: "pz-1",
        name: "Truffle Bianca Pizza",
        price: 28,
        description: "Fior di latte, black truffle cream, wild forest mushrooms, and 24-month Parmigiano Reggiano.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
        variant: "cora",
        calories: 820,
        prepTime: "18 mins",
      },
      {
        id: "pz-2",
        name: "Spicy Diavola",
        price: 26,
        description: "San Marzano tomatoes, spicy Calabrian salami, nduja sausage, hot honey drizzle, and fresh basil.",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop",
        variant: "smaug",
        calories: 890,
        prepTime: "16 mins",
      },
      {
        id: "pz-3",
        name: "Burrata & Prosciutto",
        price: 30,
        description: "Fresh Pugliese burrata center, San Marzano sauce, 18-month San Daniele prosciutto, and EVOO.",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop",
        variant: "dori",
        calories: 940,
        prepTime: "18 mins",
      },
    ],
  },
  {
    id: "tacos",
    name: "Gourmet Tacos",
    icon: Flame,
    tagline: "Oaxacan corn tortillas & fire salsa",
    items: [
      {
        id: "tc-1",
        name: "Wagyu Carne Asada Tacos",
        price: 24,
        description: "Grilled A5 Wagyu skirt steak, charred avocado salsa verde, pickled red onions, and cotija cheese.",
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800&auto=format&fit=crop",
        variant: "gram",
        calories: 520,
        prepTime: "12 mins",
      },
      {
        id: "tc-2",
        name: "Baja Crispy Fish Tacos",
        price: 22,
        description: "Beer-battered local rockfish, chipotle lime crema, shredded green cabbage, and fresh cilantro.",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop",
        variant: "indis",
        calories: 480,
        prepTime: "12 mins",
      },
    ],
  },
  {
    id: "plates",
    name: "Signature Plates",
    icon: Utensils,
    tagline: "Masterwork entrées & proteins",
    items: [
      {
        id: "pl-1",
        name: "A5 Wagyu Tomahawk",
        price: 145,
        description: "Dry-aged 32oz Tomahawk ribeye with roasted bone marrow and black garlic herb butter.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
        variant: "malva",
        calories: 1450,
        prepTime: "35 mins",
      },
      {
        id: "pl-2",
        name: "Chilean Sea Bass",
        price: 52,
        description: "Miso-glazed sea bass over lemongrass ginger dashi broth and baby bok choy.",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
        variant: "sadoc",
        calories: 540,
        prepTime: "22 mins",
      },
    ],
  },
  {
    id: "desserts",
    name: "Artisan Desserts",
    icon: Cake,
    tagline: "Sweet finales & confections",
    items: [
      {
        id: "ds-1",
        name: "Valrhona Chocolate Sphere",
        price: 22,
        description: "Molten dark chocolate lava, salted caramel, pistachio crumble, and Tahitian vanilla gelato.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
        variant: "cora",
        calories: 520,
        prepTime: "10 mins",
      },
      {
        id: "ds-2",
        name: "Matcha Pistachio Opera",
        price: 20,
        description: "Uji matcha sponge, Sicilian pistachio ganache, dark chocolate glaze, and edible gold leaf.",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
        variant: "dori",
        calories: 460,
        prepTime: "8 mins",
      },
    ],
  },
  {
    id: "drinks",
    name: "Craft Cocktails & Elixirs",
    icon: Wine,
    tagline: "Smoked spirits & botanical spritzes",
    items: [
      {
        id: "dr-1",
        name: "Smoked Rosemary Old Fashioned",
        price: 24,
        description: "Small-batch bourbon infused with orange peel, artisanal bitters, and hickory smoke.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
        variant: "smaug",
        calories: 190,
        prepTime: "5 mins",
      },
      {
        id: "dr-2",
        name: "Golden Yuzu Spritz",
        price: 22,
        description: "Japanese gin, sparkling prosecco, fresh yuzu juice, elderflower, and edible 24k gold flakes.",
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop",
        variant: "indis",
        calories: 160,
        prepTime: "4 mins",
      },
    ],
  },
];

export function InteractiveFoodMenuSection() {
  const [selectedCatId, setSelectedCatId] = useState<string>("pizzas");
  const activeCategory = FOOD_CATEGORIES.find((c) => c.id === selectedCatId) || FOOD_CATEGORIES[0];

  const handleOrder = (itemName: string, price: number) => {
    toast.success(`Added ${itemName} to table order`, {
      description: `$${price.toFixed(2)} &bull; Prepared by Sahara Master Chefs`,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-widest uppercase">
          Interactive Gastronomy Sections
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
          Hover over item names to inspect playful animated tooltip bubbles, or select categories to browse curated submenus.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-neutral-950/85 backdrop-blur-xl p-2 rounded-full border border-orange-500/30 shadow-xl">
        {FOOD_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = cat.id === selectedCatId;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-serif font-bold transition-all duration-300 cursor-pointer",
                isSelected
                  ? "bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-neutral-950 shadow-lg shadow-orange-500/40 scale-105"
                  : "text-neutral-300 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Submenu Runway with Animated Tooltips */}
      <div className="w-full min-h-[440px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCatId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
          >
            {activeCategory.items.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col sm:flex-row items-center gap-4 p-4 rounded-3xl bg-neutral-950/90 backdrop-blur-xl border border-orange-500/30 shadow-[0_15px_35px_rgba(0,0,0,0.8)] hover:border-orange-400 transition-all duration-300"
              >
                <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden shrink-0 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-300 bg-neutral-950/90 px-2 py-0.5 rounded-full border border-orange-500/30">
                    {item.prepTime} &bull; {item.calories} kcal
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-between w-full text-left space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      {/* Animated Tooltip wrapping the item title */}
                      <AnimatedTooltip
                        variant={item.variant}
                        accentColor="#fbbf24"
                        shapeColor="#171312"
                        textColor="#fef3c7"
                        content={
                          <div className="p-1">
                            <p className="font-serif font-bold text-amber-300 text-xs">{item.name}</p>
                            <p className="text-[11px] text-neutral-300 line-clamp-2 mt-0.5 font-light">{item.description}</p>
                          </div>
                        }
                      >
                        <h4 className="text-base sm:text-lg font-serif font-bold text-white group-hover:text-orange-300 transition-colors">
                          {item.name}
                        </h4>
                      </AnimatedTooltip>

                      <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-serif">
                        ${item.price}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-light line-clamp-2 px-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between px-3">
                    <span className="text-[11px] text-orange-300/80 font-serif uppercase tracking-wider">
                      Sahara Master Recipe
                    </span>
                    <button
                      onClick={() => handleOrder(item.name, item.price)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-neutral-950 font-serif font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>ORDER</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}