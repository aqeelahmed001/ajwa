"use client";

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Phone, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import LanguageSwitcher from '@/components/LanguageSwitcher'

interface HeaderProps {
  lang: string;
}

export default function Header({ lang }: HeaderProps) {
  const pathname = usePathname()
  const isJapanese = lang === 'ja'
  
  // Get current time in Japan
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Tokyo'
  }
  const currentTime = new Intl.DateTimeFormat('ja-JP', options).format(now)
  
  // Navigation items with translations
  const navItems = [
    {
      en: { name: 'Home', path: '/en' },
      ja: { name: 'ホーム', path: '/ja' }
    },
    {
      en: { name: 'About', path: '/en/about' },
      ja: { name: '会社概要', path: '/ja/about' }
    },
    {
      en: { name: 'Services', path: '/en/services' },
      ja: { name: 'サービス', path: '/ja/services' }
    },
    {
      en: { name: 'Machinery', path: '/en/machinery' },
      ja: { name: '機械一覧', path: '/ja/machinery' }
    },
    {
      en: { name: 'FAQ', path: '/en/faq' },
      ja: { name: 'よくある質問', path: '/ja/faq' }
    },
    {
      en: { name: 'Contact', path: '/en/contact' },
      ja: { name: 'お問い合わせ', path: '/ja/contact' }
    }
  ]

  // Contact information
  const contactInfo = {
    phone: '+81-080-4303-1786',
    email: 'info@ajwa.co.jp',
    address: isJapanese ? '〒498-0052 愛知県弥富市稲荷３丁目20番地' : '〒498-0052 Aichi Prefecture, Yatomi-shi Inari 3-chōme 20',
    japanTime: currentTime + ' JST',
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      {/* Main Header - Larger size like the example */}
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Left side - Logo and Navigation Menu */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href={`/${lang}`} className="flex items-center mr-8">
              <div className="h-12 w-auto">
                <img 
                  src="/images/logo.jpg" 
                  alt="Ajwa Logo" 
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    // Fallback if logo doesn't exist
                    e.currentTarget.style.display = 'none';
                    
                    // Find the fallback element by a safer method
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallbackElement = parent.querySelector('.logo-fallback');
                      if (fallbackElement instanceof HTMLElement) {
                        fallbackElement.style.display = 'block';
                      }
                    }
                  }}
                />
                <div className="hidden h-12 w-12 bg-primary flex items-center justify-center logo-fallback">
                  <span className="font-bold text-lg text-primary-foreground">A</span>
                </div>
              </div>
            </Link>
            
            {/* Navigation Menu - Moved next to logo */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <Link 
                  key={index} 
                  href={isJapanese ? item.ja.path : item.en.path}
                  className={`text-base font-medium ${
                    pathname === (isJapanese ? item.ja.path : item.en.path) 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                  } transition-colors`}
                >
                  {isJapanese ? item.ja.name : item.en.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side - Contact Info */}
          <div className="hidden lg:flex items-center space-x-8">
            
            {/* Language Switcher */}
            <div className="border-l border-gray-200 pl-6">
              <LanguageSwitcher currentLang={lang} />
            </div>
            
            {/* Phone Number with Icon - styled like reference */}
            <div className="flex items-center">
              <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`} className="flex flex-col items-center">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="text-blue-600 text-2xl font-bold hover:text-blue-800 transition-colors">
                    {contactInfo.phone}
                  </span>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  平日9:00〜17:00
                </span>
              </a>
            </div>
            
            {/* Contact/Inquiry Button */}
            <div>
              <Link 
                href={`/${lang}/contact`}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-medium transition-colors"
              >
                {isJapanese ? 'お問い合わせ' : 'Inquiry'}
              </Link>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader className="mb-6">
                  <SheetTitle>
                    {isJapanese ? 'メニュー' : 'Menu'}
                  </SheetTitle>
                </SheetHeader>
                
                {/* Mobile Navigation */}
                <nav className="grid gap-5 mb-6">
                  {navItems.map((item, index) => (
                    <Link 
                      key={index} 
                      href={isJapanese ? item.ja.path : item.en.path}
                      className={`flex items-center gap-2 text-base font-medium ${
                        pathname === (isJapanese ? item.ja.path : item.en.path) 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                      } transition-colors`}
                    >
                      {isJapanese ? item.ja.name : item.en.name}
                    </Link>
                  ))}
                </nav>
                
                {/* Mobile Contact Info */}
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-blue-600 mr-3" />
                    <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`} className="text-gray-700">
                      {contactInfo.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-blue-600 mr-3" />
                    <a href={`mailto:${contactInfo.email}`} className="text-gray-700">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
                
                {/* Mobile Language Switcher */}
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <LanguageSwitcher currentLang={lang} />
                </div>
                
                {/* Mobile Contact Button */}
                <div className="mt-6">
                  <Link 
                    href={`/${lang}/contact`}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-medium transition-colors w-full block text-center"
                  >
                    {isJapanese ? 'お問い合わせ' : 'Inquiry'}
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
