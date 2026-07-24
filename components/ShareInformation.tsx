'use client'

import Image from 'next/image'
import { Check, Copy, Send, Share2 } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useState } from 'react'
import { useRef } from 'react'

const PUBLIC_PAGE_URL = 'https://93optb.com.ua/'

export default function ShareInformation() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-12% 0px' })
  const [copied, setCopied] = useState(false)

  const getUrl = () => window.location.href

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '93 ОПТБ | Рекрутинг',
          text: 'Допоможіть знайти свого спеціаліста.',
          url: getUrl(),
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        await copyLink()
      }
      return
    }
    await copyLink()
  }

  return (
    <section ref={sectionRef} aria-labelledby="share-information-title" className="share-information-section">
      <div className="share-information-inner">
        <div>
          <span className="tactical-tag mb-4 inline-flex">Передай далі / 93 ОПТБ</span>
          <motion.h2
            id="share-information-title"
            className="share-information-title text-[clamp(1.8rem,4vw,3.2rem)] text-white"
            initial={{ opacity: 0, y: 30, filter: 'blur(7px)' }}
            animate={inView
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 30, filter: 'blur(7px)' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform, opacity, filter' }}
          >
            Знаєш людину, якій це може бути потрібно?
          </motion.h2>
          <p className="mt-4 text-[0.78rem] text-[#8a8a8a]">Допоможіть знайти свого спеціаліста.</p>
        </div>

        <button type="button" onClick={nativeShare} className="share-information-main-button">
          <Share2 size={17} /> Поділитися
        </button>

        <div className="share-information-actions" aria-label="Варіанти поширення">
          <a className="share-information-action" href={`https://t.me/share/url?url=${encodeURIComponent(PUBLIC_PAGE_URL)}&text=${encodeURIComponent('Допоможіть знайти свого спеціаліста.')}`} target="_blank" rel="noopener noreferrer">
            <Send size={16} /> Telegram
          </a>
          <a className="share-information-action" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(PUBLIC_PAGE_URL)}`} target="_blank" rel="noopener noreferrer">
            <Image src="/icons/footer_svg/facebook.svg" alt="" width={16} height={16} className="h-4 w-4 object-contain" /> Facebook
          </a>
          <button type="button" className="share-information-action" onClick={copyLink}>
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Скопійовано' : 'Копіювати посилання'}
          </button>
          <span className="share-information-instagram">Instagram: поділіться через Stories</span>
        </div>
      </div>
    </section>
  )
}
