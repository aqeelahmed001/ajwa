"use client";

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, cubicBezier } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  DollarSign, 
  Truck, 
  FileText, 
  Globe, 
  Shield, 
  Clock, 
  Users, 
  ArrowRight,
  CheckCircle,
  Building2,
  Warehouse
} from 'lucide-react'
import { useServicesTranslations } from '@/lib/useTranslations'
import { type Locale } from '@/lib/translations'

export default function ServicesPage({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale
  const translations = useServicesTranslations(locale)
  
  const content = {
    title: translations.hero.title,
    subtitle: translations.hero.subtitle,
    
    // Buying Services
    buyingTitle: translations.buyingServices.title,
    buyingSubtitle: translations.buyingServices.subtitle,
    buyingServices: translations.buyingServices.services.map((service, index) => ({
      icon: [<Warehouse className="h-8 w-8 text-primary" />, <Globe className="h-8 w-8 text-primary" />, <Shield className="h-8 w-8 text-primary" />][index],
      title: service.title,
      description: service.description,
      features: service.features || []
    })),

    // Selling Services
    sellingTitle: translations.sellingServices.title,
    sellingSubtitle: translations.sellingServices.subtitle,
    sellingServices: translations.sellingServices.services.map((service, index) => ({
      icon: [<DollarSign className="h-8 w-8 text-parrot-red" />, <Clock className="h-8 w-8 text-parrot-red" />, <FileText className="h-8 w-8 text-parrot-red" />][index],
      title: service.title,
      description: service.description,
      features: service.features || []
    })),

    // Additional Services
    additionalTitle: translations.additionalServices.title,
    additionalServices: translations.additionalServices.services.map((service, index) => ({
      icon: [<Truck className="h-6 w-6 text-primary" />, <Users className="h-6 w-6 text-primary" />, <Building2 className="h-6 w-6 text-primary" />][index],
      title: service.title,
      description: service.description
    })),

    // Process Steps
    processTitle: translations.process.title,
    processSteps: translations.process.steps.map((step, index) => ({
      step: `0${index + 1}`,
      title: step.title,
      description: step.description
    })),

    ctaTitle: translations.cta.title,
    ctaText: translations.cta.text,
    ctaButton: translations.cta.contactButton,
    viewMachinery: translations.cta.viewMachinery
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: cubicBezier(0.23, 1, 0.32, 1) } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section - Updated to match About page */}
      <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background image with centered positioning */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/service.jpg" 
            alt="Our Services" 
            fill 
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
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
                {locale === 'ja' ? 'サービス一覧' : 'OUR SERVICES'}
              </span>
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {content.title}
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl font-medium text-white/90 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {content.subtitle}
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
                {locale === 'ja' ? 'お問い合わせ' : 'Get Started'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container py-12 md:py-16">
        {/* Main Services Tabs - Buying and Selling */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Buying Services Panel */}
            <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold">{content.buyingTitle}</h2>
              </div>
              
              <p className="text-gray-600 mb-6">{content.buyingSubtitle}</p>
              
              <div className="space-y-6">
                {content.buyingServices.map((service, index) => (
                  <motion.div 
                    key={index} 
                    className="border-l-4 border-blue-500 pl-4 py-1"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 text-blue-600 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Buying Process Steps */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Buying Process</h3>
                <div className="flex overflow-x-auto space-x-4 pb-2">
                  {content.processSteps.slice(0, 4).map((step, index) => (
                    <div key={index} className="flex-shrink-0 w-40 text-center">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                        {step.step}
                      </div>
                      <p className="text-sm font-medium">{step.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Selling Services Panel */}
            <div className="p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold">{content.sellingTitle}</h2>
              </div>
              
              <p className="text-gray-600 mb-6">{content.sellingSubtitle}</p>
              
              <div className="space-y-6">
                {content.sellingServices.map((service, index) => (
                  <motion.div 
                    key={index} 
                    className="border-l-4 border-red-500 pl-4 py-1"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 text-red-600 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Selling Process Steps */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Selling Process</h3>
                <div className="flex overflow-x-auto space-x-4 pb-2">
                  {content.processSteps.slice(0, 4).map((step, index) => (
                    <div key={index} className="flex-shrink-0 w-40 text-center">
                      <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                        {step.step}
                      </div>
                      <p className="text-sm font-medium">{step.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Services - Compact Row */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6 text-center">{content.additionalTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.additionalServices.map((service, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-4 rounded-lg border border-gray-100 flex items-start"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  {service.icon}
                </div>
                <div>
                  <h4 className="text-base font-semibold mb-1">{service.title}</h4>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section - Clean, Minimalist Design */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-xl font-bold mb-2">{content.ctaTitle}</h2>
                <p className="text-gray-600 max-w-xl">{content.ctaText}</p>
              </div>
              
              <div className="flex-shrink-0">
                <Link 
                  href={`/${params.lang}/contact`}
                  className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-sm transition-colors"
                >
                  {locale === 'ja' ? 'お問い合わせ' : 'Contact Us'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
} 