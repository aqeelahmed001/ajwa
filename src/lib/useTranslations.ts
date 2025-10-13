"use client";

import { useMemo } from 'react'
import { getTranslations, type Locale } from './translations'

export interface ServiceItem {
  title: string
  description: string
  features?: string[]
}

export interface ProcessStep {
  title: string
  description: string
}

export function useServicesTranslations(locale: Locale) {
  return useMemo(() => {
    const translations = getTranslations(locale, 'services')
    
    return {
      hero: {
        title: translations.hero?.title || 'Our Services',
        subtitle: translations.hero?.subtitle || 'Ajwa Trading provides comprehensive solutions from machinery procurement to sales and export/import procedures.'
      },
      buyingServices: {
        title: translations.buyingServices?.title || 'Machinery Purchase Services',
        subtitle: translations.buyingServices?.subtitle || 'We provide high-quality Japanese machinery to customers worldwide.',
        services: (translations.buyingServices?.services || []) as ServiceItem[]
      },
      sellingServices: {
        title: translations.sellingServices?.title || 'Machinery Selling Services',
        subtitle: translations.sellingServices?.subtitle || 'We offer fair price purchasing of used machinery and quick cash conversion.',
        services: (translations.sellingServices?.services || []) as ServiceItem[]
      },
      additionalServices: {
        title: translations.additionalServices?.title || 'Additional Services',
        services: (translations.additionalServices?.services || []) as ServiceItem[]
      },
      process: {
        title: translations.process?.title || 'Service Process',
        steps: (translations.process?.steps || []) as ProcessStep[]
      },
      cta: {
        title: translations.cta?.title || 'Want to Learn More About Our Services?',
        text: translations.cta?.text || 'Our specialists will propose optimal solutions tailored to your needs.',
        contactButton: translations.cta?.contactButton || 'Contact Us',
        viewMachinery: translations.cta?.viewMachinery || 'View Machinery'
      }
    }
  }, [locale])
}

export function useHomeTranslations(locale: Locale) {
  return useMemo(() => {
    const translations = getTranslations(locale, 'home')
    
    return {
      hero: {
        title: translations.hero?.title || 'We Buy & Sell Machinery',
        subtitle: translations.hero?.subtitle || 'Leading Japan-based machinery export and import company with global reach',
        description: translations.hero?.description || 'Ajwa Trading Limited specializes in buying used machinery from Japanese customers and selling high-quality Japanese machinery worldwide.',
        ctaPrimary: translations.hero?.ctaPrimary || 'View Machinery',
        ctaSecondary: translations.hero?.ctaSecondary || 'Learn More'
      },
      sections: {
        cta: {
          title: translations.sections?.cta?.title || 'Ready to Trade Machinery?',
          subtitle: translations.sections?.cta?.subtitle || 'Get in touch with our experts for personalized solutions',
          description: translations.sections?.cta?.description || 'Whether you\'re looking to buy quality Japanese machinery or sell your used equipment, we\'re here to help with professional service and competitive pricing.',
          contactInfo: {
            title: translations.sections?.cta?.contactInfo?.title || 'Contact Information',
            phone: translations.sections?.cta?.contactInfo?.phone || '+81-3-1234-5678',
            email: translations.sections?.cta?.contactInfo?.email || 'info@ajwatrading.com',
            address: translations.sections?.cta?.contactInfo?.address || 'Tokyo, Japan'
          },
          trustBadges: {
            title: translations.sections?.cta?.trustBadges?.title || 'Why Choose Us',
            items: translations.sections?.cta?.trustBadges?.items || ['20+ Years Experience', 'Global Network', 'Quality Guaranteed', 'Fast Service']
          }
        },
        faq: {
          title: translations.sections?.faq?.title || 'Frequently Asked Questions',
          subtitle: translations.sections?.faq?.subtitle || 'Everything you need to know about our services',
          items: translations.sections?.faq?.items || []
        }
      }
    }
  }, [locale])
}

export function useAboutTranslations(locale: Locale) {
  return useMemo(() => {
    const translations = getTranslations(locale, 'about')
    
    return {
      hero: {
        title: translations.hero?.title || 'About Ajwa Trading Limited',
        subtitle: translations.hero?.subtitle || 'Your Trusted Partner in Global Machinery Trade'
      },
      mission: {
        title: translations.mission?.title || 'Our Mission',
        description: translations.mission?.description || 'To bridge the gap between Japanese machinery suppliers and global buyers, while providing fair and transparent services for those looking to sell their used equipment.',
        vision: translations.mission?.vision || 'To become the leading machinery trading company connecting Japan with the world.'
      },
      keyFacts: {
        title: translations.keyFacts?.title || 'Key Facts',
        facts: translations.keyFacts?.facts || []
      },
      values: {
        title: translations.values?.title || 'Our Values',
        values: translations.values?.values || []
      },
      timeline: {
        title: translations.timeline?.title || 'Our Journey',
        events: translations.timeline?.events || []
      },
      cta: {
        title: translations.cta?.title || 'Ready to Work With Us?',
        description: translations.cta?.description || 'Join thousands of satisfied customers who trust Ajwa Trading for their machinery needs.',
        button: translations.cta?.button || 'Get Started'
      }
    }
  }, [locale])
}

export function useInquiryTranslations(locale: Locale) {
  return useMemo(() => {
    const translations = getTranslations(locale, 'inquiry')
    
    return {
      hero: {
        title: translations.hero?.title || 'Send Inquiry',
        subtitle: translations.hero?.subtitle || 'Tell us about your machinery needs'
      },
      toggle: {
        sell: translations.toggle?.sell || 'Sell to Us',
        buy: translations.toggle?.buy || 'Buy from Us'
      },
      form: {
        sellTitle: translations.form?.sellTitle || 'Sell Your Machinery',
        sellSubtitle: translations.form?.sellSubtitle || 'Get a fair price for your used machinery',
        buyTitle: translations.form?.buyTitle || 'Buy Machinery',
        buySubtitle: translations.form?.buySubtitle || 'Find the perfect machinery for your needs',
        firstName: translations.form?.firstName || 'First Name',
        lastName: translations.form?.lastName || 'Last Name',
        companyName: translations.form?.companyName || 'Company Name (if any)',
        telephone: translations.form?.telephone || 'Telephone Number',
        email: translations.form?.email || 'Email Address',
        address: translations.form?.address || 'Full Address',
        machineInfo: translations.form?.machineInfo || 'Machine Information',
        machineCompany: translations.form?.machineCompany || 'Machine Company Name',
        model: translations.form?.model || 'Model',
        year: translations.form?.year || 'Year',
        screwSize: translations.form?.screwSize || 'Screw Size',
        weight: translations.form?.weight || 'Weight',
        location: translations.form?.location || 'Location',
        condition: translations.form?.condition || 'Condition',
        description: translations.form?.description || 'Additional Description',
        requirements: translations.form?.requirements || 'Requirements',
        requirementsPlaceholder: translations.form?.requirementsPlaceholder || 'Please describe the machinery you are looking for...',
        selectCondition: translations.form?.selectCondition || 'Select condition',
        conditions: {
          excellent: translations.form?.conditions?.excellent || 'Excellent',
          good: translations.form?.conditions?.good || 'Good',
          fair: translations.form?.conditions?.fair || 'Fair',
          poor: translations.form?.conditions?.poor || 'Poor'
        },
        submit: translations.form?.submit || 'Send Inquiry',
        submitting: translations.form?.submitting || 'Sending...'
      },
      validation: {
        required: translations.validation?.required || 'This field is required',
        invalidEmail: translations.validation?.invalidEmail || 'Please enter a valid email address'
      },
      success: {
        sellTitle: translations.success?.sellTitle || 'Inquiry Sent Successfully!',
        sellMessage: translations.success?.sellMessage || 'Our representative will contact you soon to discuss your machinery.',
        buyTitle: translations.success?.buyTitle || 'Inquiry Sent Successfully!',
        buyMessage: translations.success?.buyMessage || 'Our representative will contact you soon with available options.'
      }
    }
  }, [locale])
} 