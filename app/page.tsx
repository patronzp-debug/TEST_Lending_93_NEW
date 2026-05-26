/**
 * 93 ОПТБ — Main Page
 * Sections will be added in subsequent Stages (see docs/todo.md)
 * Current: Stage 1 & 2 setup complete — placeholder only
 */
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 px-6">
        {/* Tactical badge */}
        <div className="inline-flex items-center gap-2 tactical-tag mb-4">
          <span className="w-1.5 h-1.5 bg-[#ff5a00] rounded-full animate-pulse" />
          СИСТЕМА ГОТОВА
        </div>

        {/* Heading */}
        <h1
          className="text-6xl md:text-8xl font-bold tracking-wider text-glow"
          style={{ fontFamily: 'var(--font-oswald)' }}
        >
          93 ОПТБ
        </h1>

        {/* Sub */}
        <p
          className="text-sm tracking-[0.3em] text-[#8a8a8a] uppercase"
          style={{ fontFamily: 'var(--font-roboto-mono)' }}
        >
          Cinematic setup complete — Hero section coming next
        </p>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="w-2 h-2 rounded-full bg-[#ff5a00] animate-ping" />
          <span className="text-xs text-[#4a4a4a] tracking-widest uppercase font-mono">
            Stage 1 &amp; 2 ✓ &nbsp;|&nbsp; Ready for Hero Integration
          </span>
        </div>
      </div>
    </main>
  )
}
