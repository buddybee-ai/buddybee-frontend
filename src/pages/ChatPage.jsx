import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, AlertTriangle, Info, X, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import { getGreeting, getWelcomeMessage, getThinkingLabel } from '../utils/greetings'
import { getSuggestedStarters, getFriendlyError } from '../utils/chatUx'
import MarkdownMessage from '../components/MarkdownMessage'

// ── Risk banner config ────────────────────────────────────────────────────────
const RISK_BANNERS = {
  high: {
    bg: 'bg-rose-50 border-rose-200',
    icon: <AlertTriangle size={14} className="text-rose-500" />,
    text: "It sounds like you may be going through something really tough. Please talk to a trusted adult or school counsellor — you don't have to face this alone. 💙",
  },
  medium: {
    bg: 'bg-amber-50 border-amber-200',
    icon: <Info size={14} className="text-amber-500" />,
    text: "BuddyBee noticed you might be under some stress. Remember — it's okay to ask for help. Your counsellor is always available.",
  },
}

export default function ChatPage() {
  const { user } = useAuth()

  const [messages,      setMessages]      = useState([])
  const [input,         setInput]         = useState('')
  const [typing,        setTyping]        = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [latestRisk,    setLatestRisk]    = useState(null)   // 'high' | 'medium' | null
  const [typingLabel,   setTypingLabel]   = useState('')
  const [starters]      = useState(() => getSuggestedStarters(4))

  const ref       = useRef(null)
  const inputRef  = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // ── Load chat history on mount ──────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return

    api.get(`/chat-history/${user.id}`)
      .then(res => {
        const chats = res.data?.chats
        if (!chats || chats.length === 0) {
          // Brand-new student — rotate a warm, natural first-time welcome.
          setMessages([{
            id:   'welcome',
            from: 'bot',
            text: getWelcomeMessage(user?.name),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }])
        } else {
          const formatted = chats.flatMap((chat, i) => ([
            { id: `h-user-${i}`, from: 'user', text: chat[0], time: '' },
            { id: `h-bot-${i}`,  from: 'bot',  text: chat[1], time: '' },
          ]))
          // Returning student — a small time-of-day-aware greeting on top,
          // rotated per session. Client-side only, no extra request.
          formatted.push({
            id:   'greeting',
            from: 'bot',
            text: getGreeting(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })
          setMessages(formatted)
        }
      })
      .catch(() => {
        setMessages([{
          id:   'welcome',
          from: 'bot',
          text: getWelcomeMessage(user?.name),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
      })
      .finally(() => setHistoryLoaded(true))
  }, [user])

  // ── Send a message ──────────────────────────────────────────────────────────
  const send = async (text) => {
    if (!text.trim() || typing || !user) return

    const userMessage = {
      id:   Date.now(),
      from: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setTyping(true)
    setTypingLabel(getThinkingLabel())
    setLatestRisk(null)

    try {
      const res = await api.post('/chat', {
        student_id: String(user.id),
        message:    text.trim()
      })

      const risk = res.data.risk
      setMessages(prev => [...prev, {
        id:       Date.now() + 1,
        from:     'bot',
        text:     res.data.reply,
        time:     new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        risk,
        sources:  res.data.sources || [],
        degraded: res.data.degraded || false,
      }])

      // Show risk banner for medium/high
      if (risk === 'high' || risk === 'medium') {
        setLatestRisk(risk)
      }
    } catch {
      setMessages(prev => [...prev, {
        id:   Date.now() + 1,
        from: 'bot',
        text: getFriendlyError(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    } finally {
      setTyping(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const isFirstMessage = messages.length <= 1 && messages[0]?.id === 'welcome'

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce-soft">🐝</div>
          <p className="text-slate-500 text-sm">Loading Chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="font-chat flex flex-col h-[calc(100vh-6rem)] bg-white/85 backdrop-blur-md rounded-2xl overflow-hidden border border-white/60 shadow-card">

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white/90 backdrop-blur-md flex items-center gap-3 flex-shrink-0">
        <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-lg shadow-primary">
          🐝
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
        <div className="flex-1">
          <div className="font-display font-bold text-slate-900">BuddyBee Chat</div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse-soft" />
            Online — Supporting students 24/7
          </div>
        </div>
        {/* Memory awareness badge */}
        <AnimatePresence>
          {messages.length > 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="text-xs text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100 flex items-center gap-1"
            >
              <Sparkles size={11} /> BuddyBee remembers your conversation
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Risk Banner */}
      <AnimatePresence>
        {latestRisk && RISK_BANNERS[latestRisk] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="overflow-hidden flex-shrink-0"
          >
            <div className={`mx-4 mt-3 px-4 py-3 rounded-xl border text-xs flex gap-2 items-start ${RISK_BANNERS[latestRisk].bg}`}>
              {RISK_BANNERS[latestRisk].icon}
              <span className="text-slate-700 leading-relaxed">{RISK_BANNERS[latestRisk].text}</span>
              <button onClick={() => setLatestRisk(null)} aria-label="Dismiss notice" className="ml-auto text-slate-400 hover:text-slate-600 flex-shrink-0">
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Chat conversation with BuddyBee"
      >

        {!historyLoaded && (
          <div className="text-center text-sm text-slate-400 py-8">
            Loading your conversation...
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-end gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              {msg.from === 'bot' ? (
                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-sm flex-shrink-0 mb-1">
                  🐝
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1">
                  {(user?.name || 'U')[0].toUpperCase()}
                </div>
              )}

              {/* Bubble */}
              <div className={`flex flex-col gap-1 max-w-sm sm:max-w-md ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                  ${msg.from === 'user'
                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-md shadow-primary'
                    : 'bg-white text-slate-700 border border-slate-100 shadow-soft rounded-bl-md'
                  }
                  ${msg.risk === 'high'   ? 'border-l-4 border-rose-400'  : ''}
                  ${msg.risk === 'medium' ? 'border-l-4 border-amber-400' : ''}
                `}>
                  <MarkdownMessage text={msg.text} isUser={msg.from === 'user'} />
                </div>
                {msg.time && (
                  <div className="text-xs text-slate-400 px-1">{msg.time}</div>
                )}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-1 px-1 mt-0.5">
                    {msg.sources.map((s,i) => (
                      <span key={i} className="text-xs bg-primary-50 text-primary-600 border border-primary-100 rounded-full px-2 py-0.5">
                        📚 {s.source}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-end gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-sm flex-shrink-0">
                🐝
              </div>
              <div className="bg-white border border-slate-100 shadow-soft rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1.5 items-center">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                  {typingLabel && (
                    <span className="text-xs text-slate-400">{typingLabel}</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={ref} />
      </div>

      {/* Suggested prompts — only show on fresh chat */}
      <AnimatePresence>
        {isFirstMessage && historyLoaded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-2 overflow-hidden flex-shrink-0"
          >
            <p className="text-xs text-slate-400 mb-2 text-center">Suggested topics</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {starters.map((prompt, i) => (
                <motion.button
                  key={prompt}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -2 }}
                  onClick={() => { setInput(prompt); inputRef.current?.focus() }}
                  aria-label={`Send suggested message: ${prompt}`}
                  className="text-xs bg-white border border-slate-200 rounded-full px-3 py-1.5
                    hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700
                    focus-visible:ring-2 focus-visible:ring-primary-400
                    text-slate-600 transition-all shadow-soft"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask BuddyBee anything... (Enter to send)"
            aria-label="Message BuddyBee"
            rows={1}
            className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm resize-none bg-slate-50
              focus:outline-none focus-visible:ring-4 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 focus:bg-white
              transition-all duration-200 max-h-32 leading-relaxed"
            style={{ minHeight: '46px' }}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => send(input)}
            disabled={!input.trim() || typing}
            aria-label="Send message"
            className="w-11 h-11 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-2xl flex items-center justify-center
              hover:shadow-glow-lg hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none disabled:translate-y-0
              focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2
              transition-all duration-200 flex-shrink-0 shadow-primary"
          >
            <Send size={16} />
          </motion.button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          BuddyBee AI may make mistakes. For emergencies, contact a school counselor directly.
        </p>
      </div>

    </div>
  )
}
