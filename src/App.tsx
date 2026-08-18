"use client";

import React, { useState, useMemo } from 'react';
import { menu3DItems, MenuItem3D } from './data/menu3dItems';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ItemCard } from './components/ItemCard';
import { ItemModal } from './components/ItemModal';
import { Sparkles, Filter, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { Toaster } from 'sonner';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<MenuItem3D | null>(null);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(menu3DItems.map(item => item.category))];
    return cats;
  }, []);

  const filteredItems = useMemo(() => {
    return menu3DItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(itemKey => itemKey !== id) : [...prev, id]
    );
  };

  const handleToggleCart = (id: string) => {
    setCart(prev => 
      prev.includes(id) ? prev.filter(itemKey => itemKey !== id) : [...prev, id]
    );
  };

  const scrollToContent = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      <Toaster position="bottom-right" richColors />
      
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.length}
        cartCount={cart.length}
      />

      <HeroBanner onExplore={scrollToContent} />

      <main id="catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Scraped via Chrome DevTools</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">3D Menu Assets & Vectors</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Showing {filteredItems.length} realistic 3D objects from Magnific 3D menu collection
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
            <h3 className="text-lg font-semibold mb-2">No 3D objects found</h3>
            <p className="text-sm text-muted-foreground mb-4">Try searching with a different keyword or category.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-4 py-2 rounded-full bg-purple-600 text-white text-xs font-semibold shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                isFavorite={favorites.includes(item.id)}
                isInCart={cart.includes(item.id)}
                onToggleFavorite={handleToggleFavorite}
                onToggleCart={handleToggleCart}
                onPreview={(it) => setPreviewItem(it)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card py-8 px-4 sm:px-6 lg:px-8 mt-16 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Magnific 3D Showcase. Assets extracted via Chrome DevTools.</p>
          <div className="flex items-center gap-4">
            <a href="https://www.magnific.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">
              Magnific Home
            </a>
            <a href="https://www.magnific.com/free-photos-vectors/3d-menu/3" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">
              Original Collection
            </a>
          </div>
        </div>
      </footer>

      <ItemModal
        item={previewItem}
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        isFavorite={previewItem ? favorites.includes(previewItem.id) : false}
        isInCart={previewItem ? cart.includes(previewItem.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onToggleCart={handleToggleCart}
      />
    </div>
  );
}