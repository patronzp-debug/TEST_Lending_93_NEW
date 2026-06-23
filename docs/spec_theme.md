пше# spec_theme.md

Source of Truth generated from executable code only.

## Design System

Landing uses a cinematic military style for 93 ОПТБ: dark base, orange tactical accent, uppercase condensed headings, mono interface copy, grain overlay, video/photo surfaces, thin borders and restrained glow.

Tailwind is v4. There is no active `tailwind.config.ts` in the repository. Theme tokens are declared in `app/globals.css` through `@theme inline`, with shadcn/Base UI compatibility variables also present in `:root` and `.dark`.

## Color Tokens

Primary tokens from `app/globals.css`:

- Background: `#080808`
- Elevated background: `#0f0f0f`
- Dark footer/form background: `#050505`
- Card surface: `rgba(255,255,255,0.03)`
- Main accent orange: `#ff5a00`
- Darker orange CTA stop: `#e84800`
- Critical red-orange: `#ff2200`
- Primary text: `#ececec`
- White text: `#ffffff`
- Muted text: `#8a8a8a`
- Secondary muted text: `#6a6a6a`
- Dim text: `#4a4a4a`
- Deep divider/border: `#111`, `#1a1a1a`, `#222222`
- Default translucent border: `rgba(255,255,255,0.07)`
- Accent border: `rgba(255,90,0,0.5)`
- Accent glow: `rgba(255,90,0,0.35)`
- Accent dim: `rgba(255,90,0,0.15)`

## Gradients

Common gradients used in the live UI:

- Orange CTA gradient: `linear-gradient(135deg, #ff5a00 0%, #e84800 100%)`
- Hero overlay: dark vertical gradient plus center vignette over `/videos/bg-main.webm`
- Header mobile panel: orange radial accent plus `linear-gradient(180deg, #080808 0%, #101010 52%, #1a1a1a 100%)`
- Text shimmer: `linear-gradient(90deg, #ececec 0%, #ff5a00 50%, #ececec 100%)`
- Form card: `linear-gradient(to bottom, #1a1a1a 0%, #050505 100%)`
- Form success button: `linear-gradient(135deg, #1a4a1a 0%, #0d3d0d 100%)`
- Myth cards: `linear-gradient(145deg, #0d0d0d 0%, #1c1c1c 100%)`, hover to `#121212` / `#242424`
- Recruitment step image panels: five light 135deg gradients, each paired with its step image.
- Ambient glows: low-opacity orange radial gradients, usually `rgba(255,90,0,0.03-0.04)`.

## Typography

Fonts are loaded in `app/layout.tsx` via `next/font/google`:

- `Oswald`, weights `400/500/600/700`, subsets `latin` and `cyrillic`, variable `--font-oswald`
- `Roboto_Mono`, weights `300/400/500/600`, subsets `latin` and `cyrillic`, variable `--font-roboto-mono`

Global rules:

- `html` uses `Roboto Mono` as the base font.
- `h1-h6` use `Oswald`, uppercase, `font-weight: 700`, `line-height: 1.05`, `letter-spacing: -0.01em`, `color: #ececec`.
- Paragraph/list inline text uses `Roboto Mono`, `line-height: 1.7`, `color: #8a8a8a`.
- Many section headings repeat the same inline pattern: Oswald, uppercase, `clamp(2.25rem, 5vw, 4.5rem)`, `line-height: 1`, `letter-spacing: -0.02em`, with orange emphasis on one word.
- There is no global `.section-heading` class in the current code. Heading styling is implemented inline per section.

Mobile typography:

- `html` font size becomes `18px` below `767px`.
- `html` font size becomes `19px` below `480px`.
- Hero title receives an additional small-screen clamp override.

## Radius And Shape

Global button baseline:

- `button { @apply rounded-lg; }`
- Tailwind/shadcn radius token: `--radius: 0.625rem`.

Actual component radii:

- Main CTA and mobile menu CTA: `10px`
- Header CTA, filters, form inputs, select, radios, submit button, vacancy CTA, marquee image cards: `8px`
- Smart War cards: `12px`
- Myth cards: `16px`
- Recruiting form card: `24px`
- About media cards: Tailwind `rounded-2xl`
- Mobile animated-list apply button: `1px`
- Dots, radio indicators and badges use circular radius.

## Layout And Grid

The page is a single App Router route at `app/page.tsx`. The outer `<main>` uses `bg-[#080808]` and `overflow-x-clip`.

Shared section rhythm:

- Most dark sections use `padding: clamp(80px, 10vw, 160px) clamp(20px, 5vw, 80px)`.
- Content containers generally cap at `maxWidth: 1280px`.
- Recruiting form is capped at `640px`.

Section grids:

- About: `.about-grid`, `55fr 45fr` desktop, one column below `768px`, tighter two-column tablet layout.
- Recruitment path: white section; desktop `lg:grid-cols-2` with sticky image panel and scrolling steps; mobile/tablet vertical timeline.
- Vacancies: desktop grid uses `repeat(auto-fill, 270px)`, fixed card size `270px x 345.17px`, `20px` gap; mobile/tablet uses nested accordion `AnimatedList`.
- Smart War: 1 column mobile, 2 columns from `768px`, 4 columns from `1024px`.
- Myths and Reality: `grid-cols-1 md:grid-cols-2`.
- FAQ: `.faq-grid`, left heading column and right accordion, collapses to one column below `900px`.
- Footer: responsive top row and bottom row with wrapping.

## Global Effects

- Fixed grain overlay on `body::before` with SVG fractal noise and `grain` keyframes.
- Custom 3px webkit scrollbar with orange thumb.
- Selection color: `rgba(255,90,0,0.25)`.
- Utility classes include `.glow-accent`, `.text-glow`, `.glass-card`, `.hover-accent-border`, `.reveal-up`, `.shimmer-text`, `.tactical-tag`.
- Performance hints use `will-change` and `translateZ(0)` for animated cards and media blocks.
