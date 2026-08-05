import { useMemo } from 'react'
import { motion } from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH FOR THE SITE'S GLOBAL BACKGROUND ARTWORK.
// To swap in the real Midjourney piece, replace this one file:
//   src/assets/backgrounds/site-background.jpg
// (keep the same filename, or update this import path — nothing else
// in the app needs to change).
// ─────────────────────────────────────────────────────────────────────────
import siteBackground from '../../assets/backgrounds/site-background.jpg'

const PARTICLES = [
  { top: '12%', left: '18%', size: 4, delay: 0,   duration: 11 },
  { top: '30%', left: '76%', size: 3, delay: 1.6, duration: 13 },
  { top: '58%', left: '12%', size: 3, delay: 3,   duration: 12 },
  { top: '80%', left: '62%', size: 4, delay: 1.2, duration: 14 },
]

/**
 * GlobalBackground — the single persistent background layer for the
 * entire application. Mounted once, at the root (see main.jsx), as a
 * sibling of <App/> — so it never remounts on navigation and reads as
 * one continuous surface the whole product floats above.
 *
 * PERFORMANCE — this is a full-viewport `fixed` layer that runs for the
 * whole session on every page, so it's kept deliberately cheap:
 *  - Every animation here only ever touches `transform`/`opacity`, which
 *    the browser can composite on the GPU without re-painting or
 *    re-laying-out. Nothing animates `border-radius`, `width`, `height`,
 *    or box-shadow spread — those force layout/paint on every frame and
 *    were the main source of the stutter.
 *  - No cursor-tracking listener — a page-wide `mousemove` handler was
 *    firing continuously for the entire session on every page; removed.
 *  - Respects `prefers-reduced-motion`: motion collapses to a static
 *    frame for anyone who's asked their OS for less animation.
 *  - Fewer, smaller blurred elements than the previous version.
 *
 * Layers (back to front): artwork → legibility scrim → two ambient glow
 * blobs → a few drifting particles → a faint static texture.
 */
export default function GlobalBackground() {
  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  )

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-ink-900" aria-hidden="true">
      {/* 1. Artwork — slow ambient drift/zoom (transform-only) */}
      <motion.img
        src={siteBackground}
        alt=""
        animate={reduceMotion ? undefined : { scale: [1, 1.04, 1], x: [0, 10, -6, 0], y: [0, -8, 5, 0] }}
        transition={{ duration: 55, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -inset-[2%] w-[104%] h-[104%] object-cover"
        style={{ willChange: 'transform' }}
      />

      {/* 2. Legibility scrim — lets hue/mood through, keeps content readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/80 to-white/88" />
      <div className="absolute inset-0 bg-white/15" />

      {/* 3. Ambient glow blobs — transform/opacity only, no shape morphing */}
      <motion.div
        animate={reduceMotion ? undefined : { x: [0, 40, -16, 0], y: [0, -24, 16, 0] }}
        transition={{ duration: 48, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-primary-400/20 blur-[100px]"
        style={{ willChange: 'transform' }}
      />
      <motion.div
        animate={reduceMotion ? undefined : { x: [0, -32, 24, 0], y: [0, 32, -16, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-8rem] right-[-8rem] w-[30rem] h-[30rem] rounded-full bg-amber-300/25 blur-[100px]"
        style={{ willChange: 'transform' }}
      />

      {/* 4. A few drifting light particles */}
      {!reduceMotion && PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-amber-200"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size, boxShadow: '0 0 8px 2px rgba(251,191,36,0.4)', willChange: 'transform, opacity' }}
          animate={{ y: [0, -22, 0], opacity: [0.15, 0.55, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* 5. Faint static texture — not animated, painted once */}
      <div className="absolute inset-0 hex-pattern opacity-[0.02]" />
    </div>
  )
}
