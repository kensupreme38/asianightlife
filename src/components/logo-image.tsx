"use client";
import { useState } from "react";

const LOGO_URLS = [
  // Facebook CDN logo URL
  "https://scontent.fsgn5-15.fna.fbcdn.net/v/t39.30808-1/574491904_122108565945057117_3271938103654623430_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=111&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=D4MDGERogY4Q7kNvwHuNQPH&_nc_oc=Adni68EYaPMamQJEYgTcmwiT38WHQkblCz6eKl6UKZqDvp_RnNYI-kP-bx_9cVchrUk&_nc_zt=24&_nc_ht=scontent.fsgn5-15.fna&_nc_gid=vAA44UNDpoKrQhabHKzEtg&oh=00_AfhaBA8WjsBv__JORFOV9Q15d4nLX-FvDh7gUK2epF8f1A&oe=690F2838",
];

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
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (currentUrlIndex < LOGO_URLS.length - 1) {
      // Try next URL format
      setCurrentUrlIndex(currentUrlIndex + 1);
    } else {
      // All URLs failed
      setHasError(true);
    }
  };

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
    <img
      src={LOGO_URLS[currentUrlIndex]}
      alt="Asia Night Life Logo"
      width={width}
      height={height}
      className={className}
      loading={loading}
      onError={handleError}
    />
  );
}

