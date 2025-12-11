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
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/routing";

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
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [jumpPage, setJumpPage] = useState<string>('');
  const previousFiltersRef = useRef<string>('');

  // Đọc page từ URL query parameters hoặc sessionStorage
  const pageFromUrl = searchParams?.get('page');
  const pageFromStorage = typeof window !== 'undefined' ? sessionStorage.getItem('homePageNumber') : null;
  
  // Ưu tiên URL, nếu không có thì dùng sessionStorage, cuối cùng là 1
  const getInitialPage = () => {
    if (pageFromUrl) {
      const pageNum = parseInt(pageFromUrl, 10);
      if (!isNaN(pageNum) && pageNum >= 1) return pageNum;
    }
    if (pageFromStorage) {
      const pageNum = parseInt(pageFromStorage, 10);
      if (!isNaN(pageNum) && pageNum >= 1) return pageNum;
    }
    return 1;
  };
  
  const [currentPage, setCurrentPage] = useState(() => getInitialPage());
  const hasRestoredPageRef = useRef(false);

  // Tạo key cho filters hiện tại
  const currentFiltersKey = getFiltersKey(selectedCountry, selectedCity, selectedCategory, searchQuery);

  // Restore page number từ sessionStorage khi quay về từ venue detail
  useEffect(() => {
    try {
      const savedPage = sessionStorage.getItem('homePageNumber');
      const referrer = sessionStorage.getItem('scrollRestoreReferrer');
      
      // Nếu có referrer (đã từ venue detail) và có saved page
      // Và referrer là venue detail page (bắt đầu với /venue/)
      if (referrer && referrer.startsWith('/venue/') && savedPage) {
        const pageNum = parseInt(savedPage, 10);
        if (!isNaN(pageNum) && pageNum >= 1) {
          // Chỉ restore nếu page number khác với current page
          if (pageNum !== currentPage) {
            setCurrentPage(pageNum);
            // Update URL để có page parameter
            const params = new URLSearchParams(searchParams?.toString() || '');
            if (pageNum > 1) {
              params.set('page', pageNum.toString());
            } else {
              params.delete('page');
            }
            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
            router.replace(newUrl, { scroll: false });
          }
          // Xóa saved page sau khi restore (dù có set hay không)
          sessionStorage.removeItem('homePageNumber');
        }
      }
    } catch (error) {
      // Ignore errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString(), currentPage]); // Sử dụng searchParams?.toString() để đảm bảo dependency ổn định

  // Sync currentPage với URL khi URL thay đổi (khi user click pagination)
  useEffect(() => {
    const pageFromUrl = searchParams?.get('page');
    if (pageFromUrl) {
      const pageNum = parseInt(pageFromUrl, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum !== currentPage) {
        setCurrentPage(pageNum);
      }
    } else if (currentPage !== 1) {
      // Nếu URL không có page parameter và currentPage không phải 1
      // Có thể do user đang ở trang 1 nhưng URL không có page param
      // Không cần làm gì vì có thể đang ở trang 1
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString(), currentPage]); // Sử dụng searchParams?.toString() để đảm bảo dependency ổn định

  // Reset về trang 1 khi filters thay đổi
  useEffect(() => {
    const prevKey = previousFiltersRef.current;
    if (prevKey && prevKey !== currentFiltersKey) {
      setCurrentPage(1);
      // Cập nhật URL để xóa page parameter khi filters thay đổi
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.delete('page');
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
    previousFiltersRef.current = currentFiltersKey;
  }, [currentFiltersKey, searchParams, pathname, router]);

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
      
      // Cập nhật URL với page parameter
      const params = new URLSearchParams(searchParams?.toString() || '');
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', page.toString());
      }
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
      
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
    // Giảm số trang hiển thị trên mobile
    const maxVisible = isMobile ? 3 : 5;
    
    if (totalPages <= maxVisible) {
      // Nếu tổng số trang <= maxVisible, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (isMobile) {
        // Trên mobile: chỉ hiển thị trang hiện tại và các trang xung quanh
        if (currentPage === 1) {
          pages.push(1, 2);
          if (totalPages > 2) {
            pages.push('ellipsis');
            pages.push(totalPages);
          }
        } else if (currentPage === totalPages) {
          pages.push(1);
          if (totalPages > 2) {
            pages.push('ellipsis');
          }
          pages.push(totalPages - 1, totalPages);
        } else {
          pages.push(1);
          if (currentPage > 2) {
            pages.push('ellipsis');
          }
          pages.push(currentPage - 1, currentPage, currentPage + 1);
          if (currentPage < totalPages - 1) {
            pages.push('ellipsis');
          }
          pages.push(totalPages);
        }
      } else {
        // Desktop: logic như cũ
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
                  className="flex flex-col items-center mt-8 gap-4"
                >
                  {/* Main pagination controls */}
                  <ul className="flex flex-row items-center gap-1 flex-wrap justify-center">
                    <li>
                      <Button
                        variant="outline"
                        size={isMobile ? "icon" : "default"}
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={cn(
                          isMobile ? "h-9 w-9" : "gap-1 pl-2.5"
                        )}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        {!isMobile && <span>Previous</span>}
                      </Button>
                    </li>
                    
                    {getPageNumbers().map((page, index) => {
                      if (page === 'ellipsis') {
                        return (
                          <li key={`ellipsis-${index}`}>
                            <span className="flex h-9 w-9 items-center justify-center text-muted-foreground">
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
                              "h-9 w-9 text-sm",
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
                        size={isMobile ? "icon" : "default"}
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={cn(
                          isMobile ? "h-9 w-9" : "gap-1 pr-2.5"
                        )}
                        aria-label="Next page"
                      >
                        {!isMobile && <span>Next</span>}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </li>
                  </ul>
                  
                  {/* Jump to page - separate row on mobile */}
                  {totalPages > 5 && (
                    <div className={cn(
                      "flex items-center gap-2",
                      isMobile 
                        ? "flex-col w-full px-4 pt-2 border-t" 
                        : "ml-4 pl-4 border-l"
                    )}>
                      <span className={cn(
                        "text-sm text-muted-foreground",
                        isMobile ? "text-center" : "whitespace-nowrap"
                      )}>
                        {t('home.goToPage', { defaultValue: 'Go to page' })}:
                      </span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={jumpPage}
                          onChange={(e) => setJumpPage(e.target.value)}
                          onKeyPress={handleJumpKeyPress}
                          placeholder={currentPage.toString()}
                          className={cn(
                            "h-9 text-center",
                            isMobile ? "w-16" : "w-20"
                          )}
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
                      </div>
                    </div>
                  )}
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
