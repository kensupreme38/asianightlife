import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "@/components/app/providers";
import ClientLayout from "@/components/layout/ClientLayout";
import { AuthProvider } from "@/contexts/auth-context";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { getSiteVerification, SITE_URL } from "@/lib/seo";

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

const ogImageUrl = `${SITE_URL}/logo.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Asia's #1 Nightlife Booking Platform | Asia Night Life",
  description:
    "Book verified KTVs, Clubs, Live Houses, VIP Lounges & Entertainment Venues across Singapore, Vietnam, Thailand & Malaysia. WhatsApp concierge 24/7.",
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
  verification: getSiteVerification(),
  openGraph: {
    title: "Asia's #1 Nightlife Booking Platform | Asia Night Life",
    description:
      "Book verified KTVs, Clubs, Live Houses & VIP Lounges across Southeast Asia",
    type: "website",
    url: "/",
    locale: "en_SG",
    siteName: "Asia Night Life",
    images: [{ url: ogImageUrl, width: 512, height: 512, alt: "Asia Night Life" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@asianightlife.sg",
    creator: "@asianightlife.sg",
    images: [ogImageUrl],
  },
  // Additional metadata
  category: "entertainment",
  classification: "Business Directory",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover" as const,
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
              <AnalyticsScripts />
              {children}
            </TooltipProvider>
          </AuthProvider>
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Asia Night Life Singapore",
              description: "Southeast Asia's leading nightlife booking platform",
              telephone: "+65-8266-8669",
              url: SITE_URL,
              areaServed: ["Singapore", "Vietnam", "Thailand", "Malaysia"],
              priceRange: "$$",
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
