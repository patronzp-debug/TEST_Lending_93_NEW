# spec_components.md

Source of Truth generated from executable code only.

## Route Tree

`app/layout.tsx`

- Loads `Oswald` and `Roboto_Mono` with `next/font/google`.
- Defines metadata for Ukrainian SEO/OpenGraph.
- Renders:
  - `<IntroProvider>`
    - `<Header />`
    - `<SmoothScrollProvider>`
      - `{children}`

`app/page.tsx`

- Single landing route.
- Renders in this order:
  - `Hero`
  - `MarqueeTicker`
  - `About`
  - `RecruitmentPath`
  - `MarqueeTicker`
  - `Vacancies`
  - `SmartWar`
  - `MythsAndReality`
  - `FAQ`
  - `RecruitingForm`
  - `Footer` outside `<main>`

## Providers

`components/providers/IntroContext.tsx`

- Client context with `isIntro` and `finishIntro`.
- Initial state is `isIntro: true`.
- `Header` calls `finishIntro()` after `1500ms`.
- `Hero` delays text visibility until intro finishes.

`components/providers/SmoothScrollProvider.tsx`

- Client provider that initializes Lenis.
- Dynamically imports `gsap` and `gsap/ScrollTrigger` inside `useEffect`.
- Bridges Lenis scroll events to `ScrollTrigger.update()`.
- Uses `gsap.ticker` to drive `lenis.raf`.
- Destroys Lenis and kills ScrollTriggers on cleanup.

## Header

`components/Header.tsx`

- Fixed top navigation with cinematic splash intro.
- Uses Framer Motion `LayoutGroup`, `AnimatePresence`, shared `layoutId` values for logo/title transition from centered splash into the header.
- Tracks scroll with a passive listener throttled by `requestAnimationFrame`; changes background/border after `window.scrollY > 40`.
- Desktop nav anchors: About, Vacancies, Smart War, FAQ.
- Desktop CTA scrolls to `#recruiting-form`.
- Mobile nav is a full-screen animated panel with lucide icons and a bottom CTA.

## Hero

`components/Hero.tsx`

- Full viewport `100svh` section with `/videos/bg-main.webm`.
- Framer Motion animates headline lines from left/right/top and CTA from bottom after intro.
- CTA scrolls to `#recruiting-form`.
- Dynamically imports `gsap` and `ScrollTrigger` in `useEffect`.
- Scroll animation:
  - Hero content scales to `0.88` and fades out.
  - Background video scales to `1.08`.
  - Both use `scrub: true`.

## Marquee Components

`components/MarqueeTicker.tsx`

- Orange text ticker between sections.
- Duplicates text in two spans and relies on `.marquee-track` keyframes.
- Marked `aria-hidden`.

`components/InfiniteMarquee.tsx`

- Used at the end of `About`.
- Desktop: infinite image marquee with duplicated image set and pause on hover.
- Mobile: touch slider with arrows, dot pagination and counter.
- Uses `next/image` for gallery assets.

## About

`components/About.tsx`

- Two-column section: copy/stats on the left, media grid on the right.
- Uses Framer Motion `useInView` for word-by-word and card reveal.
- Uses local `StaggerText` helper.
- Dynamically imports `gsap` and `ScrollTrigger` in `useEffect`.
- Desktop-only GSAP parallax is registered via `gsap.matchMedia('(min-width: 768px)')`.
- Includes `InfiniteMarquee`.

## Recruitment Path

`components/RecruitmentPath.tsx`

- White contrast section with five recruitment steps.
- Mobile/tablet: `MobileTimeline` uses Framer Motion `useScroll` and `useTransform` to grow the progress line.
- Desktop: two-column layout with sticky `DesktopImagePanel` and scrolling `DesktopStepItem` list.
- Active desktop step is determined with `IntersectionObserver`.
- Image transitions use Framer Motion cross-fade.

## Vacancies

`constants/vacancies.ts`

- Source of vacancy data.
- Exports flat `VACANCIES` and grouped `VACANCY_CATEGORIES`.
- Current data set: 16 vacancies across 5 categories.

`components/Vacancies.tsx`

- Uses `VACANCIES` for desktop grid and `VACANCY_CATEGORIES` for mobile accordion.
- Desktop:
  - Category filters in local state.
  - Fixed-size vacancy cards.
  - Card background image, priority label, short description and CTA.
- Mobile/tablet:
  - Delegates to `AnimatedList`.

`components/AnimatedList.tsx` and `components/AnimatedList.css`

- Mobile nested accordion.
- Level 1: vacancy categories.
- Level 2: vacancies within the category.
- Uses Framer Motion `AnimatePresence` for height/opacity transitions.
- Apply buttons scroll to `#recruiting-form`.

## Smart War

`components/SmartWar.tsx`

- Four-card grid describing modern warfare directions.
- Each card can render an autoplay muted looping video.
- Uses Framer Motion variants and `useInView` for staggered section/card reveal.
- Responsive grid is controlled by `.smart-war-grid` CSS media queries.

## Myths And Reality

`components/MythsAndReality.tsx`

- Four cards pairing a myth with a reality statement.
- Uses Framer Motion section, heading and per-card entrance animations.
- Desktop reality text is static.
- Mobile uses `matchMedia('(max-width: 767px)')` and a custom setInterval typewriter hook.
- Typewriter cursor style is defined globally as `.typewriter-cursor`.

## FAQ

`components/FAQ.tsx`

- 13 FAQ items.
- Shows first 5 by default.
- “Show all” reveals remaining items with `AnimatePresence`.
- One open accordion item is tracked by `openId`.
- Uses accessible `aria-expanded`, `aria-controls`, `role="region"`.

## Recruiting Form

`components/RecruitingForm.tsx`

- Uses `react-hook-form`, `zod`, `@hookform/resolvers/zod`.
- Fields:
  - `fullName`: at least two words.
  - `phone`: `+380` plus 9 digits.
  - `age`: integer 18-60.
  - `position`: selected vacancy.
  - `hasExperience`: yes/no.
- Stores draft in `localStorage` under `93optb_form_draft`.
- Custom inline `CinematicSelect` consumes `VACANCY_CATEGORIES`.
- Custom inline radio group handles military experience.
- Submit state uses loading/success UI with lucide icons.
- On success, clears localStorage and replaces form with success screen.

`app/actions/submitToSheets.ts`

- Server Action.
- Uses `googleapis`.
- Requires `GOOGLE_SHEET_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`.
- Appends a row to `Sheet1!A1`.
- Formats timestamp in `Europe/Kyiv`.

## Footer

`components/Footer.tsx`

- Dark footer with logo, email, recruiting phone, hotline phone, social icons and copyright.
- Social links currently prevent default and show `alert('Сервіс в розробці')`.
- Year is computed with `new Date().getFullYear()`.

## UI Primitives

`components/ui/*`

- Base UI/shadcn-style primitives exist for `Button`, `Input`, `Select`, `RadioGroup`, `Label`.
- `Button` is actively used in `Hero` and `Vacancies`.
- `RecruitingForm` currently implements custom inline controls instead of importing `Input`, `Select`, `RadioGroup`, or `Label`.
- `lib/utils.ts` exports `cn()` using `clsx` and `tailwind-merge`.

## Lazy Loading

No component currently uses `next/dynamic`.

Current lazy/client-only loading is implemented with dynamic `import()`:

- `components/providers/SmoothScrollProvider.tsx`: imports `gsap` and `gsap/ScrollTrigger`.
- `components/Hero.tsx`: imports `gsap` and `gsap/ScrollTrigger`.
- `components/About.tsx`: imports `gsap` and `gsap/ScrollTrigger`.

This keeps GSAP out of server execution and delays the animation library until client effects run.
