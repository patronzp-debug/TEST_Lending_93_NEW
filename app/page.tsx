/**
 * 93 ОПТБ — Головна сторінка
 * Primary Language: Ukrainian (spec_theme.md)
 *
 * Розділи:
 *  ✓ Hero            — кінематографічне відео, глітч-заголовок, GSAP scroll
 *  ✓ About           — двоколонка, stagger word-reveal, GSAP parallax галерея
 *  ✓ Vacancies       — асиметричний Bento Grid, HUD-hover, Framer Motion
 *  ✓ Equipment       — 3D GSAP card entrance, HUD targeting hover, масонрі-сітка
 *  ✓ FAQ             — акордеон-секція з частими запитаннями (над формою)
 *  ✓ RecruitingForm  — zod + react-hook-form, localStorage, shimmer CTA, success state
 *  ✓ Footer          — мінімалістичний footer з навігацією та копірайтом
 */
import Hero from '@/components/Hero'
import About from '@/components/About'
import Vacancies from '@/components/Vacancies'
import Equipment from '@/components/Equipment'
import FAQ from '@/components/FAQ'
import RecruitingForm from '@/components/RecruitingForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <main className="relative bg-[#080808] overflow-x-clip">
        <Hero />
        <About />
        <Vacancies />
        <Equipment />
        <FAQ />
        <RecruitingForm />
      </main>
      <Footer />
    </>
  )
}


