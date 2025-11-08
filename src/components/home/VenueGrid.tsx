"use client";
import { useState, useEffect, useRef } from "react";
import { LazyVenueCard } from "@/components/home/LazyVenueCard";
import { useVenues } from "@/hooks/use-venues";
import { SearchX, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface VenueGridProps {
  selectedCountry: string;
  selectedCity: string;
  selectedCategory: string;
  searchQuery: string;
}

const INITIAL_LIMIT = 12;
const LOAD_MORE_INCREMENT = 12;
const DISPLAY_LIMIT_KEY = 'venueDisplayLimit';
const REFERRER_KEY = 'scrollRestoreReferrer'; // Cùng key với ScrollRestoration

// Tạo key duy nhất cho mỗi bộ filters
const getFiltersKey = (country: string, city: string, category: string, query: string) => {
  return `venue_${country}_${city}_${category}_${query}`;
};

// Kiểm tra xem có nên restore displayLimit không (chỉ khi referrer là từ venue detail)
const shouldRestoreDisplayLimit = () => {
  try {
    const referrer = sessionStorage.getItem(REFERRER_KEY);
    // Chỉ restore nếu referrer là từ trang venue detail (/venue/[id])
    return referrer && referrer.startsWith('/venue/') && referrer !== '/venue';
  } catch (error) {
    return false;
  }
};

export const VenueGrid = ({
  selectedCountry,
  selectedCity,
  selectedCategory,
  searchQuery,
}: VenueGridProps) => {
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);
  const previousFiltersRef = useRef<string>('');
  const isRestoringRef = useRef(false);

  // Tạo key cho filters hiện tại
  const currentFiltersKey = getFiltersKey(selectedCountry, selectedCity, selectedCategory, searchQuery);

  // Khôi phục displayLimit từ sessionStorage khi mount hoặc khi filters key giống
  // CHỈ khôi phục nếu referrer là từ venue detail
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
    // NHƯNG chỉ khi referrer là từ venue detail
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

  // Query more venues than displayed to preload the next batch
  // This creates a sequential loop: query displayLimit + LOAD_MORE_INCREMENT
  const preloadLimit = displayLimit + LOAD_MORE_INCREMENT;
  const { venues: allVenues, totalCount } = useVenues({
    selectedCountry,
    selectedCity,
    selectedCategory,
    searchQuery,
    limit: preloadLimit,
  });

  // Khôi phục scroll position sau khi displayLimit đã được restore và content đã render
  // CHỈ restore nếu referrer là từ venue detail
  useEffect(() => {
    // Chỉ restore scroll nếu displayLimit > INITIAL_LIMIT và referrer là từ venue detail
    if (displayLimit <= INITIAL_LIMIT || allVenues.length === 0 || !shouldRestoreDisplayLimit()) return;
    
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
  }, [displayLimit, allVenues.length]); // Chạy khi displayLimit hoặc số venues thay đổi

  // Only display venues up to displayLimit
  const displayedVenues = allVenues.slice(0, displayLimit);
  // Venues to preload (next batch - venues after displayLimit)
  const preloadVenues = allVenues.slice(displayLimit, preloadLimit);

  // Preload images for next batch using link rel="preload"
  // This runs sequentially each time displayLimit changes
  useEffect(() => {
    if (preloadVenues.length === 0) return;

    const links: HTMLLinkElement[] = [];
    
    preloadVenues.forEach((venue) => {
      // Check if link already exists to avoid duplicate preloads
      const existingLink = document.querySelector(`link[rel="preload"][as="image"][href="${venue.main_image_url}"]`);
      if (existingLink) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = venue.main_image_url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      links.push(link);
    });

    // Note: We don't cleanup preload links when displayLimit changes 
    // because we want to keep preloaded images in browser cache
    // Links will persist in browser cache even if we don't remove them from DOM
    // The browser will handle cache management automatically
  }, [displayLimit]); // Re-run when displayLimit changes to preload next batch

  const hasMore = totalCount > displayLimit;

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

  return (
    <section className="md:py-12 py-6">
      <div className="md:container px-3">
        <ScrollReveal animation="fade-up" delay={0} threshold={0.2}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 font-headline">
                <span className="gradient-text">Featured Venues</span>
              </h2>
              <p className="text-muted-foreground">
                {totalCount} venues found
                {displayedVenues.length < totalCount && (
                  <span className="ml-2 text-sm">
                    (Showing {displayedVenues.length} of {totalCount})
                  </span>
                )}
              </p>
            </div>
          </div>
        </ScrollReveal>
        {displayedVenues.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {displayedVenues.map((venue, index) => {
                // Calculate delay based on position in row (0, 1, 2) for better staggered effect
                // For mobile (2 cols): delay by 0, 10
                // For desktop (3 cols): delay by 0, 10, 20
                const rowIndex = index % 3; // 0, 1, 2 for desktop
                const delay = rowIndex * 10;
                
                return (
                  <ScrollReveal
                    key={venue.id}
                    animation="fade-up"
                    delay={delay}
                    threshold={0.01}
                    triggerOnce={true}
                    className="h-full"
                  >
                    <LazyVenueCard venue={venue} />
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
                    Show More
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
              No results found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};
