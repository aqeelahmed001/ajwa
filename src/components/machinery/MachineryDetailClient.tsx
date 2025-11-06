"use client";

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Phone, Mail, FileText, CheckCircle, ZoomIn, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import SimilarListings from '@/components/machinery/SimilarListings'

interface MachineryDetail {
  id: string
  slug: string
  categorySlug: string
  name: string
  category: string
  subcategory?: string
  manufacturer: string
  modelNumber: string
  year: number
  hours: number
  price: number
  priceFormatted: string
  priceJPY: string
  images: string[]
  location: string
  condition: string
  weight?: string
  featured: boolean
  availability: string
  description: string
  specifications: Record<string, string>
  tags: string[]
}

interface SliderImage {
  url: string;
  alt: string;
}

interface MachineryDetailClientProps {
  machinery: MachineryDetail;
  similarMachinery: MachineryDetail[];
  params: { slug: string; category: string; lang: string };
}

export default function MachineryDetailClient({ 
  machinery: initialMachinery, 
  similarMachinery: initialSimilarMachinery, 
  params 
}: MachineryDetailClientProps) {
  const isJapanese = params.lang === 'ja'
  
  // State for client-side interactivity
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'features'>('specs')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [machinery, setMachinery] = useState<MachineryDetail>(initialMachinery)
  const [similarMachinery, setSimilarMachinery] = useState<MachineryDetail[]>(initialSimilarMachinery)
  
  // Fetch fresh data from API
  React.useEffect(() => {
    const fetchFreshData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching fresh data from API...');
        const response = await fetch(`/api/machinery/${params.category}/${params.slug}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API response:', data);
        
        if (data.machinery) {
          setMachinery(data.machinery);
        }
        
        if (data.similarMachinery && Array.isArray(data.similarMachinery)) {
          console.log(`Got ${data.similarMachinery.length} similar machinery items`);
          setSimilarMachinery(data.similarMachinery);
        } else {
          console.warn('No similar machinery found or invalid format');
        }
      } catch (error) {
        console.error('Error fetching machinery data:', error);
        // Keep using the server-side provided data
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch if we're in the browser
    if (typeof window !== 'undefined') {
      fetchFreshData();
    }
  }, [params.category, params.slug]);

  const translations = {
    backToListing: isJapanese ? '機械一覧に戻る' : 'Back to Listings',
    specifications: isJapanese ? '仕様' : 'Specifications',
    features: isJapanese ? '特徴' : 'Features',
    description: isJapanese ? '説明' : 'Description',
    contactSeller: isJapanese ? '売主に連絡する' : 'Contact Seller',
    price: isJapanese ? '価格' : 'Price',
    year: isJapanese ? '年式' : 'Year',
    hours: isJapanese ? '使用時間' : 'Hours',
    condition: isJapanese ? '状態' : 'Condition',
    location: isJapanese ? '所在地' : 'Location',
    availability: isJapanese ? '在庫状況' : 'Availability',
    callNow: isJapanese ? '今すぐ電話' : 'Call Now',
    sendEmail: isJapanese ? 'メール送信' : 'Send Email',
    requestInfo: isJapanese ? '詳細情報をリクエスト' : 'Request Information',
    inStock: isJapanese ? '在庫あり' : 'In Stock',
    category: isJapanese ? 'カテゴリ' : 'Category',
    manufacturer: isJapanese ? 'メーカー' : 'Manufacturer',
    modelNumber: isJapanese ? 'モデル番号' : 'Model Number',
    weight: isJapanese ? '重量' : 'Weight',
    contactIntro: isJapanese
      ? 'お問い合わせフォームに必要事項をご記入ください。担当者よりご連絡いたします。'
      : 'Share a few details and our sales team will follow up shortly.',
    form: {
      nameLabel: isJapanese ? 'お名前' : 'Full Name',
      namePlaceholder: isJapanese ? '山田 太郎' : 'John Smith',
      emailLabel: isJapanese ? 'メールアドレス' : 'Email Address',
      emailPlaceholder: isJapanese ? 'example@example.com' : 'you@example.com',
      phoneLabel: isJapanese ? '電話番号' : 'Phone Number',
      phonePlaceholder: isJapanese ? '090-1234-5678' : '+81 90-1234-5678',
      messageLabel: isJapanese ? 'お問い合わせ内容' : 'Message',
      messagePlaceholder: isJapanese
        ? 'ご希望台数や用途などをご記入ください。'
        : 'Tell us about your requirements or questions.',
      submit: isJapanese ? '問い合わせる' : 'Submit Inquiry'
    }
  }

  const sliderImages: SliderImage[] = machinery.images.map((url, index) => ({
    url,
    alt: `${machinery.name} - Image ${index + 1}`
  }))

  const specificationEntries = Object.entries(machinery.specifications)
  const featureList = machinery.tags.length > 0 ? machinery.tags : []

  const sellerInfo = {
    name: 'Ajwa Trading Limited',
    contact: '+81 XX-XXXX-XXXX',
    email: 'info@ajwatrading.com'
  }
  
  return (
    <div className="bg-white py-8 md:py-12">
      <div className="container">
        {/* Breadcrumb / Back button */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="hover:bg-slate-50">
            <Link href={`/${params.lang}/machinery`} className="flex items-center text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {translations.backToListing}
            </Link>
          </Button>
        </div>

        {/* Machine Category Badge */}
        <div className="mb-4">
          <Badge className="bg-blue-600 text-white hover:bg-blue-700">
            {machinery.category}
          </Badge>
        </div>

        {/* Machine Name */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{machinery.name}</h1>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left column: Image slider and specs - 8 columns on large screens */}
          <div className="lg:col-span-8 space-y-8">
            {/* Image slider with interactive elements */}
            <div className="bg-slate-100 rounded-md overflow-hidden relative">
              <div className="relative aspect-[4/3] overflow-hidden">
                {sliderImages.length > 0 && (
                  <Image
                    src={sliderImages[currentImageIndex].url}
                    alt={sliderImages[currentImageIndex].alt}
                    fill
                    className="object-contain"
                    priority
                  />
                )}
                
                {/* Image navigation controls */}
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-full bg-white/80 hover:bg-white text-slate-700"
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === 0 ? sliderImages.length - 1 : prev - 1
                    )}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-full bg-white/80 hover:bg-white text-slate-700"
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === sliderImages.length - 1 ? 0 : prev + 1
                    )}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
                
                {/* Image actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/80 hover:bg-white text-slate-700">
                        <ZoomIn className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] p-1 bg-black/90">
                      <div className="relative h-full w-full">
                        <Image
                          src={sliderImages[currentImageIndex].url}
                          alt={sliderImages[currentImageIndex].alt}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-9 w-9 rounded-full ${isFavorite ? 'bg-red-100 text-red-500' : 'bg-white/80 hover:bg-white text-slate-700'}`}
                    onClick={() => {
                      setIsFavorite(!isFavorite);
                      toast.success(isFavorite ? 
                        (isJapanese ? 'お気に入りから削除しました' : 'Removed from favorites') : 
                        (isJapanese ? 'お気に入りに追加しました' : 'Added to favorites')
                      );
                    }}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-full bg-white/80 hover:bg-white text-slate-700"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success(isJapanese ? 'URLをコピーしました' : 'URL copied to clipboard');
                    }}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {currentImageIndex + 1} / {sliderImages.length}
                </div>
              </div>
            </div>

            {/* Thumbnail navigation - interactive */}
            <div className="hidden md:flex gap-2 overflow-x-auto pb-2">
              {sliderImages.slice(0, 8).map((image, index) => (
                <div 
                  key={index} 
                  className={`w-20 h-20 flex-shrink-0 border-2 rounded overflow-hidden relative cursor-pointer transition-all ${currentImageIndex === index ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 hover:border-primary/50'}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image 
                    src={image.url} 
                    alt={image.alt} 
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Machine details in tabs - interactive */}
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <Tabs defaultValue="specs" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                  <TabsList className="bg-transparent p-0 h-auto space-x-6">
                    <TabsTrigger 
                      value="specs" 
                      className="px-0 py-2 font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary"
                    >
                      {translations.specifications}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="description" 
                      className="px-0 py-2 font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary"
                    >
                      {translations.description}
                    </TabsTrigger>
                    {featureList.length > 0 && (
                      <TabsTrigger 
                        value="features" 
                        className="px-0 py-2 font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary"
                      >
                        {translations.features}
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>
              
                <TabsContent value="specs" className="p-6 border-none">
                  {/* Specifications */}
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">{translations.manufacturer}</span>
                        <span className="font-medium">{machinery.manufacturer || '—'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">{translations.modelNumber}</span>
                        <span className="font-medium">{machinery.modelNumber || '—'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">{translations.year}</span>
                        <span className="font-medium">{machinery.year}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">{translations.hours}</span>
                        <span className="font-medium">{machinery.hours.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">{translations.condition}</span>
                        <span className="font-medium">{machinery.condition}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">{translations.location}</span>
                        <span className="font-medium">{machinery.location}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">{translations.weight}</span>
                        <span className="font-medium">{machinery.weight || '—'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">{translations.availability}</span>
                        <span className="text-green-600 font-medium flex items-center">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          {translations.inStock}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Specifications */}
                  {specificationEntries.length > 0 && (
                    <div className="mt-8 animate-fadeIn">
                      <h3 className="text-lg font-semibold mb-4">{translations.specifications}</h3>
                      <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                        {specificationEntries.map(([specName, value]) => (
                          <div key={specName} className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-600">{specName}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="description" className="p-6 border-none">
                  {/* Description */}
                  <div className="animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-4">{translations.description}</h3>
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-600 leading-relaxed">{machinery.description}</p>
                    </div>
                  </div>
                </TabsContent>
                
                {featureList.length > 0 && (
                  <TabsContent value="features" className="p-6 border-none">
                    {/* Features */}
                    <div className="animate-fadeIn">
                      <h3 className="text-lg font-semibold mb-4">{translations.features}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4">
                        {featureList.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            <span className="text-slate-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>

          {/* Right column: Contact info - 4 columns on large screens */}
          <div className="lg:col-span-4">
            {/* Purchase Information Card */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg overflow-hidden mb-6">
              <div className="bg-yellow-100 py-3 px-4">
                <h2 className="text-lg font-bold text-center">
                  {isJapanese ? '買取について' : 'Purchase Information'}
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">
                    {isJapanese ? 'お見積り・査定は無料' : 'Free Quotes & Assessments'}
                  </p>
                </div>
                
                {/* LINE Contact Button with animation */}
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white transition-transform active:scale-95"
                  onClick={() => {
                    window.open('https://line.me/R/ti/p/@ajwatrading', '_blank');
                    toast.success(isJapanese ? 'LINEを開きます' : 'Opening LINE');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" className="mr-2 h-5 w-5">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258.923.258.344.115.624.344.624.793 0 .025-.8.188-.19.362-.12.195-.52.764-.6.936-.18.382.196.764.718.414.523-.346 2.832-1.666 3.863-2.287 2.307-1.262 4.37-3.645 4.37-6.57h-2.894c0 4.455-4.447 8.08-9.929 8.08-5.48 0-9.928-3.625-9.928-8.08s4.449-8.08 9.928-8.08c4.764 0 8.755 2.747 9.717 6.396H24z"/>
                  </svg>
                  <span className="relative">
                    {isJapanese ? 'LINEで査定' : 'Contact via LINE'}
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                    </span>
                  </span>
                </Button>
                
                {/* Form Button with animation */}
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-transform active:scale-95"
                  onClick={() => {
                    // Scroll to contact form
                    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                    toast.success(isJapanese ? 'お問い合わせフォームへ' : 'Scrolled to contact form');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h10" />
                    <path d="M7 12h10" />
                    <path d="M7 17h10" />
                  </svg>
                  {isJapanese ? '買取フォームで査定' : 'Request Quote'}
                </Button>
                
                {/* Phone contact with animation */}
                <div className="text-center text-sm text-slate-700 pt-2">
                  <p>{isJapanese ? 'お電話でもお受けいたしております' : 'We also accept phone inquiries'}</p>
                  <a 
                    href={`tel:${sellerInfo.contact}`} 
                    className="font-bold text-xl text-blue-700 hover:text-blue-800 block mt-1 transition-all hover:scale-105"
                    onClick={() => toast.success(isJapanese ? '電話をかけます' : 'Calling...')}
                  >
                    {sellerInfo.contact}
                  </a>
                  <p className="text-xs text-slate-500 mt-1">{isJapanese ? '平日9:00-17:00' : 'Weekdays 9:00-17:00'}</p>
                </div>
              </div>
            </div>
            
            {/* Contact Form - Interactive */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden" id="contact-form">
              <div className="bg-slate-50 border-b border-slate-200 py-3 px-4">
                <h2 className="font-semibold flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  {translations.contactSeller}
                </h2>
              </div>
              <div className="p-4">
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const formValues = Object.fromEntries(formData.entries());
                    
                    // Simulate form submission
                    toast.promise(
                      new Promise((resolve) => setTimeout(resolve, 1500)),
                      {
                        loading: isJapanese ? '送信中...' : 'Sending...',
                        success: () => {
                          // Reset form
                          e.currentTarget.reset();
                          return isJapanese ? 
                            'お問い合わせを送信しました。担当者からご連絡いたします。' : 
                            'Your inquiry has been sent. Our team will contact you shortly.';
                        },
                        error: isJapanese ? 
                          'エラーが発生しました。後でもう一度お試しください。' : 
                          'An error occurred. Please try again later.',
                      }
                    );
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-sm">{translations.form.nameLabel}</Label>
                    <Input
                      id="contact-name"
                      name="name"
                      placeholder={translations.form.namePlaceholder}
                      required
                      className="h-9 text-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-sm">{translations.form.emailLabel}</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder={translations.form.emailPlaceholder}
                      required
                      className="h-9 text-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone" className="text-sm">{translations.form.phoneLabel}</Label>
                    <Input
                      id="contact-phone"
                      name="phone"
                      placeholder={translations.form.phonePlaceholder}
                      className="h-9 text-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message" className="text-sm">{translations.form.messageLabel}</Label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      placeholder={translations.form.messagePlaceholder}
                      rows={3}
                      className="text-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                    />
                  </div>
                  <input type="hidden" name="machinery" value={machinery.id} />
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-sm transition-all active:scale-98 hover:shadow-md"
                  >
                    {translations.form.submit}
                  </Button>
                  <p className="text-xs text-center text-slate-500 mt-2">
                    {isJapanese ? 
                      '※ 個人情報は適切に管理し、お問い合わせ対応以外には使用いたしません。' : 
                      '* Your personal information will be properly managed and used only for inquiry response.'}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Listings Section */}
        <div className="mt-16">
          {similarMachinery.length === 0 ? (
            <div className="p-8 text-center border border-slate-200 rounded-lg bg-slate-50">
              <p className="text-slate-500">{isJapanese ? '類似の機械は見つかりませんでした' : 'No similar machinery found'}</p>
              {/* <p className="text-xs text-slate-400 mt-2">{`Debug: Found ${similarMachinery.length} items`}</p> */}
            </div>
          ) : (
            <SimilarListings
              currentMachinery={{
                id: machinery.id,
                category: machinery.category,
                categorySlug: machinery.categorySlug,
                manufacturer: machinery.manufacturer,
                modelNumber: machinery.modelNumber,
                year: machinery.year,
                hours: machinery.hours,
                price: machinery.price,
                condition: machinery.condition,
                location: machinery.location,
                featured: machinery.featured,
                subcategory: machinery.subcategory,
                tags: machinery.tags,
                slug: machinery.slug
              }}
              allMachinery={similarMachinery.map(item => ({
                id: item.id,
                slug: item.slug,
                categorySlug: item.categorySlug,
                name: item.name,
                category: item.category,
                subcategory: item.subcategory ?? '',
                manufacturer: item.manufacturer,
                modelNumber: item.modelNumber,
                year: item.year,
                hours: item.hours,
                price: item.price,
                priceFormatted: item.priceFormatted,
                priceJPY: item.priceJPY,
                images: item.images,
                location: item.location,
                condition: item.condition,
                weight: item.weight ?? '',
                featured: item.featured,
                availability: item.availability,
                description: item.description,
                specifications: item.specifications,
                tags: item.tags
              }))}
              lang={params.lang}
              maxItems={4}
            />
          )}
        </div>
      </div>
    </div>
  );
}
