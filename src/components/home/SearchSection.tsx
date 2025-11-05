'use client';
import { useState, useEffect, useMemo, useRef } from "react";
import { Search, SlidersHorizontal, MapPin, Building2, MapPin as MapPinIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ktvData } from "@/lib/data";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

interface Suggestion {
  type: 'venue' | 'category' | 'city' | 'country';
  text: string;
  count?: number;
}

export const SearchSection = ({ searchQuery, onSearchChange }: SearchSectionProps) => {
  const [sortBy, setSortBy] = useState("recommended");
  const [inputValue, setInputValue] = useState(searchQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedInput = useDebounce(inputValue, 200);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Generate suggestions based on input
  const suggestions = useMemo(() => {
    if (!debouncedInput || debouncedInput.length < 1) {
      // Return popular suggestions when empty
      const categories = Array.from(new Set(ktvData.map(v => v.category).filter(cat => cat != null))).filter(cat => cat && typeof cat === 'string');
      const countries = Array.from(new Set(ktvData.map(v => v.country).filter(country => country != null))).filter(country => country && typeof country === 'string');
      
      return [
        ...categories.slice(0, 3).map(cat => ({ type: 'category' as const, text: cat })),
        ...countries.slice(0, 2).map(country => ({ type: 'country' as const, text: country })),
      ];
    }

    const query = debouncedInput.toLowerCase();
    const suggestions: Suggestion[] = [];
    const seen = new Set<string>();

    // Search venues by name
    ktvData.forEach(venue => {
      if (venue.name && typeof venue.name === 'string' && venue.name.toLowerCase().includes(query) && !seen.has(venue.name)) {
        suggestions.push({ type: 'venue', text: venue.name });
        seen.add(venue.name);
      }
    });

    // Search by category
    const categories = Array.from(new Set(ktvData.map(v => v.category).filter(cat => cat != null)));
    categories.forEach(cat => {
      if (cat && typeof cat === 'string' && cat.toLowerCase().includes(query) && !seen.has(`category:${cat}`)) {
        const count = ktvData.filter(v => v.category === cat).length;
        suggestions.push({ type: 'category', text: cat, count });
        seen.add(`category:${cat}`);
      }
    });

    // Search by city/area from address
    ktvData.forEach(venue => {
      if (venue.address && typeof venue.address === 'string') {
        const address = venue.address.toLowerCase();
        // Extract potential city/area names (simple heuristic)
        const parts = address.split(/[,\s]+/);
        parts.forEach(part => {
          if (part.length > 2 && part.includes(query) && !seen.has(`city:${part}`)) {
            suggestions.push({ type: 'city', text: part });
            seen.add(`city:${part}`);
          }
        });
      }
    });

    // Search by country
    const countries = Array.from(new Set(ktvData.map(v => v.country).filter(country => country != null)));
    countries.forEach(country => {
      if (country && typeof country === 'string' && country.toLowerCase().includes(query) && !seen.has(`country:${country}`)) {
        const count = ktvData.filter(v => v.country === country).length;
        suggestions.push({ type: 'country', text: country, count });
        seen.add(`country:${country}`);
      }
    });

    return suggestions.slice(0, 10); // Limit to 10 suggestions
  }, [debouncedInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    // Open dropdown when user types if input is focused
    if (isInputFocused && value.length > 0 && suggestions.length > 0) {
      setIsOpen(true);
    }
  };
  
  // Update dropdown open state only when input is focused
  useEffect(() => {
    if (isInputFocused && suggestions.length > 0) {
      setIsOpen(true);
    } else if (!isInputFocused) {
      setIsOpen(false);
    }
  }, [suggestions.length, isInputFocused]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const inputElement = inputRef.current;
      const dropdownElement = document.querySelector('[data-suggestion-dropdown]');

      if (
        inputElement &&
        dropdownElement &&
        !inputElement.contains(target) &&
        !dropdownElement.contains(target)
      ) {
        setIsOpen(false);
        setIsInputFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchChange(inputValue);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setInputValue(suggestion.text);
    onSearchChange(suggestion.text);
    setIsOpen(false);
    setIsInputFocused(false);
    inputRef.current?.blur();
  };

  const getSuggestionIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'venue':
        return <Building2 className="h-4 w-4" />;
      case 'category':
        return <SlidersHorizontal className="h-4 w-4" />;
      case 'city':
      case 'country':
        return <MapPinIcon className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };


  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "price", label: "Price" },
    { value: "looks", label: "Best Looking" },
    { value: "playability", label: "Most Fun" }
  ];

  return (
    <section className="py-8 bg-secondary/20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input with Autocomplete */}
            <div className="relative flex-1 w-full">
              <div className="relative">
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
                      setIsOpen(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay setting focused to false to allow clicking on suggestions
                    setTimeout(() => {
                      const activeElement = document.activeElement;
                      const dropdownElement = document.querySelector('[data-suggestion-dropdown]');
                      if (!dropdownElement?.contains(activeElement as Node)) {
                        setIsInputFocused(false);
                        setIsOpen(false);
                      }
                    }, 150);
                  }}
                  className="pl-10 h-12 bg-background/60 backdrop-blur-sm border-border/40 focus:border-primary cursor-text"
                />
              </div>
              
              {/* Suggestions Dropdown */}
              {isOpen && suggestions.length > 0 && (
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
                      setIsOpen(false);
                    }
                  }}
                >
                  <Command shouldFilter={false}>
                    <CommandList className="max-h-[300px]">
                      {suggestions.length === 0 ? (
                        <CommandEmpty>No suggestions found.</CommandEmpty>
                      ) : (
                        <>
                          <CommandGroup heading={debouncedInput && debouncedInput.length > 0 ? "Suggestions" : "Popular Searches"}>
                            {suggestions.map((suggestion, index) => (
                              <CommandItem
                                key={`${suggestion.type}-${suggestion.text}-${index}`}
                                value={suggestion.text}
                                onSelect={() => handleSelectSuggestion(suggestion)}
                                className="cursor-pointer"
                                onMouseDown={(e) => {
                                  // Prevent input from losing focus
                                  e.preventDefault();
                                  handleSelectSuggestion(suggestion);
                                }}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className="text-muted-foreground flex-shrink-0">
                                    {getSuggestionIcon(suggestion.type)}
                                  </span>
                                  <span className="flex-1 truncate">{suggestion.text}</span>
                                  {suggestion.count !== undefined && (
                                    <span className="text-xs text-muted-foreground flex-shrink-0">
                                      ({suggestion.count})
                                    </span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-red-bright" />
              <span>Current Area</span>
            </div>

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 h-12 bg-background/60 backdrop-blur-sm border-border/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter Button */}
            <Button variant="outline" size="lg" className="h-12 px-6">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
