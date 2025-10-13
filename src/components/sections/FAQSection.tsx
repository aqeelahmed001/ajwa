"use client";

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { MessageSquare, Plus, Minus } from 'lucide-react'

interface FAQSectionProps {
  lang: string;
}

export default function FAQSection({ lang }: FAQSectionProps) {
  const isJapanese = lang === 'ja'
  
  // FAQ items based on language
  const faqItems = isJapanese 
    ? [
        { 
          question: '海外への機械輸出はどのように行われますか？', 
          answer: '当社は国際的な輸出手続きの専門知識を持っています。機械の選定から、書類作成、通関、輸送まで、すべてのプロセスをサポートします。特定の国の要件や規制に合わせたソリューションを提供しています。' 
        },
        { 
          question: '日本の中古機械を売却するにはどうすればよいですか？', 
          answer: 'お持ちの機械の詳細（メーカー、型番、年式、状態など）を当社にご連絡ください。無料で査定を行い、適正価格で買取いたします。早ければ査定から48時間以内に現金化可能です。' 
        },
        { 
          question: '機械の品質保証はありますか？', 
          answer: '当社が販売するすべての機械には品質保証が付いています。販売前に専門技術者による厳格な検査を実施し、必要な修理・メンテナンスを行っています。詳細な保証内容は各機械によって異なりますので、お問い合わせください。' 
        },
        { 
          question: '輸出可能な国や地域はどこですか？', 
          answer: '当社は世界中のほとんどの国や地域への輸出実績があります。特定の国への輸出に関する規制や制限がある場合もございますので、具体的な国についてはお問い合わせください。' 
        },
        { 
          question: '支払い方法や条件について教えてください。', 
          answer: '銀行振込、信用状（L/C）などの一般的な国際取引の支払い方法に対応しています。条件は取引内容や国によって異なる場合がありますので、個別にご相談ください。' 
        }
      ]
    : [
        { 
          question: 'How does machinery export to overseas countries work?', 
          answer: 'We have expertise in international export procedures. We support all processes from machinery selection, documentation, customs clearance, to transportation. We provide solutions tailored to specific country requirements and regulations.' 
        },
        { 
          question: 'How can I sell used machinery in Japan?', 
          answer: 'Please contact us with details of your machinery (manufacturer, model, year, condition, etc.). We will provide a free valuation and purchase at a fair price. Cash conversion is possible within 48 hours of appraisal in some cases.' 
        },
        { 
          question: 'Is there a quality guarantee for machinery?', 
          answer: 'All machinery sold by us comes with a quality guarantee. We conduct rigorous inspections by technical specialists before sale and perform necessary repairs and maintenance. Detailed warranty terms vary by machine, so please inquire for specifics.' 
        },
        { 
          question: 'Which countries or regions can you export to?', 
          answer: 'We have experience exporting to most countries and regions worldwide. There may be regulations or restrictions for exports to specific countries, so please inquire about particular destinations.' 
        },
        { 
          question: 'What are the payment methods and terms?', 
          answer: 'We accommodate common international transaction payment methods such as bank transfer, letter of credit (L/C), etc. Terms may vary depending on the transaction details and country, so please consult with us individually.' 
        }
      ]
  
  // Text content based on language
  const content = {
    title: isJapanese ? '専門家によるよくある質問' : 'Expert Answers to Common Questions',
    subtitle: isJapanese 
      ? '国際機械取引における重要なポイントについて、当社の専門家が回答します。さらに詳しい情報が必要な場合は、専門チームにお問い合わせください。'
      : 'Our experts address key points about international machinery trading. Contact our specialized team for more detailed information.',
    contactText: isJapanese ? '個別のご質問がありますか？' : 'Have a specific question?',
    contactBtnText: isJapanese ? '専門家に相談する' : 'Consult Our Experts',
    categoryTitle: isJapanese ? 'よくある質問' : 'Frequently Asked Questions'
  }
  
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  }
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  // Custom accordion trigger with plus/minus icons
  const CustomAccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionTrigger>,
    React.ComponentPropsWithoutRef<typeof AccordionTrigger>
  >(({ children, className, ...props }, ref) => (
    <AccordionTrigger
      ref={ref}
      className={`group flex flex-1 items-center justify-between py-6 px-5 text-left hover:bg-muted/10 transition-colors rounded-lg ${className}`}
      {...props}
    >
      <div className="font-medium text-base md:text-lg pr-4">{children}</div>
      <div className="shrink-0 rounded-full border border-slate-200 h-8 w-8 flex items-center justify-center">
        <Plus className="h-4 w-4 text-parrot-red group-data-[state=open]:hidden" />
        <Minus className="h-4 w-4 text-parrot-red hidden group-data-[state=open]:block" />
      </div>
    </AccordionTrigger>
  ));
  CustomAccordionTrigger.displayName = "CustomAccordionTrigger";
  
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-20 left-5 w-64 h-64 rounded-full bg-parrot-red/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl"></div>
      </div>
      
      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left column - Section header */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="mb-8 lg:mb-0">
              <div className="inline-flex items-center mb-3 px-3 py-1 rounded-full bg-parrot-red/10 text-parrot-red text-sm font-medium">
                {content.categoryTitle}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
                {content.title}
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                {content.subtitle}
              </p>

              {/* Contact card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-parrot-red/10 rounded-full flex items-center justify-center mr-4">
                    <MessageSquare className="h-5 w-5 text-parrot-red" />
                  </div>
                  <h3 className="font-semibold text-xl">{content.contactText}</h3>
                </div>
                <p className="text-muted-foreground mb-5">
                  {isJapanese 
                    ? '機械取引に関する専門的なアドバイスが必要な場合は、当社の専門家チームにご相談ください。'
                    : 'For specialized advice on machinery trading, consult with our expert team.'}
                </p>
                <Button size="lg" className="w-full bg-parrot-red hover:bg-parrot-red/90 text-white font-medium" asChild>
                  <Link href={`/${lang}/contact`}>
                    {content.contactBtnText}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right column - FAQ Accordion */}
          <motion.div 
            className="lg:col-span-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <AccordionItem 
                    value={`item-${index}`} 
                    className="bg-white border border-slate-200 rounded-xl mb-5 overflow-hidden shadow-sm"
                  >
                    <CustomAccordionTrigger>
                      {item.question}
                    </CustomAccordionTrigger>
                    <AccordionContent className="px-5 pb-6 pt-0 text-base text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
            
            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="text-sm text-muted-foreground">
                    {isJapanese ? '業界で15年以上の実績' : 'Over 15 years of industry expertise'}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-muted-foreground">
                    {isJapanese ? '50カ国以上への輸出実績' : 'Exports to over 50 countries'}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-muted-foreground">
                    {isJapanese ? '24時間サポート' : '24/7 Customer Support'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 