import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface VenueGalleryProps {
  images: string[];
  venueName: string;
}

export const VenueGallery = ({ images, venueName }: VenueGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setShowLightbox(true);
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="grid grid-cols-4 gap-2 h-96">
        {/* Main Image */}
        <div 
          className="col-span-3 relative overflow-hidden rounded-lg"
          onClick={() => openLightbox(currentImage)}
        >
          <Image 
            src={images[currentImage]} 
            alt={`${venueName} - Image ${currentImage + 1}`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            {/* This span was removed as per user request */}
          </div>
        </div>

        {/* Thumbnail Column */}
        <div className="space-y-2">
          {images.slice(0, 4).map((image, index) => (
            <div 
              key={index}
              className={`relative cursor-pointer overflow-hidden rounded-lg h-[22%] ${
                currentImage === index ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setCurrentImage(index)}
            >
              <Image 
                src={image} 
                alt={`${venueName} thumbnail ${index + 1}`}
                fill
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setShowLightbox(false)}>
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10 h-10 w-10"
            onClick={() => setShowLightbox(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div 
            className="relative w-full h-full max-w-4xl max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image 
                src={images[currentImage]} 
                alt={`${venueName} - Image ${currentImage + 1}`}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/60 px-3 py-1 rounded">
              {currentImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
