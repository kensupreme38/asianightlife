"use client";
import { useState, useEffect, useMemo } from "react";
import { DJGrid } from "./DJGrid";
import { DJ } from "./DJCard";
import { Button } from "@/components/ui/button";
import { Plus, User, X } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DJHeroBanner } from "./DJHeroBanner";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from 'next-intl';

export default function DJClient() {
  const t = useTranslations();
  const [djs, setDJs] = useState<DJ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("votes");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [userProfile, setUserProfile] = useState<{ id: string } | null>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchDJs();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setUserProfile(null);
      return;
    }
    fetchUserVotes();
    checkUserProfile();
  }, [currentUser]);

  const checkUserProfile = async () => {
    if (!currentUser) return;
    
    try {
      setIsCheckingProfile(true);
      const response = await fetch("/api/djs/me");
      if (response.ok) {
        const data = await response.json();
        // API returns { dj: null } if no profile, or { id, name, ... } if profile exists
        if (data.id) {
          setUserProfile({ id: data.id });
        } else {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Error checking user profile:", error);
      setUserProfile(null);
    } finally {
      setIsCheckingProfile(false);
    }
  };

  const fetchDJs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/djs");
      if (response.ok) {
        const data = await response.json();
        setDJs(data.djs || []);
      } else {
        toast({
          title: t('common.error'),
          description: t('dj.failedToLoad'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching DJs:", error);
      toast({
        title: "Error",
        description: "Failed to load DJs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasActiveFilters = sortBy !== "votes" || countryFilter !== "all";

  const clearFilters = () => {
    setSortBy("votes");
    setCountryFilter("all");
  };

  const fetchUserVotes = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch("/api/votes");
      if (response.ok) {
        const data = await response.json();
        // Votes are now handled in DJGrid component
        // This function is kept for potential future use
      }
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  };

  const handleVote = async (djId: string) => {
    if (!currentUser) {
      router.push(`/login?redirect=/dj/${djId}`);
      return;
    }

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dj_id: djId }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state
        setDJs((prevDJs) =>
          prevDJs.map((dj) =>
            dj.id === djId
              ? { ...dj, votes_count: data.votes_count }
              : dj
          )
        );
        toast({
          title: t('common.success'),
          description: t('dj.voteSubmitted'),
        });
      } else {
        const error = await response.json();
        toast({
          title: t('common.error'),
          description: error.error || t('dj.failedToSubmit'),
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
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      <main id="main-content">
        <section aria-label="DJ hero banner">
          <DJHeroBanner />
        </section>
        
        {/* DJ Grid */}
        <section aria-label="DJ listings">
          <DJGrid
          djs={djs}
          onVote={handleVote}
          isLoading={isLoading}
          searchQuery=""
          onSearchChange={() => {}}
          sortBy={sortBy}
          countryFilter={countryFilter}
          onCountryFilterChange={setCountryFilter}
          isAuthenticated={!!currentUser}
          onCreateProfileClick={() => {
            if (!currentUser) {
              router.push("/login?redirect=/dj/profile/new");
              return;
            }
            
            // If user has profile, go to their profile page
            if (userProfile) {
              router.push(`/dj/${userProfile.id}`);
            } else {
              // If no profile, go to create page
              router.push("/dj/profile/new");
            }
          }}
          userProfile={userProfile}
          isCheckingProfile={isCheckingProfile}
          currentUser={currentUser}
          onSortChange={setSortBy}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
        </section>
      </main>
      <Footer />
    </div>
  );
}

