import { Metadata } from 'next';

interface MetadataProps {
  params: { lang: string }
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { lang } = params
  
  return {
    title: lang === 'ja' 
      ? 'アジワ株式会社 - 機械輸出入' 
      : 'Ajwa Co.,LTD - Machinery Export & Import',
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
