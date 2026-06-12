'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2, Send } from 'lucide-react'
import { VACANCY_CATEGORIES, type VacancyCategory } from '../constants/vacancies'
import { submitToSheets } from '../app/actions/submitToSheets'

/* ============================================================
   ZOD SCHEMA — валідація форми
   ============================================================ */

const schema = z.object({
  fullName: z
    .string()
    .min(1, "Введіть ваше ПІБ")
    .refine(v => v.trim().split(/\s+/).length >= 2, {
      message: "Введіть щонайменше прізвище та ім\u2019я",
    }),
  phone: z
    .string()
    .min(1, "Введіть номер телефону")
    .regex(/^\+380\d{9}$/, 'Формат: +380XXXXXXXXX (9 цифр після +380)'),
  age: z
    .number({ error: 'Введіть вік' })
    .int('Вік має бути цілим числом')
    .min(18, 'Мінімальний вік — 18 років')
    .max(60, 'Максимальний вік — 60 років'),
  position: z
    .string()
    .min(1, 'Оберіть бажану посаду'),
  hasExperience: z
    .string()
    .min(1, 'Оберіть відповідь'),
})

type FormData = z.infer<typeof schema>

/* POSITIONS видалено — тепер беремо дані з VACANCY_CATEGORIES */

const LS_KEY = '93optb_form_draft'

/* ============================================================
   FRAMER MOTION VARIANTS
   ============================================================ */

const errorVariants = {
  hidden: { opacity: 0, y: -6, height: 0 },
  visible: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit:   { opacity: 0, y: -4, height: 0,     transition: { duration: 0.15 } },
}

const successVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

/* ============================================================
   FIELD WRAPPER — label + input slot + animated error
   ============================================================ */

interface FieldWrapperProps {
  label: string
  id: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

function FieldWrapper({ label, id, error, required, children }: FieldWrapperProps) {
  return (
    <div className="form-field-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: 'var(--font-roboto-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          color: error ? 'rgba(255,80,0,0.8)' : '#4a4a4a',
          textTransform: 'uppercase',
          transition: 'color 0.2s ease',
        }}
      >
        {label}
        {required && (
          <span style={{ color: '#ff5a00', marginLeft: '4px' }}>*</span>
        )}
      </label>
      {children}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key={error}
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
              color: 'rgba(255, 70, 0, 0.9)',
              overflow: 'hidden',
            }}
          >
            ⚠ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ============================================================
   CINEMATIC INPUT — тонка рамка з #ff5a00 glow при focus
   ============================================================ */

const inputBaseStyle: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: '1px solid #1e1e1e',
  borderRadius: 0,
  color: '#ececec',
  fontFamily: 'var(--font-roboto-mono)',
  fontSize: '0.85rem',
  padding: '14px 0',
  outline: 'none',
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  borderBottom: '1px solid #2a2a2a',
  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
  letterSpacing: '0.05em',
}

/* ============================================================
   CUSTOM SELECT — styled для нашого дизайну
   ============================================================ */

interface CinematicSelectProps {
  id: string
  value: string
  onChange: (v: string) => void
  /** Flat list — використовується якщо groups не передано */
  options?: string[]
  /** Згруповані опції за категоріями вакансій */
  groups?: VacancyCategory[]
  placeholder: string
  hasError: boolean
}

function SelectOption({
  opt, value, onChange, setOpen,
}: { opt: string; value: string; onChange: (v: string) => void; setOpen: (b: boolean) => void }) {
  return (
    <li
      role="option"
      aria-selected={value === opt}
      onClick={() => { onChange(opt); setOpen(false) }}
      style={{
        padding: '10px 16px',
        cursor: 'pointer',
        fontFamily: 'var(--font-roboto-mono)',
        fontSize: '0.78rem',
        color: value === opt ? '#ff5a00' : '#8a8a8a',
        letterSpacing: '0.05em',
        background: value === opt ? 'rgba(255,90,0,0.05)' : 'transparent',
        transition: 'background 0.15s ease, color 0.15s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = value === opt ? 'rgba(255,90,0,0.05)' : 'transparent' }}
    >
      {opt}
    </li>
  )
}

function CinematicSelect({ id, value, onChange, options = [], groups, placeholder, hasError }: CinematicSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div ref={ref} className="relative w-full">
      <button
        id={id}
        type="button"
        onClick={() => setOpen(o => !o)}
        className="form-input-field"
        style={{
          ...inputBaseStyle,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          color: value ? '#ececec' : '#3a3a3a',
          borderColor: hasError ? 'rgba(255,80,0,0.5)' : open ? '#ff5a00' : '#2a2a2a',
          boxShadow: open ? '0 4px 20px rgba(255,90,0,0.08)' : 'none',
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value || placeholder}</span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ opacity: 0.4, transition: 'transform 0.2s ease', transform: open ? 'rotate(180deg)' : 'none' }}
        >
          <path d="M2 4L6 8L10 4" stroke="#ececec" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
            className="absolute w-full max-h-[300px] overflow-y-auto overscroll-contain z-50 shadow-2xl"
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            style={{
              top: 'calc(100% + 4px)',
              left: 0, right: 0,
              background: '#111',
              border: '1px solid #2a2a2a',
              listStyle: 'none',
              padding: '4px 0',
            }}
          >
            {groups ? (
              <>
                {groups.map((cat, catIdx) => (
                  <li key={cat.id} role="presentation">
                    {/* Роздільник між групами (крім першої) */}
                    {catIdx > 0 && (
                      <div aria-hidden="true" style={{
                        height: '1px',
                        background: '#1e1e1e',
                        margin: '4px 0',
                      }} />
                    )}
                    {/* Назва категорії */}
                    <div style={{
                      padding: '8px 16px 4px',
                      fontFamily: 'var(--font-roboto-mono)',
                      fontSize: '0.55rem',
                      letterSpacing: '0.2em',
                      color: '#ff5a00',
                      textTransform: 'uppercase',
                    }}>
                      {cat.categoryName}
                    </div>
                    {/* Вакансії категорії */}
                    <ul role="group" aria-label={cat.categoryName} style={{ listStyle: 'none', padding: 0 }}>
                      {cat.items.map(item => (
                        <SelectOption
                          key={item.id}
                          opt={item.title}
                          value={value}
                          onChange={onChange}
                          setOpen={setOpen}
                        />
                      ))}
                    </ul>
                  </li>
                ))}
                {/* Роздільник перед «Інше» */}
                <li role="presentation" aria-hidden="true">
                  <div style={{ height: '1px', background: '#1e1e1e', margin: '4px 0' }} />
                </li>
                <SelectOption opt="Інше" value={value} onChange={onChange} setOpen={setOpen} />
              </>
            ) : (
              options.map(opt => (
                <SelectOption key={opt} opt={opt} value={value} onChange={onChange} setOpen={setOpen} />
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ============================================================
   CINEMATIC RADIO GROUP
   ============================================================ */

interface CinematicRadioGroupProps {
  name: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  hasError: boolean
}

function CinematicRadioGroup({ name, value, onChange, options, hasError }: CinematicRadioGroupProps) {
  return (
    <div role="radiogroup" aria-label={name} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {options.map(opt => {
        const checked = value === opt.value
        return (
          <label
            key={opt.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              padding: '14px 16px',
              border: `1px solid ${checked ? 'rgba(255,90,0,0.4)' : hasError ? 'rgba(255,80,0,0.2)' : '#1e1e1e'}`,
              background: checked ? 'rgba(255,90,0,0.05)' : 'transparent',
              transition: 'border-color 0.2s ease, background 0.2s ease',
            }}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={checked}
              onChange={() => onChange(opt.value)}
              style={{ display: 'none' }}
            />
            {/* Custom radio dot */}
            <span
              style={{
                width: '16px', height: '16px',
                borderRadius: '50%',
                border: `1.5px solid ${checked ? '#ff5a00' : '#3a3a3a'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'border-color 0.2s ease',
              }}
            >
              {checked && (
                <span style={{
                  width: '7px', height: '7px',
                  borderRadius: '50%',
                  background: '#ff5a00',
                  boxShadow: '0 0 6px rgba(255,90,0,0.6)',
                }} />
              )}
            </span>
            <span style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '0.78rem',
              color: checked ? '#ececec' : '#6a6a6a',
              letterSpacing: '0.05em',
              transition: 'color 0.2s ease',
            }}>
              {opt.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}

/* ============================================================
   SUBMIT BUTTON with shimmer sweep
   ============================================================ */

interface SubmitButtonProps {
  isLoading: boolean
  isSuccess: boolean
}

function SubmitButton({ isLoading, isSuccess }: SubmitButtonProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      type="submit"
      disabled={isLoading || isSuccess}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="form-submit-btn"
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        padding: '18px 40px',
        background: isSuccess
          ? 'linear-gradient(135deg, #1a4a1a 0%, #0d3d0d 100%)'
          : 'linear-gradient(135deg, #ff5a00 0%, #e84800 100%)',
        border: 'none',
        color: '#fff',
        fontFamily: 'var(--font-roboto-mono)',
        fontSize: '0.75rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        cursor: isLoading || isSuccess ? 'default' : 'pointer',
        transition: 'background 0.4s ease, box-shadow 0.3s ease, transform 0.2s ease',
        boxShadow: hovered && !isLoading && !isSuccess
          ? '0 0 30px rgba(255,90,0,0.5), 0 0 70px rgba(255,90,0,0.2)'
          : '0 0 20px rgba(255,90,0,0.2)',
        transform: hovered && !isLoading && !isSuccess ? 'translateY(-1px)' : 'none',
        borderRadius: 0,
      }}
    >
      {/* Shimmer sweep — moves on hover */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
          backgroundPosition: hovered ? '-100% center' : '200% center',
          transition: 'background-position 0.6s ease',
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#ffffff' }}>
        {isLoading && <Loader2 size={14} className="animate-spin" style={{ color: '#ffffff' }} />}
        {isSuccess && <CheckCircle2 size={14} style={{ color: '#ffffff' }} />}
        {!isLoading && !isSuccess && <Send size={12} style={{ color: '#ffffff' }} />}
        {isLoading ? 'ОБРОБКА ЗАЯВКИ...' : isSuccess ? 'Заявку прийнято!' : 'Надіслати заявку'}
      </span>
    </button>
  )
}

/* ============================================================
   RESET BUTTON — «Повернутися на головну»
   ============================================================ */

function ResetButton({ onReset }: { onReset: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      type="button"
      onClick={onReset}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-roboto-mono)',
        fontSize: '0.75rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase' as const,
        color: hovered ? '#ffffff' : '#ff5a00',
        background: hovered ? 'rgba(255,90,0,0.1)' : 'transparent',
        border: hovered
          ? '1px solid rgba(255,90,0,0.6)'
          : '1px solid rgba(255,90,0,0.3)',
        padding: '18px 32px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'color 0.25s ease, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        boxShadow: hovered ? '0 0 14px rgba(255,90,0,0.2)' : 'none',
      }}
    >
      [ ПОВЕРНУТИСЯ НА ГОЛОВНУ ]
    </button>
  )
}

/* ============================================================
   MAIN RECRUITING FORM COMPONENT
   ============================================================ */

export default function RecruitingForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const sectionInView = useRef(false)
  const [inView, setInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      phone: '+380',
      age: undefined,
      position: '',
      hasExperience: '',
    },
  })

  /* ---- Restore from localStorage ---- */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FormData>
        reset(parsed)
      }
    } catch { /* ignore parse errors */ }
  }, [reset])

  /* ---- Persist to localStorage on change ---- */
  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(values))
      } catch { /* ignore storage errors */ }
    })
    return () => unsubscribe()
  }, [watch])

  /* ---- Section entrance ---- */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  /* ---- Submit handler ---- */
  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const result = await submitToSheets(data)
      if (result.success) {
        setIsSuccess(true)
        try { localStorage.removeItem(LS_KEY) } catch { /* ignore */ }
      } else {
        console.error('[RecruitingForm] submitToSheets error:', result.error)
        // Залишаємо форму активною — користувач може спробувати ще раз
      }
    } catch (err) {
      console.error('[RecruitingForm] Unexpected error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="recruiting-form"
      aria-label="Форма рекрутингу"
      style={{
        background: '#080808',
        padding: 'clamp(80px, 10vw, 160px) clamp(20px, 5vw, 80px)',
        position: 'relative',
        overflowX: 'clip',
        borderTop: '1px solid #111',
      }}
    >
      {/* Background radial glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: '700px', height: '700px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,90,0,0.04) 0%, transparent 60%)',
        pointerEvents: 'none', filter: 'blur(80px)',
      }} />

      <div style={{ maxWidth: '760px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {isSuccess ? (
            /* ══════════════════════════════════════════════
               SUCCESS STATE — повністю замінює заголовок і форму
               ══════════════════════════════════════════════ */
            <motion.div
              key="success"
              variants={successVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '24px',
                padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 64px)',
                textAlign: 'center',
                minHeight: '400px',
              }}
            >
              {/* Іконка з оранжевим свіченням */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15, type: 'spring', stiffness: 200 }}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(255,90,0,0.5))',
                }}
              >
                <CheckCircle2 size={56} color="#ff5a00" strokeWidth={1.5} />
              </motion.div>

              {/* Заголовок */}
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{
                  fontFamily: 'var(--font-oswald)',
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  margin: 0,
                }}
              >
                ЗАЯВКУ{' '}<span style={{ color: '#ff5a00' }}>УСПІШНО</span>{' '}НАДІСЛАНО!
              </motion.h2>

              {/* Підзаголовок */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.42 }}
                style={{
                  fontFamily: 'var(--font-roboto-mono)',
                  fontSize: '0.78rem',
                  color: '#8a8a8a',
                  letterSpacing: '0.05em',
                  lineHeight: 1.8,
                  maxWidth: '380px',
                  margin: 0,
                }}
              >
                Ми зв'яжемося з вами протягом 24 годин.<br />
                Слава Україні!
              </motion.p>

              {/* Роздільник */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                style={{
                  width: '48px', height: '1px',
                  background: 'rgba(255,90,0,0.3)',
                  transformOrigin: 'center',
                }}
              />

              {/* Кнопка «Повернутися на головну» */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
                style={{ marginTop: '12px' }}
              >
                <ResetButton onReset={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setIsSuccess(false)
                  reset()
                }} />
              </motion.div>

              {/* Footer tag */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                style={{
                  fontFamily: 'var(--font-roboto-mono)',
                  fontSize: '0.5rem',
                  letterSpacing: '0.25em',
                  color: '#2a2a2a',
                  textTransform: 'uppercase',
                }}
              >
                93 ОПТБ · Операція активна
              </motion.span>
            </motion.div>
          ) : (
            /* ══════════════════════════════════════════════
               NORMAL STATE — заголовок + форма
               ══════════════════════════════════════════════ */
            <motion.div key="form-section" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
              {/* ── Section Header ── */}
              <motion.div
                className="inline-flex items-center gap-2 tactical-tag mb-6"
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a00] animate-pulse" />
                Рекрутинг · Етап 4
              </motion.div>

              <div style={{ overflow: 'hidden', marginBottom: '12px' }}>
                <motion.h2
                  style={{
                    fontFamily: 'var(--font-oswald)',
                    fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
                    fontWeight: 700,
                    lineHeight: 1.0,
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase',
                    color: '#ececec',
                  }}
                  initial={{ y: '105%' }}
                  animate={inView ? { y: '0%' } : { y: '105%' }}
                  transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  ПОДАТИ <span style={{ color: '#ff5a00' }}>ЗАЯВКУ</span>
                </motion.h2>
              </div>

              <motion.p
                style={{
                  fontFamily: 'var(--font-roboto-mono)',
                  fontSize: 'clamp(0.72rem, 1.1vw, 0.82rem)',
                  color: '#4a4a4a',
                  letterSpacing: '0.05em',
                  lineHeight: 1.7,
                  marginBottom: 'clamp(40px, 5vw, 64px)',
                }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                Заповніть форму — ми зв'яжемося з вами протягом 24 годин.
              </motion.p>

              {/* ── Form ── */}
              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px, 3vw, 40px)' }}
                noValidate
              >
                {/* ── ПІБ ── */}
                <FieldWrapper label="ПІБ" id="fullName" error={errors.fullName?.message} required>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Прізвище Ім'я По батькові"
                    className="form-input-field"
                    style={{
                      ...inputBaseStyle,
                      borderColor: errors.fullName ? 'rgba(255,80,0,0.5)' : undefined,
                    }}
                    {...register('fullName')}
                  />
                </FieldWrapper>

                {/* ── Телефон ── */}
                <FieldWrapper label="Номер телефону" id="phone" error={errors.phone?.message} required>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+380XXXXXXXXX"
                    className="form-input-field"
                    style={{
                      ...inputBaseStyle,
                      borderColor: errors.phone ? 'rgba(255,80,0,0.5)' : undefined,
                    }}
                    {...register('phone')}
                  />
                </FieldWrapper>

                {/* ── Вік ── */}
                <FieldWrapper label="Вік" id="age" error={errors.age?.message} required>
                  <input
                    id="age"
                    type="number"
                    placeholder="18–60"
                    min={18} max={60}
                    className="form-input-field"
                    style={{
                      ...inputBaseStyle,
                      borderColor: errors.age ? 'rgba(255,80,0,0.5)' : undefined,
                    }}
                    {...register('age', { valueAsNumber: true })}
                  />
                </FieldWrapper>

                {/* ── Бажана посада ── */}
                <FieldWrapper label="Бажана посада" id="position" error={errors.position?.message} required>
                  <Controller
                    name="position"
                    control={control}
                    render={({ field }) => (
                      <CinematicSelect
                        id="position"
                        value={field.value}
                        onChange={field.onChange}
                        groups={VACANCY_CATEGORIES}
                        placeholder="Оберіть посаду..."
                        hasError={!!errors.position}
                      />
                    )}
                  />
                </FieldWrapper>

                {/* ── Досвід військової служби ── */}
                <FieldWrapper
                  label="Досвід військової служби"
                  id="hasExperience"
                  error={errors.hasExperience?.message}
                  required
                >
                  <Controller
                    name="hasExperience"
                    control={control}
                    render={({ field }) => (
                      <CinematicRadioGroup
                        name="hasExperience"
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                          { value: 'yes', label: 'Так, маю досвід' },
                          { value: 'no',  label: 'Ні, не маю' },
                        ]}
                        hasError={!!errors.hasExperience}
                      />
                    )}
                  />
                </FieldWrapper>

                {/* ── Disclaimer ── */}
                <p style={{
                  fontFamily: 'var(--font-roboto-mono)',
                  fontSize: '0.58rem',
                  color: '#2a2a2a',
                  letterSpacing: '0.08em',
                  lineHeight: 1.7,
                }}>
                  * Надсилаючи форму, ви погоджуєтесь на обробку персональних даних
                  відповідно до законодавства України.
                </p>

                {/* ── Submit ── */}
                <SubmitButton isLoading={isLoading} isSuccess={isSuccess} />
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
