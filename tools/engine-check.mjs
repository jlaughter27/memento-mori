// tools/engine-check.mjs — property test: every generated problem's own
// check() must accept its own canonical answer. Run with `npm run engine:check`.
import { makeRng } from '../js/engine/rng.js';
import { TYPES, generateProblem } from '../js/engine/problemTypes.js';

const PER_TYPE = Number(process.argv[2] || 60);
const rng = makeRng(0);
let total = 0;
const failures = [];

for (const type of Object.keys(TYPES)) {
  for (let i = 0; i < PER_TYPE; i++) {
    const p = generateProblem(type, {}, rng);
    total++;
    if (!p.check(p.answer)) failures.push({ type, prompt: p.prompt, answer: p.answer });
    if (!p.steps || !p.steps.length) failures.push({ type, prompt: p.prompt, answer: '(no steps)' });
  }
}

console.log(`Engine self-check: ${total} problems across ${Object.keys(TYPES).length} types.`);
if (failures.length) {
  console.error(`❌ ${failures.length} failures:`);
  failures.slice(0, 25).forEach((f) => console.error(`  - ${f.type}: "${f.prompt}" expected ${f.answer}`));
  process.exit(1);
}
console.log('✅ All problems pass their own solver/answer check.');
process.exit(0);
