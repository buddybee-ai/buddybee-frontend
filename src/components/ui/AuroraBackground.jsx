/**
 * AuroraBackground — soft floating gradient blobs used behind hero / CTA sections.
 * Purely decorative, pointer-events disabled, respects prefers-reduced-motion via CSS.
 */
export default function AuroraBackground({ variant = 'light', className = '' }) {
  const palettes = {
    light: [
      'bg-primary-300/40',
      'bg-blue-300/30',
      'bg-primary-200/40',
    ],
    dark: [
      'bg-primary-500/25',
      'bg-blue-500/15',
      'bg-primary-400/20',
    ],
  }
  const c = palettes[variant] ?? palettes.light

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`} aria-hidden="true">
      <div className={`aurora-blob w-[32rem] h-[32rem] ${c[0]} -top-40 -left-20 animate-aurora`} />
      <div className={`aurora-blob w-[28rem] h-[28rem] ${c[1]} top-1/3 -right-24 animate-aurora-slow`} />
      <div className={`aurora-blob w-[24rem] h-[24rem] ${c[2]} bottom-0 left-1/3 animate-aurora`} style={{ animationDelay: '3s' }} />
    </div>
  )
}
