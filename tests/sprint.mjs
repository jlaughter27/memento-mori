// Exercises the Math Sprint mini-game: start -> countdown -> solve -> score + best.
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
const q = (s) => window.document.querySelector(s); const qa = (s) => [...window.document.querySelectorAll(s)];
const click = (el) => el && el.dispatchEvent(new window.Event('click', { bubbles: true }));
const hashTo = (h) => { window.location.hash = h; window.dispatchEvent(new window.Event('hashchange')); };
function solve(text) { const m = text.match(/(-?\d[\d,]*)\s*([×+−])\s*(-?\d[\d,]*)/); if (!m) return null; const a = +m[1].replace(/,/g, ''), b = +m[3].replace(/,/g, ''); return m[2] === '×' ? a * b : m[2] === '+' ? a + b : a - b; }
let step = 'init';
try {
  await import('../js/app.js'); await wait(60);
  q('#ob-name').value = 'Zed'; click(q('#ob-next')); await wait(40); click(qa('.grade-choice')[0]); await wait(20); click(q('#ob-start')); await wait(750);

  step = 'sprint start + countdown';
  if (!q('#sprint-btn')) throw new Error('sprint card missing on home');
  hashTo('#/sprint'); await wait(40);
  if (!q('#sprint-start')) throw new Error('sprint start screen missing');
  click(q('#sprint-start'));
  await wait(3100); // 3-2-1-GO countdown (~2.8s)
  if (!q('.sprint-game') || !q('#s-prob').textContent) throw new Error('sprint play did not start');

  step = 'solve a few';
  let scored = 0;
  for (let i = 0; i < 4; i++) {
    const ans = solve(q('#s-prob').textContent);
    if (ans == null || ans < 0) { break; }
    for (const ch of String(ans)) { click(qa('#s-pad .key').find((b) => b.textContent === ch)); await wait(10); }
    await wait(30);
    scored = +q('#s-score').textContent;
  }
  if (scored < 1) throw new Error('solving did not increase the score');
  const { S } = await import('../js/state.js');
  console.log('  • sprint: solved ' + scored + ' problem(s), score live');

  step = 'timer self-clears on navigation';
  hashTo('#/'); await wait(1300); // > 1 tick: timer should bail, not hijack the view
  if (!q('.home-hero')) throw new Error('navigated away from sprint but home did not render');
  if (q('.sprint-final') || q('.sprint-game')) throw new Error('sprint timer hijacked the view after navigation');
  console.log('  • sprint timer stops cleanly when you leave mid-game');

} catch (e) {
  console.log('\n❌ SPRINT FAILED at [' + step + ']:', e.message);
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  process.exit(1);
}
if (errors.length) { console.log('\n⚠️ runtime errors:', errors.slice(0, 5).join(' | ')); process.exit(1); }
console.log('\n✅ SPRINT PASSED — Math Sprint mini-game runs and scores.');
process.exit(0);
