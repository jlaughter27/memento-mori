// gamification.js — XP, levels, coins, streaks, badges.
// Reward philosophy (from research): micro-celebrations + milestones, never payment;
// grace-day streaks with positive framing; growth-mindset language only.
import { S, skillRec, persist, persistSoon } from './state.js';
import { rewardsData, ALL_SKILLS, strandSkills } from './curriculum/index.js';

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

/* ---------- recording answers ---------- */
const XP_CORRECT = 10;
const XP_FIRST_TRY = 5;
const COINS_CORRECT = 4;

export function recordAnswer(skillId, correct, firstTry) {
  const rec = skillRec(skillId);
  rec.attempts++;
  S.progress.stats.problemsAttempted++;
  let xpGained = 0, coinsGained = 0, surprise = false;
  if (correct) {
    rec.correct++;
    S.progress.stats.problemsCorrect++;
    xpGained = XP_CORRECT + (firstTry ? XP_FIRST_TRY : 0);
    coinsGained = COINS_CORRECT;
    // ~1 in 6 "wow" surprise bonus (variable reward, not a gamble)
    if (Math.random() < 1 / 6) { coinsGained += 10; surprise = true; }
    addCoins(coinsGained);
  }
  rec.lastSeen = Date.now();
  const lvl = correct ? addXp(xpGained) : { leveledUp: false };
  persistSoon();
  return { xpGained, coinsGained, surprise, ...lvl };
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
    S.progress.stats.skillsMastered++;
  }
  if (accuracy >= 0.999) S.progress.stats.perfectQuizzes++;
  const xp = firstTime ? 50 : 15;
  const coins = firstTime ? 20 : 8;
  const lvl = addXp(xp);
  addCoins(coins);
  persist();
  return { stars, firstTime, xp, coins, ...lvl };
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
export function updateStreakOnOpen() {
  const st = S.progress.streak;
  const today = todayStr();
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
  persist();
  return st.count;
}

/* ---------- badges ---------- */
function strandMasteredForAnyGrade(strand) {
  // mastered if every skill of this strand in ANY single grade is mastered
  for (const grade of [3, 4, 5, 6]) {
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
