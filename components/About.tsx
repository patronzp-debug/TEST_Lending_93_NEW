'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Shield, Crosshair, Users } from 'lucide-react'
import type { ScrollTrigger as STType } from 'gsap/ScrollTrigger'
import InfiniteMarquee from './InfiniteMarquee'

type GSAPMatchMedia = ReturnType<typeof import('gsap').default.matchMedia>

/* ============================================================
   WORD-SPLIT STAGGER REVEAL
   Splits a string into words; each word slides up from a mask.
   ============================================================ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.1,
    },
  },
}

const wordVariants = {
  hidden: { y: '110%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
}

interface StaggerTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
  delay?: number
  inView: boolean
}

function StaggerText({ text, className = '', style, delay = 0, inView }: StaggerTextProps) {
  const words = text.split(' ')

  return (
    <motion.p
      className={className}
      style={style}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={delay}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ marginRight: '0.3em', verticalAlign: 'bottom' }}
        >
          <motion.span
            className="inline-block"
            variants={wordVariants}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.p>
  )
}

/* ============================================================
   MEDIA PLACEHOLDER BLOCKS — content for parallax gallery
   ============================================================ */

interface MediaBlock {
  id: string
  icon: React.ElementType
  label: string
  /** Vertical parallax offset range (px): negative = moves up faster */
  yRange: number
  /** Visual sizing */
  aspectRatio: string
  /** Slight horizontal offset to create asymmetry */
  marginLeft?: string
  marginRight?: string
  image: string
}

const MEDIA_BLOCKS: MediaBlock[] = [
  {
    id: 'mb1',
    icon: Crosshair,
    label: 'Тактичне навчання',
    yRange: -55,
    aspectRatio: '4/3',
    marginRight: '10%',
    image: '/images/about/work%231.webp',
  },
  {
    id: 'mb2',
    icon: Shield,
    label: 'Озброєння та техніка',
    yRange: -40,
    aspectRatio: '1/1',
    marginLeft: '20%',
    image: '/images/about/work%232.webp',
  },
  {
    id: 'mb3',
    icon: Users,
    label: 'Команда підрозділу',
    yRange: -40,
    aspectRatio: '16/9',
    marginRight: '5%',
    image: '/images/about/work%233.webp',
  },
]

/* ============================================================
   STAT ITEMS — compact info row under text
   ============================================================ */

const STATS = [
  { value: '2024', label: 'Рік заснування' },
  { value: '100%', label: 'Западне озброєння' },
  { value: '24/7', label: 'Бойове чергування' },
]

/* ============================================================
   ABOUT SECTION
   ============================================================ */

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaColRef = useRef<HTMLDivElement>(null)
  const stInstances = useRef<STType[]>([])

  // Trigger text animations when section enters viewport
  const inView = useInView(sectionRef, { once: true, margin: '-8% 0px' })

  /* ---- GSAP Parallax on media blocks ---- */
  useEffect(() => {
    let mounted = true
    let mm: GSAPMatchMedia | undefined

    async function initParallax() {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (!mounted || !sectionRef.current) return

      gsap.registerPlugin(ScrollTrigger)

      mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        MEDIA_BLOCKS.forEach(({ id, yRange }) => {
          const el = document.getElementById(`about-media-${id}`)
          if (!el) return

          const st = gsap.to(el, {
            y: yRange,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.4,
            },
          }).scrollTrigger

          if (st) stInstances.current.push(st)
        })
      })
    }

    initParallax()

    return () => {
      mounted = false
      mm?.revert()
      stInstances.current.forEach(st => st.kill())
      stInstances.current = []
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="Філософія підрозділу"
      style={{
        background: '#080808',
        padding: 'clamp(80px, 10vw, 160px) clamp(20px, 5vw, 80px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial ambient glow behind text */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '30%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,90,0,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ── Two-column grid ── */}
        <div className="about-grid">
          {/* ════════════════════════════════════
              LEFT — Text column
              ════════════════════════════════════ */}
          <div
            className="about-text-col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 'clamp(28px, 3vw, 48px)',
            }}
          >
            {/* Tactical label */}
            <motion.div
              className="inline-flex items-center gap-2 tactical-tag self-start"
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a00] animate-pulse" />
              Про нас
            </motion.div>

            {/* H2 — word-by-word slide-up */}
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-oswald)',
                  fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.0,
                  letterSpacing: '-0.02em',
                  color: '#ececec',
                  textTransform: 'uppercase',
                  overflow: 'hidden',
                }}
                aria-label="Філософія підрозділу"
              >
                {['ФІЛОСОФІЯ', 'ПІДРОЗДІЛУ'].map((word, i) => (
                  <span
                    key={word}
                    className="block overflow-hidden"
                  >
                    <motion.span
                      className="block"
                      initial={{ y: '108%' }}
                      animate={inView ? { y: '0%' } : { y: '108%' }}
                      transition={{
                        duration: 0.75,
                        delay: i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        color: i === 1 ? '#ff5a00' : '#ececec',
                      }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </h2>
            </div>

            {/* Horizontal divider */}
            <motion.div
              style={{
                height: '1px',
                background:
                  'linear-gradient(90deg, rgba(255,90,0,0.5) 0%, rgba(255,90,0,0.1) 40%, transparent 100%)',
                width: '100%',
                maxWidth: '400px',
              }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Paragraph 1 — stagger word reveal */}
            <StaggerText
              inView={inView}
              text="Наша спеціалізація — високоточне виявлення та гарантоване знищення ворожої бронетехніки. Ми працюємо технологічно, швидко і безжально."
              style={{
                fontFamily: 'var(--font-roboto-mono)',
                fontSize: 'clamp(0.8rem, 1.3vw, 0.95rem)',
                lineHeight: 1.8,
                color: '#8a8a8a',
                maxWidth: '480px',
              }}
              delay={0.1}
            />

            {/* Paragraph 2 — stagger word reveal, lighter delay */}
            <StaggerText
              inView={inView}
              text="Ми не шукаємо готових кіборгів. Ми шукаємо вмотивованих людей. Ти отримаєш найкраще західне озброєння, інтенсивну підготовку та команду, де кожен прикриває спину іншого."
              style={{
                fontFamily: 'var(--font-roboto-mono)',
                fontSize: 'clamp(0.8rem, 1.3vw, 0.95rem)',
                lineHeight: 1.8,
                color: '#6a6a6a',
                maxWidth: '480px',
              }}
              delay={0.25}
            />

            {/* Stats row */}
            <motion.div
              className="flex flex-wrap gap-8 pt-2"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span
                    style={{
                      fontFamily: 'var(--font-oswald)',
                      fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                      fontWeight: 700,
                      color: '#ff5a00',
                      lineHeight: 1,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {value}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-roboto-mono)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.18em',
                      color: '#4a4a4a',
                      textTransform: 'uppercase',
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ════════════════════════════════════
              RIGHT — Bento grid media gallery
              ════════════════════════════════════ */}
          <div
            ref={mediaColRef}
            className="about-media-col grid grid-cols-2 gap-4 md:gap-6 h-fit"
          >
            {MEDIA_BLOCKS.map((block, i) => {
              const isFirst = i === 0
              return (
                <motion.div
                  key={block.id}
                  id={`about-media-${block.id}`}
                  className={isFirst 
                    ? "col-span-2 overflow-hidden rounded-2xl relative aspect-video group" 
                    : "col-span-1 overflow-hidden rounded-2xl relative aspect-square group"
                  }
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid #222222',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    willChange: 'transform',
                  }}
                  initial={{ opacity: 0, y: 32 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                  transition={{
                    duration: 0.75,
                    delay: 0.15 + i * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {/* Next.js responsive image */}
                  <Image
                    src={block.image}
                    alt={block.label}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-cover transition-transform duration-500 ease-in-out hover:scale-110 group-hover:scale-110 will-change-transform w-full h-full ${
                      isFirst ? 'aspect-video' : 'aspect-square'
                    }`}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Infinite cinematic photo strip ── */}
      <InfiniteMarquee />
    </section>
  )
}
