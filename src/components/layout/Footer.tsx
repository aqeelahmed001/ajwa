"use client";

import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FooterProps {
  lang: string;
}

export default function Footer({ lang }: FooterProps) {
  const isJapanese = lang === 'ja'
  const currentYear = new Date().getFullYear()
  
  // Footer navigation with translations
  const footerNavigation = {
    company: {
      title: isJapanese ? '会社情報' : 'Company',
      links: [
        { name: isJapanese ? '会社概要' : 'About Us', href: `/${lang}/about` },
        { name: isJapanese ? 'サービス' : 'Services', href: `/${lang}/services` },
        { name: isJapanese ? '機械一覧' : 'Machinery', href: `/${lang}/machinery` },
        { name: isJapanese ? 'お問い合わせ' : 'Contact', href: `/${lang}/contact` }
      ]
    },
    services: {
      title: isJapanese ? 'サービス' : 'Services',
      links: [
        { name: isJapanese ? '機械輸出' : 'Machinery Export', href: `/${lang}/services#export` },
        { name: isJapanese ? '中古機械買取' : 'Used Machinery Purchase', href: `/${lang}/services#purchase` },
        { name: isJapanese ? '輸出代行' : 'Export Agency', href: `/${lang}/services#agency` },
        { name: isJapanese ? '査定サービス' : 'Valuation Service', href: `/${lang}/services#valuation` }
      ]
    },
    support: {
      title: isJapanese ? 'サポート' : 'Support',
      links: [
        { name: isJapanese ? 'よくある質問' : 'FAQ', href: `/${lang}/faq` },
        { name: isJapanese ? 'プライバシーポリシー' : 'Privacy Policy', href: `/${lang}/privacy` },
        { name: isJapanese ? '利用規約' : 'Terms of Service', href: `/${lang}/terms` }
      ]
    }
  }
  
  const contactInfo = {
    address: isJapanese 
      ? '〒123-4567 東京都新宿区西新宿1-1-1' 
      : '1-1-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo 123-4567, Japan',
    phone: '+81-3-1234-5678',
    email: 'contact@ajwa-trading.com'
  }

  return (
    <footer className="bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Information */}
          <div>
            <div className="flex items-center gap-2">
              {/* Logo placeholder */}
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="font-bold text-primary-foreground">A</span>
              </div>
              <span className="font-bold text-lg">
                {isJapanese ? 'アジワ商事' : 'Ajwa Trading'}
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {isJapanese 
                ? '日本を拠点とする機械輸出入会社。品質の高い機械を世界各国へ輸出し、日本国内の中古機械を適正価格で買取いたします。' 
                : 'Japan-based machinery export and import company. We export quality machinery worldwide and buy used machinery from Japanese customers at fair prices.'}
            </p>
            <div className="mt-6 flex space-x-3">
              <Link href="https://twitter.com" target="_blank" rel="noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              <Link href="https://facebook.com" target="_blank" rel="noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Button>
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2">
            {/* Company Links */}
            <div>
              <h3 className="text-sm font-medium">{footerNavigation.company.title}</h3>
              <ul className="mt-4 space-y-2">
                {footerNavigation.company.links.map((item, index) => (
                  <li key={index}>
                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Services Links */}
            <div>
              <h3 className="text-sm font-medium">{footerNavigation.services.title}</h3>
              <ul className="mt-4 space-y-2">
                {footerNavigation.services.links.map((item, index) => (
                  <li key={index}>
                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Support Links */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-sm font-medium">{footerNavigation.support.title}</h3>
              <ul className="mt-4 space-y-2">
                {footerNavigation.support.links.map((item, index) => (
                  <li key={index}>
                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium">{isJapanese ? 'お問い合わせ' : 'Contact'}</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground mr-2" aria-hidden="true" />
                {contactInfo.address}
              </li>
              <li className="flex">
                <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground mr-2" aria-hidden="true" />
                <Link href={`tel:${contactInfo.phone}`} className="hover:text-foreground transition-colors">
                  {contactInfo.phone}
                </Link>
              </li>
              <li className="flex">
                <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground mr-2" aria-hidden="true" />
                <Link href={`mailto:${contactInfo.email}`} className="hover:text-foreground transition-colors">
                  {contactInfo.email}
                </Link>
              </li>
            </ul>
            <div className="mt-6">
              <Button className="w-full" asChild>
                <Link href={`/${lang}/contact`}>
                  {isJapanese ? 'お問い合わせ' : 'Contact Us'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 border-t border-border pt-8 text-center md:flex md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Ajwa Trading Limited. {isJapanese ? '全著作権所有。' : 'All rights reserved.'}
          </p>
          <div className="mt-4 flex justify-center space-x-6 md:mt-0">
            {footerNavigation.support.links.map((item, index) => (
              <Link 
                key={index} 
                href={item.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
} 