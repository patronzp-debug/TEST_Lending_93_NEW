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
    question: 'Чи потрібно мені звертатись до ТЦК?',
    answer: 'Ні, наш підрозділ проводить рекрутинг напряму. Ми не співпрацюємо з ТЦК у звичному розумінні та не передаємо їм жодних ваших персональних даних без вашої згоди. Весь процес відбору та супроводу ми беремо на себе.'
  },
  {
    id: 'faq2',
    question: 'Чи не «вкрадуть» мене з БЗВП в іншу частину?',
    answer: 'Ні. Якщо ти вирішив йти саме до нас і пройшов відбір, ти стовідсотково потрапиш сюди. Ми оформлюємо офіційне відношення (рекомендаційний лист), яке юридично закріплює тебе за 93 ОПТБ на всіх етапах.'
  },
  {
    id: 'faq3',
    question: 'Що я отримаю, якщо долучусь до 93 ОПТБ?',
    answer: 'Ти отримаєш гарантоване місце служби за обраною спеціальністю, повне забезпечення, сучасне навчання за світовими стандартами, гідне грошове забезпечення, офіційне працевлаштування із повним соцпакетом, а головне — повагу та роботу в команді професіоналів.'
  },
  {
    id: 'faq4',
    question: 'Чи обов\'язково мати військовий досвід або армійське минуле?',
    answer: 'Ні, досвід не є обов\'язковим. Ми шукаємо насамперед вмотивованих людей. Для багатьох посад (водії, діловоди, механіки, зв\'язківці, оператори БПЛА, медики) цивільні навички є даже кориснішими. Головне — ваше бажання вчитися, а військової справи ми навчимо.'
  },
  {
    id: 'faq5',
    question: 'Скільки триває підготовка і де вона проходить?',
    answer: 'Усі новобранці без винятку проходять Базову загальновійськову підготовку (БЗВП) в офіційних навчальних центрах ЗСУ, яка триває щонайменше 45 днів. Якщо ваша посада потребує складніших навичок (наприклад, оператор БПЛА або тактичний медик), після базового курсу ви проходите додаткове фахове навчання (ще від 2 тижнів до місяця), зокрема із залученням наших інструкторів.'
  },
  {
    id: 'faq6',
    question: 'Чи проходять штабні та технічні спеціалісти бойову підготовку?',
    answer: 'Так. Оскільки всі рекрути офіційно оформлюються до лав ЗСУ, проходження Базової загальновійськової підготовки (БЗВП) є обов\'язковою вимогою законодавства для кожного, незалежно від майбутньої посади — чи то штурмовик, чи то фінансист. Ви повинні вміти поводитися зі зброєю та знати основи такмеду задля власної безпеки.'
  },
  {
    id: 'faq7',
    question: 'Який рівень грошового забезпечення (зарплати) я буду отримувати?',
    answer: 'Базове грошове забезпечення стартує від 20 100 грн (залежно від звання та посади). Під час виконання завдань нараховуються додаткові виплати (доплати за залучення до бойових дій або виконання спецзавдань у розмірі 30 000, 50 000, 70 000 або 100 000 грн на місяць пропорційно дням виконання). Детальні цифри для конкретної вакансії вам озвучать на співбесіді.'
  },
  {
    id: 'faq8',
    question: 'Чи платять мені гроші, поки я перебуваю в навчальному центрі?',
    answer: 'Так, з моменту зарахування до списків військової частини ви офіційно стаєте військовослужбовцем. На час навчання вам нараховується базове щомісячне грошове забезпечення, а також забезпечується безкоштовне проживання та харчування.'
  },
  {
    id: 'faq9',
    question: 'Чи забезпечує підрозділ формою та екіпіруванням, чи треба купувати все самому?',
    answer: 'Наш підрозділ повністю забезпечує бійців усім необхідним для виконання завдань: якісною формою за сезоном, бронежилетом, каскою, тактичними окулярами, аптечкою та зброєю. Купувати власне спорядження можна за власним бажанням, якщо ви хочете якісь специфічні кастомні елементи, але базовий комплект мы видаємо в повному обсязі.'
  },
  {
    id: 'faq10',
    question: 'Чи є обмеження за віком або станом здоров\'я?',
    answer: 'Офіційний вік для вступу на службу — від 18 до 60 років. Що стосується здоров\'я — фінальний вердикт виносить Військово-лікарська комісія (ВЛК). Проте підрозділ має велику кількість різнопланових посад, тому навіть якщо у вас є певні обмеження за здоров\'ям, які не дозволяють іти в штурмові комплекси, ми спробуємо підібрати для вас відповідну вакансію в забезпеченні, штабі чи технічній службі.'
  },
  {
    id: 'faq11',
    question: 'Чи передбачені відпустки і як часто можна бачити родину?',
    answer: 'Військовослужбовці мають право на щорічну основну відпустку тривалістю 30 календарних днів (зазвичай ділиться на дві частини по 15 днів), а також відпустки за сімейними обставинами (до 10 днів). Надання відпусток узгоджується із командуванням так, щоб не знижувати боєготовність підрозділу.'
  },
  {
    id: 'faq12',
    question: 'Що відбувається у разі отримання поранення або хвороби?',
    answer: 'Держава та підрозділ повністю покривають лікування та реабілітацію військовослужбовця. За бійцем зберігається його посада та грошове забезпечення на весь час лікування. Також, залежно від ступеня важкості поранення, виплачується одноразова грошова допомога та передбачені додаткові виплати під час перебування на стаціонарному лікуванні.'
  },
  {
    id: 'faq13',
    question: 'Чи можна підтримувати зв\'язок із рідними під час служби?',
    answer: 'Так, звичайно. Усі бійці мають доступ до зв\'язку та інтернету (включно зі Starlink) у вільний від виконання бойових завдань та чергувань час. Винятком є безпосереднє перебування на \"нулі\" або виконання секретних місій, де діє режим суворої радіотиші задля вашої ж безпеки.'
  },
  {
    id: 'faq14',
    question: 'Чи можливе переведення з інших військових частин?',
    answer: 'Так, можливо. Заповнюйте анкету подати заявку на сайті, ми з Вами зв\'яжемось і обговоримо деталі переведення.'
  }
]

const INITIAL_VISIBLE = 5

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
        delay: 0.15 + index * 0.07,
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
   SHOW MORE BUTTON
   ============================================================ */

interface ShowMoreButtonProps {
  showAll: boolean
  onToggle: () => void
}

function ShowMoreButton({ showAll, onToggle }: ShowMoreButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      style={{ marginTop: '8px', paddingTop: '24px' }}
    >
      <button
        id="faq-show-more-btn"
        type="button"
        onClick={onToggle}
        className="faq-show-more-btn"
        style={{
          fontFamily: 'var(--font-roboto-mono)',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          background: 'transparent',
          border: '1px solid #2a2a2a',
          color: '#6a6a6a',
          padding: '12px 28px',
          cursor: 'pointer',
          transition:
            'border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.borderColor = '#ff5a00'
          el.style.color = '#ffffff'
          el.style.boxShadow = '0 0 16px rgba(255,90,0,0.25), 0 0 4px rgba(255,90,0,0.15)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.borderColor = '#2a2a2a'
          el.style.color = '#6a6a6a'
          el.style.boxShadow = 'none'
        }}
        aria-expanded={showAll}
      >
        {/* Tactical dash decoration */}
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: '16px',
            height: '1px',
            background: 'currentColor',
            flexShrink: 0,
          }}
        />
        {showAll ? 'ЗГОРНУТИ' : 'ПОКАЗАТИ ВСІ ЗАПИТАННЯ'}
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: '16px',
            height: '1px',
            background: 'currentColor',
            flexShrink: 0,
          }}
        />
      </button>
    </motion.div>
  )
}

/* ============================================================
   FAQ SECTION
   ============================================================ */

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-8% 0px' })

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id))

  const firstItems = FAQ_ITEMS.slice(0, INITIAL_VISIBLE)
  const hiddenItems = FAQ_ITEMS.slice(INITIAL_VISIBLE)

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

            <div style={{ overflow: 'visible', width: 'fit-content' }}>
              <motion.h2
                className="pr-4"
                style={{
                  fontFamily: 'var(--font-oswald)',
                  fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.0,
                  letterSpacing: '-0.02em',
                  color: '#ececec',
                  textTransform: 'uppercase',
                }}
                initial={{ y: -100, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 10,
                  mass: 1,
                  delay: 0.15,
                }}
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
              {FAQ_ITEMS.length} питань · відповіді рекрутера
            </motion.p>
          </div>

          {/* RIGHT — Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {firstItems.map((item, i) => (
              <AccordionItem
                key={item.id}
                item={item}
                index={i}
                isOpen={openId === item.id}
                onToggle={() => toggle(item.id)}
                inView={inView}
              />
            ))}

            <AnimatePresence initial={false}>
              {showAll && hiddenItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <AccordionItem
                    item={item}
                    index={INITIAL_VISIBLE + i}
                    isOpen={openId === item.id}
                    onToggle={() => toggle(item.id)}
                    inView={inView}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            <ShowMoreButton
              showAll={showAll}
              onToggle={() => setShowAll(prev => !prev)}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
