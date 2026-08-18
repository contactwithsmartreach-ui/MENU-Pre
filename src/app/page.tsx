"use client";

import React, { useState } from "react";
import { SaharaButton } from "@/components/restaurant/SaharaButton";
import { 
  UtensilsCrossed, 
  Flame, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  ChevronRight, 
  Heart, 
  ShoppingCart, 
  Search, 
  Menu, 
  X,
  Sparkles,
  Info,
  Calendar,
  Award,
  ArrowRight,
  ShieldCheck,
  Coffee,
  Wine
} from "lucide-react";
import { toast } from "sonner";

export default function RestaurantPage() {
  const [cartCount, setCartCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [reservationModal, setReservationModal] = useState(false);
  const [reservationData, setReservationData] = useState({ name: "", date: "", time: "", guests: "2" });

  const handleAddToCart = (itemName: string) => {
    setCartCount(prev => prev + 1);
    toast.success(`Added ${itemName} to your feast order!`);
  };

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationModal(false);
    toast.success(`Table reserved for ${reservationData.guests} guests on ${reservationData.date}!`);
  };

  const menuItems = [
    {
      id: 1,
      name: "Royal Sahara Mixed Grill",
      category: "mains",
      price: "$48.00",
      description: "Sizzling platter of succulent lamb chops, shish tawook, kofta kebab, and marinated prawns infused with saffron & Moroccan spices.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
      badge: "Chef's Signature",
      rating: 4.9
    },
    {
      id: 2,
      name: "Slow-Braised Lamb Tagine",
      category: "mains",
      price: "$36.00",
      description: "Tender lamb shank simmered for 6 hours in earthenware with honey-glazed apricots, toasted almonds, and fragrant ras el hanout.",
      image: "https://images.unsplash.com/photo-1514944298352-f4d7321151d6?auto=format&fit=crop&q=80&w=800",
      badge: "Traditional",
      rating: 4.8
    },
    {
      id: 3,
      name: "Golden Saffron Couscous Royale",
      category: "mains",
      price: "$28.00",
      description: "Hand-rolled steamed semolina infused with saffron broth, crowned with caramelized onions, chickpeas, and seasonal root vegetables.",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800",
      badge: "Vegetarian",
      rating: 4.7
    },
    {
      id: 4,
      name: "Crispy Falafel & Hummus Velvet",
      category: "starters",
      price: "$16.00",
      description: "Herbed chickpea fritters served over silky tahini garlic hummus, drizzled with pomegranate molasses and pine nuts.",
      image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=800",
      badge: "Popular",
      rating: 4.9
    },
    {
      id: 5,
      name: "Spiced Harissa Prawns",
      category: "starters",
      price: "$22.00",
      description: "Wild-caught jumbo prawns sautéed in fiery Moroccan harissa butter, garlic confit, and fresh cilantro.",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800",
      badge: "Spicy",
      rating: 4.8
    },
    {
      id: 6,
      name: "Damascus Pistachio Baklava",
      category: "desserts",
      price: "$14.00",
      description: "Layers of crisp phyllo pastry stuffed with crushed Syrian pistachios and drenched in orange blossom honey syrup.",
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800",
      badge: "Sweet",
      rating: 5.0
    }
  ];

  const filteredMenu = activeTab === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-red-600 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-red-950 via-orange-950 to-amber-950 text-amber-200 text-xs py-2 px-4 text-center font-medium tracking-wider flex items-center justify-center gap-2 border-b border-amber-900/40">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Experience the magic of North African & Middle Eastern culinary heritage. Book your feast today!</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      </div>

      {/* Spotlight Navbar - Moved further down in page hierarchy or designed as floating */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-stone-950/80 border-b border-stone-800/80 shadow-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30">
              <Flame className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold tracking-wider bg-gradient-to-r from-amber-200 via-orange-400 to-red-500 bg-clip-text text-transparent">
                SAHARA
              </span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-amber-400/80">Spice & Grill</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide text-stone-300">
            <a href="#hero" className="hover:text-amber-400 transition-colors">Home</a>
            <a href="#about" className="hover:text-amber-400 transition-colors">Our Story</a>
            <a href="#menu" className="hover:text-amber-400 transition-colors">Menu</a>
            <a href="#experience" className="hover:text-amber-400 transition-colors">Experience</a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCartCount(prev => prev + 1)}
              aria-label="Cart items"
              className="relative p-2.5 rounded-full bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-stone-300 hover:text-amber-400 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setReservationModal(true)}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium text-sm shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Table</span>
            </button>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
              className="md:hidden p-2.5 rounded-full bg-stone-900 border border-stone-800 text-stone-300"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-stone-900 border-b border-stone-800 px-6 py-6 space-y-4 animate-fadeIn">
            <a href="#hero" onClick={() => setIsMenuOpen(false)} className="block text-stone-200 hover:text-amber-400 font-medium">Home</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="block text-stone-200 hover:text-amber-400 font-medium">Our Story</a>
            <a href="#menu" onClick={() => setIsMenuOpen(false)} className="block text-stone-200 hover:text-amber-400 font-medium">Menu</a>
            <a href="#experience" onClick={() => setIsMenuOpen(false)} className="block text-stone-200 hover:text-amber-400 font-medium">Experience</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block text-stone-200 hover:text-amber-400 font-medium">Contact</a>
            <button
              onClick={() => { setIsMenuOpen(false); setReservationModal(true); }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium text-center shadow-lg"
            >
              Reserve Table
            </button>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-stone-950 px-4 py-20">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=2000" 
            alt="Sahara Feast" 
            className="w-full h-full object-cover scale-105 animate-pulse duration-10000"
          />
        </div>

        <div className="relative z-20 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs tracking-widest uppercase backdrop-blur-md">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Award-Winning Desert Fine Dining</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-white leading-none">
            Flavors of the <br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Golden Sahara
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-stone-300 text-base sm:text-xl font-light leading-relaxed">
            Immerse your senses in aromatic spices, wood-fired grills, and centuries of North African culinary tradition crafted with modern elegance.
          </p>
        </div>
      </section>

      {/* SaharaButton Placed EXACTLY Below the Hero Section */}
      <div className="relative z-35 -mt-8 flex justify-center pb-12">
        <SaharaButton 
          primaryText="WELCOME" 
          hoverText="SAHARA" 
          size="lg" 
          onClick={() => {
            const menuEl = document.getElementById("menu");
            if (menuEl) menuEl.scrollIntoView({ behavior: "smooth" });
            toast.success("Welcome to Sahara! Explore our authentic menu below.");
          }}
        />
      </div>

      {/* Spotlight Navbar Secondary / Quick Info Bar (Moved further down as requested) */}
      <div id="experience" className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-r from-stone-900 via-stone-900/90 to-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-stone-800">
            <div className="flex items-center gap-4 pt-4 md:pt-0">
              <div className="p-3 rounded-2xl bg-red-600/10 text-red-500 border border-red-500/20">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-200">Opening Hours</h3>
                <p className="text-sm text-stone-400">Tue - Sun: 5:00 PM - 11:30 PM</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8">
              <div className="p-3 rounded-2xl bg-amber-600/10 text-amber-500 border border-amber-500/20">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-200">Location</h3>
                <p className="text-sm text-stone-400">742 Oasis Boulevard, Medina District</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8">
              <div className="p-3 rounded-2xl bg-orange-600/10 text-orange-500 border border-orange-500/20">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-200">Direct Line</h3>
                <p className="text-sm text-stone-400">+1 (800) 555-SAHARA</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8">
              <div className="p-3 rounded-2xl bg-yellow-600/10 text-yellow-500 border border-yellow-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-200">Michelin Guide</h3>
                <p className="text-sm text-stone-400">Recommended 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Culinary Heritage</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              A Symphony of Fire, Spice & Ancient Tradition
            </h2>
            <p className="text-stone-300 leading-relaxed">
              Founded by Chef Tariq Al-Mansoor, Sahara brings the soulful flavors of Moroccan spice markets, Egyptian bazaars, and Levantine hearths to your table. Every dish is seasoned with hand-ground spices imported directly from Marrakech and slow-cooked in authentic clay tagines.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="border-l-2 border-red-500 pl-4">
                <h4 className="font-serif font-bold text-2xl text-amber-300">100%</h4>
                <p className="text-sm text-stone-400">Authentic Imported Spices</p>
              </div>
              <div className="border-l-2 border-amber-500 pl-4">
                <h4 className="font-serif font-bold text-2xl text-amber-300">35+</h4>
                <p className="text-sm text-stone-400">Secret Family Recipes</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <img 
                src="https://images.unsplash.com/photo-1514944298352-f4d7321151d6?auto=format&fit=crop&q=80&w=600" 
                alt="Tagine" 
                className="rounded-2xl shadow-2xl object-cover h-64 w-full"
              />
              <img 
                src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600" 
                alt="Mezze" 
                className="rounded-2xl shadow-2xl object-cover h-48 w-full"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img 
                src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600" 
                alt="Grill" 
                className="rounded-2xl shadow-2xl object-cover h-48 w-full"
              />
              <img 
                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=600" 
                alt="Dessert" 
                className="rounded-2xl shadow-2xl object-cover h-64 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 bg-stone-900/50 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs uppercase tracking-widest">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Exquisite Selections</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white">The Sahara Feast Menu</h2>
            <p className="text-stone-400 max-w-xl mx-auto">Explore our masterfully curated dishes prepared over open flames and seasoned with aromatic desert spices.</p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { id: "all", label: "Full Menu" },
              { id: "starters", label: "Starters & Mezze" },
              { id: "mains", label: "Tagines & Grills" },
              { id: "desserts", label: "Sweet Endings" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-600/30 scale-105"
                    : "bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenu.map(item => (
              <div 
                key={item.id}
                className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden group hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-amber-300 text-xs font-medium border border-amber-500/30">
                      {item.badge}
                    </div>
                    <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-amber-400 text-xs font-bold flex items-center gap-1 border border-amber-500/30">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-serif font-bold text-xl text-white group-hover:text-amber-400 transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-amber-400 font-bold text-lg">{item.price}</span>
                    </div>
                    <p className="text-stone-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleAddToCart(item.name)}
                    className="w-full py-3 rounded-xl bg-stone-800 hover:bg-gradient-to-r hover:from-red-600 hover:to-orange-600 text-stone-200 hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md group/btn"
                  >
                    <ShoppingCart className="w-4 h-4 text-amber-400 group-hover/btn:text-white transition-colors" />
                    <span>Add to Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation Modal */}
      {reservationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-8 shadow-2xl relative animate-fadeIn">
            <button 
              onClick={() => setReservationModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-red-600/10 text-red-500 border border-red-500/20 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-white">Reserve Your Table</h3>
                <p className="text-sm text-stone-400">Join us for an unforgettable culinary journey.</p>
              </div>

              <form onSubmit={handleReservation} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Tariq Al-Mansoor"
                    value={reservationData.name}
                    onChange={e => setReservationData({...reservationData, name: e.target.value})}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-stone-200 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Date</label>
                    <input 
                      type="date" 
                      required
                      value={reservationData.date}
                      onChange={e => setReservationData({...reservationData, date: e.target.value})}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-stone-200 focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Time</label>
                    <input 
                      type="time" 
                      required
                      value={reservationData.time}
                      onChange={e => setReservationData({...reservationData, time: e.target.value})}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-stone-200 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">Number of Guests</label>
                  <select 
                    value={reservationData.guests}
                    onChange={e => setReservationData({...reservationData, guests: e.target.value})}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-stone-200 focus:border-amber-500 outline-none"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests (Couples Table)</option>
                    <option value="4">4 Guests (Family Table)</option>
                    <option value="6">6+ Guests (Private Feast)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02] transition-all"
                >
                  Confirm Reservation
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer id="contact" className="bg-stone-950 border-t border-stone-900 py-16 text-stone-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center">
                <Flame className="w-4 h-4 text-stone-950" />
              </div>
              <span className="text-xl font-serif font-bold tracking-wider text-white">SAHARA</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Authentic North African dining experience celebrating spice, hospitality, and generational culinary artistry.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-white mb-4 tracking-wider text-xs uppercase">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#hero" className="hover:text-amber-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-amber-400 transition-colors">Our Story</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition-colors">Feast Menu</a></li>
              <li><a href="#experience" className="hover:text-amber-400 transition-colors">Experience</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-white mb-4 tracking-wider text-xs uppercase">Contact & Location</h4>
            <ul className="space-y-2 text-xs">
              <li>742 Oasis Boulevard, Medina District</li>
              <li>Phone: +1 (800) 555-SAHARA</li>
              <li>Email: feast@saharagrill.com</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif font-bold text-white mb-4 tracking-wider text-xs uppercase">Newsletter</h4>
            <p className="text-xs text-stone-500">Subscribe for secret tasting menus and seasonal events.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none w-full"
              />
              <button 
                onClick={() => toast.success("Subscribed successfully!")}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl text-xs font-medium"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-stone-900 text-center text-xs text-stone-600">
          © {new Date().getFullYear()} Sahara Spice & Grill. All rights reserved.
        </div>
      </footer>
    </div>
  );
}