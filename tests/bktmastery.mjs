// Probabilistic mastery (Plan M4): a per-skill BKT p(known) that can go DOWN,
// gates real mastery (a struggling run doesn't master), and a Challenge Zone ≥90%.
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
const gm = await import('../js/gamification.js');
const { S } = await import('../js/state.js');

const SKILL = 'g3-place-value-100s';
let failed = null;
const ok = (cond, msg) => { if (!cond && !failed) failed = msg; };

try {
  // fresh skill starts at the BKT prior (0.25), zone "learning"
  ok(Math.abs(gm.knownProb(SKILL) - 0.25) < 1e-9, 'fresh p(known) should be the 0.25 prior');
  ok(gm.masteryMeter(SKILL).zone === 'learning', 'fresh skill should be in the learning zone');
  console.log(`  • fresh: p(known)=${gm.knownProb(SKILL).toFixed(2)}, zone=${gm.masteryMeter(SKILL).zone}`);

  // a STRUGGLING run: first response wrong on every problem, then corrected
  for (let i = 0; i < 6; i++) {
    gm.recordAnswer(SKILL, false, false, true); // first response wrong (BKT evidence)
    gm.recordAnswer(SKILL, true, false, false); // later correct, not first try (no evidence)
  }
  const pStruggle = gm.knownProb(SKILL);
  ok(pStruggle < 0.9, `struggling run should keep p(known) low, got ${pStruggle.toFixed(2)}`);
  const res = gm.masterSkill(SKILL, 0.5);
  ok(res.almost === true, 'a struggling run must NOT grant mastery (almost=true expected)');
  ok(!(S.progress.skills[SKILL] && S.progress.skills[SKILL].mastered), 'skill must not be mastered after a struggling run');
  console.log(`  • struggling run: p(known)=${pStruggle.toFixed(2)} → masterSkill returns "almost", not mastered`);

  // p(known) RISES with first-try corrects, and crosses into the Challenge Zone (≥90%)
  for (let i = 0; i < 6; i++) gm.recordAnswer(SKILL, true, true); // first-try correct = positive evidence
  const pStrong = gm.knownProb(SKILL);
  ok(pStrong >= 0.9, `first-try corrects should lift p(known) ≥0.9, got ${pStrong.toFixed(2)}`);
  ok(gm.masteryMeter(SKILL).zone === 'challenge', 'a ≥90% not-yet-mastered skill should be in the Challenge Zone');
  console.log(`  • strong run: p(known)=${pStrong.toFixed(2)} → Challenge Zone (gate before mastery)`);

  // p(known) can FALL: on a mid-range skill, a fresh first-response miss clearly lowers it
  const MID = 'g3-rounding';
  gm.recordAnswer(MID, true, true); // lift it off the prior to a mid value
  const before = gm.knownProb(MID);
  gm.recordAnswer(MID, false, false, true); // a miss
  ok(gm.knownProb(MID) < before - 0.05, `p(known) must drop meaningfully after a miss (${before.toFixed(2)}→${gm.knownProb(MID).toFixed(2)})`);
  console.log(`  • p(known) fell ${before.toFixed(2)} → ${gm.knownProb(MID).toFixed(2)} after a miss (it can go down)`);

  // lift it back over the line, then mastery is granted → zone "mastered"
  for (let i = 0; i < 4; i++) gm.recordAnswer(SKILL, true, true);
  const res2 = gm.masterSkill(SKILL, 0.95);
  ok(res2.almost === false && res2.firstTime === true, 'a solid skill should now master for real');
  ok(gm.masteryMeter(SKILL).zone === 'mastered', 'a mastered skill should read the mastered zone');
  console.log(`  • once truly known, masterSkill grants mastery → zone=${gm.masteryMeter(SKILL).zone}`);
} catch (e) { failed = e.message; }

if (failed) { console.log('\n❌ BKT-MASTERY FAILED:', failed); process.exit(1); }
console.log('\n✅ BKT-MASTERY PASSED — mastery reflects real, falling-capable knowledge + a Challenge Zone.');
process.exit(0);
