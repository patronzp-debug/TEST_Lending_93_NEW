# architecture_and_motion.md

Source of Truth generated from executable code only.

## Stack

- Next.js `16.2.6`
- React `19.2.4`
- TypeScript `^5`
- App Router (`app/layout.tsx`, `app/page.tsx`, `app/actions/*`)
- Tailwind CSS `^4` through `@tailwindcss/postcss`
- shadcn/Base UI styles: `shadcn`, `@base-ui/react`
- Framer Motion `^12.40.0`
- GSAP `^3.15.0` with `ScrollTrigger`
- Lenis `@studio-freight/lenis ^1.0.42`
- Google Sheets integration through `googleapis ^173.0.0`
- Forms: `react-hook-form`, `@hookform/resolvers`, `zod`
- Icons: `lucide-react`
- Utility styling: `clsx`, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`

The project does not have an active `tailwind.config.ts`; Tailwind v4 theme tokens live in `app/globals.css`.

The local instruction asks to consult `node_modules/next/dist/docs/`, but that directory is not present in the installed package.

## Runtime Architecture

The app is a single landing page.

`RootLayout` renders a fixed `Header`, wraps content in `IntroProvider`, and wraps page content in `SmoothScrollProvider`.

`Home` renders a section sequence directly. There is no routing subdivision, CMS layer, external data fetch for page content, or API route for public content.

Recruiting form submission is the only server mutation path:

- Client form calls `submitToSheets(data)`.
- `submitToSheets` is a Server Action.
- The action authenticates with Google Sheets via JWT service account.
- It appends a row to `Sheet1!A1`.

## Smooth Scroll

`SmoothScrollProvider` owns Lenis:

- `duration: 1.4`
- Exponential easing: `1.001 - 2^(-10t)`
- Vertical wheel/touch orientation.
- `smoothWheel: true`
- `syncTouch: false` to keep native mobile touch inertia.
- `wheelMultiplier: 1`
- `infinite: false`

Lenis is bridged to GSAP:

- `lenis.on('scroll', () => ScrollTrigger?.update())`
- `gsap.ticker.add((time) => lenis.raf(time * 1000))`
- `gsap.ticker.lagSmoothing(0)`

Global CSS uses `scroll-behavior: auto !important` and `overflow-x: clip` to avoid conflicts with Lenis, especially on mobile.

## GSAP Usage

GSAP is loaded dynamically in client effects, not imported at module top level.

Current GSAP sites:

- `SmoothScrollProvider`: imports GSAP/ScrollTrigger and registers the plugin.
- `Hero`: scroll-linked hero content/video transforms.
- `About`: desktop-only parallax on media blocks.

Hero ScrollTrigger:

- Trigger: hero section.
- Start: `top top`.
- End: `bottom top`.
- Content animation: `scale: 0.88`, `opacity: 0`, `ease: power2.inOut`.
- Video animation: `scale: 1.08`, `ease: none`.
- Both use `scrub: true`.

About ScrollTrigger:

- Registered inside `gsap.matchMedia()`.
- Active only at `min-width: 768px`.
- Each media block animates its `y` offset.
- Trigger: about section.
- Start: `top bottom`.
- End: `bottom top`.
- Uses `scrub: 1.4`.

Cleanup:

- `Hero` and `About` keep ScrollTrigger references and call `kill()`.
- `About` also calls `mm.revert()`.
- `SmoothScrollProvider` destroys Lenis and kills all ScrollTriggers on unmount.

## Framer Motion Usage

Framer Motion handles most reveal, layout and interaction animation:

- Header splash to fixed logo transition with `LayoutGroup`, `AnimatePresence`, shared `layoutId`.
- Hero text entrance variants.
- About word reveal and media-card reveal.
- Recruitment path mobile progress line with `useScroll`/`useTransform`.
- Recruitment desktop image cross-fade.
- Vacancy grid reveal and hover states.
- Mobile vacancy accordions through `AnimatePresence`.
- Smart War staggered section/card reveal.
- Myths and Reality card entrance, strike-through timing, hover effects.
- FAQ accordion open/close and show-more list.
- Recruiting form validation errors, form entrance and success state.

Common easing follows the design token:

- Cinematic ease: `[0.16, 1, 0.3, 1]`
- Some FAQ and checkmark animations use spring transitions.

## CSS Motion

Global keyframes in `app/globals.css`:

- `grain`: animated body noise overlay.
- `flicker`: subtle opacity flicker.
- `glow-pulse`: orange glow pulse.
- `shimmer`: moving text/CTA shine.
- `marquee`: ticker loop.
- `reveal-up`: reusable reveal.
- `scan-line`: defined for scan-line motion.
- `blink-cursor`: mobile typewriter cursor.

Component-specific CSS:

- `.marquee-track`: 7s linear ticker loop.
- `InfiniteMarquee` injects `marquee-img` keyframes for 40s image marquee.
- `.hero-cta-btn`, `.header-join-btn`, `.vacancy-apply-btn`, `.smart-war-card` define hover glow and transform behavior.
- `.AnimatedList.css` defines mobile nested accordion visuals.

## Performance Decisions

Code splitting and SSR safety:

- GSAP and ScrollTrigger are loaded via dynamic `import()` inside `useEffect`.
- There is no current `next/dynamic` usage.
- Heavy scroll animation code runs only on the client.

Media optimization:

- `next/image` is used for logo, about images, gallery images and footer icons.
- Hero and Smart War videos are webm, muted, autoplay, looped and `playsInline`.
- The header logo in intro uses `priority`.
- The first mobile gallery slide uses `priority`.

Animation performance:

- Animated video/media elements use `transform-gpu` and `will-change-transform`.
- Global CSS promotes `.smart-war-card`, `.vacancy-card`, and about media blocks with `will-change` and `translateZ(0)`.
- Scroll listener in `Header` is passive and throttled by `requestAnimationFrame`.
- Recruitment desktop active step detection uses `IntersectionObserver`.
- Mobile typewriter uses `setInterval`, not RAF.

Layout stability:

- Vacancy desktop cards have fixed width/height.
- Smart War media uses fixed `aspectRatio: 16 / 9`.
- About cards use `aspect-video`/`aspect-square`.
- Mobile reality text reserves min-height to prevent reflow during typewriter.
- `overflow-x: clip` is used globally and per main/section where needed.

Input performance and scroll containment:

- Custom select dropdown uses `data-lenis-prevent`, `data-lenis-prevent-wheel`, and `data-lenis-prevent-touch`.
- This prevents Lenis from hijacking dropdown scroll.

## SEO And Metadata

Metadata is defined in `app/layout.tsx`:

- Title: `93 ОПТБ — Служи з Честю`
- Ukrainian description for official recruiting page.
- Keywords: `93 ОПТБ`, `рекрутинг`, `ЗСУ`, `служба`, `батальйон`
- OpenGraph title/description/type/locale.

Current gaps before production:

- No canonical URL configured.
- No OpenGraph image configured.
- No Twitter card metadata configured.
- Social footer links are placeholders.

## Environment Variables

Required for form submission:

- `GOOGLE_SHEET_ID`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`

`GOOGLE_PRIVATE_KEY` is normalized by replacing escaped `\n` with real newlines.

## Local Commands

From project root:

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build production bundle: `npm run build`
- Start production server after build: `npm run start`
- Lint: `npm run lint`
