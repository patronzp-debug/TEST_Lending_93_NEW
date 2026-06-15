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
  → [MythsAndReality]   ← НОВА СЕКЦІЯ
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
| Текст myth | `#71717a` + `line-through` |
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
  reality: string
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
  <p class="text-sm line-through text-zinc-500">
    {card.myth}

  <hr class="border-white/5 my-5" />

  <!-- Reality row -->
  <div class="flex gap-3">
    <CheckCircle size={20} color="#ff5a00" />   ← lucide-react
    <div>
      <span class="text-[#ff5a00] font-bold">Реальність:</span>
      {" "}{card.reality}   ← text-zinc-300 text-sm
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

## Залежності

- `framer-motion` — анімації (вже встановлено)
- `lucide-react` — іконка `CheckCircle` (вже встановлено)
- `react` — `useRef` (вбудовано)
- Tailwind CSS v4 — утилітарні класи (вже встановлено)

---

## Інтеграція в `app/page.tsx`

```diff
+ import MythsAndReality from '@/components/MythsAndReality'

  <SmartWar />
+ <MythsAndReality />
  <FAQ />
```

---

_Специфікацію затверджено. Переходимо до реалізації._
