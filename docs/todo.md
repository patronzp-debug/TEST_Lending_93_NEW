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
- [x] **About Section:** Двоколонка (55/45) на десктопі, одна колонка на мобільному. H2 «ФІЛОСОФІЯ ПІДРОЗДІЛУ» (Oswald, word-by-word slide-up). 2 абзаци з word-stagger Framer Motion. Горизонтальний акцент-дільник. Статистика (2022 / 100% / 24/7). Права колонка — 3 асиметричних placeholder-блоки з GSAP parallax (різна швидкість: -25 / -55 / -70px). Ambient glow за текстом.
- [x] **Vacancies:** Асиметричний Bento Grid (wide/tall/standard spans). Glassmorphism-картки (#222222 border, backdrop-blur). HUD-ефект «захоплення цілі» при hover (кутові рамки #ff5a00, Framer Motion whileHover scale). Stagger reveal при скролі (useInView). Кнопка «Відгукнутися» з accent-hover. Mobile: 1 колонка. 4 вакансії: Оператор ПТРК, Механік-водій, Бойовий медик, Оператор БПЛА.
- [x] **Документація:** Створено `docs/architecture_and_motion.md` — «Біблія» проєкту: структура папок, дизайн-токени, motion-патерни (GSAP + Framer Motion + Lenis bridge), специфікація компонентів, шаблони, prompt-гайд для агентів.
- [x] **Equipment:** Асиметрична сітка (3 col → 2 col tablet → 1 col mobile). 4 картки: Стугна-П, FPV-дрони, Javelin, Bradley. GSAP 3D entrance: `rotateX(18°)→0 + scale(0.9)→1 + y(70px)→0`, perspective 900px. Framer Motion hover: агресивні HUD-кути 28px (box-shadow glow), `borderColor` #ff5a00, `boxShadow` neon. Inner placeholder scale(1.06) незалежно від рамки картки. CSS: `eq-glow` пульсація заголовку, scan-lines текстура на placeholder-блоках. Ізольований cleanup GSAP.

## Етап 4: Premium Form
- [x] **Recruiting Form:** `react-hook-form` + `zod` + `@hookform/resolvers`. 5 полів: ПІБ (мін. 2 слова), Телефон (+380 regex), Вік (18–60), Посада (custom select), Досвід (custom radio). Cinematic підчеркнутий input з `#ff5a00` focus glow. Анімовані помилки (Framer Motion AnimatePresence). Shimmer CTA з loading spinner + success state (CheckCircle2 + spring анімація). Кнопки «Відгукнутися» у вакансіях скролять до `#recruiting-form`.
- [x] **Мікро-інтеракції:** Focus glow на інпутах (CSS `.form-input-field:focus`). Hover підсвічування radio-опцій. AnimatePresence для помилок (slide-down + fade). Shimmer sweep на кнопці submit при hover. Spinner при надсиланні.
- [x] **localStorage:** `watch()` subscribe зберігає стан при кожній зміні. Відновлення при монтуванні через `reset(parsed)`. Очищення після успішного надсилання.


## Етап 5: Motion Polish, FAQ та Mobile Optimization ✅ ЗАВЕРШЕНО
- [x] **FAQ секція:** Кастомний акордеон (без shadcn — нативна реалізація з AnimatePresence height). Двоколонковий layout (заголовок зліва / питання справа). Word-slide H2 анімація при scroll. Stagger reveal кожного питання. Помаранчевий вертикальний акцент-бар у відповіді. ARIA-атрибути (aria-expanded, role="region"). Підключена в `page.tsx` між Equipment та RecruitingForm.
- [x] **Footer:** Мінімалістичний кінематографічний Footer.tsx. Логотип + Shield іконка + слоган. Горизонтальна навігація з smooth-scroll. Горизонтальний помаранчевий gradient divider. Copyright рядок. CSS класи `.footer-top-row` / `.footer-bottom-row` у globals.css. Підключений у `page.tsx` поза `<main>`.
- [x] **Mobile Optimization:** `overflow-x: hidden` на html/body/main. `max-width: 100vw` гарантія. Усі гриди → 1 колонка на мобільному: `.vacancies-grid`, `.equipment-grid`, `.about-grid`, `.faq-grid`. Padding 16px на секціях `<480px`. Hero title `word-break: break-word`. Footer bottom-row stack. GPU-хінти `will-change: transform` + `translateZ(0)` на картках.
- [x] **Motion Polish:** Cinematic easing `[0.16, 1, 0.3, 1]` уніфікований по всіх компонентах. GSAP scrub `1.2–1.4` для плавного паралаксу. AnimatePresence для акордеону. Stagger children 0.1s між FAQ-елементами. Grain/noise overlay z-index 9999 збережено. `overscroll-behavior: none` для iOS.