/**
 * MarqueeTicker — безшовна бігуча стрічка (перевикористовуваний компонент)
 * Фон: #ff5a00 | Текст: #1a1a1a | Шрифт: Oswald, Bold, Uppercase
 *
 * @prop text — рядок, що прокручується. Дублюйте його кілька разів для
 *              заповнення ширини екрана; компонент автоматично додає другу
 *              копію для безшовного циклу.
 */

interface MarqueeTickerProps {
  text: string
}

export default function MarqueeTicker({ text }: MarqueeTickerProps) {
  return (
    <div
      aria-hidden="true"
      className="marquee-ticker overflow-hidden w-full"
      style={{ backgroundColor: '#ff5a00', padding: '14px 0' }}
    >
      {/* Два однакові рядки — для безшовного циклу (translateX -50%) */}
      <div className="marquee-track flex whitespace-nowrap will-change-transform">
        <span className="marquee-item">{text}</span>
        <span className="marquee-item" aria-hidden="true">{text}</span>
      </div>
    </div>
  )
}
