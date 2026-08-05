import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

/**
 * AnimatedCounter — counts up from 0 to `value` once it scrolls into view.
 * Used for the landing-page stats strip. Pure framer-motion, no extra deps.
 */
export default function AnimatedCounter({ value, prefix = '', suffix = '', decimals = 0, duration = 1.6 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (inView) motionVal.set(value)
  }, [inView, value, motionVal])

  useEffect(() => {
    const unsub = spring.on('change', (v) => {
      setDisplay(decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString())
    })
    return unsub
  }, [spring, decimals])

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  )
}
