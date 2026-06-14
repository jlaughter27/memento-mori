// tools/fuzz-skills.mjs — fuzz the integration layer: nextProblem() over every
// real skill (and word problems) across difficulties + many seeds.
import { makeRng } from '../js/engine/rng.js';
import { nextProblem, wordProblem } from '../js/engine/index.js';
import { ALL_SKILLS } from '../js/curriculum/index.js';

const REPS = Number(process.argv[2] || 40);
const fails = [];
const BAD = /\bNaN\b|\bundefined\b|\bInfinity\b|\[object Object\]/;
const add = (sk, msg, p) => fails.push(`${sk}: ${msg}  ⟦prompt="${p && p.prompt}" answer="${p && p.answer}"⟧`);

let total = 0;
for (const skill of ALL_SKILLS) {
  for (let d = -2; d <= 2; d++) {
    for (let i = 0; i < REPS; i++) {
      total++;
      let p;
      try { p = nextProblem(skill, d); }
      catch (e) { fails.push(`${skill.id} (diff ${d}): nextProblem threw — ${e.message}`); continue; }
      if (!p) { fails.push(`${skill.id}: nextProblem returned ${p}`); continue; }
      if (!p.prompt || String(p.prompt).trim() === '') add(skill.id, 'empty prompt', p);
      if (p.answer == null || String(p.answer).trim() === '') add(skill.id, 'empty answer', p);
      if (typeof p.check !== 'function') { add(skill.id, 'no check()', p); continue; }
      if (BAD.test(String(p.prompt))) add(skill.id, 'garbage in prompt', p);
      if (BAD.test(String(p.answer))) add(skill.id, 'garbage in answer', p);
      let ok = false; try { ok = !!p.check(p.answer); } catch (e) { add(skill.id, 'check threw: ' + e.message, p); }
      if (!ok) add(skill.id, 'check rejects its own answer', p);
      if (p.inputKind === 'choice') {
        const ch = (p.choices || []).map(String);
        if (!ch.includes(String(p.answer))) add(skill.id, 'answer not among choices [' + ch.join(', ') + ']', p);
        if (new Set(ch).size !== ch.length) add(skill.id, 'dup choices [' + ch.join(', ') + ']', p);
      }
    }
  }
}
// a batch of standalone word problems too
for (let i = 0; i < 2000; i++) {
  total++;
  let p; try { p = wordProblem({ skill: ['add','sub','mult','div'][i % 4], grade: 3 + (i % 5) }); }
  catch (e) { fails.push(`wordProblem threw — ${e.message}`); continue; }
  if (BAD.test(String(p.prompt))) add('wordProblem', 'garbage in prompt', p);
  if (!p.check || !p.check(p.answer)) add('wordProblem', 'check rejects own answer', p);
}

console.log(`Skills fuzz: ${total} problems across ${ALL_SKILLS.length} skills × 5 difficulties + word problems.`);
if (fails.length) {
  const uniq = [...new Set(fails)];
  console.error(`\n❌ ${fails.length} failures (${uniq.length} unique):`);
  uniq.slice(0, 40).forEach((f) => console.error('   • ' + f));
  process.exit(1);
}
console.log('✅ SKILLS FUZZ PASSED — every skill generates valid, self-consistent problems at all difficulties.');
process.exit(0);
