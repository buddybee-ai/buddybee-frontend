export default function BeeMascot({ size = 'md', className = '', animate = true }) {
  const sizes = { xs: 'text-2xl', sm: 'text-4xl', md: 'text-6xl', lg: 'text-8xl', xl: 'text-9xl' }
  return (
    <span
      className={`inline-block select-none ${sizes[size] ?? sizes.md} ${animate ? 'animate-float' : ''} ${className}`}
      role="img" aria-label="BuddyBee mascot"
    >🐝</span>
  )
}
