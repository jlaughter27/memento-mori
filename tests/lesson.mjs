// Concrete→Pictorial→Abstract lesson + interactive "Now you try!" (Plan M3):
// the lesson walks staged cards and ends with a low-stakes check that accepts a
// correct answer.
import { JSDOM } from 'jsdom';
import fs from 'fs';
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', pretendToBeVisual: true, runScripts: 'outside-only' });
const { window } = dom; const g = window;
g.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0); g.cancelAnimationFrame = (id) => clearTimeout(id);
g.matchMedia = () => ({ matches: false, addEventListener() {} }); g.devicePixelRatio = 1; g.scrollTo = () => {};
g.AudioContext = class { constructor(){this.currentTime=0;this.destination={};this.state='running';} resume(){} createOscillator(){return{frequency:{setValueAtTime(){}},connect(){},start(){},stop(){}};} createGain(){return{gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};} };
g.SpeechSynthesisUtterance = class {}; g.speechSynthesis = { cancel(){}, speak(){} };
window.HTMLCanvasElement.prototype.getContext = () => ({ scale(){}, clearRect(){}, save(){}, restore(){}, translate(){}, rotate(){}, fillRect(){}, beginPath(){}, arc(){}, fill(){} });
globalThis.window = window; globalThis.document = window.document; globalThis.location = window.location; globalThis.localStorage = window.localStorage;
globalThis.HTMLCanvasElement = window.HTMLCanvasElement; globalThis.requestAnimationFrame = g.requestAnimationFrame; globalThis.cancelAnimationFrame = g.cancelAnimationFrame;
globalThis.innerWidth = 1024; globalThis.innerHeight = 768; globalThis.AudioContext = g.AudioContext; globalThis.speechSynthesis = g.speechSynthesis; globalThis.SpeechSynthesisUtterance = g.SpeechSynthesisUtterance;
const errors = [];
window.addEventListener('error', (e) => errors.push(e.error?.message || e.message));
const wait = (ms = 30) => new Promise((r) => setTimeout(r, ms));
const q = (s) => window.document.querySelector(s);
const qa = (s) => [...window.document.querySelectorAll(s)];
const click = (el) => el && el.dispatchEvent(new window.Event('click', { bubbles: true }));

try {
  await import('../js/app.js'); await wait(60);
  q('#ob-name').value = 'Cee'; click(q('#ob-next')); await wait(40); click(qa('.grade-choice')[0]); await wait(20); click(q('#ob-start')); await wait(750);

  window.location.hash = '#/learn/g3-place-value-100s'; await wait(150);
  if (!q('.lesson-wrap')) throw new Error('lesson did not render');

  // walk Next, collecting the CPA stage tags, until we reach the interactive "you try"
  const seen = new Set();
  let guard = 0;
  while (!q('#lt-ans') && guard++ < 14) {
    qa('.cpa-tag').forEach((t) => seen.add(t.textContent.trim()));
    click(q('#lesson-next')); await wait(40);
  }
  qa('.cpa-tag').forEach((t) => seen.add(t.textContent.trim()));
  const tags = [...seen].join(' | ');
  if (!q('#lt-ans')) throw new Error('never reached the "Now you try!" card');
  const hasConcrete = /See it/i.test(tags);
  const hasWork = /Work it|Write it/i.test(tags);
  const hasTry = /Now you try/i.test(tags);
  if (!(hasConcrete && hasWork && hasTry)) throw new Error('missing CPA stages — saw: ' + tags);
  console.log('  • lesson walks staged cards: ' + tags);

  // wrong answer reveals the answer (no penalty); read it, then a correct answer is accepted
  q('#lt-ans').value = '0.000001'; click(q('#lt-check')); await wait(20);
  const reveal = q('#lt-fb .lt-soft b');
  if (!reveal) throw new Error('a wrong "you try" answer should gently reveal the answer');
  const ans = reveal.textContent.trim();
  q('#lt-ans').value = ans; click(q('#lt-check')); await wait(20);
  if (!q('#lt-fb .lt-good')) throw new Error('a correct "you try" answer should be celebrated');
  console.log(`  • "Now you try!" reveals the answer when wrong (${ans}) and celebrates when right ✅`);
} catch (e) {
  console.log('\n❌ LESSON FAILED:', e.message);
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  process.exit(1);
}
if (errors.length) { console.log('\n⚠️ runtime errors:', errors.slice(0, 5).join(' | ')); process.exit(1); }
console.log('\n✅ LESSON PASSED — C→P→A staged lesson with a working "Now you try!" check.');
process.exit(0);
