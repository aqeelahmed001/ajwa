"use client";

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { useSearchParams } from 'next/navigation'
import { Phone, Mail, MapPin, Clock, Globe, ArrowRight, MessageSquare, TruckIcon, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react';
import SellBuyForm from '@/components/forms/SellBuyForm';
import LocationsSection from '@/components/sections/LocationsSection';
import { toast } from 'sonner';

export default function ContactPage({ params }: { params: { lang: string } }) {
  const isJapanese = params.lang === 'ja'
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  // Set initial tab based on URL parameter or default to 'contact'
  const [activeTab, setActiveTab] = useState(tabParam === 'sell' ? 'sell' : tabParam === 'buy' ? 'buy' : 'contact');
  
  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam === 'sell') {
      setActiveTab('sell');
    } else if (tabParam === 'buy') {
      setActiveTab('buy');
    } else if (tabParam === 'contact') {
      setActiveTab('contact');
    }
  }, [tabParam]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(isJapanese ? 'お問い合わせを送信しました。' : 'Your message has been sent successfully.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
        });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(isJapanese ? 'エラーが発生しました。後でもう一度お試しください。' : 'An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const content = {
    title: isJapanese ? 'お問い合わせ' : 'Contact Us',
    subtitle: isJapanese 
      ? '機械の購入や売却に関するご質問は、下記フォームよりお気軽にお問い合わせください。専門スタッフが迅速に対応いたします。'
      : 'Have questions about machinery purchase or sale? Contact our team using the form below and our specialists will respond promptly.',
    formTitle: isJapanese ? '問い合わせフォーム' : 'Contact Form',
    nameLabel: isJapanese ? 'お名前' : 'Full Name',
    namePlaceholder: isJapanese ? 'お名前をご入力ください' : 'Enter your full name',
    emailLabel: isJapanese ? 'メールアドレス' : 'Email Address',
    emailPlaceholder: isJapanese ? 'メールアドレスをご入力ください' : 'Enter your email address',
    phoneLabel: isJapanese ? '電話番号' : 'Phone Number',
    phonePlaceholder: isJapanese ? '電話番号をご入力ください' : 'Enter your phone number',
    subjectLabel: isJapanese ? '件名' : 'Subject',
    subjectPlaceholder: isJapanese ? '件名をご入力ください' : 'Enter message subject',
    inquiryTypeLabel: isJapanese ? 'お問い合わせ種別' : 'Inquiry Type',
    inquiryTypes: isJapanese 
      ? ['機械の購入について', '機械の売却について', '輸出入手続きについて', 'その他のお問い合わせ']
      : ['Machinery Purchase', 'Machinery Sale', 'Export/Import Procedures', 'Other Inquiry'],
    messageLabel: isJapanese ? 'メッセージ' : 'Message',
    messagePlaceholder: isJapanese ? 'お問い合わせ内容をご入力ください' : 'Enter your message here',
    submitButton: isJapanese ? '送信する' : 'Submit Inquiry',
    contactInfoTitle: isJapanese ? '連絡先情報' : 'Contact Information',
    officeAddress: isJapanese ? '〒498-0052 愛知県弥富市稲荷３丁目20番地' : '〒 498 - 0052 Aichi ken Yatomi-shi Inari 3-chōme 20',
    phoneNumber: '+81 080-4303-1786',
    emailAddress: 'info@ajwa.co.jp',
    businessHours: isJapanese ? '平日 9:00 - 18:00（日本時間）' : 'Mon-Fri 9:00 - 18:00 (JST)',
    website: 'www.ajwa.co.jp',
    formDisclaimer: isJapanese 
      ? '※ ご入力いただいた個人情報は、お問い合わせへの対応とそれに付随する業務以外には使用いたしません。'
      : 'The personal information provided will only be used to respond to your inquiry and associated business operations.',
    privacyLink: isJapanese ? 'プライバシーポリシー' : 'Privacy Policy',
    contactMethodsTitle: isJapanese ? 'その他の連絡方法' : 'Other Ways to Reach Us',
    contactMethodsText: isJapanese 
      ? '電話、メール、または訪問によるお問い合わせも歓迎しています。営業時間内にお問い合わせいただければ、専門スタッフが対応いたします。'
      : 'We welcome inquiries by phone, email, or in-person visits. Our expert staff are available during business hours to assist you.'
  }
  
  return (
    <div className="bg-slate-50">
      {/* Header section */}
      <div className="py-16 md:py-24 relative overflow-hidden">
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/mach5.jpg" 
            alt="Contact Us" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F25912] to-[#FA812F]/90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
        </div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="container relative">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {content.title}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              {content.subtitle}
            </p>
          </div>
        </div>
      </div>
      
      <div className="container py-16 md:py-24">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form Tabs and Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex mb-6 border-b border-gray-200">
              <button
                className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === 'contact' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('contact')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {isJapanese ? 'お問い合わせ' : 'General Inquiry'}
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === 'sell' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('sell')}
              >
                <TruckIcon className="mr-2 h-4 w-4" />
                {isJapanese ? '機械を売る' : 'Sell Machinery'}
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === 'buy' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('buy')}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isJapanese ? '機械を購入' : 'Buy Machinery'}
              </button>
            </div>
            
            {/* Contact Form */}
            {activeTab === 'contact' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-6">{content.formTitle}</h2>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      {content.nameLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={content.namePlaceholder}
                      className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      {content.emailLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={content.emailPlaceholder}
                      className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      {content.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={content.phonePlaceholder}
                      className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  {/* Company Field */}
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">
                      {content.nameLabel}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder={content.namePlaceholder}
                      className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                {/* Subject Field */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    {content.subjectLabel} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="" disabled selected>-- {isJapanese ? '選択してください' : 'Select one'} --</option>
                    {content.inquiryTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Message Field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {content.messageLabel} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder={content.messagePlaceholder}
                    className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <p className="text-xs text-muted-foreground">
                    {content.formDisclaimer}
                    <Link href={`/${params.lang}/privacy`} className="text-primary hover:underline ml-1">
                      {content.privacyLink}
                    </Link>
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? (isJapanese ? '送信中...' : 'Sending...') : content.submitButton}
                  </button>
                </div>
              </form>
            </div>
            )}
            
            {/* Sell Machinery Form */}
            {activeTab === 'sell' && (
              <SellBuyForm lang={params.lang} type="sell" />
            )}
            
            {/* Buy Machinery Form */}
            {activeTab === 'buy' && (
              <SellBuyForm lang={params.lang} type="buy" />
            )}
          </div>
          
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-6">{content.contactInfoTitle}</h2>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{isJapanese ? '所在地' : 'Address'}</h3>
                    <p className="text-muted-foreground">{content.officeAddress}</p>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{isJapanese ? '電話番号' : 'Phone'}</h3>
                    <p className="text-muted-foreground">{content.phoneNumber}</p>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{isJapanese ? 'メールアドレス' : 'Email'}</h3>
                    <p className="text-muted-foreground">
                      <a href={`mailto:${content.emailAddress}`} className="hover:text-primary">
                        {content.emailAddress}
                      </a>
                    </p>
                  </div>
                </div>
                
                {/* Business Hours */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{isJapanese ? '営業時間' : 'Business Hours'}</h3>
                    <p className="text-muted-foreground">{content.businessHours}</p>
                  </div>
                </div>
                
                {/* Website */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{isJapanese ? 'ウェブサイト' : 'Website'}</h3>
                    <p className="text-muted-foreground">
                      <a href={`https://${content.website}`} className="hover:text-primary">
                        {content.website}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="font-semibold mb-2">{content.contactMethodsTitle}</h3>
                <p className="text-muted-foreground text-sm">{content.contactMethodsText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Locations Section */}
      <LocationsSection lang={params.lang} />
    </div>
  )
} 