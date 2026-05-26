'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Crosshair, Zap, Target, Shield } from 'lucide-react'
import type { ScrollTrigger as STType } from 'gsap/ScrollTrigger'

/* ============================================================
   EQUIPMENT DATA — Ukrainian only (spec_theme.md)
   ============================================================ */

interface EquipmentItem {
  id: string
  name: string
  description: string
  detail: string
  origin: string
  weaponClass: string
  icon: React.ElementType
  /** Asymmetric grid: 'wide' = 2 cols, 'tall' = 2 rows, 'standard' */
  span: 'wide' | 'tall' | 'standard'
}

const EQUIPMENT: EquipmentItem[] = [
  {
    id: 'eq1',
    name: 'ПТРК «Стугна-П»',
    description: 'Український протитанковий ракетний комплекс',
    detail: 'Дальність ураження до 5500 м. Напівавтоматичне лазерне наведення.',
    origin: 'Україна',
    weaponClass: 'ПТРК',
    icon: Crosshair,
    span: 'wide',
  },
  {
    id: 'eq2',
    name: 'FPV-дрони камікадзе',
    description: 'Високоточні удари по техніці',
    detail: 'Висока точність ураження. Дальність до 10 км. Власне виробництво.',
    origin: 'Власне виробництво',
    weaponClass: 'БПЛА',
    icon: Zap,
    span: 'tall',
  },
  {
    id: 'eq3',
    name: 'FGM-148 Javelin',
    description: 'Американський переносний ПТРК',
    detail: 'Fire-and-forget. Атака зверху по башті. Ефективний проти ДЗ.',
    origin: 'США',
    weaponClass: 'ПТРК',
    icon: Target,
    span: 'standard',
  },
  {
    id: 'eq4',
    name: 'БМП M2 Bradley',
    description: 'Бойова машина піхоти',
    detail: '25 мм автоматична гармата. Посилений броньований захист екіпажу.',
    origin: 'США',
    weaponClass: 'ББМ',
    icon: Shield,
    span: 'wide',
  },
]

/* ============================================================
   LARGE HUD CORNERS — more aggressive than Vacancies version
   ============================================================ */

function EquipmentHudCorners() {
  const base: React.CSSProperties = {
    position: 'absolute',
    width: '28px',
    height: '28px',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity 0.2s ease, transform 0.2s ease',
  }
  return (
    <>
      <span className="eq-hud eq-hud-tl" aria-hidden="true" style={{
        ...base, top: '10px', left: '10px',
        borderTop: '2px solid #ff5a00', borderLeft: '2px solid #ff5a00',
        transform: 'translate(6px, 6px)',
        boxShadow: '-2px -2px 8px rgba(255,90,0,0)',
        transition: 'opacity 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease',
      }} />
      <span className="eq-hud eq-hud-tr" aria-hidden="true" style={{
        ...base, top: '10px', right: '10px',
        borderTop: '2px solid #ff5a00', borderRight: '2px solid #ff5a00',
        transform: 'translate(-6px, 6px)',
        transition: 'opacity 0.22s ease 0.04s, transform 0.22s ease 0.04s, box-shadow 0.22s ease 0.04s',
      }} />
      <span className="eq-hud eq-hud-bl" aria-hidden="true" style={{
        ...base, bottom: '10px', left: '10px',
        borderBottom: '2px solid #ff5a00', borderLeft: '2px solid #ff5a00',
        transform: 'translate(6px, -6px)',
        transition: 'opacity 0.22s ease 0.08s, transform 0.22s ease 0.08s, box-shadow 0.22s ease 0.08s',
      }} />
      <span className="eq-hud eq-hud-br" aria-hidden="true" style={{
        ...base, bottom: '10px', right: '10px',
        borderBottom: '2px solid #ff5a00', borderRight: '2px solid #ff5a00',
        transform: 'translate(-6px, -6px)',
        transition: 'opacity 0.22s ease 0.12s, transform 0.22s ease 0.12s, box-shadow 0.22s ease 0.12s',
      }} />
    </>
  )
}

/* ============================================================
   SINGLE EQUIPMENT CARD
   ============================================================ */

interface CardProps {
  item: EquipmentItem
  index: number
}

function EquipmentCard({ item, index }: CardProps) {
  const Icon = item.icon

  return (
    /*
     * GSAP owns the *wrapper* (entrance: opacity, y, rotateX, scale).
     * Framer Motion owns the *article* (hover only).
     * Different elements → zero conflict.
     */
    <div
      id={`eq-card-${item.id}`}
      className="eq-card-wrapper"
      style={{
        opacity: 0,                        // GSAP will reveal
        willChange: 'transform, opacity',
        /* Asymmetric grid spans */
        ...(item.span === 'wide' ? { gridColumn: 'span 2' } : {}),
        ...(item.span === 'tall' ? { gridRow: 'span 2' } : {}),
      }}
    >
      <motion.article
        className="equipment-card group"
        style={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid #1e1e1e',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          cursor: 'default',
          display: 'flex',
          flexDirection: 'column',
        }}
        whileHover={{
          borderColor: 'rgba(255,90,0,0.5)',
          boxShadow: [
            '0 0 0 1px rgba(255,90,0,0.2)',
            '0 12px 50px rgba(255,90,0,0.15)',
            '0 30px 80px rgba(0,0,0,0.7)',
          ].join(', '),
          transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
        }}
      >
        <EquipmentHudCorners />

        {/* Top accent line */}
        <span
          aria-hidden="true"
          className="eq-top-line"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,90,0,0.0), transparent)',
            transition: 'background 0.3s ease',
          }}
        />

        {/* ── Media Placeholder (zooms on hover) ── */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
            aspectRatio: item.span === 'tall' ? '3/4' : item.span === 'wide' ? '21/9' : '4/3',
            background: `
              linear-gradient(
                135deg,
                rgba(255,90,0,0.04) 0%,
                rgba(0,0,0,0) 50%,
                rgba(255,90,0,0.02) 100%
              ),
              #0d0d0d
            `,
          }}
        >
          {/* Inner image that scales independently on hover */}
          <motion.div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '12px',
              willChange: 'transform',
            }}
            whileHover={{ scale: 1.06, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
          >
            <Icon
              size={item.span === 'wide' ? 40 : 32}
              color="rgba(255,90,0,0.2)"
              strokeWidth={1}
              aria-hidden="true"
            />
            {/* Crosshair grid lines */}
            <svg
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#ff5a00" strokeWidth="0.5" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#ff5a00" strokeWidth="0.5" />
              <circle cx="50%" cy="50%" r="18%" stroke="#ff5a00" strokeWidth="0.5" fill="none" />
            </svg>
          </motion.div>

          {/* Scan-line texture overlay */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.25) 3px, rgba(0,0,0,0.25) 4px)',
              opacity: 0.5,
            }}
          />

          {/* Weapon class badge */}
          <div
            style={{
              position: 'absolute', top: '12px', left: '12px',
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              color: '#ff5a00',
              background: 'rgba(8,8,8,0.8)',
              border: '1px solid rgba(255,90,0,0.3)',
              padding: '2px 8px',
              backdropFilter: 'blur(4px)',
            }}
          >
            {item.weaponClass}
          </div>

          {/* Origin badge */}
          <div
            style={{
              position: 'absolute', top: '12px', right: '12px',
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.15em',
              color: '#3a3a3a',
              background: 'rgba(8,8,8,0.7)',
              padding: '2px 8px',
            }}
          >
            {item.origin}
          </div>

          {/* Index */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', bottom: '10px', right: '14px',
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '0.5rem',
              color: '#2a2a2a',
              letterSpacing: '0.1em',
            }}
          >
            0{index + 1} / 0{EQUIPMENT.length}
          </div>
        </div>

        {/* ── Text content ── */}
        <div
          style={{
            padding: 'clamp(18px, 2vw, 28px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flex: 1,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: 'clamp(1.1rem, 2vw, 1.45rem)',
              fontWeight: 700,
              color: '#ececec',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
            }}
          >
            {item.name}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: 'clamp(0.68rem, 1vw, 0.78rem)',
              color: '#8a8a8a',
              lineHeight: 1.6,
            }}
          >
            {item.description}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: 'clamp(0.6rem, 0.9vw, 0.68rem)',
              color: '#4a4a4a',
              lineHeight: 1.6,
              marginTop: '4px',
            }}
          >
            {item.detail}
          </p>
        </div>
      </motion.article>
    </div>
  )
}

/* ============================================================
   SECTION HEADER with glow/glitch on H2
   ============================================================ */

function SectionHeader({ inView }: { inView: boolean }) {
  return (
    <div style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}>
      <motion.div
        className="inline-flex items-center gap-2 tactical-tag mb-6"
        initial={{ opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a00] animate-pulse" />
        Озброєння та техніка
      </motion.div>

      {/* H2 with orange glow + subtle glitch on animate-in */}
      <div style={{ overflow: 'hidden' }}>
        <motion.h2
          className="eq-heading"
          style={{
            fontFamily: 'var(--font-oswald)',
            fontSize: 'clamp(2.6rem, 6.5vw, 5.5rem)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            color: '#ececec',
            textTransform: 'uppercase',
            display: 'inline-block',
          }}
          initial={{ y: '105%', opacity: 0 }}
          animate={inView ? { y: '0%', opacity: 1 } : { y: '105%', opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Арсенал знищення"
        >
          {'АРСЕНАЛ '}
          <span style={{ color: '#ff5a00' }}>ЗНИЩЕННЯ</span>
        </motion.h2>
      </div>

      <motion.p
        style={{
          fontFamily: 'var(--font-roboto-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.18em',
          color: '#4a4a4a',
          textTransform: 'uppercase',
          marginTop: '16px',
        }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {EQUIPMENT.length} одиниці техніки · Бойовий склад підрозділу
      </motion.p>
    </div>
  )
}

/* ============================================================
   MAIN EQUIPMENT SECTION
   ============================================================ */

export default function Equipment() {
  const sectionRef = useRef<HTMLElement>(null)
  const stInstances = useRef<STType[]>([])
  const [headerInView, setHeaderInView] = useState(false)

  useEffect(() => {
    let mounted = true
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeaderInView(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => { mounted = false; obs.disconnect() }
  }, [])

  /* ---- GSAP 3D card entrance ---- */
  useEffect(() => {
    let mounted = true

    async function initGSAP() {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (!mounted) return

      gsap.registerPlugin(ScrollTrigger)

      // Set perspective on the grid container for rotateX to look 3D
      const grid = document.getElementById('equipment-grid')
      if (grid) gsap.set(grid, { perspective: 900 })

      // Batch: all cards animate in with stagger when entering viewport
      const cards = gsap.utils.toArray<HTMLElement>('.eq-card-wrapper')

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 70,
            rotateX: 18,
            scale: 0.9,
            transformOrigin: 'center bottom',
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            ease: 'power3.out',
            duration: 0.9,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              once: true,
            },
            delay: i * 0.1,
          }
        )
      })

      // Collect all STs we created (one per card)
      ScrollTrigger.getAll().forEach(st => {
        if (!stInstances.current.includes(st)) {
          // Only collect our own — check by trigger element
          if (cards.some(c => st.trigger === c)) {
            stInstances.current.push(st)
          }
        }
      })
    }

    // Small delay so DOM is painted before GSAP queries elements
    const timeout = setTimeout(initGSAP, 60)

    return () => {
      mounted = false
      clearTimeout(timeout)
      stInstances.current.forEach(st => st.kill())
      stInstances.current = []
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="equipment"
      aria-label="Арсенал знищення"
      style={{
        background: '#080808',
        padding: 'clamp(80px, 10vw, 160px) clamp(20px, 5vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow — top-right this time for visual variety */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,90,0,0.05) 0%, transparent 65%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeader inView={headerInView} />

        {/* ── Asymmetric Equipment Grid ──
            Desktop 3 cols:
            Row 1: [Стугна-П — wide 2col][FPV — tall 1col spans 2 rows]
            Row 2: [Javelin — 1col]       [FPV continues]
            Row 3: [Bradley — wide 2col spans last]
        */}
        <div
          id="equipment-grid"
          className="equipment-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridAutoRows: 'minmax(300px, auto)',
            gap: 'clamp(10px, 1.4vw, 18px)',
          }}
        >
          {EQUIPMENT.map((item, i) => (
            <EquipmentCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
