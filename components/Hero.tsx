'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
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

const CTA_LABEL = 'ПРИЄДНАТИСЬ'

function AnimatedJoinButton({ onClick }: { onClick: () => void }) {
  const renderChars = (label: string) =>
    Array.from(label).map((char, index) => (
      <span
        key={`${char}-${index}`}
        data-label={char}
        style={{ '--i': index + 1 } as CSSProperties}
      >
        {char}
      </span>
    ))

  return (
    <button
      id="hero-cta"
      type="button"
      className="join-cta-button"
      onClick={onClick}
      aria-label="Приєднатись"
    >
      <div className="join-cta-bg" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 342 208"
        className="join-cta-splash"
        aria-hidden="true"
        focusable="false"
      >
        <path strokeLinecap="round" strokeWidth="3" d="M54.1054 99.7837C54.1054 99.7837 40.0984 90.7874 26.6893 97.6362C13.2802 104.485 1.5 97.6362 1.5 97.6362" />
        <path strokeLinecap="round" strokeWidth="3" d="M285.273 99.7841C285.273 99.7841 299.28 90.7879 312.689 97.6367C326.098 104.486 340.105 95.4893 340.105 95.4893" />
        <path strokeLinecap="round" strokeWidth="3" strokeOpacity="0.3" d="M281.133 64.9917C281.133 64.9917 287.96 49.8089 302.934 48.2295C317.908 46.6501 319.712 36.5272 319.712 36.5272" />
        <path strokeLinecap="round" strokeWidth="3" strokeOpacity="0.3" d="M281.133 138.984C281.133 138.984 287.96 154.167 302.934 155.746C317.908 157.326 319.712 167.449 319.712 167.449" />
        <path strokeLinecap="round" strokeWidth="3" d="M230.578 57.4476C230.578 57.4476 225.785 41.5051 236.061 30.4998C246.337 19.4945 244.686 12.9998 244.686 12.9998" />
        <path strokeLinecap="round" strokeWidth="3" d="M230.578 150.528C230.578 150.528 225.785 166.471 236.061 177.476C246.337 188.481 244.686 194.976 244.686 194.976" />
        <path strokeLinecap="round" strokeWidth="3" strokeOpacity="0.3" d="M170.392 57.0278C170.392 57.0278 173.89 42.1322 169.571 29.54C165.252 16.9478 168.751 2.05227 168.751 2.05227" />
        <path strokeLinecap="round" strokeWidth="3" strokeOpacity="0.3" d="M170.392 150.948C170.392 150.948 173.89 165.844 169.571 178.436C165.252 191.028 168.751 205.924 168.751 205.924" />
        <path strokeLinecap="round" strokeWidth="3" d="M112.609 57.4476C112.609 57.4476 117.401 41.5051 107.125 30.4998C96.8492 19.4945 98.5 12.9998 98.5 12.9998" />
        <path strokeLinecap="round" strokeWidth="3" d="M112.609 150.528C112.609 150.528 117.401 166.471 107.125 177.476C96.8492 188.481 98.5 194.976 98.5 194.976" />
        <path strokeLinecap="round" strokeWidth="3" strokeOpacity="0.3" d="M62.2941 64.9917C62.2941 64.9917 55.4671 49.8089 40.4932 48.2295C25.5194 46.6501 23.7159 36.5272 23.7159 36.5272" />
        <path strokeLinecap="round" strokeWidth="3" strokeOpacity="0.3" d="M62.2941 145.984C62.2941 145.984 55.4671 161.167 40.4932 162.746C25.5194 164.326 23.7159 174.449 23.7159 174.449" />
      </svg>

      <div className="join-cta-wrap">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 221 42"
          className="join-cta-path"
          aria-hidden="true"
          focusable="false"
        >
          <path strokeLinecap="round" strokeWidth="3" d="M182.674 2H203C211.837 2 219 9.16344 219 18V24C219 32.8366 211.837 40 203 40H18C9.16345 40 2 32.8366 2 24V18C2 9.16344 9.16344 2 18 2H47.8855" />
        </svg>

        <div className="join-cta-outline" />
        <div className="join-cta-content" aria-hidden="true">
          <span className="join-cta-char join-cta-state-1">{renderChars(CTA_LABEL)}</span>
          <div className="join-cta-icon"><div /></div>
          <span className="join-cta-char join-cta-state-2">{renderChars(CTA_LABEL)}</span>
        </div>
      </div>
    </button>
  )
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
        scale: 0.88,
        opacity: 0,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
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
      {/* ---- Priority Poster Image for LCP ---- */}
      <Image
        src="/images/hero-poster.png"
        alt="93 ОПТБ бойова робота"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover object-center"
      />

      {/* ---- Background Video ---- */}
      <video
        className="hero-video absolute inset-0 z-10 w-full h-full object-cover transform-gpu will-change-transform"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        {/* Chrome, Firefox, Opera — compact source */}
        <source src="/videos/bg-main.webm" type="video/webm" />
        {/* Safari, iOS, macOS — universal fallback */}
        <source src="/videos/bg-main.mp4" type="video/mp4" />
        <track kind="captions" srcLang="uk" label="Ukrainian" />
        Ваш браузер не підтримує відео.
      </video>

      {/* ---- Vignette / Dark Gradient Overlay ---- */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
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
        className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
          backgroundSize: '100% 3px',
        }}
      />

      {/* ---- Cinematic Content (appears after intro) ---- */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center overflow-hidden"
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
            93 окремий протитанковий батальйон
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
            батальйон ЗСУ чекає тебе
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
          className="hero-cta-wrap absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 w-max"
        >
          <AnimatedJoinButton
            onClick={() => {
              document.getElementById('recruiting-form')?.scrollIntoView({ behavior: 'smooth' })
            }}
          />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="hero-scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
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
