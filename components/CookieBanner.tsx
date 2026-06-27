'use client'

import { useEffect, useState } from 'react'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsVisible(localStorage.getItem('cookieConsent') !== 'true')
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true')
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 rounded-lg border border-white/10 bg-[#090909]/92 px-4 py-3 shadow-[0_16px_50px_rgba(0,0,0,0.5)] backdrop-blur-md md:bottom-6 md:px-5">
      <div className="flex w-full flex-col items-center justify-between gap-3 text-center md:flex-row md:gap-5 md:text-left">
        <p className="max-w-2xl text-sm font-normal leading-[1.55] tracking-normal text-zinc-300 [font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] md:text-[0.95rem]">
          Цей сайт використовує файли cookie для аналітики та покращення
          роботи. Залишаючись на сайті, ви погоджуєтесь з їх використанням.
        </p>
        <button
          type="button"
          onClick={acceptCookies}
          className="min-h-11 min-w-32 shrink-0 rounded-md border border-[#ff7a1a]/45 bg-[linear-gradient(135deg,#ff5a00_0%,#e84800_100%)] px-5 text-[0.74rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_0_22px_rgba(255,90,0,0.22),0_8px_22px_rgba(0,0,0,0.42)] transition duration-200 [font-family:var(--font-roboto-mono)] hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(255,90,0,0.32),0_10px_26px_rgba(0,0,0,0.48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a1a] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          ЗРОЗУМІЛО
        </button>
      </div>
    </div>
  )
}
