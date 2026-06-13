"use client";

import ReactMarkdown from "react-markdown";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Link } from "@/i18n/routing";
import type { GuideArticle } from "@/lib/guides";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { whatsappMessageUrl } from "@/lib/constants";
import { useTranslations } from "next-intl";

export function GuideDetailClient({ guide }: { guide: GuideArticle }) {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      <main className="container py-8 px-4 max-w-3xl">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: t("guides.title"), href: "/guides" },
            { label: guide.title, href: `/guides/${guide.slug}` },
          ]}
        />
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold font-headline gradient-text mb-6 not-prose">
            {guide.title}
          </h1>
          <ReactMarkdown>{guide.content}</ReactMarkdown>
        </article>
        <div className="mt-10 p-6 rounded-xl bg-secondary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold">{t("guides.needHelp")}</p>
            <p className="text-sm text-muted-foreground">{t("guides.conciergeDesc")}</p>
          </div>
          <Button variant="neon" asChild>
            <a
              href={whatsappMessageUrl(`Hi, I read your guide on ${guide.title}. Can you help me book?`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </a>
          </Button>
        </div>
        {guide.relatedCitySlug && (
          <div className="mt-6">
            <Link href={`/${guide.relatedCitySlug}`} className="text-primary hover:underline text-sm">
              → {t("guides.exploreCity")}
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
