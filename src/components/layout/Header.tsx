"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, NavigationMenuContent, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { 
  Menu, 
  Globe, 
  ChevronDown, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ChevronRight 
} from 'lucide-react'

interface HeaderProps {
  lang: string;
}

export default function Header({ lang }: HeaderProps) {
  const pathname = usePathname()
  const isJapanese = lang === 'ja'
  const [currentTime, setCurrentTime] = useState<string>('')
  
  // Update Japan time every second
  useEffect(() => {
    const updateJapanTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }
      setCurrentTime(new Intl.DateTimeFormat('en-US', options).format(now))
    }
    
    // Update immediately
    updateJapanTime()
    
    // Update every second
    const interval = setInterval(updateJapanTime, 1000)
    
    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [])
  
  // Replace current language in path with the selected one
  const switchLanguage = (newLang: string) => {
    // Remove the first part of the path (current language)
    const pathWithoutLang = pathname.split('/').slice(2).join('/')
    return `/${newLang}/${pathWithoutLang}`
  }

  // Navigation items with translations
  const navItems = [
    {
      en: { name: 'Home', path: '/en' },
      ja: { name: 'ホーム', path: '/ja' },
    },
    {
      en: { name: 'About Us', path: '/en/about' },
      ja: { name: '会社概要', path: '/ja/about' },
    },
    {
      en: { name: 'Services', path: '/en/services' },
      ja: { name: 'サービス', path: '/ja/services' },
    },
    {
      en: { name: 'Machinery', path: '/en/machinery' },
      ja: { name: '機械', path: '/ja/machinery' },
    },
    {
      en: { name: 'Send Inquiry', path: '/en/inquiry' },
      ja: { name: 'お問い合わせ送信', path: '/ja/inquiry' },
    },
    {
      en: { name: 'Contact', path: '/en/contact' },
      ja: { name: 'お問い合わせ', path: '/ja/contact' },
    },
  ]

  // Contact information
  const contactInfo = {
    phone: '+81-0567-31-6675',
    email: 'info@ajwa.co.jp',
    address: isJapanese ? '〒496-0901 愛知県愛西市佐屋町道西64番地' : '〒496-0901 Aichi Prefecture, Aishish, Sayacho, michinishi 64',
    japanTime: currentTime + ' JST',
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Information Bar */}
      <div className="bg-secondary/50 border-b border-border/40">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-600">
            {/* Empty div for layout balance on small screens */}
            <div className="hidden md:block w-1/3"></div>
            
            {/* Japan Time - Centered */}
            <div className="flex items-center justify-center md:w-1/3">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-primary" />
                <span className="font-medium">{contactInfo.japanTime}</span>
              </div>
            </div>
            
            {/* Contact Information - Right Aligned */}
            <div className="flex items-center justify-end space-x-4 md:w-1/3 overflow-x-auto whitespace-nowrap">
              {/* Phone */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Phone className="h-3 w-3" />
                <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-primary transition-colors">
                  {contactInfo.phone}
                </a>
              </div>
              
              {/* Email */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Mail className="h-3 w-3" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">
                  {contactInfo.email}
                </a>
              </div>
              
              {/* Address */}
              <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                <MapPin className="h-3 w-3" />
                <span>{contactInfo.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="bg-secondary/50 border-b border-border/40">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href={`/${lang}`} className="flex items-center space-x-2">
              {/* Logo with brand green color */}
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <span className="font-bold text-lg text-primary-foreground">A</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">
                {isJapanese ? 'アジワ商事' : 'Ajwa Co LTD'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    <Link href={isJapanese ? item.ja.path : item.en.path} legacyBehavior passHref>
                      <NavigationMenuLink className={`px-4 py-2 text-sm font-medium ${
                        pathname === (isJapanese ? item.ja.path : item.en.path) 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-primary'
                      } transition-colors`}>
                        {isJapanese ? item.ja.name : item.en.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Actions: Language + Contact Button */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Globe className="h-4 w-4" />
                  <span className="hidden md:inline-block text-xs font-medium uppercase">
                    {lang}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={switchLanguage('en')} className={lang === 'en' ? 'font-medium' : ''}>
                    English
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={switchLanguage('ja')} className={lang === 'ja' ? 'font-medium' : ''}>
                    日本語
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Contact Us Button - Desktop - Using Parrot Red for contrast */}
            <div className="hidden sm:block">
              <Button className="bg-[#F25912] text-white hover:bg-[#FA812F]" asChild>
                <Link href={`/${lang}/contact`}>
                  {isJapanese ? 'お問い合わせ' : 'Contact Us'}
                </Link>
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="grid gap-6 pt-6">
                  <Link href={`/${lang}`} className="flex items-center gap-2">
                    {/* Mobile Logo - using brand green color */}
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                      <span className="font-bold text-lg text-primary-foreground">A</span>
                    </div>
                    <span className="font-bold text-xl">
                      {isJapanese ? 'アジワ商事' : 'Ajwa Co LTD'}
                    </span>
                  </Link>
                  
                  {/* Contact Information in Mobile Menu */}
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`} className="text-slate-700">
                        {contactInfo.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <a href={`mailto:${contactInfo.email}`} className="text-slate-700">
                        {contactInfo.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-slate-700">{contactInfo.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-slate-700">{contactInfo.japanTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    {navItems.map((item, index) => (
                      <Link
                        key={index}
                        href={isJapanese ? item.ja.path : item.en.path}
                        className={`text-base font-medium ${
                          pathname === (isJapanese ? item.ja.path : item.en.path) 
                          ? 'text-primary' 
                          : 'text-muted-foreground'
                        }`}
                      >
                        {isJapanese ? item.ja.name : item.en.name}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 pt-4">
                    <Button className="w-full bg-[#F25912] text-white hover:bg-[#FA812F]" asChild>
                      <Link href={`/${lang}/contact`}>
                        {isJapanese ? 'お問い合わせ' : 'Contact Us'}
                      </Link>
                    </Button>
                    <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
                      <span className="text-sm text-muted-foreground">
                        {isJapanese ? '言語を選択' : 'Select Language'}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant={lang === 'en' ? 'default' : 'outline'}
                          size="sm"
                          asChild
                          className={`text-xs ${lang === 'en' ? 'bg-primary hover:bg-primary/90' : ''}`}
                        >
                          <Link href={switchLanguage('en')}>EN</Link>
                        </Button>
                        <Button
                          variant={lang === 'ja' ? 'default' : 'outline'}
                          size="sm"
                          asChild
                          className={`text-xs ${lang === 'ja' ? 'bg-primary hover:bg-primary/90' : ''}`}
                        >
                          <Link href={switchLanguage('ja')}>JP</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
} 