"use client";

import React, { useState } from "react";
import { SaharaButton } from "@/components/restaurant/SaharaButton";
import { Utensils, Flame, Sparkles, MapPin, Phone, Clock, Star, ChevronRight, ShoppingBag, Heart, Menu, X, ArrowRight } from "lucide-react";

export default function Page() {
  const [cartCount, setCartCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reserved, setReserved] = useState(false);

  const menuItems = [
    { id: 1, name: "Royal Lamb Tagine", category: "main", price: "$32", rating: 4.9, desc: "Slow-cooked tender lamb with saffron, apricots, almonds, and warm Moroccan spices.", image: "https://images.unsplash.com/photo-1545247389-d2eca298406e?q=80&w=800&auto=format&fit=crop" },
    { id: 2, name: "Saffron Seafood Couscous", category: "main", price: "$36", rating: 4.8, desc: "Hand-rolled semolina steamed with aromatic broth, topped with fresh catch of the day, prawns, and mussels.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop" },
    { id: 3, name: "Crispy Bastilla", category: "starter", price: "$18", rating: 5.0, desc: "Flaky layered phyllo pastry filled with spiced shredded chicken, toasted almonds, dusted with cinnamon and powdered sugar.", image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop" },
    { id: 4, name: "Harissa Honey Glazed Quail", category: "starter", price: "$22", rating: 4.7, desc: "Flame-kissed quail glazed with artisanal wildflower honey and fiery house harissa paste.", image: "https://images.unsplash.com/photo-1514944298352-f4d732112d8d?q=80&w=800&auto=format&fit=crop" },
    { id: 5, name: "Moroccan Mint Tea & Baklava", category: "dessert", price: "$12", rating: 4.9, desc: "Traditional ceremonial poured green tea with fresh mint alongside honey-soaked pistachio pastries.", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop" },
    { id: 6, name: "Orange Blossom Panna Cotta", category: "dessert", price: "$14", rating: 4.8, desc: "Silky cream infused with orange blossom water, topped with pomegranate seeds and crushed pistachios.", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop" },
  ];

  const filteredItems = activeTab === "all" ? menuItems : menuItems.filter(i => i.category === activeTab);

  return (
    <div className="min-h-screen bg-[#0d0907] text-[#fbf7f0] font-sans selection:bg-orange-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0907]/90 backdrop-blur-md border-b border-orange-950/40 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-600/30">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-serif font-bold text-xl tracking-wider bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">SAHARA</span>
            <span className="block text-[10px] tracking-[0.3em] text-orange-200/60 uppercase">Dukes & Feasts</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase text-orange-100/80">
          <a href="#about" className="hover:text-orange-400 transition-colors">About</a>
          <a href="#menu" className="hover:text-orange-400 transition-colors">Menu</a>
          <a href="#experience" className="hover:text-orange-400 transition-colors">Experience</a>
          <a href="#contact" className="hover:text-orange-400 transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setCartCount(c => c + 1)} className="relative p-2.5 rounded-full bg-orange-950/40 border border-orange-800/40 hover:bg-orange-900/40 transition-all text-orange-200">
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-[10px] font-bold flex items-center justify-center text-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg bg-orange-950/40 text-orange-200">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0d0907]/98 pt-28 px-8 flex flex-col gap-6 md:hidden text-center">
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif tracking-widest text-orange-200">About</a>
          <a href="#menu" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif tracking-widest text-orange-200">Menu</a>
          <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif tracking-widest text-orange-200">Experience</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif tracking-widest text-orange-200">Contact</a>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative min-h-[90vh] flex items-center justify-center px-6 pt-28 pb-16 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/40 via-[#0d0907] to-[#0d0907]">
        {/* Background atmospheric glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-red-600/20 to-orange-500/25 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-950/50 border border-orange-800/40 text-orange-300 text-xs tracking-[0.25em] uppercase mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>An Oasis of Fine Dining</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1] bg-gradient-to-b from-white via-orange-100 to-orange-400 bg-clip-text text-transparent">
            Tastes of the <br />
            <span className="italic font-normal bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">Golden Dunes</span>
          </h1>

          <p className="max-w-xl text-orange-200/70 text-base md:text-lg mb-10 leading-relaxed font-light">
            Immerse your senses in authentic spices, majestic ambiance, and legendary culinary heritage crafted under the starlit desert sky.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <a href="#menu" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 font-serif tracking-widest text-sm uppercase shadow-xl shadow-red-900/40 transition-all flex items-center justify-center gap-2 group">
              <span>Explore Feast</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-orange-950/40 hover:bg-orange-900/50 border border-orange-800/50 font-serif tracking-widest text-sm uppercase text-orange-200 transition-all">
              Reserve Table
            </a>
          </div>
        </div>
      </header>

      {/* SaharaButton moved cleanly right below the hero section */}
      <section className="py-12 bg-[#0a0705] border-y border-orange-950/50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.06)_0%,_transparent_70%)] pointer-events-none" />
        <div className="text-center mb-6 relative z-10">
          <p className="text-xs uppercase tracking-[0.3em] text-orange-400/80 mb-2">Step Into Luxury</p>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-orange-100">Begin Your Sahara Journey</h3>
        </div>
        <div className="relative z-15 py-4">
          <SaharaButton 
            primaryText="WELCOME" 
            hoverText="SAHARA" 
            size="lg" 
            onClick={() => {
              const menuEl = document.getElementById("menu");
              menuEl?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 lg:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-red-600/20 to-orange-500/20 rounded-3xl blur-2xl -z-10" />
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop" 
            alt="Restaurant Interior" 
            className="rounded-2xl object-cover w-full h-[480px] shadow-2xl border border-orange-950/60"
          />
          <div className="absolute -bottom-8 -right-8 bg-[#140f0c] border border-orange-900/50 p-6 rounded-2xl shadow-2xl hidden sm:block max-w-xs">
            <div className="flex items-center gap-1 text-orange-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-orange-400" />
              ))}
            </div>
            <p className="text-xs text-orange-100/80 italic font-serif">"An unmatched culinary voyage through fragrant spices and timeless hospitality."</p>
            <span className="block mt-2 text-[10px] uppercase tracking-widest text-orange-400/60">— Michelin Guide Review</span>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/40 border border-orange-800/30 text-orange-300 text-xs tracking-widest uppercase mb-4">
            <Utensils className="w-3 h-3" />
            <span>Heritage & Passion</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Tradition Reborn in Every Spiced Creation
          </h2>
          <p className="text-orange-200/70 mb-6 leading-relaxed font-light">
            Founded by master chefs from Marrakesh and Dubai, Sahara brings centuries-old nomadic culinary secrets into a modern fine dining sanctuary. Every dish is an ode to fire, earth, saffron, and aromatic woodsmoke.
          </p>
          <div className="grid grid-cols-2 gap-6 w-full mb-8 pt-4 border-t border-orange-950/60">
            <div>
              <h4 className="font-serif text-3xl font-bold text-orange-400 mb-1">100%</h4>
              <p className="text-xs tracking-wider uppercase text-orange-200/60">Authentic Spices</p>
            </div>
            <div>
              <h4 className="font-serif text-3xl font-bold text-orange-400 mb-1">4.9</h4>
              <p className="text-xs tracking-wider uppercase text-orange-200/60">Guest Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 px-6 lg:px-16 bg-[#120c09]/50 border-t border-orange-950/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-orange-400 mb-3 block">Gastronomic Artistry</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Signature Menu</h2>
            <p className="text-orange-200/70 text-sm">Handcrafted dishes cooked to perfection in traditional earthenware tagines and open hearths.</p>

            {/* Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {["all", "starter", "main", "dessert"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-serif transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-900/30"
                      : "bg-orange-950/30 hover:bg-orange-900/40 text-orange-200/80 border border-orange-900/40"
                  }`}
                >
                  {tab}s
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div key={item.id} className="group bg-[#160f0c] border border-orange-950/80 rounded-2xl overflow-hidden hover:border-orange-800/60 transition-all flex flex-col shadow-xl">
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#0d0907]/80 backdrop-blur-md px-3 py-1 rounded-full border border-orange-800/40 flex items-center gap-1 text-xs text-orange-300 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                    <span>{item.rating}</span>
                  </div>
                  <span className="absolute bottom-4 left-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-serif font-bold text-lg px-4 py-1 rounded-full shadow-md">
                    {item.price}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">{item.name}</h3>
                  <p className="text-orange-200/60 text-sm leading-relaxed mb-6 flex-grow font-light">{item.desc}</p>
                  <button 
                    onClick={() => setCartCount(c => c + 1)}
                    className="w-full py-3 rounded-xl bg-orange-950/40 hover:bg-orange-900/50 border border-orange-800/40 text-orange-200 text-xs font-serif tracking-widest uppercase transition-all flex items-center justify-center gap-2 group-hover:border-orange-600"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#1a110c] to-[#120c09] border border-orange-900/50 rounded-3xl p-8 lg:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-orange-400 mb-3 block">Atmosphere & Nights</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Live Oud Music & Starlit Dining</h2>
              <p className="text-orange-200/70 leading-relaxed font-light mb-8">
                Every Thursday and Saturday evening, Sahara transforms into an Andalusian tent of wonder featuring live traditional musicians, mesmerizing candlelit lanterns, and aromatic shisha lounge experiences.
              </p>
              <ul className="space-y-4 mb-8">
                {["Private VIP Berber Tents", "Sommelier-paired Moroccan Wines", "Artisanal Mezze Platters"].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-orange-200 text-sm">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 font-serif tracking-widest text-sm uppercase text-white shadow-lg shadow-red-900/40 hover:opacity-95 transition-all">
                <span>Book Experience</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop" alt="Dining vibe" className="rounded-2xl object-cover h-64 w-full border border-orange-900/40 shadow-xl" />
              <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=600&auto=format&fit=crop" alt="Cocktail vibe" className="rounded-2xl object-cover h-64 w-full border border-orange-900/40 shadow-xl translate-y-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Reservation / Contact Section */}
      <section id="contact" className="py-24 px-6 lg:px-16 bg-[#120c09] border-t border-orange-950/60">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-orange-400 mb-3 block">Reservations</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Secure Your Table</h2>
            <p className="text-orange-200/70 font-light mb-8 leading-relaxed">
              Join us for an unforgettable evening of luxury dining. For parties larger than 8, please contact our concierge directly.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-orange-950/50 border border-orange-900/40 text-orange-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-orange-100">Location</h4>
                  <p className="text-sm text-orange-200/60">784 Mirage Boulevard, Oasis Heights</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-orange-950/50 border border-orange-900/40 text-orange-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-orange-100">Direct Line</h4>
                  <p className="text-sm text-orange-200/60">+1 (555) 392-7242</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-orange-950/50 border border-orange-900/40 text-orange-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-orange-100">Hours</h4>
                  <p className="text-sm text-orange-200/60">Tue - Sun: 5:00 PM - 12:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#160f0c] p-8 lg:p-10 rounded-3xl border border-orange-900/50 shadow-2xl relative">
            {reserved ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2 text-orange-100">Reservation Confirmed</h3>
                <p className="text-orange-200/70 text-sm max-w-xs mb-6">We have received your table request. A confirmation SMS has been sent.</p>
                <button onClick={() => setReserved(false)} className="px-6 py-2.5 rounded-full bg-orange-950 border border-orange-800 text-orange-300 text-xs font-serif uppercase tracking-widest">
                  Make Another Booking
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setReserved(true); }} className="space-y-5">
                <h3 className="font-serif text-xl font-bold mb-6 text-orange-100">Table Booking Form</h3>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-orange-300/80 mb-2">Full Name</label>
                  <input required type="text" placeholder="Lord & Lady Kensington" className="w-full bg-[#0d0907] border border-orange-950 rounded-xl px-4 py-3 text-sm text-orange-100 focus:outline-none focus:border-orange-600 transition-colors" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-orange-300/80 mb-2">Date</label>
                    <input required type="date" className="w-full bg-[#0d0907] border border-orange-950 rounded-xl px-4 py-3 text-sm text-orange-100 focus:outline-none focus:border-orange-600 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-orange-300/80 mb-2">Guests</label>
                    <select className="w-full bg-[#0d0907] border border-orange-950 rounded-xl px-4 py-3 text-sm text-orange-100 focus:outline-none focus:border-orange-600 transition-colors">
                      <option>2 Guests</option>
                      <option>4 Guests</option>
                      <option>6 Guests</option>
                      <option>8+ VIP Guests</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-orange-300/80 mb-2">Special Requests</label>
                  <textarea rows={3} placeholder="Allergies, anniversary celebration, etc." className="w-full bg-[#0d0907] border border-orange-950 rounded-xl px-4 py-3 text-sm text-orange-100 focus:outline-none focus:border-orange-600 transition-colors"></textarea>
                </div>
                <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 font-serif tracking-widest text-xs uppercase text-white shadow-lg shadow-red-900/40 hover:opacity-95 transition-all font-bold">
                  Confirm Reservation
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-16 bg-[#080504] border-t border-orange-950/80 text-center text-xs text-orange-200/50 tracking-wider">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-serif tracking-widest text-orange-200 font-bold">SAHARA RESTAURANT</span>
        </div>
        <p>© {new Date().getFullYear()} Sahara Dukes & Feasts. All rights reserved.</p>
      </footer>
    </div>
  );
}