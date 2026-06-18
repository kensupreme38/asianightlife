"use client";

import { useState } from "react";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumbBar } from "@/components/layout/Breadcrumbs";
import { Link } from "@/i18n/routing";
import type { BlogPost } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MessageCircle, Share2, Link2, Check } from "lucide-react";
import { whatsappMessageUrl, SITE_URL } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { blogBreadcrumbs } from "@/lib/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { NativeImage } from "@/components/ui/native-image";
import { BlogCard } from "@/components/blog/BlogCard";
import { useToast } from "@/components/ui/use-toast";
import { usePathname } from "@/i18n/routing";

const BLOG_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200";

type BlogDetailClientProps = {
  post: BlogPost;
  relatedPosts: BlogPost[];
};

export function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [heroSrc, setHeroSrc] = useState(post.coverImage);

  const shareUrl = `${SITE_URL.replace(/\/$/, "")}${pathname}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: t("blog.linkCopied") });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: t("common.error"), variant: "destructive" });
    }
  };

  const handleShareWhatsApp = () => {
    const text = `${post.title} — ${shareUrl}`;
    window.open(whatsappMessageUrl(text), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      <PageBreadcrumbBar
        items={blogBreadcrumbs(post, {
          home: t("common.home"),
          blog: t("blog.title"),
        })}
      />

      <div className="relative w-full aspect-[21/9] md:aspect-[21/8] max-h-[420px] overflow-hidden bg-muted">
        <NativeImage
          key={heroSrc}
          src={heroSrc}
          alt={post.coverImageAlt}
          fill
          priority
          loading="eager"
          className="object-cover"
          onError={() => {
            if (heroSrc !== BLOG_IMAGE_FALLBACK) setHeroSrc(BLOG_IMAGE_FALLBACK);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30" />
      </div>

      <main id="main-content" className="container px-4 -mt-12 md:-mt-16 relative z-10 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="secondary">{t(`blog.categories.${post.category}`)}</Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.publishedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> {post.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline gradient-text mb-4 leading-snug break-words [overflow-wrap:anywhere]">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">{post.description}</p>

          <p className="text-sm text-muted-foreground mb-8">
            {t("blog.byAuthor", { author: post.author })}
          </p>

          <MarkdownContent>{post.content}</MarkdownContent>

          {post.keywords.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border/60">
              <p className="text-sm font-semibold mb-3">{t("blog.tags")}</p>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
              <Share2 className="h-4 w-4" /> {t("blog.share")}
            </span>
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              {copied ? (
                <Check className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <Link2 className="h-4 w-4 mr-2" />
              )}
              {t("blog.copyLink")}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareWhatsApp}>
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>

          <div className="mt-10 p-6 rounded-xl bg-secondary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{t("blog.needHelp")}</p>
              <p className="text-sm text-muted-foreground">{t("blog.conciergeDesc")}</p>
            </div>
            <Button variant="neon" asChild>
              <a
                href={whatsappMessageUrl(
                  `Hi, I read your article "${post.title}". Can you help me plan my nightlife trip?`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </a>
            </Button>
          </div>

          {post.relatedCitySlug && (
            <div className="mt-6">
              <Link
                href={`/${post.relatedCitySlug}`}
                className="text-primary hover:underline text-sm"
              >
                → {t("blog.exploreCity")}
              </Link>
            </div>
          )}
        </div>

        {relatedPosts.length > 0 && (
          <section className="mt-16 md:mt-20 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold font-headline mb-6">{t("blog.relatedPosts")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {relatedPosts.map((related) => (
                <BlogCard key={related.slug} post={related} variant="compact" />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
