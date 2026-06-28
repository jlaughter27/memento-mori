// state.js — single source of truth for the learner's progress.
import { load, save, saveSoon } from './storage.js';

function defaultState() {
  return {
    profile: {
      name: '',
      grade: 3,
      createdAt: Date.now(),
      mascotName: 'Foxy',
      weeklyGoal: 3, // parent-set practice days/week (0 = off)
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
      sprintBest: 0, // best Math Sprint score (beat-your-own-best, no social comparison)
      magnitudeBest: 0, // best Magnitude Match score
      sortBest: 0, // best Sort & Storm score
      history: [], // rolling daily log [{ d:'YYYY-M-D', a:attempted, c:correct }] (last ~30 days)
      care: { happiness: 85, fullness: 70, lastTick: Date.now(), treats: 3, feeds: 0, plays: 0, pats: 0, stageSeen: 0, friendship: 0 },
      home: { room: 'room-cozy', ownedRooms: ['room-cozy'], decor: [], toys: [] }, // pet room + placed decorations + unlocked play toys
      world: { map: 'town', x: 0, y: 0, facing: 'down', visited: [], quests: {}, bosses: {}, npcSeen: {}, stickers: [], bonusDate: null, champion: false }, // explorable world position + progress
      adventure: { chapter: 0, scene: 0, completed: [] }, // pet story progress
      missions: { day: null, daily: {}, week: null, weekly: {}, weeklyIds: [] }, // daily/weekly quests
      questlog: {}, // multi-step island Quests: id -> {step, prog, done, claimed}
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
        missionsDone: 0,
        questsDone: 0,
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

/* ============================================================
   Multi-child profiles — several independent learners on one device.
   localStorage holds ONE container { v, activeId, profiles:{id:state} }.
   `S` is the LIVE active state, mutated in place on switch (every module
   imports S by reference, so we must never reassign the binding).
   ============================================================ */
const newId = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
function freshContainer() { const id = newId(); return { v: 2, activeId: id, profiles: { [id]: defaultState() } }; }
function loadContainer() {
  const raw = load();
  if (raw && raw.profiles && typeof raw.profiles === 'object') {       // already a container
    const aid = raw.activeId && raw.profiles[raw.activeId] ? raw.activeId : Object.keys(raw.profiles)[0];
    if (!aid) return freshContainer();                                  // empty profiles map
    raw.activeId = aid; raw.v = 2;
    return raw;
  }
  if (raw && raw.profile) { const id = newId(); return { v: 2, activeId: id, profiles: { [id]: raw } }; } // migrate old single-state
  return freshContainer();
}

// Always deep-clone across the S ↔ container boundary: `S` is mutated in place on
// switch, so container slots must hold independent snapshots, never a live ref.
const clone = (o) => JSON.parse(JSON.stringify(o));

let container = loadContainer();
let activeId = container.activeId;

export const S = hydrate(clone(container.profiles[activeId]));

export function persist() { container.profiles[activeId] = clone(S); container.activeId = activeId; save(container); }
export function persistSoon() { container.profiles[activeId] = clone(S); container.activeId = activeId; saveSoon(container); }

// swap a different profile's state INTO the live S (in place — preserves the binding)
function loadInto(id) {
  const next = hydrate(clone(container.profiles[id]));
  Object.keys(S).forEach((k) => delete S[k]);
  Object.assign(S, next);
  activeId = id; container.activeId = id;
}

export function listProfiles() {
  return Object.entries(container.profiles).map(([id, p]) => ({
    id,
    name: (p.profile && p.profile.name) || '',
    grade: (p.profile && p.profile.grade) || 3,
    pet: (p.profile && p.profile.avatar && p.profile.avatar.pet) || 'pet-cat',
    level: (p.progress && p.progress.level) || 1,
    onboarded: !!p.onboarded,
    active: id === activeId,
  }));
}
export function activeProfileId() { return activeId; }
export function profileCount() { return Object.keys(container.profiles).length; }

export function switchProfile(id) {
  if (id === activeId || !container.profiles[id]) return false;
  persist();              // save the learner we're leaving
  loadInto(id);
  save(container);
  applyBodyClasses();
  return true;
}

// add a fresh learner and make it active (onboarded:false → router sends to onboarding)
export function createProfile() {
  persist();
  const id = newId();
  container.profiles[id] = defaultState();
  loadInto(id);
  persist();
  applyBodyClasses();
  return id;
}

export function deleteProfile(id) {
  if (!container.profiles[id] || profileCount() <= 1) return false; // never delete the last learner
  delete container.profiles[id];
  if (id === activeId) { loadInto(Object.keys(container.profiles)[0]); applyBodyClasses(); }
  save(container);
  return true;
}

// "Reset all progress" wipes only the ACTIVE learner; siblings are untouched.
export function resetAll() {
  const d = defaultState();
  Object.keys(S).forEach((k) => delete S[k]);
  Object.assign(S, d);
  persist();
}

/* ---- skill progress helpers ---- */
export function skillRec(id) {
  if (!S.progress.skills[id]) {
    S.progress.skills[id] = { attempts: 0, correct: 0, mastered: false, stars: 0, lastSeen: 0, lessonDone: false };
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
