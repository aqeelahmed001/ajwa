"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Filter, 
  Search, 
  X, 
  ChevronRight,
  Calendar,
  MapPin,
  Tag,
  Truck,
  DollarSign
} from 'lucide-react';

interface CategoryFilterSidebarProps {
  lang: string;
  onFilterChange?: (filters: any) => void;
  className?: string;
}

export default function CategoryFilterSidebar({ 
  lang, 
  onFilterChange,
  className = ''
}: CategoryFilterSidebarProps) {
  const isJapanese = lang === 'ja';
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get current category from URL if any
  const currentCategory = searchParams.get('category') || 'all';
  
  // Categories with translations
  const categories = [
    { id: 'all', name: isJapanese ? 'すべて' : 'All Categories' },
    { id: 'excavator', name: isJapanese ? 'ショベル' : 'Excavators' },
    { id: 'loader', name: isJapanese ? 'ホイールローダー' : 'Wheel Loaders' },
    { id: 'bulldozer', name: isJapanese ? 'ブルドーザー' : 'Bulldozers' },
    { id: 'crane', name: isJapanese ? 'クレーン' : 'Cranes' },
    { id: 'forklift', name: isJapanese ? 'フォークリフト' : 'Forklifts' },
    { id: 'truck', name: isJapanese ? 'トラック' : 'Trucks' },
    { id: 'other', name: isJapanese ? 'その他' : 'Other' },
  ];
  
  // Manufacturers with translations
  const manufacturers = [
    { id: 'all', name: isJapanese ? 'すべて' : 'All Manufacturers' },
    { id: 'komatsu', name: 'Komatsu' },
    { id: 'hitachi', name: 'Hitachi' },
    { id: 'caterpillar', name: 'Caterpillar' },
    { id: 'toyota', name: 'Toyota' },
    { id: 'kobelco', name: 'Kobelco' },
    { id: 'tadano', name: 'Tadano' },
  ];
  
  // Locations with translations
  const locations = [
    { id: 'all', name: isJapanese ? 'すべて' : 'All Locations' },
    { id: 'tokyo', name: isJapanese ? '東京' : 'Tokyo' },
    { id: 'osaka', name: isJapanese ? '大阪' : 'Osaka' },
    { id: 'yokohama', name: isJapanese ? '横浜' : 'Yokohama' },
    { id: 'nagoya', name: isJapanese ? '名古屋' : 'Nagoya' },
    { id: 'fukuoka', name: isJapanese ? '福岡' : 'Fukuoka' },
  ];
  
  // Filter text content
  const content = {
    title: isJapanese ? 'フィルター' : 'Filters',
    reset: isJapanese ? 'リセット' : 'Reset',
    search: isJapanese ? '検索' : 'Search',
    searchPlaceholder: isJapanese ? '機械を検索...' : 'Search machinery...',
    category: isJapanese ? 'カテゴリー' : 'Category',
    manufacturer: isJapanese ? 'メーカー' : 'Manufacturer',
    location: isJapanese ? '所在地' : 'Location',
    yearRange: isJapanese ? '年式' : 'Year Range',
    priceRange: isJapanese ? '価格帯' : 'Price Range',
    featuredOnly: isJapanese ? 'おすすめのみ' : 'Featured Only',
    apply: isJapanese ? '適用' : 'Apply Filters',
  };
  
  // State for filter values
  const [selectedCategory, setSelectedCategory] = React.useState(currentCategory);
  const [selectedManufacturer, setSelectedManufacturer] = React.useState('all');
  const [selectedLocation, setSelectedLocation] = React.useState('all');
  const [yearRange, setYearRange] = React.useState<[number, number]>([2010, 2023]);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 15000000]);
  const [showFeaturedOnly, setShowFeaturedOnly] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Apply filters
  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        category: selectedCategory,
        manufacturer: selectedManufacturer,
        location: selectedLocation,
        yearRange,
        priceRange,
        featuredOnly: showFeaturedOnly,
        searchQuery
      });
    }
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedManufacturer('all');
    setSelectedLocation('all');
    setYearRange([2010, 2023]);
    setPriceRange([0, 15000000]);
    setShowFeaturedOnly(false);
    setSearchQuery('');
    
    if (onFilterChange) {
      onFilterChange({
        category: 'all',
        manufacturer: 'all',
        location: 'all',
        yearRange: [2010, 2023],
        priceRange: [0, 15000000],
        featuredOnly: false,
        searchQuery: ''
      });
    }
  };
  
  // Format price for display
  const formatPrice = (price: number) => {
    return isJapanese
      ? `¥${(price / 10000).toLocaleString()}万`
      : `¥${price.toLocaleString()}`;
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {content.title}
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleResetFilters}
          className="text-xs text-muted-foreground hover:text-primary"
        >
          {content.reset}
        </Button>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <Label htmlFor="search" className="text-sm font-medium mb-2 block">
          {content.search}
        </Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder={content.searchPlaceholder}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {/* Category Filter */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {content.category}
        </Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <Button
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className={`text-xs w-full justify-start ${selectedCategory === category.id ? 'bg-primary text-white' : 'bg-transparent'}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
                {selectedCategory === category.id && <ChevronRight className="ml-auto h-4 w-4" />}
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {/* Manufacturer Filter */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground" />
          {content.manufacturer}
        </Label>
        <div className="space-y-2">
          {manufacturers.map((manufacturer) => (
            <div key={manufacturer.id} className="flex items-center gap-2">
              <Checkbox 
                id={`manufacturer-${manufacturer.id}`} 
                checked={selectedManufacturer === manufacturer.id}
                onCheckedChange={() => setSelectedManufacturer(manufacturer.id)}
              />
              <Label 
                htmlFor={`manufacturer-${manufacturer.id}`}
                className="text-sm cursor-pointer"
              >
                {manufacturer.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {/* Location Filter */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {content.location}
        </Label>
        <div className="space-y-2">
          {locations.map((location) => (
            <div key={location.id} className="flex items-center gap-2">
              <Checkbox 
                id={`location-${location.id}`} 
                checked={selectedLocation === location.id}
                onCheckedChange={() => setSelectedLocation(location.id)}
              />
              <Label 
                htmlFor={`location-${location.id}`}
                className="text-sm cursor-pointer"
              >
                {location.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {/* Year Range */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {content.yearRange}: {yearRange[0]} - {yearRange[1]}
        </Label>
        <Slider
          min={2000}
          max={2023}
          step={1}
          value={yearRange}
          onValueChange={(value) => setYearRange(value as [number, number])}
          className="mt-2"
        />
      </div>
      
      <Separator className="my-4" />
      
      {/* Price Range */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          {content.priceRange}: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
        </Label>
        <Slider
          min={0}
          max={15000000}
          step={500000}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="mt-2"
        />
      </div>
      
      <Separator className="my-4" />
      
      {/* Featured Only */}
      <div className="flex items-center justify-between mb-6">
        <Label htmlFor="featured-only" className="text-sm font-medium cursor-pointer">
          {content.featuredOnly}
        </Label>
        <Switch
          id="featured-only"
          checked={showFeaturedOnly}
          onCheckedChange={setShowFeaturedOnly}
        />
      </div>
      
      {/* Apply Filters Button */}
      <Button 
        className="w-full bg-primary hover:bg-primary/90"
        onClick={handleApplyFilters}
      >
        {content.apply}
      </Button>
    </div>
  );
}
