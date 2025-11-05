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
            <Image
              src="https://scontent.fsgn5-15.fna.fbcdn.net/v/t39.30808-6/574491904_122108565945057117_3271938103654623430_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=D4MDGERogY4Q7kNvwHuNQPH&_nc_oc=Adni68EYaPMamQJEYgTcmwiT38WHQkblCz6eKl6UKZqDvp_RnNYI-kP-bx_9cVchrUk&_nc_zt=23&_nc_ht=scontent.fsgn5-15.fna&_nc_gid=yAC_kuve8_m8h4mBch5p4g&oh=00_AfjULSMXzbbcJEsvKLJNiCQXs9tyW-cDUaBi_q30YhDsqA&oe=69109393"
              alt="Asia Night Life Logo"
              width={150}
              height={150}
              className="object-cover mb-4"
              priority
            />
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-2">
              <span className="bg-gradient-to-r from-red-deep via-red-bright to-red-orange bg-clip-text text-transparent">
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
          <div className="w-3 h-3 bg-red-deep rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-red-bright rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-red-orange rounded-full animate-bounce"></div>
        </div>

        {/* Subtitle */}
        <p className="mt-8 text-white/60 text-sm md:text-base">
          Singapore • Vietnam • Thailand • Malaysia
        </p>
      </div>

      {/* Animated border */}
      <div className="absolute inset-4 border-2 border-red-bright/30 rounded-lg animate-pulse" />
    </div>
  );
};
