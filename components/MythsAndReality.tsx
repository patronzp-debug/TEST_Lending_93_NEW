'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

/* ============================================================
   DATA — Ukrainian only (spec_myths_and_reality.md)
   ============================================================ */

interface MythCard {
  id: string
  myth: string
  reality: string
}

const MYTHS: MythCard[] = [
  {
    id: 'myth-1',
    myth: 'Міф: Без військового досвіду я буду тягарем.',
    reality:
      '70% наших операторів прийшли з цивільних професій. Ви пройдете інтенсивну БЗВП та фахову підготовку з бойовими інструкторами. Ми вчимо з нуля.',
  },
  {
    id: 'myth-2',
    myth: 'Міф: Мене одразу відправлять на непідготовлений штурм.',
    reality:
      'Наша специфіка — точкова робота по бронетехніці ворога з підготовлених і замаскованих позицій, а також логістика та розвідка.',
  },
  {
    id: 'myth-3',
    myth: 'Міф: Цивільна професія в армії не потрібна.',
    reality:
      'Сучасний підрозділ — це механізм. Нам критично потрібні водії, електрики, інженери, механіки та айтішники для забезпечення роботи батальйону.',
  },
  {
    id: 'myth-4',
    myth: 'Міф: Доведеться купувати екіпірування за власні кошти.',
    reality:
      'Батальйон повністю забезпечує бійців сучасною амуніцією, засобами індивідуального захисту та необхідним обладнанням для виконання завдань.',
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

function MythCardItem({ card }: { card: MythCard }) {
  return (
    <motion.article
      variants={cardVariants}
      className="group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        background: '#1a1a1a',
        padding: 'clamp(24px, 3vw, 32px)',
        willChange: 'transform, opacity',
        transition: 'border-color 0.3s ease',
      }}
      whileHover={{
        borderColor: '#ff5a00',
      }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Myth text (struck-through) ── */}
      <p
        style={{
          fontFamily: 'var(--font-roboto-mono)',
          fontSize: '0.875rem',
          lineHeight: 1.7,
          color: '#71717a',
          textDecoration: 'line-through',
          textDecorationColor: 'rgba(113, 113, 122, 0.5)',
        }}
      >
        {card.myth}
      </p>

      {/* ── Divider ── */}
      <hr
        style={{
          border: 'none',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          margin: '20px 0',
        }}
      />

      {/* ── Reality row ── */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        {/* Icon */}
        <CheckCircle
          size={20}
          color="#ff5a00"
          strokeWidth={2}
          style={{ flexShrink: 0, marginTop: '2px' }}
          aria-hidden="true"
        />

        {/* Text */}
        <p
          style={{
            fontFamily: 'var(--font-roboto-mono)',
            fontSize: '0.875rem',
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
            Реальність:
          </span>{' '}
          {card.reality}
        </p>
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
          {MYTHS.map((card) => (
            <MythCardItem key={card.id} card={card} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
