'use client'

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

/* ============================================================
   FOOTER — мінімалістичний, кінематографічний
   ============================================================ */

const NAV_LINKS = [
  { label: 'Герої',     href: '#about' },
  { label: 'Вакансії',  href: '#vacancies' },
  { label: 'Арсенал',   href: '#equipment' },
  { label: 'FAQ',       href: '#faq' },
  { label: 'Заявка',    href: '#recruiting-form' },
]

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer
      style={{
        background: '#050505',
        borderTop: '1px solid #111',
        padding: 'clamp(48px, 6vw, 72px) clamp(20px, 5vw, 80px) clamp(28px, 4vw, 40px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Very faint horizontal gradient line at top */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: '5%', right: '5%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,90,0,0.2), transparent)',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top row: logo + nav */}
        <div className="footer-top-row">
          {/* Logo / identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={18} color="rgba(255,90,0,0.6)" strokeWidth={1.5} aria-hidden="true" />
            <div>
              <span style={{
                fontFamily: 'var(--font-oswald)',
                fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
                fontWeight: 700,
                color: '#ececec',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                93 ОПТБ
              </span>
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-roboto-mono)',
                fontSize: '0.55rem',
                color: '#3a3a3a',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}>
                Окремий піхотний тактичний батальйон
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Навігація сайту">
            <ul style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'clamp(16px, 2.5vw, 32px)',
              listStyle: 'none',
            }}>
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <motion.a
                    href={link.href}
                    style={{
                      fontFamily: 'var(--font-roboto-mono)',
                      fontSize: '0.65rem',
                      color: '#3a3a3a',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    whileHover={{ color: '#ff5a00' }}
                    onClick={(e) => {
                      e.preventDefault()
                      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: '#111',
          margin: 'clamp(28px, 3vw, 40px) 0',
        }} />

        {/* Bottom row: copyright + disclaimer */}
        <div className="footer-bottom-row">
          <p style={{
            fontFamily: 'var(--font-roboto-mono)',
            fontSize: '0.55rem',
            color: '#2a2a2a',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            © {YEAR} · 93 ОПТБ · Всі права захищені
          </p>
          <p style={{
            fontFamily: 'var(--font-roboto-mono)',
            fontSize: '0.55rem',
            color: '#1e1e1e',
            letterSpacing: '0.08em',
            textAlign: 'right' as const,
          }}>
            Слава Україні · Героям слава
          </p>
        </div>
      </div>
    </footer>
  )
}
