'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'

/* ============================================================
   DATA — Ukrainian only (spec_myths_and_reality.md)
   ============================================================ */

interface MythCard {
  id: string
  myth: string
  realityHighlight: string
  realityText: string
}

const MYTHS: MythCard[] = [
  {
    id: 'myth-1',
    myth: 'Без військового досвіду я буду тягарем.',
    realityHighlight: '70%',
    realityText:
      ' наших операторів прийшли з цивільних професій. Ви пройдете інтенсивну БЗВП та фахову підготовку з бойовими інструкторами. Ми вчимо з нуля.',
  },
  {
    id: 'myth-2',
    myth: 'Мене одразу відправлять на штурм.',
    realityHighlight: 'Наша специфіка',
    realityText:
      ' — точкова робота по бронетехніці ворога з підготовлених і замаскованих позицій, а також логістика та розвідка.',
  },
  {
    id: 'myth-3',
    myth: 'Цивільна професія в армії не потрібна.',
    realityHighlight: 'Сучасний підрозділ',
    realityText:
      ' — це механізм. Нам критично потрібні водії, електрики, інженери, механіки та айтішники для забезпечення роботи батальйону.',
  },
  {
    id: 'myth-4',
    myth: 'Доведеться купувати екіпірування за власні кошти.',
    realityHighlight: 'Батальйон повністю',
    realityText:
      ' забезпечує бійців сучасною амуніцією, засобами індивідуального захисту та необхідним обладнанням для виконання завдань.',
  },
]

/* ============================================================
   ANIMATION CONSTANTS
   ============================================================ */

const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const
const EASE_OUT = [0.0, 0.0, 0.2, 1] as const

/* Direction map for text fly-in: cards enter from alternating sides */
const CARD_DIRECTIONS: Array<{ x: number; y: number }> = [
  { x: -60, y: 40 },   // card 0: from bottom-left
  { x: 60, y: 40 },   // card 1: from bottom-right
  { x: -60, y: 40 },   // card 2: from bottom-left
  { x: 60, y: 40 },   // card 3: from bottom-right
]

const sectionVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const headingVariants = {
  hidden: { y: '105%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.85, ease: EASE_CINEMATIC },
  },
}

const tagVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: EASE_CINEMATIC },
  },
}

/* Grid stagger — each card is its own child */
const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.0,
    },
  },
}

/* ============================================================
   HOOK: Mobile detection (SSR-safe, matchMedia)
   ============================================================ */

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobile
}

/* ============================================================
   HOOK: Mobile typewriter effect
   — setInterval-based (no direct RAF — safe per architecture rules)
   — Starts only when isActive && isMobile
   — Runs once (no restart on re-render)
   ============================================================ */

function useMobileTypewriter(
  text: string,
  isActive: boolean,
  isMobile: boolean,
  charDelay: number = 28,  // ~35 chars/sec — comfortable reading pace
  startDelay: number = 0,  // ms to wait before first character
): { displayed: string; isDone: boolean } {
  const [charIndex, setCharIndex] = useState(0)
  const hasStarted = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const start = useCallback(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    intervalRef.current = setInterval(() => {
      setCharIndex(prev => {
        const next = prev + 1
        if (next >= text.length) {
          // Done — clear interval
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
        return next
      })
    }, charDelay)
  }, [text.length, charDelay])

  useEffect(() => {
    if (!isActive || !isMobile) return
    if (hasStarted.current) return

    // Delay before typing starts (card entrance animation finishes first)
    timeoutRef.current = setTimeout(start, startDelay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isActive, isMobile, start, startDelay])

  // On desktop: always show full text
  if (!isMobile) return { displayed: text, isDone: true }

  // On mobile before activation: empty string (hidden by parent opacity animation anyway)
  const displayed = isActive ? text.slice(0, charIndex) : ''
  const isDone = charIndex >= text.length

  return { displayed, isDone }
}

/* ============================================================
   SINGLE MYTH CARD
   ============================================================ */

function MythCardItem({
  card,
  index,
  isMobile,
}: {
  card: MythCard
  index: number
  isMobile: boolean
}) {
  const cardRef = useRef<HTMLElement>(null)
  const cardInView = useInView(cardRef, { once: true, amount: 0.8 })

  const formattedIndex = String(index + 1).padStart(2, '0')
  const dir = CARD_DIRECTIONS[index] ?? { x: 0, y: 48 }

  /* Per-card entrance variant using the direction */
  const cardVariant = {
    hidden: { opacity: 0, x: dir.x, y: dir.y, scale: 0.96 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.75,
        ease: EASE_CINEMATIC,
        delay: index * 0.12,
      },
    },
  }

  /* ── Draw-strikethrough timing ── */
  // starts 0.55s after card becomes visible (after it has settled in)
  const strikeDelay = 0.55 + index * 0.1



  /* ── Typewriter: full reality text (highlight + body) ── */
  const fullRealityText = card.realityHighlight + card.realityText

  // Typewriter starts after card entrance (0.75s) + strikethrough (strikeDelay) + small buffer
  const typewriterStartDelay = Math.round((strikeDelay + 1.05) * 1000)

  const { displayed, isDone } = useMobileTypewriter(
    fullRealityText,
    cardInView,
    isMobile,
    28,
    typewriterStartDelay,
  )

  /* ── Split displayed text back into highlight / body for coloring ── */
  const highlightLen = card.realityHighlight.length
  const displayedHighlight = displayed.slice(0, Math.min(highlightLen, displayed.length))
  const displayedBody = displayed.length > highlightLen
    ? displayed.slice(highlightLen)
    : ''

  return (
    <motion.article
      ref={cardRef as React.RefObject<HTMLElement>}
      variants={cardVariant}
      initial="hidden"
      animate={cardInView ? 'visible' : 'hidden'}
      className="group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'linear-gradient(145deg, #0d0d0d 0%, #1c1c1c 100%)',
        padding: 'clamp(28px, 4vw, 40px)',
        position: 'relative',
        overflow: 'hidden',
        willChange: 'transform, opacity',
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      }}
      whileHover={{
        borderColor: '#ff5a00',
        background: 'linear-gradient(145deg, #121212 0%, #242424 100%)',
        y: -8,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 24px rgba(255, 90, 0, 0.06)',
      }}
      transition={{ duration: 0.35, ease: EASE_OUT as [number, number, number, number] }}
    >
      {/* ── Orange edge glow (reveals on hover via CSS group trick — done with framer) ── */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(255,90,0,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Translucent Card Number ── */}
      <motion.span
        initial={{ opacity: 0, scale: 0.7 }}
        animate={cardInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: EASE_CINEMATIC }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '28px',
          fontFamily: 'var(--font-oswald)',
          fontSize: 'clamp(4rem, 6vw, 5rem)',
          fontWeight: 900,
          color: 'rgba(255, 255, 255, 0.03)',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
          zIndex: 0,
        }}
      >
        {formattedIndex}
      </motion.span>

      {/* ── Myth Row ── */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', zIndex: 1, minHeight: '56px', position: 'relative' }}>
        {/* Cross Icon — fades in slightly delayed */}
        <motion.div
          initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
          animate={cardInView ? { opacity: 1, rotate: 0, scale: 1 } : { opacity: 0, rotate: -45, scale: 0.5 }}
          transition={{ duration: 0.45, delay: 0.25 + index * 0.1, ease: EASE_CINEMATIC }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '2px solid rgba(113, 113, 122, 0.3)',
            color: 'rgba(113, 113, 122, 0.6)',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </motion.div>

        {/* Myth Text container */}
        <div style={{ flex: 1, paddingRight: '56px' }}>
          <p
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: '#71717a',
              margin: 0,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <span
              className="transition-[background-size] duration-[1000ms] ease-in-out bg-no-repeat inline"
              style={{
                backgroundImage: 'linear-gradient(transparent calc(50% - 1px), #71717a calc(50% - 1px), #71717a calc(50% + 1px), transparent calc(50% + 1px))',
                backgroundSize: cardInView ? '100% 100%' : '0% 100%',
                transitionDelay: `${strikeDelay}s`,
              }}
            >
              {card.myth}
            </span>
          </p>
        </div>
      </div>

      {/* ── Line 1: Bright Gradient Divider ── */}
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={cardInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.55, delay: 0.4 + index * 0.08, ease: EASE_CINEMATIC }}
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, #ff5a00 0%, transparent 100%)',
          marginTop: '28px',
          width: '100%',
          transformOrigin: 'left',
        }}
      />

      {/* ── Line 2: Dim Gradient Divider ── */}
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={cardInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.55, delay: 0.5 + index * 0.08, ease: EASE_CINEMATIC }}
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, rgba(255, 90, 0, 0.15) 0%, transparent 100%)',
          marginTop: '16px',
          marginBottom: '32px',
          width: '100%',
          transformOrigin: 'left',
        }}
      />

      {/* ── Reality Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.55 + index * 0.1, ease: EASE_CINEMATIC }}
        style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', zIndex: 1 }}
      >
        {/* Checkmark Icon with Glow — pops in with spring */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={cardInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.65 + index * 0.1, type: 'spring', stiffness: 220, damping: 16 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#ff5a00',
            boxShadow: '0 0 16px rgba(255, 90, 0, 0.5)',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>

        {/* Reality Content Container */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Reality Title with Line 3 */}
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <span
              style={{
                fontFamily: 'var(--font-oswald)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#ff5a00',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: 1,
              }}
            >
              Реальність
            </span>
            {/* Line 3: Title Gradient line — draws left-to-right */}
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={cardInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1, ease: EASE_CINEMATIC }}
              style={{
                flexGrow: 1,
                height: '1px',
                background: 'linear-gradient(90deg, rgba(255, 90, 0, 0.3) 0%, transparent 100%)',
                marginLeft: '16px',
                transformOrigin: 'left',
              }}
            />
          </div>

          {/* Reality Text — Desktop: static | Mobile: typewriter */}
          <p
            className={isMobile ? 'reality-text-mobile' : undefined}
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '0.925rem',
              lineHeight: 1.7,
              color: '#d4d4d8',
              margin: 0,
            }}
          >
            {isMobile ? (
              /* Mobile: character-by-character reveal with accent highlight */
              <>
                <span style={{ color: '#ff5a00', fontWeight: 700 }}>
                  {displayedHighlight}
                </span>
                {displayedBody}
                {/* Blinking cursor — visible only while typing */}
                {!isDone && (
                  <span className="typewriter-cursor" aria-hidden="true">
                    |
                  </span>
                )}
              </>
            ) : (
              /* Desktop: static full text */
              <>
                <span style={{ color: '#ff5a00', fontWeight: 700 }}>
                  {card.realityHighlight}
                </span>
                {card.realityText}
              </>
            )}
          </p>
        </div>
      </motion.div>
    </motion.article>
  )
}

/* ============================================================
   MAIN SECTION
   ============================================================ */

export default function MythsAndReality() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-8% 0px' })
  const isMobile = useIsMobile()

  return (
    <section
      ref={sectionRef}
      id="myths-and-reality"
      aria-label="Міфи та реальність про службу у 93 ОПТБ"
      style={{
        background: '#080808',
        padding: 'clamp(80px, 10vw, 160px) clamp(20px, 5vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Subtle background accent ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(400px, 60vw, 900px)',
          height: 'clamp(400px, 60vw, 900px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 90, 0, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <motion.div
        style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}
        variants={sectionVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* ── Section Header ── */}
        <div style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}>
          <motion.div
            className="tactical-tag mb-6 inline-flex items-center gap-2"
            variants={tagVariants}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff5a00]" />
            Факти замість страхів
          </motion.div>

          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              variants={headingVariants}
              style={{
                fontFamily: 'var(--font-oswald)',
                fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: '#ececec',
                textTransform: 'uppercase',
                display: 'inline-block',
                maxWidth: '900px',
              }}
            >
              {'МІФИ ТА '}
              <span style={{ color: '#ff5a00' }}>РЕАЛЬНІСТЬ</span>
            </motion.h2>
          </div>

          <motion.p
            variants={tagVariants}
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: '#71717a',
              marginTop: '16px',
              maxWidth: '560px',
            }}
          >
            Ми розбиваємо страхи фактами.
          </motion.p>
        </div>

        {/* ── Cards Grid ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={gridVariants}
        >
          {MYTHS.map((card, index) => (
            <MythCardItem
              key={card.id}
              card={card}
              index={index}
              isMobile={isMobile}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
