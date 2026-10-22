export type StorefrontIconName = 'search' | 'user' | 'heart' | 'bag' | 'arrow' | 'close' | 'minus' | 'plus' | 'menu'

export function StorefrontIcon({
  name,
  size = 20,
  filled = false,
}: {
  name: StorefrontIconName
  size?: number
  filled?: boolean
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  if (name === 'search') return <svg {...common}><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4.2 4.2" /></svg>
  if (name === 'user') return <svg {...common}><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20c.4-3.5 2.6-5.5 6.5-5.5s6.1 2 6.5 5.5" /></svg>
  if (name === 'heart') return <svg {...common} fill={filled ? 'currentColor' : 'none'}><path d="M20.4 8.7c0 4.1-8.4 10-8.4 10s-8.4-5.9-8.4-10a4.4 4.4 0 0 1 8.4-1.8 4.4 4.4 0 0 1 8.4 1.8Z" /></svg>
  if (name === 'bag') return <svg {...common}><path d="M5 8.5h14l1 12H4l1-12Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>
  if (name === 'arrow') return <svg {...common}><path d="M4.5 12h14m-5.5-5.5 5.5 5.5-5.5 5.5" /></svg>
  if (name === 'close') return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>
  if (name === 'minus') return <svg {...common}><path d="M5 12h14" /></svg>
  if (name === 'plus') return <svg {...common}><path d="M12 5v14m-7-7h14" /></svg>
  return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
}
