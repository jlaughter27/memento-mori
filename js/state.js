// state.js — single source of truth for the learner's progress.
import { load, save, saveSoon, wipe } from './storage.js';

function defaultState() {
  return {
    profile: {
      name: '',
      grade: 3,
      createdAt: Date.now(),
      mascotName: 'Foxy',
      avatar: { pet: 'pet-cat', accessories: [], theme: 'default', background: 'default' },
    },
    progress: {
      xp: 0,
      level: 1,
      coins: 0,
      streak: { count: 0, lastActiveDate: null, graceUsed: false },
      daily: { date: null, count: 0, goalReached: false }, // today's problem count toward daily goal
      mistakes: {}, // skillId -> { count, lastMiss } : the "Mistakes Notebook" / Fix-It queue
      warmup: { date: null }, // last day the open-session warm-up was offered
      care: { happiness: 85, fullness: 70, lastTick: Date.now(), treats: 3, feeds: 0, plays: 0, pats: 0 },
      home: { room: 'room-cozy', ownedRooms: ['room-cozy'], decor: [] }, // pet room + placed decorations
      adventure: { chapter: 0, scene: 0, completed: [] }, // pet story progress
      skills: {}, // id -> {attempts, correct, mastered, stars, lastSeen}
      badges: [], // earned badge ids
      owned: ['pet-cat'], // owned shop/pet ids (first pet free)
      stats: {
        problemsAttempted: 0,
        problemsCorrect: 0,
        lessonsCompleted: 0,
        skillsMastered: 0,
        perfectQuizzes: 0,
        coinsEarned: 0,
        bestStreak: 0,
      },
      settings: { sound: true, reducedMotion: false, dyslexicFont: false, tts: false },
    },
    onboarded: false,
    lastVersion: null, // last APP_VERSION the learner has seen (drives "What's New")
  };
}

// deep-merge defaults so older saves gain new fields
function hydrate(saved) {
  const d = defaultState();
  if (!saved) return d;
  const merge = (a, b) => {
    for (const k in a) {
      if (a[k] && typeof a[k] === 'object' && !Array.isArray(a[k])) {
        b[k] = merge(a[k], b[k] && typeof b[k] === 'object' ? b[k] : {});
      } else if (!(k in b)) {
        b[k] = a[k];
      }
    }
    return b;
  };
  return merge(d, saved);
}

export const S = hydrate(load());

export function persist() { save(S); }
export function persistSoon() { saveSoon(S); }

export function resetAll() {
  wipe();
  const d = defaultState();
  Object.keys(S).forEach((k) => delete S[k]);
  Object.assign(S, d);
  persist();
}

/* ---- skill progress helpers ---- */
export function skillRec(id) {
  if (!S.progress.skills[id]) {
    S.progress.skills[id] = { attempts: 0, correct: 0, mastered: false, stars: 0, lastSeen: 0 };
  }
  return S.progress.skills[id];
}
export function isMastered(id) { return !!(S.progress.skills[id] && S.progress.skills[id].mastered); }
export function isUnlocked(skill) {
  // a skill is unlocked if it has no prereqs, or any prereq is mastered (lenient: ANY),
  // and unknown prereq ids (cross-grade) are ignored.
  if (!skill.prereq || skill.prereq.length === 0) return true;
  const known = skill.prereq.filter((p) => p.startsWith('g' + skill.grade));
  if (known.length === 0) return true; // only cross-grade prereqs -> open
  return known.some((p) => isMastered(p));
}

/* ---- settings ---- */
export function setSetting(key, val) { S.progress.settings[key] = val; persist(); applyBodyClasses(); }
export function applyBodyClasses() {
  const s = S.progress.settings;
  document.body.classList.toggle('reduced-motion', !!s.reducedMotion);
  document.body.classList.toggle('dyslexic', !!s.dyslexicFont);
  document.body.dataset.theme = S.profile.avatar.theme || 'default';
  document.body.dataset.bg = S.profile.avatar.background || 'default';
}
