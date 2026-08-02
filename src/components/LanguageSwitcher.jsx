import { useLang, LANGUAGES } from '../context/LanguageContext'

/**
 * LanguageSwitcher — compact pill switcher for dashboard headers
 * size: 'sm' | 'md' (default 'sm')
 */
export default function LanguageSwitcher({ size = 'sm' }) {
  const { lang, setLang } = useLang()

  return (
    <div
      style={{
        display: 'flex',
        gap: '4px',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '12px',
        padding: '3px',
      }}
      title="Switch Language / زبان تبدیل کریں"
    >
      {LANGUAGES.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          title={l.label}
          style={{
            padding: size === 'sm' ? '4px 8px' : '6px 12px',
            borderRadius: '9px',
            border: 'none',
            cursor: 'pointer',
            fontSize: size === 'sm' ? '11px' : '12px',
            fontWeight: 700,
            fontFamily: l.code === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit',
            background: lang === l.code ? 'rgba(255,255,255,0.9)' : 'transparent',
            color: lang === l.code ? '#92400e' : 'rgba(255,255,255,0.85)',
            transition: 'all 0.15s',
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
          }}
        >
          {l.flag} {size === 'md' ? l.native : l.code === 'roman' ? 'RM' : l.native}
        </button>
      ))}
    </div>
  )
}
