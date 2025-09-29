'use client';
import Image from "next/image";

interface VenueImageMasonryProps {
  images: string[];
}

export const VenueImageMasonry = ({ images }: VenueImageMasonryProps) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((src, index) => (
          <div key={index} className="break-inside-avoid">
            <Image
              src={src}
              alt={`Venue gallery image ${index + 1}`}
              width={500}
              height={500}
              className="w-full h-auto object-cover rounded-lg shadow-lg hover-glow"
            />
          </div>
        ))}
      </div>
    </section>
  );
};
