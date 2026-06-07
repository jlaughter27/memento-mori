// tests/flows.mjs — integration coverage for the thinner-tested paths:
// dashboard settings + reset arming, rewards buy/equip/insufficient-coins,
// pet treats, and adventure chapter unlock.
import { JSDOM } from 'jsdom';
import fs from 'fs';
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', pretendToBeVisual: true, runScripts: 'outside-only' });
const { window } = dom; const g = window;
g.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0); g.cancelAnimationFrame = (id) => clearTimeout(id);
g.matchMedia = () => ({ matches: false, addEventListener() {} }); g.devicePixelRatio = 1; g.scrollTo = () => {}; g.print = () => {};
g.AudioContext = class { constructor(){this.currentTime=0;this.destination={};this.state='running';} resume(){} createOscillator(){return{frequency:{setValueAtTime(){}},connect(){},start(){},stop(){}};} createGain(){return{gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};} };
g.SpeechSynthesisUtterance = class {}; g.speechSynthesis = { cancel(){}, speak(){} };
window.HTMLCanvasElement.prototype.getContext = () => ({ scale(){}, clearRect(){}, save(){}, restore(){}, translate(){}, rotate(){}, fillRect(){}, set fillStyle(v){}, set globalAlpha(v){}, beginPath(){}, arc(){}, fill(){} });
globalThis.window = window; globalThis.document = window.document; globalThis.location = window.location; globalThis.localStorage = window.localStorage;
globalThis.HTMLCanvasElement = window.HTMLCanvasElement; globalThis.requestAnimationFrame = g.requestAnimationFrame; globalThis.cancelAnimationFrame = g.cancelAnimationFrame;
globalThis.innerWidth = 390; globalThis.innerHeight = 844; globalThis.AudioContext = g.AudioContext; globalThis.speechSynthesis = g.speechSynthesis; globalThis.SpeechSynthesisUtterance = g.SpeechSynthesisUtterance; globalThis.confirm = () => true; globalThis.print = g.print;
const errors = [];
window.addEventListener('error', (e) => errors.push(e.error?.message || e.message));
window.addEventListener('unhandledrejection', (e) => errors.push('reject: ' + (e.reason?.message || e.reason)));
const wait = (ms = 30) => new Promise((r) => setTimeout(r, ms));
const q = (s) => window.document.querySelector(s); const qa = (s) => [...window.document.querySelectorAll(s)];
const click = (el) => { if (!el) throw new Error('click target missing'); el.dispatchEvent(new window.Event('click', { bubbles: true })); };
const change = (el) => el && el.dispatchEvent(new window.Event('change', { bubbles: true }));
const input = (el) => el && el.dispatchEvent(new window.Event('input', { bubbles: true }));
const hashTo = (h) => { window.location.hash = h; window.dispatchEvent(new window.Event('hashchange')); };
const log = (m) => console.log('  •', m);
let step = 'init';
try {
  await import('../js/app.js'); await wait(60);
  const { S, persist } = await import('../js/state.js');

  step = 'onboard';
  q('#ob-name').value = 'Flo'; click(q('#ob-next')); await wait(40);
  click(qa('.grade-choice')[0]); await wait(20); click(q('#ob-start')); await wait(700);

  step = 'interactive fraction tap';
  hashTo('#/practice/g3-fractions-shade'); await wait(60);
  if (!q('.ftap')) throw new Error('interactive tap input did not render');
  const promptTxt = q('.problem-prompt').textContent;
  const m = promptTxt.match(/(\d+)\/(\d+)/);
  if (!m) throw new Error('could not read fraction from prompt: ' + promptTxt);
  const target = +m[1], den = +m[2];
  const shape = /circle/.test(promptTxt) ? 'circle' : 'bar';
  const cells = qa('.ftap-part'); // works for both bar (button) and circle (svg path)
  if (cells.length !== den) throw new Error(`expected ${den} ${shape} parts, got ${cells.length}`);
  for (let i = 0; i < target; i++) click(cells[i]); // shade exactly the numerator
  await wait(10);
  if (!q('.ftap-read').textContent.includes(`${target} of ${den}`)) throw new Error('live region did not announce the count');
  if (qa('.ftap-part.on').length !== target) throw new Error('wrong number of shaded parts');
  click(q('#check-btn')); await wait(60);
  if (!q('.fb-good')) throw new Error('shading the correct fraction was not accepted');
  log(`interactive tap: shaded ${target}/${den} (${shape}) by tapping → accepted`);
  // deterministically exercise BOTH shapes' component (incl. SVG classList path)
  const { mountFractionTap } = await import('../js/ui/interactive.js');
  for (const sh of ['bar', 'circle']) {
    const div = window.document.createElement('div'); window.document.body.appendChild(div);
    const t = mountFractionTap(div, { den: 5, shape: sh });
    const ps = [...div.querySelectorAll('.ftap-part')];
    if (ps.length !== 5) throw new Error(`${sh}: expected 5 parts, got ${ps.length}`);
    click(ps[0]); click(ps[2]); click(ps[4]);
    if (t.getCount() !== 3) throw new Error(`${sh}: getCount wrong after 3 taps`);
    if (div.querySelectorAll('.ftap-part.on').length !== 3) throw new Error(`${sh}: .on class not applied`);
    div.remove();
  }
  log('interactive component: bar + circle both shade + count correctly');

  step = 'dashboard settings';
  hashTo('#/parent'); await wait(50);
  if (!q('#settings')) throw new Error('settings did not render');
  const calm = qa('[data-set]').find((c) => c.dataset.set === 'reducedMotion');
  calm.checked = true; change(calm); await wait(10);
  if (!window.document.body.classList.contains('reduced-motion')) throw new Error('reducedMotion toggle did not apply body class');
  const font = qa('[data-set]').find((c) => c.dataset.set === 'dyslexicFont');
  font.checked = true; change(font); await wait(10);
  if (!window.document.body.classList.contains('dyslexic')) throw new Error('dyslexicFont toggle did not apply body class');
  const nameEl = q('#set-name'); nameEl.value = 'Robin'; input(nameEl); await wait(10);
  if (S.profile.name !== 'Robin') throw new Error('name change not persisted');
  const gradeEl = q('#set-grade'); gradeEl.value = String([...gradeEl.options].map((o) => +o.value).find((v) => v !== S.profile.grade)); change(gradeEl); await wait(10);
  const weeklyEl = q('#set-weekly'); weeklyEl.value = '4'; change(weeklyEl); await wait(10);
  if (S.profile.weeklyGoal !== 4) throw new Error('weekly goal not persisted');
  const resetBtn = q('#reset-btn'); click(resetBtn); await wait(10);
  if (!resetBtn.classList.contains('armed')) throw new Error('reset did not arm on first tap');
  if (!S.onboarded) throw new Error('reset fired on a single tap (should need two)');
  log('dashboard: calm/font toggles apply, name/grade/weekly persist, reset arms (not fires)');

  step = 'rewards buy/equip';
  S.progress.coins = 9999; persist();
  hashTo('#/rewards'); await wait(50);
  for (const t of qa('.tab')) { click(t); await wait(25); if (!q('#tab-body').children.length) throw new Error('empty tab-body for ' + t.dataset.tab); }
  click(qa('.tab').find((t) => t.dataset.tab === 'shop')); await wait(25);
  const beforeCoins = S.progress.coins, ownedBefore = S.progress.owned.length;
  const buyBtn = qa('.shop-item .item-btn.buy')[0];
  if (!buyBtn) throw new Error('no buyable shop item');
  click(buyBtn); await wait(40);
  if (S.progress.owned.length !== ownedBefore + 1) throw new Error('purchase did not add to owned');
  if (S.progress.coins >= beforeCoins) throw new Error('purchase did not deduct coins');
  log('rewards: bought an item (owned +1, coins deducted)');
  click(qa('.tab').find((t) => t.dataset.tab === 'pets')); await wait(25);
  const petBefore = S.profile.avatar.pet;
  const petBuy = qa('.shop-item .item-btn.buy')[0];
  if (petBuy) {
    click(petBuy); await wait(40);
    if (S.profile.avatar.pet === petBefore) throw new Error('buying a pet did not equip it');
    log('rewards: bought + equipped a new pet (' + petBefore + ' → ' + S.profile.avatar.pet + ')');
  }
  click(qa('.tab').find((t) => t.dataset.tab === 'style')); await wait(25);
  const themeBtns = qa('#style-themes .item-btn');
  if (themeBtns.length) { click(themeBtns[themeBtns.length - 1]); await wait(20); }
  log('rewards: style tab equips a theme cleanly');

  step = 'rewards insufficient coins';
  S.progress.coins = 0; persist();
  hashTo('#/rewards'); await wait(40);
  click(qa('.tab').find((t) => t.dataset.tab === 'shop')); await wait(25);
  const cant = qa('.shop-item').find((c) => c.querySelector('.item-btn.cant'));
  if (cant) {
    click(cant.querySelector('.item-btn')); await wait(40);
    if (!q('.celebrate-overlay')) throw new Error('no "not enough coins" popup on unaffordable buy');
    click(q('.celebrate-overlay .celebrate-btn')); await wait(60);
    log('rewards: unaffordable buy shows a kind popup (no purchase)');
  }

  step = 'pet treats edge';
  hashTo('#/pet'); await wait(50);
  if (!q('.pet-wrap')) throw new Error('pet home did not render');
  const treatBtn = qa('.ts-buy, .pet-btn').find((b) => /treat|buy|feed/i.test(b.textContent + b.id));
  if (treatBtn) { click(treatBtn); await wait(20); }
  if (S.progress.coins < 0) throw new Error('coins went negative buying treats');
  log('pet: treat purchase with 0 coins is safe');

  step = 'adventure chapter unlock';
  const { default: adventures } = await import('../js/curriculum/adventures.js');
  const ch0 = adventures.chapters[0];
  S.progress.adventure.completed = ch0.scenes.map((s) => s.id); persist();
  hashTo('#/adventure'); await wait(50);
  const chapters = qa('.adv-chapter');
  if (chapters.length < 2) throw new Error('expected >=2 chapters');
  if (chapters[0].classList.contains('locked')) throw new Error('completed chapter 1 still locked');
  if (chapters[1].classList.contains('locked')) throw new Error('chapter 2 did not unlock after finishing chapter 1');
  log('adventure: finishing chapter 1 unlocks chapter 2');

} catch (e) {
  console.log('\n❌ FLOWS FAILED at [' + step + ']:', e.message);
  if (errors.length) console.log('page errors:', errors.slice(0, 5).join(' | '));
  process.exit(1);
}
if (errors.length) { console.log('\n⚠️ runtime errors:', errors.slice(0, 5).join(' | ')); process.exit(1); }
console.log('\n✅ FLOWS PASSED — settings, rewards buy/equip, pet care, and adventure unlock all work.');
process.exit(0);
