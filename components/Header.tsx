'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useIntro } from '@/components/providers/IntroContext'
import { Menu, X } from 'lucide-react'

/* ============================================================
   NAV LINKS
   ============================================================ */

const NAV_LINKS = [
  { label: 'Герої', href: '#about' },
  { label: 'Вакансії', href: '#vacancies' },
  { label: 'Арсенал', href: '#equipment' },
  { label: 'FAQ', href: '#faq' },
]

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

  /* Track scroll for subtle background change */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
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
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Dark overlay for splash */}
            <motion.div
              className="absolute inset-0 bg-[#080808]"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />
            <motion.div
              layoutId="brand"
              className="relative z-10 flex flex-col items-center gap-5"
              style={{ originX: 0.5, originY: 0.5 }}
            >
              <motion.div
                layoutId="brand-logo"
                style={{ originX: 0.5, originY: 0.5 }}
              >
                <Image
                  src="/logo_section_Hero.png"
                  alt="93 ОПТБ Логотип"
                  width={180}
                  height={180}
                  priority
                  className="object-contain drop-shadow-[0_0_40px_rgba(255,90,0,0.5)]"
                  style={{ filter: 'drop-shadow(0 0 40px rgba(255,90,0,0.45))' }}
                />
              </motion.div>
              <motion.div
                layoutId="brand-text"
                className="flex flex-col items-center"
              >
                <motion.p
                  className="text-[clamp(1.1rem,3vw,1.8rem)] font-bold tracking-[0.18em] text-[#ececec] uppercase text-center"
                  style={{
                    fontFamily: 'var(--font-oswald)',
                    textShadow: '0 0 30px rgba(255,90,0,0.4), 0 2px 20px rgba(0,0,0,0.8)',
                    letterSpacing: '0.18em',
                  }}
                >
                  93 окремий протитанковий
                </motion.p>
                <motion.p
                  className="text-[clamp(1.1rem,3vw,1.8rem)] font-bold tracking-[0.18em] text-[#ff5a00] uppercase text-center"
                  style={{
                    fontFamily: 'var(--font-oswald)',
                    textShadow: '0 0 30px rgba(255,90,0,0.6)',
                    letterSpacing: '0.18em',
                  }}
                >
                  батальйон
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- FIXED HEADER ---- */}
      <header
        id="site-header"
        className="fixed top-0 left-0 right-0 z-[9997]"
        style={{
          background: scrolled
            ? 'rgba(8,8,8,0.92)'
            : 'linear-gradient(to bottom, rgba(8,8,8,0.75) 0%, transparent 100%)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease',
        }}
      >
        <div
          className="flex items-center justify-between px-6 md:px-10 lg:px-16"
          style={{ height: '72px' }}
        >
          {/* ---- BRAND (animates from center to here) ---- */}
          {!isIntro && (
            <motion.div
              layoutId="brand"
              className="flex items-center gap-3 cursor-pointer"
              style={{ originX: 0, originY: 0.5 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <motion.div layoutId="brand-logo" style={{ originX: 0.5, originY: 0.5 }}>
                <Image
                  src="/logo_section_Hero.png"
                  alt="93 ОПТБ Логотип"
                  width={44}
                  height={44}
                  className="object-contain"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255,90,0,0.35))' }}
                />
              </motion.div>

              <motion.div layoutId="brand-text" className="flex flex-col leading-tight">
                <span
                  className="text-[0.65rem] font-semibold tracking-[0.15em] text-[#ececec] uppercase"
                  style={{ fontFamily: 'var(--font-oswald)' }}
                >
                  93 окремий протитанковий
                </span>
                <span
                  className="text-[0.65rem] font-semibold tracking-[0.15em] text-[#ff5a00] uppercase"
                  style={{ fontFamily: 'var(--font-oswald)' }}
                >
                  батальйон
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
                borderRadius: '2px',
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
            className="md:hidden relative z-10 p-2 text-[#ececec]"
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
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden md:hidden"
              style={{
                background: 'rgba(8,8,8,0.97)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
              aria-label="Мобільна навігація"
            >
              <div className="flex flex-col px-6 py-6 gap-5">
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.href}
                    onClick={() => {
                      setMobileOpen(false)
                      scrollTo(link.href)
                    }}
                    className="text-left text-[0.75rem] font-medium tracking-[0.14em] text-[#8a8a8a] uppercase transition-colors duration-200 hover:text-[#ececec]"
                    style={{ fontFamily: 'var(--font-roboto-mono)', background: 'none', border: 'none', cursor: 'pointer' }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {link.label}
                  </motion.button>
                ))}
                <motion.button
                  onClick={() => {
                    setMobileOpen(false)
                    scrollTo('#recruiting-form')
                  }}
                  className="mt-2 text-[0.7rem] font-bold tracking-[0.16em] text-white uppercase"
                  style={{
                    fontFamily: 'var(--font-roboto-mono)',
                    background: 'linear-gradient(135deg, #ff5a00 0%, #e84800 100%)',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    boxShadow: '0 0 18px rgba(255,90,0,0.3)',
                  }}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: NAV_LINKS.length * 0.06 + 0.05, ease: [0.16, 1, 0.3, 1] }}
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
