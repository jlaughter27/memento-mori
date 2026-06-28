// engine/boost.js — just-in-time "Boost" (Zearn-style).
// Distinguishes PRODUCTIVE struggle (a miss that's then corrected — fine) from
// UNPRODUCTIVE struggle (consecutive missed problems). On unproductive struggle it
// detours to an easier PREREQUISITE skill for a couple of supporting problems, then
// returns to grade-level — without lowering the ceiling.
export function makeBoost(skill, prereq, { threshold = 2, length = 2 } = {}) {
  let missStreak = 0, queue = 0;
  return {
    // record a finished problem (firstTryCorrect = solved with no wrong tries).
    // returns 'boost-start' the moment a detour begins, else null.
    record(firstTryCorrect) {
      if (queue > 0) return null;            // mid-boost: don't re-trigger
      if (firstTryCorrect) { missStreak = 0; return null; } // productive — reset
      missStreak++;
      if (missStreak >= threshold && prereq) { queue = length; missStreak = 0; return 'boost-start'; }
      return null;
    },
    // pick the skill for the next problem: prereq while boosting, else the main skill
    next() {
      if (queue > 0) { queue--; return { skill: prereq, boosting: true, last: queue === 0 }; }
      return { skill, boosting: false, last: false };
    },
    get boosting() { return queue > 0; },
  };
}
