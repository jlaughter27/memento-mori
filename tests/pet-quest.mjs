// Exercises Pet Home (care) and the Pet Quest adventure (teach -> challenge -> success).
import { JSDOM } from 'jsdom';
import fs from 'fs';
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', pretendToBeVisual: true, runScripts: 'outside-only' });
const { window } = dom; const g = window;
g.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0); g.cancelAnimationFrame = (id) => clearTimeout(id);
g.matchMedia = () => ({ matches: false, addEventListener() {} }); g.devicePixelRatio = 1; g.scrollTo = () => {}; g.print = () => {};
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
const barPct = (el) => parseFloat((el.getAttribute('style') || '').replace(/[^\d.]/g, '')) || 0;
let step = 'init';
try {
  await import('../js/app.js'); await wait(60);
  // onboard quickly
  q('#ob-name').value = 'Mia'; click(q('#ob-next')); await wait(40); click(qa('.grade-choice')[0]); await wait(20); click(q('#ob-start')); await wait(750);
  const { S } = await import('../js/state.js');

  step = 'pet home';
  hashTo('#/pet'); await wait(40);
  if (!q('.pet-sprite')) throw new Error('pet home did not render');
  const happ0 = barPct(q('.meter-fill.happy'));
  click(q('#act-pat')); await wait(30);
  if (barPct(q('.meter-fill.happy')) <= happ0 && happ0 < 100) throw new Error('patting did not raise happiness');
  click(q('#act-play')); await wait(30);
  const treats0 = S.progress.care.treats;
  click(q('#act-feed')); await wait(30);
  if (S.progress.care.treats !== treats0 - 1) throw new Error('feeding did not consume a treat');
  log(`pet home: pat/play/feed work (treats ${treats0} → ${S.progress.care.treats})`);
  // buy treats with coins
  S.progress.coins = 50; persistish(S);
  hashTo('#/'); await wait(20); hashTo('#/pet'); await wait(40);
  click(qa('.ts-buy')[1]); await wait(30); // 5 treats for 20
  if (S.progress.coins !== 30) throw new Error('buying treats did not spend coins');
  log('treat shop: bought 5 treats for 20 coins');

  step = 'adventure map';
  hashTo('#/adventure'); await wait(40);
  if (!q('.adv-chapter')) throw new Error('adventure map did not render');
  if (qa('.adv-chapter').length < 3) throw new Error('expected 3 chapters');
  log(`adventure map: ${qa('.adv-chapter').length} chapters`);

  step = 'scene: story -> teach -> challenge -> success';
  click(q('.adv-go')); await wait(40);
  if (!q('.scene-story')) throw new Error('story phase missing');
  click(q('#scene-next')); await wait(40);            // teach (first scene has teach:true)
  if (!q('.teach-card')) throw new Error('teach phase missing');
  let guard = 0; while (q('#teach-step') && !q('#teach-step').hidden && guard++ < 12) { click(q('#teach-step')); await wait(15); }
  if (q('#self-explain').hidden) throw new Error('self-explanation prompt did not appear');
  if (q('#teach-go').hidden) throw new Error('teach "my turn" button not shown');
  click(q('#teach-go')); await wait(40);              // challenge
  if (!q('.challenge-card') || !q('.problem-prompt').textContent) throw new Error('challenge did not render');
  // hint + show me
  click(q('#c-hint')); await wait(15);
  click(q('#c-show')); await wait(15);
  if (!q('#c-sol .sol-answer')) throw new Error('show-me-how did not reveal the answer');
  const ans = q('#c-sol .sol-answer b').textContent.trim();
  // answer correctly
  if (q('.choices')) { click(qa('.choice-btn').find((b) => b.textContent.trim() === ans)); }
  else { const typ = ans.replace(/,/g, '').replace(/\s+/g, ''); for (const c of typ) click(qa('.key').find((b) => b.textContent === c)); await wait(10); click(q('#c-check')); }
  await wait(60);
  if (!q('.fb-good')) throw new Error('correct answer not accepted in challenge');
  await wait(800);
  if (!q('.scene-story.success') && !q('.celebrate-overlay')) throw new Error('success phase did not show');
  // dismiss any badge popups
  let n = 0; while (q('.celebrate-overlay') && n++ < 6) { click(q('.celebrate-overlay .celebrate-btn')); await wait(300); }
  if (q('#scene-cont')) { click(q('#scene-cont')); await wait(60); }
  const { S: S2 } = await import('../js/state.js');
  if (!S2.progress.adventure.completed.length) throw new Error('scene completion not recorded');
  log('scene flow complete; progress recorded: ' + S2.progress.adventure.completed[0]);

  function persistish(s) { try { window.localStorage.setItem('mathquest.v1', JSON.stringify(s)); } catch (e) {} }
} catch (e) {
  console.log('\n❌ PET-QUEST FAILED at [' + step + ']:', e.message);
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  process.exit(1);
}
if (errors.length) { console.log('\n⚠️ runtime errors:', errors.slice(0, 5).join(' | ')); process.exit(1); }
console.log('\n✅ PET-QUEST PASSED — pet care + teach-first adventure flow all work.');
process.exit(0);
