"use client";
import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale" | "none";
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

const animationClasses = {
  "fade-up": {
    before: "opacity-0 translate-y-8",
    after: "opacity-100 translate-y-0",
  },
  "fade-in": {
    before: "opacity-0",
    after: "opacity-100",
  },
  "slide-left": {
    before: "opacity-0 translate-x-8",
    after: "opacity-100 translate-x-0",
  },
  "slide-right": {
    before: "opacity-0 -translate-x-8",
    after: "opacity-100 translate-x-0",
  },
  scale: {
    before: "opacity-0 scale-95",
    after: "opacity-100 scale-100",
  },
  none: {
    before: "",
    after: "",
  },
};

export function ScrollReveal({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
}: ScrollRevealProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold,
    triggerOnce,
    delay,
  });

  const animationClass = animationClasses[animation];

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={cn(
        "transition-all duration-500 ease-out",
        isVisible ? animationClass.after : animationClass.before,
        className
      )}
    >
      {children}
    </div>
  );
}

