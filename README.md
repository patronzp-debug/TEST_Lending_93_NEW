# 93 ОПТБ — Служи з Честю | Окремий Протитанковий Батальйон

Кінематографічний високотехнологічний рекрутинговий лендинг формату Military Landing Page для 93 ОПТБ.

Проєкт розроблений з фокусом на максимальну продуктивність, преміальний UI, глибоку інтерактивність та стабільну роботу на різних класах пристроїв: від сучасних desktop-систем до смартфонів і слабших машин у польових умовах.

## Технічний стек

| Напрям | Технології |
| --- | --- |
| Core | Next.js `16.2.6`, App Router, Server Actions, React `19.2.4`, TypeScript |
| Стилізація | Tailwind CSS v4, PostCSS, дизайн-токени та глобальні шари в `app/globals.css` |
| Motion | GSAP `3.15.0`, ScrollTrigger, Framer Motion |
| Smooth Scroll | Lenis з синхронізацією через GSAP ticker |
| Форми | `react-hook-form`, `zod`, `@hookform/resolvers` |
| Інтеграції | Google Sheets API через Server Action |
| UI та утиліти | Base UI / shadcn-style primitives, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority` |

## Основний функціонал

### Cinematic Splash Intro

Початковий екран з анімованим брендом 93 ОПТБ. Логотип і текстова ідентичність стартують у центрі viewport, після чого через Framer Motion переходять у фіксовану шапку сайту.

### Hero Section

Повноекранний hero-блок на базі webm-відео з затемненням, віньєткою, scan-lines ефектом і CTA. Під час скролу GSAP ScrollTrigger масштабує відео та плавно прибирає контент через scale/fade.

### About та Recruitment Path

Секція про підрозділ використовує word reveal, асиметричну media-сітку, GSAP-паралакс на desktop та адаптивну фотострічку: desktop marquee і mobile swipe slider.

Секція шляху рекрутингу побудована як контрастний білий блок: на desktop працює sticky-панель із зображеннями та активним кроком, на mobile — вертикальний timeline із прогресом.

### Vacancies, Smart War, Myths, FAQ

Вакансії мають desktop-фільтри та картки з фоновими зображеннями, а на mobile переходять у вкладений accordion за категоріями. Додаткові секції пояснюють технологічну специфіку підрозділу, розбивають типові міфи та дають відповіді на ключові питання рекрутів.

### Форма заявки

Форма рекрутингу реалізована без стороннього бекенду:

- кастомні інпути, select і radio controls;
- валідація на льоту через `zod`;
- збереження чернетки в `localStorage`;
- loading та success states;
- захищена відправка напряму в Google Sheets через Next.js Server Action.

## Рішення для оптимізації

Проєкт оптимізований під плавну роботу на слабших пристроях і нестабільному користувацькому середовищі.

- Heavy motion libraries не потрапляють у server runtime: GSAP і ScrollTrigger завантажуються динамічно через `import()` тільки на клієнті.
- Lenis синхронізований з GSAP ticker, щоб scroll-driven анімації не конфліктували між собою.
- Для важких анімацій і відео використовуються GPU hints: `transform-gpu`, `will-change`, `translateZ(0)`.
- Scroll listener у header працює з `passive: true` і throttling через `requestAnimationFrame`.
- Для горизонтального overflow використовується `overflow-x: clip`, що не створює зайвий scroll container і не ламає мобільний Lenis-scroll.
- Випадаючі списки форми захищені від перехоплення плавним скролом через `data-lenis-prevent`, `data-lenis-prevent-wheel` і `data-lenis-prevent-touch`.
- Для layout stability використовуються фіксовані розміри карток, `aspect-ratio` для media-блоків і резервування висоти в mobile typewriter-зонах.
- Візуальні assets оптимізовані через webm-відео та `next/image` там, де це відповідає структурі компонента.

## Локальний запуск та деплой

### Встановлення залежностей

```bash
npm install
```

### Запуск dev-сервера

```bash
npm run dev
```

Після запуску відкрити:

```text
http://localhost:3000
```

### Production build

```bash
npm run build
```

### Production start

```bash
npm run start
```

### Перевірка lint

```bash
npm run lint
```

## Змінні оточення

Для роботи форми заявки з Google Sheets потрібен `.env.local` або production env з такими значеннями:

```bash
GOOGLE_SHEET_ID=
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

`GOOGLE_PRIVATE_KEY` може зберігатися з escaped newline (`\n`); Server Action нормалізує ключ перед авторизацією.

## Поточний статус проєкту

Основна фаза розробки лендингу завершена. Поточний етап — фінальна поліровка кодової бази перед деплоєм:

- усунення попереджень і помилок лінтера React 19 / TypeScript;
- перевірка hydration у production build;
- фінальна SEO-підготовка: canonical URL, OpenGraph image, Twitter card;
- перевірка Google Sheets env на production;
- заміна placeholder-посилань соціальних мереж у footer.

Документація SDD оновлена за фактичним станом виконуваного коду та використовується як актуальний Source of Truth для фінального етапу.
