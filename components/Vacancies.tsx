'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'

/* ============================================================
   DATA — Ukrainian only per spec_theme.md
   ============================================================ */

interface Vacancy {
  id: string
  title: string
  category: string
  requirement: string
  /** Bento span hint: 'wide' | 'tall' | 'standard' */
  span: 'wide' | 'tall' | 'standard'
  /** Tactical threat-level accent label */
  priority: 'КРИТИЧНО' | 'ТЕРМІНОВО' | 'НАБІР'
}

const VACANCIES: Vacancy[] = [
  {
    id: 'v1',
    title: 'Оператор ПТРК',
    category: 'Бойова',
    requirement: 'Базова фізична підготовка',
    span: 'wide',
    priority: 'КРИТИЧНО',
  },
  {
    id: 'v2',
    title: 'Механік-водій',
    category: 'Ремонт',
    requirement: 'Розуміння ДВЗ та ходової',
    span: 'tall',
    priority: 'ТЕРМІНОВО',
  },
  {
    id: 'v3',
    title: 'Бойовий медик',
    category: 'Медицина',
    requirement: 'Профільна медична освіта',
    span: 'standard',
    priority: 'НАБІР',
  },
  {
    id: 'v4',
    title: 'Оператор БПЛА',
    category: 'Технічна',
    requirement: 'Досвід керування дронами',
    span: 'standard',
    priority: 'КРИТИЧНО',
  },
]

/* ============================================================
   HUD CORNER BRACKETS — appear on hover
   ============================================================ */

function HudCorners() {
  return (
    <>
      {/* Top-Left */}
      <span
        className="hud-corner hud-tl absolute top-3 left-3 w-5 h-5 pointer-events-none"
        aria-hidden="true"
        style={{
          borderTop: '2px solid #ff5a00',
          borderLeft: '2px solid #ff5a00',
          opacity: 0,
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          transform: 'translate(4px, 4px)',
        }}
      />
      {/* Top-Right */}
      <span
        className="hud-corner hud-tr absolute top-3 right-3 w-5 h-5 pointer-events-none"
        aria-hidden="true"
        style={{
          borderTop: '2px solid #ff5a00',
          borderRight: '2px solid #ff5a00',
          opacity: 0,
          transition: 'opacity 0.25s ease 0.04s, transform 0.25s ease 0.04s',
          transform: 'translate(-4px, 4px)',
        }}
      />
      {/* Bottom-Left */}
      <span
        className="hud-corner hud-bl absolute bottom-3 left-3 w-5 h-5 pointer-events-none"
        aria-hidden="true"
        style={{
          borderBottom: '2px solid #ff5a00',
          borderLeft: '2px solid #ff5a00',
          opacity: 0,
          transition: 'opacity 0.25s ease 0.08s, transform 0.25s ease 0.08s',
          transform: 'translate(4px, -4px)',
        }}
      />
      {/* Bottom-Right */}
      <span
        className="hud-corner hud-br absolute bottom-3 right-3 w-5 h-5 pointer-events-none"
        aria-hidden="true"
        style={{
          borderBottom: '2px solid #ff5a00',
          borderRight: '2px solid #ff5a00',
          opacity: 0,
          transition: 'opacity 0.25s ease 0.12s, transform 0.25s ease 0.12s',
          transform: 'translate(-4px, -4px)',
        }}
      />
    </>
  )
}

/* ============================================================
   SINGLE VACANCY CARD
   ============================================================ */

interface CardProps {
  vacancy: Vacancy
  index: number
  inView: boolean
}

function VacancyCard({ vacancy, index, inView }: CardProps) {
  const priorityColor =
    vacancy.priority === 'КРИТИЧНО'
      ? '#ff2200'
      : vacancy.priority === 'ТЕРМІНОВО'
      ? '#ff5a00'
      : '#8a8a8a'

  return (
    <motion.article
      className="vacancy-card group relative overflow-hidden rounded-none"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid #222222',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        willChange: 'transform',
        /* Bento tall card fills row height */
        ...(vacancy.span === 'tall' ? { gridRow: 'span 2' } : {}),
        ...(vacancy.span === 'wide' ? { gridColumn: 'span 2' } : {}),
      }}
      /* ── Stagger entrance from below ── */
      initial={{ opacity: 0, y: 48, filter: 'blur(6px)' }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, y: 48, filter: 'blur(6px)' }
      }
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      /* ── HUD 'Захват цілі' hover ── */
      whileHover={{
        scale: 1.025,
        borderColor: 'rgba(255,90,0,0.45)',
        boxShadow:
          '0 0 0 1px rgba(255,90,0,0.15), 0 8px 40px rgba(255,90,0,0.12), 0 24px 80px rgba(0,0,0,0.6)',
        transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
      }}
      whileTap={{ scale: 0.99 }}
    >
      {/* HUD corner brackets */}
      <HudCorners />

      {/* Subtle top-edge accent line */}
      <span
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,90,0,0.6), transparent)',
        }}
      />

      {/* ── Card inner content ── */}
      <div
        className="relative z-10 flex flex-col h-full"
        style={{ padding: 'clamp(28px, 3vw, 44px)' }}
      >
        {/* ── Top row: Title (left) + Category (right) ── */}
        <div className="flex items-start justify-between gap-4 mb-auto">
          {/* Title — H3, Oswald */}
          <h3
            className="text-white font-bold uppercase leading-tight"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: 'clamp(1.4rem, 2.8vw, 2rem)',
              letterSpacing: '-0.01em',
              maxWidth: '75%',
            }}
          >
            {vacancy.title}
          </h3>

          {/* Category pill — top right, #ff5a00 */}
          <span
            className="shrink-0 text-[#ff5a00] uppercase tracking-widest"
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.18em',
              border: '1px solid rgba(255,90,0,0.35)',
              background: 'rgba(255,90,0,0.07)',
              padding: '3px 10px',
              lineHeight: 1.8,
              whiteSpace: 'nowrap',
            }}
          >
            {vacancy.category}
          </span>
        </div>

        {/* ── Spacer (tall cards feel more breathable) ── */}
        <div style={{ minHeight: vacancy.span === 'tall' ? '80px' : '40px' }} />

        {/* ── Bottom row: Requirement (left) + Priority badge + Button (right) ── */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          {/* Requirement — bottom right quadrant per spec */}
          <div className="flex flex-col gap-1.5">
            <span
              className="text-[#4a4a4a] uppercase tracking-[0.15em]"
              style={{
                fontFamily: 'var(--font-roboto-mono)',
                fontSize: '0.55rem',
                letterSpacing: '0.18em',
              }}
            >
              Вимоги
            </span>
            <p
              className="text-[#8a8a8a]"
              style={{
                fontFamily: 'var(--font-roboto-mono)',
                fontSize: 'clamp(0.7rem, 1.1vw, 0.8rem)',
                lineHeight: 1.5,
              }}
            >
              {vacancy.requirement}
            </p>
          </div>

          {/* Priority + CTA */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            {/* Priority badge */}
            <span
              style={{
                fontFamily: 'var(--font-roboto-mono)',
                fontSize: '0.55rem',
                letterSpacing: '0.2em',
                color: priorityColor,
                opacity: 0.85,
              }}
            >
              ● {vacancy.priority}
            </span>

            {/* CTA Button */}
            <Button
              id={`apply-${vacancy.id}`}
              className="vacancy-apply-btn group/btn relative overflow-hidden border text-white uppercase tracking-[0.15em] text-xs"
              style={{
                fontFamily: 'var(--font-roboto-mono)',
                fontSize: '0.65rem',
                padding: '10px 20px',
                background: 'transparent',
                borderColor: 'rgba(255,255,255,0.15)',
                borderRadius: '1px',
                height: 'auto',
                letterSpacing: '0.15em',
                transition:
                  'border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Відгукнутися
                <ArrowUpRight
                  size={12}
                  className="opacity-50 group-hover/btn:opacity-100 transition-all duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

/* ============================================================
   SECTION HEADER — staggered word reveal
   ============================================================ */

const headerWords = ['Відкриті', 'Позиції']

function SectionHeader({ inView }: { inView: boolean }) {
  return (
    <div className="mb-16 md:mb-20">
      {/* Tactical label */}
      <motion.div
        className="inline-flex items-center gap-2 tactical-tag mb-6"
        initial={{ opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a00] animate-pulse" />
        Етап 3 / Рекрутинг
      </motion.div>

      {/* H2 with word-by-word reveal */}
      <h2
        className="flex flex-wrap gap-x-4 overflow-hidden"
        style={{
          fontFamily: 'var(--font-oswald)',
          fontSize: 'clamp(2.6rem, 6vw, 5.5rem)',
          fontWeight: 700,
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
          color: '#ececec',
          textTransform: 'uppercase',
        }}
        aria-label="Відкриті Позиції"
      >
        {headerWords.map((word, i) => (
          <span key={word} className="overflow-hidden inline-block">
            <motion.span
              className="inline-block"
              initial={{ y: '105%', opacity: 0 }}
              animate={
                inView
                  ? { y: '0%', opacity: 1 }
                  : { y: '105%', opacity: 0 }
              }
              transition={{
                duration: 0.65,
                delay: 0.1 + i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {i === 1 ? (
                <span style={{ color: '#ff5a00' }}>{word}</span>
              ) : (
                word
              )}
            </motion.span>
          </span>
        ))}
      </h2>

      {/* Subtitle */}
      <motion.p
        className="mt-4 text-[#4a4a4a] uppercase tracking-[0.2em]"
        style={{
          fontFamily: 'var(--font-roboto-mono)',
          fontSize: 'clamp(0.6rem, 1vw, 0.7rem)',
        }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {VACANCIES.length} активних позицій · 93 ОПТБ
      </motion.p>
    </div>
  )
}

/* ============================================================
   MAIN VACANCIES SECTION
   ============================================================ */

export default function Vacancies() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-10% 0px' })

  return (
    <section
      ref={sectionRef}
      id="vacancies"
      aria-label="Відкриті позиції"
      style={{
        background: '#080808',
        padding: 'clamp(80px, 10vw, 160px) clamp(20px, 5vw, 80px)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <SectionHeader inView={inView} />

        {/* ── Asymmetric Bento Grid ── */}
        <div
          className="vacancies-grid"
          style={{
            display: 'grid',
            /*
              Desktop:  3 equal columns
              wide card spans 2 cols → takes full top-left area
              tall card spans 2 rows → right column fills vertically
              Mobile:   1 column (overridden via CSS class below)
            */
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridAutoRows: 'minmax(260px, auto)',
            gap: 'clamp(12px, 1.5vw, 20px)',
          }}
        >
          {VACANCIES.map((vacancy, i) => (
            <VacancyCard
              key={vacancy.id}
              vacancy={vacancy}
              index={i}
              inView={inView}
            />
          ))}
        </div>

        {/* ── Bottom CTA bar ── */}
        <motion.div
          className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[#1a1a1a] pt-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <p
            className="text-[#4a4a4a] text-center sm:text-left"
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
            }}
          >
            Не знайшли відповідну позицію? Залиште заявку —<br className="hidden sm:block" />
            ми зв'яжемося, коли відкриється підходяща вакансія.
          </p>
          <Button
            id="vacancies-general-apply"
            className="shrink-0 uppercase tracking-[0.2em] text-white border border-[#ff5a00] bg-transparent hover:bg-[#ff5a00]/10"
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '0.65rem',
              padding: '12px 32px',
              borderRadius: '1px',
              height: 'auto',
              letterSpacing: '0.18em',
              boxShadow: '0 0 20px rgba(255,90,0,0.1)',
              transition: 'box-shadow 0.3s ease, background 0.3s ease',
            }}
          >
            Загальна заявка
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
