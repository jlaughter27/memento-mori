// gamification.js — XP, levels, coins, streaks, badges.
// Reward philosophy (from research): micro-celebrations + milestones, never payment;
// grace-day streaks with positive framing; growth-mindset language only.
import { S, skillRec, persist, persistSoon } from './state.js';
import { rewardsData, ALL_SKILLS, strandSkills, GRADES } from './curriculum/index.js';

/* ---------- leveling ---------- */
export function xpToReach(level) {
  let total = 0;
  for (let l = 1; l < level; l++) total += 60 + l * 40;
  return total;
}
export function levelFromXp(xp) {
  let l = 1;
  while (xp >= xpToReach(l + 1)) l++;
  return l;
}
export function levelProgress() {
  const lvl = S.progress.level;
  const cur = xpToReach(lvl), next = xpToReach(lvl + 1);
  const into = S.progress.xp - cur, span = next - cur;
  return { level: lvl, into, span, pct: Math.max(0, Math.min(1, into / span)) };
}

function addXp(amount) {
  S.progress.xp += amount;
  const newLevel = levelFromXp(S.progress.xp);
  let leveledUp = false, gainedLevels = 0;
  if (newLevel > S.progress.level) {
    gainedLevels = newLevel - S.progress.level;
    S.progress.level = newLevel;
    leveledUp = true;
    addCoins(gainedLevels * 25); // level-up coin bonus
  }
  return { leveledUp, newLevel, gainedLevels };
}

export function addCoins(amount) {
  S.progress.coins += amount;
  if (amount > 0) S.progress.stats.coinsEarned += amount;
}

// rolling per-day attempt log for the parent report (last 30 days, on-device only)
function logDaily(correct) {
  const h = S.progress.history;
  const today = todayStr();
  let e = h[h.length - 1];
  if (!e || e.d !== today) { e = { d: today, a: 0, c: 0 }; h.push(e); if (h.length > 30) h.shift(); }
  e.a++; if (correct) e.c++;
}

/* ---------- recording answers ---------- */
const XP_CORRECT = 10;
const XP_FIRST_TRY = 5;
const COINS_CORRECT = 4;
export const DAILY_GOAL = 10;

function bumpDaily() {
  const today = todayStr();
  const d = S.progress.daily;
  if (d.date !== today) { d.date = today; d.count = 0; d.goalReached = false; }
  d.count++;
  let justReached = false;
  if (!d.goalReached && d.count >= DAILY_GOAL) { d.goalReached = true; justReached = true; }
  return justReached;
}
export function dailyStatus() {
  const today = todayStr();
  const d = S.progress.daily;
  const count = d.date === today ? d.count : 0;
  return { count, goal: DAILY_GOAL, reached: count >= DAILY_GOAL };
}

export function recordAnswer(skillId, correct, firstTry) {
  const rec = skillRec(skillId);
  rec.attempts++;
  S.progress.stats.problemsAttempted++;
  logDaily(correct);
  let xpGained = 0, coinsGained = 0, surprise = false, dailyReached = false;
  if (correct) {
    rec.correct++;
    S.progress.stats.problemsCorrect++;
    xpGained = XP_CORRECT + (firstTry ? XP_FIRST_TRY : 0);
    coinsGained = COINS_CORRECT;
    // ~1 in 6 "wow" surprise bonus (variable reward, not a gamble)
    if (Math.random() < 1 / 6) { coinsGained += 10; surprise = true; }
    addCoins(coinsGained);
    dailyReached = bumpDaily();
  }
  rec.lastSeen = Date.now();
  const lvl = correct ? addXp(xpGained) : { leveledUp: false };
  persistSoon();
  return { xpGained, coinsGained, surprise, dailyReached, ...lvl };
}

export function completeLesson(skillId) {
  const rec = skillRec(skillId);
  if (!rec.lessonDone) {
    rec.lessonDone = true;
    S.progress.stats.lessonsCompleted++;
  }
  const lvl = addXp(20);
  addCoins(5);
  persist();
  return { xp: 20, coins: 5, ...lvl };
}

// called when a practice session reaches the required correct count
export function masterSkill(skillId, accuracy) {
  const rec = skillRec(skillId);
  const stars = accuracy >= 0.95 ? 3 : accuracy >= 0.8 ? 2 : 1;
  const firstTime = !rec.mastered;
  rec.stars = Math.max(rec.stars || 0, stars);
  if (firstTime) {
    rec.mastered = true;
    rec.masteredAt = Date.now();
    S.progress.stats.skillsMastered++;
  }
  if (accuracy >= 0.999) S.progress.stats.perfectQuizzes++;
  const xp = firstTime ? 50 : 15;
  const coins = firstTime ? 20 : 8;
  const lvl = addXp(xp);
  addCoins(coins);
  scheduleReview(skillId, firstTime ? 0 : null); // first mastery starts the review ladder
  persist();
  return { stars, firstTime, xp, coins, ...lvl };
}

/* ---------- spaced review (lightweight Leitner ladder) ---------- */
const DAY = 86400000;
const REVIEW_INTERVALS = [3, 7, 16, 35, 70]; // days between refreshers, lengthening as it sticks
export function scheduleReview(skillId, stage) {
  const rec = skillRec(skillId);
  if (stage === null) stage = Math.min((rec.reviewStage || 0) + 1, REVIEW_INTERVALS.length - 1);
  rec.reviewStage = stage;
  rec.reviewAt = Date.now() + REVIEW_INTERVALS[stage] * DAY;
  persistSoon();
}
export function dueReviews() {
  const now = Date.now();
  return ALL_SKILLS.filter((s) => {
    const r = S.progress.skills[s.id];
    return r && r.mastered && r.reviewAt && r.reviewAt <= now;
  });
}

/* ---------- Mistakes Notebook (Fix-It loop) ----------
   Missed problems reliably return: a first-try miss notes the skill; a clean
   first-try-correct (anywhere) resolves one. Surfaced as a "Fix-It" session. */
export function noteMistake(skillId) {
  const m = S.progress.mistakes;
  const e = m[skillId] || { count: 0, lastMiss: 0 };
  e.count = Math.min((e.count || 0) + 1, 5);
  e.lastMiss = Date.now();
  m[skillId] = e;
  persistSoon();
}
export function resolveMistake(skillId) {
  const m = S.progress.mistakes;
  if (!m[skillId]) return;
  m[skillId].count -= 1;
  if (m[skillId].count <= 0) delete m[skillId];
  persistSoon();
}
export function mistakeSkills() {
  return Object.keys(S.progress.mistakes)
    .map((id) => ALL_SKILLS.find((s) => s.id === id))
    .filter(Boolean)
    .sort((a, b) => (S.progress.mistakes[b.id].lastMiss || 0) - (S.progress.mistakes[a.id].lastMiss || 0));
}
export function mistakeCount() {
  return Object.values(S.progress.mistakes).reduce((n, e) => n + (e.count || 0), 0);
}

/* ---------- daily warm-up (retrieval practice on open) ----------
   Once a day, a short interleaved check of past material — "your pet wants to
   see what you remember." Pool = recently practiced/mastered skills. */
export function warmupPool() {
  const seen = ALL_SKILLS.filter((s) => { const r = S.progress.skills[s.id]; return r && (r.mastered || r.attempts > 0); });
  return seen.sort((a, b) => (S.progress.skills[b.id].lastSeen || 0) - (S.progress.skills[a.id].lastSeen || 0)).slice(0, 8);
}
export function warmupDue() {
  return S.progress.warmup.date !== todayStr() && warmupPool().length >= 3;
}
export function markWarmupDone() {
  S.progress.warmup.date = todayStr();
  persist();
}

/* ---------- pet growth (evolution tied to learning milestones) ---------- */
const PET_STAGES = [
  { i: 0, name: 'Little', scale: 0.9, glow: false },
  { i: 1, name: 'Growing', scale: 1.04, glow: false },
  { i: 2, name: 'Grown', scale: 1.18, glow: true },
  { i: 3, name: 'Super', scale: 1.34, glow: true },
];
export function petStage() {
  const m = S.progress.stats.skillsMastered || 0;
  const i = m >= 25 ? 3 : m >= 10 ? 2 : m >= 3 ? 1 : 0;
  return PET_STAGES[i];
}

/* ---------- mastery decay (skills get "rusty" if long overdue) ---------- */
export function isRusty(rec) {
  if (!rec || !rec.mastered || !rec.reviewAt) return false;
  const interval = (REVIEW_INTERVALS[rec.reviewStage || 0] || 3) * DAY;
  return Date.now() - rec.reviewAt > interval; // overdue by more than a full interval
}
export function rustySkills() {
  return ALL_SKILLS.filter((s) => isRusty(S.progress.skills[s.id]));
}

/* ---------- weekly goal (parent-set practice days/week) ---------- */
export function weeklyProgress() {
  const goal = S.profile.weeklyGoal || 0;
  const now = new Date();
  const days = new Set();
  for (const e of S.progress.history) {
    if (!e.a) continue;
    const [y, mo, d] = e.d.split('-').map(Number);
    const dt = new Date(y, mo - 1, d);
    if ((now - dt) / DAY <= 6.5) days.add(e.d);
  }
  return { days: days.size, goal, met: goal > 0 && days.size >= goal };
}

/* ---------- streaks (grace-day, positive framing) ---------- */
function todayStr(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function dayDiff(a, b) {
  const pa = a.split('-').map(Number), pb = b.split('-').map(Number);
  const da = new Date(pa[0], pa[1] - 1, pa[2]), db = new Date(pb[0], pb[1] - 1, pb[2]);
  return Math.round((db - da) / 86400000);
}
const STREAK_MILESTONES = [3, 5, 7, 14, 21, 30, 50, 100];
export function updateStreakOnOpen() {
  const st = S.progress.streak;
  const today = todayStr();
  const before = st.count;
  if (!st.lastActiveDate) {
    st.count = 1; st.lastActiveDate = today; st.graceUsed = false;
  } else {
    const diff = dayDiff(st.lastActiveDate, today);
    if (diff === 0) { /* same day, no change */ }
    else if (diff === 1) { st.count++; st.lastActiveDate = today; st.graceUsed = false; }
    else if (diff === 2 && !st.graceUsed) { st.count++; st.lastActiveDate = today; st.graceUsed = true; } // one grace day
    else { st.count = 1; st.lastActiveDate = today; st.graceUsed = false; }
  }
  S.progress.stats.bestStreak = Math.max(S.progress.stats.bestStreak || 0, st.count);
  // reset the daily-goal counter for a new calendar day
  if (S.progress.daily.date !== today) { S.progress.daily.date = today; S.progress.daily.count = 0; S.progress.daily.goalReached = false; }
  persist();
  const milestone = st.count > before && STREAK_MILESTONES.includes(st.count) ? st.count : 0;
  return { count: st.count, milestone };
}

// pick the best skill to suggest "continue" with: most recently seen, not yet mastered,
// otherwise the first unlocked, not-mastered skill in the current grade.
export function recommendedSkill(isUnlocked) {
  const grade = S.profile.grade;
  const inGrade = ALL_SKILLS.filter((s) => s.grade === grade);
  let best = null, bestSeen = 0;
  for (const s of inGrade) {
    const r = S.progress.skills[s.id];
    if (r && !r.mastered && r.lastSeen && r.lastSeen > bestSeen) { best = s; bestSeen = r.lastSeen; }
  }
  if (best) return best;
  for (const s of inGrade) {
    const r = S.progress.skills[s.id];
    if ((!r || !r.mastered) && (!isUnlocked || isUnlocked(s))) return s;
  }
  return null;
}

/* ---------- badges ---------- */
function strandMasteredForAnyGrade(strand) {
  // mastered if every skill of this strand in ANY single grade is mastered
  for (const grade of GRADES) {
    const skills = strandSkills(grade, strand);
    if (skills.length && skills.every((s) => S.progress.skills[s.id] && S.progress.skills[s.id].mastered)) return true;
  }
  return false;
}
function badgeMet(b) {
  const st = S.progress.stats, pr = S.progress;
  const t = b.trigger || {};
  switch (t.kind) {
    case 'lessonsCompleted': return st.lessonsCompleted >= t.count;
    case 'problemsCorrect': return st.problemsCorrect >= t.count;
    case 'streakDays': return pr.streak.count >= t.count;
    case 'skillsMastered': return st.skillsMastered >= t.count;
    case 'strandMastered': return strandMasteredForAnyGrade(t.strand);
    case 'perfectQuiz': return st.perfectQuizzes >= (t.count || 1);
    case 'coinsEarned': return st.coinsEarned >= t.count;
    case 'levelReached': return pr.level >= t.count;
    default: return false;
  }
}
export function checkNewBadges() {
  const earned = new Set(S.progress.badges);
  const fresh = [];
  for (const b of rewardsData.badges) {
    if (!earned.has(b.id) && badgeMet(b)) {
      S.progress.badges.push(b.id);
      fresh.push(b);
    }
  }
  if (fresh.length) persist();
  return fresh;
}
export function allBadges() {
  const earned = new Set(S.progress.badges);
  return rewardsData.badges.map((b) => ({ ...b, earned: earned.has(b.id) }));
}

/* ---------- shop ---------- */
export function canAfford(item) { return S.progress.coins >= item.cost; }
export function owns(id) { return S.progress.owned.includes(id); }
export function buy(item) {
  if (owns(item.id)) return { ok: false, reason: 'owned' };
  if (S.progress.coins < item.cost) return { ok: false, reason: 'poor' };
  S.progress.coins -= item.cost;
  S.progress.owned.push(item.id);
  persist();
  return { ok: true };
}
export function equip(item) {
  const a = S.profile.avatar;
  if (item.kind === 'pet') a.pet = item.id;
  else if (item.kind === 'theme') a.theme = item.id;
  else if (item.kind === 'background') a.background = item.id;
  else if (item.kind === 'accessory') {
    const i = a.accessories.indexOf(item.id);
    if (i >= 0) a.accessories.splice(i, 1); else a.accessories.push(item.id);
  }
  persist();
}

/* ---------- encouragement copy (growth mindset) ---------- */
export const PRAISE = {
  correct: ['Yes! 🎉', 'Nailed it! ⭐', 'Brilliant! 🌟', 'You got it! 💪', 'Awesome! 🚀', 'Way to go! 🥳', 'Super! ✨', 'Boom! 💥'],
  correctAfterStruggle: [
    'You worked through that — that\'s how brains get stronger! 🧠',
    'You didn\'t give up. That\'s real math power! 💪',
    'Sticking with it paid off! 🌈',
  ],
  wrong1: [
    'Hmm, not quite — want to try a different way? 🤔',
    'Close! Let\'s look again together. 🔎',
    'Not yet — and that\'s totally okay. Try once more? 🌱',
  ],
  wrong2: [
    'Let\'s figure it out together. Tap "Show me how" any time. 🤝',
    'Tricky one! Here\'s a hint to help. 💡',
  ],
};
export const pickPraise = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* overall completion percent for the current grade */
export function gradeCompletion(grade) {
  const skills = ALL_SKILLS.filter((s) => s.grade === grade);
  const done = skills.filter((s) => S.progress.skills[s.id] && S.progress.skills[s.id].mastered).length;
  return { done, total: skills.length, pct: skills.length ? done / skills.length : 0 };
}

/* ---------- pet care (happiness + feeding) ----------
   Gentle, never punishing: meters drift down slowly over real time and are
   refilled by free play/pats and (treat-based) feeding. Happiness floors high
   enough that the pet is never "sad and neglected" — this is delight, not guilt. */
const CARE = { happyFloor: 15, fullFloor: 0, happyDecayPerHr: 1.5, fullDecayPerHr: 2.5, maxHours: 36 };

export function tickCare() {
  const c = S.progress.care;
  const now = Date.now();
  const hrs = Math.min(CARE.maxHours, Math.max(0, (now - (c.lastTick || now)) / 3600000));
  if (hrs > 0.01) {
    c.fullness = clamp(c.fullness - hrs * CARE.fullDecayPerHr, CARE.fullFloor, 100);
    let hd = hrs * CARE.happyDecayPerHr + (c.fullness < 20 ? hrs * 1 : 0); // hungry pets get a little sadder
    c.happiness = clamp(c.happiness - hd, CARE.happyFloor, 100);
    c.lastTick = now;
    persistSoon();
  }
  return c;
}
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export function petMood() {
  const h = S.progress.care.happiness;
  return h >= 80 ? 'celebrate' : h >= 55 ? 'happy' : h >= 30 ? 'idle' : 'encourage';
}
export function patPet() {
  tickCare(); const c = S.progress.care;
  c.happiness = clamp(c.happiness + 3, 0, 100); c.pats = (c.pats || 0) + 1; c.lastTick = Date.now(); persistSoon();
  return c;
}
export function playPet() {
  tickCare(); const c = S.progress.care;
  c.happiness = clamp(c.happiness + 10, 0, 100); c.plays = (c.plays || 0) + 1; c.lastTick = Date.now(); persist();
  return c;
}
export function feedPet() {
  tickCare(); const c = S.progress.care;
  if ((c.treats || 0) <= 0) return { ok: false, reason: 'no-treats' };
  c.treats -= 1; c.fullness = clamp(c.fullness + 35, 0, 100); c.happiness = clamp(c.happiness + 8, 0, 100);
  c.feeds = (c.feeds || 0) + 1; c.lastTick = Date.now(); persist();
  return { ok: true, care: c };
}
export function buyTreats(count, cost) {
  if (S.progress.coins < cost) return { ok: false, reason: 'poor' };
  S.progress.coins -= cost; S.progress.care.treats = (S.progress.care.treats || 0) + count; persist();
  return { ok: true };
}
// small treats reward from learning (called occasionally on correct answers)
export function awardTreat(n = 1) { S.progress.care.treats = (S.progress.care.treats || 0) + n; persistSoon(); }

// pet friendship: gentle XP from playing/helping in the World; levels never go down
const FRIEND_PER_LEVEL = 25;
export function addFriendship(n = 1) { const c = S.progress.care; c.friendship = (c.friendship || 0) + n; persistSoon(); return c.friendship; }
export function friendInfo() {
  const fp = S.progress.care.friendship || 0;
  const level = Math.floor(fp / FRIEND_PER_LEVEL) + 1;
  const into = fp % FRIEND_PER_LEVEL;
  return { fp, level, into, need: FRIEND_PER_LEVEL, pct: Math.round((into / FRIEND_PER_LEVEL) * 100) };
}
