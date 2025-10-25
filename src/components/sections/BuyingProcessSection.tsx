"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Calculator, Truck } from 'lucide-react';
import Link from 'next/link';

interface BuyingProcessSectionProps {
  lang: string;
}

export default function BuyingProcessSection({ lang }: BuyingProcessSectionProps) {
  const isJapanese = lang === 'ja';
  
  // Text content based on language
  const content = {
    title: isJapanese ? '簡単3ステップで大切な機械を査定します' : 'Appraise your valuable machinery in 3 easy steps',
    step1Title: isJapanese ? 'お問い合わせ' : 'Contact Us',
    step1Description: isJapanese 
      ? 'WEB・お電話・FAX・LINEのどれでもお気軽にお問合せください。' 
      : 'Feel free to contact us via web, phone, fax, or LINE.',
    step2Title: isJapanese ? '概算査定のご連絡' : 'Estimated Appraisal',
    step2Description: isJapanese 
      ? '頂いた情報をもとに概算の高額査定をご連絡します。' 
      : 'We will provide a high-value estimate based on the information received.',
    step3Title: isJapanese ? '実機確認・買取' : 'Machine Inspection & Purchase',
    step3Description: isJapanese 
      ? '実機確認の上、頂いた機械と不都合なければ即日現金買取させて頂きます。' 
      : 'After inspecting the machine, if there are no issues, we will purchase it with cash on the same day.',
    ctaText: isJapanese ? '買取りに関するQ&Aはこちら' : 'FAQs about our purchasing process',
    webAssessmentTitle: isJapanese ? 'WEBで簡単無料査定' : 'Easy free assessment online',
    webAssessmentDescription: isJapanese 
      ? '機械の情報を入力するだけ。1営業日以内に回答します' 
      : 'Just enter the machine information. We will respond within 1 business day',
    webAssessmentButton: isJapanese ? '無料査定に申し込む' : 'Apply for free assessment',
    lineAssessmentTitle: isJapanese ? 'LINE登録でカンタン査定' : 'Easy assessment via LINE',
    lineAssessmentDescription: isJapanese 
      ? 'まずはともだちに「YMS」を追加！そのボタンをクリック、またはQRコードを読み取ってね' 
      : 'First add "YMS" as a friend! Click the button or scan the QR code',
    lineAssessmentButton: isJapanese ? '友だちに追加' : 'Add as friend'
  };

  // Step data
  const steps = [
    {
      number: 1,
      title: content.step1Title,
      description: content.step1Description,
      icon: <MessageSquare className="w-10 h-10 text-blue-600" />,
      color: 'bg-white',
      accentColor: 'border-l-4 border-orange-500',
      textColor: 'text-gray-800',
      numberBg: 'bg-orange-500'
    },
    {
      number: 2,
      title: content.step2Title,
      description: content.step2Description,
      icon: <Calculator className="w-10 h-10 text-blue-600" />,
      color: 'bg-white',
      accentColor: 'border-l-4 border-blue-500',
      textColor: 'text-gray-800',
      numberBg: 'bg-blue-500'
    },
    {
      number: 3,
      title: content.step3Title,
      description: content.step3Description,
      icon: <Truck className="w-10 h-10 text-blue-600" />,
      color: 'bg-white',
      accentColor: 'border-l-4 border-green-500',
      textColor: 'text-gray-800',
      numberBg: 'bg-green-500'
    }
  ];

  return (
    <section className="py-20 bg-gray-100 overflow-hidden relative">
      {/* Sharp geometric background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-orange-500 to-green-500"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 rotate-12 opacity-10"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500 -rotate-12 opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-3">
            <span className="bg-blue-600 h-1 w-10 block mx-auto mb-2"></span>
            <span className="bg-blue-600 h-1 w-20 block mx-auto"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 tracking-tight">
            {content.title}
          </h2>
        </motion.div>
        
        {/* Process steps */}
        <div className="relative max-w-6xl mx-auto mb-20">
          {/* Connecting line - zigzag for modern look */}
          <div className="absolute top-24 left-0 w-full hidden md:block">
            <svg className="w-full" height="20" viewBox="0 0 1000 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 10H300L350 0L400 20L450 0L500 20L550 0L600 20L650 0L700 20L1000 10" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4"/>
            </svg>
          </div>
          
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative z-10"
              >
                <div className={`${step.color} ${step.accentColor} shadow-xl h-full rounded-none`}>
                  {/* Step number - sharp, modern design */}
                  <div className="absolute -top-5 -right-5">
                    <div className={`w-14 h-14 ${step.numberBg} flex items-center justify-center text-white text-2xl font-bold clip-path-polygon`}>
                      {step.number}
                    </div>
                  </div>
                  
                  <div className="p-8 pt-10">
                    {/* Icon with sharp container */}
                    <div className="mb-6">
                      <div className="inline-flex p-4 bg-blue-50">
                        {step.icon}
                      </div>
                    </div>
                    
                    {/* Content with modern typography */}
                    <h3 className={`text-2xl font-bold mb-4 ${step.textColor} tracking-tight`}>
                      {step.title}
                    </h3>
                    <p className={`${step.textColor} text-sm leading-relaxed`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* CTA button - sharper, more modern design */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mb-20"
        >
          <Link 
            href={`/${lang}/faq`}
            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">{content.ctaText}</span>
            <span className="relative z-10 w-6 h-6 flex items-center justify-center bg-blue-500 group-hover:bg-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-400 transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
          </Link>
        </motion.div>
        
        {/* Assessment options - sharper, more modern design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Web assessment option */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="bg-white border-l-4 border-orange-500 shadow-xl overflow-hidden group relative"
          >
            {/* Accent color top bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
            
            <div className="p-8 relative">
              {/* Sharp geometric decoration */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500 rotate-12 opacity-5"></div>
              
              <div className="flex items-start gap-6">
                {/* Image placeholder with sharp design */}
                <div className="flex-shrink-0 w-20 h-20 bg-orange-500 flex items-center justify-center transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  <span className="text-white font-bold">WEB</span>
                </div>
                
                {/* Content with modern typography */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 tracking-tight">
                    {content.webAssessmentTitle}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {content.webAssessmentDescription}
                  </p>
                  <Link 
                    href={`/${lang}/assessment`}
                    className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 transition-colors group-hover:px-8"
                  >
                    {content.webAssessmentButton}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* LINE assessment option */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="bg-white border-l-4 border-green-500 shadow-xl overflow-hidden group relative"
          >
            {/* Accent color top bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
            
            <div className="p-8 relative">
              {/* Sharp geometric decoration */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500 rotate-12 opacity-5"></div>
              
              <div className="flex items-start gap-6">
                {/* Image placeholder with sharp design */}
                <div className="flex-shrink-0 w-20 h-20 bg-green-500 flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  <span className="text-white font-bold">LINE</span>
                </div>
                
                {/* Content with modern typography */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 tracking-tight">
                    {content.lineAssessmentTitle}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {content.lineAssessmentDescription}
                  </p>
                  <a 
                    href="https://lin.ee/example" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 transition-colors group-hover:px-8"
                  >
                    {content.lineAssessmentButton}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
