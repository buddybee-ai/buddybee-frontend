import React, { createContext, useContext, useState, useEffect } from 'react'

export const LANGUAGES = [
  { code: 'en',    label: 'English',     native: 'English',   flag: '🇬🇧', dir: 'ltr' },
  { code: 'ur',    label: 'Urdu',        native: 'اردو',       flag: '🇵🇰', dir: 'rtl' },
  { code: 'roman', label: 'Roman Urdu',  native: 'Roman Urdu', flag: '🌙', dir: 'ltr' },
]

export const LANG_KEY = 'buddybee_lang'

const LanguageContext = createContext()
export const useLang = () => useContext(LanguageContext)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem(LANG_KEY) || 'en')

  const setLang = (code) => {
    localStorage.setItem(LANG_KEY, code)
    setLangState(code)
    // Set dir on document for Urdu RTL
    document.documentElement.setAttribute('dir', code === 'ur' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', code === 'ur' ? 'ur' : 'en')
  }

  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', lang === 'ur' ? 'ur' : 'en')
  }, [])

  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  return (
    <LanguageContext.Provider value={{ lang, setLang, current, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext
