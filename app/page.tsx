/**
 * 93 ОПТБ — Головна сторінка
 * Primary Language: Ukrainian (spec_theme.md)
 *
 * Розділи:
 *  ✓ Hero        — кінематографічне відео, глітч-заголовок, GSAP scroll
 *  ✓ Vacancies   — асиметричний Bento Grid, HUD-hover, Framer Motion
 *  ○ About       — у розробці (Етап 3)
 *  ○ Equipment   — у розробці (Етап 3)
 *  ○ Form        — у розробці (Етап 4)
 */
import Hero from '@/components/Hero'
import Vacancies from '@/components/Vacancies'

export default function Home() {
  return (
    <main className="relative bg-[#080808]">
      <Hero />
      <Vacancies />
    </main>
  )
}
