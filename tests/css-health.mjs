// css-health.mjs — guards the design-system consolidation (Plan M6).
// Keeps the stylesheet from re-accreting duplicate reduced-motion guards or
// re-introducing radius literals that have a token. Pure text checks, no DOM.
import fs from 'fs';
const css = fs.readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const fails = [];

// 1) exactly ONE OS reduced-motion guard (was 3 inconsistent ones)
const rm = (css.match(/@media\s*\(prefers-reduced-motion:reduce\)/g) || []).length;
if (rm !== 1) fails.push(`expected exactly 1 prefers-reduced-motion guard, found ${rm}`);

// 2) the explicit calm-mode toggle rule still exists
if (!/body\.reduced-motion\s*\*\s*\{[^}]*animation\s*:\s*none/.test(css)) fails.push('missing the body.reduced-motion calm-mode rule');

// 3) the unified guard actually zeroes animations AND transitions (not just one)
const guard = css.match(/@media\s*\(prefers-reduced-motion:reduce\)\s*\{[^}]*\{([^}]*)\}/);
if (!guard || !/animation-duration/.test(guard[1]) || !/transition-duration/.test(guard[1])) {
  fails.push('the reduced-motion guard must zero BOTH animation-duration and transition-duration');
}

// 4) radius literals that have an exact token should use the token (mid cards = --radius-md:18px)
const stray18 = (css.match(/border-radius:\s*18px/g) || []).length;
if (stray18) fails.push(`${stray18} "border-radius:18px" literal(s) — use var(--radius-md)`);

if (fails.length) {
  console.log('❌ CSS-HEALTH FAILED:');
  fails.forEach((f) => console.log('  - ' + f));
  process.exit(1);
}
console.log('✅ CSS-HEALTH PASSED — one reduced-motion guard, calm mode intact, radius tokens adopted.');
process.exit(0);
