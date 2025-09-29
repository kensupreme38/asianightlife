'use client';
import Image from "next/image";
import Masonry from 'react-masonry-css';

interface VenueImageMasonryProps {
  images: string[];
}

export const VenueImageMasonry = ({ images }: VenueImageMasonryProps) => {
  if (!images || images.length === 0) {
    return null;
  }

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
          <div key={index}>
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
    </div>
  );
};
