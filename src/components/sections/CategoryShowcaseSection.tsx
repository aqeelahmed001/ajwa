"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Settings, Loader2 } from 'lucide-react'
import { fetchPublicCategories } from '@/services/categoryService'
import CloudinaryImage from '@/components/ui/CloudinaryImage'

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
    slug: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Fetch categories from API
  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await fetchPublicCategories();
        
        // Log the fetched categories
        console.log('Fetched categories:', fetchedCategories);
        
        // Fetch machinery counts for each category
        const machineryCountsResponse = await fetch('/api/content/machinery/counts');
        let categoryCounts: Record<string, number> = {};
        
        if (machineryCountsResponse.ok) {
          const countsData = await machineryCountsResponse.json();
          categoryCounts = countsData.counts || {};
          console.log('Category counts:', categoryCounts);
        } else {
          console.warn('Failed to fetch machinery counts');
        }
        
        // Transform categories for display
        const transformedCategories = fetchedCategories
          .filter(cat => cat.isActive) // Only show active categories
          .slice(0, 6) // Limit to 6 categories for showcase
          .map(category => {
            console.log(`Category ${category.name} image:`, category.image);
            // Generate slug if not available
            const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-');
            
            // Try to find count by different keys
            let count = 0;
            
            // First try by ID
            if (categoryCounts[category.id]) {
              count = categoryCounts[category.id];
              console.log(`Found count by ID for ${category.name}: ${count}`);
            }
            // Then try by slug
            else if (categoryCounts[slug]) {
              count = categoryCounts[slug];
              console.log(`Found count by slug for ${category.name}: ${count}`);
            }
            // Then try by name
            else if (categoryCounts[category.name]) {
              count = categoryCounts[category.name];
              console.log(`Found count by name for ${category.name}: ${count}`);
            }
            // Use 0 if no match found
            else {
              console.log(`No count found for ${category.name}, using 0`);
            }
            
            return {
              id: category.id,
              name: category.name,
              slug: slug,
              image: category.image || `/images/categories/default.jpg`,
              count: count
            };
          });
        
        console.log('Transformed categories:', transformedCategories);
        setCategories(transformedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        // No fallback categories, just set an empty array
        setCategories([]);
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

  // Only render the section if we have categories to show
  if (categories.length === 0 && !loading) {
    return null; // Don't render anything if there are no categories and not loading
  }
  
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
            <Link 
              href={`/${lang}/machinery`}
              className={`px-2 py-1 ${selectedCategory === 'all' ? 'bg-white text-[#1a2f5c]' : 'text-white/90 hover:bg-white/10'} font-medium text-xs mr-1`}
              onClick={() => setSelectedCategory('all')}
            >
              {isJapanese ? '新着' : 'New Arrivals'}
            </Link>
            <Link 
              href={`/${lang}/machinery?category=CNC Machine Tools`}
              className={`px-2 py-1 ${selectedCategory === 'cnc' ? 'bg-white text-[#1a2f5c]' : 'text-white/90 hover:bg-white/10'} transition-colors text-xs mr-1`}
              onClick={() => setSelectedCategory('cnc')}
            >
              {isJapanese ? 'CNC' : 'CNC'}
            </Link>
            <Link 
              href={`/${lang}/machinery?category=Lathes`}
              className={`px-2 py-1 ${selectedCategory === 'lathe' ? 'bg-white text-[#1a2f5c]' : 'text-white/90 hover:bg-white/10'} transition-colors text-xs mr-1`}
              onClick={() => setSelectedCategory('lathe')}
            >
              {isJapanese ? '旋盤' : 'Lathes'}
            </Link>
            <Link 
              href={`/${lang}/machinery?category=Milling Machines`}
              className={`px-2 py-1 ${selectedCategory === 'milling' ? 'bg-white text-[#1a2f5c]' : 'text-white/90 hover:bg-white/10'} transition-colors text-xs mr-1`}
              onClick={() => setSelectedCategory('milling')}
            >
              {isJapanese ? 'フライス' : 'Milling'}
            </Link>
            <Link 
              href={`/${lang}/machinery?category=Grinding Machines`}
              className={`px-2 py-1 ${selectedCategory === 'other' ? 'bg-white text-[#1a2f5c]' : 'text-white/90 hover:bg-white/10'} transition-colors text-xs`}
              onClick={() => setSelectedCategory('other')}
            >
              {isJapanese ? 'その他' : 'Others'}
            </Link>
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
          
          {/* No categories state */}
          {!loading && !error && categories.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white/70">
                {isJapanese 
                  ? 'カテゴリーが見つかりませんでした。' 
                  : 'No categories found.'}
              </p>
            </div>
          )}
          
          {/* 6 cards in 2 rows of 3 */}
          {!loading && !error && (() => {
            // Get filtered categories based on the selected category
            const filteredCategories = categories.filter(category => {
              // Debug logging
              console.log(`Checking category ${category.name} (${category.slug}) against filter: ${selectedCategory}`);
              
              // Always show all categories when 'all' is selected
              if (selectedCategory === 'all') return true;
              
              // Convert everything to lowercase for case-insensitive matching
              const slug = category.slug.toLowerCase();
              const name = category.name.toLowerCase();
              
              // Check for CNC categories
              if (selectedCategory === 'cnc' && 
                 (slug.includes('cnc') || name.includes('cnc'))) {
                return true;
              }
              
              // Check for Lathe categories
              if (selectedCategory === 'lathe' && 
                 (slug.includes('lathe') || name.includes('lathe') || 
                  slug.includes('turning') || name.includes('turning'))) {
                return true;
              }
              
              // Check for Milling categories
              if (selectedCategory === 'milling' && 
                 (slug.includes('mill') || name.includes('mill') ||
                  slug.includes('milling') || name.includes('milling'))) {
                return true;
              }
              
              // Other categories (anything not matching the above)
              if (selectedCategory === 'other') {
                return !slug.includes('cnc') && !name.includes('cnc') &&
                       !slug.includes('lathe') && !name.includes('lathe') &&
                       !slug.includes('turning') && !name.includes('turning') &&
                       !slug.includes('mill') && !name.includes('mill');
              }
              
              return false;
            });
            
            console.log(`Found ${filteredCategories.length} categories matching filter: ${selectedCategory}`);
            
            // Show a message if no categories match the filter
            if (filteredCategories.length === 0) {
              return (
                <div className="col-span-3 py-8 text-center">
                  <p className="text-white/70">
                    {isJapanese 
                      ? 'この種類の機械は現在ありません。' 
                      : 'No machinery in this category currently available.'}
                  </p>
                </div>
              );
            }
            
            // Otherwise show the filtered categories
            return (
              <motion.div 
                className="grid grid-cols-3 gap-2"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
              >
                {filteredCategories.map((category) => (
              <motion.div 
                key={category.id} 
                className="bg-[#2a4070] relative group"
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href={`/${lang}/machinery?category=${encodeURIComponent(category.name)}`}>
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {/* Category image */}
                    <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-300">
                      {category.image ? (
                        <div className="relative w-full h-full">
                          <CloudinaryImage 
                            src={category.image} 
                            alt={category.name}
                            width={300}
                            height={225}
                            className="object-cover w-full h-full"
                            crop="fill"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#2a4070]">
                          <span className="text-white/50 text-xs">{category.name}</span>
                        </div>
                      )}
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
            );
          })()}
        </div>
      </div>
    </section>
  )
}
