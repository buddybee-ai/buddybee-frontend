/**
 * BuddyBee AI — Translations
 * Covers: Signup, Login, Student Dashboard, Counselor Dashboard, Admin Dashboard
 * Languages: English (en), Urdu (ur), Roman Urdu (roman)
 */

const t = {
  // ─── Common ───────────────────────────────────────────────────────────────
  common: {
    loading:       { en: 'Loading...', ur: 'لوڈ ہو رہا ہے...', roman: 'Load ho raha hai...' },
    error:         { en: 'Something went wrong', ur: 'کچھ غلط ہو گیا', roman: 'Kuch ghalat ho gaya' },
    save:          { en: 'Save', ur: 'محفوظ کریں', roman: 'Save karein' },
    cancel:        { en: 'Cancel', ur: 'منسوخ', roman: 'Cancel' },
    submit:        { en: 'Submit', ur: 'جمع کریں', roman: 'Submit karein' },
    back:          { en: 'Back', ur: 'واپس', roman: 'Wapas' },
    search:        { en: 'Search', ur: 'تلاش کریں', roman: 'Talash karein' },
    or:            { en: 'or', ur: 'یا', roman: 'ya' },
    welcome:       { en: 'Welcome', ur: 'خوش آمدید', roman: 'Khush Aamdeed' },
    logout:        { en: 'Logout', ur: 'لاگ آؤٹ', roman: 'Log out' },
    name:          { en: 'Full Name', ur: 'پورا نام', roman: 'Poora Naam' },
    email:         { en: 'Email Address', ur: 'ای میل پتہ', roman: 'Email Pata' },
    password:      { en: 'Password', ur: 'پاس ورڈ', roman: 'Password' },
    students:      { en: 'Students', ur: 'طلباء', roman: 'Talba' },
    counselor:     { en: 'Counselor', ur: 'مشیر', roman: 'Musheer' },
    admin:         { en: 'Admin', ur: 'منتظم', roman: 'Muntazim' },
    school:        { en: 'School', ur: 'اسکول', roman: 'School' },
    branch:        { en: 'Branch', ur: 'برانچ', roman: 'Branch' },
    city:          { en: 'City', ur: 'شہر', roman: 'Sheher' },
    risk:          { en: 'Risk', ur: 'خطرہ', roman: 'Khatra' },
    wellness:      { en: 'Wellness', ur: 'صحت', roman: 'Sehat' },
    high:          { en: 'High', ur: 'زیادہ', roman: 'Zyada' },
    medium:        { en: 'Medium', ur: 'درمیانہ', roman: 'Darmyana' },
    low:           { en: 'Low', ur: 'کم', roman: 'Kam' },
    language:      { en: 'Language', ur: 'زبان', roman: 'Zaban' },
  },

  // ─── Signup ───────────────────────────────────────────────────────────────
  signup: {
    title:         { en: 'Join BuddyBee! 🍯', ur: 'BuddyBee میں شامل ہوں! 🍯', roman: 'BuddyBee mein shamil hoon! 🍯' },
    subtitle:      { en: 'Create your account and start your journey', ur: 'اپنا اکاؤنٹ بنائیں اور سفر شروع کریں', roman: 'Apna account banaein aur safar shuru karein' },
    chooseLanguage:{ en: 'Choose your language', ur: 'اپنی زبان چنیں', roman: 'Apni zaban chunein' },
    student:       { en: '🎓 Student', ur: '🎓 طالب علم', roman: '🎓 Talib Ilm' },
    parent:        { en: '👨‍👩‍👧 Parent', ur: '👨‍👩‍👧 والدین', roman: '👨‍👩‍👧 Waldain' },
    counselorNotice: {
      en: '🏫 Are you a school counselor? Counselor accounts are created by your school\'s BuddyBee admin. Ask your admin for login credentials.',
      ur: '🏫 کیا آپ اسکول مشیر ہیں؟ مشیر اکاؤنٹ BuddyBee ایڈمن بناتے ہیں۔ لاگن کریڈینشیلز کے لیے ایڈمن سے رابطہ کریں۔',
      roman: '🏫 Kya aap school counselor hain? Counselor accounts BuddyBee admin banate hain. Login credentials ke liye admin se rabta karein.',
    },
    namePlaceholder:  { en: 'Your full name', ur: 'آپ کا پورا نام', roman: 'Aapka poora naam' },
    emailPlaceholder: { en: 'you@example.com', ur: 'آپ@مثال.com', roman: 'aap@example.com' },
    passwordPlaceholder: { en: 'Create a password', ur: 'پاس ورڈ بنائیں', roman: 'Password banaein' },
    createAccount:    { en: 'Create Account 🐝', ur: 'اکاؤنٹ بنائیں 🐝', roman: 'Account banaein 🐝' },
    creating:         { en: 'Creating account...', ur: 'اکاؤنٹ بن رہا ہے...', roman: 'Account ban raha hai...' },
    alreadyHave:      { en: 'Already have an account?', ur: 'پہلے سے اکاؤنٹ ہے؟', roman: 'Pehle se account hai?' },
    signIn:           { en: 'Sign in →', ur: 'لاگ ان کریں ←', roman: 'Log in karein →' },
  },

  // ─── Login ────────────────────────────────────────────────────────────────
  login: {
    title:        { en: 'Welcome back! 🐝', ur: 'واپسی پر خوش آمدید! 🐝', roman: 'Wapsi par khush aamdeed! 🐝' },
    subtitle:     { en: 'Sign in to continue', ur: 'جاری رکھنے کے لیے سائن ان کریں', roman: 'Jari rakhne ke liye sign in karein' },
    emailLabel:   { en: 'Email Address', ur: 'ای میل پتہ', roman: 'Email Pata' },
    passLabel:    { en: 'Password', ur: 'پاس ورڈ', roman: 'Password' },
    signIn:       { en: 'Sign In', ur: 'سائن ان', roman: 'Sign In' },
    signingIn:    { en: 'Signing in...', ur: 'سائن ان ہو رہا ہے...', roman: 'Sign in ho raha hai...' },
    noAccount:    { en: "Don't have an account?", ur: 'اکاؤنٹ نہیں ہے؟', roman: 'Account nahi hai?' },
    signUp:       { en: 'Sign up →', ur: 'سائن اپ کریں ←', roman: 'Sign up karein →' },
    invalid:      { en: 'Invalid email or password', ur: 'غلط ای میل یا پاس ورڈ', roman: 'Ghalat email ya password' },
  },

  // ─── Student Dashboard ────────────────────────────────────────────────────
  student: {
    greeting_morning:   { en: 'Good Morning', ur: 'صبح بخیر', roman: 'Subah Bakhair' },
    greeting_afternoon: { en: 'Good Afternoon', ur: 'دوپہر بخیر', roman: 'Dopahar Bakhair' },
    greeting_evening:   { en: 'Good Evening', ur: 'شام بخیر', roman: 'Sham Bakhair' },
    dashboardTitle:     { en: 'Your Wellness Dashboard', ur: 'آپ کا ویلنس ڈیش بورڈ', roman: 'Aapka Wellness Dashboard' },
    wellnessScore:      { en: 'Wellness Score', ur: 'صحت اسکور', roman: 'Wellness Score' },
    stressLevel:        { en: 'Stress Level', ur: 'تناؤ', roman: 'Tanao' },
    aiChats:            { en: 'AI Chats', ur: 'AI گفتگو', roman: 'AI Baat Cheet' },
    streak:             { en: 'Day Streak', ur: 'لگاتار دن', roman: 'Lagatar Din' },
    howAreYou:          { en: "How are you feeling today?", ur: 'آج آپ کیسے محسوس کر رہے ہیں؟', roman: 'Aaj aap kaisa mehsoos kar rahe hain?' },
    mood_great:         { en: 'Great', ur: 'بہترین', roman: 'Behtareen' },
    mood_good:          { en: 'Good', ur: 'اچھا', roman: 'Acha' },
    mood_okay:          { en: 'Okay', ur: 'ٹھیک ہے', roman: 'Theek hai' },
    mood_low:           { en: 'Low', ur: 'کم', roman: 'Kam' },
    mood_anxious:       { en: 'Anxious', ur: 'فکرمند', roman: 'Fikarmand' },
    moodUpdated:        { en: '✅ Mood updated!', ur: '✅ موڈ اپڈیٹ ہو گیا!', roman: '✅ Mood update ho gaya!' },
    talkToBuddyBee:     { en: 'Talk to BuddyBee', ur: 'BuddyBee سے بات کریں', roman: 'BuddyBee se baat karein' },
    chatSubtitle:       { en: "Your AI wellness companion — here whenever you need", ur: 'آپ کا AI ساتھی — ہمیشہ آپ کے لیے موجود', roman: 'Aapka AI sathi — hamesha aapke liye mojood' },
    startChat:          { en: 'Start Chat 💬', ur: 'بات چیت شروع کریں 💬', roman: 'Baat cheet shuru karein 💬' },
    moodHistory:        { en: 'Mood History', ur: 'موڈ کی تاریخ', roman: 'Mood ki Taareekh' },
    weeklyStress:       { en: 'Weekly Stress', ur: 'ہفتہ وار تناؤ', roman: 'Haftawar Tanao' },
    wellnessBreakdown:  { en: 'Wellness Breakdown', ur: 'صحت کا خلاصہ', roman: 'Wellness ka Khulasa' },
    riskStatus:         { en: 'Risk Status', ur: 'خطرے کی صورتحال', roman: 'Khatre ki Soorat e Haal' },
    schoolAssoc:        { en: 'My School', ur: 'میرا اسکول', roman: 'Mera School' },
    noSchool:           { en: 'Not associated with a school yet', ur: 'ابھی کسی اسکول سے منسلک نہیں', roman: 'Abhi kisi school se munaslik nahi' },
  },

  // ─── Counselor Dashboard ─────────────────────────────────────────────────
  counselor: {
    overview:         { en: '📊 Overview', ur: '📊 جائزہ', roman: '📊 Jaiza' },
    myStudents:       { en: '👩‍🎓 My Students', ur: '👩‍🎓 میرے طلباء', roman: '👩‍🎓 Mere Talba' },
    totalStudents:    { en: 'My Students', ur: 'میرے طلباء', roman: 'Mere Talba' },
    highRisk:         { en: 'High Risk', ur: 'زیادہ خطرہ', roman: 'Zyada Khatra' },
    avgWellness:      { en: 'Avg Wellness', ur: 'اوسط صحت', roman: 'Ausat Wellness' },
    sessions:         { en: 'Sessions', ur: 'سیشن', roman: 'Sessions' },
    interventions:    { en: 'Intervention Alerts', ur: 'مداخلت کی اطلاعات', roman: 'Mudakhalat ki Ittila' },
    noAlerts:         { en: 'No intervention alerts right now ✅', ur: 'ابھی کوئی اطلاع نہیں ✅', roman: 'Abhi koi alert nahi ✅' },
    noSchoolWarning:  { en: 'No school branch assigned', ur: 'کوئی اسکول برانچ نہیں', roman: 'Koi school branch nahi' },
    contactAdmin:     { en: "Contact your BuddyBee admin to get assigned.", ur: 'تفویض کے لیے BuddyBee ایڈمن سے رابطہ کریں۔', roman: 'Tafweez ke liye BuddyBee admin se rabta karein.' },
    needsAttention:   { en: 'Students Need Attention', ur: 'طلباء کو توجہ درکار', roman: 'Talba ko Tawajja Darkar' },
    waitingAssign:    { en: 'Waiting for School Assignment', ur: 'اسکول کی تفویض کا انتظار', roman: 'School ki tafweez ka intezaar' },
  },

  // ─── Admin Dashboard ──────────────────────────────────────────────────────
  admin: {
    controlPanel:    { en: 'Admin Control Panel', ur: 'ایڈمن کنٹرول پینل', roman: 'Admin Control Panel' },
    manageDesc:      { en: 'Manage school branches, counselors, and all student data.', ur: 'اسکول برانچ، مشیران اور طلباء کا ڈیٹا منظم کریں۔', roman: 'School branches, counselors aur students ka data manage karein.' },
    overview:        { en: '📊 Overview', ur: '📊 جائزہ', roman: '📊 Jaiza' },
    schools:         { en: '🏫 Schools', ur: '🏫 اسکول', roman: '🏫 Schools' },
    counselors:      { en: '👨‍💼 Counselors', ur: '👨‍💼 مشیران', roman: '👨‍💼 Counselors' },
    studentsTab:     { en: '🎓 Students', ur: '🎓 طلباء', roman: '🎓 Students' },
    branches:        { en: 'Branches', ur: 'برانچیں', roman: 'Branches' },
    alerts:          { en: 'Alerts', ur: 'اطلاعات', roman: 'Alerts' },
    registerSchool:  { en: 'Register New School Branch', ur: 'نئی اسکول برانچ رجسٹر کریں', roman: 'Nayi school branch register karein' },
    createCounselor: { en: 'Create Counselor Account', ur: 'مشیر اکاؤنٹ بنائیں', roman: 'Counselor account banaein' },
    allStudents:     { en: 'All Students', ur: 'تمام طلباء', roman: 'Tamam Talba' },
    notAssociated:   { en: 'Not associated', ur: 'منسلک نہیں', roman: 'Munaslik nahi' },
  },

  // ─── Chat Page ────────────────────────────────────────────────────────────
  chat: {
    title:       { en: 'BuddyBee Chat', ur: 'BuddyBee گفتگو', roman: 'BuddyBee Baat Cheet' },
    placeholder: { en: "Tell BuddyBee how you're feeling...", ur: 'BuddyBee کو بتائیں آپ کیسا محسوس کر رہے ہیں...', roman: 'BuddyBee ko bataein aap kaisa mehsoos kar rahe hain...' },
    send:        { en: 'Send', ur: 'بھیجیں', roman: 'Bhejein' },
    thinking:    { en: 'BuddyBee is thinking...', ur: 'BuddyBee سوچ رہا ہے...', roman: 'BuddyBee soch raha hai...' },
  },
}

/**
 * useT — translation helper
 * Usage: const translate = useT()  →  translate('signup.title')
 * OR import getT and use directly without hooks
 */
export default t

// getT is defined AFTER navT so it can close over it
export function getT(lang) {
  return function translate(path) {
    if (navT && navT[path]) {
      return navT[path][lang] || navT[path]['en'] || path
    }
    const parts = path.split('.')
    let node = t
    for (const p of parts) {
      node = node?.[p]
      if (!node) return path
    }
    return node?.[lang] || node?.['en'] || path
  }
}

// ─── Nav & Portal labels (appended) ──────────────────────────────────────────
export const navT = {
  'nav.dashboard': { en: 'Dashboard',       ur: 'ڈیش بورڈ',     roman: 'Dashboard'     },
  'nav.aiChat':    { en: 'AI Chat',          ur: 'AI گفتگو',     roman: 'AI Chat'       },
  'nav.wellness':  { en: 'Wellness Report',  ur: 'صحت رپورٹ',    roman: 'Wellness'      },
  'nav.activity':  { en: 'Activity Log',     ur: 'سرگرمی لاگ',   roman: 'Activity Log'  },
  'nav.settings':  { en: 'Settings',         ur: 'ترتیبات',      roman: 'Settings'      },
  'nav.reports':   { en: 'Reports',          ur: 'رپورٹیں',      roman: 'Reports'       },
  'nav.alerts':    { en: 'Alerts',           ur: 'اطلاعات',      roman: 'Alerts'        },
  'nav.students':  { en: 'Students',         ur: 'طلباء',        roman: 'Talba'         },
  'nav.analytics': { en: 'Analytics',        ur: 'تجزیات',       roman: 'Analytics'     },
  'nav.chat':      { en: 'Chat Interface',   ur: 'چیٹ',          roman: 'Chat'          },
  'nav.users':     { en: 'Users',            ur: 'صارفین',       roman: 'Users'         },
  'nav.schools':   { en: 'Schools',          ur: 'اسکول',        roman: 'Schools'       },
  'nav.newChat':   { en: 'New Chat',         ur: 'نئی گفتگو',    roman: 'Nayi Chat'     },
  'nav.collapse':  { en: 'Collapse',         ur: 'بند کریں',     roman: 'Band karein'   },

  'portal.student':       { en: 'Student Portal',    ur: 'طالب علم پورٹل',    roman: 'Student Portal'    },
  'portal.student_sub':   { en: 'WELLNESS COMPANION', ur: 'صحت ساتھی',        roman: 'WELLNESS COMPANION'},
  'portal.parent':        { en: 'Parent Portal',     ur: 'والدین پورٹل',      roman: 'Parent Portal'     },
  'portal.parent_sub':    { en: 'FAMILY OVERVIEW',   ur: 'خاندان کا جائزہ',   roman: 'FAMILY OVERVIEW'   },
  'portal.counselor':     { en: 'Counselor Portal',  ur: 'مشیر پورٹل',        roman: 'Counselor Portal'  },
  'portal.counselor_sub': { en: 'STUDENT CARE',      ur: 'طلباء کی نگہداشت',  roman: 'STUDENT CARE'      },
  'portal.admin':         { en: 'Admin Console',     ur: 'ایڈمن کنسول',       roman: 'Admin Console'     },
  'portal.admin_sub':     { en: 'SYSTEM OVERVIEW',   ur: 'نظام کا جائزہ',     roman: 'SYSTEM OVERVIEW'   },
}
