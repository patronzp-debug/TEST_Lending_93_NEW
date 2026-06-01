'use client'

/**
 * AnimatedList — Mobile accordion vacancy list
 * Inspired by React Bits AnimatedList, adapted for 93 OPTB design system.
 * Used exclusively for mobile (<md breakpoint). Desktop keeps Bento Grid.
 */

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import './AnimatedList.css'

/* ============================================================
   TYPES
   ============================================================ */

export interface VacancyItem {
  id: string
  title: string
  category: string
  requirement: string
  description: string
  span: 'wide' | 'tall' | 'standard'
  priority: 'КРИТИЧНО' | 'ТЕРМІНОВО' | 'НАБІР'
}

interface AnimatedItemProps {
  item: VacancyItem
  index: number
  isOpen: boolean
  onToggle: () => void
  inView: boolean
}

/* ============================================================
   PRIORITY HELPERS
   ============================================================ */

function getPriorityColor(priority: VacancyItem['priority']): string {
  if (priority === 'КРИТИЧНО') return '#ff2200'
  if (priority === 'ТЕРМІНОВО') return '#ff5a00'
  return '#4a4a4a'
}

/* ============================================================
   SINGLE ANIMATED ITEM — accordion row
   ============================================================ */

function AnimatedItem({ item, index, isOpen, onToggle, inView }: AnimatedItemProps) {
  const priorityColor = getPriorityColor(item.priority)

  function handleApply(e: React.MouseEvent) {
    e.stopPropagation()
    const formEl = document.getElementById('recruiting-form')
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <motion.div
      className="animated-list-item"
      /* stagger entrance from below */
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{
        duration: 0.55,
        delay: 0.1 + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* ── Header / trigger row ── */}
      <button
        className="animated-list-item-header"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`vacancy-body-${item.id}`}
        id={`vacancy-trigger-${item.id}`}
      >
        {/* Priority dot */}
        <span
          className="animated-list-item-priority"
          aria-hidden="true"
          style={{ background: priorityColor, boxShadow: `0 0 6px ${priorityColor}88` }}
        />

        {/* Title + meta */}
        <div className="animated-list-item-info">
          <span className="animated-list-item-title">{item.title}</span>
          <div className="animated-list-item-meta">
            <span className="animated-list-item-category">{item.category}</span>
            <span
              className="animated-list-item-priority-label"
              style={{ color: priorityColor }}
            >
              ● {item.priority}
            </span>
          </div>
        </div>

        {/* Chevron */}
        <ChevronDown
          size={18}
          className={`animated-list-item-chevron${isOpen ? ' open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* ── Expandable body ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`vacancy-body-${item.id}`}
            role="region"
            aria-labelledby={`vacancy-trigger-${item.id}`}
            className="animated-list-item-body"
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.28, delay: 0.06 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3, ease: [0.4, 0, 1, 1] },
                opacity: { duration: 0.18 },
              },
            }}
          >
            <div className="animated-list-item-body-inner">
              {/* Description */}
              <p className="animated-list-item-description">{item.description}</p>

              {/* Requirement block */}
              <div className="animated-list-item-requirement">
                <span className="animated-list-item-requirement-label">Вимоги</span>
                <span className="animated-list-item-requirement-text">{item.requirement}</span>
              </div>

              {/* Apply CTA */}
              <button
                className="animated-list-apply-btn"
                onClick={handleApply}
                id={`mobile-apply-${item.id}`}
                aria-label={`Відгукнутися на вакансію: ${item.title}`}
              >
                Відгукнутись
                <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ============================================================
   ANIMATED LIST — main export
   ============================================================ */

interface AnimatedListProps {
  items: VacancyItem[]
}

export default function AnimatedList({ items }: AnimatedListProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: '-8% 0px' })

  function handleToggle(id: string) {
    setOpenId(prev => (prev === id ? null : id))
  }

  return (
    <div
      ref={containerRef}
      className="animated-list-container"
      role="list"
      aria-label="Список відкритих вакансій"
    >
      {items.map((item, index) => (
        <div key={item.id} role="listitem">
          <AnimatedItem
            item={item}
            index={index}
            isOpen={openId === item.id}
            onToggle={() => handleToggle(item.id)}
            inView={inView}
          />
        </div>
      ))}
    </div>
  )
}
