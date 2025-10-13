import { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import ContentSection from '@/components/sections/ContentSection'
import CategoryShowcaseSection from '@/components/sections/CategoryShowcaseSection'
import IntroSection from '@/components/sections/IntroSection'
import CTASection from '@/components/sections/CTASection'
import BrandsSection from '@/components/sections/BrandsSection'
import ListingsSection from '@/components/sections/ListingsSection'
import FAQSection from '@/components/sections/FAQSection'

interface HomePageProps {
  params: { lang: string }
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { lang } = params
  
  return {
    title: lang === 'ja' 
      ? 'アジワ商事 - 機械輸出入' 
      : 'Ajwa Trading Limited - Machinery Export & Import',
    description: lang === 'ja'
      ? '日本を拠点とする機械輸出入会社。中古機械の買取と世界各国への機械輸出を行っております。'
      : 'Japan-based machinery export and import company. We buy used machinery from Japanese customers and sell quality machinery worldwide.',
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'en': '/en',
        'ja': '/ja',
      },
    },
  }
}

export default function HomePage({ params }: HomePageProps) {
  const { lang } = params
  
  return (
    <>
      {/* Hero Section */}
      <HeroSection 
        lang={lang} 
        backgroundImage="/images/hero-bg.jpg"
      />
      
      {/* Content Section */}
      <ContentSection lang={lang} />
      
      {/* Category Showcase Section */}
      <CategoryShowcaseSection lang={lang} />
      
      {/* Intro Section */}
      <IntroSection lang={lang} />
      
      {/* CTA Section */}
      <CTASection lang={lang} />
      
      {/* Brands Section */}
      <BrandsSection lang={lang} />
      
      {/* Machinery Listings Section - Limited to 3 items on homepage */}
      <ListingsSection lang={lang} limit={3} />
      
      {/* FAQ Section */}
      <FAQSection lang={lang} />
    </>
  )
} 