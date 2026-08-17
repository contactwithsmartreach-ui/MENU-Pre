"use client";

import React, { useState } from "react";
import OptionWheel from "./OptionWheel";
import { MenuItem } from "@/types/restaurant";
import { Badge } from "@/components/ui/badge";
import { Star, Flame, Sparkles, Eye } from "lucide-react";

export interface CuisineCategory {
  title: string;
  tagline: string;
  description: string;
  dishes: MenuItem[];
}

const CUISINE_CATEGORIES: CuisineCategory[] = [
  {
    title: "Artisanal Wood-Fired",
    tagline: "Oak & Cherry Charcoal Sear",
    description: "Smoked cuts and flame-kissed delicacies grilled over imported binchotan and aromatic fruitwood.",
    dishes: [
      {
        id: "curve-dish-1",
        name: "Prime Smoked Tomahawk",
        category: "Chef Specials",
        price: 95,
        description: "Dry-aged 35oz Bone-in Prime Ribeye basted with smoked bone marrow butter and roasted shallots.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
        prepTime: "30 mins",
        calories: 940,
        rating: 5.0,
        reviewsCount: 184,
        tags: ["Wood-Fired", "A5 Prime", "Shareable"],
        isSignature: true,
      },
      {
        id: "curve-dish-2",
        name: "Charred Iberico Pork",
        category: "Chef Specials",
        price: 50,
        description: "Spanish acorn-fed Iberico pork pluma cut, smoked romesco sauce, and grilled baby leeks.",
        image: "https://images.unsplash.com/photo-1514944298350-01967262446f?q=80&w=800&auto=format&fit=crop",
        prepTime: "22 mins",
        calories: 710,
        rating: 4.9,
        reviewsCount: 112,
        tags: ["Wood-Fired", "Artisan"],
        isSignature: true,
      },
    ],
  },
  {
    title: "Pacific Crudo & Raw",
    tagline: "Wild Ocean Catch & Sashimi",
    description: "Line-caught Pacific sashimi, Hokkaido scallops, and chilled crudo paired with citrus ponzu and caviar.",
    dishes: [
      {
        id: "curve-dish-3",
        name: "Truffle Bluefin Otoro",
        category: "Starters",
        price: 42,
        description: "Fatty bluefin tuna belly, shaved white Alba truffle, pickled wasabi pearls, and yuzu drizzle.",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop",
        prepTime: "12 mins",
        calories: 340,
        rating: 5.0,
        reviewsCount: 204,
        tags: ["Raw Bar", "Bluefin", "Truffle"],
        isSignature: true,
      },
      {
        id: "curve-dish-4",
        name: "King Salmon Carpaccio",
        category: "Starters",
        price: 34,
        description: "Ora King salmon ribbons, compressed cucumber, finger lime caviar, and cold-pressed shiso oil.",
        image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=800&auto=format&fit=crop",
        prepTime: "10 mins",
        calories: 310,
        rating: 4.8,
        reviewsCount: 89,
        tags: ["Raw Bar", "Gluten-Free"],
      },
    ],
  },
  {
    title: "Handmade Pasta Craft",
    tagline: "Extruded & Rolled Daily",
    description: "Traditional Italian pasta sheets rolled by hand and tossed with rich butter emulsions, morels, and seafood.",
    dishes: [
      {
        id: "curve-dish-5",
        name: "Squid Ink Lobster Tagliolini",
        category: "Mains",
        price: 52,
        description: "Handcrafted squid ink pasta strands, butter-poached Maine lobster tail, and saffron velouté.",
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop",
        prepTime: "18 mins",
        calories: 660,
        rating: 4.9,
        reviewsCount: 162,
        tags: ["Handmade Pasta", "Seafood"],
        isSignature: true,
      },
      {
        id: "curve-dish-6",
        name: "Wild Truffle Agnolotti",
        category: "Mains",
        price: 44,
        description: "Pillow ravioli filled with fontina and sweet corn puree, glazed in brown butter and summer truffles.",
        image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?q=80&w=800&auto=format&fit=crop",
        prepTime: "16 mins",
        calories: 590,
        rating: 4.9,
        reviewsCount: 130,
        tags: ["Handmade Pasta", "Vegetarian"],
        isVegetarian: true,
      },
    ],
  },
  {
    title: "Gourmet Plant & Earth",
    tagline: "Organic Botanicals & Foraged Fungi",
    description: "Elevated farm-to-table culinary creations highlighting seasonal heirloom produce and rare foraged mushrooms.",
    dishes: [
      {
        id: "curve-dish-7",
        name: "Smoked Maitake Steak",
        category: "Mains",
        price: 36,
        description: "Cast-iron roasted maitake mushroom cluster, parsnip silk cream, toasted pine nuts, and herb salsa verde.",
        image: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?q=80&w=800&auto=format&fit=crop",
        prepTime: "15 mins",
        calories: 410,
        rating: 4.8,
        reviewsCount: 97,
        tags: ["Plant-Based", "Organic", "Vegan"],
        isVegetarian: true,
      },
    ],
  },
  {
    title: "Molecular Confections",
    tagline: "Avant-Garde Dessert Artistry",
    description: "Sweet finales crafted with liquid nitrogen, spun sugar glass, smoked cacao, and exotic botanical infusions.",
    dishes: [
      {
        id: "curve-dish-8",
        name: "Liquid Gold Valrhona Orb",
        category: "Desserts",
        price: 28,
        description: "72% Grand Cru Valrhona chocolate dome melted tableside with hot salted bourbon caramel, gold leaf crumbles.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
        prepTime: "10 mins",
        calories: 540,
        rating: 5.0,
        reviewsCount: 245,
        tags: ["Molecular", "House Specialty"],
        isSignature: true,
        isVegetarian: true,
      },
    ],
  },
  {
    title: "Smoked Alchemy Elixirs",
    tagline: "Botanical & Smoked Spirits",
    description: "Multi-sensory cocktails infused with charred rosemary smoke, rare agave distillates, and 24k gold leaf flakes.",
    dishes: [
      {
        id: "curve-dish-9",
        name: "Volcanic Smoke Mezcalita",
        category: "Cocktails",
        price: 26,
        description: "Aged artisanal Mezcal, smoked organic hibiscus nectar, fresh blood orange juice, and Hawaiian black salt.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
        prepTime: "5 mins",
        calories: 195,
        rating: 4.9,
        reviewsCount: 178,
        tags: ["Smoked", "Artisanal Mezcal"],
        isSignature: true,
      },
    ],
  },
];

interface CurvedFoodExperienceProps {
  onSelectDish: (dish: MenuItem) => void;
}

export function CurvedFoodExperience({ onSelectDish }: CurvedFoodExperienceProps) {
  const [selectedCuisineIdx, setSelectedCuisineIdx] = useState(0);

  const cuisineTitles = CUISINE_CATEGORIES.map((c) => c.title);
  const activeCategory = CUISINE_CATEGORIES[selectedCuisineIdx] || CUISINE_CATEGORIES[0];

  return (
    <section className="relative z-20 w-full max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-8">
      {/* Spatial Section Header */}
      <div className="text-center space-y-3 mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-950/80 border border-orange-500/30 text-orange-300 text-xs font-serif uppercase tracking-widest backdrop-blur-md shadow-lg shadow-orange-500/10">
          <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>Spatial 3D Curve Experience</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-amber-200">
          Curated Culinary Spectrum
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto font-light">
          Drag or roll through the spatial curved wheel to uncover chef-crafted tasting profiles and signature preparations.
        </p>
      </div>

      {/* Spatial Grid: Left 3D Curve Wheel, Right Glassy Dish Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: 3D OptionWheel Curve Picker */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start relative">
          <div className="w-full relative rounded-3xl bg-neutral-950/60 border border-orange-500/20 backdrop-blur-2xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden">
            {/* Ambient Radial Spotlight */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-red-600/20 via-orange-500/15 to-transparent blur-2xl" />

            <div className="flex items-center justify-between border-b border-orange-500/20 pb-3 mb-2 px-2">
              <span className="text-xs font-serif uppercase tracking-widest text-orange-300/80">
                Drag / Scroll Option Wheel
              </span>
              <span className="text-xs font-mono text-orange-400">
                {selectedCuisineIdx + 1} / {cuisineTitles.length}
              </span>
            </div>

            {/* OptionWheel Spatial Picker */}
            <OptionWheel
              items={cuisineTitles}
              defaultSelected={0}
              textColor="#737373"
              activeColor="#fbbf24"
              side="left"
              fontSize={2.1}
              spacing={1.3}
              curve={1}
              tilt={6}
              blur={2}
              fade={0.25}
              smoothing={200}
              inset={80}
              loop={false}
              draggable={true}
              soundVolume={0.4}
              onChange={(index) => setSelectedCuisineIdx(index)}
              className="h-[340px] sm:h-[400px]"
            />
          </div>
        </div>

        {/* Right: Spatial Cards Showcase for Active Selected Cuisine */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          <div className="space-y-2 border-l-2 border-orange-500/60 pl-4">
            <span className="text-xs font-serif uppercase tracking-widest text-orange-400">
              {activeCategory.tagline}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {activeCategory.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              {activeCategory.description}
            </p>
          </div>

          {/* Dishes Showcase Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeCategory.dishes.map((dish) => (
              <div
                key={dish.id}
                onClick={() => onSelectDish(dish)}
                className="group relative rounded-2xl bg-neutral-950/80 border border-orange-500/30 overflow-hidden cursor-pointer transition-all duration-300 hover:border-orange-400 hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(249,115,22,0.35)] flex flex-col justify-between"
              >
                {/* Dish Media */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />

                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {dish.isSignature && (
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-serif uppercase tracking-wider text-[10px] px-2 py-0.5 border-0">
                        <Flame className="w-3 h-3 mr-1 fill-amber-200" />
                        Signature
                      </Badge>
                    )}
                  </div>

                  <div className="absolute bottom-2 right-3 flex items-center gap-1 bg-neutral-950/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-orange-500/30 text-amber-300 text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{dish.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-white text-base group-hover:text-orange-300 transition-colors">
                      {dish.name}
                    </h4>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1 font-light">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-orange-500/20 flex items-center justify-between">
                    <span className="text-lg font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                      ${dish.price}
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-serif font-bold tracking-wider uppercase flex items-center gap-1 shadow-md group-hover:scale-105 transition-transform"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Order</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}