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
    console.log("VenueGallery: Image loaded successfully:", images[0]);
    setIsLoading(false);
  };

  const handleError = (e: any) => {
    console.error("VenueGallery: Image failed to load:", images[0], e);
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
          alt={`${venueName} - Image 1`}
          fill
          className={cn(
            "object-cover group-hover:scale-105 transition-transform duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleLoad}
          onError={handleError}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
};
