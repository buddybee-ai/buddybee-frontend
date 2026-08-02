// BuddyBee — Dynamic greeting & first-time welcome engine.
// Pure client-side text pools (no extra API calls, no added latency).

const MORNING = [
  "Morning ☀️ how are we starting the day?",
  "Hey, rise and shine 🐝 what's on your mind?",
  "Morning! Ready to take on today, or are we easing in?",
]

const AFTERNOON = [
  "Hey, how's the day treating you so far?",
  "Afternoon check-in — how are you feeling?",
  "Hey there, how's today going?",
]

const EVENING = [
  "Evening 🌙 how was your day?",
  "Hey, how are you winding down tonight?",
  "Long day? Come sit with me for a minute 💛",
]

const NIGHT = [
  "Hey, still up? What's on your mind?",
  "Late night thoughts? I'm here.",
  "Can't sleep, or just up thinking? Talk to me.",
]

const WEEKEND = [
  "Heyy, how's the weekend going? 🐝",
  "Weekend mode — what's up with you?",
  "Hey, taking it easy today or busy?",
]

// Picks a natural, time-of-day-aware greeting. Weekend pool mixes in
// occasionally on Sat/Sun so it doesn't feel like a hard override.
export function getGreeting() {
  const now = new Date()
  const isWeekend = now.getDay() === 0 || now.getDay() === 6
  const hour = now.getHours()

  let pool
  if (isWeekend && Math.random() < 0.5) pool = WEEKEND
  else if (hour >= 5 && hour < 12) pool = MORNING
  else if (hour >= 12 && hour < 17) pool = AFTERNOON
  else if (hour >= 17 && hour < 22) pool = EVENING
  else pool = NIGHT

  return pool[Math.floor(Math.random() * pool.length)]
}

const WELCOME_VARIANTS = [
  (name) =>
    `Hey ${name} 🐝 I'm BuddyBee — think of me as someone you can talk to about school, life, exams, or literally anything on your mind. What you share stays between us; your counsellor only ever sees general wellbeing stuff, never your actual chats. So, what's going on today?`,
  (name) =>
    `Hi ${name}! I'm BuddyBee 🐝 — here for the good days, the rough days, and everything in between. This space is just for you; it's private, and no one sees your actual messages. What's on your mind?`,
  (name) =>
    `Hey ${name}, welcome — I'm BuddyBee 🐝. Whether it's stress, school stuff, or you just need to vent, I'm here for it. Everything you tell me stays private. So... how are you actually doing?`,
  (name) =>
    `Hi ${name} 🐝 I'm BuddyBee, your space to talk through anything — exams, friends, family, or just a rough mood. It's just between us. What's up?`,
]

// Rotates a friendly, private, inviting first-time welcome message.
export function getWelcomeMessage(name) {
  const displayName = (name || 'there').trim() || 'there'
  const variant = WELCOME_VARIANTS[Math.floor(Math.random() * WELCOME_VARIANTS.length)]
  return variant(displayName)
}

// Rotating "thinking" labels for the typing indicator — picked once per
// send, not per render, so it doesn't flicker while waiting.
const THINKING_LABELS = [
  'BuddyBee is thinking...',
  'BuddyBee is buzzing... 🐝',
  'One sec...',
  'Thinking...',
]

export function getThinkingLabel() {
  return THINKING_LABELS[Math.floor(Math.random() * THINKING_LABELS.length)]
}

