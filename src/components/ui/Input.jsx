import { forwardRef, useState } from 'react'

/**
 * Input — labeled text field with icon slot, error state, and focus glow.
 * Purely presentational; consumers keep owning value/onChange/validation.
 */
const Input = forwardRef(function Input(
  { label, icon: Icon, error, className = '', containerClassName = '', type = 'text', rightSlot, ...props },
  ref
) {
  const [focused, setFocused] = useState(false)

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      )}
      <div
        className={`relative flex items-center rounded-xl border bg-white transition-all duration-200
          ${error ? 'border-red-300' : focused ? 'border-primary-400 ring-4 ring-primary-500/10' : 'border-slate-200'}`}
      >
        {Icon && (
          <span className="pl-3.5 text-slate-400">
            <Icon size={17} />
          </span>
        )}
        <input
          ref={ref}
          type={type}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
          className={`w-full bg-transparent px-3.5 py-3 text-slate-900 placeholder-slate-400 outline-none ${Icon ? 'pl-2.5' : ''} ${className}`}
          {...props}
        />
        {rightSlot && <div className="pr-3">{rightSlot}</div>}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
})

export default Input
