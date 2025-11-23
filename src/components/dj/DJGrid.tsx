"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { DJCard, DJ } from "./DJCard";
import { SearchX, ChevronDown, Loader2, Plus, User, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { useAuth } from "@/contexts/auth-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from 'next-intl';

interface DJGridProps {
  djs: DJ[];
  onVote?: (djId: string) => Promise<void>;
  isLoading?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  sortBy?: string;
  countryFilter?: string;
  onCountryFilterChange?: (country: string) => void;
  isAuthenticated?: boolean;
  onCreateProfileClick?: () => void;
  userProfile?: { id: string } | null;
  isCheckingProfile?: boolean;
  currentUser?: any;
  onSortChange?: (sortBy: string) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

const INITIAL_LIMIT = 12;
const LOAD_MORE_INCREMENT = 12;
const DISPLAY_LIMIT_KEY = 'djDisplayLimit';
const REFERRER_KEY = 'scrollRestoreReferrer'; // Cùng key với ScrollRestoration

// Tạo key duy nhất cho mỗi bộ filters
const getFiltersKey = (searchQuery: string, sortBy: string, countryFilter: string) => {
  return `dj_${searchQuery || 'all'}_${sortBy || 'votes'}_${countryFilter || 'all'}`;
};

// Kiểm tra xem có nên restore displayLimit không (chỉ khi referrer là từ DJ detail)
const shouldRestoreDisplayLimit = () => {
  try {
    const referrer = sessionStorage.getItem(REFERRER_KEY);
    // Chỉ restore nếu referrer là từ trang DJ detail (/dj/[id])
    return referrer && referrer.startsWith('/dj/') && referrer !== '/dj';
  } catch (error) {
    return false;
  }
};

export const DJGrid = ({
  djs,
  onVote,
  isLoading = false,
  searchQuery = "",
  onSearchChange,
  sortBy = "votes",
  countryFilter = "all",
  onCountryFilterChange,
  isAuthenticated = false,
  onCreateProfileClick,
  userProfile,
  isCheckingProfile = false,
  currentUser,
  onSortChange,
  hasActiveFilters = false,
  onClearFilters,
}: DJGridProps) => {
  const t = useTranslations();
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);
  const [votedDJs, setVotedDJs] = useState<Set<string>>(new Set());
  const { currentUser: authUser } = useAuth();
  const effectiveCurrentUser = currentUser || authUser;
  const previousFiltersRef = useRef<string>('');
  const isRestoringRef = useRef(false);

  // Tạo key cho filters hiện tại
  const currentFiltersKey = getFiltersKey(searchQuery || '', sortBy || 'votes', countryFilter || 'all');

  // Fetch user votes when component mounts or user changes
  useEffect(() => {
    const fetchUserVotes = async () => {
      if (!effectiveCurrentUser) {
        setVotedDJs(new Set());
        return;
      }

      try {
        const response = await fetch("/api/votes");
        if (response.ok) {
          const data = await response.json();
          // Convert array of DJ IDs to Set
          const votedSet = new Set<string>(data.votes || []);
          setVotedDJs(votedSet);
        }
      } catch (error) {
        console.error("Error fetching user votes:", error);
      }
    };

    fetchUserVotes();
  }, [effectiveCurrentUser]);

  // Khôi phục displayLimit từ sessionStorage khi mount hoặc khi filters key giống
  // CHỈ khôi phục nếu referrer là từ DJ detail
  useEffect(() => {
    const prevKey = previousFiltersRef.current;
    const isFirstMount = !prevKey;
    const filtersChanged = prevKey && prevKey !== currentFiltersKey;
    
    // Nếu filters thay đổi, reset về INITIAL_LIMIT
    if (filtersChanged) {
      setDisplayLimit(INITIAL_LIMIT);
      previousFiltersRef.current = currentFiltersKey;
      return;
    }
    
    // Nếu là lần đầu mount hoặc filters giống, thử khôi phục
    // NHƯNG chỉ khi referrer là từ DJ detail
    if ((isFirstMount || prevKey === currentFiltersKey) && shouldRestoreDisplayLimit()) {
      try {
        const saved = sessionStorage.getItem(DISPLAY_LIMIT_KEY);
        if (saved) {
          const limits: Record<string, number> = JSON.parse(saved);
          const savedLimit = limits[currentFiltersKey];
          
          // Nếu có saved limit cho filters này, khôi phục
          if (savedLimit && savedLimit > INITIAL_LIMIT) {
            isRestoringRef.current = true;
            setDisplayLimit(savedLimit);
            
            // Reset flag sau khi đã set
            setTimeout(() => {
              isRestoringRef.current = false;
            }, 100);
          }
        }
      } catch (error) {
        console.warn('Failed to restore display limit:', error);
      }
    }
    
    previousFiltersRef.current = currentFiltersKey;
  }, [currentFiltersKey]);

  // Lưu displayLimit vào sessionStorage khi thay đổi (trừ khi đang restore)
  useEffect(() => {
    if (isRestoringRef.current) return; // Không lưu khi đang restore
    
    try {
      const saved = sessionStorage.getItem(DISPLAY_LIMIT_KEY);
      const limits: Record<string, number> = saved ? JSON.parse(saved) : {};
      limits[currentFiltersKey] = displayLimit;
      sessionStorage.setItem(DISPLAY_LIMIT_KEY, JSON.stringify(limits));
    } catch (error) {
      console.warn('Failed to save display limit:', error);
    }
  }, [displayLimit, currentFiltersKey]);

  // Reset limit khi filters thay đổi (không phải khi quay lại)
  useEffect(() => {
    const prevKey = previousFiltersRef.current;
    
    // Nếu filters thay đổi (không phải lần đầu mount), reset về INITIAL_LIMIT
    if (prevKey && prevKey !== currentFiltersKey) {
      setDisplayLimit(INITIAL_LIMIT);
    }
    
    previousFiltersRef.current = currentFiltersKey;
  }, [searchQuery, sortBy, countryFilter, currentFiltersKey]);

  // Extract unique countries from DJs - memoized for performance
  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    djs.forEach((dj) => {
      if (dj.country && dj.country.trim()) {
        countries.add(dj.country.trim());
      }
    });
    return Array.from(countries).sort();
  }, [djs]);

  // Filter DJs based on search query and country filter - memoized for performance
  const filteredDJs = useMemo(() => {
    return djs.filter((dj) => {
      // Country filter
      if (countryFilter && countryFilter !== "all") {
        if (!dj.country || dj.country.trim() !== countryFilter) {
          return false;
        }
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          dj.name.toLowerCase().includes(query) ||
          dj.bio?.toLowerCase().includes(query) ||
          dj.genres?.some((g) => g.toLowerCase().includes(query)) ||
          dj.country?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [djs, searchQuery, countryFilter]);

  // Calculate actual rank based on votes (before sorting) - optimized O(n log n) instead of O(n²)
  // Rank should always be based on votes, not on current sort order
  // When votes are equal, DJs share the same rank
  const djsWithRank = useMemo(() => {
    // Sort by votes first to calculate rank efficiently
    const sortedByVotes = [...filteredDJs].sort((a, b) => {
      return (b.votes_count || 0) - (a.votes_count || 0);
    });

    // Calculate rank based on sorted order - O(n) instead of O(n²)
    const rankMap = new Map<string, number>();
    let currentRank = 1;
    let previousVotes = -1;

    sortedByVotes.forEach((dj, index) => {
      const currentVotes = dj.votes_count || 0;
      if (currentVotes !== previousVotes) {
        currentRank = index + 1;
        previousVotes = currentVotes;
      }
      rankMap.set(dj.id, currentRank);
    });

    // Map ranks back to original filtered DJs
    return filteredDJs.map((dj) => ({
      ...dj,
      rank: rankMap.get(dj.id) || filteredDJs.length + 1,
    }));
  }, [filteredDJs]);

  // Sort DJs based on sortBy option (after calculating rank) - memoized
  const sortedDJs = useMemo(() => {
    return [...djsWithRank].sort((a, b) => {
      switch (sortBy) {
      case "votes":
        // Sort by votes (descending), then by created_at (ascending) for tie-breaker
        const votesDiff = (b.votes_count || 0) - (a.votes_count || 0);
        if (votesDiff !== 0) return votesDiff;
        // If votes are equal, earlier created DJ comes first (higher rank)
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB;
      case "name":
        return a.name.localeCompare(b.name);
      case "newest":
        const dateANew = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateBNew = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateBNew - dateANew;
      case "oldest":
        const dateAOld = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateBOld = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateAOld - dateBOld;
      default:
        // Default: sort by votes with tie-breaker
        const defaultVotesDiff = (b.votes_count || 0) - (a.votes_count || 0);
        if (defaultVotesDiff !== 0) return defaultVotesDiff;
        const defaultDateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const defaultDateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return defaultDateA - defaultDateB;
    }
  });
  }, [djsWithRank, sortBy]);

  // Use sorted DJs with their actual ranks
  const rankedDJs = sortedDJs;

  // Only display DJs up to displayLimit - memoized
  const displayedDJs = useMemo(() => {
    return rankedDJs.slice(0, displayLimit);
  }, [rankedDJs, displayLimit]);

  // DJs to preload (next batch - DJs after displayLimit)
  const preloadLimit = displayLimit + LOAD_MORE_INCREMENT;
  const preloadDJs = useMemo(() => {
    return rankedDJs.slice(displayLimit, preloadLimit);
  }, [rankedDJs, displayLimit, preloadLimit]);

  // Preload images for next batch using link rel="preload"
  useEffect(() => {
    if (preloadDJs.length === 0) return;

    const links: HTMLLinkElement[] = [];
    
    preloadDJs.forEach((dj) => {
      if (!dj.image_url) return;
      
      // Check if link already exists to avoid duplicate preloads
      const existingLink = document.querySelector(`link[rel="preload"][as="image"][href="${dj.image_url}"]`);
      if (existingLink) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = dj.image_url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      links.push(link);
    });

    // Note: We don't cleanup preload links when displayLimit changes 
    // because we want to keep preloaded images in browser cache
    // The browser will handle cache management automatically
  }, [displayLimit, preloadDJs]);

  const hasMore = rankedDJs.length > displayLimit;

  const handleShowMore = () => {
    setDisplayLimit((prev) => {
      const newLimit = prev + LOAD_MORE_INCREMENT;
      // Lưu ngay khi click
      try {
        const saved = sessionStorage.getItem(DISPLAY_LIMIT_KEY);
        const limits: Record<string, number> = saved ? JSON.parse(saved) : {};
        limits[currentFiltersKey] = newLimit;
        sessionStorage.setItem(DISPLAY_LIMIT_KEY, JSON.stringify(limits));
      } catch (error) {
        console.warn('Failed to save display limit:', error);
      }
      return newLimit;
    });
  };

  // Khôi phục scroll position sau khi displayLimit đã được restore và content đã render
  // CHỈ restore nếu referrer là từ DJ detail
  useEffect(() => {
    // Chỉ restore scroll nếu displayLimit > INITIAL_LIMIT và referrer là từ DJ detail
    if (displayLimit <= INITIAL_LIMIT || rankedDJs.length === 0 || !shouldRestoreDisplayLimit()) return;
    
    // Kiểm tra xem content đã render đủ chưa bằng cách check DOM height
    const checkAndRestore = (attempt: number = 0) => {
      const maxAttempts = 10; // Tối đa 10 lần thử
      if (attempt >= maxAttempts) return;
      
      try {
        const SCROLL_KEY = 'scrollPositions';
        const saved = sessionStorage.getItem(SCROLL_KEY);
        if (!saved) return;
        
        const positions: Record<string, number> = JSON.parse(saved);
        const pageKey = window.location.pathname + window.location.search;
        const savedPosition = positions[pageKey];
        
        if (!savedPosition || savedPosition <= 0) return;
        
        // Kiểm tra xem content đã render đủ chưa
        const documentHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        
        // Nếu saved position lớn hơn document height hiện tại, content chưa render đủ
        if (savedPosition > documentHeight - 100) {
          // Đợi thêm và thử lại
          setTimeout(() => checkAndRestore(attempt + 1), 100);
          return;
        }
        
        // Content đã render đủ, restore scroll
        const doScroll = () => {
          window.scrollTo({
            top: savedPosition,
            behavior: 'auto',
          });
          
          // Verify sau một chút
          setTimeout(() => {
            const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            if (Math.abs(currentScroll - savedPosition) > 50) {
              // Nếu vẫn chưa đúng, thử lại
              window.scrollTo({
                top: savedPosition,
                behavior: 'auto',
              });
              
              // Thử lại một lần nữa sau khi content có thể đã render thêm
              setTimeout(() => {
                const finalScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
                if (Math.abs(finalScroll - savedPosition) > 50) {
                  // Nếu vẫn chưa đúng, có thể content chưa render đủ, thử lại
                  if (attempt < maxAttempts - 1) {
                    checkAndRestore(attempt + 1);
                  }
                }
              }, 200);
            }
          }, 100);
        };
        
        // Thử scroll ngay
        doScroll();
        
        // Thử lại sau requestAnimationFrame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            doScroll();
          });
        });
        
      } catch (error) {
        console.warn('Failed to restore scroll after display limit restore:', error);
      }
    };
    
    // Bắt đầu restore sau một chút để đảm bảo DOM đã update
    const timer = setTimeout(() => {
      checkAndRestore();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [displayLimit, rankedDJs.length]); // Chạy khi displayLimit hoặc số DJs thay đổi

  const handleVote = async (djId: string) => {
    if (onVote) {
      try {
        await onVote(djId);
        // Update local state immediately for better UX
        setVotedDJs((prev) => new Set(prev).add(djId));
        // Also refetch from server to ensure consistency
        if (effectiveCurrentUser) {
          const response = await fetch("/api/votes");
          if (response.ok) {
            const data = await response.json();
            const votedSet = new Set<string>(data.votes || []);
            setVotedDJs(votedSet);
          }
        }
      } catch (error) {
        console.error("Error voting:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <section className="md:py-12 py-6">
        <div className="md:container px-3">
          <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="card-elevated rounded-xl overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="md:py-12 py-6">
      <div className="md:container px-3">
        <ScrollReveal animation="fade-up" delay={0} threshold={0.2}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 font-headline">
                <span className="gradient-text">{t('dj.featuredDJs')}</span>
              </h2>
              <p className="text-muted-foreground">
                {rankedDJs.length === 1 
                  ? t('dj.djsFound', { count: rankedDJs.length })
                  : t('dj.djsFoundPlural', { count: rankedDJs.length })}
                {displayedDJs.length < rankedDJs.length && (
                  <span className="ml-2 text-sm">
                    ({t('dj.showing', { showing: displayedDJs.length, total: rankedDJs.length })})
                  </span>
                )}
              </p>
            </div>

            {/* Create Profile Button and Sort */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
              {/* Create Profile Button */}
              {onCreateProfileClick && (
                <Button
                  onClick={onCreateProfileClick}
                  variant="neon"
                  size="lg"
                  className="h-12 px-6 gap-2"
                  disabled={isCheckingProfile}
                >
                  {isCheckingProfile ? (
                    <Plus className="h-5 w-5" />
                  ) : effectiveCurrentUser && userProfile ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                  {isCheckingProfile 
                    ? t('dj.checking')
                    : effectiveCurrentUser 
                      ? (userProfile ? t('dj.viewMyProfile') : t('dj.createDJProfile'))
                      : t('dj.loginToCreate')}
                </Button>
              )}

              {/* Country Filter */}
              {onCountryFilterChange && (
                <Select value={countryFilter || "all"} onValueChange={onCountryFilterChange}>
                  <SelectTrigger className="w-[180px] h-10 bg-background/60 backdrop-blur-sm">
                    <SelectValue placeholder={t('dj.filterByCountry')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('dj.allCountries')}</SelectItem>
                    {availableCountries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Sort By */}
              {onSortChange && (
                <>
                  <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger className="w-[180px] h-10 bg-background/60 backdrop-blur-sm">
                    <SelectValue placeholder={t('dj.sortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="votes">{t('dj.sortByVotes')}</SelectItem>
                    <SelectItem value="name">{t('dj.sortByNameAZ')}</SelectItem>
                    <SelectItem value="newest">{t('dj.newestFirst')}</SelectItem>
                    <SelectItem value="oldest">{t('dj.oldestFirst')}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Clear Filters Button */}
                  {hasActiveFilters && onClearFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearFilters}
                      className="h-10 gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                      {t('dj.clearFilters')}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Active Filters Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <span className="text-xs text-muted-foreground">{t('dj.activeFilters')}</span>
              {countryFilter && countryFilter !== "all" && (
                <Badge variant="secondary" className="gap-1.5">
                  {t('dj.country')}: {countryFilter}
                  {onCountryFilterChange && (
                    <button
                      onClick={() => onCountryFilterChange("all")}
                      className="ml-1 hover:bg-secondary/80 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              )}
              {sortBy !== "votes" && (
                <Badge variant="secondary" className="gap-1.5">
                  {t('dj.sort')}: {sortBy === "name" ? t('dj.sortByNameAZ') : sortBy === "newest" ? t('dj.newestFirst') : t('dj.oldestFirst')}
                  {onSortChange && (
                    <button
                      onClick={() => onSortChange("votes")}
                      className="ml-1 hover:bg-secondary/80 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              )}
            </div>
          )}
        </ScrollReveal>

        {displayedDJs.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {displayedDJs.map((dj, index) => {
                const rowIndex = index % 3;
                const delay = rowIndex * 10;

                return (
                  <ScrollReveal
                    key={dj.id}
                    animation="fade-up"
                    delay={delay}
                    threshold={0.01}
                    triggerOnce={true}
                    className="h-full"
                  >
                    <DJCard
                      dj={dj}
                      onVote={handleVote}
                      hasVoted={votedDJs.has(dj.id)}
                      isAuthenticated={isAuthenticated}
                    />
                  </ScrollReveal>
                );
              })}
            </div>

            {hasMore && (
              <ScrollReveal animation="fade-up" delay={200} threshold={0.3}>
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleShowMore}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    {t('dj.showMore')}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </ScrollReveal>
            )}
          </>
        ) : (
          <ScrollReveal animation="fade-in" delay={100} threshold={0.2}>
            <div className="text-center py-16 card-elevated rounded-xl">
              <SearchX className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold font-headline">
                {t('dj.noDJsFound')}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery || (countryFilter && countryFilter !== "all")
                  ? t('dj.tryAdjustingFilters')
                  : t('dj.noDJsAvailable')}
              </p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

