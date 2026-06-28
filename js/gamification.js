// gamification.js — XP, levels, coins, streaks, badges.
// Reward philosophy (from research): micro-celebrations + milestones, never payment;
// grace-day streaks with positive framing; growth-mindset language only.
import { S, skillRec, persist, persistSoon } from './state.js';
import { rewardsData, ALL_SKILLS, strandSkills, GRADES } from './curriculum/index.js';
import missionTemplates from './curriculum/missions-data.js';
import questsData from './curriculum/quests-data.js';

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

/* ---------- BKT-style mastery estimate ----------
   A per-skill p(known), updated Bayesian-style from ONE piece of evidence per
   problem (the FIRST response) — so the mastery meter reflects real, current
   knowledge (it can go DOWN), not just session completion. Classic parameter
   values from the literature. Above ~90% a skill enters a "Challenge Zone" where
   harder problems confirm true mastery (IXL SmartScore idea). */
const BKT = { pInit: 0.25, pLearn: 0.18, pSlip: 0.1, pGuess: 0.2, masteryAt: 0.9 };
function bktUpdate(rec, correct) {
  const p = typeof rec.pKnown === 'number' ? rec.pKnown : BKT.pInit;
  const pc = correct
    ? (p * (1 - BKT.pSlip)) / (p * (1 - BKT.pSlip) + (1 - p) * BKT.pGuess)
    : (p * BKT.pSlip) / (p * BKT.pSlip + (1 - p) * (1 - BKT.pGuess));
  rec.pKnown = Math.max(0, Math.min(1, pc + (1 - pc) * BKT.pLearn));
  return rec.pKnown;
}
export function knownProb(skillId) {
  const r = S.progress.skills[skillId];
  return r && typeof r.pKnown === 'number' ? r.pKnown : BKT.pInit;
}
export function readyToMaster(skillId) {
  const r = S.progress.skills[skillId];
  return !!(r && r.mastered) || knownProb(skillId) >= BKT.masteryAt;
}
// mastery meter for the UI: 0–100, with a zone (learning / challenge / mastered)
export function masteryMeter(skillId) {
  const r = S.progress.skills[skillId];
  const pct = Math.round(knownProb(skillId) * 100);
  const zone = r && r.mastered ? 'mastered' : pct >= BKT.masteryAt * 100 ? 'challenge' : 'learning';
  return { pct, zone };
}

// `evidence`: whether this response counts toward BKT (the problem's FIRST response).
export function recordAnswer(skillId, correct, firstTry, evidence = correct ? firstTry : true) {
  const rec = skillRec(skillId);
  if (evidence) bktUpdate(rec, correct);
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
    bumpMission('solve');
    if (firstTry) bumpMission('firstTry');
    bumpQuest('solve');
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
  bumpMission('lesson');
  persist();
  return { xp: 20, coins: 5, ...lvl };
}

// called when a practice session reaches the required correct count.
// Mastery now also needs the BKT estimate to agree the skill is really known —
// a strong session on a not-yet-solid skill ends warmly ("almost!"), not mastered.
export function masterSkill(skillId, accuracy) {
  const rec = skillRec(skillId);
  if (!rec.mastered && !readyToMaster(skillId)) {
    const lvl = addXp(15); addCoins(5); persist();
    return { almost: true, stars: 0, firstTime: false, xp: 15, coins: 5, pKnown: knownProb(skillId), ...lvl };
  }
  const stars = accuracy >= 0.95 ? 3 : accuracy >= 0.8 ? 2 : 1;
  const firstTime = !rec.mastered;
  rec.stars = Math.max(rec.stars || 0, stars);
  if (firstTime) {
    rec.mastered = true;
    rec.masteredAt = Date.now();
    S.progress.stats.skillsMastered++;
    bumpMission('master');
    bumpQuest('master');
  }
  if (accuracy >= 0.999) S.progress.stats.perfectQuizzes++;
  const xp = firstTime ? 50 : 15;
  const coins = firstTime ? 20 : 8;
  const lvl = addXp(xp);
  addCoins(coins);
  scheduleReview(skillId, firstTime ? 0 : null); // first mastery starts the review ladder
  persist();
  return { almost: false, stars, firstTime, xp, coins, ...lvl };
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
// a one-time "your pet grew up!" moment when the stage advances past what we've shown
export function pendingPetEvolution() {
  const st = petStage();
  return st.i > (S.progress.care.stageSeen || 0) ? st : null;
}
export function markPetStageSeen() { S.progress.care.stageSeen = petStage().i; persistSoon(); }

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

/* ---------- missions / quests (daily + weekly) ----------
   A motivating meta-layer over the actions the learner already does. Daily
   missions are the three core actions (always achievable in a session); weekly
   missions are bigger and seeded so they vary week to week. Progress is fed by
   `bumpMission(metric)` from recordAnswer / completeLesson / masterSkill, so the
   whole system "just works" without touching every view. Rewards are coins +
   treats; finishing one bumps the `missionsDone` stat (feeds two badges). */
const MISSION_BY_ID = Object.fromEntries(missionTemplates.map((t) => [t.id, t]));
const DAILY_MISSION_IDS = ['solve', 'firsttry', 'lesson'];
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
// the Monday of the current week, as a stable per-week key
function weekStr(d = new Date()) {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  t.setDate(t.getDate() - ((t.getDay() + 6) % 7));
  return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`;
}
function pickWeekly(weekKey) {
  // deterministically drop one template so the weekly set rotates
  const drop = hashStr(weekKey) % missionTemplates.length;
  return missionTemplates.filter((_, i) => i !== drop).map((t) => t.id);
}
export function ensureMissions() {
  const m = S.progress.missions || (S.progress.missions = {});
  const today = todayStr(), wk = weekStr();
  if (m.day !== today) { m.day = today; m.daily = {}; DAILY_MISSION_IDS.forEach((id) => { m.daily[id] = { n: 0, claimed: false }; }); }
  if (m.week !== wk) { m.week = wk; m.weeklyIds = pickWeekly(wk); m.weekly = {}; m.weeklyIds.forEach((id) => { m.weekly[id] = { n: 0, claimed: false }; }); }
  return m;
}
export function bumpMission(metric, n = 1) {
  const m = ensureMissions();
  let touched = false;
  const step = (ids, store, tier) => {
    for (const id of ids) {
      const t = MISSION_BY_ID[id], p = store[id];
      if (t && p && t.metric === metric && !p.claimed && p.n < t[tier].goal) { p.n = Math.min(t[tier].goal, p.n + n); touched = true; }
    }
  };
  step(DAILY_MISSION_IDS, m.daily, 'daily');
  step(m.weeklyIds || [], m.weekly, 'weekly');
  if (touched) persistSoon();
}
function buildMission(id, tier, store) {
  const t = MISSION_BY_ID[id], cfg = t[tier], p = store[id] || { n: 0, claimed: false };
  const unit = cfg.goal === 1 ? t.unit[0] : t.unit[1];
  return {
    id, tier, emoji: t.emoji, goal: cfg.goal, n: Math.min(p.n, cfg.goal), claimed: p.claimed,
    done: p.n >= cfg.goal, title: `${t.verb} ${cfg.goal} ${unit}`, coins: cfg.coins, treats: cfg.treats,
    pct: Math.round(Math.min(1, p.n / cfg.goal) * 100),
  };
}
export function listMissions() {
  const m = ensureMissions();
  return {
    daily: DAILY_MISSION_IDS.map((id) => buildMission(id, 'daily', m.daily)),
    weekly: (m.weeklyIds || []).map((id) => buildMission(id, 'weekly', m.weekly)),
  };
}
export function claimMission(tier, id) {
  const m = ensureMissions();
  const t = MISSION_BY_ID[id]; if (!t) return null;
  const cfg = t[tier], store = tier === 'daily' ? m.daily : m.weekly, p = store[id];
  if (!p || p.claimed || p.n < cfg.goal) return null;
  p.claimed = true;
  addCoins(cfg.coins); awardTreat(cfg.treats);
  S.progress.stats.missionsDone = (S.progress.stats.missionsDone || 0) + 1;
  persist();
  return { coins: cfg.coins, treats: cfg.treats, emoji: t.emoji };
}
export function claimableMissions() {
  const { daily, weekly } = listMissions();
  return [...daily, ...weekly].filter((x) => x.done && !x.claimed).length;
}

/* ---------- Quests (multi-step island adventures) ----------
   A quest is a CHAIN of steps; each step is an objective over an event the engine
   already emits (solve / master / boss / explore). Unlocked quests auto-progress
   as the learner plays — `bumpQuest(metric)` advances the current step of every
   active quest, grants the step's small reward + a cheer when it completes, and
   marks the quest ready-to-claim when the chain is done. The completion chest
   (coins + treats + a sticker, shown in the Collection) is claimed in the Quest
   Log. Pure state + central hooks, so every view feeds quests automatically. */
const QUEST_BY_ID = Object.fromEntries(questsData.map((q) => [q.id, q]));
function questUnlocked(q) {
  if (!q.unlock) return true;
  if (q.unlock.mastered) return (S.progress.stats.skillsMastered || 0) >= q.unlock.mastered;
  return true;
}
function questRec(id) {
  const log = S.progress.questlog || (S.progress.questlog = {});
  return log[id] || (log[id] = { step: 0, prog: 0, done: false, claimed: false, cheer: null });
}
// advance every active quest whose current step tracks this metric
export function bumpQuest(metric, n = 1) {
  let cheer = null, touched = false;
  for (const q of questsData) {
    if (!questUnlocked(q)) continue;
    const r = questRec(q.id);
    if (r.done) continue;
    const step = q.steps[r.step];
    if (!step || step.metric !== metric) continue;
    r.prog += n; touched = true;
    if (r.prog >= step.goal) {
      if (step.reward) { addCoins(step.reward.coins || 0); if (step.reward.treats) awardTreat(step.reward.treats); }
      cheer = step.cheer || 'Step complete!';
      r.cheer = cheer;
      r.step += 1; r.prog = 0;
      if (r.step >= q.steps.length) { r.done = true; }
    }
  }
  if (touched) persistSoon();
  return cheer; // a freshly-completed step's cheer (for a toast), or null
}
export function listQuests() {
  return questsData.map((q) => {
    const r = questRec(q.id);
    const unlocked = questUnlocked(q);
    const step = q.steps[Math.min(r.step, q.steps.length - 1)];
    const status = !unlocked ? 'locked' : r.claimed ? 'claimed' : r.done ? 'ready' : 'active';
    return {
      id: q.id, title: q.title, emoji: q.emoji, blurb: q.blurb,
      status, unlocked, stepIndex: r.step, stepCount: q.steps.length,
      chest: q.chest,
      lockText: q.unlock && q.unlock.mastered ? `Master ${q.unlock.mastered} skills to unlock` : '',
      current: r.done ? null : {
        label: step.label, n: Math.min(r.prog, step.goal), goal: step.goal,
        pct: Math.round(Math.min(1, r.prog / step.goal) * 100),
      },
      steps: q.steps.map((s, i) => ({ label: s.label, state: i < r.step ? 'done' : i === r.step && !r.done ? 'current' : 'todo' })),
    };
  });
}
export function claimQuest(id) {
  const q = QUEST_BY_ID[id]; if (!q) return null;
  const r = questRec(id);
  if (!r.done || r.claimed) return null;
  r.claimed = true;
  const chest = q.chest || {};
  addCoins(chest.coins || 0); if (chest.treats) awardTreat(chest.treats);
  if (chest.sticker) {
    const st = S.progress.world.stickers || (S.progress.world.stickers = []);
    if (!st.includes(chest.sticker)) st.push(chest.sticker);
  }
  S.progress.stats.questsDone = (S.progress.stats.questsDone || 0) + 1;
  persist();
  return { coins: chest.coins || 0, treats: chest.treats || 0, emoji: q.emoji, title: q.title };
}
export function claimableQuests() { return listQuests().filter((q) => q.status === 'ready').length; }

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
    case 'missionsDone': return (st.missionsDone || 0) >= t.count;
    case 'questsDone': return (st.questsDone || 0) >= t.count;
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
