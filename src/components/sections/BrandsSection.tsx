"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface BrandsSectionProps {
  lang: string;
}

export default function BrandsSection({ lang }: BrandsSectionProps) {
  // Brand data - simplified to just name and logo
  const brands = [
    {
      name: 'Komatsu',
      logo: '/images/brands/komatsu.png',
    },
    {
      name: 'Hitachi',
      logo: '/images/brands/hitachi.png',
    },
    {
      name: 'Kubota',
      logo: '/images/brands/kubota.png',
    },
    {
      name: 'Yanmar',
      logo: '/images/brands/yanmar.png',
    },
    {
      name: 'Tadano',
      logo: '/images/brands/tadano.png',
    },
    {
      name: 'Makita',
      logo: '/images/brands/makita.png',
    }
  ];

  // Duplicate the brands array to create a seamless loop
  const tickerBrands = [...brands, ...brands, ...brands];
  
  // Animation duration based on number of brands
  const animationDuration = brands.length * 5; // 5 seconds per brand

  return (
    <section className="w-full overflow-hidden">
      {/* Professional Brand Logo Ticker */}
      <div className="brand-ticker py-8 overflow-hidden relative">
        {/* Subtle top and bottom borders */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        {/* Brand logos */}
        <div className="max-w-screen-2xl mx-auto px-4 relative">
          <div 
            className="flex whitespace-nowrap items-center"
            style={{
              animation: `marquee ${animationDuration}s linear infinite`
            }}
          >
            {tickerBrands.map((brand, index) => (
              <div 
                key={`${brand.name}-${index}`} 
                className="mx-16 inline-flex items-center justify-center group transition-transform duration-500 hover:-translate-y-1"
              >
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="h-10 md:h-12 object-contain filter brightness-0 invert opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
