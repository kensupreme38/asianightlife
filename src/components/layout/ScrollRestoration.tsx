'use client';

import { useEffect, useRef, useCallback, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const SCROLL_POSITIONS_KEY = 'scrollPositions'; // Phải khớp với script trong layout.tsx
const REFERRER_KEY = 'scrollRestoreReferrer'; // Lưu referrer để biết có nên restore không

interface ScrollPositions {
  [key: string]: number;
}

// Component riêng để sử dụng useSearchParams
function ScrollRestorationContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isRestoringRef = useRef(false);
  const savedPositionsRef = useRef<ScrollPositions>({});
  const lastPathnameRef = useRef<string>('');
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Kiểm tra xem có nên restore scroll position không
  // Chỉ restore nếu referrer là từ trang venue detail hoặc DJ detail
  const shouldRestore = useCallback(() => {
    try {
      const referrer = sessionStorage.getItem(REFERRER_KEY);
      // Chỉ restore nếu referrer là từ trang venue detail (/venue/[id]) hoặc DJ detail (/dj/[id])
      return referrer && (
        (referrer.startsWith('/venue/') && referrer !== '/venue') ||
        (referrer.startsWith('/dj/') && referrer !== '/dj')
      );
    } catch (error) {
      return false;
    }
  }, []);

  // Tạo key duy nhất cho mỗi trang (pathname + searchParams)
  const getPageKey = useCallback(() => {
    const params = searchParams?.toString() || '';
    return `${pathname}${params ? `?${params}` : ''}`;
  }, [pathname, searchParams]);

  // Lưu vị trí cuộn hiện tại (chỉ lưu cho trang chủ và trang DJ)
  const saveScrollPosition = useCallback(() => {
    if (typeof window === 'undefined' || isRestoringRef.current) return;
    
    // Chỉ lưu scroll position cho trang chủ và trang DJ
    if (pathname !== '/' && pathname !== '/dj') return;

    const pageKey = getPageKey();
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollY === 0) return; // Không lưu nếu đang ở đầu trang
    
    try {
      const saved = sessionStorage.getItem(SCROLL_POSITIONS_KEY);
      const positions: ScrollPositions = saved ? JSON.parse(saved) : {};
      positions[pageKey] = scrollY;
      sessionStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(positions));
      savedPositionsRef.current = positions;
    } catch (error) {
      console.warn('Failed to save scroll position:', error);
    }
  }, [getPageKey, pathname]);

  // Khôi phục vị trí cuộn với nhiều lần thử và kiểm tra content đã render đủ
  const restoreScrollPosition = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Chỉ restore cho trang chủ hoặc trang DJ và chỉ khi referrer phù hợp
    if ((pathname !== '/' && pathname !== '/dj') || !shouldRestore()) {
      return;
    }

    const pageKey = getPageKey();
    
    try {
      const saved = sessionStorage.getItem(SCROLL_POSITIONS_KEY);
      const positions: ScrollPositions = saved ? JSON.parse(saved) : {};
      const savedPosition = positions[pageKey];

      if (savedPosition !== undefined && savedPosition !== null && savedPosition > 0) {
        isRestoringRef.current = true;
        
        // Hàm kiểm tra và restore scroll với retry logic
        const checkAndRestore = (attempt: number = 0) => {
          const maxAttempts = 15; // Tăng số lần thử
          if (attempt >= maxAttempts) {
            isRestoringRef.current = false;
            return;
          }
          
          // Kiểm tra xem content đã render đủ chưa
          const documentHeight = document.documentElement.scrollHeight;
          const viewportHeight = window.innerHeight;
          
          // Nếu saved position lớn hơn document height hiện tại, content chưa render đủ
          if (savedPosition > documentHeight - 100) {
            // Đợi thêm và thử lại
            setTimeout(() => checkAndRestore(attempt + 1), 150);
            return;
          }
          
          // Hàm thực hiện scroll
          const doScroll = () => {
            window.scrollTo({
              top: savedPosition,
              behavior: 'auto',
            });
            
            // Verify scroll position sau một chút
            setTimeout(() => {
              const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
              // Nếu vẫn chưa đúng vị trí, thử lại
              if (Math.abs(currentScroll - savedPosition) > 50) {
                window.scrollTo({
                  top: savedPosition,
                  behavior: 'auto',
                });
                
                // Thử lại một lần nữa
                setTimeout(() => {
                  const finalScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
                  if (Math.abs(finalScroll - savedPosition) > 50 && attempt < maxAttempts - 1) {
                    // Nếu vẫn chưa đúng, có thể content chưa render đủ, thử lại
                    checkAndRestore(attempt + 1);
                  } else {
                    isRestoringRef.current = false;
                  }
                }, 200);
              } else {
                isRestoringRef.current = false;
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
        };

        // Bắt đầu restore
        checkAndRestore();
        
        // Thử lại một lần nữa sau khi trang có thể đã load xong
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          checkAndRestore(5); // Bắt đầu từ attempt 5
        }, 500);
      } else {
        isRestoringRef.current = false;
      }
    } catch (error) {
      console.warn('Failed to restore scroll position:', error);
      isRestoringRef.current = false;
    }
  }, [getPageKey, pathname, shouldRestore]);

  // Lưu vị trí khi scroll (debounced)
  useEffect(() => {
    let ticking = false;
    let saveTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (isRestoringRef.current) return;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (saveTimeout) {
            clearTimeout(saveTimeout);
          }
          saveTimeout = setTimeout(() => {
            saveScrollPosition();
          }, 100); // Debounce 100ms
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveScrollPosition]);

  // Lưu vị trí trước khi rời trang
  useEffect(() => {
    const currentKey = getPageKey();
    const previousKey = lastPathnameRef.current;
    
    // Lưu vị trí của trang trước khi chuyển
    if (previousKey && previousKey !== currentKey) {
      saveScrollPosition();
    }
    
    lastPathnameRef.current = currentKey;
    
    // Cleanup: lưu vị trí khi unmount
    return () => {
      if (!isRestoringRef.current) {
        saveScrollPosition();
      }
    };
  }, [pathname, searchParams, getPageKey, saveScrollPosition]);

  // Khôi phục vị trí khi trang thay đổi
  useEffect(() => {
    // Clear timeout cũ nếu có
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Khôi phục ngay lập tức
    restoreScrollPosition();

    // Thử lại sau một chút để đảm bảo DOM đã render
    const timer = setTimeout(() => {
      restoreScrollPosition();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [pathname, searchParams, restoreScrollPosition]);

  // Xử lý browser back/forward buttons - QUAN TRỌNG
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Chỉ restore nếu referrer là từ venue detail
      if (!shouldRestore()) {
        return;
      }
      
      // Khôi phục ngay lập tức khi detect popstate
      isRestoringRef.current = true;
      
      // Scroll ngay để ngăn Next.js scroll về đầu
      const pageKey = getPageKey();
      try {
        const saved = sessionStorage.getItem(SCROLL_POSITIONS_KEY);
        const positions: ScrollPositions = saved ? JSON.parse(saved) : {};
        const savedPosition = positions[pageKey];
        
        if (savedPosition !== undefined && savedPosition !== null && savedPosition > 0) {
          // Scroll ngay lập tức
          window.scrollTo(0, savedPosition);
          
          // Thử lại sau khi DOM có thể đã update
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              window.scrollTo(0, savedPosition);
              setTimeout(() => {
                isRestoringRef.current = false;
              }, 100);
            });
          });
        } else {
          isRestoringRef.current = false;
        }
      } catch (error) {
        isRestoringRef.current = false;
      }
    };

    // Sử dụng capture phase để chạy sớm hơn
    window.addEventListener('popstate', handlePopState, true);
    
    return () => {
      window.removeEventListener('popstate', handlePopState, true);
    };
  }, [getPageKey, shouldRestore]);

  // Lưu referrer khi navigate từ trang chủ/DJ sang venue detail hoặc DJ detail
  useEffect(() => {
    // Nếu đang ở trang venue detail, lưu referrer là trang chủ
    if (pathname.startsWith('/venue/') && pathname !== '/venue') {
      try {
        // Lưu pathname hiện tại (venue detail) làm referrer cho trang chủ
        sessionStorage.setItem(REFERRER_KEY, pathname);
      } catch (error) {
        console.warn('Failed to save referrer:', error);
      }
    } 
    // Nếu đang ở trang DJ detail, lưu referrer là trang DJ
    else if (pathname.startsWith('/dj/') && pathname !== '/dj') {
      try {
        // Lưu pathname hiện tại (DJ detail) làm referrer cho trang DJ
        sessionStorage.setItem(REFERRER_KEY, pathname);
      } catch (error) {
        console.warn('Failed to save referrer:', error);
      }
    } 
    else if (pathname === '/' || pathname === '/dj') {
      // Khi ở trang chủ hoặc trang DJ, không cần làm gì (giữ referrer cũ)
      // Referrer sẽ được xóa sau khi restore xong
    } else {
      // Nếu ở trang khác, xóa referrer để không restore
      try {
        sessionStorage.removeItem(REFERRER_KEY);
      } catch (error) {
        // Ignore
      }
    }
  }, [pathname]);

  // Xóa referrer sau khi đã restore xong
  useEffect(() => {
    if ((pathname === '/' || pathname === '/dj') && shouldRestore()) {
      // Sau khi restore xong, xóa referrer
      const timer = setTimeout(() => {
        try {
          sessionStorage.removeItem(REFERRER_KEY);
        } catch (error) {
          // Ignore
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [pathname, shouldRestore]);

  // Lưu vị trí khi trang bị unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveScrollPosition]);

  // Khởi tạo: lưu vị trí ban đầu nếu có
  useEffect(() => {
    // Lưu vị trí hiện tại khi mount
    const timer = setTimeout(() => {
      if (!isRestoringRef.current) {
        saveScrollPosition();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [saveScrollPosition]);

  return null;
}

// Wrapper component với Suspense
export default function ScrollRestoration() {
  return (
    <Suspense fallback={null}>
      <ScrollRestorationContent />
    </Suspense>
  );
}

