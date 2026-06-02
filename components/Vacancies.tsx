'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'
import AnimatedList, { type VacancyItem, type VacancyCategory } from '@/components/AnimatedList'

/* ============================================================
   DATA — Ukrainian only per spec_theme.md
   ============================================================ */

interface Vacancy extends VacancyItem {
  /** Bento span hint: 'wide' | 'tall' | 'standard' */
  span: 'wide' | 'tall' | 'standard'
  /** Tactical threat-level accent label */
  priority: 'КРИТИЧНО' | 'ТЕРМІНОВО' | 'НАБІР'
}

/* ── Flat list — used by desktop Bento Grid ── */
const VACANCIES: Vacancy[] = [
  /* ── Водії та Техніка ── */
  {
    id: 'v1',
    title: 'Водій',
    category: 'Водії та Техніка',
    requirement: 'Права категорії C/CE, досвід від 2 років',
    description:
      'Безпечне перевезення особового складу та вантажів у зоні бойових дій. Технічний контроль транспортного засобу перед виходом на маршрут, дотримання заходів маскування та безпеки.',
    span: 'wide',
    priority: 'ТЕРМІНОВО',
  },
  {
    id: 'v2',
    title: 'Водій-електрик',
    category: 'Водії та Техніка',
    requirement: 'Права категорії B/C, базові знання електрики',
    description:
      'Управління транспортним засобом у поєднанні з обслуговуванням електрообладнання підрозділу. Діагностика та усунення несправностей бортової електрики в польових умовах.',
    span: 'standard',
    priority: 'НАБІР',
  },
  {
    id: 'v3',
    title: 'Водій-сапер',
    category: 'Водії та Техніка',
    requirement: 'Права категорії C, підготовка з інженерних справ',
    description:
      'Управління спеціалізованою технікою інженерних підрозділів, участь у розмінуванні маршрутів і позицій. Знання основ інженерних загороджень та їх подолання.',
    span: 'tall',
    priority: 'КРИТИЧНО',
  },
  {
    id: 'v4',
    title: 'Водій-заправник',
    category: 'Водії та Техніка',
    requirement: 'Права категорії C/CE, допуск до ПММ',
    description:
      'Доставка пально-мастильних матеріалів підрозділам у складних умовах логістики. Ведення обліку витрат ПММ, дотримання вимог безпеки при роботі з паливом.',
    span: 'standard',
    priority: 'ТЕРМІНОВО',
  },
  {
    id: 'v5',
    title: 'Технік',
    category: 'Водії та Техніка',
    requirement: 'Технічна освіта, досвід ремонту техніки',
    description:
      'Технічне обслуговування та поточний ремонт озброєння, військової техніки й обладнання підрозділу. Контроль технічного стану, складання заявок на запасні частини.',
    span: 'standard',
    priority: 'НАБІР',
  },
  {
    id: 'v6',
    title: 'Механік',
    category: 'Водії та Техніка',
    requirement: 'Досвід роботи з ДВЗ та гідравлікою',
    description:
      'Польовий ремонт та діагностика двигунів, ходової частини і агрегатів бойової техніки. Відновлення боєздатності машин у мінімально короткі строки безпосередньо в районі виконання завдань.',
    span: 'standard',
    priority: 'ТЕРМІНОВО',
  },
  /* ── Медицина ── */
  {
    id: 'v7',
    title: 'Стрілець-санітар',
    category: 'Медицина',
    requirement: 'Базовий курс тактичної медицини (ТССС/IFAK)',
    description:
      'Виконання бойових завдань у складі відділення з одночасним наданням домедичної допомоги пораненим під вогнем. Евакуація поранених із зони безпосереднього контакту з противником.',
    span: 'wide',
    priority: 'КРИТИЧНО',
  },
  {
    id: 'v8',
    title: 'Медична сестра',
    category: 'Медицина',
    requirement: 'Середня медична освіта, сертифікат медсестри',
    description:
      'Надання кваліфікованої медичної допомоги пораненим на медичному пункті підрозділу. Ведення медичної документації, підтримання запасів медикаментів та медичного обладнання.',
    span: 'standard',
    priority: 'НАБІР',
  },
  {
    id: 'v9',
    title: 'Санітарний інструктор',
    category: 'Медицина',
    requirement: 'Медична освіта, досвід роботи з особовим складом',
    description:
      'Організація та проведення занять із тактичної медицини серед особового складу підрозділу. Контроль укомплектованості аптечок, ведення санітарного стану позицій та транспортних засобів.',
    span: 'standard',
    priority: 'ТЕРМІНОВО',
  },
  /* ── Бойові Спеціальності ── */
  {
    id: 'v10',
    title: 'Навідник',
    category: 'Бойові Спеціальності',
    requirement: 'Досвід роботи з артилерійськими системами',
    description:
      'Наведення та ведення вогню з артилерійських систем за цілями противника згідно з отриманими координатами. Обслуговування озброєння, підготовка боєприпасів, взаємодія з підрозділами коригування.',
    span: 'wide',
    priority: 'КРИТИЧНО',
  },
  {
    id: 'v11',
    title: 'Номер обслуги',
    category: 'Бойові Спеціальності',
    requirement: 'Фізична підготовка, базова військова підготовка',
    description:
      'Виконання функцій у складі обслуги зброї чи бойового засобу: підготовка та подача боєприпасів, обслуговування системи, дотримання бойового розпорядку та нормативів.',
    span: 'standard',
    priority: 'НАБІР',
  },
  {
    id: 'v12',
    title: 'Оператор ПТРК',
    category: 'Бойові Спеціальності',
    requirement: 'Технічна підготовка, стресостійкість',
    description:
      'Застосування протитанкових ракетних комплексів для ураження броньованої техніки та укріплень противника. Технічне обслуговування комплексу, підготовка до бойового застосування у складних умовах рельєфу.',
    span: 'standard',
    priority: 'КРИТИЧНО',
  },
  /* ── Спеціалісти БПЛА/IT ── */
  {
    id: 'v13',
    title: 'Пілот БПЛА',
    category: 'БПЛА / IT',
    requirement: 'Досвід пілотування FPV або мультиротора від 6 міс.',
    description:
      'Пілотування безпілотних літальних апаратів для ведення повітряної розвідки та коригування артилерійського вогню. Технічне обслуговування дронів, аналіз отриманих даних, взаємодія з бойовими підрозділами.',
    span: 'tall',
    priority: 'КРИТИЧНО',
  },
  {
    id: 'v14',
    title: 'Фахівець з IT',
    category: 'БПЛА / IT',
    requirement: 'Досвід у системному адмініструванні або розробці ПЗ',
    description:
      'Технічна підтримка цифрової інфраструктури підрозділу: налаштування захищеного зв\u2019язку, адміністрування систем управління та забезпечення кіберзахисту операцій.',
    span: 'standard',
    priority: 'ТЕРМІНОВО',
  },
  {
    id: 'v15',
    title: 'Кухар',
    category: 'БПЛА / IT',
    requirement: 'Досвід у сфері приготування їжі, санітарна книжка',
    description:
      'Організація повноцінного гарячого харчування особового складу підрозділу в польових умовах. Планування меню з наявних продуктів, дотримання санітарних норм, раціональне використання продовольчого забезпечення.',
    span: 'standard',
    priority: 'НАБІР',
  },
  /* ── Адміністрація та Логістика ── */
  {
    id: 'v16',
    title: 'Бухгалтер',
    category: 'Адміністрація',
    requirement: 'Вища економічна освіта, знання 1С / M.E.Doc',
    description:
      'Ведення фінансово-господарської документації підрозділу, нарахування грошового забезпечення, облік матеріальних цінностей. Підготовка звітності відповідно до вимог Міністерства оборони України.',
    span: 'wide',
    priority: 'НАБІР',
  },
]

/* ── Grouped — used by mobile AnimatedList (nested accordion) ── */
const VACANCY_CATEGORIES: VacancyCategory[] = [
  {
    id: 'cat-drivers',
    categoryName: 'Водії та Техніка',
    icon: '/icons/vacancies/driver.svg',
    items: VACANCIES.filter(v => v.category === 'Водії та Техніка'),
  },
  {
    id: 'cat-medicine',
    categoryName: 'Медицина',
    icon: '/icons/vacancies/medic.svg',
    items: VACANCIES.filter(v => v.category === 'Медицина'),
  },
  {
    id: 'cat-combat',
    categoryName: 'Бойові Спеціальності',
    icon: '/icons/vacancies/crosshair.svg',
    items: VACANCIES.filter(v => v.category === 'Бойові Спеціальності'),
  },
  {
    id: 'cat-tech',
    categoryName: 'Спеціалісти (БПЛА/IT)',
    icon: '/icons/vacancies/drone.svg',
    items: VACANCIES.filter(v => v.category === 'БПЛА / IT'),
  },
  {
    id: 'cat-admin',
    categoryName: 'Адміністрація та Логістика',
    icon: '/icons/vacancies/accountant1.svg',
    items: VACANCIES.filter(v => v.category === 'Адміністрація'),
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
   SINGLE VACANCY CARD — desktop Bento Grid
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
        {/* Header — shared between mobile and desktop */}
        <SectionHeader inView={inView} />

        {/* ═══════════════════════════════════════════════════════
            DESKTOP: Asymmetric Bento Grid (md and above)
            ═══════════════════════════════════════════════════════ */}
        <div
          className="vacancies-grid hidden md:grid"
          style={{
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

        {/* ═══════════════════════════════════════════════════════
            MOBILE: Animated accordion list (below md)
            ═══════════════════════════════════════════════════════ */}
        <div className="block md:hidden">
          <AnimatedList categories={VACANCY_CATEGORIES} />
        </div>

      </div>
    </section>
  )
}
