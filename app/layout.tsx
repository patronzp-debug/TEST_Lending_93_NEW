import type { Metadata } from 'next'
import { Oswald, Roboto_Mono } from 'next/font/google'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import { IntroProvider } from '@/components/providers/IntroContext'
import LazyCookieBanner from '@/components/LazyCookieBanner'
import GoogleAnalytics from '@/components/GoogleAnalytics'
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
  metadataBase: new URL('https://93optb.com.ua'),
  title: '93 ОПТБ — 93 окремий протитанковий батальйон | Рекрутинг',
  description:
    'Офіційний рекрутинговий портал 93 ОПТБ. 93 окремий протитанковий батальйон ЗСУ: вакансії, служба за контрактом та онлайн-заявка.',
  keywords: [
    '93 ОПТБ',
    '93 окремий протитанковий батальйон',
    '93 окремий противотанковий батальйон',
    '93 отдельный противотанковый батальон',
    'ЗСУ',
    'рекрутинг',
    'служба за контрактом',
    'протитанковий батальйон',
    'противотанковий батальйон',
    'приєднатися до ЗСУ',
  ],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '256x256', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: '93 ОПТБ — 93 окремий протитанковий батальйон',
    description:
      'Офіційний рекрутинговий портал 93 ОПТБ: вакансії, служба за контрактом та онлайн-заявка.',
    url: '/',
    siteName: '93 ОПТБ',
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '93 ОПТБ — 93 окремий протитанковий батальйон',
    description:
      'Офіційний рекрутинговий портал 93 ОПТБ: вакансії, служба за контрактом та онлайн-заявка.',
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
        <GoogleAnalytics />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if('scrollRestoration'in history){history.scrollRestoration='manual'}window.scrollTo(0,0)}catch(e){}",
          }}
        />
        <IntroProvider>
          <Header />
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
          <LazyCookieBanner />
        </IntroProvider>
      </body>
    </html>
  )
}
