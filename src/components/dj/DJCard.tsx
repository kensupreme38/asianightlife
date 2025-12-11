"use client";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, User } from "lucide-react";
import { SimpleImage } from "@/components/ui/simple-image";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import { MotionHover } from "@/components/animations";

export interface DJ {
  id: string;
  name: string;
  image_url?: string;
  bio?: string;
  votes_count: number;
  rank?: number;
  genres?: string[];
  country?: string;
  created_at?: string;
}

interface DJCardProps {
  dj: DJ;
  onVote?: (djId: string) => void;
  hasVoted?: boolean;
  isAuthenticated?: boolean;
}

export const DJCard = ({ dj, onVote, hasVoted = false, isAuthenticated = false }: DJCardProps) => {
  const t = useTranslations();
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasVoted || isVoting) return;

    if (!isAuthenticated && onVote) {
      await onVote(dj.id);
      return;
    }

    setIsVoting(true);
    try {
      if (onVote) {
        await onVote(dj.id);
      }
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <MotionHover scale={1.02} y={-4} className="h-full">
    <div className="group card-elevated rounded-xl overflow-hidden hover-glow transition-all duration-300 h-full flex flex-col">
      <Link
        href={`/dj/${dj.id}`}
        className="block flex-1 flex flex-col"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
          <SimpleImage
            src={dj.image_url || ""}
            alt={dj.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fallback="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop&q=80"
          />

          {/* Rank Badge */}
          {dj.rank && dj.rank > 0 && (
            <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3 z-10">
              <Badge
                variant="default"
                className="bg-primary/90 hover:bg-primary text-white font-bold text-[10px] md:text-sm px-1.5 md:px-3 py-0.5 md:py-1.5 shadow-lg backdrop-blur-sm border border-primary/20"
              >
                <TrendingUp className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 mr-0.5 md:mr-1.5" />
                <span className="font-headline">#{dj.rank}</span>
              </Badge>
            </div>
          )}

          {/* Votes Count */}
          <div className="absolute top-3 right-3 hidden md:block">
            <div className="text-white font-bold text-xs bg-black/60 px-4 py-1 rounded-xl flex items-center gap-1">
              <Heart className={`h-3 w-3 ${hasVoted ? "fill-red-500 text-red-500" : ""}`} />
              {dj.votes_count || 0}
            </div>
          </div>

          {/* Genres */}
          {dj.genres && dj.genres.length > 0 && (
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
              <Badge variant="secondary" className="bg-black/60 text-white truncate text-xs">
                {dj.genres[0]}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="md:p-4 px-2.5 space-y-3 py-1 flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-bold text-sm md:text-lg line-clamp-1 group-hover:text-primary transition-colors font-headline">
                {dj.name}
              </h3>
            </div>

            <div className="flex items-center text-muted-foreground text-xs md:text-sm">
              <User className="h-3 w-3 md:w-4 md:h-4 mr-1 shrink-0" />
              <span className="line-clamp-1">{dj.country || t('dj.unknown')}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Vote Button */}
      <div className="md:px-4 p-2.5 pt-0 mt-2 md:mt-0 flex-shrink-0">
        <Button
          onClick={handleVote}
          className="w-full"
          size="sm"
          variant={hasVoted ? "secondary" : "neon"}
          disabled={hasVoted || isVoting}
        >
          <Heart className={`h-4 w-4 md:mr-2 ${hasVoted ? "fill-red-500 text-red-500" : ""}`} />
          <span className="hidden md:inline">
            {hasVoted ? t('dj.voted') : isVoting ? t('dj.voting') : t('dj.vote')}
          </span>
        </Button>
      </div>
    </div>
    </MotionHover>
  );
};

