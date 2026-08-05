import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  dark:      'btn-dark',
}

const SIZES = {
  sm: 'text-xs !px-4 !py-2',
  md: '',
  lg: 'text-base !px-8 !py-3.5',
}

/**
 * Button — shared CTA primitive. Wraps the existing .btn-* utility classes
 * (kept for backward compatibility with pages still using raw classNames)
 * with consistent tap/hover motion and a loading state.
 */
const Button = forwardRef(function Button(
  { as: Comp = motion.button, variant = 'primary', size = 'md', loading = false, disabled, className = '', children, ...props },
  ref
) {
  return (
    <Comp
      ref={ref}
      whileTap={{ scale: 0.96 }}
      disabled={disabled || loading}
      className={`${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? ''} ${disabled || loading ? 'opacity-60 pointer-events-none' : ''} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </Comp>
  )
})

export default Button
