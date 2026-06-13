"use client";

import { useState } from "react";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

interface VenueReviewsProps {
  venueName: string;
  venueSlug: string;
}

const SAMPLE_REVIEWS = [
  {
    id: "1",
    author: "Michael T.",
    rating: 5,
    date: "2026-01-15",
    text: "Booked through Asia Night Life — smooth process, great venue, exactly as described. WhatsApp concierge was super responsive.",
    source: "verified",
  },
  {
    id: "2",
    author: "Jason L.",
    rating: 5,
    date: "2025-12-08",
    text: "First time at a KTV in Singapore. ANL team helped with pricing and room selection. Will book again.",
    source: "verified",
  },
  {
    id: "3",
    author: "David K.",
    rating: 4,
    date: "2025-11-22",
    text: "Good experience overall. VIP room was clean and staff were friendly. Booking confirmation via WhatsApp was quick.",
    source: "telegram",
  },
];

export function VenueReviews({ venueName }: VenueReviewsProps) {
  const t = useTranslations();
  const [showForm, setShowForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const avgRating =
    SAMPLE_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / SAMPLE_REVIEWS.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmitted(true);
    setShowForm(false);
    setReviewText("");
  };

  return (
    <div className="card-elevated rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-headline">{t("reviews.title")}</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(avgRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold">{avgRating.toFixed(1)}</span>
            <span className="text-muted-foreground text-sm">
              ({SAMPLE_REVIEWS.length} {t("reviews.reviews")})
            </span>
          </div>
        </div>
        <Button variant="outline" onClick={() => setShowForm(!showForm)}>
          <MessageSquare className="h-4 w-4 mr-2" />
          {t("reviews.writeReview")}
        </Button>
      </div>

      {submitted && (
        <div className="mb-4 p-4 rounded-lg bg-green-500/10 text-green-600 text-sm">
          {t("reviews.thankYou")}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-lg bg-secondary/30 space-y-3">
          <p className="text-sm text-muted-foreground">
            {t("reviews.formDesc", { venue: venueName })}
          </p>
          <Textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={t("reviews.placeholder")}
            rows={3}
            required
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm">{t("reviews.submit")}</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {SAMPLE_REVIEWS.map((review) => (
          <div key={review.id} className="border-b border-border/40 pb-4 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{review.author}</span>
                {review.source === "verified" && (
                  <Badge variant="secondary" className="text-xs">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {t("reviews.verified")}
                  </Badge>
                )}
                {review.source === "telegram" && (
                  <Badge variant="outline" className="text-xs">Telegram</Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{review.text}</p>
            <p className="text-xs text-muted-foreground/60 mt-1">{review.date}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4">{t("reviews.disclaimer")}</p>
    </div>
  );
}
