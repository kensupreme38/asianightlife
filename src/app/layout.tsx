import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from '@/components/app/providers';
import { getImage } from '@/lib/placeholder-images';
import ClientLayout from '@/components/layout/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

const heroBannerImage = getImage('hero-banner');
// By adding a unique version query parameter, we can force social media platforms to refetch the image.
const imagePreviewUrl = `${heroBannerImage?.imageUrl}&v=1`;

export const metadata: Metadata = {
  title: 'NightLife - Premier Entertainment Venue Booking',
  description: 'The leading booking platform for KTVs, Clubs, and Live Houses in Singapore, Vietnam, Thailand, Malaysia. Discover and book now!',
  authors: [{ name: 'NightLife Platform' }],
  keywords: 'ktv, club, live house, booking, karaoke, nightlife, singapore, vietnam, thailand, malaysia',
  openGraph: {
    title: 'NightLife - Premier Entertainment Venue Booking',
    description: 'The leading booking platform for KTVs, Clubs, and Live Houses in Southeast Asia',
    type: 'website',
    images: [imagePreviewUrl],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lovable_dev',
    images: [imagePreviewUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ClientLayout>
              {children}
            </ClientLayout>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
