"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/routing";
import { BLOG_CATEGORIES, BLOG_POSTS } from "@/lib/blog";
import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageBreadcrumbBar } from "@/components/layout/Breadcrumbs";
import { blogIndexBreadcrumbs } from "@/lib/breadcrumbs";
import { BlogCard } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | (typeof BLOG_CATEGORIES)[number];

export function BlogIndexClient() {
  const t = useTranslations();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const sortedPosts = useMemo(
    () =>
      [...BLOG_POSTS].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      ),
    []
  );

  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") return sortedPosts;
    return sortedPosts.filter((p) => p.category === activeCategory);
  }, [activeCategory, sortedPosts]);

  const featuredPost = sortedPosts[0];
  const gridPosts =
    activeCategory === "all" && featuredPost
      ? filteredPosts.filter((p) => p.slug !== featuredPost.slug)
      : filteredPosts;

  const filters: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: t("blog.allCategories") },
    ...BLOG_CATEGORIES.map((id) => ({
      id,
      label: t(`blog.categories.${id}`),
    })),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      <PageBreadcrumbBar
        items={blogIndexBreadcrumbs({
          home: t("common.home"),
          blog: t("blog.title"),
        })}
      />
      <main id="main-content" className="container py-10 md:py-12 px-4">
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold font-headline gradient-text mb-3">
            {t("blog.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl">{t("blog.subtitle")}</p>
        </div>

        {activeCategory === "all" && featuredPost && (
          <section className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {t("blog.featured")}
            </p>
            <BlogCard post={featuredPost} variant="featured" priority />
          </section>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveCategory(filter.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                activeCategory === filter.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {gridPosts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {gridPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-12">{t("blog.noPosts")}</p>
        )}

        <section className="mt-12 md:mt-16 rounded-xl border border-border/60 bg-secondary/20 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-1">{t("blog.guidesCtaTitle")}</h2>
              <p className="text-sm text-muted-foreground max-w-md">{t("blog.guidesCtaDesc")}</p>
            </div>
          </div>
          <Button variant="outline" asChild className="shrink-0">
            <Link href="/guides">{t("blog.viewGuides")}</Link>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
