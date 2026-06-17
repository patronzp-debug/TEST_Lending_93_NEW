# Специфікація: Компонент `MythsAndReality.tsx`

## Огляд

**Назва компонента:** `MythsAndReality`  
**Файл:** `components/MythsAndReality.tsx`  
**Тип:** Client Component (`'use client'`)  
**Мета:** Секція, що розвінчує поширені страхи та myth-and-reality-заблудження щодо служби у 93 ОПТБ, замінюючи їх конкретними фактами.

---

## Позиція в `page.tsx`

```
Hero → MarqueeTicker → About → RecruitmentPath → MarqueeTicker → Vacancies
  → SmartWar
  → [MythsAndReality]   ← СЕКЦІЯ
  → FAQ
  → RecruitingForm
Footer
```

---

## Дизайн-система

| Токен | Значення |
|---|---|
| Фон секції | `#080808` (відповідно до глобального фону) |
| Фон картки | `rgba(26, 26, 26, 1)` / `bg-[#1a1a1a]` |
| Рамка картки (default) | `1px solid rgba(255,255,255,0.05)` |
| Рамка картки (hover) | `1px solid #ff5a00` |
| Акцент | `#ff5a00` |
| Текст заголовку | `#ececec` |
| Підзаголовок секції | `#71717a` (zinc-500) |
| Текст myth | `#71717a` + animated strikethrough |
| Текст реальності | `#d4d4d8` (zinc-300) |
| Шрифт заголовків | `var(--font-oswald)` |
| Шрифт body/mono | `var(--font-roboto-mono)` |

---

## Архітектура компонента

### Типи

```typescript
interface MythCard {
  id: string
  myth: string
  realityHighlight: string
  realityText: string
}
```

### Дані

Масив `MYTHS: MythCard[]` з 4 об'єктів — визначений поза компонентом (статичні дані, не потребують стану).

### JSX-структура

```
<section id="myths-and-reality" aria-label="Міфи та реальність">
  <motion.div> ← max-width контейнер, stagger orchestrator
    <!-- Header block -->
    <div>
      <motion.div class="tactical-tag"> ← анімований тег
      <div style="overflow:hidden">
        <motion.h2> ← slide-up reveal
          МІФИ ТА <span #ff5a00>РЕАЛЬНІСТЬ</span>
      <motion.p> ← підзаголовок
    </div>

    <!-- Cards Grid -->
    <motion.div style="display:grid; grid-template-columns: repeat(auto, 1fr)">
      {MYTHS.map(card => <MythCard />)}
    </motion.div>
  </motion.div>
</section>
```

### Сітка (responsive)

| Breakpoint | Колонки |
|---|---|
| Mobile (< 768px) | 1 |
| Tablet + Desktop (≥ 768px) | 2 |

Реалізація через Tailwind-клас `grid grid-cols-1 md:grid-cols-2 gap-6`.

---

## Компонент картки `<MythCard />`

### Структура

```
<motion.article variants={cardVariants}>  ← hover: border #ff5a00
  <!-- Myth row -->
  <p class="text-sm text-zinc-500">
    {card.myth}
    + Animated strikethrough (see below)

  <hr class="border-white/5 my-5" />

  <!-- Reality row -->
  <div class="flex gap-3">
    <CheckCircle size={20} color="#ff5a00" />   ← lucide-react
    <div>
      <span class="text-[#ff5a00] font-bold">Реальність:</span>
      {" "}{card.reality}   ← Desktop: static text; Mobile: typewriter
```

---

## Анімації (Framer Motion)

| Елемент | Анімація |
|---|---|
| Тег (`tactical-tag`) | `opacity 0→1, x: -16→0` |
| `<h2>` | `y: 105%→0%, opacity 0→1` (кліп-контейнер) |
| Підзаголовок | `opacity 0→1, x: -16→0` |
| Кожна картка | `opacity 0→1, y: 48→0` |
| Stagger cardsContainer | `staggerChildren: 0.1, delayChildren: 0.25` |

Тригер: `useInView` з `once: true, margin: '-8% 0px'`.

---

## ✅ НОВА: Mobile Scroll-Triggered Animations (v2)

### Детектування мобільного пристрою

```tsx
// Безпечний SSR-сумісний підхід
const [isMobile, setIsMobile] = useState(false)

useEffect(() => {
  const mq = window.matchMedia('(max-width: 767px)')
  setIsMobile(mq.matches)
  const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
  mq.addEventListener('change', handler)
  return () => mq.removeEventListener('change', handler)
}, [])
```

**Альтернатива:** CSS медіа-запити (`@media (max-width: 767px)`) для CSS-анімацій, які не потребують JS.

### STEP 2: Animated Strikethrough (Mobile Only)

**Підхід:** Існуюча Framer Motion `scaleX 0→1` анімація вже забезпечує кросбраузерну,  
GPU-прискорену анімацію strikethrough. На мобільних пристроях вона запускається  
коли картка входить у viewport через `useInView` (вже підключено на рівні `MythCardItem`).

**Специфіка реалізації (відповідно до task requirements):**

1. Для десктопу: Framer Motion `motion.div scaleX 0→1` — вже працює.
2. Для мобільного (mobile-only class toggle):
   - Myth text container отримує CSS-клас `myth-text-wrapper`.
   - При `cardInView === true`, додається клас `strike-active`.
   - CSS `::after` pseudo-element на `.myth-text-wrapper::after` анімує `transform: scaleX(0 → 1)` через CSS transition.
   - На desktop (`min-width: 768px`) pseudo-element прихований (`display: none`), Framer Motion `motion.div` видимий.
   - На mobile (`max-width: 767px`) Framer Motion `motion.div` прихований (`display: none`), CSS pseudo-element видимий.

**Детальна CSS-специфікація:**

```css
/* globals.css */
.myth-text-wrapper {
  position: relative;
}

/* Mobile-only pseudo-element strikethrough */
@media (max-width: 767px) {
  .myth-text-wrapper::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1.5px;
    background: linear-gradient(90deg, rgba(113,113,122,0.55) 0%, rgba(113,113,122,0.2) 100%);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
    z-index: 2;
  }
  .myth-text-wrapper.strike-active::after {
    transform: scaleX(1);
  }
  /* Hide Framer Motion strikethrough div on mobile */
  .myth-strike-framer {
    display: none !important;
  }
}

/* Desktop: hide CSS pseudo-element (it's not rendered on desktop naturally),
   show only Framer Motion div */
@media (min-width: 768px) {
  /* Framer Motion handles it — .myth-strike-framer is visible */
  /* myth-text-wrapper::after not defined for desktop (implicit display: none via @media) */
}
```

**Timing:**
- CSS strikethrough delay: `transition-delay: 0.55s` (matches `strikeDelay` from Framer Motion).
- Duration: `0.9s` (slightly longer than desktop `0.65s` for more dramatic mobile feel).

### STEP 3: Multi-line Typewriter Effect (Mobile Only)

**Library decision:** Без зовнішніх бібліотек. Реалізуємо custom hook `useMobileTypewriter`.

**Підхід: `setInterval`-based (сумісний з архітектурними правилами):**

```tsx
// Custom hook — безпечний, не використовує RAF напряму
function useMobileTypewriter(
  text: string,        // повний текст для друку
  isActive: boolean,   // запускати тільки коли картка в viewport
  isMobile: boolean,   // запускати тільки на мобільному
  charDelay: number = 28  // ms між символами (28ms ≈ ~35 chars/sec)
): { displayed: string; isDone: boolean } {
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (!isActive || !isMobile) {
      // На desktop — показуємо весь текст одразу (без стану)
      return
    }
    if (charIndex >= text.length) return

    const timer = setInterval(() => {
      setCharIndex(prev => {
        if (prev >= text.length) {
          clearInterval(timer)
          return prev
        }
        return prev + 1
      })
    }, charDelay)

    return () => clearInterval(timer)
  }, [isActive, isMobile, charIndex, text, charDelay])

  const displayed = isMobile && isActive ? text.slice(0, charIndex) : text
  const isDone = charIndex >= text.length

  return { displayed, isDone }
}
```

**Запобігання jitter/reflow:**
- Контейнер Reality text має фіксовану `min-height` (розраховується через CSS для найдовшого тексту).
- Шрифт: `var(--font-roboto-mono)` — monospace, всі символи однакової ширини → стабільний layout.
- `white-space: pre-wrap` або стандартний `normal` + `word-break: break-word` — текст переноситься природно без horizontal reflow.
- Контейнер: `width: 100%` + `display: block` — не змінює розмір при появі символів.

**Blinking Cursor:**

```css
/* globals.css */
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.typewriter-cursor {
  display: inline-block;
  color: #ff5a00;        /* акцентний колір проекту */
  font-weight: 400;
  animation: blink-cursor 0.8s step-end infinite;
  margin-left: 1px;
  user-select: none;
}
```

Курсор відображається тільки поки `!isDone` і приховується після завершення друку.

**Delay старту:** Typewriter запускається з затримкою `0.8s` після `cardInView === true`  
(після появи картки та strikethrough — Sequential UX storytelling).

### STEP 4: Integration & Optimization

**Запускається лише один раз:**
- `useInView` із `once: true` — спрацьовує один раз за сесію.
- `setInterval` очищається після завершення (`charIndex >= text.length`).

**Desktop не торкається:**
- `isMobile` flag через `matchMedia` — всі typewriter/CSS-strikethrough ефекти оцінюються перед рендером.
- Desktop: статичний текст, Framer Motion strikethrough (вже є, не змінюється).
- Hover border-orange на картках: `whileHover={{ borderColor: '#ff5a00' }}` — залишається без змін.

**Перформанс:**
- CSS strikethrough: `transform: scaleX()` — composite layer, no paint, no layout.
- Typewriter: `setInterval` з `setState` — React batch updates, ~35 updates/sec max.
- `will-change: transform` вже є на картках в компоненті.

**Typewriter delay для кожної картки:**
```
delay = 0.8s (base) + index * 0.15s (stagger offset)
```

---

## Залежності

- `framer-motion` — анімації (вже встановлено)
- `lucide-react` — іконка `CheckCircle` (вже встановлено)
- `react` — `useRef`, `useState`, `useEffect` (вбудовано)
- Tailwind CSS v4 — утилітарні класи (вже встановлено)
- Без нових npm-пакетів

---

## Зміни в `app/globals.css`

Додати в секцію `KEYFRAMES`:
```css
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
```

Додати нову секцію `MYTHS AND REALITY — mobile scroll animations`:
```css
/* CSS strikethrough (mobile only) */
.myth-text-wrapper { position: relative; }

@media (max-width: 767px) {
  .myth-text-wrapper::after { ... }
  .myth-text-wrapper.strike-active::after { transform: scaleX(1); }
  .myth-strike-framer { display: none !important; }
}

/* Blinking typewriter cursor */
.typewriter-cursor {
  display: inline-block;
  color: #ff5a00;
  animation: blink-cursor 0.8s step-end infinite;
  ...
}
```

---

## Інтеграція в `app/page.tsx`

```diff
+ import MythsAndReality from '@/components/MythsAndReality'

  <SmartWar />
+ <MythsAndReality />
  <FAQ />
```

---

_Специфікацію оновлено для v2 (mobile animations). Затверджено. Переходимо до реалізації._
