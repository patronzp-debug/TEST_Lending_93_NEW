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

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '93 батальйон ЗСУ',
    alternateName: [
      '93 ОПТБ',
      '93 батальйон',
      '93 окремий протитанковий батальйон',
    ],
    url: 'https://93optb.com.ua/',
    inLanguage: 'uk-UA',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '93 батальйон ЗСУ',
    alternateName: [
      '93 ОПТБ',
      '93 окремий протитанковий батальйон',
      '93 окремий протитанковий батальйон ЗСУ',
    ],
    url: 'https://93optb.com.ua/',
    logo: 'https://93optb.com.ua/logos/93_optb/Logo_section_hero.webp',
    description:
      'Офіційний рекрутинговий портал 93 батальйону ЗСУ, 93 окремого протитанкового батальйону.',
    email: 'army93optb@gmail.com',
    telephone: '+380971068514',
    sameAs: ['https://t.me/rekruting_93optb'],
  },
]

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
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
