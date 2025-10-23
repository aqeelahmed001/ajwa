"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CategoryShowcaseSectionProps {
  lang: string;
}

export default function CategoryShowcaseSection({ lang }: CategoryShowcaseSectionProps) {
  const isJapanese = lang === 'ja';
  
  // Category data with translations
  const categories = [
    {
      id: 'excavator',
      name: isJapanese ? 'ショベル' : 'Excavators',
      description: isJapanese 
        ? '様々な現場で活躍する高品質な油圧ショベル' 
        : 'High-quality hydraulic excavators for various job sites',
      image: '/images/mach1.jpg',
      count: 24,
    },
    {
      id: 'loader',
      name: isJapanese ? 'ホイールローダー' : 'Wheel Loaders',
      description: isJapanese 
        ? '効率的な材料の移動と積み込みのための頑丈な機械' 
        : 'Robust machines for efficient material moving and loading',
      image: '/images/mach2.jpg',
      count: 18,
    },
    {
      id: 'bulldozer',
      name: isJapanese ? 'ブルドーザー' : 'Bulldozers',
      description: isJapanese 
        ? '土木工事や整地作業に最適な強力な機械' 
        : 'Powerful machines ideal for earthmoving and grading',
      image: '/images/mach3.jpg',
      count: 12,
    },
    {
      id: 'crane',
      name: isJapanese ? 'クレーン' : 'Cranes',
      description: isJapanese 
        ? '重量物の吊り上げと移動のための多目的クレーン' 
        : 'Versatile cranes for lifting and moving heavy objects',
      image: '/images/mach1.jpg',
      count: 15,
    },
    {
      id: 'forklift',
      name: isJapanese ? 'フォークリフト' : 'Forklifts',
      description: isJapanese 
        ? '倉庫や工場での効率的な物流作業に' 
        : 'For efficient logistics operations in warehouses and factories',
      image: '/images/mach2.jpg',
      count: 20,
    },
    {
      id: 'truck',
      name: isJapanese ? 'トラック' : 'Trucks',
      description: isJapanese 
        ? '資材や機械の運搬に最適な各種トラック' 
        : 'Various trucks ideal for transporting materials and machinery',
      image: '/images/mach3.jpg',
      count: 16,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  // Content text
  const content = {
    title: isJapanese ? '機械カテゴリー' : 'Machinery Categories',
    subtitle: isJapanese 
      ? '様々な用途に合わせた機械を取り揃えております。カテゴリーから探す。' 
      : 'Browse our extensive range of machinery by category.',
    viewAll: isJapanese ? 'すべて表示' : 'View All',
    viewCategory: isJapanese ? 'カテゴリーを見る' : 'View Category',
    items: isJapanese ? '件' : 'items',
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.title}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">{content.subtitle}</p>
        </div>

        {/* Categories grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((category) => (
            <motion.div 
              key={category.id}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              variants={itemVariants}
            >
              {/* Category image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Category info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-sm py-1 px-2 rounded-full">
                      {category.count} {content.items}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">{category.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-white text-white hover:bg-white hover:text-black transition-colors"
                    asChild
                  >
                    <Link href={`/${lang}/machinery?category=${category.id}`}>
                      {content.viewCategory}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* View all button */}
        <div className="mt-10 text-center">
          <Button 
            variant="default" 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            asChild
          >
            <Link href={`/${lang}/machinery`}>
              {content.viewAll}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
