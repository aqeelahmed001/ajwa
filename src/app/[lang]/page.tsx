// Import metadata from separate file
import { generateMetadata } from './metadata'
export { generateMetadata }

// Use dynamic imports for all client components
import dynamic from 'next/dynamic'

// Dynamically import all section components with SSR disabled
const HeroSection = dynamic(() => import('@/components/sections/HeroSection'), { ssr: false })
const AssessmentCTASection = dynamic(() => import('@/components/sections/AssessmentCTASection'), { ssr: false })
const TrackRecordSection = dynamic(() => import('@/components/sections/TrackRecordSection'), { ssr: false })
const BuyingProcessSection = dynamic(() => import('@/components/sections/BuyingProcessSection'), { ssr: false })
// ContentSection removed as requested
const CategoryShowcaseSection = dynamic(() => import('@/components/sections/CategoryShowcaseSection'), { ssr: false })
const IntroSection = dynamic(() => import('@/components/sections/IntroSection'), { ssr: false })
// CTASection removed as requested (International Machinery Trading Experts section)
const BrandsSection = dynamic(() => import('@/components/sections/BrandsSection'), { ssr: false })
const ListingsSection = dynamic(() => import('@/components/sections/ListingsSection'), { ssr: false })
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'), { ssr: false })

interface HomePageProps {
  params: { lang: string }
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
      
      {/* Assessment CTA Section - Added as per request */}
      <AssessmentCTASection lang={lang} />
      
      {/* Track Record Section - Added as per request */}
      <TrackRecordSection lang={lang} />

      {/* Brands Section */}
      <BrandsSection lang={lang} />
      
      {/* Buying Process Section - Added as per request */}
      <BuyingProcessSection lang={lang} />
      
      {/* Category Showcase Section */}
      <CategoryShowcaseSection lang={lang} />

       {/* FAQ Section */}
      <FAQSection lang={lang} />
      
      {/* Intro Section */}
      {/* <IntroSection lang={lang} /> */}
           
      {/* Machinery Listings Section - Limited to 3 items on homepage */}
      {/* <ListingsSection lang={lang} limit={3} /> */}
      
    </>
  )
} 