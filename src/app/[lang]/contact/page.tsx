import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock, Globe, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | Ajwa Trading Limited',
  description: 'Get in touch with Ajwa Trading Limited for machinery export and import inquiries. We provide professional consultation for buying and selling industrial machinery.',
}

export default function ContactPage({ params }: { params: { lang: string } }) {
  const isJapanese = params.lang === 'ja'
  
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
    officeAddress: isJapanese ? '〒123-4567 東京都新宿区西新宿1-1-1' : '1-1-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo 123-4567',
    phoneNumber: '+81 XX-XXXX-XXXX',
    emailAddress: 'info@ajwatrading.com',
    businessHours: isJapanese ? '平日 9:00 - 18:00（日本時間）' : 'Mon-Fri 9:00 - 18:00 (JST)',
    website: 'www.ajwatrading.com',
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
      <div className="bg-gradient-to-r from-primary to-primary-dark py-16 md:py-24 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
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
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-6">{content.formTitle}</h2>
              
              {/* Contact Form */}
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      {content.nameLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
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
                      placeholder={content.phonePlaceholder}
                      className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  {/* Subject Field */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      {content.subjectLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      placeholder={content.subjectPlaceholder}
                      className="w-full rounded-md border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                
                {/* Inquiry Type */}
                <div className="space-y-2">
                  <label htmlFor="inquiryType" className="text-sm font-medium">
                    {content.inquiryTypeLabel} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="inquiryType"
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
                    placeholder={content.messagePlaceholder}
                    rows={6}
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
                    className="px-8 py-3 bg-parrot-red hover:bg-parrot-red/90 text-white font-medium rounded-md flex items-center justify-center gap-2"
                  >
                    {content.submitButton}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
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
      
      {/* Map section */}
      <div className="h-96 w-full bg-slate-200">
        {/* Map integration would go here */}
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-medium mb-2">{isJapanese ? '地図が表示されます' : 'Map would display here'}</div>
            <div className="text-muted-foreground">{isJapanese ? '実際のマップAPIと連携する予定です' : 'Will be integrated with actual map API'}</div>
          </div>
        </div>
      </div>
    </div>
  )
} 