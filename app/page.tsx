/**
 * 93 ОПТБ — Головна сторінка
 * Primary Language: Ukrainian (spec_theme.md)
 *
 * Розділи:
 *  ✓ Hero              — кінематографічне відео, глітч-заголовок, GSAP scroll
 *  ✓ About             — двоколонка, stagger word-reveal, GSAP parallax галерея
 *  ✓ RecruitmentPath   — «Шлях рекрутингу», білий брейк, sticky (desktop) / timeline (mobile)
 *  ✓ Vacancies         — асиметричний Bento Grid, HUD-hover, Framer Motion
 *  ✓ SmartWar          — мінімалістична сітка 4 карток, Framer Motion stagger reveal
 *  ✓ MythsAndReality   — 4 картки «Міф / Реальність», dark grid, hover orange border
 *  ✓ FAQ               — акордеон-секція з частими запитаннями (над формою)
 *  ✓ RecruitingForm    — zod + react-hook-form, localStorage, shimmer CTA, success state
 *  ✓ Footer            — мінімалістичний footer з навігацією та копірайтом
 */
import Hero from '@/components/Hero'
import MarqueeTicker from '@/components/MarqueeTicker'
import About from '@/components/About'
import RecruitmentPath from '@/components/RecruitmentPath'
import Vacancies from '@/components/Vacancies'
import SmartWar from '@/components/SmartWar'
import MythsAndReality from '@/components/MythsAndReality'
import FAQ from '@/components/FAQ'
import RecruitingForm from '@/components/RecruitingForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <main className="relative bg-[#080808] overflow-x-clip">
        <Hero />
        <MarqueeTicker text="ТВОЯ ЗБРОЯ ЧЕКАЄ ⋆ 93 ОПТБ ⋆ ЗАХИЩАЙ СВОЄ ⋆ 93 ОПТБ ⋆ ТВОЯ ЗБРОЯ ЧЕКАЄ ⋆ 93 ОПТБ ⋆ ЗАХИЩАЙ СВОЄ ⋆ 93 ОПТБ ⋆ " />
        <About />
        <RecruitmentPath />
        <MarqueeTicker text="ДОЛУЧАЙСЯ ДО 93 ОПТБ ✦ ОБИРАЙ СВОЮ СПЕЦІАЛЬНІСТЬ ✦ СТАВАЙ ДО ЛАВ НАЙКРАЩИХ ✦ ДОЛУЧАЙСЯ ДО 93 ОПТБ ✦ ОБИРАЙ СВОЮ СПЕЦІАЛЬНІСТЬ ✦ СТАВАЙ ДО ЛАВ НАЙКРАЩИХ ✦ " />
        <Vacancies />
        <SmartWar />
        <MythsAndReality />
        <FAQ />
        <RecruitingForm />
      </main>
      <Footer />
    </>
  )
}


