// BuddyBee — Module 4: chat UX helpers (conversation starters + friendly
// error copy). Pure client-side, no backend calls.

const STARTER_POOL = [
  "Exams stressing me out 📚",
  "I can't focus 😭",
  "I just need someone to talk to 💛",
  "I'm feeling great today 🎉",
  "I had a rough day.",
  "Help me study.",
  "I've been really anxious lately",
  "How do I deal with peer pressure?",
  "Can you help me make a study plan?",
  "I'm feeling stressed about exams 😟",
  "I'm proud of myself today 🥹",
  "I don't know how to talk to my parents about this.",
]

// Pick `count` distinct starters at random, so returning students don't
// see the exact same four chips every time.
export function getSuggestedStarters(count = 4) {
  const pool = [...STARTER_POOL]
  const picked = []
  while (picked.length < count && pool.length > 0) {
    const i = Math.floor(Math.random() * pool.length)
    picked.push(pool.splice(i, 1)[0])
  }
  return picked
}

const CONNECTION_ERRORS = [
  "Oops 😭 Something went wrong. Mind trying again?",
  "Looks like we lost connection for a second — try that again?",
  "Hmm, that didn't go through. One more try?",
  "BuddyBee's having a moment 🐝 — try sending that again.",
]

export function getFriendlyError() {
  return CONNECTION_ERRORS[Math.floor(Math.random() * CONNECTION_ERRORS.length)]
}
