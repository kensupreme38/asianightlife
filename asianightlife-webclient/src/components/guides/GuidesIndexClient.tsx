"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/routing";
import { GUIDES } from "@/lib/guides";
import { BookOpen, Clock, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

const CATEGORY_LABELS: Record<string, string> = {
  basics: "Basics",
  "city-guide": "City Guides",
  "how-to": "How-To",
  glossary: "Glossary",
};

export function GuidesIndexClient() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      <main className="container py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline gradient-text mb-3">
          {t("guides.title")}
        </h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">{t("guides.subtitle")}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="card-elevated rounded-xl p-5 hover-glow transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <BookOpen className="h-5 w-5 text-red-bright" />
                <Badge variant="secondary" className="text-xs">
                  {CATEGORY_LABELS[guide.category]}
                </Badge>
              </div>
              <h2 className="font-semibold text-lg group-hover:text-primary transition-colors mb-2">
                {guide.title}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {guide.description}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {guide.readTime}
                </span>
                <span className="flex items-center gap-1 text-primary">
                  {t("guides.read")} <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
