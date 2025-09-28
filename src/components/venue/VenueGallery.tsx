import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <>
      {/* Main Gallery */}
      <div className="grid grid-cols-4 gap-2 h-96">
        {/* Main Image */}
        <div 
          className="col-span-3 relative cursor-pointer overflow-hidden rounded-lg"
          onClick={() => setShowLightbox(true)}
        >
          <img 
            src={images[currentImage]} 
            alt={`${venueName} - Image ${currentImage + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <span className="text-sm bg-black/60 px-2 py-1 rounded">
              {currentImage + 1} / {images.length}
            </span>
          </div>
        </div>

        {/* Thumbnail Column */}
        <div className="space-y-2">
          {images.slice(0, 4).map((image, index) => (
            <div 
              key={index}
              className={`relative cursor-pointer overflow-hidden rounded-lg h-[22%] ${
                index === currentImage ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setCurrentImage(index)}
            >
              <img 
                src={image} 
                alt={`${venueName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {index === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium">
                  +{images.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
            <img 
              src={images[currentImage]} 
              alt={`${venueName} - Image ${currentImage + 1}`}
              className="w-full h-full object-contain"
            />
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setShowLightbox(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

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
