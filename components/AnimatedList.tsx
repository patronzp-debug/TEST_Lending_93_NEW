'use client'

/**
 * AnimatedList — Mobile nested accordion (2-level)
 * Level 1: Categories (5 groups) — dark block headers with icon placeholder + chevron
 * Level 2: Vacancies inside a category — compact rows with expand/collapse
 * Desktop Bento Grid is NOT affected by this component.
 */

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { type VacancyItem, type VacancyCategory } from '../constants/vacancies'
import './AnimatedList.css'

/* ============================================================
   PRIORITY HELPERS
   ============================================================ */

function getPriorityColor(priority: VacancyItem['priority']): string {
  if (priority === 'КРИТИЧНО') return '#ff2200'
  if (priority === 'ТЕРМІНОВО') return '#ff5a00'
  return '#4a4a4a'
}

/* ============================================================
   LEVEL-2: SINGLE VACANCY ROW (inner accordion item)
   ============================================================ */

interface VacancyRowProps {
  item: VacancyItem
  isOpen: boolean
  onToggle: () => void
}

function VacancyRow({ item, isOpen, onToggle }: VacancyRowProps) {
  const priorityColor = getPriorityColor(item.priority)

  function handleApply(e: React.MouseEvent) {
    e.stopPropagation()
    const formEl = document.getElementById('recruiting-form')
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="vacancy-row">
      {/* ── Trigger ── */}
      <button
        className="vacancy-row-header"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`vbody-${item.id}`}
        id={`vtrigger-${item.id}`}
      >
        {/* Priority dot */}
        <span
          className="vacancy-row-dot"
          aria-hidden="true"
          style={{ background: priorityColor, boxShadow: `0 0 5px ${priorityColor}99` }}
        />

        {/* Title + priority label */}
        <div className="vacancy-row-info">
          <span className="vacancy-row-title">{item.title}</span>
          <span
            className="vacancy-row-priority"
            style={{ color: priorityColor }}
          >
            {item.priority}
          </span>
        </div>

        {/* Chevron */}
        <ChevronDown
          size={15}
          className={`vacancy-row-chevron${isOpen ? ' open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* ── Body ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`vbody-${item.id}`}
            role="region"
            aria-labelledby={`vtrigger-${item.id}`}
            className="vacancy-row-body"
            key="vbody"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: 0.36, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.24, delay: 0.05 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.26, ease: [0.4, 0, 1, 1] },
                opacity: { duration: 0.14 },
              },
            }}
          >
            <div className="vacancy-row-body-inner">
              {/* Background image with gradient overlay */}
              {item.imageUrl && (
                <div className="vacancy-row-bg-image" aria-hidden="true">
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="vacancy-row-bg-img"
                  />
                  <div className="vacancy-row-bg-gradient" />
                </div>
              )}

              {/* Content layer */}
              <div className="vacancy-row-content-layer">
                {/* Description */}
                <p className="animated-list-item-description">{item.description}</p>

                {/* Requirement */}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ============================================================
   LEVEL-1: CATEGORY BLOCK (outer accordion item)
   ============================================================ */

interface CategoryBlockProps {
  category: VacancyCategory
  catIndex: number
  isCatOpen: boolean
  onCatToggle: () => void
  inView: boolean
}

function CategoryBlock({
  category,
  catIndex,
  isCatOpen,
  onCatToggle,
  inView,
}: CategoryBlockProps) {
  const [openVacancyId, setOpenVacancyId] = useState<string | null>(null)

  function handleVacancyToggle(id: string) {
    setOpenVacancyId(prev => (prev === id ? null : id))
  }

  return (
    <motion.div
      className="category-block"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        duration: 0.5,
        delay: 0.08 + catIndex * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* ── Category header (Level-1 trigger) ── */}
      <button
        className={`category-block-header${isCatOpen ? ' open' : ''}`}
        onClick={onCatToggle}
        aria-expanded={isCatOpen}
        aria-controls={`catbody-${category.id}`}
        id={`cattrigger-${category.id}`}
      >
        {/* Category icon */}
        <div className="category-block-icon" aria-hidden="true">
          {category.icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={category.icon}
              alt=""
              width={18}
              height={18}
              className="w-[18px] h-[18px] object-contain"
            />
          )}
        </div>

        {/* Name + count */}
        <div className="category-block-info">
          <span className="category-block-name">{category.categoryName}</span>
          <span className="category-block-count">
            {category.items.length} {category.items.length === 1 ? 'вакансія' : 'вакансій'}
          </span>
        </div>

        {/* Chevron */}
        <ChevronDown
          size={20}
          className={`category-block-chevron${isCatOpen ? ' open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* ── Category body (Level-2 list of vacancies) ── */}
      <AnimatePresence initial={false}>
        {isCatOpen && (
          <motion.div
            id={`catbody-${category.id}`}
            role="region"
            aria-labelledby={`cattrigger-${category.id}`}
            className="category-block-body"
            key="catbody"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.3, delay: 0.04 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.32, ease: [0.4, 0, 1, 1] },
                opacity: { duration: 0.16 },
              },
            }}
          >
            <div className="category-block-body-inner">
              {category.items.map(item => (
                <VacancyRow
                  key={item.id}
                  item={item}
                  isOpen={openVacancyId === item.id}
                  onToggle={() => handleVacancyToggle(item.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ============================================================
   ANIMATED LIST — main export (nested accordion)
   ============================================================ */

interface AnimatedListProps {
  /** For backward-compat when flat list is passed */
  items?: VacancyItem[]
  /** Grouped categories (preferred) */
  categories?: VacancyCategory[]
}

export default function AnimatedList({ categories = [] }: AnimatedListProps) {
  const [openCatId, setOpenCatId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: '-8% 0px' })

  function handleCatToggle(id: string) {
    setOpenCatId(prev => (prev === id ? null : id))
  }

  return (
    <div
      ref={containerRef}
      className="animated-list-container"
      role="list"
      aria-label="Вакансії за категоріями"
    >
      {categories.map((cat, catIndex) => (
        <div key={cat.id} role="listitem">
          <CategoryBlock
            category={cat}
            catIndex={catIndex}
            isCatOpen={openCatId === cat.id}
            onCatToggle={() => handleCatToggle(cat.id)}
            inView={inView}
          />
        </div>
      ))}
    </div>
  )
}
