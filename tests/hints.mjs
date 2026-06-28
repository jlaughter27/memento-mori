// Tiered hints + bottom-out: hints reveal in order (nudge→strategy→near-solution),
// then a bottom-out walks the full solution after a pause, flags Fix-It, never auto-fills.
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
const bubble = () => (q('#prac-mascot .mascot-bubble') || q('.mascot-bubble') || {}).textContent || '';

const SKILL = 'g3-place-value-100s';
try {
  await import('../js/app.js'); await wait(60);
  q('#ob-name').value = 'Sol'; click(q('#ob-next')); await wait(40); click(qa('.grade-choice')[0]); await wait(20); click(q('#ob-start')); await wait(750);
  const { S } = await import('../js/state.js');

  window.location.hash = `#/practice/${SKILL}`; await wait(200);
  if (!q('.practice-wrap')) throw new Error('practice did not start');
  const hintBtn = q('#hint-btn');

  // first tap → "Hint 1 of N"; capture N
  click(hintBtn); await wait(20);
  let m = bubble().match(/Hint (\d+) of (\d+)/);
  if (!m || m[1] !== '1') throw new Error('first hint should be "Hint 1 of N", got: ' + bubble());
  const N = Number(m[2]);
  if (N < 2) throw new Error('expected a multi-tier hint ladder, got N=' + N);
  console.log(`  • hint ladder has ${N} tiers; first tap = "Hint 1 of ${N}"`);

  // reveal the rest of the ladder in order; no solution, no Fix-It flag yet
  for (let i = 2; i <= N; i++) {
    click(hintBtn); await wait(20);
    m = bubble().match(/Hint (\d+) of (\d+)/);
    if (!m || Number(m[1]) !== i) throw new Error(`expected "Hint ${i} of ${N}", got: ` + bubble());
  }
  if (q('.sol-answer')) throw new Error('the worked answer should NOT show just from tiered hints');
  if (S.progress.mistakes[SKILL]) throw new Error('Fix-It should not be flagged before bottom-out');
  console.log(`  • tiers reveal in order (1→${N}); no answer shown, no Fix-It flag yet`);

  // bottom-out: next tap walks the whole solution (after a read-speed pause) + flags Fix-It
  click(hintBtn); await wait(40);
  if (!/whole thing/i.test(bubble())) throw new Error('bottom-out should announce a full walk-through, got: ' + bubble());
  if (!S.progress.mistakes[SKILL]) throw new Error('bottom-out must flag the skill for Fix-It');
  if (q('.sol-answer')) throw new Error('the walk-through must wait a read-speed pause, not reveal instantly');
  await wait(2000); // past the 1800ms pause
  if (!q('.sol-answer')) throw new Error('bottom-out did not reveal the full solution after the pause');
  console.log('  • bottom-out: walks the full solution after a pause + flags Fix-It');

  // never auto-fills: the answer input is still empty — the child still types it
  const disp = q('#ans-display');
  if (disp && disp.dataset.empty !== '1') throw new Error('bottom-out must NOT auto-fill the answer');
  console.log('  • the answer is shown in the steps but never auto-filled into the input');

  // "Show me how" remains a separate, explicit path to the full solution
  if (!q('#show-btn')) throw new Error('the separate "Show me how" button is missing');
  console.log('  • the full worked solution stays a separate, explicit choice (Show me how)');
} catch (e) {
  console.log('\n❌ HINTS FAILED:', e.message);
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  process.exit(1);
}
if (errors.length) { console.log('\n⚠️ runtime errors:', errors.slice(0, 5).join(' | ')); process.exit(1); }
console.log('\n✅ HINTS PASSED — tiered ladder, then a bottom-out that never auto-fills.');
process.exit(0);
