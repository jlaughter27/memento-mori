// "Help the character" (Plan M10): a helper NPC poses a themed WORD problem
// (a little story) instead of bare arithmetic, and it still checks correctly.
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
const wordCount = (s) => (s.match(/[A-Za-z]{3,}/g) || []).length;

try {
  await import('../js/app.js'); await wait(60);
  q('#ob-name').value = 'Mae'; click(q('#ob-next')); await wait(40); click(qa('.grade-choice')[0]); await wait(20); click(q('#ob-start')); await wait(750);
  const { openEncounter } = await import('../js/game/encounter.js');

  // helper encounter → a word problem (story) with the "Can you help?" framing
  let host = window.document.createElement('div'); window.document.body.appendChild(host);
  openEncounter({ host, strand: 'Addition & Subtraction', teach: 'never', wordProblem: true, npcEmoji: '🦫', title: 'Help Builder Beaver' });
  await wait(60);
  const tag = (q('.enc-tag') || {}).textContent || '';
  const wpPrompt = (q('.enc-prompt') || {}).textContent || '';
  if (!q('.enc-card')) throw new Error('helper encounter did not open');
  if (!/help/i.test(tag)) throw new Error('helper encounter should show a "Can you help?" tag, got: ' + tag);
  if (wordCount(wpPrompt) < 4) throw new Error('helper prompt should be a word problem (a story), got: ' + wpPrompt);
  console.log(`  • helper NPC poses a story (${wordCount(wpPrompt)} words): "${wpPrompt.slice(0, 60)}…"`);
  qa('.enc-close').forEach(click); await wait(20); qa('.enc-overlay').forEach((o) => o.remove());

  // control: a normal encounter → bare arithmetic (few/no words)
  host = window.document.createElement('div'); window.document.body.appendChild(host);
  openEncounter({ host, strand: 'Addition & Subtraction', teach: 'never', npcEmoji: '🦉', title: 'Math Friend' });
  await wait(60);
  const plainPrompt = (q('.enc-prompt') || {}).textContent || '';
  if (wordCount(plainPrompt) > 1) throw new Error('a normal encounter should be bare arithmetic, got: ' + plainPrompt);
  console.log(`  • a normal encounter stays bare arithmetic: "${plainPrompt}"`);

  // the word problem still has a working numeric check (sanity)
  const { wordProblem } = await import('../js/engine/index.js');
  const wp = wordProblem({ skill: 'add', grade: 3 });
  if (!wp.check(wp.answer)) throw new Error('word problem check should accept its own answer');
  console.log('  • the word problem still checks its own answer correctly');
} catch (e) {
  console.log('\n❌ HELPCHAR FAILED:', e.message);
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  process.exit(1);
}
if (errors.length) { console.log('\n⚠️ runtime errors:', errors.slice(0, 5).join(' | ')); process.exit(1); }
console.log('\n✅ HELPCHAR PASSED — helper NPCs pose themed word problems that check.');
process.exit(0);
