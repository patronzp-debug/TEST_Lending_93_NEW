import type { Metadata } from 'next'
import { Oswald, Roboto_Mono } from 'next/font/google'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import './globals.css'

/* ============================================================
   Fonts — per spec_theme.md
   Oswald: cinematic military headings
   Roboto Mono: tactical data / interface text
   ============================================================ */

const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-oswald',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

/* ============================================================
   Metadata — SEO
   ============================================================ */

export const metadata: Metadata = {
  title: '93 ОПТБ — Служи з Честю',
  description:
    'Офіційна сторінка рекрутингу 93-го окремого піхотного тактичного батальйону. Приєднуйся до команди професіоналів, які захищають Україну.',
  keywords: ['93 ОПТБ', 'рекрутинг', 'ЗСУ', 'служба', 'батальйон'],
  openGraph: {
    title: '93 ОПТБ — Служи з Честю',
    description: 'Офіційна рекрутингова сторінка 93 ОПТБ',
    type: 'website',
    locale: 'uk_UA',
  },
}

/* ============================================================
   Root Layout
   ============================================================ */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="uk"
      className={`${oswald.variable} ${robotoMono.variable} antialiased`}
    >
      <body className="bg-[#080808] text-[#ececec] overflow-x-clip">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
