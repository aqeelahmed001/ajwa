"use client";

import React, { useState } from 'react';
import { 
  Filter, 
  Search, 
  X, 
  ChevronDown,
  Tag,
  Truck,
  MapPin,
  Calendar,
  DollarSign,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from '@/components/ui/separator';

interface HorizontalFilterBarProps {
  lang: string;
  categories: Array<{ id: string; name: string }>;
  manufacturers: Array<{ id: string; name: string }>;
  locations: Array<{ id: string; name: string }>;
  conditions: Array<{ id: string; name: string }>;
  yearLimits: [number, number];
  priceLimits: [number, number];
  selectedCategory: string;
  selectedManufacturer: string;
  selectedLocation: string;
  selectedCondition: string;
  yearRange: [number, number];
  priceRange: [number, number];
  showFeaturedOnly: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onManufacturerChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onConditionChange: (value: string) => void;
  onYearRangeChange: (value: [number, number]) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onFeaturedOnlyChange: (value: boolean) => void;
  onResetFilters: () => void;
  categoriesLoading?: boolean;
  activeFiltersCount: number;
}

export default function HorizontalFilterBar({
  lang,
  categories,
  manufacturers,
  locations,
  conditions,
  yearLimits,
  priceLimits,
  selectedCategory,
  selectedManufacturer,
  selectedLocation,
  selectedCondition,
  yearRange,
  priceRange,
  showFeaturedOnly,
  searchQuery,
  onSearchChange,
  onCategoryChange,
  onManufacturerChange,
  onLocationChange,
  onConditionChange,
  onYearRangeChange,
  onPriceRangeChange,
  onFeaturedOnlyChange,
  onResetFilters,
  categoriesLoading = false,
  activeFiltersCount = 0
}: HorizontalFilterBarProps) {
  const isJapanese = lang === 'ja';
  
  // Format price for display
  const formatPrice = (price: number) => {
    return isJapanese
      ? `¥${(price / 10000).toLocaleString()}万`
      : `¥${price.toLocaleString()}`;
  };
  
  const content = {
    title: isJapanese ? 'フィルター' : 'Filters',
    reset: isJapanese ? 'リセット' : 'Reset',
    search: isJapanese ? '検索' : 'Search',
    searchPlaceholder: isJapanese ? '機械を検索...' : 'Search machinery...',
    category: isJapanese ? 'カテゴリー' : 'Category',
    manufacturer: isJapanese ? 'メーカー' : 'Manufacturer',
    location: isJapanese ? '所在地' : 'Location',
    condition: isJapanese ? '状態' : 'Condition',
    yearRange: isJapanese ? '年式' : 'Year',
    priceRange: isJapanese ? '価格帯' : 'Price',
    featuredOnly: isJapanese ? 'おすすめのみ' : 'Featured Only',
    apply: isJapanese ? '適用' : 'Apply',
    close: isJapanese ? '閉じる' : 'Close',
    all: isJapanese ? 'すべて' : 'All',
    mobileFilters: isJapanese ? 'フィルター' : 'Filters',
    activeFilters: isJapanese ? 'アクティブフィルター' : 'Active Filters',
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 mb-6">
      {/* Desktop Filters */}
      <div className="hidden md:flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative min-w-[240px] flex-grow max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={content.searchPlaceholder}
            className="pl-9 h-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-2.5 top-2.5 h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center"
              onClick={() => onSearchChange('')}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        
        {/* Category Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
              {content.category}
              {selectedCategory !== 'all' && (
                <Badge className="ml-2 bg-primary text-white text-xs">1</Badge>
              )}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-3">
            <div className="space-y-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start text-left ${selectedCategory === category.id ? 'bg-primary text-white' : ''}`}
                  onClick={() => onCategoryChange(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Manufacturer Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
              {content.manufacturer}
              {selectedManufacturer !== 'all' && (
                <Badge className="ml-2 bg-primary text-white text-xs">1</Badge>
              )}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-3">
            <div className="space-y-1">
              {manufacturers.map((manufacturer) => (
                <Button
                  key={manufacturer.id}
                  variant={selectedManufacturer === manufacturer.id ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start text-left ${selectedManufacturer === manufacturer.id ? 'bg-primary text-white' : ''}`}
                  onClick={() => onManufacturerChange(manufacturer.id)}
                >
                  {manufacturer.name}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Location Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              {content.location}
              {selectedLocation !== 'all' && (
                <Badge className="ml-2 bg-primary text-white text-xs">1</Badge>
              )}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-3">
            <div className="space-y-1">
              {locations.map((location) => (
                <Button
                  key={location.id}
                  variant={selectedLocation === location.id ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start text-left ${selectedLocation === location.id ? 'bg-primary text-white' : ''}`}
                  onClick={() => onLocationChange(location.id)}
                >
                  {location.name}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Condition Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
              {content.condition}
              {selectedCondition !== 'all' && (
                <Badge className="ml-2 bg-primary text-white text-xs">1</Badge>
              )}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-3">
            <div className="space-y-1">
              {conditions.map((condition) => (
                <Button
                  key={condition.id}
                  variant={selectedCondition === condition.id ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start text-left ${selectedCondition === condition.id ? 'bg-primary text-white' : ''}`}
                  onClick={() => onConditionChange(condition.id)}
                >
                  {condition.name}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Year Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              {content.yearRange}: {yearRange[0]}-{yearRange[1]}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-4">
            <Label className="text-sm font-medium mb-3">
              {content.yearRange}: {yearRange[0]} - {yearRange[1]}
            </Label>
            <Slider
              min={yearLimits[0]}
              max={yearLimits[1]}
              step={1}
              value={yearRange}
              onValueChange={(value) => onYearRangeChange(value as [number, number])}
              className="mt-6"
            />
          </PopoverContent>
        </Popover>
        
        {/* Price Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              {content.priceRange}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-4">
            <Label className="text-sm font-medium mb-3">
              {content.priceRange}: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </Label>
            <Slider
              min={priceLimits[0]}
              max={priceLimits[1]}
              step={Math.max(1, Math.round((priceLimits[1] - priceLimits[0]) / 20))}
              value={priceRange}
              onValueChange={(value) => onPriceRangeChange(value as [number, number])}
              className="mt-6"
            />
          </PopoverContent>
        </Popover>
        
        {/* Featured Only Toggle */}
        <div className="flex items-center gap-2 ml-auto">
          <Label htmlFor="featured-only-desktop" className="text-sm cursor-pointer">
            {content.featuredOnly}
          </Label>
          <Switch
            id="featured-only-desktop"
            checked={showFeaturedOnly}
            onCheckedChange={onFeaturedOnlyChange}
          />
        </div>
        
        {/* Reset Button */}
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onResetFilters}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            <X className="h-4 w-4 mr-1" />
            {content.reset}
          </Button>
        )}
      </div>
      
      {/* Mobile Filters */}
      <div className="flex md:hidden items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                {content.mobileFilters}
                {activeFiltersCount > 0 && (
                  <Badge className="ml-1 bg-primary text-white text-xs">{activeFiltersCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {content.title}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onResetFilters}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    {content.reset}
                  </Button>
                </SheetTitle>
              </SheetHeader>
              
              <div className="py-4">
                {/* Mobile Search */}
                <div className="mb-6">
                  <Label htmlFor="mobile-search" className="text-sm font-medium mb-2 block">
                    {content.search}
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mobile-search"
                      placeholder={content.searchPlaceholder}
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                {/* Mobile Category Filter */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">
                    {content.category}
                  </Label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        className={`text-xs w-full justify-start ${selectedCategory === category.id ? 'bg-primary text-white' : 'bg-transparent'}`}
                        onClick={() => onCategoryChange(category.id)}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                {/* Mobile Manufacturer Filter */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">
                    {content.manufacturer}
                  </Label>
                  <div className="space-y-2">
                    {manufacturers.map((manufacturer) => (
                      <Button
                        key={manufacturer.id}
                        variant={selectedManufacturer === manufacturer.id ? "default" : "outline"}
                        size="sm"
                        className={`text-xs w-full justify-start ${selectedManufacturer === manufacturer.id ? 'bg-primary text-white' : 'bg-transparent'}`}
                        onClick={() => onManufacturerChange(manufacturer.id)}
                      >
                        {manufacturer.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                {/* Mobile Location Filter */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">
                    {content.location}
                  </Label>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <Button
                        key={location.id}
                        variant={selectedLocation === location.id ? "default" : "outline"}
                        size="sm"
                        className={`text-xs w-full justify-start ${selectedLocation === location.id ? 'bg-primary text-white' : 'bg-transparent'}`}
                        onClick={() => onLocationChange(location.id)}
                      >
                        {location.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                {/* Mobile Condition Filter */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">
                    {content.condition}
                  </Label>
                  <div className="space-y-2">
                    {conditions.map((condition) => (
                      <Button
                        key={condition.id}
                        variant={selectedCondition === condition.id ? "default" : "outline"}
                        size="sm"
                        className={`text-xs w-full justify-start ${selectedCondition === condition.id ? 'bg-primary text-white' : 'bg-transparent'}`}
                        onClick={() => onConditionChange(condition.id)}
                      >
                        {condition.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                {/* Mobile Year Range */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">
                    {content.yearRange}: {yearRange[0]} - {yearRange[1]}
                  </Label>
                  <Slider
                    min={yearLimits[0]}
                    max={yearLimits[1]}
                    step={1}
                    value={yearRange}
                    onValueChange={(value) => onYearRangeChange(value as [number, number])}
                    className="mt-2"
                  />
                </div>
                
                <Separator className="my-4" />
                
                {/* Mobile Price Range */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">
                    {content.priceRange}: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </Label>
                  <Slider
                    min={priceLimits[0]}
                    max={priceLimits[1]}
                    step={Math.max(1, Math.round((priceLimits[1] - priceLimits[0]) / 20))}
                    value={priceRange}
                    onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                    className="mt-2"
                  />
                </div>
                
                <Separator className="my-4" />
                
                {/* Mobile Featured Only */}
                <div className="flex items-center justify-between mb-6">
                  <Label htmlFor="mobile-featured-only" className="text-sm font-medium cursor-pointer">
                    {content.featuredOnly}
                  </Label>
                  <Switch
                    id="mobile-featured-only"
                    checked={showFeaturedOnly}
                    onCheckedChange={onFeaturedOnlyChange}
                  />
                </div>
              </div>
              
              <SheetFooter>
                <SheetClose asChild>
                  <Button className="w-full">{content.close}</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          
          {/* Active Filters Count */}
          {activeFiltersCount > 0 && (
            <div className="text-sm text-muted-foreground">
              {activeFiltersCount} {content.activeFilters}
            </div>
          )}
        </div>
        
        {/* Mobile Search */}
        <div className="relative flex-grow ml-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={content.searchPlaceholder}
            className="pl-9 h-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-2.5 top-2.5 h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center"
              onClick={() => onSearchChange('')}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
