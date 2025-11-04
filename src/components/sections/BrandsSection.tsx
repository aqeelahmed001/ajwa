"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CloudinaryImage from '@/components/ui/CloudinaryImage';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

interface Brand {
  id: string;
  name: string;
  logo: string;
  order: number;
  isActive: boolean;
}

interface BrandsSectionProps {
  lang: string;
}

// Define the keyframe animation and styles for the marquee effect
const marqueeStyles = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  
  .marquee-container {
    width: 100%;
    overflow: hidden;
  }
  
  .marquee-content {
    display: flex;
    width: max-content;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
`;

export default function BrandsSection({ lang }: BrandsSectionProps) {
  const [brands, setBrands] = useState<Brand[]>([
    // Fallback data in case API fails - using test image for all
    {
      id: '1',
      name: 'Komatsu',
      logo: '/images/logo.jpg', // Test with known working image
      order: 0,
      isActive: true
    },
    {
      id: '2',
      name: 'Hitachi',
      logo: '/images/logo.jpg', // Test with known working image
      order: 1,
      isActive: true
    },
    {
      id: '3',
      name: 'Kubota',
      logo: '/images/logo.jpg', // Test with known working image
      order: 2,
      isActive: true
    }
  ]);
  
  const [loading, setLoading] = useState(true);
  
  // No need to modify URLs anymore - they come correctly from the API
  // Just a simple function to handle empty URLs
  const getLogoUrl = (url: string): string => {
    // If URL is empty or undefined, return empty string
    if (!url) {
      console.warn('Empty logo URL found');
      return '';
    }
    
    console.log('Using logo URL directly:', url);
    return url;
  };
  
  // Fetch brands from API
  useEffect(() => {
    async function fetchBrands() {
      try {
        console.log('Fetching brands for BrandsSection...');
        
        // Use the public API endpoint instead of the admin one
        const response = await fetch('/api/brands');
        
        if (response.ok) {
          const data = await response.json();
          console.log('Brands data received:', data);
          
          if (Array.isArray(data) && data.length > 0) {
            // Sort brands by order field
            const sortedBrands = [...data].sort((a, b) => a.order - b.order);
            console.log('Sorted brands:', sortedBrands);
            
            // Log each brand's logo URL to help with debugging
            sortedBrands.forEach(brand => {
              // Get the proper URL for the logo
              brand.logo = getLogoUrl(brand.logo);
              console.log(`Brand: ${brand.name}, Logo URL: ${brand.logo}`);
            });
            
            setBrands(sortedBrands);
          } else {
            console.log('No brands found or empty array returned');
            // Keep the fallback data if no brands are returned
            console.log('Using fallback brand data');
          }
        } else {
          console.error('Failed to fetch brands:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        console.log('Using fallback brand data due to error');
      } finally {
        setLoading(false);
      }
    }
    
    fetchBrands();
  }, []);

  // Create multiple sets of brands for the infinite loop
  // We need at least two complete sets for the marquee to work properly
  const tickerBrands = [...brands, ...brands, ...brands, ...brands];
  
  // Animation duration based on number of brands - slower for fewer brands
  const animationDuration = Math.max(20, brands.length * 10); // At least 20 seconds, or 10 seconds per brand

  return (
    <section className="w-full overflow-hidden py-8">
      {/* Add the keyframe animation and styles to the DOM */}
      <style dangerouslySetInnerHTML={{ __html: marqueeStyles }} />
      
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">
          {lang === 'ja' ? 'パートナーブランド' : 'Our Partner Brands'}
        </h2>
      </div>
      
      {/* Professional Brand Logo Ticker */}
      <div className="brand-ticker py-16 overflow-hidden relative">
        {/* Subtle top and bottom borders */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        {/* Brand logos - Marquee container */}
        <div className="max-w-screen-2xl mx-auto px-4 relative overflow-hidden">
          {/* This outer div hides the overflow */}
          <div className="marquee-container">
            {/* This inner div animates and contains the duplicated content */}
            <div 
              className="marquee-content"
              style={{
                animation: `marquee ${animationDuration}s linear infinite`,
                willChange: 'transform'
              }}
            >
            {tickerBrands.map((brand, index) => (
              <div 
                key={`${brand.name}-${index}`} 
                className="mx-6 px-2 inline-flex items-center justify-center group transition-transform duration-500 hover:-translate-y-1"
              >
                {brand.logo ? (
                  <CloudinaryImage 
                    src={brand.logo} 
                    alt={brand.name} 
                    width={180}
                    height={80}
                    quality={90}
                    format="auto"
                    crop="fit"
                    className="h-16 md:h-20 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                    onError={(e) => {
                      console.error(`Failed to load image for brand: ${brand.name}`, brand.logo);
                      console.error('Image error details:', e);
                      // Set a fallback image or hide the element
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="h-16 md:h-20 w-40 bg-gray-800 animate-pulse rounded"></div>
                )}
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
