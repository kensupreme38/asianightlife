"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface SimpleImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  priority?: boolean;
  fallback?: string;
}

// Default placeholder image from Unsplash
const DEFAULT_PLACEHOLDER = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop&q=80";

export const SimpleImage = ({
  src,
  alt,
  className,
  fill,
  width,
  height,
  loading = "lazy",
  priority = false,
  fallback,
}: SimpleImageProps) => {
  const [imgSrc, setImgSrc] = useState(src || fallback || DEFAULT_PLACEHOLDER);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority || loading === "eager");
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for better lazy loading of external images
  useEffect(() => {
    if (shouldLoad || priority || loading === "eager") return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
      observer.disconnect();
    };
  }, [shouldLoad, priority, loading]);

  // Fallback for invalid src
  if (!src || src.trim() === "" || src === "/placeholder-dj.jpg") {
    return (
      <div
        className={`bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <div className="text-center p-4">
          <svg
            className="w-12 h-12 mx-auto text-muted-foreground/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs text-muted-foreground mt-2 block">No image</span>
        </div>
      </div>
    );
  }

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Try fallback, otherwise use default placeholder
      if (fallback && imgSrc !== fallback) {
        setImgSrc(fallback);
      } else if (imgSrc !== DEFAULT_PLACEHOLDER) {
        setImgSrc(DEFAULT_PLACEHOLDER);
      }
    }
  };

  if (hasError && imgSrc === DEFAULT_PLACEHOLDER) {
    return (
      <div
        className={`bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <div className="text-center p-4">
          <svg
            className="w-12 h-12 mx-auto text-muted-foreground/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs text-muted-foreground mt-2 block">Failed to load</span>
        </div>
      </div>
    );
  }

  // Determine if we should use unoptimized based on the image source
  const isExternal = imgSrc.startsWith("http");
  const isSupabase = imgSrc.includes("supabase.co");
  
  // Don't render image until it should load (for lazy loading)
  if (!shouldLoad && !priority && loading === "lazy") {
    return (
      <div
        ref={containerRef}
        className={`bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ${className}`}
        style={fill ? { position: "absolute", inset: 0 } : { width, height }}
      >
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto bg-muted-foreground/20 rounded animate-pulse" />
        </div>
      </div>
    );
  }
  
  return (
    <div ref={containerRef} className={fill ? "relative w-full h-full" : ""}>
      <Image
        src={imgSrc}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        loading={priority ? undefined : loading}
        priority={priority}
        onError={handleError}
        unoptimized={isExternal && !isSupabase}
      />
    </div>
  );
};
