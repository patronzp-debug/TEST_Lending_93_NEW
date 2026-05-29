'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import type { ScrollTrigger as STType } from 'gsap/ScrollTrigger'
import { useIntro } from '@/components/providers/IntroContext'

import type { Variants } from 'framer-motion'

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */

// Expo-out cubic bezier — matches the site's --ease-cinematic
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const fromLeft: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: '0%',
    opacity: 1,
    transition: { duration: 0.65, ease: EASE },
  },
}

const fromRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: '0%',
    opacity: 1,
    transition: { duration: 0.65, ease: EASE },
  },
}

const fromTop: Variants = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: EASE, delay: 0.1 },
  },
}

const fromBottom: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: EASE, delay: 0.2 },
  },
}

/* ============================================================
   HERO COMPONENT
   ============================================================ */

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const stInstances = useRef<STType[]>([])
  const { isIntro } = useIntro()

  /* ---- GSAP ScrollTrigger: blur + scale on scroll ---- */
  useEffect(() => {
    let mounted = true

    async function initGSAP() {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      if (!mounted) return

      gsap.registerPlugin(ScrollTrigger)

      const heroEl = heroRef.current
      const contentEl = contentRef.current
      if (!heroEl || !contentEl) return

      const st1 = gsap.to(contentEl, {
        filter: 'blur(18px)',
        scale: 0.88,
        opacity: 0,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      }).scrollTrigger

      const st2 = gsap.to('.hero-video', {
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      }).scrollTrigger

      if (st1) stInstances.current.push(st1)
      if (st2) stInstances.current.push(st2)
    }

    initGSAP()

    return () => {
      mounted = false
      stInstances.current.forEach(st => st.kill())
      stInstances.current = []
    }
  }, [])

  const textVisible = !isIntro

  return (
    <section
      ref={heroRef}
      id="hero"
      className="hero-section relative w-full overflow-hidden"
      style={{ height: '100svh' }}
    >
      {/* ---- Background Video ---- */}
      <video
        className="hero-video absolute inset-0 w-full h-full object-cover"
        src="/bg-main.webm"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* ---- Vignette / Dark Gradient Overlay ---- */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(8, 8, 8, 0.55) 0%,
              rgba(8, 8, 8, 0.15) 35%,
              rgba(8, 8, 8, 0.15) 60%,
              rgba(8, 8, 8, 0.85) 100%
            ),
            radial-gradient(
              ellipse at center,
              transparent 40%,
              rgba(8, 8, 8, 0.7) 100%
            )
          `,
        }}
      />

      {/* ---- Scan-line accent (subtle) ---- */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
          backgroundSize: '100% 3px',
        }}
      />

      {/* ---- Cinematic Content (appears after intro) ---- */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center overflow-hidden"
        style={{ willChange: 'filter, transform, opacity', paddingTop: '72px' }}
      >

        {/* Line 1 — from LEFT */}
        <div className="overflow-hidden w-full flex justify-center">
          <motion.h1
            variants={fromLeft}
            initial="hidden"
            animate={textVisible ? 'visible' : 'hidden'}
            className="hero-line-1 text-[clamp(1.6rem,4.5vw,4.8rem)] font-black uppercase text-white leading-[1.05]"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              textShadow: '0 2px 40px rgba(0,0,0,0.9), 0 0 60px rgba(8,8,8,0.5)',
            }}
          >
            Зроби свій крок до перемоги
          </motion.h1>
        </div>

        {/* Line 2 — from RIGHT */}
        <div className="overflow-hidden w-full flex justify-center mt-2 md:mt-3">
          <motion.p
            variants={fromRight}
            initial="hidden"
            animate={textVisible ? 'visible' : 'hidden'}
            className="hero-line-2 text-[clamp(1rem,2.8vw,2.8rem)] font-semibold uppercase tracking-[0.12em]"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontWeight: 600,
              color: '#b0b0b0',
              textShadow: '0 2px 20px rgba(0,0,0,0.8)',
              letterSpacing: '0.12em',
            }}
          >
            стань частиною батальйону
          </motion.p>
        </div>

        {/* Divider accent */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={textVisible ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-[180px] md:w-[260px] h-px bg-gradient-to-r from-transparent via-[#ff5a00] to-transparent mt-6 mb-5"
          aria-hidden="true"
        />

        {/* Line 3 — from TOP */}
        <div className="overflow-hidden w-full flex justify-center">
          <motion.p
            variants={fromTop}
            initial="hidden"
            animate={textVisible ? 'visible' : 'hidden'}
            className="hero-line-3 text-[clamp(0.8rem,2vw,1.6rem)] font-medium uppercase tracking-[0.2em]"
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontWeight: 500,
              color: '#ff5a00',
              textShadow: '0 0 30px rgba(255,90,0,0.5), 0 2px 10px rgba(0,0,0,0.7)',
              letterSpacing: '0.2em',
            }}
          >
            пали ворожу броню разом з нами
          </motion.p>
        </div>

        {/* CTA Button — absolute positioned above Scroll hint */}
        <motion.div
          variants={fromBottom}
          initial="hidden"
          animate={textVisible ? 'visible' : 'hidden'}
          className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 w-max"
        >
          <Button
            id="hero-cta"
            className="hero-cta-btn relative overflow-hidden uppercase tracking-[0.2em] font-bold border-0"
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)',
              padding: 'clamp(14px, 2vw, 18px) clamp(36px, 4vw, 60px)',
              background: 'linear-gradient(135deg, #ff5a00 0%, #e84800 100%)',
              boxShadow: '0 0 30px rgba(255,90,0,0.35), 0 4px 24px rgba(0,0,0,0.5)',
              borderRadius: '2px',
              height: 'auto',
              color: '#ffffff',
            }}
            onClick={() => {
              document.getElementById('recruiting-form')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            {/* Shimmer sweep on hover */}
            <span
              className="hero-cta-shimmer pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
                backgroundPosition: '200% center',
                transition: 'background-position 0.5s ease',
              }}
            />
            <span className="relative z-10 flex items-center gap-3" style={{ color: '#ffffff' }}>
              Приєднатись
              <span
                className="inline-block"
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 0 8px rgba(255,255,255,0.7)',
                  animation: 'glow-pulse 1.5s ease-in-out infinite',
                }}
              />
            </span>
          </Button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={textVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <span
            className="text-[0.6rem] tracking-[0.3em] text-[#4a4a4a] uppercase"
            style={{ fontFamily: 'var(--font-roboto-mono)' }}
          >
            Scroll
          </span>
          <ChevronDown
            className="text-[#4a4a4a] animate-bounce"
            size={16}
            style={{ animationDuration: '1.8s' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
