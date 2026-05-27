'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import type { ScrollTrigger as STType } from 'gsap/ScrollTrigger'

/* ============================================================
   TYPEWRITER + GLITCH HOOK
   ============================================================ */

const FULL_TEXT = '93 ОПТБ. ЗНИЩУЙ ВОРОЖУ БРОНЮ'
const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#¡░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█'

function useGlitchTypewriter(text: string, startDelay = 300) {
  const [displayed, setDisplayed] = useState('')
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    let glitchInterval: ReturnType<typeof setInterval>
    let charIndex = 0

    // Initial delay before starting
    timeout = setTimeout(() => {
      glitchInterval = setInterval(() => {
        if (charIndex >= text.length) {
          clearInterval(glitchInterval)
          setDisplayed(text)
          setIsDone(true)
          return
        }

        // Build string: revealed chars + 2-3 random glitch chars at the frontier
        const revealed = text.slice(0, charIndex)
        const glitchCount = Math.floor(Math.random() * 3) + 1
        const glitch = Array.from({ length: glitchCount })
          .map(() => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)])
          .join('')

        setDisplayed(revealed + glitch)

        // Advance every ~65ms, occasional stutter
        if (Math.random() > 0.85) {
          charIndex += 0 // stutter — stay on same char
        } else {
          charIndex++
        }
      }, 65)
    }, startDelay)

    return () => {
      clearTimeout(timeout)
      clearInterval(glitchInterval)
    }
  }, [text, startDelay])

  return { displayed, isDone }
}

/* ============================================================
   HERO COMPONENT
   ============================================================ */

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // Store our own ScrollTrigger instances so cleanup is isolated
  const stInstances = useRef<STType[]>([])
  const { displayed, isDone } = useGlitchTypewriter(FULL_TEXT, 600)

  /* ---- GSAP ScrollTrigger: blur + scale on scroll ---- */
  useEffect(() => {
    let mounted = true

    async function initGSAP() {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      if (!mounted) return

      gsap.registerPlugin(ScrollTrigger)

      const heroEl = heroRef.current
      const contentEl = contentRef.current
      if (!heroEl || !contentEl) return

      // Content: blur + scale down as user scrolls out
      const st1 = gsap.to(contentEl, {
        filter: 'blur(18px)',
        scale: 0.88,
        opacity: 0,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      }).scrollTrigger

      // Video: slow Ken-Burns zoom for parallax depth
      const st2 = gsap.to('.hero-video', {
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      }).scrollTrigger

      // Store only our instances
      if (st1) stInstances.current.push(st1)
      if (st2) stInstances.current.push(st2)
    }

    initGSAP()

    return () => {
      mounted = false
      // Kill only Hero's own ScrollTriggers
      stInstances.current.forEach(st => st.kill())
      stInstances.current = []
    }
  }, [])

  // (Framer Motion animate props handle entrance — no extra useAnimation needed)

  return (
    <section
      ref={heroRef}
      id="hero"
      className="hero-section relative w-full overflow-hidden"
      style={{ height: '100svh' }}
    >
      {/* ---- Background Video ---- */}
      <video
        className="hero-video absolute inset-0 w-full h-full object-cover"
        src="/bg-main.webm"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* ---- Vignette / Dark Gradient Overlay ---- */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(8, 8, 8, 0.55) 0%,
              rgba(8, 8, 8, 0.15) 35%,
              rgba(8, 8, 8, 0.15) 60%,
              rgba(8, 8, 8, 0.85) 100%
            ),
            radial-gradient(
              ellipse at center,
              transparent 40%,
              rgba(8, 8, 8, 0.7) 100%
            )
          `,
        }}
      />

      {/* ---- Scan-line accent (subtle) ---- */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
          backgroundSize: '100% 3px',
        }}
      />

      {/* ---- Content ---- */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ willChange: 'filter, transform, opacity' }}
      >
        {/* Tactical badge */}
        <motion.div
          className="inline-flex items-center gap-2 tactical-tag mb-6"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a00] animate-pulse" />
          <span>93 ОКРЕМИЙ ПРОТИТАНКОВИЙ БАТАЛЬЙОН</span>
        </motion.div>

        {/* Glitch Typewriter H1 */}
        <h1
          className="hero-title relative text-[clamp(2.8rem,8vw,7.5rem)] font-black tracking-tight leading-[1] text-white uppercase select-none"
          style={{
            fontFamily: 'var(--font-oswald)',
            textShadow: isDone
              ? '0 0 40px rgba(255,90,0,0.25), 0 2px 30px rgba(0,0,0,0.8)'
              : '0 0 20px rgba(255,90,0,0.5), 0 0 60px rgba(255,90,0,0.2)',
            letterSpacing: '-0.01em',
            minHeight: '1.1em',
            transition: 'text-shadow 1s ease',
          }}
          aria-label={FULL_TEXT}
        >
          {/* Glitch text layers */}
          <span
            className="relative z-10"
            data-text={displayed}
            style={{ display: 'inline-block' }}
          >
            {/* Red glitch layer */}
            {!isDone && (
              <>
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: `${(Math.random() * 6 - 3).toFixed(1)}px`,
                    color: '#ff3300',
                    opacity: 0.7,
                    clipPath: `inset(${Math.floor(Math.random() * 40)}% 0 ${Math.floor(Math.random() * 40)}% 0)`,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    filter: 'blur(0.5px)',
                  }}
                >
                  {displayed}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: `${(Math.random() * -4 + 2).toFixed(1)}px`,
                    color: '#00d4ff',
                    opacity: 0.4,
                    clipPath: `inset(${Math.floor(Math.random() * 30 + 30)}% 0 ${Math.floor(Math.random() * 20)}% 0)`,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    filter: 'blur(0.3px)',
                  }}
                >
                  {displayed}
                </span>
              </>
            )}
            {displayed}
          </span>

          {/* Blinking cursor */}
          {!isDone && (
            <span
              className="inline-block ml-1 bg-[#ff5a00]"
              style={{
                width: 'clamp(3px, 0.5vw, 6px)',
                height: '0.9em',
                verticalAlign: 'middle',
                animation: 'flicker 0.5s step-end infinite',
                boxShadow: '0 0 10px rgba(255,90,0,0.8)',
              }}
              aria-hidden="true"
            />
          )}
        </h1>

        {/* Subtitle */}
        <motion.p
          className="mt-6 text-[0.7rem] md:text-xs tracking-[0.25em] text-[#8a8a8a] uppercase"
          style={{ fontFamily: 'var(--font-roboto-mono)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isDone ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Служи з честю. Захищай Україну.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 24 }}
          animate={isDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button
            id="hero-cta"
            className="hero-cta-btn relative overflow-hidden uppercase tracking-[0.2em] font-bold text-white border-0"
            style={{
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
              padding: 'clamp(14px, 2vw, 18px) clamp(32px, 4vw, 56px)',
              background: 'linear-gradient(135deg, #ff5a00 0%, #e84800 100%)',
              boxShadow: '0 0 30px rgba(255,90,0,0.35), 0 4px 24px rgba(0,0,0,0.5)',
              borderRadius: '2px',
              height: 'auto',
            }}
            onClick={() => {
              document.getElementById('recruiting-form')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            {/* Shimmer sweep on hover */}
            <span
              className="hero-cta-shimmer pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
                backgroundPosition: '200% center',
                transition: 'background-position 0.5s ease',
              }}
            />
            <span className="relative z-10 flex items-center gap-3">
              Приєднатися
              <span
                className="inline-block"
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 0 8px rgba(255,255,255,0.7)',
                  animation: 'glow-pulse 1.5s ease-in-out infinite',
                }}
              />
            </span>
          </Button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: isDone ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <span
            className="text-[0.6rem] tracking-[0.3em] text-[#4a4a4a] uppercase"
            style={{ fontFamily: 'var(--font-roboto-mono)' }}
          >
            Scroll
          </span>
          <ChevronDown
            className="text-[#4a4a4a] animate-bounce"
            size={16}
            style={{ animationDuration: '1.8s' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
