"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Settings, Loader2 } from 'lucide-react'
import { fetchPublicCategories } from '@/services/categoryService'

interface CategoryShowcaseSectionProps {
  lang: string;
}

export default function CategoryShowcaseSection({ lang }: CategoryShowcaseSectionProps) {
  const isJapanese = lang === 'ja'
  
  // State for categories from API
  const [categories, setCategories] = useState<Array<{
    id: string;
    name: string;
    image?: string;
    count: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch categories from API
  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await fetchPublicCategories();
        
        // Transform categories for display
        const transformedCategories = fetchedCategories
          .filter(cat => cat.isActive) // Only show active categories
          .slice(0, 6) // Limit to 6 categories for showcase
          .map(category => ({
            id: category.id,
            name: category.name,
            image: category.image || `/images/categories/default.jpg`,
            count: 0 // We'll update this with actual counts in a future enhancement
          }));
        
        setCategories(transformedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        
        // Fallback to sample categories if API fails
        setCategories([
          {
            id: '1',
            name: isJapanese ? 'CNC工作機械' : 'CNC Machine Tools',
            image: '/images/categories/cnc.jpg',
            count: 24
          },
          {
            id: '2',
            name: isJapanese ? '旋盤' : 'Lathes',
            image: '/images/categories/lathe.jpg',
            count: 18
          },
          {
            id: '3',
            name: isJapanese ? 'フライス盤' : 'Milling Machines',
            image: '/images/categories/mill.jpg',
            count: 15
          },
          {
            id: '4',
            name: isJapanese ? '研削盤' : 'Grinding Machines',
            image: '/images/categories/grinder.jpg',
            count: 12
          },
          {
            id: '5',
            name: isJapanese ? '板金機械' : 'Sheet Metal Machinery',
            image: '/images/categories/sheet.jpg',
            count: 9
          },
          {
            id: '6',
            name: isJapanese ? '測定機器' : 'Measuring Equipment',
            image: '/images/categories/measuring.jpg',
            count: 7
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    getCategories();
  }, [isJapanese]);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="relative">
      {/* Main background - using a more visible navy blue shade */}
      <div className="bg-[#1a2f5c] relative overflow-hidden">
        {/* No diagonal section at bottom */}
        
        <div className="container py-4 px-2 md:px-4">
          {/* Compact header with gear icon */}
          <div className="flex justify-between items-center mb-3">
            {/* Badge and title - compact */}
            <div className="flex items-center">
              <div className="bg-blue-500 px-1 py-0.5 mr-2">
                <span className="text-white text-xs font-medium">
                  {isJapanese ? 'YMS' : 'YMS'}
                </span>
              </div>
              
              <h2 className="text-lg font-bold text-white">
                {isJapanese ? '中古工作機械のご紹介' : 'Used Machine Tool Introduction'}
              </h2>
            </div>
            
            {/* Gear icon - small */}
            <div className="hidden md:block">
              <div className="relative w-6 h-6 animate-spin-slow">
                <Settings className="w-full h-full text-blue-400/30" strokeWidth={1} />
              </div>
            </div>
          </div>
          
          {/* Category tabs - compact */}
          <div className="flex mb-3 overflow-x-auto scrollbar-hide">
            <button className="px-2 py-1 bg-white text-[#1a2f5c] font-medium text-xs mr-1">
              {isJapanese ? '新着' : 'New Arrivals'}
            </button>
            <button className="px-2 py-1 text-white/90 hover:bg-white/10 transition-colors text-xs mr-1">
              {isJapanese ? 'CNC' : 'CNC'}
            </button>
            <button className="px-2 py-1 text-white/90 hover:bg-white/10 transition-colors text-xs mr-1">
              {isJapanese ? '旋盤' : 'Lathes'}
            </button>
            <button className="px-2 py-1 text-white/90 hover:bg-white/10 transition-colors text-xs mr-1">
              {isJapanese ? 'フライス' : 'Milling'}
            </button>
            <button className="px-2 py-1 text-white/90 hover:bg-white/10 transition-colors text-xs">
              {isJapanese ? 'その他' : 'Others'}
            </button>
          </div>
          
          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          )}
          
          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-8">
              <p className="text-white/70 text-sm">{error}</p>
            </div>
          )}
          
          {/* 6 cards in 2 rows of 3 */}
          {!loading && !error && (
            <motion.div 
              className="grid grid-cols-3 gap-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
            >
              {categories.map((category) => (
              <motion.div 
                key={category.id} 
                className="bg-[#2a4070] relative group"
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href={`/${lang}/categories/${category.id}`}>
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {/* Placeholder for category image */}
                    <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white/50 text-xs">{category.name}</span>
                    </div>
                    
                    {/* Count badge */}
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-1 py-0.5 text-xs">
                      {category.count}
                    </div>
                    
                    {/* Title overlay - with hover effect */}
                    <div className="absolute bottom-0 left-0 right-0 bg-[#1a2f5c]/90 p-2 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-medium text-white truncate pr-2">
                          {category.name}
                        </h3>
                        <span className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                          <ArrowRight className="h-3 w-3 text-blue-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
