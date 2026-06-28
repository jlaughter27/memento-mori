// First-run welcome + warm empty states (Plan M8): a brand-new learner gets
// guidance with a CTA on Home and in the Collection; it fades once they're going.
import { JSDOM } from 'jsdom';
import fs from 'fs';
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', pretendToBeVisual: true, runScripts: 'outside-only' });
const { window } = dom; const g = window;
g.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0); g.cancelAnimationFrame = (id) => clearTimeout(id);
g.matchMedia = () => ({ matches: false, addEventListener() {} }); g.devicePixelRatio = 1; g.scrollTo = () => {};
g.AudioContext = class { constructor(){this.currentTime=0;this.destination={};this.state='running';} resume(){} createOscillator(){return{frequency:{setValueAtTime(){}},connect(){},start(){},stop(){}};} createGain(){return{gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};} };
g.SpeechSynthesisUtterance = class {}; g.speechSynthesis = { cancel(){}, speak(){} };
const ctxProxy = new Proxy(function () {}, { get: () => ctxProxy, set: () => true, apply: () => ctxProxy });
window.HTMLCanvasElement.prototype.getContext = () => ctxProxy;
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
  q('#ob-name').value = 'Nova'; click(q('#ob-next')); await wait(40); click(qa('.grade-choice')[0]); await wait(20); click(q('#ob-start')); await wait(750);
  const { S } = await import('../js/state.js');

  // fresh Home shows a welcome card with a real CTA
  if (!q('.welcome-card')) throw new Error('a brand-new learner should see a welcome card on Home');
  const wbtn = q('#welcome-explore');
  if (!wbtn || !wbtn.textContent.trim()) throw new Error('welcome card needs a labelled CTA');
  click(wbtn); await wait(40);
  if (window.location.hash !== '#/world') throw new Error('welcome CTA should go to the World');
  console.log('  • Home: welcome card + "Explore the World" CTA (→ #/world)');

  // fresh Collection shows a warm empty state with guidance + a CTA
  window.location.hash = '#/collection'; await wait(80);
  if (!q('.coll-empty')) throw new Error('a fresh collection should show an encouraging empty state');
  if (!/getting started/i.test(q('.coll-empty').textContent)) throw new Error('empty state should be encouraging, not blank');
  if (!q('#coll-explore')) throw new Error('the collection empty state needs a CTA');
  console.log('  • Collection: warm empty state with guidance + a "Start exploring" CTA');

  // once the learner is going, the welcome card fades away
  S.progress.stats.problemsAttempted = 5;
  window.location.hash = '#/'; await wait(20); window.location.hash = '#/collection'; await wait(20); window.location.hash = '#/'; await wait(80);
  if (q('.welcome-card')) throw new Error('the welcome card should disappear after the learner starts');
  console.log('  • welcome guidance fades once the learner has started (not nagging)');
} catch (e) {
  console.log('\n❌ ONBOARDING FAILED:', e.message);
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  process.exit(1);
}
if (errors.length) { console.log('\n⚠️ runtime errors:', errors.slice(0, 5).join(' | ')); process.exit(1); }
console.log('\n✅ ONBOARDING PASSED — warm first-run guidance + empty states with CTAs.');
process.exit(0);
