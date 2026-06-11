'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

/* ============================================================
   FOOTER — мінімалістичний, кінематографічний
   ============================================================ */

const SOCIALS = [
  { name: 'Telegram', icon: '/icons/footer_svg/telegram.svg', href: '#' },
  { name: 'Instagram', icon: '/icons/footer_svg/instagram.svg', href: '#' },
  { name: 'Facebook', icon: '/icons/footer_svg/facebook.svg', href: '#' },
  { name: 'TikTok', icon: '/icons/footer_svg/tiktok.svg', href: '#' },
  { name: 'YouTube', icon: '/icons/footer_svg/youtube.svg', href: '#' },
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
        {/* Top row: logo + contacts */}
        <div className="footer-top-row">
          {/* Logo / identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image
              src="/logos/93_optb/logo_section_Hero.png"
              alt="93 ОПТБ Логотип"
              width={28}
              height={28}
              className="object-contain"
              style={{ filter: 'drop-shadow(0 0 8px rgba(255,90,0,0.35))' }}
            />
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
                Окремий Протитанковий Батальйон
              </span>
            </div>
          </div>

          {/* Contacts Block */}
          <div className="flex flex-wrap gap-8 md:gap-12">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <span style={{
                fontFamily: 'var(--font-roboto-mono)',
                fontSize: '0.55rem',
                color: '#6a6a6a',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}>
                ПИШІТЬ
              </span>
              <motion.a
                href="mailto:a5021armyrobota@gmail.com"
                style={{
                  fontFamily: 'var(--font-roboto-mono)',
                  fontSize: '0.8rem',
                  color: '#ececec',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                whileHover={{ color: '#ff5a00' }}
              >
                a5021armyrobota@gmail.com
              </motion.a>
            </div>

            {/* Recruiting Phone */}
            <div className="flex flex-col gap-1">
              <span style={{
                fontFamily: 'var(--font-roboto-mono)',
                fontSize: '0.55rem',
                color: '#6a6a6a',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}>
                РЕКРУТИНГ
              </span>
              <motion.a
                href="tel:+380971068514"
                style={{
                  fontFamily: 'var(--font-roboto-mono)',
                  fontSize: '0.8rem',
                  color: '#ececec',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                whileHover={{ color: '#ff5a00' }}
              >
                +38 (097) 106 85 14
              </motion.a>
            </div>

            {/* Hotline Phone */}
            <div className="flex flex-col gap-1">
              <span style={{
                fontFamily: 'var(--font-roboto-mono)',
                fontSize: '0.55rem',
                color: '#6a6a6a',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}>
                ГАРЯЧА ЛІНІЯ
              </span>
              <motion.a
                href="tel:+380633939824"
                style={{
                  fontFamily: 'var(--font-roboto-mono)',
                  fontSize: '0.8rem',
                  color: '#ececec',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                whileHover={{ color: '#ff5a00' }}
              >
                +38 (063) 393 98 24
              </motion.a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: '#111',
          margin: 'clamp(28px, 3vw, 40px) 0',
        }} />

        {/* Socials Block */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
          marginBottom: 'clamp(28px, 3vw, 40px)',
        }}>
          {SOCIALS.map(social => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                opacity: 0.6,
              }}
              whileHover={{
                opacity: 1,
                y: -2,
                filter: 'drop-shadow(0 0 8px rgba(255,90,0,0.5))',
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Image
                src={social.icon}
                alt={social.name}
                width={24}
                height={24}
                className="object-contain"
              />
            </motion.a>
          ))}
        </div>

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
