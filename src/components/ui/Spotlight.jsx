import { useRef } from 'react'

/**
 * Spotlight — wraps children in a container that reveals a soft radial
 * glow following the cursor.
 *
 * PERFORMANCE NOTE: this used to track the cursor with useState, which
 * re-rendered the whole component (and React tree below it) on every
 * single mousemove event — with several Spotlight cards on one page,
 * that was the main cause of the stutter/jank. It now writes directly
 * to a CSS custom property on the DOM node via a ref, completely
 * bypassing React's render cycle. The glow itself is a plain CSS
 * radial-gradient reading that variable, so the browser only ever
 * repaints the small glow layer, not the component tree.
 */
export default function Spotlight({ children, className = '', color = 'rgba(92,92,232,0.14)' }) {
  const glowRef = useRef(null)

  const handleMove = (e) => {
    const el = glowRef.current
    if (!el) return
    const rect = el.parentElement.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.background = `radial-gradient(320px circle at ${x}% ${y}%, ${color}, transparent 70%)`
  }

  return (
    <div
      onMouseMove={handleMove}
      onMouseEnter={() => { if (glowRef.current) glowRef.current.style.opacity = '1' }}
      onMouseLeave={() => { if (glowRef.current) glowRef.current.style.opacity = '0' }}
      className={`relative isolate overflow-hidden ${className}`}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-500"
        style={{ willChange: 'opacity' }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}
