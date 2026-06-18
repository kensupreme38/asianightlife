"use client";

import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  breadcrumbsFromPathname,
  type BreadcrumbItem as CrumbItem,
} from "@/lib/breadcrumbs";

interface BreadcrumbsProps {
  items?: CrumbItem[];
  variant?: "default" | "muted";
  className?: string;
}

export function Breadcrumbs({
  items,
  variant = "default",
  className,
}: BreadcrumbsProps) {
  const pathname = usePathname();
  const t = useTranslations();

  const labels = {
    home: t("common.home"),
    countries: t("breadcrumbs.countries"),
    categories: t("breadcrumbs.categories"),
    guides: t("guides.title"),
    trips: t("trips.title"),
    djs: t("common.djVoting"),
  };

  const breadcrumbItems: CrumbItem[] =
    items ?? breadcrumbsFromPathname(pathname, labels);

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  const muted = variant === "muted";

  return (
    <Breadcrumb className={cn("mb-0", className)}>
      <BreadcrumbList
        className={cn(
          "flex-wrap gap-y-1",
          muted && "text-white/80 [&_svg]:text-white/60"
        )}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isHome = index === 0;

          return (
            <Fragment key={`${item.href}-${item.label}-${index}`}>
              {index > 0 && (
                <BreadcrumbSeparator
                  className={cn(muted && "text-white/40")}
                />
              )}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage
                    className={cn(
                      "font-medium max-w-[200px] sm:max-w-xs truncate",
                      muted && "text-white"
                    )}
                  >
                    {isHome ? (
                      <Home className="h-4 w-4 shrink-0" aria-hidden />
                    ) : (
                      <span className="truncate">{item.label}</span>
                    )}
                    {isHome && (
                      <span className="sr-only">{item.label}</span>
                    )}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-1 max-w-[160px] sm:max-w-xs truncate",
                        muted && "text-white/80 hover:text-white"
                      )}
                    >
                      {isHome ? (
                        <>
                          <Home className="h-4 w-4 shrink-0" aria-hidden />
                          <span className="sr-only">{item.label}</span>
                        </>
                      ) : (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

interface PageBreadcrumbBarProps {
  items: CrumbItem[];
  className?: string;
}

/** Breadcrumb strip below the site header on landing / content pages. */
export function PageBreadcrumbBar({ items, className }: PageBreadcrumbBarProps) {
  return (
    <div
      className={cn(
        "border-b border-border/40 bg-background/95 backdrop-blur-sm",
        className
      )}
    >
      <div className="container px-4 sm:px-6 py-2.5">
        <Breadcrumbs items={items} />
      </div>
    </div>
  );
}
