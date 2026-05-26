# 93 ОПТБ — Архітектура та Motion-система

> **Версія:** 1.0 | **Дата:** 2026-05-26  
> **Статус:** Живий документ — оновлювати при кожній зміні архітектури.

---

## Зміст

1. [Структура папок](#1-структура-папок)
2. [Дизайн-система](#2-дизайн-система)
3. [Motion-система](#3-motion-система)
4. [Специфікація компонентів](#4-специфікація-компонентів)
5. [Як додати новий компонент](#5-як-додати-новий-компонент)
6. [Робота зі SDD-файлами та агентами](#6-робота-зі-sdd-файлами-та-агентами)

---

## 1. Структура папок

```
TEST_Lending_93/
│
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout: шрифти, SmoothScrollProvider, metadata
│   ├── page.tsx                # Головна сторінка: збирає всі секції
│   └── globals.css             # Design system: токени, keyframes, утиліти, медіа-запити
│
├── components/
│   ├── Hero.tsx                # Кінематографічна Hero-секція
│   ├── About.tsx               # Двоколонкова About-секція
│   ├── Vacancies.tsx           # Bento Grid з вакансіями
│   ├── providers/
│   │   └── SmoothScrollProvider.tsx  # Lenis + GSAP ticker bridge
│   └── ui/                     # shadcn/ui компоненти (не редагувати вручну)
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── radio-group.tsx
│       └── select.tsx
│
├── docs/                       # Проєктна документація
│   ├── architecture_and_motion.md   # ← цей файл
│   ├── spec_theme.md           # Дизайн-токени та мовне правило
│   ├── spec_components.md      # Специфікація компонентів
│   └── todo.md                 # Прогрес розробки по етапах
│
├── lib/
│   └── utils.ts                # cn() helper (clsx + tailwind-merge)
│
└── public/
    └── placeholder-video.mp4   # Відеоплейсхолдер для Hero
```

### Правило іменування файлів

| Тип | Конвенція | Приклад |
|-----|-----------|---------|
| Компоненти React | PascalCase | `Hero.tsx`, `VacancyCard.tsx` |
| Провайдери | PascalCase + суфікс | `SmoothScrollProvider.tsx` |
| CSS-утиліти | kebab-case клас | `.vacancy-card`, `.hud-corner` |
| ID елементів | kebab-case | `id="hero-cta"`, `id="apply-v1"` |
| Документи | snake_case | `architecture_and_motion.md` |

---

## 2. Дизайн-система

### 2.1 Кольорові токени

Всі кольори визначені у `app/globals.css` у блоці `@theme inline {}`.  
Використовуй їх через CSS-змінні — **ніколи не хардкодь hex у компонентах** без потреби.

| Токен | Значення | Призначення |
|-------|----------|-------------|
| `--color-bg` | `#080808` | Базовий фон сторінки |
| `--color-bg-elevated` | `#0f0f0f` | Підняті поверхні |
| `--color-bg-card` | `rgba(255,255,255,0.03)` | Glassmorphism картки |
| `--color-accent` | `#ff5a00` | Тактичний оранжевий — CTA, акценти |
| `--color-accent-glow` | `rgba(255,90,0,0.35)` | Glow-тінь для hover |
| `--color-text-primary` | `#ececec` | Заголовки, важливий текст |
| `--color-text-muted` | `#8a8a8a` | Основний body text |
| `--color-text-dim` | `#4a4a4a` | Дрібні підписи, лейбли |
| `--color-border` | `rgba(255,255,255,0.07)` | Тонкі межі |
| `--color-border-accent` | `rgba(255,90,0,0.5)` | Межі при hover |

### 2.2 Шрифти

Завантажені через `next/font/google` у `app/layout.tsx`:

```tsx
// Oswald — заголовки, тактичні мітки
const oswald = Oswald({ variable: '--font-oswald', ... })

// Roboto Mono — дані, інтерфейс прицілу, body
const robotoMono = Roboto_Mono({ variable: '--font-roboto-mono', ... })
```

**Правило:** ніколи не використовуй системні шрифти у видимому тексті.

```tsx
// ✅ Правильно
style={{ fontFamily: 'var(--font-oswald)' }}
// ❌ Неправильно  
style={{ fontFamily: 'Arial' }}
```

### 2.3 Відступи (Luxury Spacing)

Принцип: **багато повітря**. Використовуй `clamp()` для плавного масштабування.

```css
/* Секція — вертикальний padding */
padding: clamp(80px, 10vw, 160px) clamp(20px, 5vw, 80px);

/* Контейнер — max-width + center */
max-width: 1280px; margin: 0 auto;

/* Картки — внутрішній padding */
padding: clamp(28px, 3vw, 44px);
```

### 2.4 Ефект шуму (Grain/Noise Overlay)

Глобальний, завжди активний. Реалізований у `app/globals.css`:

```css
body::before {
  content: '';
  position: fixed;
  inset: -50%;
  width: 200%; height: 200%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  animation: grain 8s steps(1) infinite; /* keyframe з 10 позиціями */
  background-image: url("data:image/svg+xml,..."); /* SVG feTurbulence */
}
```

> ⚠️ **Не видаляй** `body::before` — це частина cinematic identity проєкту.

### 2.5 Утилітарні CSS-класи

| Клас | Ефект |
|------|-------|
| `.glow-accent` | `box-shadow` помаранчевий glow |
| `.text-glow` | `text-shadow` помаранчевий glow |
| `.glass-card` | Glassmorphism (bg + blur + border) |
| `.tactical-tag` | Маленька тактична мітка Roboto Mono |
| `.shimmer-text` | Градієнтний shimmer на тексті |
| `.reveal-up` | CSS анімація `opacity + translateY + blur` |

---

## 3. Motion-система

> 🎯 Це найважливіший розділ. Всі анімації мають відповідати єдиній motion philosophy.

### 3.1 Стек анімацій

```
Lenis (smooth scroll)
  └── bridged → GSAP ticker
        ├── GSAP ScrollTrigger  (scroll-based animations)
        └── Framer Motion       (component-level interactions)
```

### 3.2 Lenis + GSAP Bridge (`SmoothScrollProvider.tsx`)

**Де живе:** `components/providers/SmoothScrollProvider.tsx`  
**Монтується:** один раз у `app/layout.tsx`, огортає все дерево.

```tsx
// SmoothScrollProvider — ключова логіка
lenis.on('scroll', () => ScrollTrigger.update())   // Lenis → GSAP sync
gsap.ticker.add((time) => lenis.raf(time * 1000))  // GSAP ticker → Lenis RAF
gsap.ticker.lagSmoothing(0)                         // без затримок
```

> ⚠️ **Критично:** НЕ викликай `requestAnimationFrame` вручну в компонентах — цим керує `gsap.ticker`. Подвійний RAF зламає плавність.

### 3.3 GSAP ScrollTrigger у компонентах

**Патерн:** завжди динамічний імпорт (`import('gsap')`), щоб уникнути SSR-помилок.  
**Очищення:** зберігай **лише свої** ScrollTrigger-інстанси у `useRef<STType[]>`.

```tsx
// ✅ Правильний патерн (з About.tsx, Hero.tsx)
import type { ScrollTrigger as STType } from 'gsap/ScrollTrigger'

const stInstances = useRef<STType[]>([])

useEffect(() => {
  let mounted = true

  async function init() {
    const { default: gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    if (!mounted) return

    gsap.registerPlugin(ScrollTrigger)

    const st = gsap.to(element, {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.4,          // плавне гальмування, ~1-1.5
      },
    }).scrollTrigger

    if (st) stInstances.current.push(st)
  }

  init()

  return () => {
    mounted = false
    // ❌ НЕ РОБИТИ: ScrollTrigger.getAll().forEach(t => t.kill())
    // ✅ Вбиваємо лише власні інстанси:
    stInstances.current.forEach(st => st.kill())
    stInstances.current = []
  }
}, [])
```

**Налаштування `scrub`:**

| Значення | Ефект |
|----------|-------|
| `true` | Миттєвий sync зі скролом |
| `1` | Лаг ~1 сек (природний feel) |
| `1.2–1.4` | М'який, кінематографічний |
| `2+` | Дуже повільний, important |

**Типові `start/end` пресети:**

```js
// Параллакс (елемент рухається поки секція проходить viewport)
start: 'top bottom', end: 'bottom top'

// Hero exit (анімація при скролі з першого блоку)
start: 'top top', end: 'bottom top'

// Pinned reveal (елемент залишається на місці)
start: 'top top', end: '+=100%', pin: true
```

### 3.4 Hero Scroll Effect

```tsx
// Hero.tsx — blur + scale + opacity при скролі вниз
gsap.to(contentRef.current, {
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
})
```

> 💡 `willChange: 'filter, transform, opacity'` на елементі — обов'язково для GPU-прискорення.

### 3.5 Parallax-галерея (About Section)

Три блоки рухаються з різною швидкістю:

```tsx
const PARALLAX_SPEEDS = [-25, -55, -70] // px, від повільного до швидкого

items.forEach((el, i) => {
  gsap.to(el, {
    y: PARALLAX_SPEEDS[i],
    ease: 'none',
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.4,
    },
  })
})
```

### 3.6 Framer Motion — Word Stagger Reveal

Використовується у `About.tsx`. Повторюй цей патерн для нових текстових блоків.

```tsx
// Варіанти контейнера
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,  // затримка між словами
      delayChildren: 0.1,
    },
  },
}

// Варіанти одного слова
const wordVariants = {
  hidden: { y: '110%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
}

// JSX — кожне слово у overflow:hidden обгортці
<motion.p variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
  {text.split(' ').map((word, i) => (
    <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.3em' }}>
      <motion.span style={{ display: 'inline-block' }} variants={wordVariants}>
        {word}
      </motion.span>
    </span>
  ))}
</motion.p>
```

> 💡 `overflow: hidden` на обгортці — критично. Без цього слова не «вилізають знизу», а просто з'являються.

**Trigger через `useInView`:**

```tsx
const ref = useRef(null)
const inView = useInView(ref, { once: true, margin: '-8% 0px' })
// margin: відсоток viewport — коли починати анімацію відносно низу вікна
```

### 3.7 Framer Motion — HUD «Захоплення цілі» (Vacancies)

```tsx
// Кутові рамки — у CSS через клас-хук
// У компоненті:
<motion.article
  whileHover={{
    scale: 1.025,
    borderColor: 'rgba(255,90,0,0.45)',
    boxShadow: '0 0 0 1px rgba(255,90,0,0.15), 0 8px 40px rgba(255,90,0,0.12)',
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  }}
>
  <HudCorners />   {/* 4 span-елементи з CSS-переходами */}
</motion.article>
```

```css
/* globals.css — кути з'являються через CSS, а не JS */
.vacancy-card:hover .hud-corner {
  opacity: 1 !important;
  transform: translate(0, 0) !important;
}
```

> 💡 Ділення відповідальності: **Framer Motion** — масштаб + тінь. **CSS** — кутові рамки.  
> Це уникає зайвого JS у RAF-циклі.

### 3.8 Easing-значення проєкту

```tsx
// Cinematic ease — основний для більшості анімацій
ease: [0.16, 1, 0.3, 1]    // cubic-bezier: повільний старт → пружній кінець

// Spring-feel
ease: [0.34, 1.56, 0.64, 1] // трохи overshoots на фіналі

// GSAP
ease: 'power2.inOut'        // для scroll-blur Hero
ease: 'none'                // для scrub parallax (лінійний)
```

---

## 4. Специфікація компонентів

### 4.1 VacancyCard (Bento Grid)

**Файл:** `components/Vacancies.tsx`

```
VacancyCard
├── HudCorners          — 4 кутових span (CSS hover trigger)
├── accent top-line     — градієнтна лінія зверху (opacity: 0 → 1 on hover)
└── content div
    ├── TOP ROW
    │   ├── h3 (title)     — Oswald, clamp(1.4→2rem), top-left
    │   └── category span  — Roboto Mono 0.6rem, #ff5a00 border-pill, top-right
    ├── spacer div         — мінімальна висота залежно від span-типу
    └── BOTTOM ROW
        ├── requirements   — лейбл + текст, Roboto Mono, bottom-left
        └── priority + CTA — badge + кнопка «Відгукнутися», bottom-right
```

**Bento Grid spans:**

| `span` | CSS effect | Коли використовувати |
|--------|-----------|---------------------|
| `'wide'` | `gridColumn: span 2` | Головна/featured вакансія |
| `'tall'` | `gridRow: span 2` | Вакансія з великим текстом |
| `'standard'` | без span | Решта карток |

**Додавання нової вакансії:**

```tsx
// Просто додай об'єкт у масив VACANCIES у Vacancies.tsx:
{
  id: 'v5',
  title: 'Снайпер',
  category: 'Бойова',
  requirement: 'Досвід роботи зі зброєю від 3 років',
  span: 'standard',
  priority: 'КРИТИЧНО',
}
```

### 4.2 About — MediaBlock (Parallax Gallery)

**Файл:** `components/About.tsx`

```tsx
// Додавання нового блоку — просто у масив MEDIA_BLOCKS:
{
  id: 'mb4',
  icon: Target,           // lucide-react іконка
  label: 'Нова секція',
  yRange: -40,            // px parallax offset (від'ємне = рухається вгору)
  aspectRatio: '3/2',
  marginLeft: '15%',      // для асиметрії
}
```

### 4.3 Hero

**Файл:** `components/Hero.tsx`

- Висота: `100svh` (safe viewport height — не ламається на мобільних Safari)
- Відео: `autoPlay muted loop playsInline` — обов'язкові всі 4 атрибути
- Glitch typewriter: хук `useGlitchTypewriter(text, delayMs)` — локальний у файлі
- GSAP cleanup: ізольований через `stInstances.current`

---

## 5. Як додати новий компонент

### Чекліст для нового розділу

```
□ 1. Створи components/NewSection.tsx з 'use client' вгорі
□ 2. Додай id="section-name" на <section> для навігації
□ 3. Використовуй useInView для scroll-triggered анімацій
□ 4. GSAP: динамічний import + stInstances.current для cleanup
□ 5. Мова: ТІЛЬКИ українська у всіх текстах
□ 6. Spacing: clamp() для padding, max-width: 1280px + margin: 0 auto
□ 7. Додай CSS-клас у globals.css якщо потрібна hover-логіка
□ 8. Підключи у page.tsx у правильному порядку
□ 9. npm run build — перевір на TypeScript-помилки
□ 10. Оновити todo.md
```

### Шаблон нового компонента

```tsx
'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { ScrollTrigger as STType } from 'gsap/ScrollTrigger'

export default function NewSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const stInstances = useRef<STType[]>([])
  const inView = useInView(sectionRef, { once: true, margin: '-8% 0px' })

  useEffect(() => {
    let mounted = true
    async function init() {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (!mounted) return
      gsap.registerPlugin(ScrollTrigger)
      // ... твоя GSAP-логіка ...
    }
    init()
    return () => {
      mounted = false
      stInstances.current.forEach(st => st.kill())
      stInstances.current = []
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="new-section"
      aria-label="Опис секції"
      style={{
        background: '#080808',
        padding: 'clamp(80px, 10vw, 160px) clamp(20px, 5vw, 80px)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Контент */}
      </div>
    </section>
  )
}
```

---

## 6. Робота зі SDD-файлами та агентами

### Файли специфікації (docs/)

| Файл | Призначення | Коли читати |
|------|-------------|-------------|
| `spec_theme.md` | Кольори, шрифти, motion-принципи, **мовне правило** | Перед будь-яким новим UI |
| `spec_components.md` | Компонентна специфікація | Перед створенням нових компонентів |
| `todo.md` | Прогрес по етапах | Після кожного завдання |
| `architecture_and_motion.md` | Цей файл — архітектура | При додаванні нових секцій/анімацій |

### Як ставити завдання агенту (prompt-шаблон)

```
Контекст: [прочитай docs/spec_theme.md + docs/architecture_and_motion.md]

Завдання: Створи компонент [Назва].tsx.

Дотримуйся:
- Ukrainian-only тексти (spec_theme.md §Global Language Rule)
- Motion-патерни з architecture_and_motion.md §3
- Luxury spacing: clamp(80px, 10vw, 160px)
- GSAP cleanup через stInstances.current
- TypeScript: npm run build після завершення
- Оновити todo.md
```

### Порядок секцій у page.tsx

```tsx
<main>
  <Hero />        {/* id="hero"      — 100svh, завжди перша */}
  <About />       {/* id="about"     — між Hero і Vacancies */}
  <Vacancies />   {/* id="vacancies" — Bento Grid */}
  <Equipment />   {/* id="equipment" — планується */}
  <Form />        {/* id="recruiting-form" — завжди остання */}
</main>
```

> 🔗 Кнопка «Приєднатися» у Hero скролить до `#recruiting-form` через  
> `document.getElementById('recruiting-form')?.scrollIntoView({ behavior: 'smooth' })`

---

*Документ підтримується автоматично. При додаванні нових анімаційних патернів — оновлюй §3.*
