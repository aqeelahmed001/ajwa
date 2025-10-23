"use client";

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Building2, Globe, Users, Award, ArrowRight, Target, Handshake, ShieldCheck, TrendingUp, 
  Phone, Mail, MapPin, ChevronRight, Clock, Briefcase, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, cubicBezier } from 'framer-motion'
import { Separator } from '@/components/ui/separator'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: cubicBezier(0.23, 1, 0.32, 1) } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: cubicBezier(0.23, 1, 0.32, 1) } },
}

export default function AboutPage({ params }: { params: { lang: string } }) {
  const isJapanese = params.lang === 'ja'
  const content = {
    // Hero section
    heroTitle: isJapanese ? '会社概要' : 'About Ajwa Trading',
    heroSubtitle: isJapanese
      ? 'グローバル機械取引のリーディングカンパニー'
      : 'Leading Global Machinery Trading Company',
    heroDescription: isJapanese
      ? 'アジュワトレーディングリミテッドは、日本を拠点に世界中へ高品質な機械を輸出・輸入する専門商社です。信頼と実績を基盤に、お客様のビジネスをサポートします。'
      : 'Ajwa Co.,LTD is a Japan-based specialist in exporting and importing high-quality machinery worldwide. We support your business with trust and proven expertise.',
    
    // Company profile
    profileTitle: isJapanese ? '企業プロフィール' : 'Company Profile',
    profileDescription: isJapanese
      ? '2002年の設立以来、アジュワトレーディングは日本と世界をつなぐ機械取引の架け橋として成長してきました。私たちは、高品質な産業機械の輸出入を専門とし、お客様のビジネス成功に貢献しています。'
      : 'Since our establishment in 2002, Ajwa Trading has grown to become a bridge connecting Japan and the world in machinery trading. We specialize in the export and import of high-quality industrial machinery, contributing to our clients\'s business success.',
    companyInfo: [
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
    ],
    
    // Vision & Mission
    visionTitle: isJapanese ? 'ビジョン' : 'Our Vision',
    vision: isJapanese
      ? 'グローバルな産業発展を促進し、世界中の企業に価値ある機械ソリューションを提供する、最も信頼されるパートナーになること。'
      : 'To become the most trusted partner in promoting global industrial development by providing valuable machinery solutions to businesses worldwide.',
    missionTitle: isJapanese ? 'ミッション' : 'Our Mission',
    mission: isJapanese
      ? '世界中の産業発展に貢献するため、日本の優れた機械をグローバルに提供し、信頼できるパートナーとしてお客様の成長を支援します。'
      : 'To contribute to global industrial progress by delivering superior Japanese machinery worldwide and supporting our clients\'s growth as a trusted partner.',
    
    // Key facts
    factsTitle: isJapanese ? '会社の特徴' : 'Key Facts',
    facts: [
      {
        icon: <Award className="h-8 w-8 text-primary" />, 
        label: isJapanese ? '20年以上の業界経験' : '20+ Years Experience',
        description: isJapanese ? '長年の経験に基づく専門知識と実績' : 'Expertise and track record based on years of experience'
      },
      {
        icon: <Globe className="h-8 w-8 text-primary" />, 
        label: isJapanese ? '50カ国以上への輸出実績' : '10+ Export Countries',
        description: isJapanese ? 'グローバルなネットワークと輸出ノウハウ' : 'Global network and export expertise'
      },
      {
        icon: <Building2 className="h-8 w-8 text-primary" />, 
        label: isJapanese ? '日本全国の仕入れネットワーク' : 'Nationwide Network',
        description: isJapanese ? '日本全国からの優良機械の調達能力' : 'Ability to source quality machinery from across Japan'
      },
      {
        icon: <Users className="h-8 w-8 text-primary" />, 
        label: isJapanese ? '多言語対応の専門チーム' : 'Multilingual Team',
        description: isJapanese ? '言語の壁を越えたスムーズな取引' : 'Smooth transactions beyond language barriers'
      },
    ],
    
    // Values
    valuesTitle: isJapanese ? '私たちの価値観' : 'Our Core Values',
    values: [
      {
        icon: <Handshake className="h-6 w-6 text-white" />,
        label: isJapanese ? '信頼と誠実な取引' : 'Trust & Integrity',
        description: isJapanese ? '誠実さと透明性を重視した取引' : 'Transactions based on honesty and transparency'
      },
      {
        icon: <Target className="h-6 w-6 text-white" />,
        label: isJapanese ? 'お客様第一主義' : 'Customer-First',
        description: isJapanese ? 'お客様のニーズを最優先に考える' : 'Prioritizing customer needs above all else'
      },
      {
        icon: <ShieldCheck className="h-6 w-6 text-white" />,
        label: isJapanese ? '品質へのこだわり' : 'Quality Commitment',
        description: isJapanese ? '最高品質の機械のみを取り扱う' : 'Dealing only with the highest quality machinery'
      },
      {
        icon: <Globe className="h-6 w-6 text-white" />,
        label: isJapanese ? 'グローバルな視点' : 'Global Perspective',
        description: isJapanese ? '国際的な視野での事業展開' : 'Business development with an international outlook'
      },
      {
        icon: <TrendingUp className="h-6 w-6 text-white" />,
        label: isJapanese ? '持続可能な成長' : 'Sustainable Growth',
        description: isJapanese ? '長期的な視点での持続可能なビジネス' : 'Sustainable business with a long-term perspective'
      },
    ],
    
    // Team
    teamTitle: isJapanese ? 'リーダーシップチーム' : 'Our Leadership Team',
    teamSubtitle: isJapanese 
      ? '経験豊富な専門家による強力なリーダーシップ' 
      : 'Strong leadership by experienced professionals',
    team: [
      {
        name: 'Mohammed Al-Harbi',
        position: isJapanese ? '代表取締役社長' : 'Chief Executive Officer',
        bio: isJapanese 
          ? '20年以上の機械取引経験を持ち、アジュワトレーディングの創設者。グローバルなビジネス展開と戦略的パートナーシップの構築に貢献。' 
          : 'Founder of Ajwa Trading with over 20 years of machinery trading experience. Contributes to global business development and building strategic partnerships.'
      },
      {
        name: 'Tanaka Hiroshi',
        position: isJapanese ? '最高執行責任者' : 'Chief Operating Officer',
        bio: isJapanese 
          ? '日本の製造業での15年の経験を活かし、効率的な業務運営と品質管理を担当。' 
          : 'Leverages 15 years of experience in Japanese manufacturing to oversee efficient operations and quality control.'
      },
      {
        name: 'Sarah Johnson',
        position: isJapanese ? '国際営業部長' : 'International Sales Director',
        bio: isJapanese 
          ? '多言語に堪能で、グローバルな顧客関係の構築と維持に貢献。' 
          : 'Multilingual professional who contributes to building and maintaining global customer relationships.'
      }
    ],
    
    // History
    historyTitle: isJapanese ? '会社の歩み' : 'Our Journey',
    historySubtitle: isJapanese ? '20年以上にわたる成長と進化の歴史' : 'Over two decades of growth and evolution',
    history: [
      { 
        year: '2002', 
        title: isJapanese ? '創業' : 'Foundation', 
        event: isJapanese ? 'アジュワトレーディング設立。日本国内での中古機械取引からスタート。' : 'Ajwa Trading Limited founded. Started with used machinery trading within Japan.'
      },
      { 
        year: '2005', 
        title: isJapanese ? '国際展開' : 'International Expansion', 
        event: isJapanese ? '初の海外輸出を達成。アジア市場への輸出を開始。' : 'First international export achieved. Started exporting to Asian markets.'
      },
      { 
        year: '2012', 
        title: isJapanese ? '事業拡大' : 'Business Growth', 
        event: isJapanese ? '年間輸出台数1000台突破。中東・ヨーロッパ市場への展開。' : 'Surpassed 1,000 annual exports. Expanded to Middle Eastern and European markets.'
      },
      { 
        year: '2020', 
        title: isJapanese ? 'グローバル展開' : 'Global Reach', 
        event: isJapanese ? '50カ国以上への輸出実績を達成。デジタルプラットフォームの強化。' : 'Achieved exports to over 50 countries. Enhanced digital platform capabilities.'
      },
      { 
        year: '2024', 
        title: isJapanese ? '新たな挑戦' : 'New Horizons', 
        event: isJapanese ? 'グローバルパートナーシップの拡大と持続可能な取引モデルの構築。' : 'Expanded global partnerships and established sustainable trading models.'
      },
    ],
    
    // Contact CTA
    contactTitle: isJapanese ? 'お問い合わせ' : 'Get in Touch',
    contactDescription: isJapanese
      ? 'アジュワトレーディングは、お客様のビジネスニーズに合わせたソリューションを提供します。お気軽にご相談ください。'
      : 'Ajwa Co LTD provides solutions tailored to your business needs. Feel free to reach out to us.',
    contactInfo: [
      {
        icon: <Phone className="h-5 w-5" />,
        label: isJapanese ? '電話番号' : 'Phone',
        value: '+81-3-1234-5678'
      },
      {
        icon: <Mail className="h-5 w-5" />,
        label: isJapanese ? 'メール' : 'Email',
        value: 'info@ajwaco.com'
      },
      {
        icon: <MapPin className="h-5 w-5" />,
        label: isJapanese ? '所在地' : 'Location',
        value: isJapanese ? '東京都港区赤坂1-2-3 アジュワビル5F' : 'Ajwa Building 5F, 1-2-3 Akasaka, Minato-ku, Tokyo, Japan'
      }
    ],
    
    // CTAs
    ctaConsultation: isJapanese ? '無料相談を予約する' : 'Schedule a Free Consultation',
    ctaCatalog: isJapanese ? '機械カタログを見る' : 'View Machinery Catalog',
    ctaContact: isJapanese ? 'お問い合わせ' : 'Contact Us',
    ctaServices: isJapanese ? 'サービス詳細' : 'Our Services',
    
    // Bottom CTA
    bottomCtaTitle: isJapanese ? 'ビジネスパートナーをお探しですか？' : 'Looking for a Reliable Business Partner?',
    bottomCtaText: isJapanese
      ? 'アジュワトレーディングは、信頼できる機械取引のパートナーとして、世界中のお客様をサポートします。ご相談・ご質問はお気軽にお問い合わせください。'
      : 'Ajwa Trading is your trusted partner for machinery trading worldwide. Contact us for consultation or any questions about our services.',
    bottomCtaButton: isJapanese ? '今すぐ相談する' : 'Get Started Now',
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Banner */}
      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center bg-gradient-to-br from-primary/90 via-primary to-parrot-red/80 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
        <div className="container relative z-10 py-16 md:py-24 text-center">
          <motion.span 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {isJapanese ? '2002年設立' : 'Est. 2002'}
          </motion.span>
          
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {content.heroTitle}
          </motion.h1>
          
          <motion.h2
            className="text-xl md:text-2xl font-medium text-white/90 mb-8 drop-shadow max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          >
            {content.heroSubtitle}
          </motion.h2>
          
          <motion.p
            className="text-base md:text-lg text-white/80 max-w-2xl mx-auto drop-shadow mb-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            {content.heroDescription}
          </motion.p>
          
          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-medium" asChild>
              <Link href={`/${params.lang}/contact`}>
                {content.ctaConsultation}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
              <Link href={`/${params.lang}/machinery`}>
                {content.ctaCatalog}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Company Profile Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto mb-16 text-center"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">{content.profileTitle}</h2>
            <p className="text-lg text-slate-600">{content.profileDescription}</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Company Info */}
            <motion.div 
              className="bg-slate-50 rounded-xl p-8 shadow-md border border-slate-100"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-6 text-primary border-b border-slate-200 pb-2">
                {isJapanese ? '会社情報' : 'Company Information'}
              </h3>
              
              <div className="space-y-4">
                {content.companyInfo.map((item, idx) => (
                  <div key={idx} className="flex border-b border-slate-100 pb-3 last:border-0">
                    <div className="w-1/3 font-medium text-slate-700">{item.label}</div>
                    <div className="w-2/3 text-slate-600">{item.value}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/5" asChild>
                  <Link href={`/${params.lang}/contact`}>
                    {isJapanese ? 'お問い合わせ' : 'Contact Us'}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            {/* Vision & Mission */}
            <motion.div 
              className="space-y-8"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* Vision */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-8 border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                
                <h3 className="text-xl font-semibold mb-3 text-primary flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  {content.visionTitle}
                </h3>
                
                <p className="text-slate-700 relative z-10">{content.vision}</p>
              </div>
              
              {/* Mission */}
              <div className="bg-gradient-to-br from-parrot-red/5 to-parrot-red/10 rounded-xl p-8 border border-parrot-red/10 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-parrot-red/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <h3 className="text-xl font-semibold mb-3 text-parrot-red flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  {content.missionTitle}
                </h3>
                
                <p className="text-slate-700 relative z-10">{content.mission}</p>
              </div>
              
              <div className="text-center">
                <Button variant="link" className="text-primary hover:text-primary/80" asChild>
                  <Link href={`/${params.lang}/services`}>
                    {content.ctaServices}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Facts Section */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">{content.factsTitle}</h2>
            <p className="text-lg text-slate-600">
              {isJapanese 
                ? '20年以上の実績と経験に基づく、アジュワトレーディングの強み'
                : 'Ajwa Co LTD strengths based on over 20 years of experience and achievements'}
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.facts.map((fact, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 shadow-md p-8 flex flex-col items-center text-center h-full"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
              >
                <div className="bg-primary/10 rounded-full p-4 mb-5">
                  {fact.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{fact.label}</h3>
                <p className="text-slate-600 text-sm">{fact.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-12 text-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Button className="bg-primary hover:bg-primary/90" size="lg" asChild>
              <Link href={`/${params.lang}/machinery`}>
                {content.ctaCatalog}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-parrot-red text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{content.valuesTitle}</h2>
            <p className="text-lg text-white/80">
              {isJapanese 
                ? '私たちの事業活動の根底にある価値観と信念'
                : 'The values and beliefs that underpin our business activities'}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {content.values.map((value, idx) => (
              <motion.div
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center text-center border border-white/20 h-full"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}
              >
                <div className="bg-primary rounded-full p-3 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{value.label}</h3>
                <p className="text-white/80 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">{content.historyTitle}</h2>
            <p className="text-lg text-slate-600">{content.historySubtitle}</p>
          </motion.div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-1 bg-primary/20 md:-translate-x-1/2" />
            
            <div className="space-y-12">
              {content.history.map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`flex flex-col md:flex-row gap-6 md:gap-10 relative ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {/* Year marker */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold border-4 border-white shadow-md z-10">
                      <Clock className="h-4 w-4" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6 h-full hover:shadow-lg transition-shadow">
                      <div className="text-primary font-bold text-lg mb-1">{item.year}</div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-2">{item.title}</h3>
                      <p className="text-slate-600">{item.event}</p>
                    </div>
                  </div>
                  
                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">{content.teamTitle}</h2>
            <p className="text-lg text-slate-600">{content.teamSubtitle}</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {content.team.map((member, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-200"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
              >
                <div className="h-48 bg-gradient-to-br from-primary/10 to-parrot-red/10 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                    <Users className="h-12 w-12" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-1">{member.name}</h3>
                  <div className="text-primary font-medium text-sm mb-4">{member.position}</div>
                  <p className="text-slate-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-parrot-red/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{content.bottomCtaTitle}</h2>
            <p className="text-white/90 mb-8 text-lg">{content.bottomCtaText}</p>
            <Button size="lg" className="bg-white text-primary font-bold hover:bg-white/90 px-8" asChild>
              <Link href={`/${params.lang}/contact`}>
                {content.bottomCtaButton}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 