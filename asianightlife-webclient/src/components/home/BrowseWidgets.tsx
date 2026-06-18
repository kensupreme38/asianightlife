"use client";

import { Star, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { BrowseVenueHighlight } from "@/hooks/use-browse-highlights";

interface BrowseWidgetsProps {
  topVenues: BrowseVenueHighlight[];
  newUpdates: BrowseVenueHighlight[];
  isLoading?: boolean;
}

function WidgetShell({
  title,
  icon: Icon,
  iconClassName,
  children,
}: {
  title: string;
  icon: React.ElementType;
  iconClassName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-card/60 overflow-hidden h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-secondary/20">
        <Icon className={cn("h-4 w-4 shrink-0", iconClassName)} />
        <h3 className="font-semibold text-sm md:text-base">{title}</h3>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function VenueListSkeleton() {
  return (
    <ul className="divide-y divide-border/30">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="px-4 py-2.5">
          <div className="h-4 w-3/4 rounded bg-muted/50 animate-pulse" />
          <div className="h-3 w-1/3 rounded bg-muted/30 animate-pulse mt-1.5" />
        </li>
      ))}
    </ul>
  );
}

function shortenCategory(category: string): string {
  if (!category) return "venue";
  const lower = category.toLowerCase();
  if (lower.includes("ktv")) return "ktv";
  if (lower.includes("massage") || lower.includes("spa")) return "spa";
  if (lower.includes("nightclub") || lower.includes("club")) return "club";
  if (lower.includes("pub") || lower.includes("bar")) return "bar";
  return "venue";
}

export function BrowseWidgets({
  topVenues,
  newUpdates,
  isLoading,
}: BrowseWidgetsProps) {
  const t = useTranslations("browse");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      <WidgetShell title={t("topVenues")} icon={Star} iconClassName="text-emerald-500">
        {isLoading ? (
          <VenueListSkeleton />
        ) : topVenues.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">{t("noVenues")}</p>
        ) : (
          <ul className="divide-y divide-border/30">
            {topVenues.map((venue) => (
              <li key={`top-${venue.id}`}>
                <Link
                  href={venue.href}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-secondary/40 transition-colors"
                >
                  <span className="text-sm font-medium truncate">{venue.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{venue.cityName}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </WidgetShell>

      <WidgetShell title={t("newUpdates")} icon={Clock} iconClassName="text-sky-500">
        {isLoading ? (
          <VenueListSkeleton />
        ) : newUpdates.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">{t("noVenues")}</p>
        ) : (
          <ul className="divide-y divide-border/30">
            {newUpdates.map((venue) => (
              <li key={`new-${venue.id}`}>
                <Link
                  href={venue.href}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-secondary/40 transition-colors"
                >
                  <span className="text-sm font-medium truncate">{venue.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0 capitalize">
                    {shortenCategory(venue.category)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </WidgetShell>
    </div>
  );
}
