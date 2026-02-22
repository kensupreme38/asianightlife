import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "@/components/app/providers";
import { getImage } from "@/lib/placeholder-images";
import ClientLayout from "@/components/layout/ClientLayout";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const heroBannerImage = getImage("hero-banner");
const imagePreviewUrl = `${heroBannerImage?.imageUrl}&v=1`;

export const metadata: Metadata = {
  metadataBase: new URL("https://asianightlife.sg"),
  title: "Asia Night Life - Premier Entertainment Venue Booking",
  description:
    "The leading booking platform for KTVs, Clubs, and Live Houses in Singapore, Vietnam, Thailand, Malaysia. Discover and book now!",
  authors: [{ name: "Asia Night Life Platform" }],
  keywords:
    "ktv, club, live house, booking, karaoke, nightlife, singapore, vietnam, thailand, malaysia",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.jpg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Asia Night Life",
  },
  // Viewport and mobile optimization
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  // Robots default
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Verification (add your actual verification codes)
  verification: {
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  openGraph: {
    title: "Asia Night Life - Premier Entertainment Venue Booking",
    description:
      "The leading booking platform for KTVs, Clubs, and Live Houses in Southeast Asia",
    type: "website",
    url: "/",
    locale: "en_SG",
    siteName: "Asia Night Life",
    images: [imagePreviewUrl],
  },
  twitter: {
    card: "summary_large_image",
    site: "@lovable_dev",
    creator: "@lovable_dev",
    images: [imagePreviewUrl],
  },
  // Additional metadata
  category: "entertainment",
  classification: "Business Directory",
  // Note: Preconnect and DNS-prefetch are handled automatically by Next.js
  // for Google Fonts and can be added via next.config.ts for other domains
};

// Resource hints for performance optimization
export function generateResourceHints() {
  return (
    <>
      {/* Preconnect to external domains for faster loading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://mpkaqnmgytneercsqqyu.storage.supabase.co" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${inter.className}`} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const pathname = window.location.pathname;
                const localeMatch = pathname.match(/^\/(en|vi|zh|id|ja|ko|ru|th)/);
                const locale = localeMatch ? localeMatch[1] : 'en';
                const langMap = {
                  en: 'en',
                  vi: 'vi',
                  zh: 'zh-Hans',
                  id: 'id',
                  ja: 'ja',
                  ko: 'ko',
                  ru: 'ru',
                  th: 'th'
                };
                document.documentElement.lang = langMap[locale] || 'en';
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if ('serviceWorker' in navigator && typeof window !== 'undefined') {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('Service Worker registered:', registration.scope);
                      })
                      .catch(function(error) {
                        console.log('Service Worker registration failed:', error);
                      });
                  });
                }
              })();
            `,
          }}
        />
        <Providers>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {children}
            </TooltipProvider>
          </AuthProvider>
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Asia Night Life",
              url: "https://asianightlife.sg",
              logo: "https://asianightlife.sg/favicon.ico",
              sameAs: [
                "https://t.me/asianightlifeanl",
                "https://youtube.com/@asianightlifeanl",
                "https://www.instagram.com/asianightlife.sg",
                "https://www.tiktok.com/@asianightlife.sg",
                "https://www.facebook.com/profile.php?id=61581713529692",
              ],
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const SCROLL_KEY = 'scrollPositions';
                let isRestoring = false;
                
                // Lưu scroll position trước khi navigate (chỉ lưu cho trang chủ và trang DJ)
                function saveScroll() {
                  if (isRestoring || typeof sessionStorage === 'undefined') return;
                  // Chỉ lưu scroll position cho trang chủ và trang DJ
                  const pathname = window.location.pathname;
                  const isHomePage = pathname === '/' || pathname.match(/^\/(en|vi)\/?$/);
                  const isDJPage = pathname.match(/^\/(en|vi)\/dj\/?$/);
                  if (!isHomePage && !isDJPage) return;
                  try {
                    const key = pathname + window.location.search;
                    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
                    if (scrollY > 0) {
                      const saved = sessionStorage.getItem(SCROLL_KEY);
                      const positions = saved ? JSON.parse(saved) : {};
                      positions[key] = scrollY;
                      sessionStorage.setItem(SCROLL_KEY, JSON.stringify(positions));
                    }
                  } catch(e) {}
                }
                
                // Khôi phục scroll position (chỉ cho trang chủ/DJ và chỉ khi referrer phù hợp)
                function restoreScroll() {
                  if (typeof sessionStorage === 'undefined') return;
                  const pathname = window.location.pathname;
                  const isHomePage = pathname === '/' || pathname.match(/^\/(en|vi)\/?$/);
                  const isDJPage = pathname.match(/^\/(en|vi)\/dj\/?$/);
                  if (!isHomePage && !isDJPage) return;
                  try {
                    const key = pathname + window.location.search;
                    const saved = sessionStorage.getItem(SCROLL_KEY);
                    const positions = saved ? JSON.parse(saved) : {};
                    const savedPos = positions[key];
                    
                    if (savedPos && savedPos > 0) {
                      isRestoring = true;
                      window.scrollTo(0, savedPos);
                      
                      // Thử lại sau khi DOM ready
                      if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', function() {
                          setTimeout(function() {
                            window.scrollTo(0, savedPos);
                            isRestoring = false;
                          }, 50);
                        });
                      } else {
                        setTimeout(function() {
                          window.scrollTo(0, savedPos);
                          isRestoring = false;
                        }, 50);
                      }
                    }
                  } catch(e) {
                    isRestoring = false;
                  }
                }
                
                // Lưu khi scroll
                let scrollTimer;
                window.addEventListener('scroll', function() {
                  if (!isRestoring) {
                    clearTimeout(scrollTimer);
                    scrollTimer = setTimeout(saveScroll, 100);
                  }
                }, { passive: true });
                
                // Lưu trước khi unload
                window.addEventListener('beforeunload', saveScroll);
                
                // Kiểm tra xem có nên restore không (chỉ khi referrer là từ venue detail hoặc DJ detail)
                function shouldRestore() {
                  try {
                    const referrer = sessionStorage.getItem('scrollRestoreReferrer');
                    const pathname = window.location.pathname;
                    // Nếu ở trang chủ, chỉ restore nếu referrer là từ venue detail
                    const isHomePage = pathname === '/' || pathname.match(/^\/(en|vi)\/?$/);
                    if (isHomePage) {
                      return referrer && referrer.match(/^\/(en|vi)\/venue\/[^/]+/);
                    }
                    // Nếu ở trang DJ, chỉ restore nếu referrer là từ DJ detail
                    const isDJPage = pathname.match(/^\/(en|vi)\/dj\/?$/);
                    if (isDJPage) {
                      return referrer && referrer.match(/^\/(en|vi)\/dj\/[^/]+/);
                    }
                    return false;
                  } catch(e) {
                    return false;
                  }
                }
                
                // Khôi phục khi popstate (back/forward) - CHỈ khi referrer là từ venue detail
                window.addEventListener('popstate', function() {
                  if (shouldRestore()) {
                    setTimeout(restoreScroll, 0);
                  }
                }, true);
                
                // Khôi phục khi trang load - CHỈ khi referrer là từ venue detail
                if (shouldRestore()) {
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', restoreScroll);
                  } else {
                    restoreScroll();
                  }
                  
                  // Khôi phục sau khi Next.js có thể đã scroll
                  setTimeout(restoreScroll, 100);
                  setTimeout(restoreScroll, 300);
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
