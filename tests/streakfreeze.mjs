// Streak-freeze (Plan M7): an earned freeze saves a missed day that would
// otherwise break the streak; milestones earn freezes (capped).
const store = new Map();
globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
const gm = await import('../js/gamification.js');
const { S } = await import('../js/state.js');

const dayStr = (offset) => { const d = new Date(); d.setDate(d.getDate() + offset); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
let failed = null;
const ok = (c, m) => { if (!c && !failed) failed = m; };

try {
  // 1) a 3-day gap (beyond the grace day) WITH a freeze → streak saved + freeze spent
  S.progress.streak = { count: 9, lastActiveDate: dayStr(-3), graceUsed: true, freezes: 1 };
  let r = gm.updateStreakOnOpen();
  ok(r.frozen === true, 'a missed day with a freeze should report frozen=true');
  ok(S.progress.streak.count >= 9, `streak should be preserved (not reset), got ${S.progress.streak.count}`);
  ok(S.progress.streak.freezes === 0, 'the freeze should be spent');
  console.log(`  • 3-day gap + 1 freeze → streak saved at ${S.progress.streak.count}, freeze spent`);

  // 2) the SAME gap with NO freeze → streak resets to 1
  S.progress.streak = { count: 9, lastActiveDate: dayStr(-3), graceUsed: true, freezes: 0 };
  r = gm.updateStreakOnOpen();
  ok(r.frozen === false, 'no freeze → not frozen');
  ok(S.progress.streak.count === 1, `without a freeze the streak should reset to 1, got ${S.progress.streak.count}`);
  console.log('  • same gap, no freeze → streak resets to 1 (loss aversion intact)');

  // 3) hitting a streak milestone EARNS a freeze (capped)
  S.progress.streak = { count: 6, lastActiveDate: dayStr(-1), graceUsed: false, freezes: 0 }; // tomorrow = day 7 (a milestone)
  r = gm.updateStreakOnOpen();
  ok(r.milestone === 7, `crossing day 7 should be a milestone, got ${r.milestone}`);
  ok(S.progress.streak.freezes === 1, `a milestone should earn a freeze, got ${S.progress.streak.freezes}`);
  console.log(`  • reaching a ${r.milestone}-day milestone earned a freeze (now ${S.progress.streak.freezes})`);

  // 4) freezes are capped (never runaway)
  S.progress.streak = { count: 13, lastActiveDate: dayStr(-1), graceUsed: false, freezes: 3 }; // → 14 (milestone), but capped
  r = gm.updateStreakOnOpen();
  ok(S.progress.streak.freezes <= 3, `freezes must be capped, got ${S.progress.streak.freezes}`);
  console.log(`  • freezes capped at ${S.progress.streak.freezes} (no runaway)`);
} catch (e) { failed = e.message; }

if (failed) { console.log('\n❌ STREAK-FREEZE FAILED:', failed); process.exit(1); }
console.log('\n✅ STREAK-FREEZE PASSED — a freeze saves a missed day; milestones earn them (capped).');
process.exit(0);
