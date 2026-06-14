// tests/a11y.mjs — enforces invariant #7: every interactive control on every
// screen must have an accessible name, and no positive tabindex (focus-order
// anti-pattern). Catches "added an icon button with no aria-label" before ship.
import { JSDOM } from 'jsdom';
import fs from 'fs';
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', pretendToBeVisual: true, runScripts: 'outside-only' });
const { window } = dom; const g = window;
g.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0); g.cancelAnimationFrame = (id) => clearTimeout(id);
g.matchMedia = () => ({ matches: false, addEventListener() {} }); g.devicePixelRatio = 1; g.scrollTo = () => {}; g.print = () => {};
g.AudioContext = class { constructor(){this.currentTime=0;this.destination={};this.state='running';} resume(){} createOscillator(){return{frequency:{setValueAtTime(){}},connect(){},start(){},stop(){}};} createGain(){return{gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};} };
g.SpeechSynthesisUtterance = class {}; g.speechSynthesis = { cancel(){}, speak(){} };
window.HTMLCanvasElement.prototype.getContext = () => ({ scale(){}, clearRect(){}, save(){}, restore(){}, translate(){}, rotate(){}, fillRect(){}, set fillStyle(v){}, set globalAlpha(v){}, beginPath(){}, arc(){}, fill(){} });
globalThis.window = window; globalThis.document = window.document; globalThis.location = window.location; globalThis.localStorage = window.localStorage;
globalThis.HTMLCanvasElement = window.HTMLCanvasElement; globalThis.requestAnimationFrame = g.requestAnimationFrame; globalThis.cancelAnimationFrame = g.cancelAnimationFrame;
globalThis.innerWidth = 390; globalThis.innerHeight = 844; globalThis.AudioContext = g.AudioContext; globalThis.speechSynthesis = g.speechSynthesis; globalThis.SpeechSynthesisUtterance = g.SpeechSynthesisUtterance; globalThis.confirm = () => true; globalThis.print = g.print;
const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));
const q = (s) => window.document.querySelector(s); const qa = (s) => [...window.document.querySelectorAll(s)];
const click = (el) => el && el.dispatchEvent(new window.Event('click', { bubbles: true }));

function accName(el) {
  const aria = el.getAttribute('aria-label'); if (aria && aria.trim()) return aria.trim();
  const lb = el.getAttribute('aria-labelledby'); if (lb) { const t = window.document.getElementById(lb); if (t && t.textContent.trim()) return t.textContent.trim(); }
  const txt = (el.textContent || '').trim(); if (txt) return txt;
  const title = el.getAttribute('title'); if (title && title.trim()) return title.trim();
  if (el.tagName === 'INPUT') {
    if (el.id) { const l = window.document.querySelector(`label[for="${el.id}"]`); if (l && l.textContent.trim()) return l.textContent.trim(); }
    let p = el.parentElement; while (p) { if (p.tagName === 'LABEL' && p.textContent.trim()) return p.textContent.trim(); p = p.parentElement; }
    if (el.getAttribute('placeholder')) return el.getAttribute('placeholder');
  }
  return '';
}

let step = 'init';
const problems = [];
try {
  await import('../js/app.js'); await wait(80);
  const { S } = await import('../js/state.js');
  q('#ob-name').value = 'A11y'; click(q('#ob-next')); await wait(40);
  click(qa('.grade-choice')[0]); await wait(20); click(q('#ob-start')); await wait(800);
  const sk = qa('.skill-card')[0]?.dataset?.id || 'g4-place-value';

  const routes = ['#/onboard', '#/', `#/learn/${sk}`, `#/tutor/${sk}`, `#/practice/${sk}`,
    '#/practice/g3-fractions-shade', '#/practice/g3-build-number', '#/play',
    '#/sprint', '#/magnitude', '#/sort', '#/rewards', '#/pet', '#/adventure', '#/parent', '#/report', '#/worksheet', '#/curriculum'];

  for (const r of routes) {
    step = r;
    if (r === '#/onboard') S.onboarded = false;
    window.location.hash = r; window.dispatchEvent(new window.Event('hashchange')); await wait(70);
    if (r === '#/onboard') S.onboarded = true;
    const controls = qa('button, a[href], input, select, [role="button"], [tabindex]:not([tabindex="-1"])');
    for (const el of controls) {
      if (el.disabled || el.type === 'hidden') continue;
      if (!accName(el)) {
        const sig = `${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''}${el.id ? '#' + el.id : ''}`;
        problems.push(`${r} → unnamed control: ${sig}`);
      }
      const ti = el.getAttribute('tabindex');
      if (ti && Number(ti) > 0) problems.push(`${r} → positive tabindex (${ti}) on ${el.tagName.toLowerCase()}`);
    }
  }
} catch (e) {
  console.log('\n❌ A11Y FAILED at [' + step + ']:', e.message);
  process.exit(1);
}

const uniq = [...new Set(problems)];
console.log(`A11y check: scanned interactive controls across 16 routes.`);
if (uniq.length) {
  console.error(`\n❌ ${uniq.length} accessibility issues:`);
  uniq.slice(0, 40).forEach((p) => console.error('   • ' + p));
  process.exit(1);
}
console.log('✅ A11Y PASSED — every control has an accessible name; no positive tabindex.');
process.exit(0);
