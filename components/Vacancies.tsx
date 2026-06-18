'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import AnimatedList from '@/components/AnimatedList'
import { type VacancyItem, VACANCIES, VACANCY_CATEGORIES } from '../constants/vacancies'

/* ============================================================
   SINGLE VACANCY CARD — desktop Grid
   ============================================================ */

interface CardProps {
  vacancy: VacancyItem;
  index: number;
  inView: boolean;
}

function VacancyCard({ vacancy, index, inView }: CardProps) {
  const priorityColor =
    vacancy.priority === 'КРИТИЧНО' ? '#ff2200' :
      vacancy.priority === 'ТЕРМІНОВО' ? '#ff5a00' : '#8a8a8a';

  return (
    <motion.article
      className="vacancy-card group relative overflow-hidden flex flex-col rounded-md"
      style={{
        width: '270px',
        height: '345.17px',
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.05)',
        willChange: 'transform',
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        borderColor: 'rgba(255,90,0,0.4)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      {/* Фоновое изображение (отображается всегда, изменяется при наведении) */}
      <div className="absolute inset-0 z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <img
          src={vacancy.imageUrl || '/images/vacancies/placeholder.webp'}
          alt=""
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
      </div>

      {/* Контент карточки */}
      <div className="relative z-10 flex flex-col h-full" style={{ padding: '32px' }}>

        {/* Верхний ряд: Статус приоритета */}
        <div className="flex items-center gap-2" style={{ marginBottom: '32px' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: priorityColor }} />
          <span
            className="uppercase tracking-[0.15em] text-[0.65rem] font-bold"
            style={{ color: priorityColor, fontFamily: 'var(--font-roboto-mono)' }}
          >
            {vacancy.priority}
          </span>
        </div>

        <div className="mb-4">
          <h3
            className="text-white font-bold uppercase leading-tight"
            style={{ fontFamily: 'var(--font-oswald)', fontSize: '1.4rem', letterSpacing: '-0.01em' }}
          >
            {vacancy.title}
          </h3>
        </div>

        {/* Краткое описание */}
        <p
          className="text-[#8a8a8a] text-[0.75rem] leading-relaxed"
          style={{ marginTop: 'auto', marginBottom: '20px', fontFamily: 'var(--font-roboto-mono)' }}
        >
          {vacancy.shortDescription || vacancy.description}
        </p>

        {/* Кнопка заявки */}
        <div className="flex justify-center">
          <Button
            id={`apply-${vacancy.id}`}
            onClick={(e) => {
              e.preventDefault();
              const formEl = document.getElementById('recruiting-form');
              if (formEl) {
                formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="relative overflow-hidden border border-white/10 group-hover:border-[#ff5a00]/50 text-white uppercase tracking-[0.15em] bg-transparent hover:bg-[#ff5a00]/10 transition-all duration-300"
            style={{ width: '204px', height: '50px', padding: '12px 16px', fontSize: '14px', fontFamily: 'var(--font-roboto-mono)', borderRadius: '2px' }}
          >
            <span className="flex items-center justify-between w-full">
              <span>ПОДАТИ ЗАЯВКУ</span>
              <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </span>
          </Button>
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
          fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
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
  const [activeFilter, setActiveFilter] = useState<string>('УСІ')

  const FILTER_TABS = ['УСІ', 'Водії та Техніка', 'Медицина', 'Бойові Спеціальності', 'БПЛА / IT', 'Адміністрація']

  const filteredVacancies = activeFilter === 'УСІ' ? VACANCIES : VACANCIES.filter(v => v.category === activeFilter)

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
        {/* Header — shared between mobile and desktop */}
        <SectionHeader inView={inView} />

        {/* ═══════════════════════════════════════════════════════
            DESKTOP: 4-Column Grid with Filters (md and above)
        ═══════════════════════════════════════════════════════ */}
        <div className="hidden lg:block w-full" style={{ marginTop: '48px' }}>

          {/* FILTER PANEL */}
          <div className="flex flex-wrap items-center" style={{ gap: '12px', marginBottom: '56px' }}>
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab;
              const displayName = tab === 'Адміністрація' ? 'АДМІНІСТРАЦІЯ ТА ЛОГІСТИКА'
                : tab === 'БПЛА / IT' ? 'СПЕЦІАЛІСТИ (БПЛА/IT)'
                  : tab;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`rounded-full border text-sm uppercase tracking-[0.15em] transition-all duration-300 ${isActive
                      ? 'bg-[#ff5a00] border-[#ff5a00] text-black font-bold shadow-[0_0_15px_rgba(255,90,0,0.4)]'
                      : 'bg-transparent border-white/20 text-[#8a8a8a] hover:border-[#ff5a00]/70 hover:text-white'
                    }`}
                  style={{ padding: '8px 24px', fontFamily: 'var(--font-roboto-mono)' }}
                >
                  {displayName}
                </button>
              );
            })}
          </div>

          {/* GRID */}
          <div
            className="vacancies-grid grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, 270px)',
              gridAutoRows: '345.17px',
              gap: '20px',
              justifyContent: 'center',
            }}
          >
            {filteredVacancies.map((vacancy, i) => (
              <VacancyCard
                key={vacancy.id}
                vacancy={vacancy}
                index={i}
                inView={inView}
              />
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            MOBILE: Animated accordion list (below md)
            ═══════════════════════════════════════════════════════ */}
        <div className="block lg:hidden">
          <AnimatedList categories={VACANCY_CATEGORIES} />
        </div>

      </div>
    </section>
  )
}
