"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Check } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSwitcherProps {
  currentLang: string;
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname();
  
  // Get language paths with more robust handling
  const getLanguagePath = (lang: string): string => {
    // Make sure pathname is a string
    const path = pathname || '';
    
    if (lang === 'ja') {
      // If already Japanese or no language prefix, ensure Japanese prefix
      if (path.startsWith('/ja/')) return path;
      if (path.startsWith('/en/')) return path.replace(/^\/en/, '/ja');
      if (path === '/en') return '/ja';
      if (path === '/ja') return path;
      return path.startsWith('/') ? `/ja${path}` : `/ja/${path}`;
    } else {
      // If already English or no language prefix, ensure English prefix
      if (path.startsWith('/en/')) return path;
      if (path.startsWith('/ja/')) return path.replace(/^\/ja/, '/en');
      if (path === '/ja') return '/en';
      if (path === '/en') return path;
      return path.startsWith('/') ? `/en${path}` : `/en/${path}`;
    }
  };

  // Language options
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' }
  ];

  // Current language
  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 rounded transition-colors">
          <Globe className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">
            {currentLanguage.name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {languages.map((language) => (
          <DropdownMenuItem key={language.code} asChild>
            <Link 
              href={getLanguagePath(language.code)}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center">
                <span>{language.name}</span>
              </div>
              {language.code === currentLang && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
