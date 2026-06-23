import type { Metadata } from 'next'
import { Oswald, Roboto_Mono } from 'next/font/google'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import { IntroProvider } from '@/components/providers/IntroContext'
import CookieBanner from '@/components/CookieBanner'
import Header from '@/components/Header'
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
  title: '93 ОПТБ — Служи з Честю | Окремий Протитанковий Батальйон',
  description:
    'Офіційний рекрутинговий портал 93-го Окремого Протитанкового Батальйону. Долучайся до лав ЗСУ, обирай посаду та подавай заявку онлайн.',
  keywords: [
    '93 ОПТБ',
    'ЗСУ',
    'рекрутинг',
    'служба за контрактом',
    'протитанковий батальйон',
    'приєднатися до ЗСУ',
  ],
  openGraph: {
    title: '93 ОПТБ — Служи з Честю',
    description: 'Офіційний рекрутинговий портал 93 ОПТБ.',
    url: 'https://test-lending-93-new.vercel.app/',
    siteName: '93 ОПТБ',
    locale: 'uk_UA',
    type: 'website',
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
        <IntroProvider>
          <Header />
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
          <CookieBanner />
        </IntroProvider>
      </body>
    </html>
  )
}
