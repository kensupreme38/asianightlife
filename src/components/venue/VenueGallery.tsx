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

  if (!images || images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="relative h-96 w-full rounded-lg overflow-hidden group">
        <Image
          src={images[0]}
          alt={`${venueName} - Image 1`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 h-10 w-10 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div
            className="relative h-full w-full max-h-[90vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full w-full">
              <Image
                src={images[currentImage]}
                alt={`${venueName} - Image ${currentImage + 1}`}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-black/60 px-3 py-1 text-white">
              {currentImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
