'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Mic, Music, Radio } from 'lucide-react';

interface CountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

export const CountrySelector = ({ selectedCountry, onCountryChange }: CountrySelectorProps) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const countries = [
    { id: 'all', name: 'All', flag: '🌏' },
    { id: 'Singapore', name: 'Singapore', flag: '🇸🇬' },
    { id: 'Vietnam', name: 'Vietnam', flag: '🇻🇳' },
    { id: 'Thailand', name: 'Thailand', flag: '🇹🇭' },
    { id: 'Malaysia', name: 'Malaysia', flag: '🇲🇾' },
  ];

  const categories = [
    { id: 'all', name: 'All', icon: Music },
    { id: 'ktv', name: 'KTVs', icon: Mic },
    { id: 'club', name: 'Clubs', icon: Radio },
    { id: 'livehouse', name: 'Live House', icon: Music },
  ];

  return (
    <section className="py-8 border-b border-border/40">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Countries */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Select Country</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {countries.map((country) => (
                <Button
                  key={country.id}
                  variant={selectedCountry === country.id ? 'neon' : 'outline'}
                  className={`flex items-center space-x-2 px-4 py-2 transition-all duration-300 ${
                    selectedCountry === country.id
                      ? 'neon-glow'
                      : 'hover:border-primary/50 hover-glow'
                  }`}
                  onClick={() => onCountryChange(country.id)}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="font-medium">{country.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Music className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Entertainment Type</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? 'neon' : 'outline'}
                    className={`flex items-center space-x-2 px-4 py-2 transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'neon-glow'
                        : 'hover:border-primary/50 hover-glow'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{category.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
