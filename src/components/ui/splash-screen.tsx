"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getImage } from "@/lib/placeholder-images";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen = ({
  onComplete,
  duration = 1500,
}: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const heroBannerImage = getImage("hero-banner");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 500); // Animation duration
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-all duration-500 ${
        isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={
            heroBannerImage?.imageUrl ||
            "https://picsum.photos/seed/hero/1200/600"
          }
          alt="Asia Night Life Splash"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white">
        {/* Logo/Title */}
        <div className="mb-8">
          <div className="flex flex-col items-center mb-6">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 shadow-2xl">
              <Image
                src="https://drive.google.com/uc?export=view&id=1C55Ml5hc3-BvzEo2S5zwkgMyuTViR2Tt"
                alt="Asia Night Life Logo"
                width={120}
                height={120}
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-2">
              <span className="bg-gradient-to-r from-neon-pink via-purple-500 to-neon-cyan bg-clip-text text-transparent">
                Asia Night Life
              </span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-white/80 font-medium">
            Premier Entertainment Venue Booking
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center items-center space-x-2">
          <div className="w-3 h-3 bg-neon-pink rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-neon-cyan rounded-full animate-bounce"></div>
        </div>

        {/* Subtitle */}
        <p className="mt-8 text-white/60 text-sm md:text-base">
          Singapore • Vietnam • Thailand • Malaysia
        </p>
      </div>

      {/* Animated border */}
      <div className="absolute inset-4 border-2 border-neon-pink/30 rounded-lg animate-pulse" />
    </div>
  );
};
