import { motion } from 'framer-motion'

/**
 * PageTransition — wraps route-level content with a subtle fade/slide so
 * navigating between pages feels intentional instead of an abrupt swap.
 * Keyed by the consumer (usually `location.pathname`) via React's `key` prop.
 */
export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
