"use client";
import { useState, memo, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface NativeImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  onLoad?: () => void;
  onError?: () => void;
}

export const NativeImage = memo(({
  src,
  alt,
  className,
  fill = false,
  width,
  height,
  loading = "lazy",
  priority = false,
  fetchPriority = "auto",
  onLoad,
  onError,
}: NativeImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority || loading === "eager");
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Intersection Observer for better lazy loading
  useEffect(() => {
    if (shouldLoad || priority || loading === "eager") return;

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
        rootMargin: "100px", // Start loading 100px before image enters viewport for smoother loading
        threshold: 0.01, // Trigger when 1% of image is visible
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

  // Check if image is already loaded (cached)
  useEffect(() => {
    if (!shouldLoad) return;
    
    const img = imgRef.current;
    if (img && img.complete && img.naturalHeight !== 0) {
      setIsLoading(false);
      onLoad?.();
    }
  }, [src, onLoad, shouldLoad]);

  // Fallback placeholder image
  const placeholderImage = "https://placehold.co/600x400/1a1a1a/ffffff?text=No+Image";

  // Fallback for invalid src
  if (!src || src.trim() === "") {
    return (
      <div
        className={cn(
          "bg-muted flex items-center justify-center",
          fill ? "absolute inset-0 w-full h-full" : "",
          className
        )}
      >
        <div className="text-muted-foreground text-sm">No image</div>
      </div>
    );
  }

  // If error, try to show placeholder or show error message
  if (hasError) {
    // Try to show placeholder image instead of error message
    if (src !== placeholderImage) {
      return (
        <img
          src={placeholderImage}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          className={cn(
            fill ? "absolute inset-0 w-full h-full object-cover" : "",
            className
          )}
          loading="lazy"
          decoding="async"
        />
      );
    }
    return (
      <div
        className={cn(
          "bg-muted flex items-center justify-center",
          fill ? "absolute inset-0 w-full h-full" : "",
          className
        )}
      >
        <div className="text-muted-foreground text-sm">
          Failed to load image
        </div>
      </div>
    );
  }

  // Use native img tag to avoid Vercel Image Optimization
  const imgElement = shouldLoad ? (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : loading}
      fetchPriority={priority ? "high" : fetchPriority}
      decoding="async"
      className={cn(
        fill ? "absolute inset-0 w-full h-full object-cover" : "",
        "transition-opacity duration-300",
        isLoading ? "opacity-0" : "opacity-100",
        className
      )}
      onLoad={handleLoad}
      onError={handleError}
    />
  ) : null;

  if (fill) {
    // When fill=true, parent container should be relative and handle positioning
    return (
      <div ref={containerRef} className="relative w-full h-full">
        {isLoading && (
          <Skeleton className="absolute inset-0 z-[1] h-full w-full rounded-none" />
        )}
        <div className={cn("absolute inset-0", isLoading ? "z-[2]" : "z-0")}>
          {imgElement}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {isLoading && (
        <Skeleton
          className={cn(
            "absolute inset-0 z-10",
            width && height ? `w-[${width}px] h-[${height}px]` : "w-full h-full"
          )}
        />
      )}
      {imgElement}
    </div>
  );
});

NativeImage.displayName = 'NativeImage';

