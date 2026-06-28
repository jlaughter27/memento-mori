// tools/engine-check.mjs — property test: every generated problem's own check()
// must accept its own canonical answer, AND every problem type must carry verified
// misconception feedback — each misconception fires on its own classic-wrong `sample`,
// that sample is genuinely wrong, and matchMisconception surfaces its message.
// Run with `npm run engine:check`.
import { makeRng } from '../js/engine/rng.js';
import { TYPES, generateProblem, matchMisconception } from '../js/engine/problemTypes.js';

const PER_TYPE = Number(process.argv[2] || 60);
const rng = makeRng(0);
let total = 0, misTotal = 0;
const failures = [];
const misPerType = {};

// Types with no meaningful single "wrong answer" pattern to teach to (justify each).
const EXEMPT = new Set([]);

for (const type of Object.keys(TYPES)) {
  misPerType[type] = 0;
  for (let i = 0; i < PER_TYPE; i++) {
    const p = generateProblem(type, {}, rng);
    total++;
    if (!p.check(p.answer)) failures.push({ type, prompt: p.prompt, answer: p.answer });
    if (!p.steps || !p.steps.length) failures.push({ type, prompt: p.prompt, answer: '(no steps)' });
    for (const m of p.misconceptions || []) {
      if (m.sample === undefined) continue; // legacy/unsampled detectors don't count toward coverage
      misTotal++; misPerType[type]++;
      if (!m.test(m.sample)) failures.push({ type, prompt: p.prompt, answer: `(misconception misses its own sample "${m.sample}")` });
      if (p.check(m.sample)) failures.push({ type, prompt: p.prompt, answer: `(misconception sample "${m.sample}" is actually CORRECT)` });
      if (matchMisconception(p, m.sample) === null) failures.push({ type, prompt: p.prompt, answer: `(matchMisconception doesn't fire for "${m.sample}")` });
    }
  }
}
// every non-exempt type must teach to at least one classic error
for (const t of Object.keys(TYPES)) {
  if (!EXEMPT.has(t) && misPerType[t] === 0) failures.push({ type: t, prompt: '(coverage)', answer: 'no verified misconception fired across any generated instance' });
}

console.log(`Engine self-check: ${total} problems across ${Object.keys(TYPES).length} types · ${misTotal} misconception patterns verified.`);
if (failures.length) {
  console.error(`❌ ${failures.length} failures:`);
  failures.slice(0, 25).forEach((f) => console.error(`  - ${f.type}: "${f.prompt}" expected ${f.answer}`));
  process.exit(1);
}
console.log('✅ All problems pass their own solver/answer check, and every type has verified error-specific feedback.');
process.exit(0);
