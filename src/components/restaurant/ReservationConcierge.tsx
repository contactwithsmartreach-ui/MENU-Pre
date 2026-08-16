"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar, Users, Clock, Wine, Sparkles, CheckCircle2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ReservationConcierge() {
  const [guests, setGuests] = useState("2 Guests");
  const [date, setDate] = useState("Tonight");
  const [time, setTime] = useState("8:00 PM");
  const [pairing, setPairing] = useState("Grand Sommelier Selection");
  const [isBooked, setIsBooked] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
    toast.success("Table & Sommelier Reserved Successfully!", {
      description: `Confirmed for ${guests} on ${date} at ${time} with ${pairing}.`,
    });
  };

  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto px-4 py-16">
      <div className="relative rounded-[36px] bg-gradient-to-b from-[#140b09] via-[#0d0706] to-[#0a0504] border border-orange-500/40 p-8 sm:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.8),0_0_40px_rgba(249,115,22,0.15)] overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-red-600/20 via-orange-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-amber-600/20 via-orange-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-4 mb-10">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-serif tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span>VIP Table Experience</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-wide">
            Reserve Your Culinary Journey
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl font-light">
            Secure your table at L&apos;Aura Sahara and curate your evening with our bespoke sommelier wine pairings.
          </p>
        </div>

        {isBooked ? (
          <div className="relative z-10 flex flex-col items-center justify-center text-center py-12 space-y-6 animate-in fade-in-0 zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-neutral-950 shadow-xl shadow-orange-500/30">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-white">Reservation Confirmed</h3>
              <p className="text-sm text-neutral-300 max-w-md">
                We have reserved table for <strong className="text-orange-300">{guests}</strong> on <strong className="text-orange-300">{date}</strong> at <strong className="text-orange-300">{time}</strong>. Our maître d&apos; will welcome you upon arrival.
              </p>
            </div>
            <Button
              onClick={() => setIsBooked(false)}
              className="mt-4 rounded-full bg-neutral-900 border border-orange-500/40 px-8 py-3 text-xs font-serif uppercase tracking-widest text-orange-200 hover:bg-orange-500 hover:text-neutral-950 transition-all cursor-pointer"
            >
              Book Another Table
            </Button>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Guests Selector */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-serif uppercase tracking-wider text-orange-300/80 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-orange-400" />
                Party Size
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-neutral-950/90 border border-orange-500/30 rounded-2xl px-4 py-3 text-sm text-white focus:border-orange-400 focus:outline-none transition-colors"
              >
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>4 Guests</option>
                <option>6 Guests</option>
                <option>8+ VIP Private Room</option>
              </select>
            </div>

            {/* Date Selector */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-serif uppercase tracking-wider text-orange-300/80 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                Dining Date
              </label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-neutral-950/90 border border-orange-500/30 rounded-2xl px-4 py-3 text-sm text-white focus:border-orange-400 focus:outline-none transition-colors"
              >
                <option>Tonight</option>
                <option>Tomorrow Night</option>
                <option>This Friday</option>
                <option>This Saturday</option>
                <option>Custom Date</option>
              </select>
            </div>

            {/* Time Slot */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-serif uppercase tracking-wider text-orange-300/80 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                Preferred Time
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-neutral-950/90 border border-orange-500/30 rounded-2xl px-4 py-3 text-sm text-white focus:border-orange-400 focus:outline-none transition-colors"
              >
                <option>6:00 PM</option>
                <option>7:00 PM</option>
                <option>8:00 PM (Prime)</option>
                <option>9:15 PM</option>
                <option>10:30 PM Late Seating</option>
              </select>
            </div>

            {/* Wine Pairing Concierge */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-serif uppercase tracking-wider text-orange-300/80 flex items-center gap-1.5">
                <Wine className="w-3.5 h-3.5 text-orange-400" />
                Sommelier Pairing
              </label>
              <select
                value={pairing}
                onChange={(e) => setPairing(e.target.value)}
                className="w-full bg-neutral-950/90 border border-orange-500/30 rounded-2xl px-4 py-3 text-sm text-white focus:border-orange-400 focus:outline-none transition-colors"
              >
                <option>Grand Sommelier Selection</option>
                <option>Rare Reserve & Champagne</option>
                <option>Biodynamic & Natural Wines</option>
                <option>None / À la carte spirits</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 pt-4 flex justify-center">
              <button
                type="submit"
                className={cn(
                  "group relative overflow-hidden rounded-full cursor-pointer z-10 w-full sm:w-auto px-12 py-5",
                  "bg-gradient-to-r from-red-500 via-orange-500 to-amber-500",
                  "shadow-2xl shadow-red-600/40 hover:shadow-[0_0_45px_rgba(249,115,22,0.7)]",
                  "uppercase font-serif font-black text-white text-base tracking-[0.25em]",
                  "transition-all duration-300 hover:scale-105 active:scale-95"
                )}
              >
                <span>Confirm VIP Table Reservation</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}