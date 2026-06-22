'use client'

import { useState, useEffect, type CSSProperties } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useIntro } from '@/components/providers/IntroContext'
import { BriefcaseBusiness, Cpu, Menu, MessageCircleQuestionMark, Shield, X } from 'lucide-react'

/* ============================================================
   NAV LINKS
   ============================================================ */

const NAV_LINKS = [
  { label: 'Герої', href: '#about', icon: Shield },
  { label: 'Вакансії', href: '#vacancies', icon: BriefcaseBusiness },
  { label: 'Інтелект', href: '#smart-war', icon: Cpu },
  { label: 'FAQ', href: '#faq', icon: MessageCircleQuestionMark },
]

const mobilePanelStyle: CSSProperties = {
  background:
    'radial-gradient(circle at 0% 0%, rgba(255,90,0,0.12), transparent 32%), linear-gradient(180deg, #080808 0%, #101010 52%, #1a1a1a 100%)',
  isolation: 'isolate',
}

const mobileLinkStyle: CSSProperties = {
  minHeight: '50px',
  padding: '7px 11px 7px 8px',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.018)), rgba(8,8,8,0.64)',
  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02), 0 10px 24px rgba(0,0,0,0.26)',
  cursor: 'pointer',
  fontFamily: 'var(--font-oswald)',
}

const mobileIconStyle: CSSProperties = {
  border: '1px solid rgba(255,90,0,0.32)',
  borderRadius: '7px',
  color: '#ff5a00',
  background: 'rgba(255,90,0,0.07)',
  boxShadow: 'inset 0 0 12px rgba(255,90,0,0.07)',
}

const mobileMenuGutterStyle: CSSProperties = {
  boxSizing: 'border-box',
  paddingLeft: '16px',
  paddingRight: '16px',
}

/* ============================================================
   SMOOTH SCROLL HELPER
   ============================================================ */

function scrollTo(href: string) {
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/* ============================================================
   HEADER COMPONENT
   ============================================================ */

export default function Header() {
  const { isIntro, finishIntro } = useIntro()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  /* Track scroll for subtle background change (Optimized with RAF) */
  useEffect(() => {
    let ticking = false
    let lastScrolled = window.scrollY > 40

    const handler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 40
          if (isScrolled !== lastScrolled) {
            setScrolled(isScrolled)
            lastScrolled = isScrolled
          }
          ticking = false
        })
        ticking = true
      }
    }

    setScrolled(lastScrolled)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  /* Close mobile menu on resize to desktop */
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  /* Trigger intro finish after 1.5s */
  useEffect(() => {
    const timer = setTimeout(() => {
      finishIntro()
    }, 1500)
    return () => clearTimeout(timer)
  }, [finishIntro])

  return (
    <LayoutGroup id="cinematic-brand">
      {/* ---- CINEMATIC SPLASH OVERLAY ---- */}
      {/* During intro, show full-screen centered logo/title */}
      <AnimatePresence>
        {isIntro && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Semi-transparent blurred overlay — hero video shows through */}
            <motion.div
              className="absolute inset-0 bg-[#080808]/95 will-change-transform"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />

            {/* ---- SINGLE RESPONSIVE BRAND BLOCK ---- */}
            {/*
              flex-wrap: на мобільному текст (w-full) переноситься на новий рядок.
              На desktop (md:) текст w-auto → всі в один рядок.
              Один DOM-вузол = один layoutId = no Framer Motion conflicts.
            */}
            <motion.div
              layoutId="brand"
              className="relative z-10 flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-4 px-8 md:flex-nowrap md:justify-start md:gap-x-6 md:px-0"
              style={{ originX: 0.5, originY: 0.5 }}
            >
              {/* Logo */}
              <motion.div
                layoutId="brand-logo"
                style={{ originX: 0.5, originY: 0.5 }}
              >
                <Image
                  src="/logos/93_optb/logo_section_Hero.png"
                  alt="93 ОПТБ Логотип"
                  width={140}
                  height={140}
                  priority
                  className="object-contain"
                  style={{
                    filter: 'drop-shadow(0 0 40px rgba(255,90,0,0.45))',
                    width: 'clamp(90px, 14vw, 140px)',
                    height: 'auto',
                  }}
                />
              </motion.div>

              {/* Large "93" numeral — визуально висотою щита */}
              <motion.span
                layoutId="brand-number"
                className="font-bold text-white leading-none select-none"
                style={{
                  fontFamily: 'var(--font-oswald)',
                  fontSize: 'clamp(5.5rem, 14vw, 10rem)',
                  lineHeight: 1,
                  textShadow: '0 0 60px rgba(255,255,255,0.12)',
                }}
              >
                93
              </motion.span>

              {/* Text block — w-full на mobile → новий рядок; w-auto на md → inline */}
              <motion.div
                layoutId="brand-text"
                className="flex flex-col items-center leading-snug w-full md:w-auto md:items-start"
              >
                {(['ОКРЕМИЙ', 'ПРОТИТАНКОВИЙ', 'БАТАЛЬЙОН'] as const).map((word) => (
                  <span
                    key={word}
                    className="block font-bold uppercase tracking-[0.2em] text-[#ececec]"
                    style={{
                      fontFamily: 'var(--font-oswald)',
                      fontSize: 'clamp(0.9rem, 2.2vw, 1.4rem)',
                      textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                    }}
                  >
                    {word}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- FIXED HEADER ---- */}
      <header
        id="site-header"
        className="fixed top-0 w-full z-[9997]"
        style={{
          boxSizing: 'border-box',
          paddingTop: '16px',
          paddingLeft: 'clamp(16px, 3vw, 48px)',
          paddingRight: 'clamp(16px, 3vw, 48px)',
          background: scrolled
            ? 'rgba(8,8,8,0.95)'
            : 'linear-gradient(to bottom, rgba(8,8,8,0.85) 0%, transparent 100%)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
          transition: 'background 0.4s ease, border-color 0.4s ease',
        }}
      >
        <div className="flex items-center justify-between min-h-[60px]">
          {/* ---- BRAND (animates from center to here) ---- */}
          {!isIntro && (
            <motion.div
              layoutId="brand"
              className="flex items-center gap-2 cursor-pointer"
              style={{ originX: 0, originY: 0.5 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <motion.div layoutId="brand-logo" style={{ originX: 0.5, originY: 0.5 }}>
                <Image
                  src="/logos/93_optb/logo_section_Hero.png"
                  alt="93 ОПТБ Логотип"
                  width={44}
                  height={44}
                  className="object-contain"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255,90,0,0.35))' }}
                />
              </motion.div>

              <motion.span
                layoutId="brand-number"
                className="font-bold text-white leading-none select-none"
                style={{
                  fontFamily: 'var(--font-oswald)',
                  fontSize: '2rem',
                  lineHeight: 1,
                }}
              >
                93
              </motion.span>

              <motion.div layoutId="brand-text" className="flex flex-col leading-tight ml-1">
                <span
                  className="text-[0.6rem] font-semibold tracking-[0.14em] text-[#ececec] uppercase"
                  style={{ fontFamily: 'var(--font-oswald)' }}
                >
                  ОКРЕМИЙ
                </span>
                <span
                  className="text-[0.6rem] font-semibold tracking-[0.14em] text-[#ececec] uppercase"
                  style={{ fontFamily: 'var(--font-oswald)' }}
                >
                  ПРОТИТАНКОВИЙ
                </span>
                <span
                  className="text-[0.6rem] font-semibold tracking-[0.14em] text-[#ececec] uppercase"
                  style={{ fontFamily: 'var(--font-oswald)' }}
                >
                  БАТАЛЬЙОН
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* Placeholder to keep layout when intro is active */}
          {isIntro && <div className="w-[200px]" />}

          {/* ---- DESKTOP NAV ---- */}
          <motion.nav
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: isIntro ? 0 : 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Головна навігація"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="relative text-[0.7rem] font-medium tracking-[0.14em] text-[#8a8a8a] uppercase transition-colors duration-200 hover:text-[#ececec] group"
                style={{ fontFamily: 'var(--font-roboto-mono)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {link.label}
                <span
                  className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#ff5a00] transition-all duration-300 group-hover:w-full"
                  aria-hidden="true"
                />
              </button>
            ))}

            {/* CTA Button */}
            <motion.button
              id="header-join-btn"
              onClick={() => scrollTo('#recruiting-form')}
              className="header-join-btn relative overflow-hidden text-[0.65rem] font-bold tracking-[0.16em] text-white uppercase"
              style={{
                fontFamily: 'var(--font-roboto-mono)',
                background: 'linear-gradient(135deg, #ff5a00 0%, #e84800 100%)',
                border: 'none',
                padding: '9px 22px',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 0 18px rgba(255,90,0,0.3)',
              }}
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(255,90,0,0.55)' }}
              whileTap={{ scale: 0.97 }}
            >
              Приєднатися
            </motion.button>
          </motion.nav>

          {/* ---- MOBILE: Burger ---- */}
          <motion.button
            id="header-burger"
            className="relative z-10 p-2 text-[#ececec] md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Закрити меню' : 'Відкрити меню'}
            initial={{ opacity: 0 }}
            animate={{ opacity: isIntro ? 0 : 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* ---- MOBILE MENU DROPDOWN ---- */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              key="mobile-menu"
              id="mobile-nav"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[10000] flex h-dvh w-full flex-col overflow-hidden md:hidden"
              aria-label="Мобільна навігація"
              style={mobilePanelStyle}
            >
              {/* Top Row: Brand & Close Button */}
              <div 
                className="relative z-10 flex min-h-[60px] w-full items-center justify-between"
                style={{
                  boxSizing: 'border-box',
                  paddingTop: '16px',
                  paddingLeft: 'clamp(16px, 3vw, 48px)',
                  paddingRight: 'clamp(16px, 3vw, 48px)',
                }}
              >
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setMobileOpen(false)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  <Image
                    src="/logos/93_optb/logo_section_Hero.png"
                    alt="93 ОПТБ Логотип"
                    width={44}
                    height={44}
                    className="object-contain"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(255,90,0,0.35))' }}
                  />
                  <span
                    className="font-bold text-white leading-none select-none"
                    style={{
                      fontFamily: 'var(--font-oswald)',
                      fontSize: '2rem',
                      lineHeight: 1,
                    }}
                  >
                    93
                  </span>
                  <div className="flex flex-col leading-tight ml-1">
                    <span
                      className="text-[0.6rem] font-semibold tracking-[0.14em] text-[#ececec] uppercase"
                      style={{ fontFamily: 'var(--font-oswald)' }}
                    >
                      ОКРЕМИЙ
                    </span>
                    <span
                      className="text-[0.6rem] font-semibold tracking-[0.14em] text-[#ececec] uppercase"
                      style={{ fontFamily: 'var(--font-oswald)' }}
                    >
                      ПРОТИТАНКОВИЙ
                    </span>
                    <span
                      className="text-[0.6rem] font-semibold tracking-[0.14em] text-[#ececec] uppercase"
                      style={{ fontFamily: 'var(--font-oswald)' }}
                    >
                      БАТАЛЬЙОН
                    </span>
                  </div>
                </div>

                <button
                  className="p-2 text-[#ececec]"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Закрити меню"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Centered links */}
              <div
                className="relative z-10 flex min-h-0 flex-1 flex-col items-stretch justify-center gap-2.5 py-6"
                style={mobileMenuGutterStyle}
              >
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.href}
                    onClick={() => {
                      setMobileOpen(false)
                      scrollTo(link.href)
                    }}
                    className="group relative flex w-full items-center gap-3 overflow-hidden text-left text-[#ececec]"
                    style={mobileLinkStyle}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    whileTap={{ scale: 0.965, y: 2 }}
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center"
                      aria-hidden="true"
                      style={mobileIconStyle}
                    >
                      <link.icon size={18} strokeWidth={1.8} />
                    </span>
                    <span className="text-[1.05rem] font-bold uppercase leading-none tracking-[0.1em]">
                      {link.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Bottom CTA Button (Elegant margins, tall, blocky like reference) */}
              <div 
                className="relative z-10 mt-auto w-full"
                style={{
                  ...mobileMenuGutterStyle,
                  paddingBottom: '24px',
                }}
              >
                <motion.button
                  onClick={() => {
                    setMobileOpen(false)
                    scrollTo('#recruiting-form')
                  }}
                  className="w-full flex items-center justify-center font-bold text-white transition-all duration-200 hover:bg-[#e04f00]"
                  style={{
                    fontFamily: 'var(--font-sans), sans-serif',
                    background: '#ff5a00',
                    border: 'none',
                    height: '60px',
                    fontSize: '1.05rem',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    boxShadow: '0 4px 20px rgba(255,90,0,0.15)',
                  }}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: NAV_LINKS.length * 0.08 + 0.05, ease: [0.16, 1, 0.3, 1] }}
                  whileTap={{ scale: 0.97, y: 2 }}
                >
                  Приєднатися
                </motion.button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </LayoutGroup>
  )
}
