'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/* ============================================================
   SMART WAR DATA — Ukrainian only (spec_theme.md)
   ============================================================ */

interface SmartWarCard {
  id: string
  title: string
  description: string
  videoSrc?: string
}

const CARDS: SmartWarCard[] = [
  {
    id: 'sw1',
    title: 'СУЧАСНЕ ОЗБРОЄННЯ',
    description:
      'Робота з передовими протитанковими ракетними комплексами (Стугна, Javelin). Точність та ефективність на великих дистанціях.',
    videoSrc: '/videos/SmartWar_video/1_weapons.webm',
  },
  {
    id: 'sw2',
    title: 'БЕЗПІЛОТНІ СИСТЕМИ',
    description:
      'Використання БПЛА для розвідки, коригування вогню та об\u2019єктивного контролю. Очі підрозділу в небі.',
    videoSrc: '/videos/SmartWar_video/2_BPLA.webm',
  },
  {
    id: 'sw3',
    title: 'ЗВ\u2019ЯЗОК ТА РЕБ',
    description:
      'Забезпечення закритого цифрового зв\u2019язку та робота з комплексами радіоелектронної боротьби для захисту позицій.',
    videoSrc: '/videos/SmartWar_video/3_paroramming.webm',
  },
  {
    id: 'sw4',
    title: 'ЛОГІСТИКА ТА ЗАБЕЗПЕЧЕННЯ',
    description:
      'Складні логістичні ланцюги. Управління транспортом та безперебійне постачання боєкомплекту на позиції.',
    videoSrc: '/videos/SmartWar_video/4_logistic.webm',
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
   SINGLE CARD
   ============================================================ */

function Card({ card }: { card: SmartWarCard }) {
  return (
    <motion.article
      variants={cardVariants}
      className="smart-war-card group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'transparent',
        overflow: 'hidden',
        willChange: 'transform, opacity',
        transition: 'border-color 0.3s ease',
      }}
    >
      {/* ── Media (video or placeholder) ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'rgba(39, 39, 42, 0.5)',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          flexShrink: 0,
        }}
      >
        {card.videoSrc ? (
          <video
            className="transform-gpu will-change-transform"
            src={card.videoSrc}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          >
            <track kind="captions" srcLang="uk" label="Ukrainian" />
          </video>
        ) : (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#52525b',
              userSelect: 'none',
              fontFamily: 'var(--font-roboto-mono)',
            }}
          >
            Місце для фото
          </span>
        )}
      </div>

      {/* ── Text Content ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 20px 24px',
          gap: '12px',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-oswald)',
            fontWeight: 700,
            fontSize: '1.125rem',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            color: '#ffffff',
          }}
        >
          {card.title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-roboto-mono)',
            fontSize: '0.875rem',
            lineHeight: 1.65,
            color: '#a1a1aa',
          }}
        >
          {card.description}
        </p>
      </div>
    </motion.article>
  )
}

/* ============================================================
   MAIN SECTION
   ============================================================ */

export default function SmartWar() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-8% 0px' })

  return (
    <section
      ref={sectionRef}
      id="smart-war"
      aria-label="Війна змінилася. Ми шукаємо інтелект."
      style={{
        background: '#080808',
        padding: 'clamp(80px, 10vw, 160px) clamp(20px, 5vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
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
            Інтелект на полі бою
          </motion.div>

          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              variants={headingVariants}
              style={{
                fontFamily: 'var(--font-oswald)',
                fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
                color: '#ececec',
                textTransform: 'uppercase',
                display: 'inline-block',
                maxWidth: '900px',
              }}
            >
              {'ВІЙНА ЗМІНИЛАСЯ. '}
              <br className="hidden sm:block" />
              {'МИ ШУКАЄМО '}
              <span style={{ color: '#ff5a00' }}>ІНТЕЛЕКТ</span>
              {'.'}
            </motion.h2>
          </div>

          <motion.p
            variants={tagVariants}
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.18em',
              color: '#4a4a4a',
              textTransform: 'uppercase',
              marginTop: '16px',
            }}
          >
            {CARDS.length} напрямки · Сучасний бойовий підрозділ
          </motion.p>
        </div>

        {/* ── Cards Grid ── */}
        <motion.div
          className="smart-war-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: '24px',
          }}
          variants={sectionVariants}
        >
          {CARDS.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
