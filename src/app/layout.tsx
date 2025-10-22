import type { Metadata } from 'next'
import '@/styles/globals.css'
import 'react-awesome-slider/dist/styles.css'



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