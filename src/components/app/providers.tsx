'use client';

import { ThemeProvider } from "next-themes";
import FramerMotionProvider from "@/components/animations/FramerMotionProvider";

export default function Providers({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <FramerMotionProvider>
        {children}
      </FramerMotionProvider>
    </ThemeProvider>
  )
}
