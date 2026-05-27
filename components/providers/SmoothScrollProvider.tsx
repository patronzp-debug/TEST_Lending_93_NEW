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

  useEffect(() => {
    let rafId: number

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
      gsap.ticker.add((time: number) => {
        lenis.raf(time * 1000)
      })
      gsap.ticker.lagSmoothing(0)

      // RAF fallback (for non-GSAP contexts)
      function raf(time: number) {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      // NOTE: When using gsap.ticker, don't also use RAF to avoid double updates
      // The GSAP ticker handles everything above
    }

    init()

    return () => {
      // Cleanup
      cancelAnimationFrame(rafId)
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      if (gsap) {
        gsap.ticker.remove(() => {})
      }
      ScrollTrigger?.getAll().forEach(t => t.kill())
    }
  }, [])

  return <>{children}</>
}
