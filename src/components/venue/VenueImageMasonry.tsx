'use client';
import { useState } from "react";
import Image from "next/image";
import Masonry from 'react-masonry-css';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface VenueImageMasonryProps {
  images: string[];
}

const MasonryImage = ({ src, index, openLightbox }: { src: string, index: number, openLightbox: (index: number) => void }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative cursor-pointer" onClick={() => openLightbox(index)}>
            {isLoading && <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />}
            <Image
                src={src}
                alt={`Venue gallery image ${index + 1}`}
                width={500}
                height={500}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                sizes="(max-width: 500px) 50vw, (max-width: 1100px) 33vw, 25vw"
                className={cn("w-full h-auto object-cover rounded-lg shadow-lg hover-glow transition-opacity duration-300", 
                    isLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={() => setIsLoading(false)}
            />
        </div>
    )
}

export const VenueImageMasonry = ({ images }: VenueImageMasonryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  // Remove duplicate images to prevent showing the same image twice
  const uniqueImages = Array.from(new Set(images));

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const showNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % uniqueImages.length);
  };

  const showPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + uniqueImages.length) % uniqueImages.length);
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2
  };

  return (
    <div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {uniqueImages.map((src, index) => (
          <MasonryImage key={`${src}-${index}`} src={src} index={index} openLightbox={openLightbox} />
        ))}
      </Masonry>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="w-screen h-screen max-w-full max-h-full rounded-none border-0 bg-black/90 p-0 flex items-center justify-center">
            <DialogTitle className="sr-only">Image Lightbox</DialogTitle>
            
            {/* Image */}
            <div className="relative w-full h-full">
              <Image
                src={uniqueImages[selectedImageIndex]}
                alt={`Venue gallery image ${selectedImageIndex + 1}`}
                fill
                priority
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white bg-black/30 hover:bg-black/50"
              onClick={closeLightbox}
            >
              <X className="h-8 w-8" />
            </Button>
            
            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-14 w-14 text-white bg-black/30 hover:bg-black/50"
              onClick={showPrevImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-14 w-14 text-white bg-black/30 hover:bg-black/50"
              onClick={showNextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/60 px-3 py-1 rounded">
              {selectedImageIndex + 1} / {uniqueImages.length}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
