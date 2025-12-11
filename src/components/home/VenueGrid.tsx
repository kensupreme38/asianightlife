"use client";
import { useState, useEffect, useRef } from "react";
import { LazyVenueCard } from "@/components/home/LazyVenueCard";
import { useVenues } from "@/hooks/use-venues";
import { SearchX, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MotionScrollReveal, MotionStagger, MotionStaggerItem } from "@/components/animations";
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";

interface VenueGridProps {
  selectedCountry: string;
  selectedCity: string;
  selectedCategory: string;
  searchQuery: string;
}

const ITEMS_PER_PAGE = 12;

// Tạo key duy nhất cho mỗi bộ filters
const getFiltersKey = (country: string, city: string, category: string, query: string) => {
  return `venue_${country}_${city}_${category}_${query}`;
};

export const VenueGrid = ({
  selectedCountry,
  selectedCity,
  selectedCategory,
  searchQuery,
}: VenueGridProps) => {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState<string>('');
  const previousFiltersRef = useRef<string>('');

  // Tạo key cho filters hiện tại
  const currentFiltersKey = getFiltersKey(selectedCountry, selectedCity, selectedCategory, searchQuery);

  // Reset về trang 1 khi filters thay đổi
  useEffect(() => {
    const prevKey = previousFiltersRef.current;
    if (prevKey && prevKey !== currentFiltersKey) {
      setCurrentPage(1);
    }
    previousFiltersRef.current = currentFiltersKey;
  }, [currentFiltersKey]);

  // Lấy venues với pagination
  const { venues, totalCount } = useVenues({
    selectedCountry,
    selectedCity,
    selectedCategory,
    searchQuery,
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
  });

  // Tính toán số trang
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Đảm bảo currentPage luôn hợp lệ với totalPages
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Scroll to CountrySelector when page changes (for pagination)
  const previousPageRef = useRef(currentPage);
  useEffect(() => {
    // Only scroll if page actually changed (not on initial mount or filter change)
    if (previousPageRef.current !== currentPage && previousPageRef.current > 0) {
      const scrollToCountrySelector = (attempt = 0) => {
        const countrySelector = document.getElementById('country-selector');
        if (countrySelector) {
          // Calculate offset: getBoundingClientRect gives position relative to viewport
          // Add current scroll position to get absolute position
          const rect = countrySelector.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const offsetTop = rect.top + scrollTop;
          
          // Use Lenis if available, otherwise fallback to window.scrollTo
          const lenis = (window as any).lenis;
          if (lenis) {
            lenis.scrollTo(offsetTop, { immediate: false, duration: 0.6 });
          } else {
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }
        } else if (attempt < 5) {
          // Retry with exponential backoff if element not found yet
          setTimeout(() => {
            scrollToCountrySelector(attempt + 1);
          }, 50 * (attempt + 1));
        }
      };
      
      // Use multiple requestAnimationFrame to ensure DOM is fully ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToCountrySelector();
        });
      });
    }
    previousPageRef.current = currentPage;
  }, [currentPage]);

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    // Đảm bảo page hợp lệ
    if (page >= 1 && page <= totalPages) {
      // Set flag to indicate pagination is happening
      (window as any).__isPaginationChange = true;
      setCurrentPage(page);
      // Clear flag after a delay
      setTimeout(() => {
        (window as any).__isPaginationChange = false;
      }, 1000);
    }
  };

  // Xử lý jump trang
  const handleJumpToPage = () => {
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
      setJumpPage('');
    }
  };

  // Xử lý khi nhấn Enter trong input jump
  const handleJumpKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJumpToPage();
    }
  };

  // Tạo danh sách số trang để hiển thị
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Số trang tối đa hiển thị
    
    if (totalPages <= maxVisible) {
      // Nếu tổng số trang <= maxVisible, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu
      pages.push(1);
      
      if (currentPage <= 3) {
        // Nếu đang ở đầu danh sách
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Nếu đang ở cuối danh sách
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Ở giữa danh sách
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <section className="md:py-12 py-6">
      <div className="md:container px-3">
        <MotionScrollReveal delay={0} threshold={0.2}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 font-headline">
                <span className="gradient-text">{t('venue.featuredVenues')}</span>
              </h2>
              <p className="text-muted-foreground">
                {totalCount === 1 
                  ? t('home.venuesFound', { count: totalCount })
                  : t('home.venuesFoundPlural', { count: totalCount })}
                {totalPages > 1 && (
                  <span className="ml-2 text-sm">
                    ({t('home.showing', { showing: venues.length, total: totalCount })} - Page {currentPage} of {totalPages})
                  </span>
                )}
              </p>
            </div>
          </div>
        </MotionScrollReveal>
        {venues.length > 0 ? (
          <>
            <MotionStagger staggerDelay={0.1}>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {venues.map((venue) => (
                  <MotionStaggerItem key={venue.id} className="h-full">
                    <LazyVenueCard venue={venue} />
                  </MotionStaggerItem>
                ))}
              </div>
            </MotionStagger>

            {totalPages > 1 && (
              <MotionScrollReveal delay={0.2} threshold={0.3}>
                <nav
                  role="navigation"
                  aria-label="pagination"
                  className="flex justify-center mt-8"
                >
                  <ul className="flex flex-row items-center gap-1">
                    <li>
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="gap-1 pl-2.5"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </Button>
                    </li>
                    
                    {getPageNumbers().map((page, index) => {
                      if (page === 'ellipsis') {
                        return (
                          <li key={`ellipsis-${index}`}>
                            <span className="flex h-9 w-9 items-center justify-center">
                              <span className="sr-only">More pages</span>
                              <span>...</span>
                            </span>
                          </li>
                        );
                      }
                      
                      const pageNum = page as number;
                      return (
                        <li key={pageNum}>
                          <Button
                            variant={currentPage === pageNum ? "outline" : "ghost"}
                            size="icon"
                            onClick={() => handlePageChange(pageNum)}
                            aria-current={currentPage === pageNum ? "page" : undefined}
                            className={cn(
                              "h-9 w-9",
                              currentPage === pageNum && "border-primary"
                            )}
                          >
                            {pageNum}
                          </Button>
                        </li>
                      );
                    })}
                    
                    <li>
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="gap-1 pr-2.5"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </li>
                    
                    {/* Jump to page */}
                    {totalPages > 5 && (
                      <li className="flex items-center gap-2 ml-4 pl-4 border-l">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {t('home.goToPage', { defaultValue: 'Go to page' })}:
                        </span>
                        <Input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={jumpPage}
                          onChange={(e) => setJumpPage(e.target.value)}
                          onKeyPress={handleJumpKeyPress}
                          placeholder={currentPage.toString()}
                          className="w-20 h-9 text-center"
                        />
                        <Button
                          variant="outline"
                          size="default"
                          onClick={handleJumpToPage}
                          disabled={!jumpPage || parseInt(jumpPage, 10) < 1 || parseInt(jumpPage, 10) > totalPages}
                          className="h-9 px-3"
                        >
                          {t('home.go', { defaultValue: 'Go' })}
                        </Button>
                      </li>
                    )}
                  </ul>
                </nav>
              </MotionScrollReveal>
            )}
          </>
        ) : (
          <MotionScrollReveal delay={0.1} threshold={0.2}>
            <div className="text-center py-16 card-elevated rounded-xl">
            <SearchX className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold font-headline">
              {t('home.noVenuesFound')}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('home.tryAdjustingFilters')}
            </p>
            </div>
          </MotionScrollReveal>
        )}
      </div>
    </section>
  );
};
