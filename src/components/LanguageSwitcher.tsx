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
  
  // Get language paths
  const getLanguagePath = (lang: string) => {
    if (lang === 'ja') {
      return pathname.replace(/^\/en/, '/ja');
    } else {
      return pathname.replace(/^\/ja/, '/en');
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
