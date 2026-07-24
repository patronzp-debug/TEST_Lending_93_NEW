'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const CHANNELS = [
  {
    name: 'Telegram',
    description: 'Оперативні новини та можливості',
    icon: '/icons/footer_svg/telegram.svg',
    href: 'https://t.me/rekruting_93optb',
  },
  {
    name: 'Instagram',
    description: 'Історії, люди та щоденна служба',
    icon: '/icons/footer_svg/instagram.svg',
    href: 'https://www.instagram.com/p/DaVBrqMiAXA/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    name: 'Facebook',
    description: 'Офіційні публікації 93 ОПТБ',
    icon: '/icons/footer_svg/facebook.svg',
    href: 'https://www.facebook.com/profile.php?id=61591548422987',
  },
]

export default function InformationSupport() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-12% 0px' })

  return (
    <section
      ref={sectionRef}
      aria-labelledby="information-support-title"
      className="information-support-section relative overflow-hidden"
    >
      <div className="information-support-grid absolute inset-0" aria-hidden="true" />

      <div
        className="information-support-container"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <motion.div
          className="information-support-intro"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="tactical-tag mb-5 inline-flex">Інформаційна підтримка / 93 ОПТБ</span>
          <motion.h2
            id="information-support-title"
            className="information-support-title"
            initial={{ opacity: 0, y: 34, filter: 'blur(8px)' }}
            animate={inView
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 34, filter: 'blur(8px)' }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{
              color: '#ececec',
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: 'clamp(36px, 5vw, 72px)',
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              textAlign: 'left',
              textTransform: 'uppercase',
            }}
          >
            <span
              className="information-support-title-main"
              style={{
                display: 'block',
                color: '#ececec',
                fontFamily: 'inherit',
                lineHeight: 'inherit',
              }}
            >
              🇺🇦 Підтримай 93 ОПТБ
            </span>
            <span
              className="information-support-title-secondary"
              style={{
                display: 'block',
                marginTop: '0.1em',
                color: '#ececec',
                fontFamily: 'inherit',
                lineHeight: 'inherit',
              }}
            >
              інформаційно
            </span>
          </motion.h2>
          <div className="information-support-copy">
            <p className="information-support-copy-primary">
              Не кожен може приєднатися зараз. Але кожен може допомогти поширити важливу інформацію.
            </p>
            <p className="information-support-copy-secondary">
              Можливо, серед ваших знайомих є людина, якій потрібна саме ця інформація.
            </p>
          </div>
        </motion.div>

        <motion.p
          className="information-support-follow-label"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Підпишись на офіційні сторінки 93 ОПТБ:
        </motion.p>

        <div className="information-support-cards mt-6">
          {CHANNELS.map((channel, index) => (
            <motion.a
              key={channel.name}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="information-support-card group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.55, delay: 0.45 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex min-w-0 items-center gap-4">
                <Image src={channel.icon} alt={`${channel.name} 93 ОПТБ`} width={34} height={34} className="h-8 w-8 object-contain opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="min-w-0">
                  <strong className="block font-[var(--font-oswald)] text-[1.25rem] uppercase tracking-[0.04em] text-[#ececec]">{channel.name}</strong>
                  <p className="information-support-card-description">{channel.description}</p>
                </div>
              </div>
              <ArrowUpRight size={20} className="text-[#666] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#ff5a00]" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
