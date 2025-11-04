"use client";
import Image from "next/image";

interface SimpleImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  priority?: boolean;
}

export const SimpleImage = ({
  src,
  alt,
  className,
  fill,
  width,
  height,
  loading = "lazy",
  priority = false,
}: SimpleImageProps) => {
  // Fallback for invalid src
  if (!src || src.trim() === "") {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-500 text-sm">No image</span>
      </div>
    );
  }

  try {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        loading={priority ? undefined : loading}
        priority={priority}
        onError={(e) => {
          console.error("Image failed to load:", src, e);
        }}
        onLoad={() => {
          console.log("Image loaded successfully:", src);
        }}
      />
    );
  } catch (error) {
    console.error("Error rendering image:", src, error);
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-500 text-sm">Error loading image</span>
      </div>
    );
  }
};
