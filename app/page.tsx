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

