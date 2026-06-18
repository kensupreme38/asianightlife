"use client";

import { useState, useEffect } from "react";
import { MapPin, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface BrowseCardProps {
  name: string;
  subtitle?: string;
  imageUrl?: string;
  icon?: LucideIcon;
  isSelected?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
}

export function BrowseCard({
  name,
  subtitle,
  imageUrl,
  icon: Icon,
  isSelected = false,
  disabled = false,
  href,
  onClick,
}: BrowseCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = imageUrl && !imageFailed;

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  const className = cn(
    "group relative w-full overflow-hidden rounded-xl text-left transition-all block",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    disabled && "opacity-60 cursor-not-allowed pointer-events-none",
    isSelected
      ? "ring-2 ring-primary shadow-lg shadow-primary/20"
      : !disabled && "hover:ring-1 hover:ring-border/60 hover:shadow-md"
  );

  const inner = (
    <>
      <div className="relative aspect-[16/10] w-full">
        {showImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="eager"
              decoding="async"
              onError={() => setImageFailed(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/80">
            {Icon ? (
              <Icon className="h-8 w-8 text-muted-foreground/50" />
            ) : (
              <MapPin className="h-8 w-8 text-muted-foreground/50" />
            )}
          </div>
        )}

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-3 z-10",
            !showImage && "bg-gradient-to-t from-background/90 to-transparent pt-8"
          )}
        >
          <p
            className={cn(
              "font-semibold text-sm md:text-base leading-tight truncate",
              showImage ? "text-white drop-shadow-sm" : "text-foreground"
            )}
          >
            {name}
          </p>
          {subtitle && (
            <p
              className={cn(
                "text-xs mt-0.5 truncate",
                showImage ? "text-white/70 drop-shadow-sm" : "text-muted-foreground"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-current={isSelected ? "page" : undefined}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isSelected}
      aria-disabled={disabled}
      className={className}
    >
      {inner}
    </button>
  );
}

interface BrowseSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function BrowseSection({ title, icon: Icon, children }: BrowseSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-primary shrink-0" />
        <h2 className="text-xl md:text-2xl font-bold font-headline">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {children}
      </div>
    </div>
  );
}
