import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const ToastContext = createContext(null)
export const useToast = () => useContext(ToastContext)

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const STYLES = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800 [&_svg]:text-emerald-500',
  error:   'border-red-200 bg-red-50 text-red-800 [&_svg]:text-red-500',
  info:    'border-primary-200 bg-primary-50 text-primary-800 [&_svg]:text-primary-500',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 [&_svg]:text-amber-500',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const push = useCallback((message, opts = {}) => {
    const id = ++idRef.current
    const type = opts.type || 'info'
    const duration = opts.duration ?? 4000
    setToasts((t) => [...t, { id, message, type, title: opts.title }])
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration)
    }
    return id
  }, [dismiss])

  const toast = {
    show: push,
    success: (message, opts) => push(message, { ...opts, type: 'success' }),
    error:   (message, opts) => push(message, { ...opts, type: 'error' }),
    info:    (message, opts) => push(message, { ...opts, type: 'info' }),
    warning: (message, opts) => push(message, { ...opts, type: 'warning' }),
    dismiss,
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] ?? Info
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`pointer-events-auto flex items-start gap-3 border rounded-2xl shadow-glow px-4 py-3 backdrop-blur-md ${STYLES[t.type] ?? STYLES.info}`}
              >
                <Icon size={18} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {t.title && <p className="text-sm font-semibold leading-tight">{t.title}</p>}
                  <p className="text-sm leading-snug">{t.message}</p>
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <X size={15} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
