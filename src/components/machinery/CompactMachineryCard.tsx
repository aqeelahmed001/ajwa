"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Calendar, Clock, MapPin, Tag, Eye, ArrowRight } from 'lucide-react';

interface MachineryItem {
  id: string;
  slug?: string;
  categorySlug?: string;
  name: string;
  category: string;
  subcategory: string;
  manufacturer: string;
  modelNumber: string;
  year: number;
  hours: number;
  price: number;
  priceFormatted: string;
  priceJPY: string;
  images: string[];
  location: string;
  condition: string;
  weight: string;
  featured: boolean;
  availability: string;
  description: string;
  specifications: Record<string, string>;
  tags?: string[];
}

interface CompactMachineryCardProps {
  machine: MachineryItem;
  lang: string;
  viewDetailsText: string;
  quickViewText: string;
  hoursText: string;
  featuredText: string;
}

export default function CompactMachineryCard({
  machine,
  lang,
  viewDetailsText,
  quickViewText,
  hoursText,
  featuredText
}: CompactMachineryCardProps) {
  const isJapanese = lang === 'ja';
  
  return (
    <Card className="overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={machine.images[0] || '/images/placeholder.jpg'}
          alt={machine.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover hover:scale-105 transition-transform duration-300"
          priority={false}
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
            {machine.category}
          </Badge>
        </div>
        {machine.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-red-500 text-white text-xs">
              <Star className="h-3 w-3 mr-1 fill-white" />
              {featuredText}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-3 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-semibold line-clamp-1 pr-2">{machine.name}</h3>
          <Badge variant="outline" className="bg-slate-800/70 text-white border-slate-700/50 flex-shrink-0 text-xs">
            {machine.year}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2 text-xs">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-400" />
            <span className="text-slate-600">{machine.hours.toLocaleString()} {hoursText}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            <span className="text-slate-600 truncate" title={machine.location}>{machine.location.split(',')[0]}</span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <Tag className="h-3 w-3 text-slate-400" />
            <span className="text-slate-600 truncate">{machine.manufacturer} | {machine.modelNumber}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-2 border-t border-slate-100 flex justify-between items-center">
          <div className="font-bold text-sm text-red-600">
            {isJapanese ? machine.priceJPY : machine.priceFormatted}
          </div>
          <Link 
            href={`/${lang}/machinery/${machine.categorySlug || 'machinery'}/${machine.slug || machine.id}`}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            {viewDetailsText}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
