"use client";
import { useState } from "react";
import Image from "next/image";

const LOGO_PATH = "/logo.jpg";

interface LogoImageProps {
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
}

export function LogoImage({ 
  width = 40, 
  height = 40, 
  className = "object-cover",
  loading = "lazy"
}: LogoImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Fallback: return a placeholder div with text or icon
    return (
      <div 
        className={`bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs ${className}`}
        style={{ width, height }}
      >
        ANL
      </div>
    );
  }

  return (
    <Image
      src={LOGO_PATH}
      alt="Asia Night Life Logo"
      width={width}
      height={height}
      className={className}
      loading={loading}
      onError={() => setHasError(true)}
      unoptimized
    />
  );
}

