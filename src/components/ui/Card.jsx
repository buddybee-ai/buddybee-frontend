import { motion } from 'framer-motion'

/**
 * Card — standard elevated surface with optional entrance animation and
 * hover-lift. Used across dashboards, marketing sections, and forms so
 * every "box" in the product shares the same radius/shadow/spacing language.
 */
export default function Card({
  children,
  className = '',
  hover = false,
  delay = 0,
  padding = 'p-6',
  as: Comp = motion.div,
  ...props
}) {
  return (
    <Comp
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? { y: -4 } : undefined}
      className={`bg-white rounded-2xl ${padding} border border-slate-100 shadow-card transition-shadow duration-300 ${hover ? 'hover:shadow-card-hover hover:border-primary-100' : ''} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  )
}
