import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from '@/components/app/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NightLife - Đặt Chỗ Địa Điểm Giải Trí Hàng Đầu',
  description: 'Nền tảng đặt chỗ hàng đầu cho KTV, Club và Live House tại Singapore, Vietnam, Thailand, Malaysia. Khám phá và đặt chỗ ngay!',
  authors: [{ name: 'NightLife Platform' }],
  keywords: 'ktv, club, live house, đặt chỗ, karaoke, nightlife, singapore, vietnam, thailand, malaysia',
  openGraph: {
    title: 'NightLife - Đặt Chỗ Địa Điểm Giải Trí Hàng Đầu',
    description: 'Nền tảng đặt chỗ hàng đầu cho KTV, Club và Live House tại Đông Nam Á',
    type: 'website',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lovable_dev',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
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
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
