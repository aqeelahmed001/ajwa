import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Building2, Factory, Settings, Globe, Award, Users } from 'lucide-react'

interface BrandsPageProps {
  params: { lang: string }
}

export async function generateMetadata({ params }: BrandsPageProps): Promise<Metadata> {
  const { lang } = params
  
  return {
    title: lang === 'ja' 
      ? '取引メーカー - アジワ商事' 
      : 'Partner Brands - Ajwa Trading Limited',
    description: lang === 'ja'
      ? '日本を代表する機械メーカーとの取引実績。三菱、小松、日立など世界一流の機械メーカーとのパートナーシップ。'
      : 'Our partnerships with Japan\'s leading machinery manufacturers including Mitsubishi, Komatsu, Hitachi and more.',
    alternates: {
      canonical: `/${lang}/brands`,
      languages: {
        'en': '/en/brands',
        'ja': '/ja/brands',
      },
    },
  }
}

export default function BrandsPage({ params }: BrandsPageProps) {
  const { lang } = params
  const isJapanese = lang === 'ja'

  // Brand data with more detailed information
  const brands = [
    {
      name: 'Mitsubishi',
      japaneseName: '三菱重工業',
      category: 'Heavy Machinery',
      logo: '/images/brands/mitsubishi.png',
      description: isJapanese 
        ? '三菱重工業は、発電設備、産業機械、航空宇宙機器などの重工業製品を製造する日本の大手企業です。'
        : 'Mitsubishi Heavy Industries is a major Japanese company manufacturing heavy industrial products including power generation equipment, industrial machinery, and aerospace equipment.',
      specialties: isJapanese 
        ? ['発電設備', '産業機械', '航空宇宙機器', '船舶・海洋機器']
        : ['Power Generation', 'Industrial Machinery', 'Aerospace Equipment', 'Ship & Marine Equipment'],
      yearEstablished: 1884,
      website: 'https://www.mhi.com'
    },
    {
      name: 'Komatsu',
      japaneseName: '小松製作所',
      category: 'Construction Equipment',
      logo: '/images/brands/komatsu.png',
      description: isJapanese 
        ? '小松製作所は、建設機械、鉱山機械、産業機械の世界的リーダーです。'
        : 'Komatsu Ltd. is a global leader in construction, mining, and industrial machinery.',
      specialties: isJapanese 
        ? ['建設機械', '鉱山機械', '産業機械', 'フォークリフト']
        : ['Construction Equipment', 'Mining Equipment', 'Industrial Machinery', 'Forklifts'],
      yearEstablished: 1921,
      website: 'https://www.komatsu.com'
    },
    {
      name: 'Hitachi',
      japaneseName: '日立製作所',
      category: 'Industrial Equipment',
      logo: '/images/brands/hitachi.png',
      description: isJapanese 
        ? '日立製作所は、社会インフラ、産業システム、デジタルソリューションを提供する総合電機メーカーです。'
        : 'Hitachi Ltd. is a comprehensive electrical manufacturer providing social infrastructure, industrial systems, and digital solutions.',
      specialties: isJapanese 
        ? ['産業システム', '社会インフラ', 'デジタルソリューション', '建設機械']
        : ['Industrial Systems', 'Social Infrastructure', 'Digital Solutions', 'Construction Equipment'],
      yearEstablished: 1910,
      website: 'https://www.hitachi.com'
    },
    {
      name: 'Kubota',
      japaneseName: '久保田株式会社',
      category: 'Agricultural Machinery',
      logo: '/images/brands/kubota.png',
      description: isJapanese 
        ? '久保田は、農業機械、エンジン、建設機械の世界的メーカーです。'
        : 'Kubota Corporation is a global manufacturer of agricultural machinery, engines, and construction equipment.',
      specialties: isJapanese 
        ? ['農業機械', 'エンジン', '建設機械', '水処理システム']
        : ['Agricultural Machinery', 'Engines', 'Construction Equipment', 'Water Treatment Systems'],
      yearEstablished: 1890,
      website: 'https://www.kubota.com'
    },
    {
      name: 'Yanmar',
      japaneseName: 'ヤンマーホールディングス',
      category: 'Diesel Engines',
      logo: '/images/brands/yanmar.png',
      description: isJapanese 
        ? 'ヤンマーは、ディーゼルエンジン、建設機械、農業機械の世界的メーカーです。'
        : 'Yanmar Holdings is a global manufacturer of diesel engines, construction equipment, and agricultural machinery.',
      specialties: isJapanese 
        ? ['ディーゼルエンジン', '建設機械', '農業機械', '船舶エンジン']
        : ['Diesel Engines', 'Construction Equipment', 'Agricultural Machinery', 'Marine Engines'],
      yearEstablished: 1912,
      website: 'https://www.yanmar.com'
    },
    {
      name: 'Makita',
      japaneseName: 'マキタ株式会社',
      category: 'Power Tools',
      logo: '/images/brands/makita.png',
      description: isJapanese 
        ? 'マキタは、電動工具、園芸工具、産業用機器の世界的メーカーです。'
        : 'Makita Corporation is a global manufacturer of power tools, garden tools, and industrial equipment.',
      specialties: isJapanese 
        ? ['電動工具', '園芸工具', '産業用機器', 'アクセサリー']
        : ['Power Tools', 'Garden Tools', 'Industrial Equipment', 'Accessories'],
      yearEstablished: 1915,
      website: 'https://www.makita.com'
    }
  ]

  // Page text content
  const pageText = {
    title: isJapanese ? '取引メーカー' : 'Our Partner Brands',
    subtitle: isJapanese 
      ? '世界一流の機械メーカーとの長年の取引実績' 
      : 'Trusted partnerships with world-leading machinery manufacturers',
    description: isJapanese
      ? '20年以上にわたる実績で、日本を代表する機械メーカーとの強固な取引関係を築いてきました。各メーカーの専門分野と特徴をご紹介します。'
      : 'With over 20 years of experience, we have built strong relationships with Japan\'s leading machinery manufacturers. Discover each manufacturer\'s specialties and unique features.',
    backToHome: isJapanese ? 'ホームに戻る' : 'Back to Home',
    contactUs: isJapanese ? 'お問い合わせ' : 'Contact Us',
    getQuote: isJapanese ? '見積もり依頼' : 'Request Quote'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/${lang}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {pageText.backToHome}
                </Link>
              </Button>
            </div>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link href={`/${lang}/contact`}>
                {pageText.contactUs}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container py-16 md:py-24">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900">
            {pageText.title}
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-primary">
            {pageText.subtitle}
          </p>
          <p className="text-lg text-muted-foreground">
            {pageText.description}
          </p>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="container pb-16 md:pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand, index) => (
            <div key={brand.name} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Brand Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{brand.name}</h3>
                    <p className="text-sm text-muted-foreground">{brand.japaneseName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {brand.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Est. {brand.yearEstablished}
                  </span>
                </div>
              </div>

              {/* Brand Content */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {brand.description}
                </p>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2 text-sm">
                    {isJapanese ? '専門分野' : 'Specialties'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {brand.specialties.map((specialty, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-slate-100 text-slate-700"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" asChild>
                    <Link href={`/${lang}/contact?brand=${brand.name}`}>
                      {pageText.getQuote}
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={brand.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-slate-200">
        <div className="container py-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              {isJapanese ? 'お気軽にお問い合わせください' : 'Ready to Get Started?'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {isJapanese 
                ? 'これらの一流メーカーの機械について、詳しい情報や見積もりをご希望の方はお気軽にお問い合わせください。'
                : 'Contact us for detailed information and quotes on machinery from these leading manufacturers.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link href={`/${lang}/contact`}>
                  {pageText.contactUs}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={`/${lang}/inquiry`}>
                  {isJapanese ? 'お問い合わせフォーム' : 'Send Inquiry'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 