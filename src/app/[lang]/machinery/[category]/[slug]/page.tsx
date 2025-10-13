import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, Phone, Mail, FileText, CheckCircle } from 'lucide-react'
import { Types } from 'mongoose'

import dbConnect from '@/lib/db'
import MachineryItemModel from '@/models/MachineryItem'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageSlider } from '@/components/ui/image-slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
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

function normalizeMachineryDoc(doc: Record<string, any>): MachineryDetail {
  const {
    _id,
    priceFormatted,
    priceJPY,
    images,
    specifications,
    tags,
    ...rest
  } = doc

  const specsEntries = specifications instanceof Map
    ? Object.fromEntries(specifications.entries())
    : specifications ?? {}

  const preparedImages = Array.isArray(images) && images.length > 0
    ? images
    : ['https://placehold.co/800x600?text=No+Image+Available']

  const numericPrice = typeof rest.price === 'number' ? rest.price : Number(rest.price) || 0

  return {
    id: _id.toString(),
    slug: rest.slug ?? 'unknown-machine',
    categorySlug: rest.categorySlug ?? 'machinery',
    name: rest.name ?? 'Unnamed Machinery',
    category: rest.category ?? 'Other',
    subcategory: rest.subcategory ?? undefined,
    manufacturer: rest.manufacturer ?? '',
    modelNumber: rest.modelNumber ?? '',
    year: typeof rest.year === 'number' ? rest.year : Number(rest.year) || new Date().getFullYear(),
    hours: typeof rest.hours === 'number' ? rest.hours : Number(rest.hours) || 0,
    price: numericPrice,
    priceFormatted:
      priceFormatted ?? (numericPrice > 0 ? `$${numericPrice.toLocaleString()}` : 'Contact for price'),
    priceJPY: priceJPY ?? '',
    images: preparedImages,
    location: rest.location ?? 'N/A',
    condition: rest.condition ?? 'N/A',
    weight: rest.weight ?? undefined,
    featured: Boolean(rest.featured),
    availability: rest.availability ?? 'In Stock',
    description: rest.description ?? '',
    specifications: specsEntries,
    tags: Array.isArray(tags) ? tags : []
  }
}

async function getMachineryData(categorySlug: string, slug: string): Promise<MachineryDetail | null> {
  await dbConnect()
  
  // First try the exact match with both slugs
  const doc = await MachineryItemModel.findOne({ categorySlug, slug }).lean()
  
  if (!doc) {
    // Try with just the slug
    const docBySlug = await MachineryItemModel.findOne({ slug }).lean()
    
    if (docBySlug) {
      return normalizeMachineryDoc(docBySlug as Record<string, any>)
    }
    
    // Try to find by ID in case slug is actually an ID
    if (Types.ObjectId.isValid(slug)) {
      const docById = await MachineryItemModel.findById(slug).lean()
      if (docById) {
        return normalizeMachineryDoc(docById as Record<string, any>)
      }
    }
    
    // Last resort - try case insensitive search
    const docCaseInsensitive = await MachineryItemModel.findOne({
      categorySlug: { $regex: new RegExp('^' + categorySlug + '$', 'i') },
      slug: { $regex: new RegExp('^' + slug + '$', 'i') }
    }).lean()
    
    if (docCaseInsensitive) {
      return normalizeMachineryDoc(docCaseInsensitive as Record<string, any>)
    }
    
    return null
  }

  return normalizeMachineryDoc(doc as Record<string, any>)
}

async function getSimilarMachinery(currentId: string, categorySlug: string) {
  await dbConnect()
  const docs = await MachineryItemModel.find({
    _id: { $ne: currentId },
    categorySlug
  })
    .sort({ featured: -1, createdAt: -1 })
    .limit(12)
    .lean()

  return docs.map(doc => normalizeMachineryDoc(doc as Record<string, any>))
}

export async function generateMetadata({
  params
}: {
  params: { slug: string; category: string; lang: string }
}): Promise<Metadata> {
  const machinery = await getMachineryData(params.category, params.slug)

  if (!machinery) {
    return {
      title: 'Machine Not Found'
    }
  }

  return {
    title: `${machinery.name} | Ajwa Trading`,
    description: machinery.description.substring(0, 160)
  }
}

export default async function MachineryDetailPage({
  params
}: {
  params: { slug: string; category: string; lang: string }
}) {
  const isJapanese = params.lang === 'ja'
  const machinery = await getMachineryData(params.category, params.slug)

  if (!machinery) {
    notFound()
  }

  const similarMachinery = await getSimilarMachinery(machinery.id, machinery.categorySlug)

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

  const sliderImages = machinery.images.map((url, index) => ({
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
    <div className="bg-slate-50 py-10 md:py-16">
      <div className="container">
        {/* Breadcrumb / Back button */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="hover:bg-white/80">
            <Link href={`/${params.lang}/machinery`} className="flex items-center text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {translations.backToListing}
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column: Image slider and specs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image slider */}
            <ImageSlider images={sliderImages} />

            {/* Machine details */}
            <div>
              <div className="flex flex-wrap gap-2 items-center mb-4">
                <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
                  {machinery.category}
                </Badge>
                <Badge variant="outline" className="bg-muted hover:bg-muted/80">
                  {machinery.manufacturer || '—'}
                </Badge>
                <Badge variant="outline" className="bg-muted hover:bg-muted/80">
                  {machinery.year}
                </Badge>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-4">{machinery.name}</h1>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{translations.price}</span>
                    <span className="font-semibold">{machinery.priceFormatted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{translations.year}</span>
                    <span>{machinery.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{translations.hours}</span>
                    <span>{machinery.hours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{translations.condition}</span>
                    <span>{machinery.condition}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{translations.location}</span>
                    <span>{machinery.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{translations.weight}</span>
                    <span>{machinery.weight || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{translations.availability}</span>
                    <span className="text-green-600 font-medium flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      {translations.inStock}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{translations.description}</h2>
                <p className="text-muted-foreground leading-relaxed">{machinery.description}</p>
              </div>

              {/* Specifications */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{translations.specifications}</h2>
                {specificationEntries.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                    {specificationEntries.map(([specName, value]) => (
                      <div key={specName} className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">{specName}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">{isJapanese ? '仕様情報がありません。' : 'Specification details are not available for this machine.'}</p>
                )}
              </div>

              {/* Features */}
              {featureList.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">{translations.features}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {featureList.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column: Contact info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-3">
                  <h2 className="text-xl font-semibold mb-2">{translations.contactSeller}</h2>
                  <p className="text-muted-foreground">{sellerInfo.name}</p>
                  <div>
                    <div className="text-2xl font-bold text-primary">{machinery.priceFormatted}</div>
                    {machinery.priceJPY && (
                      <p className="text-sm text-muted-foreground">{machinery.priceJPY}</p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{translations.contactIntro}</p>
                </div>

                <Separator />

                <form
                  className="space-y-4"
                  action={`/${params.lang}/contact`}
                  method="get"
                >
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">{translations.form.nameLabel}</Label>
                    <Input
                      id="contact-name"
                      name="name"
                      placeholder={translations.form.namePlaceholder}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">{translations.form.emailLabel}</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder={translations.form.emailPlaceholder}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">{translations.form.phoneLabel}</Label>
                    <Input
                      id="contact-phone"
                      name="phone"
                      placeholder={translations.form.phonePlaceholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">{translations.form.messageLabel}</Label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      placeholder={translations.form.messagePlaceholder}
                      rows={4}
                    />
                  </div>
                  <input type="hidden" name="machinery" value={machinery.id} />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    {translations.form.submit}
                  </Button>
                </form>

                <Separator />

                <div className="space-y-4">
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                    <Link href={`tel:${sellerInfo.contact}`} className="flex items-center justify-center w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      {translations.callNow}
                    </Link>
                  </Button>

                  <Button size="lg" className="w-full bg-parrot-red hover:bg-parrot-red/90">
                    <Link href={`mailto:${sellerInfo.email}`} className="flex items-center justify-center w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      {translations.sendEmail}
                    </Link>
                  </Button>

                  <Button size="lg" variant="outline" className="w-full">
                    <Link href={`/${params.lang}/contact?machinery=${machinery.id}`} className="flex items-center justify-center w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      {translations.requestInfo}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Listings Section */}
        {similarMachinery.length > 0 && (
          <div className="mt-16">
            <SimilarListings
              currentMachinery={{
                id: machinery.id,
                category: machinery.category,
                categorySlug: machinery.categorySlug,
                manufacturer: machinery.manufacturer,
                modelNumber: machinery.modelNumber,
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
              maxItems={3}
            />
          </div>
        )}
      </div>
    </div>
  )
}
