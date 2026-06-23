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
    <div className="fixed bottom-0 z-50 w-full border-t border-zinc-800 bg-zinc-950/95 px-4 py-4 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-3 text-center md:flex-row md:gap-5">
        <p className="max-w-4xl text-sm leading-relaxed text-zinc-200">
          Цей сайт використовує файли cookie для аналітики та покращення
          роботи. Залишаючись на сайті, ви погоджуєтесь з їх використанням.
        </p>
        <button
          type="button"
          onClick={acceptCookies}
          className="min-h-10 shrink-0 rounded-md border border-[#ff5a00]/60 bg-[#ff5a00] px-5 text-xs font-bold uppercase tracking-[0.12em] text-black shadow-[0_0_22px_rgba(255,90,0,0.24)] transition hover:bg-[#ff6d1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a00] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          ЗРОЗУМІЛО
        </button>
      </div>
    </div>
  )
}
