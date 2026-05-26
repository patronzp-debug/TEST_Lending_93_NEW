# Визуальный стиль и Cinematic Design System

## Aesthetic & Vibe
- **Style:** Cinematic Military, Dark Futuristic, Premium Tactical.
- **Inspiration Quality:** Уровень Apple, Linear, Stripe, но в агрессивной военной стилистике.
- **Layout:** Много воздуха (luxury spacing), большие отступы, никаких загроможденных интерфейсов.
- **Avoid:** Generic SaaS layout, bootstrap feeling, boring borders, overcrowded UI, дешевые тени.

## Colors & Typography
- **Background:** `#080808` (Почти абсолютный черный) с grain/noise overlay.
- **Accent Primary:** `#ff5a00` (Тактический неоново-оранжевый). Использовать glow-эффекты при hover.
- **Text:** `#ececec` для заголовков, `#8a8a8a` для второстепенного текста.
- **Fonts:** 
  - Заголовки: `Oswald` (массивность, кинематографичность).
  - Текст/Данные: `Roboto Mono` (технологичность, код, интерфейс прицела).

## Motion Principles (Strict)
Использовать `animation-principles` и `awwwards-landing-page`.
- **Scroll:** Строго smooth scrolling (Lenis).
- **Reveal:** Staggered reveal для текста (слова или буквы появляются по очереди).
- **Transitions:** Floating gradients на фоне, subtle parallax для изображений.
- **Micro-interactions:** Кнопки и карточки должны живо реагировать на курсор (glow hover, magnet effect).