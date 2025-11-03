"use client";

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, MessageCircle, Laptop, Smartphone, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface AssessmentCTASectionProps {
  lang: string;
}

export default function AssessmentCTASection({ lang }: AssessmentCTASectionProps) {
  const isJapanese = lang === 'ja';
  
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
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
  };

  // Text content based on language
  const content = {
    title: isJapanese ? 'お気軽にお申し込みください！' : 'Apply for a free assessment!',
    subtitle: isJapanese ? '無料買取査定はこちらから' : 'Free assessment options below',
    webTitle: isJapanese ? '機械を売る' : 'Sell Your Machinery',
    webDescription: isJapanese 
      ? '機械の売却をお考えですか？以下のフォームに必要事項をご記入ください。' 
      : 'Looking to sell your machinery? Fill out our form and we will contact you.',
    webButton: isJapanese ? '売却の問い合わせ' : 'Sell Machinery',
    webStatus: isJapanese ? '利用可能' : 'Available',
    lineTitle: isJapanese ? '機械を購入' : 'Buy Machinery',
    lineDescription: isJapanese 
      ? '必要な機械をお探しですか？お客様のニーズに合った機械をご提案いたします。' 
      : 'Looking for specific machinery? We will help you find what you need.',
    lineButton: isJapanese ? '購入の問い合わせ' : 'Buy Machinery',
    lineStatus: isJapanese ? '利用可能' : 'Available',
    appTitle: isJapanese ? 'モバイルアプリで査定' : 'Assessment via mobile app',
    appDescription: isJapanese 
      ? '当社の専用アプリを使って、いつでもどこでも簡単に査定依頼が可能になります。' 
      : 'Use our dedicated app to request assessments easily anytime, anywhere.',
    appButton: isJapanese ? '続報をお待ちください' : 'Stay tuned',
    appStatus: isJapanese ? '近日公開' : 'Coming Soon',
    availableText: isJapanese ? '利用可能' : 'Available',
    comingSoonText: isJapanese ? '近日公開' : 'Coming Soon'
  };

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-blue-100 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <motion.div 
        className="container relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              {content.title}
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {content.subtitle}
            </h3>
          </motion.div>
        </div>
        
        {/* Three options grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Web assessment option */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl shadow-xl hover:shadow-orange-300/30 hover:shadow-2xl p-6 text-white relative overflow-hidden group"
          >
            {/* Status badge */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              {content.webStatus}
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-300/20 to-orange-500/0 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tl from-orange-600/20 to-orange-500/0 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="flex flex-col items-center gap-6 relative z-10">
              {/* Icon with animated glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-orange-300/30 rounded-full blur-xl animate-pulse"></div>
                <div className="bg-gradient-to-br from-orange-300 to-orange-500 p-5 rounded-full shadow-lg relative">
                  <Laptop className="w-10 h-10 text-white" />
                </div>
                <div className="absolute top-0 right-0 bg-orange-300 text-orange-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                  {isJapanese ? '1分で完了！' : 'Done in 1 min!'}
                </div>
              </div>
              
              {/* Text content */}
              <div className="text-center">
                <h4 className="text-2xl font-bold mb-3">{content.webTitle}</h4>
                <p className="text-white/90 mb-6 max-w-xs mx-auto">{content.webDescription}</p>
                <Link 
                  href={`/${lang}/contact?tab=sell`}
                  className="inline-flex items-center justify-center bg-white text-orange-500 hover:bg-orange-50 transition-all duration-300 px-8 py-3.5 rounded-full font-medium shadow-lg hover:shadow-xl group-hover:scale-105 border border-white/50"
                >
                  {content.webButton}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* LINE assessment option */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl shadow-xl hover:shadow-green-300/30 hover:shadow-2xl p-6 text-white relative overflow-hidden group"
          >
            {/* Status badge */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              {content.lineStatus}
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-300/20 to-green-500/0 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tl from-green-600/20 to-green-500/0 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="flex flex-col items-center gap-6 relative z-10">
              {/* Icon with animated glow and QR code */}
              <div className="relative">
                <div className="absolute inset-0 bg-green-300/30 rounded-full blur-xl animate-pulse"></div>
                <div className="bg-gradient-to-br from-green-300 to-green-500 p-5 rounded-full shadow-lg relative">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white rounded-lg shadow-lg overflow-hidden flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform">
                  <div className="text-xs text-green-500 font-bold text-center">
                    QR<br/>Code
                  </div>
                </div>
              </div>
              
              {/* Text content */}
              <div className="text-center">
                <h4 className="text-2xl font-bold mb-3">{content.lineTitle}</h4>
                <p className="text-white/90 mb-6 max-w-xs mx-auto">{content.lineDescription}</p>
                <Link 
                  href={`/${lang}/contact?tab=buy`}
                  className="inline-flex items-center justify-center bg-white text-green-500 hover:bg-green-50 transition-all duration-300 px-8 py-3.5 rounded-full font-medium shadow-lg hover:shadow-xl group-hover:scale-105 border border-white/50"
                >
                  {content.lineButton}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* Mobile App option (Coming Soon) */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl shadow-xl hover:shadow-indigo-300/30 hover:shadow-2xl p-6 text-white relative overflow-hidden group"
          >
            {/* Coming Soon badge */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-xs font-medium">
              <Clock className="h-3 w-3" />
              {content.appStatus}
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-indigo-500/0 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tl from-indigo-600/20 to-purple-500/0 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="flex flex-col items-center gap-6 relative z-10">
              {/* Icon with animated glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-purple-300/30 rounded-full blur-xl animate-pulse"></div>
                <div className="bg-gradient-to-br from-purple-300 to-indigo-500 p-5 rounded-full shadow-lg relative">
                  <Smartphone className="w-10 h-10 text-white" />
                </div>
                <div className="absolute top-0 right-0 bg-indigo-300 text-indigo-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                  {isJapanese ? '新機能' : 'New'}
                </div>
              </div>
              
              {/* Text content */}
              <div className="text-center">
                <h4 className="text-2xl font-bold mb-3">{content.appTitle}</h4>
                <p className="text-white/90 mb-6 max-w-xs mx-auto">{content.appDescription}</p>
                <button 
                  disabled
                  className="inline-flex items-center justify-center bg-white/80 text-indigo-500 px-8 py-3.5 rounded-full font-medium shadow-lg cursor-not-allowed opacity-90 group-hover:opacity-100 transition-opacity border border-white/50"
                >
                  {content.appButton}
                  <Clock className="ml-2 h-4 w-4 animate-pulse" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
