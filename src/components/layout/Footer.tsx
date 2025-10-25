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
    <footer>
      {/* Upper section - Main footer content with navy blue background */}
      <div className="bg-[#1a2f5c] text-white">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            {/* Left column - Company info and social */}
            <div className="md:col-span-4 lg:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                {/* Logo */}
                <div className="h-10 w-10 bg-blue-500 flex items-center justify-center">
                  <span className="font-bold text-white text-lg">A</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">
                    {isJapanese ? 'アジワ商事' : 'Ajwa Trading'}
                  </h3>
                  <p className="text-xs text-blue-200">
                    {isJapanese ? '国際機械取引' : 'International Machinery Trading'}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-white/80 mb-6 max-w-md">
                {isJapanese 
                  ? '日本を拠点とする機械輸出入会社。品質の高い機械を世界各国へ輸出し、日本国内の中古機械を適正価格で買取いたします。' 
                  : 'Japan-based machinery export and import company. We export quality machinery worldwide and buy used machinery from Japanese customers at fair prices.'}
              </p>
              
              {/* Contact information */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-blue-300 mr-3" aria-hidden="true" />
                  <span className="text-sm text-white/80">{contactInfo.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 flex-shrink-0 text-blue-300 mr-3" aria-hidden="true" />
                  <Link href={`tel:${contactInfo.phone}`} className="text-sm text-white/80 hover:text-white transition-colors">
                    {contactInfo.phone}
                  </Link>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 flex-shrink-0 text-blue-300 mr-3" aria-hidden="true" />
                  <Link href={`mailto:${contactInfo.email}`} className="text-sm text-white/80 hover:text-white transition-colors">
                    {contactInfo.email}
                  </Link>
                </div>
              </div>
              
              {/* Social media */}
              <div className="flex space-x-4">
                <Link 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-[#2a4070] h-8 w-8 flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-[#2a4070] h-8 w-8 flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-[#2a4070] h-8 w-8 flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-[#2a4070] h-8 w-8 flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
            
            {/* Right column - Quick links */}
            <div className="md:col-span-8 lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {/* Company Links */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-blue-500 pb-2 mb-4">
                    {footerNavigation.company.title}
                  </h3>
                  <ul className="space-y-2">
                    {footerNavigation.company.links.map((item, index) => (
                      <li key={index}>
                        <Link 
                          href={item.href} 
                          className="text-sm text-white/70 hover:text-white hover:pl-1 transition-all duration-300"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Services Links */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-blue-500 pb-2 mb-4">
                    {footerNavigation.services.title}
                  </h3>
                  <ul className="space-y-2">
                    {footerNavigation.services.links.map((item, index) => (
                      <li key={index}>
                        <Link 
                          href={item.href} 
                          className="text-sm text-white/70 hover:text-white hover:pl-1 transition-all duration-300"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Support Links */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-blue-500 pb-2 mb-4">
                    {footerNavigation.support.title}
                  </h3>
                  <ul className="space-y-2">
                    {footerNavigation.support.links.map((item, index) => (
                      <li key={index}>
                        <Link 
                          href={item.href} 
                          className="text-sm text-white/70 hover:text-white hover:pl-1 transition-all duration-300"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Contact button */}
              <div className="mt-10 sm:mt-12">
                <Link 
                  href={`/${lang}/contact`}
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 transition-colors"
                >
                  {isJapanese ? 'お問い合わせ' : 'Contact Us'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lower section - Copyright and secondary links with darker background */}
      <div className="bg-[#0f1d38] text-white py-4">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-white/60 mb-4 md:mb-0">
            &copy; {currentYear} Ajwa Trading Limited. {isJapanese ? '全著作権所有。' : 'All rights reserved.'}
          </p>
          <div className="flex space-x-6">
            {footerNavigation.support.links.map((item, index) => (
              <Link 
                key={index} 
                href={item.href}
                className="text-xs text-white/60 hover:text-white transition-colors"
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