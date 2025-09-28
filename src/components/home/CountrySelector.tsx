'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Mic, Music, Radio } from 'lucide-react';

export const CountrySelector = () => {
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');

  const countries = [
    { id: 'all', name: 'Tất Cả', flag: '🌏' },
    { id: 'singapore', name: 'Singapore', flag: '🇸🇬' },
    { id: 'vietnam', name: 'Vietnam', flag: '🇻🇳' },
    { id: 'thailand', name: 'Thailand', flag: '🇹🇭' },
    { id: 'malaysia', name: 'Malaysia', flag: '🇲🇾' },
  ];

  const categories = [
    { id: 'all', name: 'Tất Cả', icon: Music },
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
              <h2 className="text-2xl font-bold">Chọn Quốc Gia</h2>
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
                  onClick={() => setSelectedCountry(country.id)}
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
              <h2 className="text-2xl font-bold">Loại Hình Giải Trí</h2>
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
