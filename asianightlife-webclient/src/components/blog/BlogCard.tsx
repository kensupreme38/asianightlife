"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import type { BlogPost } from "@/lib/blog";
import { NativeImage } from "@/components/ui/native-image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const BLOG_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200";

type BlogCardProps = {
  post: BlogPost;
  variant?: "default" | "featured" | "compact";
  priority?: boolean;
};

export function BlogCard({ post, variant = "default", priority = false }: BlogCardProps) {
  const t = useTranslations();
  const isFeatured = variant === "featured";
  const [imageSrc, setImageSrc] = useState(post.coverImage);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "card-elevated rounded-xl overflow-hidden hover-glow transition-all group flex flex-col",
        isFeatured && "md:grid md:grid-cols-2 md:gap-0"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-muted shrink-0",
          isFeatured ? "aspect-[16/10] md:aspect-auto md:min-h-[320px]" : "aspect-[16/10]"
        )}
      >
        <NativeImage
          key={imageSrc}
          src={imageSrc}
          alt={post.coverImageAlt}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => {
            if (imageSrc !== BLOG_IMAGE_FALLBACK) setImageSrc(BLOG_IMAGE_FALLBACK);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 text-xs bg-background/90 backdrop-blur-sm"
        >
          {t(`blog.categories.${post.category}`)}
        </Badge>
      </div>

      <div className={cn("flex flex-col flex-1 p-5", isFeatured && "md:justify-center md:p-8")}>
        <h2
          className={cn(
            "font-semibold group-hover:text-primary transition-colors mb-2 line-clamp-2",
            isFeatured ? "text-xl md:text-2xl font-bold" : "text-lg"
          )}
        >
          {post.title}
        </h2>
        <p
          className={cn(
            "text-muted-foreground mb-4",
            isFeatured ? "text-sm md:text-base line-clamp-3" : "text-sm line-clamp-2"
          )}
        >
          {post.description}
        </p>
        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 shrink-0" />
              {new Date(post.publishedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 shrink-0" /> {post.readTime}
            </span>
          </div>
          <span className="flex items-center gap-1 text-primary font-medium shrink-0">
            {t("blog.read")} <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
