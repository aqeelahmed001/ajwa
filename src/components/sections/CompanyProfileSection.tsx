"use client";

import React, { useState } from 'react';
import { Target, Briefcase, ChevronRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CompanyProfileSectionProps {
  lang: string;
}

export default function CompanyProfileSection({ lang }: CompanyProfileSectionProps) {
  const isJapanese = lang === 'ja';
  
  // Company profile data
  const companyInfo = [
    {
      label: isJapanese ? '会社名' : 'Company Name',
      value: 'Ajwa Co.,LTD'
    },
    {
      label: isJapanese ? '設立' : 'Established',
      value: '2002'
    },
    {
      label: isJapanese ? '資本金' : 'Capital',
      value: isJapanese ? '500億円' : '500 Million JPY'
    },
    {
      label: isJapanese ? '代表取締役' : 'CEO',
      value: 'Muhammad Aqeel Ahmed'
    },
    {
      label: isJapanese ? '事業内容' : 'Business',
      value: isJapanese ? '産業機械の輸出入、買取販売' : 'Import/Export and Trading of Industrial Machinery'
    },
    {
      label: isJapanese ? '従業員数' : 'Employees',
      value: '10'
    },
    {
      label: isJapanese ? '取引国' : 'Trading Countries',
      value: '10+'
    }
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Interactive states
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header - Small blue badge with animation */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 text-sm font-medium rounded-full">
            {isJapanese ? '会社概要' : 'COMPANY PROFILE'}
          </span>
        </motion.div>
        
        {/* Main Title with animation */}
        <motion.h2 
          className="text-3xl font-bold text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {isJapanese ? 'アジワ株式会社について' : 'About Ajwa Co.,LTD'}
        </motion.h2>
        
        {/* Description paragraph with animation */}
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-700">
            {isJapanese 
              ? '2002年の設立以来、アジワ株式会社は日本と世界をつなぐ機械取引の架け橋として成長してきました。私たちは、高品質な産業機械の輸出入を専門とし、お客様のビジネス成功に貢献しています。' 
              : 'Since our establishment in 2002, Ajwa Co.,LTD has grown to become a bridge connecting Japan and the world in machinery trading. We specialize in the export and import of high-quality industrial machinery, contributing to our clients\' business success.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Information - Left side with animation */}
          <motion.div 
            className="bg-gray-50 p-8 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
              {isJapanese ? '会社情報' : 'Company Information'}
            </h3>
            
            <motion.div 
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {companyInfo.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  className={`flex border-b border-gray-100 pb-3 last:border-0 ${hoveredItem === idx ? 'bg-gray-100' : ''} rounded-md transition-colors duration-200`}
                  variants={fadeIn}
                  onMouseEnter={() => setHoveredItem(idx)}
                  onMouseLeave={() => setHoveredItem(null)}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-1/3 font-medium text-gray-700 p-1">{item.label}</div>
                  <div className="w-2/3 text-gray-600 p-1">{item.value}</div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className="mt-6 text-right"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
            >
              <Link 
                href={`/${lang}/contact`} 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                {isJapanese ? 'お問い合わせ' : 'Contact Us'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Vision & Mission - Right side with animations */}
          <div className="space-y-6">
            {/* Vision */}
            <motion.div 
              className="bg-blue-50 p-6 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-3">
                <Target className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-800">
                  {isJapanese ? 'ビジョン' : 'Our Vision'}
                </h3>
              </div>
              
              <p className="text-gray-700">
                {isJapanese
                  ? 'グローバルな産業発展を促進し、世界中の企業に価値ある機械ソリューションを提供する、最も信頼されるパートナーになること。'
                  : 'To become the most trusted partner in promoting global industrial development by providing valuable machinery solutions to businesses worldwide.'}
              </p>
            </motion.div>
            
            {/* Mission */}
            <motion.div 
              className="bg-green-50 p-6 rounded-lg border border-green-100 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-3">
                <Briefcase className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-800">
                  {isJapanese ? 'ミッション' : 'Our Mission'}
                </h3>
              </div>
              
              <p className="text-gray-700">
                {isJapanese
                  ? '世界中の産業発展に貢献するため、日本の優れた機械をグローバルに提供し、信頼できるパートナーとしてお客様の成長を支援します。'
                  : 'To contribute to global industrial progress by delivering superior Japanese machinery worldwide and supporting our clients\' growth as a trusted partner.'}
              </p>
            </motion.div>
            
            {/* Learn More Link */}
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link 
                href={`/${lang}/services`} 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                {isJapanese ? 'サービス詳細を見る' : 'Learn more about our services'}
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
