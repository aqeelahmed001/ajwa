"use client";

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, CheckCircle, Truck, MessageSquare, Globe, Clock, ShieldCheck, Users } from 'lucide-react'

interface CTASectionProps {
  lang: string;
}

export default function CTASection({ lang }: CTASectionProps) {
  const isJapanese = lang === 'ja'
  
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
  
  const cardVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  }
  
  // Text content based on language
  const content = {
    categoryTag: isJapanese ? 'ビジネスソリューション' : 'Business Solutions',
    title: isJapanese ? '国際機械取引の専門家' : 'International Machinery Trading Experts',
    subtitle: isJapanese 
      ? '当社は日本の専門知識とグローバルネットワークを活用し、機械の調達と販売において最適なソリューションを提供します。'
      : 'We leverage Japanese expertise and global networks to provide optimal solutions for machinery acquisition and sales.',
    cards: [
      {
        title: isJapanese ? '機械を購入する' : 'Purchase Machinery',
        description: isJapanese 
          ? '日本製高品質機械の国際調達。厳格な品質管理と効率的な輸出プロセスで、お客様のビジネスニーズに応えます。' 
          : 'International procurement of premium Japanese machinery. We meet your business needs with strict quality control and efficient export processes.',
        features: isJapanese 
          ? ['品質保証付き', '専門家による選定', '効率的な輸出', 'アフターサポート'] 
          : ['Quality guaranteed', 'Expert selection', 'Efficient export', 'After-sales support'],
        icon: <Truck className="h-6 w-6" />,
        btnText: isJapanese ? '機械カタログを見る' : 'View Machinery Catalog',
        href: `/${lang}/machinery`,
        color: 'primary'
      },
      {
        title: isJapanese ? '機械を売却する' : 'Sell Your Machinery',
        description: isJapanese 
          ? '使用済み機械の適正市場価格査定と迅速な買取。透明性のある取引と専門的な評価で最大限の価値を実現します。' 
          : 'Fair market valuation and prompt purchase of used machinery. Maximize value with transparent transactions and professional assessment.',
        features: isJapanese 
          ? ['迅速な現金化', '適正価格評価', '書類手続き代行', '設備撤去サポート'] 
          : ['Quick cash conversion', 'Fair price assessment', 'Documentation handling', 'Removal assistance'],
        icon: <CheckCircle className="h-6 w-6" />,
        btnText: isJapanese ? '売却プロセスを確認' : 'Learn About Selling Process',
        href: `/${lang}/services#selling`,
        color: 'parrot-red'
      }
    ],
    contactTitle: isJapanese ? 'ビジネスニーズについてご相談ください' : 'Discuss Your Business Requirements',
    contactText: isJapanese 
      ? '機械取引に関するご質問や具体的なお問い合わせは、当社の専門コンサルタントが対応いたします。グローバルビジネスにおける最適なソリューションをご提案します。'
      : 'For inquiries about machinery trading or specific requirements, our expert consultants are ready to assist. We offer optimal solutions for your global business needs.',
    contactBtnText: isJapanese ? '専門家に相談する' : 'Consult with Specialists',
    trustBadges: [
      {
        icon: <Clock className="h-5 w-5" />,
        text: isJapanese ? '20年以上の業界経験' : '20+ Years Industry Experience'
      },
      {
        icon: <Globe className="h-5 w-5" />,
        text: isJapanese ? '50カ国以上への輸出実績' : 'Exports to 50+ Countries'
      },
      {
        icon: <ShieldCheck className="h-5 w-5" />,
        text: isJapanese ? '品質保証システム' : 'Quality Assurance System'
      },
      {
        icon: <Users className="h-5 w-5" />,
        text: isJapanese ? '専門家コンサルタントチーム' : 'Expert Consultant Team'
      }
    ]
  }

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-40 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-parrot-red/5 rounded-full blur-3xl"></div>
      </div>
      
      <motion.div 
        className="container relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-flex items-center mb-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {content.categoryTag}
          </span>
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            {content.title}
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground mx-auto max-w-2xl"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
            }}
          >
            {content.subtitle}
          </motion.p>
        </div>
        
        {/* CTA Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {content.cards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
            >
              <Card className="h-full overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors bg-white shadow-sm">
                <CardContent className="p-0">
                  {/* Card header */}
                  <div className={`px-8 pt-8 pb-6 ${
                    card.color === 'primary' 
                      ? 'bg-gradient-to-br from-primary/5 to-primary/10' 
                      : 'bg-gradient-to-br from-parrot-red/5 to-parrot-red/10'
                  }`}>
                    <div 
                      className={`rounded-full p-3 w-fit mb-6 ${
                        card.color === 'primary' 
                          ? 'bg-primary/15' 
                          : 'bg-parrot-red/15'
                      }`}
                    >
                      {React.cloneElement(
                        card.icon, 
                        { 
                          className: `h-6 w-6 ${
                            card.color === 'primary' 
                              ? 'text-primary' 
                              : 'text-parrot-red'
                          }` 
                        }
                      )}
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-semibold">{card.title}</h3>
                  </div>
                  
                  {/* Card body */}
                  <div className="px-8 py-6">
                    <p className="text-muted-foreground mb-6">{card.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {card.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className={`mr-3 ${
                            card.color === 'primary' 
                              ? 'text-primary' 
                              : 'text-parrot-red'
                          }`}>
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      size="lg"
                      className={`w-full ${
                        card.color === 'primary'
                          ? 'bg-primary hover:bg-primary/90' 
                          : 'bg-parrot-red hover:bg-parrot-red/90'
                      } text-white font-medium`} 
                      asChild
                    >
                      <Link href={card.href}>
                        {card.btnText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Contact Section */}
        <motion.div 
          className="rounded-2xl overflow-hidden shadow-lg bg-white border border-slate-200"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
          }}
        >
          <div className="grid lg:grid-cols-5">
            {/* Left content - Image or gradient */}
            <div className="lg:col-span-2 bg-gradient-to-br from-primary to-primary/80 p-8 md:p-10 flex items-center">
              <div className="text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{content.contactTitle}</h3>
                <p className="text-white/80 mb-6">{content.contactText}</p>
                
                {/* Trust badges */}
                <div className="space-y-4 mt-8">
                  {content.trustBadges.map((badge, index) => (
                    <div key={index} className="flex items-center">
                      <div className="mr-3 bg-white/20 rounded-full p-1.5">
                        {React.cloneElement(badge.icon, { className: "h-4 w-4 text-white" })}
                      </div>
                      <span className="text-sm font-medium">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right content - Form or CTA */}
            <div className="lg:col-span-3 p-8 md:p-10 flex flex-col justify-center">
              <div className="max-w-lg">
                <h4 className="text-xl md:text-2xl font-bold mb-2">
                  {isJapanese ? '専門家にお問い合わせ' : 'Connect with Our Specialists'}
                </h4>
                <p className="text-muted-foreground mb-6">
                  {isJapanese 
                    ? '機械の調達や売却に関する詳細情報、お見積もり、またはカスタムソリューションについて、専門家がご案内します。'
                    : 'Get detailed information about machinery procurement or sales, quotations, or customized solutions from our experts.'}
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link href={`/${lang}/machinery`}>
                      {isJapanese ? '機械カタログ' : 'Machinery Catalog'}
                    </Link>
                  </Button>
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-medium" asChild>
                    <Link href={`/${lang}/contact`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {content.contactBtnText}
                    </Link>
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {isJapanese 
                    ? '通常24時間以内に専門スタッフからご連絡いたします。緊急の場合は、お電話でもご相談いただけます。'
                    : 'Our expert staff will typically contact you within 24 hours. For urgent matters, phone consultations are also available.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
} 