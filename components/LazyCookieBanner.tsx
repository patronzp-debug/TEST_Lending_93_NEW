'use client'

import dynamic from 'next/dynamic'

const CookieBanner = dynamic(() => import('@/components/CookieBanner'), {
  ssr: false,
})

export default function LazyCookieBanner() {
  return <CookieBanner />
}
