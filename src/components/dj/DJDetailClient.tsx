"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleImage } from "@/components/ui/simple-image";
import { Heart, TrendingUp, User, ArrowLeft, Edit, Loader2, Share2, Music2, Calendar, Globe, Sparkles, Award, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/hooks/use-toast";
import { DJ } from "./DJCard";
import { Link } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { useMemo, useCallback } from "react";
import { Separator } from "@/components/ui/separator";

interface DJDetailClientProps {
  id: string;
}

export default function DJDetailClient({ id }: DJDetailClientProps) {
  const [dj, setDJ] = useState<DJ & { user_id?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const router = useRouter();
  const { currentUser } = useAuth();
  const searchParams = useSearchParams();
  const searchQuery = useMemo(() => searchParams?.get("q") || "", [searchParams]);

  const handleSearchChange = useCallback((query: string) => {
    const newParams = new URLSearchParams(searchParams?.toString() ?? "");
    if (query) {
      newParams.set("q", query);
    } else {
      newParams.delete("q");
    }
    router.push(`/?${newParams.toString()}`);
  }, [router, searchParams]);

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined" || !dj) return;

    const shareData = {
      title: dj.name,
      text: `Check out ${dj.name} on DJ Voting!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Profile link has been copied to clipboard",
        });
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error sharing:", error);
      }
    }
  }, [dj, toast]);

  const fetchDJ = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/djs/${id}`);
      if (response.ok) {
        const data = await response.json();
        setDJ(data);
      } else {
        toast({
          title: "Error",
          description: "DJ not found",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching DJ:", error);
      toast({
        title: "Error",
        description: "Failed to load DJ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  const checkVoteStatus = useCallback(async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/votes?dj_id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setHasVoted(data.votes && data.votes.length > 0);
      }
    } catch (error) {
      console.error("Error checking vote status:", error);
    }
  }, [id, currentUser]);

  useEffect(() => {
    fetchDJ();
  }, [fetchDJ]);

  useEffect(() => {
    if (!currentUser) {
      setHasVoted(false);
      return;
    }
    checkVoteStatus();
  }, [currentUser, checkVoteStatus]);

  const handleVote = useCallback(async () => {
    if (!currentUser) {
      router.push(`/login?redirect=/dj/${id}`);
      return;
    }

    if (hasVoted || isVoting) return;

    setIsVoting(true);
    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dj_id: id }),
      });

      if (response.ok) {
        const data = await response.json();
        setDJ((prev) =>
          prev ? { ...prev, votes_count: data.votes_count } : null
        );
        setHasVoted(true);
        toast({
          title: "Success",
          description: "Vote submitted successfully!",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to submit vote",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to submit vote",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  }, [currentUser, hasVoted, isVoting, id, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!dj) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        <main>
          <div className="container px-3 py-12">
            <ScrollReveal animation="fade-up" delay={100} threshold={0.2}>
              <Card className="max-w-2xl mx-auto p-8 text-center">
                <h2 className="text-2xl font-bold mb-4 font-headline">
                  <span className="gradient-text">DJ Not Found</span>
                </h2>
                <Button onClick={() => router.push("/dj")} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to DJ List
                </Button>
              </Card>
            </ScrollReveal>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwner = currentUser && dj.user_id === currentUser.id;

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      <main className="relative">
        {/* Hero Section with DJ Image */}
        <section className="relative w-full min-h-[60vh] md:min-h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <SimpleImage
              src={dj.image_url || ""}
              alt={dj.name}
              fill
              className="object-cover scale-105 transition-transform duration-700"
              fallback="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop&q=80"
            />
            {/* Multi-layer gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
          </div>
          
          <div className="relative z-10 container px-3 py-8 md:py-12">
            {/* Back Button */}
            <ScrollReveal animation="fade-up" delay={0} threshold={0.2}>
              <Button
                variant="ghost"
                size="sm"
                className="mb-6 text-sm font-medium gap-2 hover:bg-primary/10 backdrop-blur-sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </ScrollReveal>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                {/* Left: DJ Image Avatar */}
                <div className="md:col-span-4">
                  <ScrollReveal animation="fade-up" delay={100} threshold={0.2}>
                    <div className="relative">
                      <div className="relative aspect-square rounded-2xl overflow-hidden border-4 border-primary/20 shadow-2xl neon-glow">
                        <SimpleImage
                          src={dj.image_url || ""}
                          alt={dj.name}
                          fill
                          className="object-cover"
                          fallback="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop&q=80"
                        />
                      </div>
                      {/* Decorative gradient ring */}
                      <div className="absolute -inset-2 rounded-2xl bg-gradient-primary opacity-20 blur-xl -z-10 animate-pulse-neon" />
                    </div>
                  </ScrollReveal>
                </div>

                {/* Right: DJ Info */}
                <div className="md:col-span-8">
                  <ScrollReveal animation="fade-up" delay={200} threshold={0.2}>
                    <div className="space-y-6">
                      {/* Badge */}
                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
                          <Music2 className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-primary uppercase tracking-wide font-headline">
                          DJ Profile
                        </span>
                      </div>
                      
                      {/* Name */}
                      <div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-3 leading-tight font-headline">
                          <span className="gradient-text">{dj.name}</span>
                        </h1>
                        {dj.country && (
                          <div className="flex items-center text-muted-foreground text-lg">
                            <Globe className="h-4 w-4 mr-2" />
                            <span>{dj.country}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Stats Row */}
                      <div className="flex flex-wrap items-center gap-4">
                        {dj.rank && (
                          <Badge variant="default" className="text-base px-5 py-2.5 gap-2 font-headline">
                            <Award className="h-4 w-4" />
                            Rank #{dj.rank}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-base px-5 py-2.5 gap-2 font-headline">
                          <Heart className="h-4 w-4" />
                          {dj.votes_count || 0} Votes
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {!isOwner && (
                          <Button
                            onClick={handleVote}
                            variant={hasVoted ? "secondary" : "default"}
                            disabled={hasVoted || isVoting}
                            size="lg"
                            className="gap-2 font-headline text-base px-6 py-6 h-auto"
                          >
                            <Heart
                              className={`h-5 w-5 ${hasVoted ? "fill-red-500 text-red-500" : ""}`}
                            />
                            {currentUser
                              ? hasVoted
                                ? "Voted"
                                : isVoting
                                  ? "Voting..."
                                  : "Vote Now"
                              : "Login to Vote"}
                          </Button>
                        )}
                        {isOwner && (
                          <Link href={`/dj/profile/edit`}>
                            <Button variant="default" size="lg" className="gap-2 font-headline text-base px-6 py-6 h-auto">
                              <Edit className="h-5 w-5" />
                              Edit Profile
                            </Button>
                          </Link>
                        )}
                        <Button
                          onClick={handleShare}
                          variant="outline"
                          size="lg"
                          className="gap-2 font-headline text-base px-6 py-6 h-auto border-2"
                        >
                          <Share2 className="h-5 w-5" />
                          Share
                        </Button>
                      </div>
                      {!currentUser && !isOwner && (
                        <p className="text-sm text-muted-foreground">
                          Please login to cast your vote for this DJ.
                        </p>
                      )}
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <div className="container px-3 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Stats Cards */}
              <div className="lg:col-span-1 space-y-6">
                {/* Statistics Card */}
                <ScrollReveal animation="fade-up" delay={100} threshold={0.2}>
                  <Card className="card-elevated border-2 overflow-hidden">
                    <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent border-b">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-lg">Statistics</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-5">
                      {/* Rank & Votes Row */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Rank */}
                        {dj.rank && (
                          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rank</span>
                            </div>
                            <div className="text-2xl font-bold font-headline gradient-text">
                              #{dj.rank}
                            </div>
                          </div>
                        )}

                        {/* Votes */}
                        <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/50 via-secondary/30 to-transparent border border-border hover:border-primary/20 transition-all hover:shadow-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="h-4 w-4 text-primary fill-primary/30" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Votes</span>
                          </div>
                          <div className="text-2xl font-bold font-headline">
                            {dj.votes_count || 0}
                          </div>
                        </div>
                      </div>

                      {/* Genres */}
                      {dj.genres && dj.genres.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold text-foreground">Genres</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {dj.genres.map((genre, idx) => (
                              <Badge 
                                key={idx} 
                                variant="secondary" 
                                className="text-xs px-3 py-1.5 font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                              >
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Created Date */}
                      {dj.created_at && (
                        <div className="pt-4 border-t border-border/50">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1">Joined</span>
                              <span className="text-sm font-medium text-foreground">
                                {new Date(dj.created_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </div>

              {/* Right Column - Bio and Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Card */}
                <ScrollReveal animation="fade-up" delay={200} threshold={0.2}>
                  <Card className="card-elevated border-2 overflow-hidden">
                    <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="font-headline text-xl mb-1">
                            <span className="gradient-text">About</span>
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Learn more about this talented DJ
                          </CardDescription>
                        </div>
                        <Music2 className="h-6 w-6 text-primary/30" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {dj.bio ? (
                        <div className="prose prose-base max-w-none dark:prose-invert prose-p:text-foreground/90 prose-p:leading-relaxed">
                          <p className="whitespace-pre-line text-base md:text-lg font-body">
                            {dj.bio}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                            <Music2 className="h-8 w-8 text-muted-foreground/50" />
                          </div>
                          <p className="text-muted-foreground italic text-base mb-4">
                            No bio available yet.
                          </p>
                          {isOwner && (
                            <Link href={`/dj/profile/edit`}>
                              <Button variant="outline" size="sm" className="gap-2">
                                <Edit className="h-4 w-4" />
                                Add Bio
                              </Button>
                            </Link>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

