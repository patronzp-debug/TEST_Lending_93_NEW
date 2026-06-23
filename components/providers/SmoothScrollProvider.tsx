'use client'

import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

// GSAP and ScrollTrigger loaded dynamically to avoid SSR issues
let gsap: typeof import('gsap').default | null = null
let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const tickerCallbackRef = useRef<((time: number) => void) | null>(null)

  useEffect(() => {
    async function init() {
      // Dynamically import GSAP (client-side only)
      const gsapModule = await import('gsap')
      const { ScrollTrigger: ST } = await import('gsap/ScrollTrigger')
      gsap = gsapModule.default
      ScrollTrigger = ST
      gsap.registerPlugin(ScrollTrigger)

      // Initialize Lenis
      const lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        // syncTouch: false — Lenis НЕ синхронізує/плавить touch-events.
        // Браузер (iOS/Android) керує тач-інерцією нативно.
        // Це усуває freeze мобільного скролу при наявності overflow-x: clip.
        syncTouch: false,
        wheelMultiplier: 1,
        infinite: false,
      })

      lenisRef.current = lenis

      // Bridge Lenis → GSAP ScrollTrigger
      lenis.on('scroll', () => {
        ScrollTrigger?.update()
      })

      // GSAP ticker drives Lenis
      const tickerCallback = (time: number) => {
        lenis.raf(time * 1000)
      }
      tickerCallbackRef.current = tickerCallback
      gsap.ticker.add(tickerCallback)
      gsap.ticker.lagSmoothing(0)
    }

    init()

    return () => {
      // Cleanup
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      if (gsap && tickerCallbackRef.current) {
        gsap.ticker.remove(tickerCallbackRef.current)
        tickerCallbackRef.current = null
      }
      ScrollTrigger?.getAll().forEach(t => t.kill())
    }
  }, [])

  return <>{children}</>
}
