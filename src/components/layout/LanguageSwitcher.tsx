"use client";

import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { usePathname } from 'next/navigation';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Tiếng Việt' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const fullPathname = usePathname(); // Full pathname with locale (e.g., /vi or /en/dj)

  const handleLanguageChange = (newLocale: string) => {
    // Save locale preference to cookie (next-intl uses NEXT_LOCALE cookie)
    if (typeof document !== 'undefined') {
      // Set cookie that expires in 1 year
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      
      // Also save to localStorage as backup
      localStorage.setItem('locale', newLocale);
    }
    
    // Remove current locale prefix from pathname
    let pathWithoutLocale = fullPathname;
    
    // Remove locale prefix if it exists
    for (const loc of ['en', 'vi']) {
      if (pathWithoutLocale.startsWith(`/${loc}/`)) {
        pathWithoutLocale = pathWithoutLocale.slice(`/${loc}`.length);
        break;
      } else if (pathWithoutLocale === `/${loc}`) {
        pathWithoutLocale = '/';
        break;
      }
    }
    
    // Ensure path starts with /
    if (!pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = '/' + pathWithoutLocale;
    }
    
    // router.replace will add the locale prefix automatically
    router.replace(pathWithoutLocale, { locale: newLocale });
  };

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px] h-9">
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

