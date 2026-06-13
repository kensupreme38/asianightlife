"use client";

import { useState } from "react";
import { Sparkles, X, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { whatsappMessageUrl } from "@/lib/constants";

const QUICK_QUESTIONS = [
  "Best KTV tonight?",
  "Best club in HCMC?",
  "Best VIP room in Singapore?",
  "Budget under SGD 500?",
];

export function AIConcierge() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async (question: string) => {
    setQuery(question);
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setResponse(data.answer || t("concierge.fallback"));
    } catch {
      setResponse(t("concierge.fallback"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) ask(query.trim());
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-4 z-50 rounded-full shadow-lg neon-glow gap-2 px-4"
        variant="neon"
        size="lg"
        aria-label={t("concierge.ask")}
      >
        <Sparkles className="h-5 w-5" />
        <span className="hidden sm:inline">{t("concierge.ask")}</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col border border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-red-bright" />
                <h3 className="font-bold font-headline">{t("concierge.title")}</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              <p className="text-sm text-muted-foreground">{t("concierge.intro")}</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => ask(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-red-bright hover:text-primary transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
              {loading && (
                <p className="text-sm text-muted-foreground animate-pulse">{t("concierge.thinking")}</p>
              )}
              {response && (
                <div className="p-3 rounded-lg bg-secondary/40 text-sm whitespace-pre-wrap">{response}</div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-border flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("concierge.placeholder")}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={loading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {response && (
              <div className="px-4 pb-4">
                <Button variant="neon" className="w-full" asChild>
                  <a
                    href={whatsappMessageUrl(`Hi ANL AI suggested:\n\n${response}\n\nMy question was: ${query}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t("concierge.bookWhatsApp")}
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
