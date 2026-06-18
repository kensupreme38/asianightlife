"use client";

import ReactMarkdown from "react-markdown";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumbBar } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import { whatsappMessageUrl, TELEGRAM_URL } from "@/lib/constants";
import type { TrustPage } from "@/lib/trust-pages";
import { useTranslations } from "next-intl";
import { trustPageBreadcrumbs } from "@/lib/breadcrumbs";

export function TrustPageClient({ page }: { page: TrustPage }) {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      <PageBreadcrumbBar
        items={trustPageBreadcrumbs(page, { home: t("common.home") })}
      />
      <main id="main-content" className="container py-8 px-4 max-w-3xl">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold font-headline gradient-text mb-2 not-prose">
            {page.title}
          </h1>
          <p className="text-muted-foreground mb-8 not-prose">{page.description}</p>
          <ReactMarkdown>{page.content}</ReactMarkdown>
        </article>
        {(page.slug === "contact" || page.slug === "about" || page.slug === "booking-policy") && (
          <div className="mt-10 p-6 rounded-xl bg-secondary/30 flex flex-col sm:flex-row items-center justify-between gap-4 not-prose">
            <div>
              <p className="font-semibold">{t("trust.needHelp")}</p>
              <p className="text-sm text-muted-foreground">{t("trust.conciergeDesc")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="neon" asChild>
                <a
                  href={whatsappMessageUrl(t("trust.whatsappMessage"))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <Send className="h-4 w-4 mr-2" />
                  Telegram
                </a>
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
