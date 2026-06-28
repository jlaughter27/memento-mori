// Boss-gate (Plan M9): a specific boss unlocks a specific zone — access gating,
// not just a trophy. Decimal Docks is gated behind defeating Geo Rex (boss-gardens).
import { JSDOM } from 'jsdom';
import fs from 'fs';
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', pretendToBeVisual: true, runScripts: 'outside-only' });
const { window } = dom; const g = window;
g.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0); g.cancelAnimationFrame = (id) => clearTimeout(id);
g.matchMedia = () => ({ matches: false, addEventListener() {} }); g.devicePixelRatio = 1; g.scrollTo = () => {};
g.AudioContext = class { constructor(){this.currentTime=0;this.destination={};this.state='running';} resume(){} createOscillator(){return{frequency:{setValueAtTime(){}},connect(){},start(){},stop(){}};} createGain(){return{gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};} };
g.SpeechSynthesisUtterance = class {}; g.speechSynthesis = { cancel(){}, speak(){} };
// permissive 2D-context stub: any method/property access returns a callable proxy
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
const hashTo = (h) => { window.location.hash = h; window.dispatchEvent(new window.Event('hashchange')); };
const docksBtn = () => qa('.wmap-zone').find((b) => /dock/i.test(b.textContent));

try {
  await import('../js/app.js'); await wait(60);
  q('#ob-name').value = 'Boss'; click(q('#ob-next')); await wait(40); click(qa('.grade-choice')[0]); await wait(20); click(q('#ob-start')); await wait(750);
  const { S } = await import('../js/state.js');
  // plenty of mastery so the OLD gate (mastered:4) would have opened — proving it's the boss now
  S.progress.stats.skillsMastered = 20;
  S.progress.world.bosses = {};

  // pre-boss: Docks is LOCKED and names the boss to defeat
  hashTo('#/world'); await wait(80); click(q('#world-map')); await wait(40);
  let d = docksBtn();
  if (!d) throw new Error('Decimal Docks missing from the map');
  if (!d.classList.contains('locked')) throw new Error('Docks should be LOCKED before its boss is beaten (even with 20 mastered)');
  if (!/Geo Rex|Defeat/i.test(d.textContent)) throw new Error('lock label should name the boss to defeat: ' + d.textContent);
  console.log('  • pre-boss: Decimal Docks locked behind Geo Rex — "' + d.querySelector('.wmap-go').textContent.trim() + '"');

  // beat Geo Rex (boss-gardens) → Docks unlocks (access granted)
  S.progress.world.bosses['boss-gardens'] = { done: true };
  qa('.wmap-overlay').forEach((o) => o.remove()); // drop the stale (body-level) overlay
  hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  qa('.wmap-overlay').forEach((o) => o.remove());
  click(q('#world-map')); await wait(40);
  d = docksBtn();
  if (!d || d.classList.contains('locked')) throw new Error('Docks should UNLOCK after defeating Geo Rex');
  click(d); await wait(80);
  if (S.progress.world.map !== 'docks') throw new Error('could not travel into the now-unlocked Docks');
  console.log('  • defeating Geo Rex unlocked the Docks → traveled in (boss gates access, not just a trophy)');
} catch (e) {
  console.log('\n❌ BOSSGATE FAILED:', e.message);
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  process.exit(1);
}
if (errors.length) { console.log('\n⚠️ runtime errors:', errors.slice(0, 5).join(' | ')); process.exit(1); }
console.log('\n✅ BOSSGATE PASSED — a specific boss unlocks a specific zone (access gating).');
process.exit(0);
