"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import FAQSection from '@/components/sections/FAQSection';

export default function FAQPage({ params }: { params: { lang: string } }) {
  const isJapanese = params.lang === 'ja';
  
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background image with stronger overlay for better text visibility */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/FAQ.jpg" 
            alt="Frequently Asked Questions" 
            fill 
            className="object-cover object-center"
            priority
          />
          {/* Darker overlay with gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/80"></div>
          {/* Additional text shadow container */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="container relative z-10 py-16 md:py-24 text-center">
          {/* Main content */}
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Small badge */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-1 rounded-full text-sm font-medium">
                {isJapanese ? 'よくある質問' : 'FAQ'}
              </span>
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {isJapanese ? 'よくある質問' : 'Frequently Asked Questions'}
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl font-medium text-white/90 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {isJapanese 
                ? '機械取引に関するよくある質問と回答をご紹介します' 
                : 'Find answers to common questions about machinery trading'}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link 
                href={`/${params.lang}/contact`}
                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-sm transition-colors"
              >
                {isJapanese ? 'お問い合わせ' : 'Contact Us'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Custom FAQ Section with more questions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 text-sm font-medium rounded-full mb-3">
              {isJapanese ? 'よくある質問' : 'FREQUENTLY ASKED QUESTIONS'}
            </span>
            <h2 className="text-3xl font-bold mb-4">
              {isJapanese ? '機械取引に関するよくある質問' : 'Common Questions About Machinery Trading'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {isJapanese 
                ? '国際機械取引における重要なポイントについて、当社の専門家が回答します。' 
                : 'Our experts address key points about international machinery trading.'}
            </p>
          </div>
          
          {/* Two-column FAQ layout for more questions */}
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
            {/* Left Column */}
            <div>
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">
                  {isJapanese ? '輸出に関する質問' : 'Export Questions'}
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">
                      {isJapanese ? '海外への機械輸出はどのように行われますか？' : 'How does machinery export to overseas countries work?'}
                    </h4>
                    <p className="text-gray-600">
                      {isJapanese 
                        ? '当社は国際的な輸出手続きの専門知識を持っています。機械の選定から、書類作成、通関、輸送まで、すべてのプロセスをサポートします。特定の国の要件や規制に合わせたソリューションを提供しています。' 
                        : 'We have expertise in international export procedures. We support all processes from machinery selection, documentation, customs clearance, to transportation. We provide solutions tailored to specific country requirements and regulations.'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">
                      {isJapanese ? '輸出可能な国や地域はどこですか？' : 'Which countries or regions can you export to?'}
                    </h4>
                    <p className="text-gray-600">
                      {isJapanese 
                        ? '当社は世界中のほとんどの国や地域への輸出実績があります。特定の国への輸出に関する規制や制限がある場合もございますので、具体的な国についてはお問い合わせください。' 
                        : 'We have experience exporting to most countries and regions worldwide. There may be regulations or restrictions for exports to specific countries, so please inquire about particular destinations.'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">
                      {isJapanese ? '輸出にかかる時間はどのくらいですか？' : 'How long does the export process take?'}
                    </h4>
                    <p className="text-gray-600">
                      {isJapanese 
                        ? '輸出先の国や地域、機械の種類、輸送方法によって異なりますが、一般的には契約締結から2〜6週間程度です。特急対応も可能ですので、お急ぎの場合はご相談ください。' 
                        : 'It varies depending on the destination country/region, type of machinery, and shipping method, but typically takes about 2-6 weeks from contract signing. Express handling is also available, so please consult with us if you are in a hurry.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">
                  {isJapanese ? '品質と保証に関する質問' : 'Quality & Warranty Questions'}
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">
                      {isJapanese ? '機械の品質保証はありますか？' : 'Is there a quality guarantee for machinery?'}
                    </h4>
                    <p className="text-gray-600">
                      {isJapanese 
                        ? '当社が販売するすべての機械には品質保証が付いています。販売前に専門技術者による厳格な検査を実施し、必要な修理・メンテナンスを行っています。詳細な保証内容は各機械によって異なりますので、お問い合わせください。' 
                        : 'All machinery sold by us comes with a quality guarantee. We conduct rigorous inspections by technical specialists before sale and perform necessary repairs and maintenance. Detailed warranty terms vary by machine, so please inquire for specifics.'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">
                      {isJapanese ? '故障した場合のサポートはありますか？' : 'Is there support available if the machinery breaks down?'}
                    </h4>
                    <p className="text-gray-600">
                      {isJapanese 
                        ? '当社では、購入後のアフターサポートも提供しています。故障や問題が発生した場合は、技術サポートチームが対応いたします。遠隔地でも、現地の提携サービスセンターを通じてサポートを受けることが可能です。' 
                        : 'We provide after-sales support for purchased machinery. In case of breakdowns or issues, our technical support team will assist you. Even in remote locations, support can be received through local affiliated service centers.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">
                  {isJapanese ? '買取に関する質問' : 'Purchase Questions'}
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">
                      {isJapanese ? '日本の中古機械を売却するにはどうすればよいですか？' : 'How can I sell used machinery in Japan?'}
                    </h4>
                    <p className="text-gray-600">
                      {isJapanese 
                        ? 'お持ちの機械の詳細（メーカー、型番、年式、状態など）を当社にご連絡ください。無料で査定を行い、適正価格で買取いたします。早ければ査定から48時間以内に現金化可能です。' 
                        : 'Please contact us with details of your machinery (manufacturer, model, year, condition, etc.). We will provide a free valuation and purchase at a fair price. Cash conversion is possible within 48 hours of appraisal in some cases.'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">
                      {isJapanese ? '買取価格はどのように決まりますか？' : 'How is the purchase price determined?'}
                    </h4>
                    <p className="text-gray-600">
                      {isJapanese 
                        ? '買取価格は機械の種類、メーカー、年式、状態、市場需要などを総合的に判断して決定します。当社は国際市場に精通しているため、適正かつ競争力のある価格を提示することが可能です。' 
                        : 'The purchase price is determined by comprehensively evaluating the type of machinery, manufacturer, year, condition, market demand, etc. We are familiar with the international market, allowing us to offer fair and competitive prices.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">
                  {isJapanese ? '支払いと手続きに関する質問' : 'Payment & Procedures Questions'}
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">
                      {isJapanese ? '支払い方法や条件について教えてください。' : 'What are the payment methods and terms?'}
                    </h4>
                    <p className="text-gray-600">
                      {isJapanese 
                        ? '銀行振込、信用状（L/C）などの一般的な国際取引の支払い方法に対応しています。条件は取引内容や国によって異なる場合がありますので、個別にご相談ください。' 
                        : 'We accommodate common international transaction payment methods such as bank transfer, letter of credit (L/C), etc. Terms may vary depending on the transaction details and country, so please consult with us individually.'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">
                      {isJapanese ? '必要な書類や手続きは何ですか？' : 'What documents and procedures are required?'}
                    </h4>
                    <p className="text-gray-600">
                      {isJapanese 
                        ? '輸出入に必要な書類は、インボイス、パッキングリスト、原産地証明書、検査証明書などです。当社がすべての書類作成と手続きをサポートしますので、ご安心ください。' 
                        : 'Documents required for import/export include invoices, packing lists, certificates of origin, inspection certificates, etc. We will support all documentation and procedures, so please rest assured.'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">
                      {isJapanese ? '輸送中の保険はどうなっていますか？' : 'How is insurance handled during transportation?'}
                    </h4>
                    <p className="text-gray-600">
                      {isJapanese 
                        ? '当社では輸送中の機械に対して包括的な保険をかけています。万が一の損傷や紛失に備え、機械の価値の100%をカバーする保険を提供しています。' 
                        : 'We provide comprehensive insurance for machinery during transportation. We offer insurance that covers 100% of the machinery\'s value in case of damage or loss.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="bg-blue-50 rounded-lg p-8 border border-blue-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-xl font-bold mb-2">
                  {isJapanese ? '他にご質問がありますか？' : 'Have more questions?'}
                </h3>
                <p className="text-gray-700">
                  {isJapanese 
                    ? '当社の専門家チームがお客様の質問にお答えします。お気軽にお問い合わせください。' 
                    : 'Our team of experts is ready to answer your questions. Feel free to reach out to us.'}
                </p>
              </div>
              <div>
                <Link 
                  href={`/${params.lang}/contact`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                  {isJapanese ? 'お問い合わせ' : 'Contact Us'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
