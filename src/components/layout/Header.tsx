"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  Facebook,
  Search,
  Youtube,
  Menu,
  X,
  Building2,
  SlidersHorizontal,
  MapPin as MapPinIcon,
  LogOut,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import Image from "next/image";
import { Input } from "../ui/input";
import { useState, useEffect, useMemo, useRef, memo } from "react";
import { useTheme } from "next-themes";
import { useDebounce } from "@/hooks/use-debounce";
import { ktvData } from "@/lib/data";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

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

interface Suggestion {
  type: "venue" | "category" | "city" | "country";
  text: string;
  count?: number;
}

// Logo path - using local image file
const LOGO_PATH = "/logo.jpg";

// Logo component - optimized to prevent flicker
// Using memo and local image to prevent re-renders and network requests
const Logo = memo(
  ({
    width = 64,
    height = 64,
    className = "object-cover",
  }: {
    width?: number;
    height?: number;
    className?: string;
  }) => {
    // Use local image path directly, no state to avoid flicker
    return (
      <Image
        src={LOGO_PATH}
        alt="Asia Night Life Logo"
        width={width}
        height={height}
        className={className}
        priority
        unoptimized
        style={{ maxWidth: "100%", height: "auto" }}
      />
    );
  }
);
Logo.displayName = "Logo";

export const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const [inputValue, setInputValue] = useState(searchQuery ?? "");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { theme, setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedInput = useDebounce(inputValue, 200);
  const pathname = usePathname();
  const { currentUser, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const primaryLinks = [
    { href: "/", label: "Home" },
    { href: "/dj", label: "DJ Voting" },
    {
      href: "/employee",
      label: "Employee",
    },
  ];

  useEffect(() => {
    setInputValue(searchQuery ?? "");
  }, [searchQuery]);

  // Generate suggestions based on input
  const suggestions = useMemo(() => {
    if (!debouncedInput || debouncedInput.length < 1) {
      // Return popular suggestions when empty
      const categories = Array.from(
        new Set(ktvData.map((v) => v.category).filter((cat) => cat != null))
      ).filter((cat) => cat && typeof cat === "string");
      const countries = Array.from(
        new Set(
          ktvData.map((v) => v.country).filter((country) => country != null)
        )
      ).filter((country) => country && typeof country === "string");

      return [
        ...categories
          .slice(0, 3)
          .map((cat) => ({ type: "category" as const, text: cat })),
        ...countries
          .slice(0, 2)
          .map((country) => ({ type: "country" as const, text: country })),
      ];
    }

    const query = debouncedInput.toLowerCase();
    const suggestions: Suggestion[] = [];
    const seen = new Set<string>();

    // Search venues by name
    ktvData.forEach((venue) => {
      if (
        venue.name &&
        typeof venue.name === "string" &&
        venue.name.toLowerCase().includes(query) &&
        !seen.has(venue.name)
      ) {
        suggestions.push({ type: "venue", text: venue.name });
        seen.add(venue.name);
      }
    });

    // Search by category
    const categories = Array.from(
      new Set(ktvData.map((v) => v.category).filter((cat) => cat != null))
    );
    categories.forEach((cat) => {
      if (
        cat &&
        typeof cat === "string" &&
        cat.toLowerCase().includes(query) &&
        !seen.has(`category:${cat}`)
      ) {
        const count = ktvData.filter((v) => v.category === cat).length;
        suggestions.push({ type: "category", text: cat, count });
        seen.add(`category:${cat}`);
      }
    });

    // Search by city/area from address
    ktvData.forEach((venue) => {
      if (venue.address && typeof venue.address === "string") {
        const address = venue.address.toLowerCase();
        const parts = address.split(/[,\s]+/);
        parts.forEach((part) => {
          if (
            part.length > 2 &&
            part.includes(query) &&
            !seen.has(`city:${part}`)
          ) {
            suggestions.push({ type: "city", text: part });
            seen.add(`city:${part}`);
          }
        });
      }
    });

    // Search by country
    const countries = Array.from(
      new Set(
        ktvData.map((v) => v.country).filter((country) => country != null)
      )
    );
    countries.forEach((country) => {
      if (
        country &&
        typeof country === "string" &&
        country.toLowerCase().includes(query) &&
        !seen.has(`country:${country}`)
      ) {
        const count = ktvData.filter((v) => v.country === country).length;
        suggestions.push({ type: "country", text: country, count });
        seen.add(`country:${country}`);
      }
    });

    return suggestions.slice(0, 10);
  }, [debouncedInput]);

  // Update dropdown open state only when input is focused
  useEffect(() => {
    if (isInputFocused && suggestions.length > 0) {
      setIsDropdownOpen(true);
    } else if (!isInputFocused) {
      setIsDropdownOpen(false);
    }
  }, [suggestions.length, isInputFocused]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const inputElement = inputRef.current;
      const dropdownElement = document.querySelector(
        "[data-suggestion-dropdown]"
      );
      const mobileDropdownElement = document.querySelector(
        "[data-suggestion-dropdown-mobile]"
      );

      if (
        inputElement &&
        dropdownElement &&
        !inputElement.contains(target) &&
        !dropdownElement.contains(target)
      ) {
        setIsDropdownOpen(false);
        setIsInputFocused(false);
      }

      if (
        inputElement &&
        mobileDropdownElement &&
        !inputElement.contains(target) &&
        !mobileDropdownElement.contains(target)
      ) {
        setIsDropdownOpen(false);
        setIsInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    // Only open dropdown if input is focused and there are suggestions
    if (isInputFocused && value.length > 0 && suggestions.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearchChange) {
      onSearchChange(inputValue || "");
      setIsSearchOpen(false);
      setIsDropdownOpen(false);
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setInputValue(suggestion.text);
    if (onSearchChange) {
      onSearchChange(suggestion.text);
    }
    setIsDropdownOpen(false);
    setIsSearchOpen(false);
    setIsInputFocused(false);
  };

  const getSuggestionIcon = (type: Suggestion["type"]) => {
    switch (type) {
      case "venue":
        return <Building2 className="h-4 w-4" />;
      case "category":
        return <SlidersHorizontal className="h-4 w-4" />;
      case "city":
      case "country":
        return <MapPinIcon className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
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

  // Preload logo on mount to prevent flicker when switching tabs
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = LOGO_PATH;
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* --- Desktop View --- */}
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-16 w-16 bg-gradient-primary flex items-center justify-center overflow-hidden">
              <Logo width={64} height={64} className="object-cover" />
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 ml-6">
          {primaryLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex flex-1 max-w-lg mx-4">
          {onSearchChange && (
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
              <Input
                ref={inputRef}
                placeholder="Search for venues, areas..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setIsInputFocused(true);
                  if (suggestions.length > 0) {
                    setIsDropdownOpen(true);
                  }
                }}
                onBlur={() => {
                  // Delay setting focused to false to allow clicking on suggestions
                  setTimeout(() => {
                    const activeElement = document.activeElement;
                    const dropdownElement = document.querySelector(
                      "[data-suggestion-dropdown]"
                    );
                    if (!dropdownElement?.contains(activeElement as Node)) {
                      setIsInputFocused(false);
                      setIsDropdownOpen(false);
                    }
                  }, 150);
                }}
                className="pl-10 h-10 w-full bg-background/60 backdrop-blur-sm border-border/40 focus:border-primary"
              />

              {/* Suggestions Dropdown */}
              {isDropdownOpen && suggestions.length > 0 && (
                <div
                  data-suggestion-dropdown
                  className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md"
                  onMouseDown={(e) => {
                    // Prevent input from losing focus when clicking on dropdown
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    // Close dropdown when clicking outside suggestions
                    if (e.target === e.currentTarget) {
                      setIsDropdownOpen(false);
                    }
                  }}
                >
                  <Command shouldFilter={false}>
                    <CommandList className="max-h-[300px]">
                      <CommandGroup
                        heading={
                          debouncedInput && debouncedInput.length > 0
                            ? "Suggestions"
                            : "Popular Searches"
                        }
                      >
                        {suggestions.map((suggestion, index) => (
                          <CommandItem
                            key={`${suggestion.type}-${suggestion.text}-${index}`}
                            value={suggestion.text}
                            onSelect={() => handleSelectSuggestion(suggestion)}
                            className="cursor-pointer"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelectSuggestion(suggestion);
                            }}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-muted-foreground flex-shrink-0">
                                {getSuggestionIcon(suggestion.type)}
                              </span>
                              <span className="flex-1 truncate">
                                {suggestion.text}
                              </span>
                              {suggestion.count !== undefined && (
                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                  ({suggestion.count})
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
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
              className="h-9 w-9 p-0"
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
          {currentUser && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={handleSignOut}
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
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
              <div className="flex flex-col h-full space-y-1.5">
                {/* Contact Booking */}
                <div>
                  <h2 className="text-lg font-semibold mb-1 font-headline">
                    Contact Booking
                  </h2>
                  <div className="flex flex-col space-y-1">
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
                      href="https://t.me/asianightlifesg"
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
                          @asianightlifesg
                        </span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Connect With Us */}
                <div>
                  <h2 className="text-lg font-semibold mb-1 font-headline">
                    Connect With Us
                  </h2>
                  <div className="flex flex-col space-y-1">
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

                {/* Explore */}
                <div>
                  <h2 className="text-lg font-semibold mb-1 font-headline">
                    Explore
                  </h2>
                  <div className="flex flex-col space-y-1">
                    {primaryLinks.map((link) => {
                      const isActive =
                        link.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(link.href);
                      return (
                        <Link
                          key={`mobile-${link.href}`}
                          href={link.href}
                          className={`flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-secondary ${
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="text-sm font-medium">
                            {link.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Theme Switcher */}
                <div>
                  <h2 className="text-lg font-semibold mb-1 font-headline">
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

                {/* Sign Out */}
                {currentUser && (
                  <div>
                    <h2 className="text-lg font-semibold mb-1 font-headline">
                      Account
                    </h2>
                    <div
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary cursor-pointer transition-colors"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="text-sm text-muted-foreground">
                        Sign out
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            <div className="h-14 w-14 bg-gradient-primary flex items-center justify-center overflow-hidden">
              <Logo width={56} height={56} className="object-cover" />
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
            <Input
              placeholder="Search for venues..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setIsInputFocused(true);
                if (suggestions.length > 0) {
                  setIsDropdownOpen(true);
                }
              }}
              onBlur={() => {
                // Delay setting focused to false to allow clicking on suggestions
                setTimeout(() => {
                  const activeElement = document.activeElement;
                  const dropdownElement = document.querySelector(
                    "[data-suggestion-dropdown-mobile]"
                  );
                  if (!dropdownElement?.contains(activeElement as Node)) {
                    setIsInputFocused(false);
                    setIsDropdownOpen(false);
                  }
                }, 150);
              }}
              className="pl-10 h-10 w-full"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => {
                setIsSearchOpen(false);
                setIsDropdownOpen(false);
              }}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Mobile Suggestions Dropdown */}
            {isDropdownOpen && suggestions.length > 0 && (
              <div
                data-suggestion-dropdown-mobile
                className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md"
                onMouseDown={(e) => {
                  // Prevent input from losing focus when clicking on dropdown
                  e.preventDefault();
                }}
                onClick={(e) => {
                  // Close dropdown when clicking outside suggestions
                  if (e.target === e.currentTarget) {
                    setIsDropdownOpen(false);
                  }
                }}
              >
                <Command shouldFilter={false}>
                  <CommandList className="max-h-[300px]">
                    <CommandGroup
                      heading={
                        debouncedInput && debouncedInput.length > 0
                          ? "Suggestions"
                          : "Popular Searches"
                      }
                    >
                      {suggestions.map((suggestion, index) => (
                        <CommandItem
                          key={`mobile-${suggestion.type}-${suggestion.text}-${index}`}
                          value={suggestion.text}
                          onSelect={() => handleSelectSuggestion(suggestion)}
                          className="cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectSuggestion(suggestion);
                          }}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-muted-foreground flex-shrink-0">
                              {getSuggestionIcon(suggestion.type)}
                            </span>
                            <span className="flex-1 truncate">
                              {suggestion.text}
                            </span>
                            {suggestion.count !== undefined && (
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                ({suggestion.count})
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
