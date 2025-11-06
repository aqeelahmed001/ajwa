"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import HorizontalFilterBar from '@/components/machinery/HorizontalFilterBar'
import CompactMachineryCard from '@/components/machinery/CompactMachineryCard'
import { 
  ArrowRight, 
  ArrowUpDown, 
  Filter, 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronRight,
  ChevronLeft,
  Star,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Info,
  Eye
} from 'lucide-react'

// export const metadata: Metadata = {
//   title: 'Machinery Stock | Ajwa Co LTD',
//   description: 'Browse our current stock of quality used and new machinery available for export and domestic sale.',
// }

// Define machinery item shape for the stock page
interface MachineryItem {
  id: string
  slug?: string
  categorySlug?: string
  name: string
  category: string
  subcategory: string
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
  weight: string
  featured: boolean
  availability: string
  description: string
  specifications: Record<string, string>
  tags?: string[]
}

export default function MachineryStockPage({ params }: { params: { lang: string } }) {
  const isJapanese = params.lang === 'ja'
  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedManufacturer, setSelectedManufacturer] = useState('all')
  const [selectedCondition, setSelectedCondition] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000])
  const [priceLimits, setPriceLimits] = useState<[number, number]>([0, 150000])
  const [yearRange, setYearRange] = useState<[number, number]>([2010, new Date().getFullYear()])
  const [yearLimits, setYearLimits] = useState<[number, number]>([2010, new Date().getFullYear()])
  const [hoursRange, setHoursRange] = useState<[number, number]>([0, 10000])
  const [hoursLimits, setHoursLimits] = useState<[number, number]>([0, 10000])
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const itemsPerPage = 6
  
  // Add state for loading and error handling
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [machineryItems, setMachineryItems] = useState<MachineryItem[]>([])
  
  // Fetch machinery data from API
  useEffect(() => {
    const fetchMachineryData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Import the service dynamically to avoid server/client mismatch
        const { fetchPublicMachineryItems } = await import('@/services/publicMachineryService')
        const apiData = await fetchPublicMachineryItems()
        
        // Convert API data to the expected format for this page
        const convertedData = apiData.map(item => {
          // Create a base machinery item with common properties
          const baseItem = {
            id: item.id,
            slug: item.slug || item.id,
            categorySlug: item.categorySlug || item.category?.toLowerCase().replace(/\s+/g, '-') || 'machinery',
            name: item.name,
            category: item.category,
            subcategory: item.subcategory || '',
            manufacturer: item.manufacturer,
            modelNumber: item.modelNumber,
            year: item.year,
            hours: item.hours,
            price: item.price,
            priceFormatted: item.priceFormatted || `$${item.price.toLocaleString()}`,
            priceJPY: item.priceJPY || '',
            images: item.images || [],
            location: item.location,
            condition: item.condition,
            weight: item.weight || '',
            featured: item.featured,
            availability: item.availability,
            description: item.description,
            specifications: item.specifications || {},
            tags: item.tags || []
          }
          
          return baseItem as MachineryItem
        })
        
        setMachineryItems(convertedData)

        if (convertedData.length > 0) {
          const priceValues = convertedData
            .map(item => item.price)
            .filter(value => Number.isFinite(value))
          const yearValues = convertedData
            .map(item => item.year)
            .filter(value => Number.isFinite(value))
          const hourValues = convertedData
            .map(item => item.hours)
            .filter(value => Number.isFinite(value))

          if (priceValues.length > 0) {
            const minPrice = Math.min(...priceValues)
            const maxPrice = Math.max(...priceValues)
            const adjustedMaxPrice = minPrice === maxPrice ? maxPrice + 1 : maxPrice
            setPriceLimits([minPrice, adjustedMaxPrice])
            setPriceRange([minPrice, adjustedMaxPrice])
          }

          if (yearValues.length > 0) {
            const minYear = Math.min(...yearValues)
            const maxYear = Math.max(...yearValues)
            const adjustedMaxYear = minYear === maxYear ? maxYear + 1 : maxYear
            setYearLimits([minYear, adjustedMaxYear])
            setYearRange([minYear, adjustedMaxYear])
          }

          if (hourValues.length > 0) {
            const minHours = Math.min(...hourValues)
            const maxHours = Math.max(...hourValues)
            const adjustedMaxHours = minHours === maxHours ? maxHours + 1 : maxHours
            setHoursLimits([minHours, adjustedMaxHours])
            setHoursRange([minHours, adjustedMaxHours])
          }
        }
      } catch (err: any) {
        console.error('Error fetching machinery data:', err)
        setError(err.message || 'Failed to load machinery data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchMachineryData()
  }, [])

  // Extract unique values for filters
  const categories = ['all', ...Array.from(new Set(machineryItems.map(item => item.category)))]
  const manufacturers = ['all', ...Array.from(new Set(machineryItems.map(item => item.manufacturer)))]
  const conditions = ['all', ...Array.from(new Set(machineryItems.map(item => item.condition)))]
  const locations = ['all', ...Array.from(new Set(machineryItems.map(item => item.location)))]

  // Filter machinery based on all criteria
  const filteredMachinery = machineryItems.filter(item => {
    // Search query filter
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.modelNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    // Category filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false
    }
    
    // Manufacturer filter
    if (selectedManufacturer !== 'all' && item.manufacturer !== selectedManufacturer) {
      return false
    }
    
    // Condition filter
    if (selectedCondition !== 'all' && item.condition !== selectedCondition) {
      return false
    }
    
    // Location filter
    if (selectedLocation !== 'all' && item.location !== selectedLocation) {
      return false
    }
    
    // Price range filter
    if (item.price < priceRange[0] || item.price > priceRange[1]) {
      return false
    }
    
    // Year range filter
    if (item.year < yearRange[0] || item.year > yearRange[1]) {
      return false
    }
    
    // Hours range filter
    if (item.hours < hoursRange[0] || item.hours > hoursRange[1]) {
      return false
    }
    
    // Featured only filter
    if (showFeaturedOnly && !item.featured) {
      return false
    }
    
    return true
  })
  
  // Sort the filtered machinery
  const sortedMachinery = [...filteredMachinery].sort((a, b) => {
    switch (sortBy) {
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      case 'newest':
        return b.year - a.year
      case 'oldest':
        return a.year - b.year
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'hours-low':
        return a.hours - b.hours
      default:
        return 0
    }
  })
  
  // Pagination
  const totalPages = Math.ceil(sortedMachinery.length / itemsPerPage)
  const paginatedMachinery = sortedMachinery.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, selectedManufacturer, selectedCondition, selectedLocation, priceRange, yearRange, hoursRange, showFeaturedOnly, sortBy])

  const content = {
    title: isJapanese ? '在庫一覧' : 'Machinery Stock',
    subtitle: isJapanese
      ? '現在販売中の中古・新規機械一覧です。詳細は各機械のページをご覧ください。'
      : 'Browse our current stock of used and new machinery. Click on any machine for full details.',
    viewDetails: isJapanese ? '詳細を見る' : 'View Details',
    quickView: isJapanese ? 'クイックビュー' : 'Quick View',
    price: isJapanese ? '価格' : 'Price',
    year: isJapanese ? '年式' : 'Year',
    location: isJapanese ? '所在地' : 'Location',
    condition: isJapanese ? '状態' : 'Condition',
    category: isJapanese ? 'カテゴリ' : 'Category',
    subcategory: isJapanese ? 'サブカテゴリ' : 'Subcategory',
    manufacturer: isJapanese ? 'メーカー' : 'Manufacturer',
    modelNumber: isJapanese ? 'モデル' : 'Model',
    hours: isJapanese ? '稼働時間' : 'Hours',
    weight: isJapanese ? '重量' : 'Weight',
    featured: isJapanese ? 'おすすめ' : 'Featured',
    availability: isJapanese ? '在庫状況' : 'Availability',
    specifications: isJapanese ? '仕様' : 'Specifications',
    engine: isJapanese ? 'エンジン' : 'Engine',
    power: isJapanese ? '出力' : 'Power',
    operatingWeight: isJapanese ? '運転重量' : 'Operating Weight',
    filters: {
      title: isJapanese ? 'フィルター' : 'Filters',
      search: isJapanese ? '検索' : 'Search',
      searchPlaceholder: isJapanese ? '機械名、メーカー、モデルで検索...' : 'Search by name, manufacturer, model...',
      category: isJapanese ? 'カテゴリ' : 'Category',
      manufacturer: isJapanese ? 'メーカー' : 'Manufacturer',
      condition: isJapanese ? '状態' : 'Condition',
      location: isJapanese ? '所在地' : 'Location',
      priceRange: isJapanese ? '価格範囲' : 'Price Range',
      yearRange: isJapanese ? '年式範囲' : 'Year Range',
      hoursRange: isJapanese ? '稼働時間範囲' : 'Hours Range',
      featuredOnly: isJapanese ? 'おすすめのみ表示' : 'Featured Only',
      apply: isJapanese ? '適用' : 'Apply',
      reset: isJapanese ? 'リセット' : 'Reset',
      all: isJapanese ? 'すべて' : 'All',
      noResults: isJapanese ? '条件に一致する機械が見つかりませんでした。' : 'No machinery found matching your criteria.',
      showing: isJapanese ? '表示中' : 'Showing',
      of: isJapanese ? '/' : 'of',
      results: isJapanese ? '件の結果' : 'results',
      clearFilters: isJapanese ? 'フィルターをクリア' : 'Clear Filters',
      mobileFilterButton: isJapanese ? 'フィルター' : 'Filters',
    },
    sort: {
      title: isJapanese ? '並び替え' : 'Sort By',
      featured: isJapanese ? 'おすすめ順' : 'Featured',
      newest: isJapanese ? '新しい順' : 'Newest First',
      oldest: isJapanese ? '古い順' : 'Oldest First',
      priceLow: isJapanese ? '価格: 安い順' : 'Price: Low to High',
      priceHigh: isJapanese ? '価格: 高い順' : 'Price: High to Low',
      hoursLow: isJapanese ? '稼働時間: 少ない順' : 'Hours: Low to High',
    },
    pagination: {
      previous: isJapanese ? '前へ' : 'Previous',
      next: isJapanese ? '次へ' : 'Next',
      page: isJapanese ? 'ページ' : 'Page',
    },
    view: {
      grid: isJapanese ? 'グリッド表示' : 'Grid View',
      list: isJapanese ? 'リスト表示' : 'List View',
    },
    contact: {
      title: isJapanese ? 'お問い合わせ' : 'Contact Us',
      description: isJapanese ? 'お探しの機械が見つからない場合は、お気軽にお問い合わせください。' : 'Can\'t find what you\'re looking for? Contact us and we\'ll help you find it.',
      button: isJapanese ? 'お問い合わせ' : 'Contact Us',
    }
  }

  // Calculate active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedManufacturer !== 'all') count++;
    if (selectedCondition !== 'all') count++;
    if (selectedLocation !== 'all') count++;
    if (priceRange[0] !== priceLimits[0] || priceRange[1] !== priceLimits[1]) count++;
    if (yearRange[0] !== yearLimits[0] || yearRange[1] !== yearLimits[1]) count++;
    if (hoursRange[0] !== hoursLimits[0] || hoursRange[1] !== hoursLimits[1]) count++;
    if (showFeaturedOnly) count++;
    if (searchQuery) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Format categories, manufacturers, etc. for the filter bar
  const formattedCategories = categories.map(category => ({
    id: category,
    name: category === 'all' ? content.filters.all : category
  }));

  const formattedManufacturers = manufacturers.map(manufacturer => ({
    id: manufacturer,
    name: manufacturer === 'all' ? content.filters.all : manufacturer
  }));

  const formattedLocations = locations.map(location => ({
    id: location,
    name: location === 'all' ? content.filters.all : location
  }));

  const formattedConditions = conditions.map(condition => ({
    id: condition,
    name: condition === 'all' ? content.filters.all : condition
  }));

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedManufacturer('all');
    setSelectedCondition('all');
    setSelectedLocation('all');
    setPriceRange(priceLimits);
    setYearRange(yearLimits);
    setHoursRange(hoursLimits);
    setShowFeaturedOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="bg-slate-50 py-8 md:py-12 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{content.title}</h1>
          <p className="text-muted-foreground">{content.subtitle}</p>
        </motion.div>
        
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Horizontal Filter Bar */}
          <HorizontalFilterBar
            lang={params.lang}
            categories={formattedCategories}
            manufacturers={formattedManufacturers}
            locations={formattedLocations}
            conditions={formattedConditions}
            yearLimits={yearLimits}
            priceLimits={priceLimits}
            selectedCategory={selectedCategory}
            selectedManufacturer={selectedManufacturer}
            selectedLocation={selectedLocation}
            selectedCondition={selectedCondition}
            yearRange={yearRange}
            priceRange={priceRange}
            showFeaturedOnly={showFeaturedOnly}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onManufacturerChange={setSelectedManufacturer}
            onLocationChange={setSelectedLocation}
            onConditionChange={setSelectedCondition}
            onYearRangeChange={setYearRange}
            onPriceRangeChange={setPriceRange}
            onFeaturedOnlyChange={setShowFeaturedOnly}
            onResetFilters={handleResetFilters}
            categoriesLoading={false}
            activeFiltersCount={activeFiltersCount}
          />
          
          {/* Sort and View Controls */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            {/* Results Count */}
            <div className="text-sm text-slate-600">
              {content.filters.showing} <span className="font-semibold">{paginatedMachinery.length}</span> {content.filters.of} <span className="font-semibold">{filteredMachinery.length}</span> {content.filters.results}
            </div>
            
            <div className="flex gap-3 items-center">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="featured">{content.sort.featured}</option>
                <option value="newest">{content.sort.newest}</option>
                <option value="oldest">{content.sort.oldest}</option>
                <option value="price-low">{content.sort.priceLow}</option>
                <option value="price-high">{content.sort.priceHigh}</option>
                <option value="hours-low">{content.sort.hoursLow}</option>
              </select>
              
              {/* View Mode Toggle */}
              <div className="flex rounded-md overflow-hidden border border-slate-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-3 rounded-none ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-slate-600'}`}
                  onClick={() => setViewMode('grid')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                    <span className="hidden sm:inline">{content.view.grid}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-3 rounded-none ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-slate-600'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                    <span className="hidden sm:inline">{content.view.list}</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg font-medium text-slate-600">{isJapanese ? 'データを読み込んでいます...' : 'Loading machinery data...'}</p>
              </div>
            )}
            
            {/* Error State */}
            {!loading && error && (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-5xl mb-4 text-red-500">⚠️</div>
                <h3 className="text-xl font-semibold mb-2">{isJapanese ? 'エラーが発生しました' : 'Error Loading Data'}</h3>
                <p className="text-slate-500 mb-6">{error}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="destructive"
                >
                  {isJapanese ? '再試行' : 'Try Again'}
                </Button>
              </div>
            )}
            
            {/* No Results Message */}
            {!loading && !error && paginatedMachinery.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-5xl mb-4 text-slate-300">😕</div>
                <h3 className="text-xl font-semibold mb-2">{content.filters.noResults}</h3>
                <p className="text-slate-500 mb-6">{content.contact.description}</p>
                <Button asChild>
                  <Link href={`/${params.lang}/contact`}>
                    {content.contact.button}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
            
            {/* Grid View */}
            {!loading && !error && viewMode === 'grid' && paginatedMachinery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {paginatedMachinery.map((machine) => (
                  <CompactMachineryCard
                    key={machine.id}
                    machine={machine}
                    lang={params.lang}
                    viewDetailsText={content.viewDetails}
                    quickViewText={content.quickView}
                    hoursText={content.hours}
                    featuredText={content.featured}
                  />
                ))}
              </div>
            )}
            
            {/* List View */}
            {!loading && !error && viewMode === 'list' && paginatedMachinery.length > 0 && (
              <div className="space-y-4">
                {paginatedMachinery.map((machine) => (
                  <Card key={machine.id} className="overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-64 aspect-[4/3] md:aspect-auto overflow-hidden bg-slate-100">
                        <Image
                          src={machine.images[0]}
                          alt={machine.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 256px"
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          priority={false}
                        />
                        {machine.featured && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-parrot-red text-white">
                              <Star className="h-3 w-3 mr-1 fill-white" />
                              {content.featured}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow p-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {machine.category}
                          </Badge>
                          <Badge variant="outline" className="bg-slate-800/70 text-white border-slate-700/50">
                            {machine.year}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">{machine.name}</h3>
                          <div className="font-bold text-lg text-parrot-red ml-4 flex-shrink-0">
                            {isJapanese ? machine.priceJPY : machine.priceFormatted}
                          </div>
                        </div>
                        
                        <p className="text-slate-500 text-sm mb-3 line-clamp-2">{machine.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">{machine.year}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">{machine.hours.toLocaleString()} {content.hours}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">{machine.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">{machine.condition}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                          <div className="text-slate-600 text-sm">{machine.manufacturer} | {machine.modelNumber}</div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="hover:bg-transparent hover:text-primary" asChild>
                              <Link href={`/${params.lang}/machinery/${machine.categorySlug || 'machinery'}/${machine.slug || machine.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                {content.quickView}
                              </Link>
                            </Button>
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white" asChild>
                              <Link href={`/${params.lang}/machinery/${machine.categorySlug || 'machinery'}/${machine.slug || machine.id}`}>
                                {content.viewDetails}
                                <ArrowRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {content.pagination.previous}
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-primary text-white" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    {content.pagination.next}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
      </div>
    </div>
  );
}