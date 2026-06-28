// Math-as-fuel (Plan M11): solving fills a spark charge; when full, spending it
// triggers a Power (coin surge). Tests the model + the World UI wiring.
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
const hashTo = (h) => { window.location.hash = h; window.dispatchEvent(new window.Event('hashchange')); };

try {
  await import('../js/app.js'); await wait(60);
  q('#ob-name').value = 'Fia'; click(q('#ob-next')); await wait(40); click(qa('.grade-choice')[0]); await wait(20); click(q('#ob-start')); await wait(750);
  const { S } = await import('../js/state.js');
  const gm = await import('../js/gamification.js');

  // model: charge fills with solves, caps, reports ready
  let ci = gm.chargeInfo();
  if (ci.charge !== 0 || ci.ready) throw new Error('charge should start empty');
  for (let i = 0; i < gm.CHARGE_FULL; i++) gm.addCharge(1);
  ci = gm.chargeInfo();
  if (!ci.ready || ci.charge !== gm.CHARGE_FULL) throw new Error('charge should be full after CHARGE_FULL solves');
  gm.addCharge(5);
  if (gm.chargeInfo().charge !== gm.CHARGE_FULL) throw new Error('charge must cap at full');
  console.log(`  • solving fills the spark to ${gm.chargeInfo().charge}/${gm.CHARGE_FULL} (capped) → ready`);

  // spending the full charge triggers the Power (coin surge), then resets
  const coins0 = S.progress.coins;
  const r = gm.spendCharge();
  if (!r || r.coins <= 0) throw new Error('spending a full charge should grant a coin surge');
  if (S.progress.coins <= coins0) throw new Error('the Power did not add coins');
  if (gm.chargeInfo().charge !== 0) throw new Error('charge should reset to 0 after spending');
  if (gm.spendCharge() !== null) throw new Error('cannot spend an empty charge');
  console.log(`  • spending a full charge fires a Power: coins ${coins0}→${S.progress.coins}, charge reset`);

  // World UI: the charge button renders and reflects the meter
  hashTo('#/world'); await wait(80);
  const btn = q('#world-charge');
  if (!btn) throw new Error('the World has no charge/power button');
  if (!/0\/5|\/5/.test(btn.textContent)) throw new Error('charge button should show the meter, got: ' + btn.textContent);
  console.log('  • the World header shows the spark meter ("' + btn.textContent.trim() + '")');

  // fill + click the button in the World → Power fires
  for (let i = 0; i < gm.CHARGE_FULL; i++) gm.addCharge(1);
  hashTo('#/'); await wait(20); hashTo('#/world'); await wait(80);
  const btn2 = q('#world-charge');
  if (!/Power/i.test(btn2.textContent)) throw new Error('a full charge should show "Power!", got: ' + btn2.textContent);
  const c1 = S.progress.coins; click(btn2); await wait(30);
  if (S.progress.coins <= c1) throw new Error('clicking Power in the World did not surge coins');
  console.log('  • full meter shows "✨ Power!"; tapping it in the World surges coins');
} catch (e) {
  console.log('\n❌ FUEL FAILED:', e.message);
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  process.exit(1);
}
if (errors.length) { console.log('\n⚠️ runtime errors:', errors.slice(0, 5).join(' | ')); process.exit(1); }
console.log('\n✅ FUEL PASSED — solving charges the spark; spending it powers a world action.');
process.exit(0);
