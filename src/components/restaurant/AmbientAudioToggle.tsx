"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AmbientAudioToggle({ className }: { className?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Stop / cleanup audio nodes
  const stopAudio = () => {
    if (masterGainRef.current && audioCtxRef.current) {
      const currTime = audioCtxRef.current.currentTime;
      masterGainRef.current.gain.linearRampToValueAtTime(0.0001, currTime + 1.2);
      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        oscillatorsRef.current = [];
        if (noiseNodeRef.current) {
          try {
            noiseNodeRef.current.disconnect();
          } catch {}
          noiseNodeRef.current = null;
        }
      }, 1300);
    }
  };

  // Start warm atmospheric ambient soundscape (Desert Twilight Warm Drone & Silk Breeze)
  const startAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Master Gain for smooth volume control
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2.0);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Soft Warm Pentatonic Chord Harmonics (D minor / Warm Sahara Evening: D2, A2, D3, F3, A3)
      const frequencies = [73.42, 110.0, 146.83, 174.61, 220.0, 329.63];

      oscillatorsRef.current = frequencies.map((freq, i) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // Warm low-pass filter
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450 + i * 80, ctx.currentTime);
        filter.Q.setValueAtTime(2.5, ctx.currentTime);

        // Subdued sine and soft triangle mix
        osc.type = i % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle LFO slow detune for organic acoustic shimmer
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.1 + i * 0.04, ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.2 + i * 0.4, ctx.currentTime);
        lfo.connect(osc.detune);
        lfo.start();

        const baseVol = 0.08 / (i + 1);
        noteGain.gain.setValueAtTime(baseVol, ctx.currentTime);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(masterGain);
        osc.start();

        return osc;
      });

      // Soft Warm Crackle / Silk Breeze Filtered Pink Noise
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.04;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(320, ctx.currentTime);
      noiseFilter.Q.setValueAtTime(1.0, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, ctx.currentTime);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noiseSource.start();
      noiseNodeRef.current = noiseSource;

    } catch {
      // Audio autoplay policy fallback
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
      toast("Ambient Sound Muted", {
        description: "Atmospheric soundtrack paused.",
      });
    } else {
      startAudio();
      setIsPlaying(true);
      toast("Sahara Ambient Lounge Active", {
        description: "Relaxing atmospheric soundscape enabled.",
        icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      });
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-label={isPlaying ? "Mute Ambient Soundtrack" : "Play Ambient Soundtrack"}
      className={cn(
        "group relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-300 cursor-pointer select-none",
        "bg-neutral-950/85 backdrop-blur-xl border text-white shadow-xl",
        isPlaying
          ? "border-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.45)] ring-1 ring-orange-500/50"
          : "border-white/10 hover:border-orange-500/40 shadow-md hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]",
        className
      )}
    >
      {/* Background Pulse Glow when active */}
      {isPlaying && (
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 via-orange-500/20 to-amber-500/20 animate-pulse pointer-events-none" />
      )}

      <div
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
          isPlaying
            ? "bg-gradient-to-tr from-red-500 to-amber-400 text-neutral-950 shadow-md shadow-orange-500/40"
            : "bg-neutral-900 border border-white/10 text-neutral-400 group-hover:text-white"
        )}
      >
        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
        ) : (
          <VolumeX className="w-3.5 h-3.5" />
        )}
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] sm:text-xs font-serif font-bold uppercase tracking-wider text-neutral-200 group-hover:text-white">
            {isPlaying ? "Sahara Ambient" : "Sound"}
          </span>
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-2.5">
              <span className="w-0.5 bg-amber-400 rounded-full animate-[bounce_0.8s_infinite_100ms] h-full" />
              <span className="w-0.5 bg-orange-400 rounded-full animate-[bounce_0.7s_infinite_200ms] h-3/4" />
              <span className="w-0.5 bg-red-400 rounded-full animate-[bounce_0.9s_infinite_300ms] h-full" />
            </div>
          )}
        </div>
        <span className="text-[9px] font-mono uppercase tracking-widest text-orange-300/60 leading-none">
          {isPlaying ? "Live Lounge" : "Click to Play"}
        </span>
      </div>
    </button>
  );
}