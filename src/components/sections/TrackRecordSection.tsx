"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface TrackRecordSectionProps {
  lang: string;
}

export default function TrackRecordSection({ lang }: TrackRecordSectionProps) {
  const isJapanese = lang === 'ja';
  
  // Text content based on language
  const content = {
    reasonTitle: isJapanese ? '機械高価買取で選ばれ続けている理由' : 'Why we are chosen for high-value machinery purchases',
    mainTitle1: isJapanese ? '多くの買取実績による' : 'Based on many successful purchases',
    mainTitle2: isJapanese ? '安心' : 'Peace of mind',
    mainTitle3: isJapanese ? 'と' : 'and',
    mainTitle4: isJapanese ? '信頼' : 'Trust',
    mainTitle5: isJapanese ? 'の' : 'with',
    mainTitle6: isJapanese ? '高価買取' : 'High-value purchasing',
    mainTitle7: isJapanese ? 'を実現' : 'realized',
    description1: isJapanese 
      ? '1996年創業の弊社は多くのお客様にご愛顧頂き、数々の販売・買取実績を築いてきました。' 
      : 'Since our founding in 1996, our company has been patronized by many customers and has built numerous sales and purchase records.',
    description2: isJapanese
      ? '工作機械の売却が初めてというお客様にもご安心頂けるよう親切・丁寧な対応を心がけ、コンプライアンスを遵守し、ご納得頂けるような高価買取を実現致します！'
      : 'We strive to provide kind and courteous service so that even customers who are selling machine tools for the first time can feel at ease, comply with regulations, and realize high-value purchases that you can be satisfied with!',
    description3: isJapanese
      ? 'お客様が大切にされた機械だからこそ、期待を裏切らないように'
      : 'Because these are machines that customers have valued, we will not disappoint your expectations',
    highlightedText: isJapanese ? '信頼頂ける査定引き' : 'trustworthy appraisal',
    description4: isJapanese
      ? 'をお約束し、最後には「ワイ・エム・エスを選んで良かった」と思って頂けるよう全力で買取させて頂きます！'
      : 'We promise to do our best to make you feel that "I\'m glad I chose YMS" in the end!'
  };

  // Placeholder machinery images
  const machineryImages = [
    { id: 1, alt: 'CNC Machine 1' },
    { id: 2, alt: 'CNC Machine 2' },
    { id: 3, alt: 'CNC Machine 3' },
    { id: 4, alt: 'CNC Machine 4' },
    { id: 5, alt: 'CNC Machine 5' },
    { id: 6, alt: 'CNC Machine 6' },
    { id: 7, alt: 'CNC Machine 7' },
    { id: 8, alt: 'CNC Machine 8' }
  ];

  return (
    <section className="py-16 bg-white overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
      
      <div className="container mx-auto px-4">
        {/* Top reason badge */}
        <div className="flex justify-center mb-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="px-8 py-3 border-2 border-blue-500 rounded-full text-center"
          >
            <span className="text-lg font-medium text-gray-800">
              {content.reasonTitle}
            </span>
          </motion.div>
        </div>
        
        {/* Main title with highlighted text */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            {content.mainTitle1}
          </h2>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-blue-600">{content.mainTitle2}</span>
            <span className="mx-2">{content.mainTitle3}</span>
            <span className="text-blue-600">{content.mainTitle4}</span>
            <span className="mx-2">{content.mainTitle5}</span>
            <span className="text-blue-600">{content.mainTitle6}</span>
            <span>{content.mainTitle7}</span>
          </h2>
        </motion.div>
        
        {/* Machinery images grid */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {machineryImages.slice(0, 4).map((image) => (
            <motion.div
              key={image.id}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-medium">Machinery Image {image.id}</span>
              </div>
            </motion.div>
          ))}
          {machineryImages.slice(4, 8).map((image) => (
            <motion.div
              key={image.id}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-medium">Machinery Image {image.id}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Description text */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-lg text-gray-700 mb-4">
            {content.description1}
          </p>
          <p className="text-lg text-gray-700 mb-4">
            {content.description2}
          </p>
          <p className="text-lg text-gray-700">
            {content.description3}
            <span className="text-blue-600 font-bold mx-1 bg-blue-100 px-2 py-1 rounded">
              {content.highlightedText}
            </span>
            {content.description4}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
