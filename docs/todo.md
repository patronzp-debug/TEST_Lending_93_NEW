# План разработки кинематографичного лендинга 93 ОПТБ

## Этап 1: Setup & Skills (База)
- [x] Инициализировать Next.js (App Router) + Tailwind CSS + TypeScript.
- [x] Установить AI Skills: `frontend-design`, `frontend-skill`, `awwwards-landing-page`, `animation-principles`, `frontend-magic-ui` (используются как системные инструкции через MCP + spec-файлы).
- [x] Инициализировать `shadcn/ui` (добавить компоненты: button, form, input, select, radio-group).
- [x] Установить зависимости: `framer-motion`, `gsap`, `lenis` (для smooth scroll), `lucide-react`, `clsx`, `tailwind-merge`.
- [x] Настроить глобальные шрифты (Oswald для заголовков, Roboto Mono для текста).

## Этап 2: Архитектура Layout и Скролла
- [x] Настроить Lenis smooth scroll в корневом `layout.tsx` (через `SmoothScrollProvider.tsx`).
- [x] Настроить Tailwind v4 config (темная тема #080808, неоново-оранжевый акцент `#ff5a00`, эффект шума/grain в globals.css).
- [x] Создать базовую структуру `page.tsx`.

## Этап 3: Cinematic Секции (Mobile First)
- [x] **Hero Section:** 100svh. Видео-фон `/placeholder-video.mp4` + vignette оверлей. Глитч-typewriter H1 (Framer Motion + CSS glitch layers). CTA-кнопка #ff5a00 с neon-glow при hover. GSAP ScrollTrigger: blur(18px) + scale(0.88) + opacity→0 при скролле. Изолированный cleanup ST-инстансов.
- [ ] **About Section:** Кинематографичная подача. Плавное появление текста (stagger reveal) + параллакс изображений.
- [ ] **Vacancies:** Избегать стандартных "дешевых" карточек. Премиальный Grid. Hover-эффекты "захвата цели" (Framer Motion).
- [ ] **Equipment:** Сетка с 3D-feel эффектом (GSAP ScrollTrigger).

## Этап 4: Premium Form
- [ ] **Recruiting Form:** Использовать `shadcn/ui` + `react-hook-form` + `zod`. 
- [ ] Настроить микро-взаимодействия (micro-interactions) при фокусе на инпутах.
- [ ] Сохранение стейта в `localStorage`.

## Этап 5: Motion Polish
- [ ] Финальный проход с `animation-principles`. Настройка таймингов, физики движения, page transitions.