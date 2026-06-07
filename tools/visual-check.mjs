// tools/visual-check.mjs — render EVERY curriculum `visual:` descriptor and fail
// if it produces empty/garbage output. renderVisual() swallows errors and returns
// '', so a broken descriptor (e.g. the denom/den mismatch) fails silently in the
// app — this surfaces it. Run via `npm run fuzz`.
import { renderVisual } from '../js/ui/manipulatives.js';
import { ALL_SKILLS } from '../js/curriculum/index.js';

const visuals = [];
function walk(o) {
  if (!o || typeof o !== 'object') return;
  if (Array.isArray(o)) { o.forEach(walk); return; }
  for (const [k, v] of Object.entries(o)) {
    if (k === 'visual' && v && typeof v === 'object' && v.type) visuals.push(v);
    walk(v);
  }
}
ALL_SKILLS.forEach(walk);

const fails = [];
for (const v of visuals) {
  let html = '';
  try { html = renderVisual(v); } catch (e) { fails.push(`threw (${e.message}) on ${JSON.stringify(v)}`); continue; }
  const d = JSON.stringify(v).slice(0, 90);
  if (!html) fails.push(`renders EMPTY: ${d}`);
  else if (/undefined|NaN|Infinity/.test(html)) fails.push(`garbage token in SVG: ${d}`);
  else if (!/^<svg|<svg /.test(html)) fails.push(`not an <svg>: ${d}`);
}

console.log(`Visual check: rendered ${visuals.length} curriculum visual descriptors.`);
if (fails.length) {
  const uniq = [...new Set(fails)];
  console.error(`\n❌ ${fails.length} broken visuals (${uniq.length} unique):`);
  uniq.slice(0, 40).forEach((f) => console.error('   • ' + f));
  process.exit(1);
}
console.log('✅ VISUAL CHECK PASSED — every curriculum diagram renders real SVG (no silent-empty).');
process.exit(0);
