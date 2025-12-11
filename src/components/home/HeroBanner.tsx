'use client';
import { useState, useEffect, useMemo } from "react";
import {Star, MapPin } from "lucide-react";
import Image from "next/image";
import { getImage } from "@/lib/placeholder-images";
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export const HeroBanner = () => {
  const t = useTranslations();
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroBannerImage = getImage('hero-banner');
  const heroBannerImage2 = getImage('hero-banner-2');
  
  // Use useMemo to recreate banners when translations change
  const banners = useMemo(() => [
    {
      id: 1,
      image: heroBannerImage?.imageUrl || "https://picsum.photos/seed/hero/1200/600",
      imageHint: heroBannerImage?.imageHint,
      title: t('hero.discoverHottestVenues'),
      subtitle: t('hero.locations'),
      description: t('hero.description'),
    },
    {
      id: 2,
      image: heroBannerImage2?.imageUrl || "https://picsum.photos/seed/hero2/1200/600",
      imageHint: heroBannerImage2?.imageHint,
      title: t('hero.specialWeekendOffer'),
      subtitle: t('hero.weekendSubtitle'),
      description: t('hero.weekendDescription'),
    }
  ], [t, heroBannerImage, heroBannerImage2]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="relative w-full aspect-video overflow-hidden">
      {/* Banner Slides */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          {banners.map((banner, index) => 
            index === currentSlide ? (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <Image 
                  src={banner.image} 
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  data-ai-hint={banner.imageHint}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
                
                {/* Content */}
                <div className="relative h-full hidden md:flex items-center">
                  <div className="container">
                    <motion.div 
                      className="max-w-2xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      <motion.div 
                        className="flex items-center space-x-2 mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <Star className="h-5 w-5 text-red-orange fill-current" />
                        <span className="text-sm font-medium text-red-orange uppercase tracking-wide">
                          {t('hero.premiumVenues')}
                        </span>
                      </motion.div>
                      
                      <motion.h1 
                        className="text-4xl md:text-6xl font-bold mb-4 leading-tight font-headline"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                      >
                        <span className="gradient-text">{banner.title}</span>
                      </motion.h1>
                      
                      <motion.div 
                        className="flex items-center space-x-2 mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        <MapPin className="h-4 w-4 text-red-bright" />
                        <p className="text-lg text-muted-foreground font-medium">
                          {banner.subtitle}
                        </p>
                      </motion.div>
                      
                      <motion.p 
                        className="text-xl text-foreground/80 mb-8 leading-relaxed"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        {banner.description}
                      </motion.p>
                      
                    </motion.div>
                  </div>
                </div>
                
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {banners.map((_, index) => (
          <motion.button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-red-bright" 
                : "bg-white/40 hover:bg-white/60"
            }`}
            onClick={() => setCurrentSlide(index)}
            animate={{
              scale: index === currentSlide ? 1.25 : 1,
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </motion.div>
    </section>
  );
};
