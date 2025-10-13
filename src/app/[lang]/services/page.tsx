"use client";

import React from 'react'
import Link from 'next/link'
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
      {/* Hero Section */}
      <section className="relative min-h-[400px] flex items-center justify-center bg-gradient-to-br from-primary/90 via-primary to-parrot-red/80 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10 py-16 md:py-24 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: cubicBezier(0.23, 1, 0.32, 1) }}
          >
            {content.title}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: cubicBezier(0.23, 1, 0.32, 1) }}
          >
            {content.subtitle}
          </motion.p>
        </div>
      </section>

      <div className="container py-16 md:py-24">
        {/* Buying Services */}
        <motion.section 
          className="mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.buyingTitle}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{content.buyingSubtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {content.buyingServices.map((service, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Selling Services */}
        <motion.section 
          className="mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.sellingTitle}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{content.sellingSubtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {content.sellingServices.map((service, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-parrot-red mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Additional Services */}
        <motion.section 
          className="mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.additionalTitle}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {content.additionalServices.map((service, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="mb-3 flex justify-center">{service.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Process Steps */}
        <motion.section 
          className="mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.processTitle}</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {content.processSteps.map((step, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="bg-gradient-to-r from-primary to-parrot-red/90 rounded-2xl p-10 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">{content.ctaTitle}</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">{content.ctaText}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary font-bold hover:bg-white/90" asChild>
                <Link href={`/${params.lang}/contact`}>
                  {content.ctaButton}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href={`/${params.lang}/machinery`}>
                  {content.viewMachinery}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
} 