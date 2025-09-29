'use client';
import { useState } from "react";
import Image from "next/image";
import Masonry from 'react-masonry-css';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface VenueImageMasonryProps {
  images: string[];
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
          <div key={index} onClick={() => openLightbox(index)} className="cursor-pointer">
            <Image
              src={src}
              alt={`Venue gallery image ${index + 1}`}
              width={500}
              height={500}
              className="w-full h-auto object-cover rounded-lg shadow-lg hover-glow"
            />
          </div>
        ))}
      </Masonry>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] w-full p-0 bg-transparent border-0 flex items-center justify-center">
            <DialogTitle className="sr-only">Image Lightbox</DialogTitle>
            <div className="relative">
              <Image
                src={images[selectedImageIndex]}
                alt={`Venue gallery image ${selectedImageIndex + 1}`}
                width={1200}
                height={800}
                className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white bg-black/30 hover:bg-black/50"
                onClick={closeLightbox}
              >
                <X className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50"
                onClick={showPrevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50"
                onClick={showNextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/60 px-3 py-1 rounded">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
