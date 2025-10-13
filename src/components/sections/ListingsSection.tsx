"use client"

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ArrowRight, Filter, Search, Loader2, AlertCircle } from 'lucide-react'

type MachineryItem = {
  id: string
  slug?: string
  categorySlug?: string
  name: string
  category: string
  subcategory?: string
  manufacturer: string
  modelNumber: string
  year: number
  location: string
  price: number
  priceFormatted?: string
  priceJPY?: string
  images: string[]
  featured: boolean
  condition?: string
}

interface ListingsSectionProps {
  lang: string
  limit?: number
}

type ListingsContent = ReturnType<typeof createListingsContent>

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400?text=No+Image+Available'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 90 }
  }
}

function createListingsContent(isJapanese: boolean) {
  return {
    title: isJapanese ? '機械在庫一覧' : 'Machinery Listings',
    subtitle: isJapanese
      ? '高品質な日本製機械を世界各国へ。適正価格で幅広い種類の機械をご提供いたします。'
      : 'Quality Japanese machinery available for worldwide export. Wide range of equipment at competitive prices.',
    viewAll: isJapanese ? 'すべて見る' : 'View All',
    viewDetails: isJapanese ? '詳細を見る' : 'View Details',
    location: isJapanese ? '所在地' : 'Location',
    year: isJapanese ? '年式' : 'Year',
    price: isJapanese ? '価格' : 'Price',
    featured: isJapanese ? 'おすすめ' : 'Featured',
    noResults: isJapanese
      ? '条件に一致する機械が見つかりませんでした。'
      : 'No machinery found matching your criteria.',
    loadingText: isJapanese ? '最新の在庫情報を読み込んでいます…' : 'Loading latest listings…',
    loadFailedText: isJapanese ? 'データの読み込みに失敗しました。' : 'Failed to load listings.',
    retry: isJapanese ? '再読み込み' : 'Refresh'
  }
}

export default function ListingsSection({ lang, limit }: ListingsSectionProps) {
  const isJapanese = lang === 'ja'
  const [activeTab, setActiveTab] = useState('all')
  const [machineryItems, setMachineryItems] = useState<MachineryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchMachineryItems = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/content/machinery', {
          cache: 'no-store'
        })
        if (!response.ok) {
          throw new Error('Failed to load machinery listings')
        }

        const data = await response.json()
        if (!isMounted) {
          return
        }

        const items: MachineryItem[] = (data.data || []).map((item: any) => {
          const images =
            Array.isArray(item.images) && item.images.length > 0
              ? item.images
              : [PLACEHOLDER_IMAGE]

          return {
            id: String(item.id),
            name: item.name ?? 'Unknown machinery',
            category: item.category ?? 'Other',
            subcategory: item.subcategory ?? undefined,
            manufacturer: item.manufacturer ?? '',
            modelNumber: item.modelNumber ?? '',
            year: Number(item.year) || new Date().getFullYear(),
            location: item.location ?? '',
            price: Number(item.price) || 0,
            priceFormatted: item.priceFormatted ?? undefined,
            priceJPY: item.priceJPY ?? undefined,
            images,
            featured: Boolean(item.featured),
            condition: item.condition ?? undefined
          }
        })

        setMachineryItems(items)
      } catch (err: unknown) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : 'Failed to load machinery listings.'
          setError(message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchMachineryItems()

    return () => {
      isMounted = false
    }
  }, [])

  const content = useMemo(() => createListingsContent(isJapanese), [isJapanese])

  const categoryOptions = useMemo(() => {
    const baseLabels = isJapanese
      ? {
          all: 'すべて',
          excavator: 'ショベル',
          loader: 'ホイールローダー',
          bulldozer: 'ブルドーザー',
          crane: 'クレーン',
          forklift: 'フォークリフト'
        }
      : {
          all: 'All',
          excavator: 'Excavators',
          loader: 'Loaders',
          bulldozer: 'Bulldozers',
          crane: 'Cranes',
          forklift: 'Forklifts'
        }

    const seen = new Set<string>(['all'])
    const options: { value: string; label: string }[] = [
      { value: 'all', label: baseLabels.all }
    ]

    const availableCategories = machineryItems
      .map(item => item.category)
      .filter((category): category is string => Boolean(category))

    const preferredOrder = ['excavator', 'loader', 'bulldozer', 'crane', 'forklift']
    preferredOrder.forEach(orderCategory => {
      const match = availableCategories.find(
        category => category.toLowerCase() === orderCategory
      )
      if (!match) {
        return
      }

      options.push({
        value: match,
        label: baseLabels[orderCategory as keyof typeof baseLabels] ?? match
      })
      seen.add(match.toLowerCase())
    })

    availableCategories.forEach(category => {
      const key = category.toLowerCase()
      if (seen.has(key)) {
        return
      }

      options.push({
        value: category,
        label: baseLabels[key as keyof typeof baseLabels] ?? category
      })
      seen.add(key)
    })

    if (options.length === 1) {
      options.push({ value: 'featured', label: content.featured })
    }

    return options
  }, [machineryItems, isJapanese, content.featured])

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') {
      return machineryItems
    }

    return machineryItems.filter(
      item => item.category?.toLowerCase() === activeTab.toLowerCase()
    )
  }, [activeTab, machineryItems])

  const displayedItems = useMemo(() => {
    return typeof limit === 'number' ? filteredItems.slice(0, limit) : filteredItems
  }, [filteredItems, limit])

  return (
    <section className="py-16 md:py-24 section-alternate-1">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="inline-block border-b-4 border-primary pb-2">
                {content.title}
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl">{content.subtitle}</p>
          </div>

          {limit && (
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
              asChild
            >
              <Link href={`/${lang}/machinery`}>
                {content.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-muted overflow-x-auto">
                {categoryOptions.map(option => (
                  <TabsTrigger
                    key={option.value}
                    value={option.value}
                    className="whitespace-nowrap"
                  >
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">{content.loadingText}</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
                  <p className="text-red-600 font-medium mb-2">{content.loadFailedText}</p>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    {content.retry}
                  </Button>
                </div>
              ) : displayedItems.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {displayedItems.map(item => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <MachineryCard item={item} lang={lang} content={content} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{content.noResults}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

interface MachineryCardProps {
  item: MachineryItem
  lang: string
  content: ListingsContent
}

function MachineryCard({ item, lang, content }: MachineryCardProps) {
  const locale = lang === 'ja' ? 'ja-JP' : 'en-US'
  const currency = lang === 'ja' ? 'JPY' : 'USD'

  const priceDisplay = useMemo(() => {
    if (item.priceFormatted) {
      return item.priceFormatted
    }
    if (item.priceJPY) {
      return item.priceJPY
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(item.price)
  }, [currency, item.price, item.priceFormatted, item.priceJPY, locale])

  const imageSrc = item.images.length > 0 ? item.images[0] : PLACEHOLDER_IMAGE

  return (
    <Card className="overflow-hidden h-full flex flex-col bg-card border border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        {item.featured && (
          <div className="absolute top-2 right-2 bg-parrot-red text-white text-xs font-medium py-1 px-2 rounded">
            {content.featured}
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-2 truncate" title={item.name}>
          {item.name}
        </h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>{content.year}:</span>
            <span className="font-medium text-foreground">{item.year}</span>
          </div>
          <div className="flex justify-between">
            <span>{content.location}:</span>
            <span className="font-medium text-foreground">{item.location}</span>
          </div>
          <div className="flex justify-between">
            <span>{content.price}:</span>
            <span className="font-medium text-foreground">{priceDisplay}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto">
        <Button className="w-full bg-primary hover:bg-primary/90 text-white" asChild>
          <Link href={`/${lang}/machinery/${item.categorySlug || 'machinery'}/${item.slug || item.id}`}>
            {content.viewDetails}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}