"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Search, Youtube, Menu, X } from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import Image from "next/image";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

interface SocialLink {
  icon: any;
  href: string;
  label: string;
  className?: string;
}

export const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const [inputValue, setInputValue] = useState(searchQuery ?? "");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setInputValue(searchQuery ?? "");
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearchChange) {
      onSearchChange(inputValue || "");
      setIsSearchOpen(false); // Close search on enter
    }
  };

  const socialLinks: SocialLink[] = [
    {
      icon: Youtube,
      href: "https://www.youtube.com/@anlasianightlife",
      label: "YouTube",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/asianightlife.sg?igsh=MWZzdjUzN21uZG00Yg==",
      label: "Instagram",
    },
    {
      icon: "https://img.icons8.com/ios-filled/50/000000/tiktok--v1.png",
      href: "https://www.tiktok.com/@asianightlife.sg?_t=ZS-90Sk98gy6Se&_r=1",
      label: "TikTok",
      className: "dark:invert",
    },
    {
      icon: Facebook,
      href: "https://www.facebook.com/profile.php?id=61581713529692&mibextid=ZbWKwL",
      label: "Facebook",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* --- Desktop View --- */}
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-16 w-16 rounded bg-gradient-primary flex items-center justify-center">
              <Image
                src="https://drive.google.com/uc?export=view&id=1C55Ml5hc3-BvzEo2S5zwkgMyuTViR2Tt"
                alt="Asia Night Life Logo"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-lg mx-4">
          {onSearchChange && (
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for venues, areas..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="pl-10 h-10 w-full bg-background/60 backdrop-blur-sm border-border/40 focus:border-primary"
              />
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-1">
          <ThemeSwitcher />
          {socialLinks.map((social) => (
            <Button
              key={social.label}
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-secondary hover-glow"
              asChild
            >
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                {typeof social.icon === "string" ? (
                  <Image
                    src={social.icon}
                    alt={social.label}
                    width={16}
                    height={16}
                    className={social.className || ""}
                  />
                ) : (
                  <social.icon className="h-4 w-4" />
                )}
              </a>
            </Button>
          ))}
        </div>

        {/* --- Mobile View --- */}
        <div className="md:hidden flex items-center justify-between w-full">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full space-y-6">
                {/* Contact Booking */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 font-headline">
                    Contact Booking
                  </h2>
                  <div className="flex flex-col space-y-2">
                    {/* WhatsApp */}
                    <a
                      href="https://wa.me/6582808072"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                        alt="WhatsApp"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">WhatsApp</span>
                        <span className="text-xs text-muted-foreground">
                          +65 8280 8072
                        </span>
                      </div>
                    </a>

                    {/* Telegram */}
                    <a
                      href="https://t.me/supremektv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
                        alt="Telegram"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">Telegram</span>
                        <span className="text-xs text-muted-foreground">
                          @supremektv
                        </span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Connect With Us */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 font-headline">
                    Connect With Us
                  </h2>
                  <div className="flex flex-col space-y-2">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {typeof social.icon === "string" ? (
                          <Image
                            src={social.icon}
                            alt={social.label}
                            width={20}
                            height={20}
                            className={social.className || ""}
                          />
                        ) : (
                          <social.icon className="h-5 w-5" />
                        )}
                        <span>{social.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Theme Switcher */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 font-headline">
                    Theme
                  </h2>
                  <div
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary cursor-pointer transition-colors"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    <ThemeSwitcher />
                    <span className="text-sm text-muted-foreground">
                      Toggle theme
                    </span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            <div className="h-14 w-14 rounded bg-gradient-primary flex items-center justify-center">
              <Image
                src="https://drive.google.com/uc?export=view&id=1C55Ml5hc3-BvzEo2S5zwkgMyuTViR2Tt"
                alt="Asia Night Life Logo"
                width={56}
                height={56}
                className="object-cover"
              />
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden p-2 border-t border-border/40">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for venues..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="pl-10 h-10 w-full"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
