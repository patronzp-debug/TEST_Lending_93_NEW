'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Plus } from 'lucide-react'

/* ============================================================
   FAQ DATA — Ukrainian only (spec_theme.md)
   ============================================================ */

interface FaqItem {
  id: string
  question: string
  answer: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq1',
    question: 'Чи можна обрати підрозділ самостійно?',
    answer:
      'Так, через прямий рекрутинг до 93 ОПТБ ви потрапляєте саме до нас, минаючи випадковий розподіл. Ми самостійно проводимо відбір та оформлення, що гарантує зарахування до нашого батальйону.',
  },
  {
    id: 'faq2',
    question: 'Скільки триває підготовка?',
    answer:
      'Кожен новобранець проходить базову військову підготовку та спеціалізований курс навчання роботі з сучасним озброєнням. Тривалість залежить від обраної спеціалізації та попереднього досвіду кандидата.',
  },
  {
    id: 'faq3',
    question: 'Чи забезпечуєте ви екіпіруванням?',
    answer:
      'Так, батальйон повністю забезпечує бійців сучасною формою, засобами захисту та технологічним спорядженням. Ми використовуємо виключно перевірене натовське та вітчизняне обладнання.',
  },
]

/* ============================================================
   SINGLE ACCORDION ITEM
   ============================================================ */

interface AccordionItemProps {
  item: FaqItem
  index: number
  isOpen: boolean
  onToggle: () => void
  inView: boolean
}

function AccordionItem({ item, index, isOpen, onToggle, inView }: AccordionItemProps) {
  return (
    <motion.div
      className="faq-item"
      style={{
        borderBottom: '1px solid #1a1a1a',
        overflow: 'hidden',
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.55,
        delay: 0.15 + index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Trigger */}
      <button
        id={`faq-trigger-${item.id}`}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${item.id}`}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          padding: 'clamp(20px, 2.5vw, 28px) 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {/* Index + Question */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', flex: 1 }}>
          <span
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '0.55rem',
              color: isOpen ? '#ff5a00' : '#2a2a2a',
              letterSpacing: '0.15em',
              flexShrink: 0,
              transition: 'color 0.3s ease',
            }}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: 'clamp(1rem, 2vw, 1.35rem)',
              fontWeight: 600,
              color: isOpen ? '#ececec' : '#8a8a8a',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              transition: 'color 0.3s ease',
            }}
          >
            {item.question}
          </h3>
        </div>

        {/* Plus icon — rotates to × */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ flexShrink: 0 }}
        >
          <Plus
            size={20}
            color={isOpen ? '#ff5a00' : '#3a3a3a'}
            style={{ transition: 'color 0.3s ease' }}
          />
        </motion.div>
      </button>

      {/* Answer panel — AnimatePresence for height animation */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${item.id}`}
            role="region"
            aria-labelledby={`faq-trigger-${item.id}`}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {/* Left accent bar */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                paddingBottom: 'clamp(20px, 2.5vw, 28px)',
                paddingLeft: 'calc(0.55rem + 20px + 20px)', // align with question text
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: '2px',
                  background: 'linear-gradient(to bottom, #ff5a00, transparent)',
                  flexShrink: 0,
                  borderRadius: '1px',
                  alignSelf: 'stretch',
                  marginLeft: '-24px',
                  marginRight: '22px',
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-roboto-mono)',
                  fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)',
                  color: '#6a6a6a',
                  lineHeight: 1.8,
                  letterSpacing: '0.02em',
                }}
              >
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ============================================================
   FAQ SECTION
   ============================================================ */

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-8% 0px' })

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id))

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-label="Часті запитання"
      style={{
        background: '#080808',
        padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)',
        position: 'relative',
        borderTop: '1px solid #111',
      }}
    >
      {/* Subtle center ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(255,90,0,0.03) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(60px)',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Two-column layout: header left, accordion right */}
        <div className="faq-grid">
          {/* LEFT — Section label + H2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '8px' }}>
            <motion.div
              className="inline-flex items-center gap-2 tactical-tag self-start"
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a00] animate-pulse" />
              Запитання
            </motion.div>

            <div style={{ overflow: 'hidden', width: 'fit-content' }}>
              <motion.h2
                className="pr-4"
                style={{
                  fontFamily: 'var(--font-oswald)',
                  fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
                  fontWeight: 700,
                  lineHeight: 1.0,
                  letterSpacing: '-0.02em',
                  color: '#ececec',
                  textTransform: 'uppercase',
                }}
                initial={{ y: '108%' }}
                animate={inView ? { y: '0%' } : { y: '108%' }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                aria-label="Часті запитання"
              >
                ЧАСТІ<br />
                <span style={{ color: '#ff5a00' }}>ЗАПИТАННЯ</span>
              </motion.h2>
            </div>

            <motion.p
              style={{
                fontFamily: 'var(--font-roboto-mono)',
                fontSize: '0.65rem',
                color: '#3a3a3a',
                letterSpacing: '0.12em',
                lineHeight: 1.6,
                maxWidth: '260px',
              }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {FAQ_ITEMS.length} питання · відповіді рекрутера
            </motion.p>
          </div>

          {/* RIGHT — Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={item.id}
                item={item}
                index={i}
                isOpen={openId === item.id}
                onToggle={() => toggle(item.id)}
                inView={inView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
