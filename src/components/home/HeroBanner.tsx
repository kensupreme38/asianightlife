import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";
import Image from "next/image";

export const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    {
      id: 1,
      image: heroBanner.src,
      title: "Khám Phá Những Địa Điểm Hot Nhất",
      subtitle: "Singapore • Vietnam • Thailand • Malaysia",
      description: "Đặt chỗ ngay tại các club, KTV và live house hàng đầu Đông Nam Á",
      cta: "Khám Phá Ngay"
    },
    {
      id: 2,
      image: heroBanner.src,
      title: "Ưu Đãi Đặc Biệt Cuối Tuần",
      subtitle: "Giảm 30% cho booking trước 6PM",
      description: "Đừng bỏ lỡ cơ hội trải nghiệm những địa điểm giải trí tuyệt vời",
      cta: "Đặt Ngay"
    }
  ];

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
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Banner Slides */}
      <div className="relative h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image 
              src={banner.image} 
              alt={banner.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
            
            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container">
                <div className="max-w-2xl animate-fade-in">
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="h-5 w-5 text-gold fill-current" />
                    <span className="text-sm font-medium text-gold uppercase tracking-wide">
                      Premium Venues
                    </span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    <span className="gradient-text">{banner.title}</span>
                  </h1>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="h-4 w-4 text-neon-pink" />
                    <p className="text-lg text-muted-foreground font-medium">
                      {banner.subtitle}
                    </p>
                  </div>
                  
                  <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
                    {banner.description}
                  </p>
                  
                  <Button variant="neon" size="lg" className="text-lg px-8 py-6 hover-glow">
                    {banner.cta}
                  </Button>
                </div>
              </div>
            </div>
            
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-background/20 backdrop-blur-sm hover:bg-background/40 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-background/20 backdrop-blur-sm hover:bg-background/40 text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-neon-pink scale-125" 
                : "bg-white/40 hover:bg-white/60"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};
