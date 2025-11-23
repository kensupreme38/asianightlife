'use client';
import { Music2, TrendingUp } from "lucide-react";
import Image from "next/image";
import { getImage } from "@/lib/placeholder-images";
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export const DJHeroBanner = () => {
  const t = useTranslations();
  const heroBannerImage = getImage('dj-hero-banner');
  
  const banner = useMemo(() => ({
    id: 1,
    image: heroBannerImage?.imageUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    imageHint: "DJ performing on stage with crowd and lights",
    title: t('dj.heroTitle'),
    subtitle: t('dj.heroSubtitle'),
    description: t('dj.heroDescription'),
  }), [t, heroBannerImage]);

  return (
    <section className="relative w-full aspect-video overflow-hidden">
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <Image 
            src={banner.image} 
            alt={banner.title}
            fill
            className="object-cover"
            priority
            data-ai-hint={banner.imageHint}
            unoptimized
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          
          {/* Content */}
          <div className="relative h-full hidden md:flex items-center">
            <div className="container px-3">
              <div className="max-w-2xl animate-fade-in">
                <div className="flex items-center space-x-2 mb-4">
                  <Music2 className="h-5 w-5 text-red-orange fill-current" />
                  <span className="text-sm font-medium text-red-orange uppercase tracking-wide">
                    {t('dj.topDJs')}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight font-headline">
                  <span className="gradient-text">{banner.title}</span>
                </h1>
                
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-red-bright" />
                  <p className="text-lg text-white font-medium">
                    {banner.subtitle}
                  </p>
                </div>
                
                <p className="text-xl text-white mb-8 leading-relaxed">
                  {banner.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

