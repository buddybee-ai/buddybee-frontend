import { useState, useRef, useEffect } from 'react'
import { Send, AlertTriangle, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import { getGreeting, getWelcomeMessage, getThinkingLabel } from '../utils/greetings'
import { getSuggestedStarters, getFriendlyError } from '../utils/chatUx'

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
        id:      Date.now() + 1,
        from:    'bot',
        text:    res.data.reply,
        time:    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        risk,
        sources: res.data.sources || [],
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
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-4xl mb-3">🐝</div>
          <p className="text-gray-500 text-sm">Loading Chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">

      {/* Header */}
      <div className="px-6 py-4 border-b bg-white flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-xl">
          🐝
        </div>
        <div className="flex-1">
          <div className="font-bold text-slate-900">BuddyBee Chat</div>
          <div className="text-xs text-gray-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Online — Supporting students 24/7
          </div>
        </div>
        {/* Memory awareness badge */}
        {messages.length > 3 && (
          <div className="text-xs text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
            🧠 BuddyBee remembers your conversation
          </div>
        )}
      </div>

      {/* Risk Banner */}
      {latestRisk && RISK_BANNERS[latestRisk] && (
        <div role="alert" className={`mx-4 mt-3 px-4 py-3 rounded-xl border text-xs flex gap-2 items-start ${RISK_BANNERS[latestRisk].bg}`}>
          {RISK_BANNERS[latestRisk].icon}
          <span className="text-slate-700 leading-relaxed">{RISK_BANNERS[latestRisk].text}</span>
          <button onClick={() => setLatestRisk(null)} aria-label="Dismiss notice" className="ml-auto text-slate-400 hover:text-slate-600 text-sm leading-none">×</button>
        </div>
      )}

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

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            {msg.from === 'bot' ? (
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-sm flex-shrink-0 mb-1">
                🐝
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1">
                {(user?.name || 'U')[0].toUpperCase()}
              </div>
            )}

            {/* Bubble */}
            <div className={`flex flex-col gap-1 max-w-sm ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${msg.from === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-none'
                }
                ${msg.risk === 'high'   ? 'border-l-4 border-rose-400'  : ''}
                ${msg.risk === 'medium' ? 'border-l-4 border-amber-400' : ''}
              `}>
                {msg.text}
              </div>
              {msg.time && (
                <div className="text-xs text-slate-400 px-1">{msg.time}</div>
              )}
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap gap-1 px-1 mt-0.5">
                  {msg.sources.map((s,i) => (
                    <span key={i} className="text-xs bg-indigo-50 text-indigo-500 border border-indigo-100 rounded-full px-2 py-0.5">
                      📚 {s.source}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-sm flex-shrink-0">
              🐝
            </div>
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex gap-2 items-center">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                {typingLabel && (
                  <span className="text-xs text-slate-400">{typingLabel}</span>
                )}
              </div>
            </div>
          </div>
        )}

        <div ref={ref} />
      </div>

      {/* Suggested prompts — only show on fresh chat */}
      {isFirstMessage && historyLoaded && (
        <div className="px-4 pb-2">
          <p className="text-xs text-slate-400 mb-2 text-center">Suggested topics</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {starters.map((prompt) => (
              <button
                key={prompt}
                onClick={() => { setInput(prompt); inputRef.current?.focus() }}
                aria-label={`Send suggested message: ${prompt}`}
                className="text-xs bg-white border border-slate-200 rounded-full px-3 py-1.5
                  hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700
                  focus-visible:ring-2 focus-visible:ring-indigo-400
                  text-slate-600 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask BuddyBee anything... (Enter to send)"
            aria-label="Message BuddyBee"
            rows={1}
            className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm resize-none
              focus:outline-none focus-visible:ring-2 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300
              transition-all max-h-32 leading-relaxed"
            style={{ minHeight: '46px' }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || typing}
            aria-label="Send message"
            className="w-11 h-11 bg-indigo-600 text-white rounded-2xl flex items-center justify-center
              hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed
              focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2
              transition-all flex-shrink-0 shadow-sm"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          BuddyBee AI may make mistakes. For emergencies, contact a school counselor directly.
        </p>
      </div>

    </div>
  )
}


