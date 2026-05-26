/**
 * 93 ОПТБ — Головна сторінка
 * Primary Language: Ukrainian (spec_theme.md)
 *
 * Розділи:
 *  ✓ Hero            — кінематографічне відео, глітч-заголовок, GSAP scroll
 *  ✓ About           — двоколонка, stagger word-reveal, GSAP parallax галерея
 *  ✓ Vacancies       — асиметричний Bento Grid, HUD-hover, Framer Motion
 *  ✓ Equipment       — 3D GSAP card entrance, HUD targeting hover, масонрі-сітка
 *  ✓ RecruitingForm  — zod + react-hook-form, localStorage, shimmer CTA, success state
 */
import Hero from '@/components/Hero'
import About from '@/components/About'
import Vacancies from '@/components/Vacancies'
import Equipment from '@/components/Equipment'
import RecruitingForm from '@/components/RecruitingForm'

export default function Home() {
  return (
    <main className="relative bg-[#080808]">
      <Hero />
      <About />
      <Vacancies />
      <Equipment />
      <RecruitingForm />
    </main>
  )
}


