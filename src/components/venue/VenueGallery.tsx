import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface VenueGalleryProps {
  images: string[];
  venueName: string;
}

export const VenueGallery = ({ images, venueName }: VenueGalleryProps) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!images || images.length === 0) {
    return <Skeleton className="h-[550px] w-full rounded-lg" />;
  }

  return (
    <div className="relative h-[550px] w-full rounded-lg overflow-hidden group">
      {isLoading && <Skeleton className="h-full w-full absolute inset-0" />}
      <Image
        src={images[0]}
        alt={`${venueName} - Image 1`}
        fill
        unoptimized
        className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
};
