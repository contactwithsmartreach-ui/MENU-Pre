"use client";

import React from "react";
import { Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { toast } from "sonner";

export function SocialContactBar() {
  const handleContactClick = (type: string, value: string) => {
    toast.info(`Contact: ${type}`, {
      description: value,
    });
  };

  return (
    <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4">
      {/* Phone Button */}
      <div
        className="tooltip-container"
        onClick={() => handleContactClick("Phone Reservation", "+1 (555) 382-9481")}
      >
        <div className="icon">
          <div className="layer">
            <span />
            <span />
            <span />
            <span />
            <span />
            <div className="absolute inset-0 flex items-center justify-center text-orange-400">
              <Phone className="w-5 h-5" />
            </div>
          </div>
          <span className="text">Phone</span>
        </div>
        <div className="tooltip">
          <div className="profile">
            <div className="user">
              <div className="img">
                <Phone className="w-5 h-5 text-orange-400" />
              </div>
              <div className="details">
                <span className="name">Phone Concierge</span>
                <span className="about">+1 (555) 382-9481</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Button */}
      <div
        className="tooltip-container"
        onClick={() => handleContactClick("Location", "742 Sahara Avenue, Suite 900")}
      >
        <div className="icon">
          <div className="layer">
            <span />
            <span />
            <span />
            <span />
            <span />
            <div className="absolute inset-0 flex items-center justify-center text-orange-400">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <span className="text">Location</span>
        </div>
        <div className="tooltip">
          <div className="profile">
            <div className="user">
              <div className="img">
                <MapPin className="w-5 h-5 text-orange-400" />
              </div>
              <div className="details">
                <span className="name">Gastronomy Lounge</span>
                <span className="about">742 Sahara Ave, Suite 900</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instagram Button */}
      <div
        className="tooltip-container"
        onClick={() => handleContactClick("Instagram", "@laura.sahara.dining")}
      >
        <div className="icon">
          <div className="layer">
            <span />
            <span />
            <span />
            <span />
            <span />
            <div className="absolute inset-0 flex items-center justify-center text-orange-400">
              <Instagram className="w-5 h-5" />
            </div>
          </div>
          <span className="text">Instagram</span>
        </div>
        <div className="tooltip">
          <div className="profile">
            <div className="user">
              <div className="img">
                <Instagram className="w-5 h-5 text-orange-400" />
              </div>
              <div className="details">
                <span className="name">Instagram</span>
                <span className="about">@laura.sahara.dining</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facebook Button */}
      <div
        className="tooltip-container"
        onClick={() => handleContactClick("Facebook", "L'Aura Sahara Restaurant")}
      >
        <div className="icon">
          <div className="layer">
            <span />
            <span />
            <span />
            <span />
            <span />
            <div className="absolute inset-0 flex items-center justify-center text-orange-400">
              <Facebook className="w-5 h-5" />
            </div>
          </div>
          <span className="text">Facebook</span>
        </div>
        <div className="tooltip">
          <div className="profile">
            <div className="user">
              <div className="img">
                <Facebook className="w-5 h-5 text-orange-400" />
              </div>
              <div className="details">
                <span className="name">Facebook</span>
                <span className="about">L&apos;Aura Sahara Dining</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}