import type { Metadata } from 'next'
import '@/styles/globals.css'
import 'react-awesome-slider/dist/styles.css'

export const metadata: Metadata = {
  title: 'Ajwa Trading Limited - Machinery Export & Import',
  description: 'Japan-based machinery export and import company. We buy used machinery from Japanese customers and sell quality machinery worldwide.',
  keywords: ['machinery', 'export', 'import', 'japan', 'trading', 'used machinery', 'heavy machinery'],
  authors: [{ name: 'Ajwa Trading Limited' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Ajwa Trading Limited - Machinery Export & Import',
    description: 'Japan-based machinery export and import company.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ja_JP',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  )
}