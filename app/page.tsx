/**
 * 93 ОПТБ — Main Page
 * Stage 3: Cinematic Hero Section active
 * See docs/todo.md for full roadmap
 */
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <main className="relative">
      <Hero />

      {/* ── Placeholder spacer so scroll animations have room to breathe ── */}
      <section
        id="next-section-placeholder"
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#080808' }}
      >
        <div className="text-center space-y-4 px-6">
          <div className="inline-flex items-center gap-2 tactical-tag">
            <span className="w-1.5 h-1.5 bg-[#ff5a00] rounded-full animate-pulse" />
            НАСТУПНА СЕКЦІЯ — IN PROGRESS
          </div>
          <p
            className="text-xs tracking-[0.25em] text-[#4a4a4a] uppercase"
            style={{ fontFamily: 'var(--font-roboto-mono)' }}
          >
            Vacancies · About · Equipment · Form
          </p>
        </div>
      </section>
    </main>
  )
}
