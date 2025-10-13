"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ContentSectionProps {
  lang: string;
}

export default function ContentSection({ lang }: ContentSectionProps) {
  const isJapanese = lang === 'ja';
  
  // Content items with translations
  const content = {
    title: isJapanese ? 'コンテンツ' : 'CONTENTS',
    items: [
      {
        id: 1,
        image: '/images/mach1.jpg',
        title: isJapanese ? '会社概要' : 'Company Information',
        description: isJapanese 
          ? '私たちの会社の歴史、ビジョン、そして使命についてご紹介します。' 
          : 'Learn about our company history, vision, and mission.',
        link: `/${lang}/about`,
      },
      {
        id: 2,
        image: '/images/mach2.jpg',
        title: isJapanese ? 'SKの強み' : 'Our Strengths',
        description: isJapanese 
          ? '高品質な機械と専門知識で、お客様のニーズに応えます。' 
          : 'We meet your needs with high-quality machinery and expertise.',
        link: `/${lang}/services`,
      },
      {
        id: 3,
        image: '/images/mach3.jpg',
        title: isJapanese ? '採用情報' : 'Recruitment',
        description: isJapanese 
          ? '私たちのチームに参加して、国際的なキャリアを築きましょう。' 
          : 'Join our team and build an international career.',
        link: `/${lang}/contact`,
      },
    ],
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  return (
    <section className="py-16 md:py-24 bg-white relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-slate-50/50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] -z-10" />
      
      <div className="container mx-auto px-4">
        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{content.title}</h2>
          <div className="w-20 h-1 bg-primary mx-auto" />
          {isJapanese && <p className="mt-2 text-sm text-slate-500">コンテンツ</p>}
        </div>

        {/* Content grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {content.items.map((item) => (
            <motion.div 
              key={item.id}
              className="group relative overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              variants={itemVariants}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">{item.title}</h3>
              </div>
              
              {/* Content */}
              <div className="p-5">
                <p className="text-slate-600 mb-4">{item.description}</p>
                <Link 
                  href={item.link}
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                >
                  {isJapanese ? '詳細を見る' : 'Learn More'}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
