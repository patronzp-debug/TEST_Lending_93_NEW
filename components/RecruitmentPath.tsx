'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

/* ============================================================
   ДАНІ КРОКІВ — Ukrainian only (spec_theme.md)
   ============================================================ */

const STEPS = [
  {
    index: 1,
    tag: 'КРОК 01',
    shortLabel: 'Заявка',
    title: 'Подача заявки',
    description:
      "Заповни коротку форму на сайті або зв'яжись з нами напряму. Ми працюємо на пряму. Всі ваші дані конфіденційні — не передаємо третім особам(ТЦК) тощо.",
    image: '/images/recruitment_path/1 step.webp',
    bgGradient: 'linear-gradient(135deg, #f8f5f2 0%, #ede8e0 100%)',
  },
  {
    index: 2,
    tag: 'КРОК 02',
    shortLabel: 'Дзвінок',
    title: 'Дзвінок рекрутера',
    description:
      "Рекрутер зв'язується з вами та проводить консультацію. Ми розповімо про умови служби, завдання та відповімо на всі ваші питання.",
    image: '/images/recruitment_path/2 step.webp',
    bgGradient: 'linear-gradient(135deg, #f2f5f8 0%, #e0e8ed 100%)',
  },
  {
    index: 3,
    tag: 'КРОК 03',
    shortLabel: 'Підбір вакансії',
    title: 'Підбір вакансії',
    description:
      'Разом з рекрутером визначаємо найбільш відповідну вакансію зважаючи на твій досвід, навички та фізичну підготовку.',
    image: '/images/recruitment_path/3 step.webp',
    bgGradient: 'linear-gradient(135deg, #f5f8f2 0%, #e8ede0 100%)',
  },
  {
    index: 4,
    tag: 'КРОК 04',
    shortLabel: 'Злагодження',
    title: 'Базова підготовка',
    description:
      'БЗВП — базова військова підготовка. Проходження базової підготовки тривалістю 45 днів. Отримання первинних тактичних навичок у складі підрозділу',
    image: '/images/recruitment_path/4 step.webp',
    bgGradient: 'linear-gradient(135deg, #f8f2f0 0%, #ede0e0 100%)',
  },
  {
    index: 5,
    tag: 'КРОК 05',
    shortLabel: 'Служба',
    title: 'Початок служби',
    description:
      'Ти стаєш частиною 93-го ОПТБ. Виконання бойових (спеціальних) завдань у складі досвідченої команди. Разом з нами до Перемоги.',
    image: '/images/recruitment_path/5 step.webp',
    bgGradient: 'linear-gradient(135deg, #f5f0f8 0%, #e8e0ed 100%)',
  },
] as const

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ============================================================
   MOBILE TIMELINE — вертикальна лінія + кроки
   ============================================================ */

function MobileTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 30%'],
  })

  // Висота оранжевої лінії 0→100% у міру скролу
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      const idx = Math.min(
        Math.floor(v * STEPS.length),
        STEPS.length - 1
      )
      setActiveIndex(v > 0 ? idx : -1)
    })
    return unsubscribe
  }, [scrollYProgress])

  return (
    <div ref={containerRef} style={{ position: 'relative', paddingLeft: '40px' }}>
      {/* Трек лінії */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '14px',
          top: '8px',
          bottom: '8px',
          width: '2px',
          background: '#e8e8e8',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            width: '100%',
            height: lineHeight,
            background: '#ff5a00',
            borderRadius: '2px',
            transformOrigin: 'top center',
          }}
        />
      </div>

      {/* Кроки */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {STEPS.map((step, i) => {
          const isActive = i === activeIndex
          const isDone = i < activeIndex

          return (
            <div
              key={step.index}
              style={{
                position: 'relative',
                paddingBottom: i < STEPS.length - 1 ? 'clamp(36px, 6vw, 52px)' : 0,
              }}
            >
              {/* Dot */}
              <motion.div
                aria-hidden="true"
                animate={{
                  backgroundColor: isDone || isActive ? '#ff5a00' : '#d0d0d0',
                  scale: isActive ? 1.35 : 1,
                  boxShadow: isActive
                    ? '0 0 0 5px rgba(255,90,0,0.12), 0 0 18px rgba(255,90,0,0.28)'
                    : 'none',
                }}
                transition={{ duration: 0.45, ease: EASE }}
                style={{
                  position: 'absolute',
                  left: '-33px',
                  top: '3px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  border: '2px solid #ffffff',
                  zIndex: 1,
                }}
              />

              {/* Контент кроку */}
              <motion.div
                animate={{ opacity: isActive || isDone ? 1 : 0.4 }}
                transition={{ duration: 0.45 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                <motion.span
                  animate={{ color: isActive ? '#ff5a00' : '#777777' }}
                  transition={{ duration: 0.35 }}
                  style={{
                    fontFamily: 'var(--font-roboto-mono)',
                    fontSize: '0.58rem',
                    fontWeight: 500,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  {step.tag}
                </motion.span>

                <motion.h3
                  animate={{ color: isActive ? '#080808' : isDone ? '#3a3a3a' : '#777777' }}
                  transition={{ duration: 0.4 }}
                  style={{
                    fontFamily: 'var(--font-oswald)',
                    fontSize: 'clamp(1.15rem, 4vw, 1.5rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    textTransform: 'uppercase',
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  {step.title}
                </motion.h3>

                <motion.p
                  animate={{ color: isActive ? '#666666' : '#777777' }}
                  transition={{ duration: 0.4 }}
                  style={{
                    fontFamily: 'var(--font-roboto-mono)',
                    fontSize: 'clamp(0.68rem, 1.4vw, 0.8rem)',
                    lineHeight: 1.75,
                    margin: 0,
                    maxWidth: '480px',
                  }}
                >
                  {step.description}
                </motion.p>
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ============================================================
   DESKTOP IMAGE PANEL — sticky з preloaded cross-fade
   ============================================================ */

function DesktopImagePanel({ activeIndex }: { activeIndex: number }) {
  const step = STEPS[activeIndex] ?? STEPS[0]

  return (
    <div className="sticky top-[120px] h-[70vh] w-full flex items-center justify-center">
      <div className="relative h-full w-full overflow-hidden bg-[#f0f0f0]">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: step.bgGradient }}
        />

        {STEPS.map((imageStep, i) => (
          <motion.div
            key={imageStep.index}
            aria-hidden={i !== activeIndex}
            animate={{ opacity: i === activeIndex ? 1 : 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="absolute inset-0"
            style={{ zIndex: i === activeIndex ? 2 : 1 }}
          >
            <Image
              src={imageStep.image}
              alt={imageStep.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="eager"
              preload={i === 0}
              className="object-cover"
            />
          </motion.div>
        ))}

        <div
          className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-4"
          style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.9) 0%, transparent 100%)' }}
        >
          <span
            className="border px-2 py-0.5 uppercase"
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '0.56rem',
              letterSpacing: '0.2em',
              color: '#ff5a00',
              borderColor: 'rgba(255,90,0,0.3)',
              background: 'rgba(255,90,0,0.06)',
            }}
          >
            {step.tag}
          </span>
          <span
            className="uppercase"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#080808',
            }}
          >
            {step.shortLabel}
          </span>
        </div>
      </div>

      {/* Progress dots */}
      <div
        role="tablist"
        aria-label="Прогрес кроків"
        className="absolute bottom-[-24px] left-1 flex gap-2"
      >
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            role="tab"
            aria-selected={i === activeIndex}
            animate={{
              backgroundColor:
                i === activeIndex ? '#ff5a00' : i < activeIndex ? 'rgba(255,90,0,0.35)' : '#d8d8d8',
              scale: i === activeIndex ? 1.5 : 1,
            }}
            transition={{ duration: 0.35 }}
            className="h-1.5 w-1.5 rounded-full"
          />
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   DESKTOP STEP ITEM — права колонка
   ============================================================ */

function DesktopStepItem({
  step,
  index,
  isActive,
  isLast,
  setRef,
}: {
  step: (typeof STEPS)[number]
  index: number
  isActive: boolean
  isLast: boolean
  setRef: (node: HTMLDivElement | null) => void
}) {
  return (
    <motion.div
      ref={setRef}
      data-step-index={index}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.7, ease: EASE }}
      className="min-h-[70vh] flex flex-col justify-center py-12"
    >
      <div className="flex gap-6">
        {/* Індикатор: dot + вертикальна лінія */}
        <div className="flex shrink-0 flex-col items-center pt-[5px]">
          <motion.div
            animate={{
              backgroundColor: isActive ? '#ff5a00' : '#d4d4d4',
              scale: isActive ? 1.4 : 1,
              boxShadow: isActive
                ? '0 0 0 7px rgba(255,90,0,0.1), 0 0 22px rgba(255,90,0,0.3)'
                : 'none',
            }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: '2px solid #ffffff',
              flexShrink: 0,
              zIndex: 1,
            }}
          />
          {!isLast && (
            <motion.div
              animate={{ backgroundColor: isActive ? '#ff5a00' : '#e4e4e4' }}
              transition={{ duration: 0.45 }}
              className="mt-2 min-h-12 w-0.5 flex-1 rounded-sm"
            />
          )}
        </div>

        {/* Текст */}
        <div className="flex flex-1 flex-col gap-2.5">
          <motion.span
            animate={{ color: isActive ? '#ff5a00' : '#777777' }}
            transition={{ duration: 0.35 }}
            className="uppercase"
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '0.58rem',
              fontWeight: 500,
              letterSpacing: '0.2em',
            }}
          >
            {step.tag}
          </motion.span>

          <motion.h3
            animate={{ color: isActive ? '#080808' : '#777777' }}
            transition={{ duration: 0.4 }}
            className="m-0 uppercase"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: 'clamp(1.4rem, 2.5vw, 2.1rem)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
            }}
          >
            {step.title}
          </motion.h3>

          <motion.p
            animate={{ color: isActive ? '#666666' : '#777777', opacity: isActive ? 1 : 0.7 }}
            transition={{ duration: 0.45 }}
            className="m-0 max-w-[440px]"
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: 'clamp(0.7rem, 1.1vw, 0.83rem)',
              lineHeight: 1.8,
            }}
          >
            {step.description}
          </motion.p>

          {/* Accent divider — видно лише при активному */}
          <motion.div
            animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="h-0.5 w-10 rounded-sm bg-[#ff5a00]"
            style={{ transformOrigin: 'left center' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

/* ============================================================
   DESKTOP LAYOUT — sticky ліворуч + прокрутка праворуч
   ============================================================ */

function DesktopLayout() {
  const [activeIndex, setActiveIndex] = useState(0)
  const stepRefs = useRef<Array<HTMLDivElement | null>>([])
  const visibleStepIndexes = useRef(new Set<number>())

  useEffect(() => {
    const visibleIndexes = visibleStepIndexes.current

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number((entry.target as HTMLElement).dataset.stepIndex)
          if (Number.isNaN(index)) return

          if (entry.isIntersecting) {
            visibleIndexes.add(index)
          } else {
            visibleIndexes.delete(index)
          }
        })

        if (visibleIndexes.size === 0) return

        const viewportCenter = window.innerHeight / 2
        const nextIndex = Array.from(visibleIndexes).reduce((closestIndex, index) => {
          const closestEl = stepRefs.current[closestIndex]
          const el = stepRefs.current[index]
          if (!closestEl || !el) return closestIndex

          const closestCenter = closestEl.getBoundingClientRect().top + closestEl.offsetHeight / 2
          const center = el.getBoundingClientRect().top + el.offsetHeight / 2

          return Math.abs(center - viewportCenter) < Math.abs(closestCenter - viewportCenter)
            ? index
            : closestIndex
        })

        setActiveIndex(nextIndex)
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )

    stepRefs.current.forEach((stepEl) => {
      if (stepEl) observer.observe(stepEl)
    })

    return () => {
      observer.disconnect()
      visibleIndexes.clear()
    }
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative w-full">
      <div className="relative">
        <DesktopImagePanel activeIndex={activeIndex} />
      </div>

      <div className="flex flex-col w-full">
        {STEPS.map((step, i) => (
          <DesktopStepItem
            key={step.index}
            step={step}
            index={i}
            isActive={i === activeIndex}
            isLast={i === STEPS.length - 1}
            setRef={(node) => {
              stepRefs.current[i] = node
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   SECTION HEADER
   ============================================================ */

function SectionHeader() {
  return (
    <div style={{ marginBottom: 'clamp(48px, 7vw, 88px)' }}>
      {/* Tactical tag */}
      <motion.div
        className="inline-flex items-center gap-2 tactical-tag mb-5"
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ color: '#ff5a00', border: '1px solid rgba(255,90,0,0.4)', background: 'rgba(255,90,0,0.06)' }}
      >
        <span
          style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff5a00', display: 'inline-block' }}
        />
        Рекрутинг / Процес
      </motion.div>

      {/* H2 slide-up */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-8% 0px' }}
        style={{ overflow: 'hidden' }}
      >
        <motion.h2
          variants={{
            hidden: { y: '108%' },
            visible: { y: '0%' },
          }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.05 }}
          style={{
            fontFamily: 'var(--font-oswald)',
            fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#080808',
            margin: 0,
            display: 'inline-block',
          }}
        >
          Шлях{' '}
          <span style={{ color: '#ff5a00' }}>рекрутера</span>
        </motion.h2>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 0.65, ease: EASE, delay: 0.15 }}
        style={{
          fontFamily: 'var(--font-roboto-mono)',
          fontSize: 'clamp(0.72rem, 1.2vw, 0.92rem)',
          color: '#6a6a6a',
          lineHeight: 1.7,
          marginTop: '16px',
          marginBottom: '24px',
          maxWidth: '520px',
        }}
      >
        5 кроків від рішення — до початку служби в лавах 93-го ОПТБ
      </motion.p>

      {/* Accent divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
        style={{
          width: '64px',
          height: '2px',
          background: '#ff5a00',
          transformOrigin: 'left center',
          borderRadius: '2px',
        }}
      />
    </div>
  )
}

/* ============================================================
   ГОЛОВНИЙ КОМПОНЕНТ
   ============================================================ */

export default function RecruitmentPath() {
  return (
    <section
      id="recruitment-path"
      aria-label="Шлях рекрутингу — етапи вступу до 93 ОПТБ"
      style={{
        background: '#ffffff',
        color: '#080808',
        padding: 'clamp(80px, 10vw, 160px) clamp(20px, 5vw, 80px)',
        position: 'relative',
        overflow: 'clip',
      }}
    >
      {/* Верхня оранжева акцентна лінія (перехід від темного фону) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, #ff5a00 35%, #ff5a00 65%, transparent 100%)',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
        <SectionHeader />

        {/* Mobile/Tablet: вертикальний Timeline (< 1024px) */}
        <div className="block lg:hidden">
          <MobileTimeline />
        </div>

        {/* Desktop: Sticky Scroll (>= 1024px) */}
        <div className="hidden lg:block">
          <DesktopLayout />
        </div>
      </div>
    </section>
  )
}
