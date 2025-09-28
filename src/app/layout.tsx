import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from 'next-themes';

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

// As this is a client component, QueryClientProvider needs to be wrapped in a client component.
const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {children}
            </TooltipProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
