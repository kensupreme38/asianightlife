"use client";

import { useState } from "react";
import { getFlagUrl, resolveCountryIso } from "@/lib/country-flags";
import { cn } from "@/lib/utils";

interface CountryFlagProps {
  /** Country name (e.g. "Vietnam") or ISO code (e.g. "vn") */
  country: string;
  size?: number;
  className?: string;
  alt?: string;
}

export function CountryFlag({ country, size = 28, className, alt }: CountryFlagProps) {
  const iso = resolveCountryIso(country);
  const [failed, setFailed] = useState(false);

  if (!iso) return null;

  const src = getFlagUrl(iso);
  const height = Math.round(size * 0.75);

  if (failed) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-sm bg-muted text-[10px] font-bold uppercase text-muted-foreground shrink-0 border border-border",
          className
        )}
        style={{ width: size, height }}
        aria-label={alt ?? `${iso} flag`}
      >
        {iso}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? `${iso} flag`}
      width={size}
      height={height}
      className={cn(
        "rounded-sm object-cover shrink-0 shadow-sm border border-border/30 bg-muted/30",
        className
      )}
      style={{ width: size, height, aspectRatio: "4 / 3" }}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
