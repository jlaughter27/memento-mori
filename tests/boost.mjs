// Just-in-time Boost (Plan M5): unproductive struggle (consecutive misses) detours
// to a prerequisite skill for a couple of supporting problems, then returns.
import { makeBoost } from '../js/engine/boost.js';
const main = { id: 'main', title: 'Main Skill' };
const pre = { id: 'pre', title: 'Prereq Skill' };
let failed = null;
const ok = (c, m) => { if (!c && !failed) failed = m; };

try {
  // PRODUCTIVE struggle (a miss then a first-try correct) does NOT trigger a boost
  let b = makeBoost(main, pre);
  ok(b.record(false) === null, 'one miss should not boost');
  ok(b.record(true) === null, 'a recovery should reset the streak');
  ok(b.record(false) === null, 'a single later miss should still not boost');
  ok(b.next().boosting === false, 'no boost after productive struggle');
  console.log('  • productive struggle (miss → recover) does NOT detour');

  // UNPRODUCTIVE struggle: two misses in a row → detour to the prerequisite
  b = makeBoost(main, pre);
  ok(b.record(false) === null, 'first miss: no boost yet');
  ok(b.record(false) === 'boost-start', 'second consecutive miss should start a boost');
  let n1 = b.next(); ok(n1.boosting && n1.skill.id === 'pre', 'boost problem 1 should be the prerequisite');
  let n2 = b.next(); ok(n2.boosting && n2.skill.id === 'pre' && n2.last, 'boost problem 2 should be the last prereq problem');
  let n3 = b.next(); ok(!n3.boosting && n3.skill.id === 'main', 'after the boost, returns to the main skill');
  console.log('  • 2 consecutive misses → 2 prerequisite problems → return to grade level');

  // mid-boost misses don't re-trigger / stack endlessly
  b = makeBoost(main, pre);
  b.record(false); b.record(false); // boost started (queue=2)
  ok(b.record(false) === null, 'a miss during the boost must not re-trigger another boost');
  console.log('  • a miss during the boost does not stack another detour');

  // with NO prerequisite, it never boosts (graceful)
  b = makeBoost(main, null);
  ok(b.record(false) === null && b.record(false) === null, 'no prereq → never boosts');
  ok(b.next().skill.id === 'main', 'no prereq → always the main skill');
  console.log('  • a skill with no prerequisite never detours (graceful)');
} catch (e) { failed = e.message; }

if (failed) { console.log('\n❌ BOOST FAILED:', failed); process.exit(1); }
console.log('\n✅ BOOST PASSED — unproductive struggle detours to a prerequisite, then returns.');
process.exit(0);
