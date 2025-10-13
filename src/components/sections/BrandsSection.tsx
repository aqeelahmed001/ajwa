"use client";

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, Variants, useAnimation } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Building2, Factory, Settings, ChevronLeft, ChevronRight, Award, Globe, Users } from 'lucide-react'

interface BrandsSectionProps {
  lang: string;
}

export default function BrandsSection({ lang }: BrandsSectionProps) {
  const isJapanese = lang === 'ja'
  const [currentSlide, setCurrentSlide] = useState(0)
  const controls = useAnimation()
  
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  // Enhanced brand data with more professional details
  const brands = [
    {
      name: 'Mitsubishi',
      category: 'Heavy Machinery',
      logo: '/images/brands/mitsubishi.png',
      description: isJapanese ? '三菱重工業' : 'Mitsubishi Heavy Industries',
      specialties: isJapanese ? ['発電設備', '産業機械', '航空宇宙'] : ['Power Generation', 'Industrial Machinery', 'Aerospace'],
      yearEstablished: 1884,
      color: 'from-blue-500 to-blue-700'
    },
    {
      name: 'Komatsu',
      category: 'Construction Equipment',
      logo: '/images/brands/komatsu.png',
      description: isJapanese ? '小松製作所' : 'Komatsu Ltd.',
      specialties: isJapanese ? ['建設機械', '鉱山機械', 'フォークリフト'] : ['Construction Equipment', 'Mining Equipment', 'Forklifts'],
      yearEstablished: 1921,
      color: 'from-orange-500 to-orange-700'
    },
    {
      name: 'Hitachi',
      category: 'Industrial Equipment',
      logo: '/images/brands/hitachi.png',
      description: isJapanese ? '日立製作所' : 'Hitachi Ltd.',
      specialties: isJapanese ? ['産業システム', '社会インフラ', 'デジタルソリューション'] : ['Industrial Systems', 'Social Infrastructure', 'Digital Solutions'],
      yearEstablished: 1910,
      color: 'from-red-500 to-red-700'
    },
    {
      name: 'Kubota',
      category: 'Agricultural Machinery',
      logo: '/images/brands/kubota.png',
      description: isJapanese ? '久保田株式会社' : 'Kubota Corporation',
      specialties: isJapanese ? ['農業機械', 'エンジン', '建設機械'] : ['Agricultural Machinery', 'Engines', 'Construction Equipment'],
      yearEstablished: 1890,
      color: 'from-green-500 to-green-700'
    },
    {
      name: 'Yanmar',
      category: 'Diesel Engines',
      logo: '/images/brands/yanmar.png',
      description: isJapanese ? 'ヤンマーホールディングス' : 'Yanmar Holdings',
      specialties: isJapanese ? ['ディーゼルエンジン', '建設機械', '農業機械'] : ['Diesel Engines', 'Construction Equipment', 'Agricultural Machinery'],
      yearEstablished: 1912,
      color: 'from-yellow-500 to-yellow-700'
    },
    {
      name: 'Makita',
      category: 'Power Tools',
      logo: '/images/brands/makita.png',
      description: isJapanese ? 'マキタ株式会社' : 'Makita Corporation',
      specialties: isJapanese ? ['電動工具', '園芸工具', '産業用機器'] : ['Power Tools', 'Garden Tools', 'Industrial Equipment'],
      yearEstablished: 1915,
      color: 'from-teal-500 to-teal-700'
    }
  ]

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(brands.length / 3))
    }, 4000)
    return () => clearInterval(interval)
  }, [brands.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(brands.length / 3))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(brands.length / 3)) % Math.ceil(brands.length / 3))
  }

  // Text content based on language
  const sectionText = {
    title: isJapanese ? '取引メーカー' : 'Our Partner Brands',
    subtitle: isJapanese 
      ? '世界一流の機械メーカーとの長年の取引実績' 
      : 'Trusted partnerships with world-leading machinery manufacturers',
    description: isJapanese
      ? '20年以上にわたる実績で、日本を代表する機械メーカーとの強固な取引関係を築いてきました。高品質な機械を世界中のお客様にお届けします。'
      : 'With over 20 years of experience, we have built strong relationships with Japan\'s leading machinery manufacturers. We deliver high-quality equipment to customers worldwide.',
    ctaText: isJapanese ? '全メーカーを見る' : 'View All Brands',
    ctaSubtext: isJapanese ? '取引メーカーの詳細' : 'Explore our complete brand portfolio'
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-parrot-red/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/3 to-parrot-red/3 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center space-y-12"
        >
          {/* Enhanced Section Header */}
          <motion.div variants={fadeIn} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Award className="h-4 w-4" />
              {isJapanese ? '信頼できるパートナーシップ' : 'Trusted Partnerships'}
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900">
              {sectionText.title}
            </h2>
            <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-primary to-parrot-red bg-clip-text text-transparent max-w-3xl mx-auto">
              {sectionText.subtitle}
            </p>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {sectionText.description}
            </p>
          </motion.div>

          {/* Interactive Brands Carousel */}
          <motion.div variants={itemVariants} className="relative">
            <div className="overflow-hidden">
              <motion.div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentSlide * 100}%)`,
                  width: `${Math.ceil(brands.length / 3) * 100}%`
                }}
              >
                {Array.from({ length: Math.ceil(brands.length / 3) }, (_, slideIndex) => (
                  <div key={slideIndex} className="flex gap-6 md:gap-8 w-full">
                    {brands.slice(slideIndex * 3, slideIndex * 3 + 3).map((brand, index) => (
                      <motion.div
                        key={brand.name}
                        className="flex-1"
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:border-primary/30 group">
                          {/* Enhanced Brand Logo */}
                          <div className="flex items-center justify-center mb-6">
                            <div className={`w-20 h-20 bg-gradient-to-br ${brand.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                              <Building2 className="h-10 w-10 text-white" />
                            </div>
                          </div>
                          
                          {/* Enhanced Brand Info */}
                          <div className="text-center space-y-3">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                              {brand.name}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {brand.description}
                            </p>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {brand.specialties.slice(0, 2).map((specialty, idx) => (
                                <span 
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700 font-medium"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                            <div className="text-xs text-primary font-semibold">
                              Est. {brand.yearEstablished}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="rounded-full w-12 h-12 border-2 border-slate-300 hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              {/* Slide Indicators */}
              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(brands.length / 3) }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-primary scale-125' 
                        : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="rounded-full w-12 h-12 border-2 border-slate-300 hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          {/* Enhanced CTA Section */}
          <motion.div 
            variants={itemVariants}
            className="mt-20 bg-gradient-to-r from-primary/5 via-white to-parrot-red/5 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 backdrop-blur-sm max-w-5xl mx-auto relative overflow-hidden"
          >
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-parrot-red/10 rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative z-10 text-center space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-primary text-sm font-medium">
                  <Users className="h-4 w-4" />
                  {isJapanese ? 'グローバルパートナーシップ' : 'Global Partnerships'}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
                  {isJapanese ? '信頼できるパートナーシップ' : 'Trusted Partnerships'}
                </h3>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {isJapanese 
                    ? '日本を代表する機械メーカーとの長年の取引実績により、お客様に最高品質の機械をお届けします。20年以上の信頼関係を築いてきました。'
                    : 'Our long-standing relationships with Japan\'s leading machinery manufacturers ensure we deliver the highest quality equipment to our customers. We have built trust over 20+ years.'
                  }
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <Link href={`/${lang}/brands`}>
                    {sectionText.ctaText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-primary px-8 py-3 rounded-xl transition-all duration-300" asChild>
                  <Link href={`/${lang}/contact`}>
                    <Globe className="mr-2 h-4 w-4" />
                    {isJapanese ? 'お問い合わせ' : 'Get Quote'}
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  {isJapanese ? '20年以上の実績' : '20+ Years Experience'}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-parrot-red rounded-full"></div>
                  {isJapanese ? '世界一流メーカー' : 'World-Class Manufacturers'}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  {isJapanese ? '品質保証' : 'Quality Guaranteed'}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 