"use client";

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Building2, Warehouse, Globe2 } from 'lucide-react'
import Link from 'next/link'

interface IntroSectionProps {
  lang: string;
}

export default function IntroSection({ lang }: IntroSectionProps) {
  const isJapanese = lang === 'ja'
  
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
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
  
  // Text content based on language
  const introText = {
    title: isJapanese ? 'グローバル機械取引の専門家' : 'Global Machinery Trading Experts',
    subtitle: isJapanese ? '20年以上の経験で、日本と世界をつなぐ' : 'Connecting Japan and the World with 20+ Years of Experience',
    description: isJapanese 
      ? 'アジュワ・トレーディングは、日本を拠点とする機械輸出入のリーディングカンパニーです。高品質な産業機械を世界中に供給し、日本国内の中古機械を適正な市場価値で買取いたします。専門的なサービスと20年以上の実績で、お客様のビジネスニーズにお応えします。'
      : 'Ajwa Trading is Japan\'s leading machinery export-import company. We supply high-quality industrial machinery worldwide and purchase used equipment from Japanese customers at fair market value. With specialized service and 20+ years of expertise, we meet your business needs.',
    buyTitle: isJapanese ? '高品質機械の調達' : 'Quality Machinery Procurement',
    buyDescription: isJapanese 
      ? '世界中から厳選された高品質な産業機械を、お客様のニーズに合わせて提供します。'
      : 'We provide carefully selected high-quality industrial machinery from around the world, tailored to your needs.',
    sellTitle: isJapanese ? '適正価格での買取' : 'Fair Price Purchases',
    sellDescription: isJapanese 
      ? '日本国内の中古機械を、市場価値に基づいた適正価格で買取いたします。'
      : 'We purchase used machinery in Japan at fair market prices based on current market value.',
    globalTitle: isJapanese ? 'グローバルネットワーク' : 'Global Network',
    globalDescription: isJapanese 
      ? 'アジア、ヨーロッパ、中東など世界各国とのネットワークを活かしたサービスを提供します。'
      : 'We leverage our network across Asia, Europe, the Middle East, and beyond to provide comprehensive services.',
    learnMore: isJapanese ? 'サービス詳細' : 'Learn More'
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            {introText.title}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-600 mb-6">
            {introText.subtitle}
          </motion.p>
          <motion.p variants={itemVariants} className="text-base md:text-lg text-slate-600">
            {introText.description}
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {/* Feature 1: Buy */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Warehouse className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3 text-center">{introText.buyTitle}</h3>
            <p className="text-slate-600 text-center">{introText.buyDescription}</p>
          </motion.div>

          {/* Feature 2: Sell */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="bg-parrot-red/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Building2 className="h-7 w-7 text-parrot-red" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3 text-center">{introText.sellTitle}</h3>
            <p className="text-slate-600 text-center">{introText.sellDescription}</p>
          </motion.div>

          {/* Feature 3: Global Network */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="bg-blue-500/10 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Globe2 className="h-7 w-7 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3 text-center">{introText.globalTitle}</h3>
            <p className="text-slate-600 text-center">{introText.globalDescription}</p>
          </motion.div>
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            href={`/${lang}/services`}
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            {introText.learnMore}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
