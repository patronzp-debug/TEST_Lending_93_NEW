'use client'

import { useRef } from 'react'
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
    myth: 'Мене одразу відправлять на непідготовлений штурм.',
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
   ANIMATION VARIANTS
   ============================================================ */

const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const

const sectionVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.25,
    },
  },
}

const headingVariants = {
  hidden: { y: '105%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: EASE_CINEMATIC,
    },
  },
}

const tagVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: EASE_CINEMATIC,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASE_CINEMATIC,
    },
  },
}

/* ============================================================
   SINGLE MYTH CARD
   ============================================================ */

function MythCardItem({ card, index }: { card: MythCard; index: number }) {
  const formattedIndex = String(index + 1).padStart(2, '0')
  return (
    <motion.article
      variants={cardVariants}
      className="group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'linear-gradient(145deg, #0d0d0d 0%, #1c1c1c 100%)',
        padding: 'clamp(32px, 4vw, 40px)',
        position: 'relative',
        overflow: 'hidden',
        willChange: 'transform, opacity',
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      }}
      whileHover={{
        borderColor: '#ff5a00',
        background: 'linear-gradient(145deg, #121212 0%, #242424 100%)',
        y: -8,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 24px rgba(255, 90, 0, 0.04)',
      }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Translucent Card Number ── */}
      <span
        style={{
          position: 'absolute',
          top: '24px',
          right: '32px',
          fontFamily: 'var(--font-oswald)',
          fontSize: 'clamp(4rem, 6vw, 5rem)',
          fontWeight: 900,
          color: 'rgba(255, 255, 255, 0.02)',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
        }}
      >
        {formattedIndex}
      </span>

      {/* ── Myth Row ── */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', zIndex: 1, minHeight: '56px' }}>
        {/* Cross Icon */}
        <div
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
        </div>

        {/* Myth Text */}
        <p
          style={{
            fontFamily: 'var(--font-roboto-mono)',
            fontSize: '1rem',
            lineHeight: 1.6,
            color: '#71717a',
            textDecoration: 'line-through',
            textDecorationColor: 'rgba(113, 113, 122, 0.4)',
            margin: 0,
            paddingRight: '60px',
          }}
        >
          {card.myth}
        </p>
      </div>

      {/* ── Line 1: Bright Gradient Divider ── */}
      <div
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, #ff5a00 0%, transparent 100%)',
          marginTop: '28px',
          width: '100%',
        }}
      />

      {/* ── Line 2: Dim Gradient Divider ── */}
      <div
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, rgba(255, 90, 0, 0.15) 0%, transparent 100%)',
          marginTop: '16px',
          marginBottom: '32px',
          width: '100%',
        }}
      />

      {/* ── Reality Section ── */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', zIndex: 1 }}>
        {/* Checkmark Icon with Glow */}
        <div
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
        </div>

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
            {/* Line 3: Title Gradient line */}
            <div
              style={{
                flexGrow: 1,
                height: '1px',
                background: 'linear-gradient(90deg, rgba(255, 90, 0, 0.3) 0%, transparent 100%)',
                marginLeft: '16px',
              }}
            />
          </div>

          {/* Reality Text */}
          <p
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '0.925rem',
              lineHeight: 1.7,
              color: '#d4d4d8',
              margin: 0,
            }}
          >
            <span
              style={{
                color: '#ff5a00',
                fontWeight: 700,
              }}
            >
              {card.realityHighlight}
            </span>
            {card.realityText}
          </p>
        </div>
      </div>
    </motion.article>
  )
}

/* ============================================================
   MAIN SECTION
   ============================================================ */

export default function MythsAndReality() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-8% 0px' })

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
          background:
            'radial-gradient(circle, rgba(255, 90, 0, 0.04) 0%, transparent 70%)',
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
          variants={sectionVariants}
        >
          {MYTHS.map((card, index) => (
            <MythCardItem key={card.id} card={card} index={index} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
