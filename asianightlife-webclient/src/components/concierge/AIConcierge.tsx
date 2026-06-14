"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, MessageCircle } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale, useTranslations } from "next-intl";
import { whatsappMessageUrl } from "@/lib/constants";
import {
  linkifyConciergeMarkdown,
  normalizeConciergeMarkdown,
  resolveConciergeHref,
} from "@/lib/concierge-markdown";
import remarkBreaks from "remark-breaks";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { Components } from "react-markdown";

const QUICK_QUESTIONS = [
  "Best KTV tonight?",
  "Best club in HCMC?",
  "Best VIP room in Singapore?",
  "Budget under SGD 500?",
];

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function toPlainText(markdown: string): string {
  return normalizeConciergeMarkdown(markdown)
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/^\*\s+/gm, "• ")
    .replace(/^-\s+/gm, "• ")
    .trim();
}

const LOGO_PATH = "/logo.jpg";

function ConciergeAvatar({ size = "md" }: { size?: "sm" | "md" }) {
  const [logoError, setLogoError] = useState(false);
  const isSmall = size === "sm";

  if (logoError) {
    return (
      <div
        className={cn(
          "shrink-0 rounded-full bg-red-bright/15 border border-red-bright/30 flex items-center justify-center",
          isSmall ? "h-7 w-7 mt-0.5" : "h-10 w-10"
        )}
      >
        <Sparkles className={cn("text-red-bright", isSmall ? "h-3.5 w-3.5" : "h-5 w-5")} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "shrink-0 rounded-full overflow-hidden border border-red-bright/30 bg-background",
        isSmall ? "h-7 w-7 mt-0.5" : "h-10 w-10"
      )}
    >
      <Image
        src={LOGO_PATH}
        alt="Asia Night Life AI"
        width={isSmall ? 28 : 40}
        height={isSmall ? 28 : 40}
        className="h-full w-full object-cover"
        onError={() => setLogoError(true)}
      />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-md bg-secondary/80 w-fit">
      <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
      <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
      <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
    </div>
  );
}

function AssistantBubble({
  content,
  className,
  onLinkClick,
}: {
  content: string;
  className?: string;
  onLinkClick?: () => void;
}) {
  const linkedContent = linkifyConciergeMarkdown(normalizeConciergeMarkdown(content));

  const markdownComponents: Components = {
    a: ({ href, children }) => {
      if (!href) return <span>{children}</span>;

      const { internal, path } = resolveConciergeHref(href);
      const className =
        "text-primary underline underline-offset-2 hover:text-red-bright font-medium break-all";

      if (internal) {
        return (
          <Link
            href={path}
            className={className}
            onClick={() => onLinkClick?.()}
          >
            {children}
          </Link>
        );
      }

      return (
        <a href={path} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
        </a>
      );
    },
  };

  return (
    <div
      className={cn(
        "px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-secondary/80 text-sm",
        "prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0 prose-headings:my-1.5 prose-headings:text-sm prose-headings:font-semibold prose-headings:text-foreground prose-strong:text-foreground prose-strong:font-semibold prose-a:no-underline text-foreground/90",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkBreaks]} components={markdownComponents}>
        {linkedContent}
      </ReactMarkdown>
    </div>
  );
}

export function AIConcierge() {
  const t = useTranslations();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pinnedToBottomRef = useRef(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const handleMessagesScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    pinnedToBottomRef.current = distanceFromBottom < 64;
  }, []);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const { body, documentElement: html } = document;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    body.style.touchAction = "none";

    const lenis = (window as Window & { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();

    return () => {
      body.style.overflow = prevBodyOverflow;
      html.style.overflow = prevHtmlOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.width = prevBodyWidth;
      body.style.touchAction = "";
      lenis?.start();
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (pinnedToBottomRef.current) {
      scrollToBottom();
    }
  }, [messages, loading, scrollToBottom]);

  useEffect(() => {
    if (!open) return;
    pinnedToBottomRef.current = true;
    requestAnimationFrame(() => scrollToBottom());
  }, [open, scrollToBottom]);

  useEffect(() => {
    if (open && !initialized) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: t("concierge.intro"),
        },
      ]);
      setInitialized(true);
    }
  }, [open, initialized, t]);

  const ask = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    pinnedToBottomRef.current = true;
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, locale }),
      });
      const data = await res.json();
      const answer = data.answer || t("concierge.fallback");

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: answer,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: t("concierge.fallback"),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  const lastUserQuestion =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const lastAssistantAnswer =
    [...messages].reverse().find((m) => m.role === "assistant" && m.id !== "welcome")?.content ?? "";

  const showQuickQuestions = messages.length <= 1 && !loading;

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
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 overscroll-none"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-background shadow-2xl w-full sm:max-w-md h-[100dvh] sm:h-[min(640px,85vh)] grid grid-rows-[auto_minmax(0,1fr)_auto_auto] border border-border sm:rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm shrink-0">
              <ConciergeAvatar size="md" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold font-headline text-sm leading-tight">{t("concierge.title")}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Online
                </p>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              data-lenis-prevent
              onScroll={handleMessagesScroll}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="overflow-y-scroll overscroll-y-contain touch-pan-y px-3 py-4 bg-secondary/10 [webkit-overflow-scrolling:touch]"
            >
              <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && <ConciergeAvatar size="sm" />}

                  <div
                    className={cn(
                      "max-w-[85%] min-w-0",
                      msg.role === "user" ? "order-first" : ""
                    )}
                  >
                    {msg.role === "user" ? (
                      <div className="px-3.5 py-2.5 rounded-2xl rounded-br-md bg-primary text-primary-foreground text-sm leading-relaxed">
                        {msg.content}
                      </div>
                    ) : (
                      <AssistantBubble content={msg.content} onLinkClick={() => setOpen(false)} />
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 justify-start">
                  <ConciergeAvatar size="sm" />
                  <TypingIndicator />
                </div>
              )}

              {showQuickQuestions && (
                <div className="flex flex-wrap gap-2 pt-1 pl-9">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => ask(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:border-red-bright hover:text-primary transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              </div>
            </div>

            {/* WhatsApp CTA */}
            {lastAssistantAnswer && !loading && (
              <div className="px-3 py-2 border-t border-border/60 bg-background shrink-0">
                <Button variant="outline" size="sm" className="w-full h-9 text-xs" asChild>
                  <a
                    href={whatsappMessageUrl(
                      `Hi ANL AI suggested:\n\n${toPlainText(lastAssistantAnswer)}\n\nMy question was: ${lastUserQuestion}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-2" />
                    {t("concierge.bookWhatsApp")}
                  </a>
                </Button>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-border bg-background shrink-0 flex gap-2 items-center"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("concierge.placeholder")}
                className="flex-1 rounded-full h-10 bg-secondary/30 border-border/60"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full h-10 w-10 shrink-0"
                disabled={loading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
