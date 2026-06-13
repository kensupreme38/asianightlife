import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface VenueGalleryProps {
  images: string[];
  venueName: string;
}

export const VenueGallery = ({ images, venueName }: VenueGalleryProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!images || images.length === 0) {
    return (
      <Skeleton className="aspect-square md:aspect-video w-full rounded-lg" />
    );
  }

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (e: any) => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative aspect-square md:aspect-video w-full rounded-lg overflow-hidden group">
      {isLoading && (
        <Skeleton className="h-full w-full absolute inset-0 z-10" />
      )}

      {hasError ? (
        <div className="h-full w-full bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-sm">Failed to load image</div>
            <div className="text-xs mt-1">Please try again later</div>
          </div>
        </div>
      ) : (
        <Image
          src={images[0]}
          alt={`${venueName} - Main venue image showing interior and atmosphere`}
          fill
          className={cn(
            "object-cover group-hover:scale-105 transition-transform duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleLoad}
          onError={handleError}
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
};
