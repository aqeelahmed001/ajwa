"use client";

import React from 'react'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import AwesomeSlider from 'react-awesome-slider'
// @ts-ignore - No type definitions available for autoplay
import withAutoplay from 'react-awesome-slider/dist/autoplay'
import 'react-awesome-slider/dist/styles.css'
import 'react-awesome-slider/dist/custom-animations/cube-animation.css'
import { usePageContent } from '@/hooks/usePageContent'

interface HeroSectionProps {
  lang: string;
  backgroundImage?: string; // deprecated in favor of images, kept for compatibility
  images?: string[]; // slider images
}

export default function HeroSection({ lang, backgroundImage, images }: HeroSectionProps) {
  const isJapanese = lang === 'ja'
  
  // Create autoplay slider
  const AutoplaySlider = withAutoplay(AwesomeSlider)
  
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }
  
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  }
  
  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 }
    }
  }
  
  const { getContent } = usePageContent({
    pageId: 'home',
    section: 'hero',
    lang
  })

  // Text content from CMS with fallbacks
  const heroText = {
    categoryTag: getContent('categoryTag', isJapanese ? '国際機械取引' : 'International Machinery Trading'),
    mainLeft: getContent('mainLeft', isJapanese ? '機械を購入したい' : 'Buy a Machine'),
    mainRight: getContent('mainRight', isJapanese ? '機械を売りたい' : 'Sell a Machine'),
    subtitle: getContent('subtitle', isJapanese 
      ? 'あなたのニーズに合わせて、購入と売却をシンプルに' 
      : 'Make buying and selling machinery simple'),
    ctaContact: getContent('ctaContact', isJapanese ? '売却の相談' : 'Sell Your Machine'),
    ctaListings: getContent('ctaListings', isJapanese ? '機械を探す' : 'Browse Listings'),
    leftDescription: getContent('leftDescription', isJapanese
      ? '世界中から高品質な産業機械を厳選して提供します。'
      : 'Find high-quality industrial machinery curated from around the world.'),
    rightDescription: getContent('rightDescription', isJapanese
      ? '日本国内の中古機械を適正な市場価格で買取いたします。'
      : 'We purchase used machinery in Japan at fair market value.')
  }

  // Slider images (using the new images from public/images folder)
  const defaultImages = [
    '/images/mach1.jpg',
    '/images/mach2.jpg',
    '/images/mach3.jpg',
  ]
  const slides = (images && images.length > 0)
    ? images
    : (backgroundImage ? [backgroundImage, ...defaultImages] : defaultImages)

  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Slider background */}
      <div className="absolute inset-0 -z-10">
        <AutoplaySlider
          play={true}
          cancelOnInteraction={false}
          interval={6000}
          className="h-full"
          bullets={true}
          organicArrows={true}
          infinite={true}
          mobileTouch={true}
          animation="cubeAnimation"
          media={slides.map((src) => ({
            source: src
          }))}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Foreground content */}
      <div className="container relative z-10 py-20 md:py-28">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tag and subtitle */}
          <motion.div variants={fadeIn} className="text-center mb-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
              {heroText.categoryTag}
            </span>
            <p className="mt-4 text-white/90 text-base md:text-lg">
              {heroText.subtitle}
            </p>
          </motion.div>

          {/* Two-column choice with center divider */}
          <div className="relative max-w-5xl mx-auto min-h-[500px] flex items-center">
            {/* Center vertical divider - taller now */}
            <div className="hidden md:block absolute left-1/2 top-[10%] bottom-[10%] w-px bg-white/60 -translate-x-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {/* Left: Buy a machine */}
              <motion.div variants={itemVariants} className="text-center px-4 flex flex-col items-center md:items-end justify-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-md text-center">
                  {heroText.mainLeft}
                </h1>
                <p className="mt-3 text-white/85 max-w-md text-center md:text-right">
                  {heroText.leftDescription}
                </p>
                <div className="mt-6">
                  <Button size="lg" className="text-base px-6 bg-white text-slate-900 hover:bg-white/90" asChild>
                    <Link href={`/${lang}/machinery`}>
                      {heroText.ctaListings}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>

              {/* Right: Sell a machine */}
              <motion.div variants={itemVariants} className="text-center px-4 flex flex-col items-center md:items-start justify-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-md text-center">
                  {heroText.mainRight}
                </h1>
                <p className="mt-3 text-white/85 max-w-md text-center md:text-left">
                  {heroText.rightDescription}
                </p>
                <div className="mt-6">
                  <Button size="lg" className="text-base px-6 bg-parrot-red hover:bg-parrot-red/90 text-white" asChild>
                    <Link href={`/${lang}/contact`}>
                      {heroText.ctaContact}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
 