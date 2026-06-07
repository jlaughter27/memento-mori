import { JSDOM } from 'jsdom';
import fs from 'fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', pretendToBeVisual: true, runScripts: 'outside-only' });
const { window } = dom;
const errors = [];
window.addEventListener('error', (e) => errors.push('error: ' + (e.error?.message || e.message)));
window.addEventListener('unhandledrejection', (e) => errors.push('reject: ' + (e.reason?.message || e.reason)));

// --- browser stubs ---
const g = window;
g.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
g.cancelAnimationFrame = (id) => clearTimeout(id);
g.matchMedia = () => ({ matches: false, addEventListener() {} });
g.devicePixelRatio = 1;
g.scrollTo = () => {};
class FakeOsc { constructor(){this.frequency={setValueAtTime(){}};} connect(){} start(){} stop(){} }
class FakeGain { constructor(){this.gain={setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}};} connect(){} }
g.AudioContext = class { constructor(){this.currentTime=0;this.destination={};this.state='running';} resume(){} createOscillator(){return new FakeOsc();} createGain(){return new FakeGain();} };
g.SpeechSynthesisUtterance = class {};
g.speechSynthesis = { cancel(){}, speak(){} };
window.HTMLCanvasElement.prototype.getContext = () => ({ scale(){}, clearRect(){}, save(){}, restore(){}, translate(){}, rotate(){}, fillRect(){}, set fillStyle(v){}, set globalAlpha(v){}, beginPath(){}, arc(){}, fill(){} });

// expose globals the ES modules expect (they reference bare document/window/etc.)
globalThis.window = window;
globalThis.document = window.document;
globalThis.location = window.location;
globalThis.localStorage = window.localStorage;
globalThis.HTMLCanvasElement = window.HTMLCanvasElement;
globalThis.requestAnimationFrame = g.requestAnimationFrame;
globalThis.cancelAnimationFrame = g.cancelAnimationFrame;
globalThis.innerWidth = 1024; globalThis.innerHeight = 768;
globalThis.AudioContext = g.AudioContext;
globalThis.speechSynthesis = g.speechSynthesis;
globalThis.SpeechSynthesisUtterance = g.SpeechSynthesisUtterance;
globalThis.confirm = () => true;

const wait = (ms = 30) => new Promise((r) => setTimeout(r, ms));
const $ = (s) => window.document.querySelector(s);
const $$ = (s) => [...window.document.querySelectorAll(s)];
const click = (el) => { if (!el) throw new Error('click target missing'); el.dispatchEvent(new window.Event('click', { bubbles: true })); };

let step = 'init';
const log = (m) => console.log('  •', m);
try {
  await import('../js/app.js');
  await wait(60);

  step = 'onboarding';
  if (!$('#content .onboard')) throw new Error('onboarding did not render');
  const nameInput = $('#ob-name'); nameInput.value = 'Ada';
  click($('#ob-next')); await wait(40);
  const gradeBtn = $$('.grade-choice')[0]; click(gradeBtn); await wait(20);
  click($('#ob-start')); await wait(750);
  log('onboarding completed');

  step = 'home';
  if (!$('#content .home-hero')) throw new Error('home did not render');
  const cards = $$('.skill-card:not(.locked)');
  if (!cards.length) throw new Error('no unlocked skill cards');
  log(`home rendered with ${$$('.skill-card').length} skill cards (${cards.length} unlocked)`);

  step = 'lesson';
  click(cards[0]); await wait(50);
  if (!$('.lesson-wrap')) throw new Error('lesson did not render');
  let guard = 0;
  while ($('#lesson-next') && guard++ < 12) {
    const isLast = $('#lesson-next').textContent.includes('Practice');
    click($('#lesson-next')); await wait(40);
    if (isLast) break;
  }
  const dismissPopups = async () => {
    let n = 0;
    while ($('.celebrate-overlay') && n++ < 10) {
      await wait(30);
      const btn = $('.celebrate-overlay .celebrate-btn');
      if (btn) click(btn);
      await wait(60);
    }
  };
  await dismissPopups();
  // lesson now flows into Tutor mode (teach-first): step through the worked example, then start
  if ($('.tutor-wrap')) {
    let tg = 0; while ($('#t-step') && !$('#t-step').hidden && tg++ < 14) { click($('#t-step')); await wait(15); }
    if (!$('#t-go') || $('#t-go').hidden) throw new Error('tutor teach screen did not reach "let\'s practice"');
    click($('#t-go')); await wait(50);
    log('tutor teach screen walked → practice');
  }
  await dismissPopups();
  log('lesson done; popups dismissed → practice');

  step = 'practice';
  if (!$('.practice-wrap')) throw new Error('practice did not render');
  if (!$('.problem-prompt').textContent) throw new Error('no problem prompt');
  log('problem: ' + $('.problem-prompt').textContent);
  if ($$('.pip').length < 1) throw new Error('no progress pips');
  if (!$('.keypad') && !$('.choices')) throw new Error('no input control');
  // v2.8 long-answer regression: hammering the keypad must cap the value and
  // keep it inside the display (no overflow), then clear cleanly.
  if ($('.keypad') && $('#ans-display')) {
    const nine = $$('.key').find((b) => b.textContent === '9');
    for (let i = 0; i < 48; i++) click(nine);
    await wait(10);
    const shown = $('#ans-display').textContent;
    if (shown.length > 40) throw new Error('answer display not length-capped (' + shown.length + ' chars)');
    if ($('#ans-display').dataset.empty !== '0') throw new Error('answer display empty flag wrong after typing');
    const back = $$('.key').find((b) => b.getAttribute('aria-label') === 'delete' || b.textContent === '⌫');
    for (let i = 0; i < 45; i++) click(back);
    await wait(10);
    if ($('#ans-display').textContent !== '?') throw new Error('answer display did not clear back to empty');
    log('long-answer input capped + cleared cleanly (no overflow)');
  }
  // hint ladder
  click($('#hint-btn')); await wait(20);
  if (!$('.mascot-bubble')) throw new Error('hint did not show mascot bubble');
  log('hint shown: ' + $('.mascot-bubble').textContent.slice(0, 40));
  // show me how → reveal all steps + answer
  click($('#show-btn')); await wait(20);
  if ($('#solution-panel').hidden) throw new Error('solution panel still hidden');
  if (!$('.sol-step')) throw new Error('no solution step rendered');
  let g2 = 0; while ($('.sol-more') && !$('.sol-more').hidden && g2++ < 14) { click($('.sol-more')); await wait(12); }
  if (!$('.sol-answer')) throw new Error('no answer revealed');
  const ansText = $('.sol-answer b').textContent.trim();
  log('worked solution shown; answer = ' + ansText);

  // now answer CORRECTLY using the revealed answer → exercise reward path
  if ($('.choices')) {
    const btn = $$('.choice-btn').find((b) => b.textContent.trim() === ansText);
    if (!btn) throw new Error('no matching choice for ' + ansText);
    click(btn);
  } else {
    const typ = ansText.replace(/,/g, '').replace(/\s+/g, '');
    for (const ch of typ) { const k = $$('.key').find((b) => b.textContent === ch); if (k) click(k); }
    await wait(10);
    click($('#check-btn'));
  }
  await wait(60);
  if (!$('.fb-good')) throw new Error('correct answer did not produce success feedback (fb-good)');
  if ($$('.pip.done').length < 1) throw new Error('progress pip did not advance on correct');
  log('✓ correct answer accepted; XP/coins awarded; pip advanced');
  await dismissPopups();

  step = 'routes';
  for (const r of ['#/play', '#/rewards', '#/parent', '#/']) {
    window.location.hash = r;
    window.dispatchEvent(new window.Event('hashchange'));
    await wait(50);
    if (!$('#content').children.length) throw new Error('empty content at ' + r);
    log('route ' + r + ' ok');
  }

  step = 'rewards-tabs';
  window.location.hash = '#/rewards'; window.dispatchEvent(new window.Event('hashchange')); await wait(40);
  for (const t of $$('.tab')) { click(t); await wait(25); }
  log('rewards tabs all rendered');

  step = 'text-fit helpers';
  const { promptLen, fitText } = await import('../js/ui/dom.js');
  if (promptLen('2+2') !== '') throw new Error('promptLen: short prompt should bucket to ""');
  if (promptLen('x'.repeat(50)) !== 'long') throw new Error('promptLen: 50 chars should be "long"');
  if (promptLen('x'.repeat(90)) !== 'xlong') throw new Error('promptLen: 90 chars should be "xlong"');
  fitText(undefined); fitText(null); fitText($('#hud')); // must be no-op-safe, never throw
  log('text-fit helpers: promptLen buckets correct + fitText no-op safe');

} catch (e) {
  console.log('\n❌ SMOKE FAILED at step [' + step + ']:', e.message);
  if (errors.length) console.log('captured page errors:\n', errors.join('\n'));
  process.exit(1);
}
await wait(40);
if (errors.length) { console.log('\n⚠️ runtime errors captured:\n' + errors.join('\n')); process.exit(1); }
console.log('\n✅ SMOKE PASSED — full UI flow works with no runtime errors.');
process.exit(0);
