"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Import the machinery types from the machinery page
interface BaseMachinery {
  id: string;
  slug: string;
  categorySlug: string;
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

type MachineryItem = BaseMachinery;

interface SimilarListingsProps {
  currentMachinery: {
    id: string;
    slug: string;
    categorySlug: string;
    category: string;
    manufacturer: string;
    modelNumber: string;
    subcategory?: string; // Make subcategory optional in the interface
    tags?: string[];
  };
  allMachinery: MachineryItem[];
  lang: string;
  maxItems?: number;
}

export default function SimilarListings({ 
  currentMachinery, 
  allMachinery, 
  lang, 
  maxItems = 3 
}: SimilarListingsProps) {
  const isJapanese = lang === 'ja';

  // Translations
  const translations = {
    title: isJapanese ? '類似の機械' : 'Similar Machinery',
    subtitle: isJapanese 
      ? 'これらの類似した機械もご覧ください' 
      : 'You may also be interested in these similar machines',
    viewDetails: isJapanese ? '詳細を見る' : 'View Details',
    noSimilarItems: isJapanese 
      ? '類似の機械は見つかりませんでした' 
      : 'No similar machinery found',
    year: isJapanese ? '年式' : 'Year',
    hours: isJapanese ? '稼働時間' : 'Hours',
    location: isJapanese ? '所在地' : 'Location',
  };

  // Calculate similarity score for each machinery item
  const getSimilarityScore = (machinery: MachineryItem): number => {
    let score = 0;
    
    // Same manufacturer is a strong signal
    if (machinery.manufacturer === currentMachinery.manufacturer) {
      score += 5;
    }
    
    // Same category is also important
    if (machinery.category === currentMachinery.category) {
      score += 4;
    }
    
    // Same subcategory if both have it
    if (currentMachinery.subcategory && 
        machinery.subcategory === currentMachinery.subcategory) {
      score += 3;
    }
    
    // Similar model (contains part of the model number)
    if (machinery.modelNumber.includes(currentMachinery.modelNumber.split('-')[0]) || 
        currentMachinery.modelNumber.includes(machinery.modelNumber.split('-')[0])) {
      score += 2;
    }
    
    // Tag matching
    if (machinery.tags && currentMachinery.tags) {
      const commonTags = machinery.tags.filter(tag => 
        currentMachinery.tags?.includes(tag)
      );
      score += commonTags.length;
    }
    
    return score;
  };

  // Filter out the current machinery and get similar items
  const similarMachinery = allMachinery
    .filter(item => item.id !== currentMachinery.id)
    .map(item => ({
      ...item,
      similarityScore: getSimilarityScore(item)
    }))
    .filter(item => item.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, maxItems);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  if (similarMachinery.length === 0) {
    return null; // Don't show the section if no similar items
  }

  return (
    <div className="mt-16 pt-12 border-t border-slate-200">
      <h2 className="text-2xl font-bold mb-2">{translations.title}</h2>
      <p className="text-muted-foreground mb-8">{translations.subtitle}</p>
      
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {similarMachinery.map((machine) => (
          <motion.div key={machine.id} variants={itemVariants}>
            <Card className="overflow-hidden h-full flex flex-col bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                <Image
                  src={machine.images[0]}
                  alt={machine.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  priority={false}
                />
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs py-0">
                    {machine.category}
                  </Badge>
                </div>
                {machine.featured && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-parrot-red text-white text-xs py-0">
                      {isJapanese ? 'おすすめ' : 'Featured'}
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-3 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold line-clamp-1">{machine.name}</h3>
                  <Badge variant="outline" className="bg-slate-800/70 text-white border-slate-700/50 text-xs py-0 ml-1 flex-shrink-0">
                    {machine.year}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-x-2 text-xs mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{translations.hours}:</span>
                    <span className="font-medium">{machine.hours.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{translations.location}:</span>
                    <span className="font-medium truncate ml-1" title={machine.location}>{machine.location.split(',')[0]}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="font-bold text-parrot-red">
                    {isJapanese ? machine.priceJPY : machine.priceFormatted}
                  </div>
                  <Button size="sm" variant="ghost" className="p-0 h-auto hover:bg-transparent hover:text-primary" asChild>
                    <Link href={`/${lang}/machinery/${machine.categorySlug}/${machine.slug}`}>
                      {translations.viewDetails}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
