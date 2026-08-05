import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, Upload, LayoutDashboard, HeartPulse, BookOpen, Zap } from 'lucide-react'
import SEO from '../components/SEO'

const INITIAL_MESSAGES = [
  {
    id: 1,
    from: 'bot',
    text: "Hello Alex! I noticed you have a big finals week coming up. How are you feeling about your study schedule for Advanced Psychology? Remember, taking breaks is as important as the study itself. 🐝",
    time: '10:24 AM',
  },
]

const SUGGESTED = [
  { id: 'a', text: "Yes, let's try it" },
  { id: 'b', text: "Just break it down for me" },
  { id: 'c', text: "I need motivation" },
]

const sideCategories = [
  { icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
  { icon: <HeartPulse size={16} />, label: 'Academic Stress' },
  { icon: <HeartPulse size={16} />, label: 'Mental Health' },
  { icon: <BookOpen size={16} />, label: 'Study Help' },
  { icon: <Zap size={16} />, label: 'Motivation' },
]

const BOT_REPLIES = [
  "It's completely normal to feel that way. Let's try the \"Box Breathing\" technique for 2 minutes to reset your focus, and then we can break those 3 chapters into smaller, manageable 20-minute sprints. Would you like to try the breathing exercise with me?",
  "I hear you! Breaking big tasks into small chunks is so effective. Start with chapter headings to get the big picture, then work through each section. Which chapter feels most overwhelming right now?",
  "You're doing great by reaching out! Remember, the fact that you're thinking about your studies means you care. Let's make a simple plan together — what time do you have available today?",
  "That's a really common feeling. Exam stress affects everyone. One technique that helps is the Pomodoro method: 25 minutes focused, 5 minute break. Want me to walk you through it? 🍅",
]

export default function Demo() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [started, setStarted] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = { id: Date.now(), from: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setStarted(true)
    setTyping(true)

    setTimeout(() => {
      setTyping(false)
      const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)]
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    }, 1800)
  }

  const handleSend = () => sendMessage(input)
  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }

  return (
    <div className="pt-16 h-screen flex bg-white/85 backdrop-blur-md">
      <SEO
        path="/demo"
        title="Try the Demo"
        description="Experience BuddyBee AI's empathetic student chat assistant firsthand with an interactive live demo."
      />
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-100 h-full">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm">🐝</div>
            <div>
              <div className="text-xs font-bold text-slate-900">BuddyBee Admin</div>
              <div className="text-xs text-slate-400">SYSTEM OVERVIEW</div>
            </div>
          </div>
        </div>

        <div className="p-3">
          <button
            onClick={() => { setMessages(INITIAL_MESSAGES); setStarted(false) }}
            className="w-full flex items-center gap-2 bg-primary-600 text-white rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <span className="text-base">+</span> New Chat
          </button>
        </div>

        <nav className="flex-1 px-2 py-2 space-y-0.5">
          {sideCategories.map(({ icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">AR</div>
            <div>
              <div className="text-xs font-semibold text-slate-900">Alex Rivera</div>
              <div className="text-xs text-slate-400">Academic Counselor</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-slate-900">BuddyBee AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-600 text-xs font-medium">Online</span>
          </div>
          <div className="flex gap-4 text-sm text-slate-600">
            {['Home', 'Features', 'Schools', 'About'].map(l => (
              <a key={l} href={`/${l.toLowerCase()}`} className="hidden md:block hover:text-primary-600 transition-colors">{l}</a>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            {/* Welcome header (before first user message) */}
            {!started && (
              <div className="text-center mb-10">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4 relative">
                  <span className="text-4xl">🐝</span>
                  <div className="absolute -top-1 -right-1 w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">✨</div>
                </div>
                <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">Hey Alex! Ready to thrive?</h2>
                <p className="text-slate-500">I'm here to support your mental wellness and academic journey.</p>
              </div>
            )}

            {/* Chat messages */}
            <div className="space-y-5">
              <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex items-end gap-3 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.from === 'bot' ? (
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm flex-shrink-0">🐝</div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">A</div>
                  )}
                  <div className={`max-w-md ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-white text-slate-700 shadow-card rounded-bl-none border border-slate-100'
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`text-xs text-slate-400 px-1 ${msg.from === 'user' ? 'text-right' : ''}`}>
                      {msg.from === 'bot' ? `BUDDYBEE AI • ${msg.time}` : `YOU • ${msg.time}`}
                    </div>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
              {typing && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-end gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm flex-shrink-0">🐝</div>
                  <div className="bg-white shadow-card border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
                      BuddyBee is analyzing your stress levels
                    </div>
                    <div className="flex gap-1.5">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested replies */}
            {!typing && messages.length > 0 && messages[messages.length - 1].from === 'bot' && (
              <div className="flex flex-wrap gap-2 mt-4 pl-11">
                {SUGGESTED.map(s => (
                  <button
                    key={s.id}
                    onClick={() => sendMessage(s.text)}
                    className="text-sm text-primary-600 font-medium bg-primary-50 hover:bg-primary-100 px-4 py-1.5 rounded-full transition-colors border border-primary-200"
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-slate-100 px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 bg-slate-50 rounded-2xl border border-slate-200 px-4 py-3 focus-within:ring-2 focus-within:ring-primary-300 focus-within:border-primary-300 transition-all">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask BuddyBee..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 resize-none outline-none leading-relaxed max-h-32"
                style={{ minHeight: '24px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || typing}
                className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
              >
                <Send size={15} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <div className="flex gap-4">
                <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary-600 transition-colors">
                  <Mic size={13} /> Voice
                </button>
                <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary-600 transition-colors">
                  <Upload size={13} /> Upload Notes
                </button>
              </div>
              <p className="text-xs text-slate-400">BuddyBee AI can make mistakes. Verify important academic info.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
