import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const locales = ['ja', 'en']

export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }))
}

export default function LocaleLayout({
  children,
  params: { lang }
}: {
  children: ReactNode
  params: { lang: string }
}) {
  // Validate that the incoming `lang` parameter is valid
  if (!locales.includes(lang)) {
    notFound()
  }

  return (
    <html lang={lang}>
      <body className={inter.className}>
        <Header lang={lang} />
        <main>
          {children}
        </main>
        <Footer lang={lang} />
      </body>
    </html>
  )
} 