'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'

/* ============================================================
   INFINITE IMAGE MARQUEE (desktop) + SWIPE SLIDER (mobile)
   - Desktop (≥768px): авто-прокручивающаяся лента, пауза по hover
   - Mobile (<768px):  ручной свайп-слайдер с dot-пагинацией
   - Без внешних библиотек — только touch-события + CSS transitions
   ============================================================ */

const SLIDER_IMAGES = [
  '/images/about/slider_img/11.webp',
  '/images/about/slider_img/3.webp',
  '/images/about/slider_img/4.webp',
  '/images/about/slider_img/5.webp',
  '/images/about/slider_img/6.webp',
  '/images/about/slider_img/7.webp',
  '/images/about/slider_img/9.webp',
  '/images/about/slider_img/10.webp',
  '/images/about/slider_img/12.webp',
  '/images/about/slider_img/13.webp',
  '/images/about/slider_img/14.webp',
]

/* ─────────────────────────────────────────────────────────────
   DESKTOP: бесконечная авто-лента
───────────────────────────────────────────────────────────── */

function DesktopMarquee() {
  return (
    <div
      className="marquee-img-wrapper"
      aria-label="Фотогалерея підрозділу"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        paddingTop: '40px',
        paddingBottom: '40px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Левый фейд */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, bottom: 0, left: 0,
        width: '120px', zIndex: 10, pointerEvents: 'none',
        background: 'linear-gradient(to right, #080808 0%, transparent 100%)',
      }} />
      {/* Правый фейд */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, bottom: 0, right: 0,
        width: '120px', zIndex: 10, pointerEvents: 'none',
        background: 'linear-gradient(to left, #080808 0%, transparent 100%)',
      }} />

      <div className="marquee-img-track">
        {SLIDER_IMAGES.map((src, idx) => (
          <MarqueeCard key={`a-${idx}`} src={src} index={idx} />
        ))}
        {SLIDER_IMAGES.map((src, idx) => (
          <MarqueeCard key={`b-${idx}`} src={src} index={idx} ariaHidden />
        ))}
      </div>
    </div>
  )
}

function MarqueeCard({ src, index, ariaHidden }: { src: string; index: number; ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden} style={{
      position: 'relative',
      height: '200px',
      aspectRatio: '3 / 2',
      marginLeft: '10px',
      marginRight: '10px',
      flexShrink: 0,
      flexGrow: 0,
      overflow: 'hidden',
      borderRadius: '8px',
    }}>
      <Image
        src={src}
        alt={ariaHidden ? '' : `Фото підрозділу ${index + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MOBILE: ручной свайп-слайдер
───────────────────────────────────────────────────────────── */

function MobileSlider() {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const isDragging = useRef(false)

  const total = SLIDER_IMAGES.length

  const prev = () => setCurrent(i => Math.max(i - 1, 0))
  const next = () => setCurrent(i => Math.min(i + 1, total - 1))

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = e.touches[0].clientX
    isDragging.current = true
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!isDragging.current) return
    touchEndX.current = e.touches[0].clientX
  }

  function onTouchEnd() {
    if (!isDragging.current) return
    isDragging.current = false
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 40) {
      if (diff > 0) next()
      else prev()
    }
  }

  return (
    <div
      aria-label="Фотогалерея підрозділу"
      style={{
        width: '100%',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '32px',
        paddingBottom: '28px',
        userSelect: 'none',
      }}
    >
      {/* Слайдер */}
      <div style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        borderRadius: '10px',
      }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Трек */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: `translateX(-${current * 100}%)`,
          willChange: 'transform',
        }}>
          {SLIDER_IMAGES.map((src, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                width: '100%',
                flexShrink: 0,
                aspectRatio: '16 / 9',
              }}
            >
              <Image
                src={src}
                alt={`Фото підрозділу ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                draggable={false}
                priority={idx === 0}
              />
            </div>
          ))}
        </div>

        {/* Левая стрелка */}
        {current > 0 && (
          <button
            onClick={prev}
            aria-label="Попередня фотографія"
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(0,0,0,0.55)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ececec',
              fontSize: '16px',
              backdropFilter: 'blur(6px)',
            }}
          >
            ‹
          </button>
        )}

        {/* Правая стрелка */}
        {current < total - 1 && (
          <button
            onClick={next}
            aria-label="Наступна фотографія"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(0,0,0,0.55)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ececec',
              fontSize: '16px',
              backdropFilter: 'blur(6px)',
            }}
          >
            ›
          </button>
        )}
      </div>

      {/* Dot-пагинация */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2px',
        flexWrap: 'nowrap',
        marginTop: '12px',
      }}>
        {SLIDER_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Фото ${idx + 1}`}
            style={{
              width: idx === current ? '28px' : '24px',
              height: '24px',
              flex: '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: idx === current ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: idx === current ? '#ff5a00' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </button>
        ))}
      </div>

      {/* Счётчик */}
      <p style={{
        textAlign: 'center',
        marginTop: '6px',
        fontFamily: 'var(--font-roboto-mono)',
        fontSize: '0.65rem',
        letterSpacing: '0.12em',
        color: 'rgba(255,255,255,0.25)',
      }}>
        {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   ГЛАВНЫЙ ЭКСПОРТ — переключается через CSS
───────────────────────────────────────────────────────────── */

export default function InfiniteMarquee() {
  return (
    <>
      <style>{`
        @keyframes marquee-img {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-img-track {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          width: max-content;
          animation: marquee-img 40s linear infinite;
          will-change: transform;
        }

        @media (hover: hover) {
          .marquee-img-wrapper:hover .marquee-img-track {
            animation-play-state: paused;
          }
        }

        /* Desktop marquee: видно только ≥768px */
        .marquee-desktop-only { display: block; }
        .marquee-mobile-only  { display: none;  }

        @media (max-width: 767px) {
          .marquee-desktop-only { display: none;  }
          .marquee-mobile-only  { display: block; }
        }
      `}</style>

      <div className="marquee-desktop-only">
        <DesktopMarquee />
      </div>

      <div className="marquee-mobile-only">
        <MobileSlider />
      </div>
    </>
  )
}
