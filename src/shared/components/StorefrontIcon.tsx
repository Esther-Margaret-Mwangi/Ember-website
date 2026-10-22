export type StorefrontIconName = 'search' | 'user' | 'heart' | 'bag' | 'arrow' | 'close' | 'minus' | 'plus' | 'menu' | 'eye' | 'eyeOff'

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
  if (name === 'eye') return <svg {...common}><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.6" /></svg>
  if (name === 'eyeOff') return <svg {...common}><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.3A10.9 10.9 0 0 1 12 5c6.1 0 9.5 7 9.5 7a15.7 15.7 0 0 1-3.1 3.8M6.2 6.2C3.8 7.8 2.5 12 2.5 12s3.4 7 9.5 7a10.7 10.7 0 0 0 3-.4" /></svg>
  if (name === 'minus') return <svg {...common}><path d="M5 12h14" /></svg>
  if (name === 'plus') return <svg {...common}><path d="M12 5v14m-7-7h14" /></svg>
  return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
}
