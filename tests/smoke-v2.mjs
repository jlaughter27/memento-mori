// Exercises v2 features: placement quiz, curriculum map, spaced review, what's-new.
import { JSDOM } from 'jsdom';
import fs from 'fs';
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', pretendToBeVisual: true, runScripts: 'outside-only' });
const { window } = dom; const g = window;
g.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0); g.cancelAnimationFrame = (id) => clearTimeout(id);
g.matchMedia = () => ({ matches: false, addEventListener() {} }); g.devicePixelRatio = 1; g.scrollTo = () => {}; g.print = () => { g.__printed = true; };
g.AudioContext = class { constructor(){this.currentTime=0;this.destination={};this.state='running';} resume(){} createOscillator(){return{frequency:{setValueAtTime(){}},connect(){},start(){},stop(){}};} createGain(){return{gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};} };
g.SpeechSynthesisUtterance = class {}; g.speechSynthesis = { cancel(){}, speak(){} };
window.HTMLCanvasElement.prototype.getContext = () => ({ scale(){}, clearRect(){}, save(){}, restore(){}, translate(){}, rotate(){}, fillRect(){}, beginPath(){}, arc(){}, fill(){} });
globalThis.window = window; globalThis.document = window.document; globalThis.location = window.location; globalThis.localStorage = window.localStorage;
globalThis.HTMLCanvasElement = window.HTMLCanvasElement; globalThis.requestAnimationFrame = g.requestAnimationFrame; globalThis.cancelAnimationFrame = g.cancelAnimationFrame;
globalThis.innerWidth = 1024; globalThis.innerHeight = 768; globalThis.AudioContext = g.AudioContext; globalThis.speechSynthesis = g.speechSynthesis; globalThis.SpeechSynthesisUtterance = g.SpeechSynthesisUtterance; globalThis.confirm = () => true; globalThis.print = g.print;
const errors = [];
window.addEventListener('error', (e) => errors.push(e.error?.message || e.message));
const wait = (ms = 30) => new Promise((r) => setTimeout(r, ms));
const q = (s) => window.document.querySelector(s); const qa = (s) => [...window.document.querySelectorAll(s)];
const click = (el) => el && el.dispatchEvent(new window.Event('click', { bubbles: true }));
const hashTo = (h) => { window.location.hash = h; window.dispatchEvent(new window.Event('hashchange')); };
const log = (m) => console.log('  •', m);
let step = 'init';
try {
  await import('../js/app.js'); await wait(60);

  step = 'placement onboarding';
  q('#ob-name').value = 'Sam'; click(q('#ob-next')); await wait(40);
  click(qa('.grade-choice')[0]); await wait(20);
  if (!q('#ob-place')) throw new Error('placement entry button missing');
  click(q('#ob-place')); await wait(40);
  if (!q('.place-choice')) throw new Error('placement quiz did not render');
  let qn = 0;
  while (q('.place-choice') && qn < 8) { click(qa('.place-choice')[0]); qn++; await wait(700); }
  if (!q('#ob-go')) throw new Error('placement result did not render');
  const placedTitle = q('.onboard-card h1').textContent;
  click(q('#ob-go')); await wait(750);
  if (!q('.home-hero')) throw new Error('did not reach home after placement');
  log('placement quiz worked → ' + placedTitle.trim());

  step = 'standards on lesson';
  const card = qa('.skill-card:not(.locked)')[0];
  click(card); await wait(50);
  if (!q('.lesson-standard .std-code')) throw new Error('lesson is missing its standard tag');
  log('lesson shows standard: ' + q('.lesson-standard .std-code').textContent);
  hashTo('#/'); await wait(40);

  step = 'curriculum map';
  hashTo('#/parent'); await wait(40);
  if (!q('#curric-map-btn')) throw new Error('curriculum map button missing in dashboard');
  if (!q('.ver-pill')) throw new Error('version pill missing');
  click(q('#curric-map-btn')); await wait(50);
  if (!q('.curric-table')) throw new Error('curriculum map did not render');
  const rows = qa('.curric-table tbody tr').length;
  click(q('#curric-print')); await wait(20);
  if (!g.__printed) throw new Error('print did not fire');
  log('curriculum map rendered ' + rows + ' skill rows; print works');

  step = 'whats new';
  hashTo('#/parent'); await wait(40);
  click(q('#whatsnew-btn')); await wait(30);
  if (!q('.whatsnew-card')) throw new Error('what\'s new modal did not open');
  click(q('.wn-close')); await wait(40);
  log('What\'s New modal opens/closes');

  step = 'spaced review';
  const { S, persist } = await import('../js/state.js');
  // force a mastered skill to be due for review
  const skId = qa('.skill-card')[0]?.dataset?.id || 'g3-place-value-100s';
  S.progress.skills[skId] = { attempts: 6, correct: 6, mastered: true, stars: 3, lessonDone: true, reviewStage: 0, reviewAt: Date.now() - 1000 };
  persist();
  hashTo('#/'); await wait(50);
  if (!q('#review-btn')) throw new Error('review card not shown when a skill is due');
  click(q('#review-btn')); await wait(50);
  if (!q('.practice-wrap') || !q('.problem-prompt').textContent) throw new Error('review session did not start');
  log('spaced review: due card + session work');

  step = 'mistakes notebook / fix-it';
  const { noteMistake, mistakeCount } = await import('../js/gamification.js');
  noteMistake(skId); persist();
  if (mistakeCount() < 1) throw new Error('noteMistake did not record a mistake');
  hashTo('#/'); await wait(50);
  if (!q('#fixit-btn')) throw new Error('Fix-It card not shown when mistakes exist');
  click(q('#fixit-btn')); await wait(50);
  if (!q('.practice-wrap') || !q('.problem-prompt').textContent) throw new Error('Fix-It session did not start');
  log('mistakes notebook: miss captured → Fix-It card + session work');

  step = 'parent report';
  hashTo('#/parent'); await wait(40);
  if (!q('#report-btn')) throw new Error('report button missing in dashboard');
  click(q('#report-btn')); await wait(50);
  if (!q('.rpt-wrap')) throw new Error('parent report did not render');
  log('parent efficacy report renders');

  step = 'magnitude mini-game';
  hashTo('#/magnitude'); await wait(50);
  if (!q('#mag-start')) throw new Error('magnitude start screen did not render');
  click(q('#mag-start')); await wait(50);
  if (!q('.mag-wrap') || !q('#mag-svg')) throw new Error('magnitude round did not start');
  if (q('#mag-confirm')) { click(q('#mag-confirm')); await wait(40); } // place a guess
  log('magnitude mini-game: start → round → place works');

  step = 'sort & storm mini-game';
  hashTo('#/sort'); await wait(50);
  if (!q('#ss-start')) throw new Error('sort & storm start did not render');
  click(q('#ss-start')); await wait(60);
  if (!q('.ss-tile')) throw new Error('sort & storm round did not start');
  log('sort & storm mini-game: start → round works');

} catch (e) {
  console.log('\n❌ V2 SMOKE FAILED at [' + step + ']:', e.message);
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  process.exit(1);
}
if (errors.length) { console.log('\n⚠️ runtime errors:', errors.slice(0, 5).join(' | ')); process.exit(1); }
console.log('\n✅ V2 SMOKE PASSED — placement, standards, curriculum map, what\'s-new, spaced review, and Fix-It all work.');
process.exit(0);
