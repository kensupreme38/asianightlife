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
                unoptimized
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

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const showNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const showPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {images.map((src, index) => (
          <MasonryImage key={index} src={src} index={index} openLightbox={openLightbox} />
        ))}
      </Masonry>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center border-0 bg-black/90 p-0">
            <DialogTitle className="sr-only">Image Lightbox</DialogTitle>
            
            {/* Image */}
            <Image
              src={images[selectedImageIndex]}
              alt={`Venue gallery image ${selectedImageIndex + 1}`}
              fill
              unoptimized
              className="object-contain"
            />

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
              {selectedImageIndex + 1} / {images.length}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
