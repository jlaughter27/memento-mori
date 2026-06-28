// Quests: multi-step island adventures auto-progress through the real hooks,
// gate by mastery, and the completion chest claims once (coins + treat + sticker + badge).
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

try {
  await import('../js/app.js'); await wait(60);
  q('#ob-name').value = 'Rey'; click(q('#ob-next')); await wait(40); click(qa('.grade-choice')[0]); await wait(20); click(q('#ob-start')); await wait(750);
  const { S } = await import('../js/state.js');
  const gm = await import('../js/gamification.js');

  // fresh: 4 quests; only the first is open, the rest gated by mastery
  let ql = gm.listQuests();
  if (ql.length !== 4) throw new Error('expected 4 quests, got ' + ql.length);
  if (ql[0].status !== 'active') throw new Error('first quest should be active, got ' + ql[0].status);
  if (ql[1].status !== 'locked' || !ql[1].lockText) throw new Error('second quest should be locked with a hint');
  if (ql[0].current.label.indexOf('6') < 0) throw new Error('first objective should be "solve 6": ' + ql[0].current.label);
  console.log(`  • 4 quests; "${ql[0].title}" active, others gated (e.g. "${ql[1].lockText}")`);

  // step 1 (solve 6) progresses through the REAL recordAnswer hook (any solving feeds quests)
  for (let i = 0; i < 6; i++) gm.recordAnswer('g3-place-value-100s', true, true);
  ql = gm.listQuests();
  if (ql[0].steps[0].state !== 'done') throw new Error('solve step not completed after 6 solves');
  if (ql[0].current.label.toLowerCase().indexOf('explore') < 0) throw new Error('did not advance to the explore step');
  console.log('  • solving 6 problems auto-completed step 1 and advanced to "explore"');

  // step 2 (explore) + step 3 (master 1) via the real metrics → quest becomes claimable
  gm.bumpQuest('explore');
  gm.masterSkill('g3-place-value-100s', 1); // firstTime → bumpQuest('master')
  ql = gm.listQuests();
  if (ql[0].status !== 'ready') throw new Error('quest should be ready to claim, got ' + ql[0].status);
  // mastering 1 skill is still < 2, so quest #2 stays locked
  if (ql[1].status !== 'locked') throw new Error('quest 2 should still be locked at 1 mastered');
  console.log('  • explore + master finished the chain → chest ready');

  // claim through the Quest Log UI: chest pays coins + treat + sticker + badge, once
  window.location.hash = '#/quests'; await wait(120);
  const claim = q('.q-claim');
  if (!claim) throw new Error('no Claim button in the Quest Log');
  const coins0 = S.progress.coins, treats0 = S.progress.care.treats;
  click(claim); await wait(80);
  if (S.progress.coins <= coins0) throw new Error('claiming the chest gave no coins');
  if ((S.progress.care.treats || 0) <= treats0) throw new Error('claiming the chest gave no treats');
  if (!(S.progress.world.stickers || []).includes('quest-welcome')) throw new Error('quest trophy sticker not awarded');
  if ((S.progress.stats.questsDone || 0) !== 1) throw new Error('questsDone stat did not increment');
  if (!S.progress.badges.includes('adventure-1')) throw new Error('"Adventurer" badge not earned on first quest');
  console.log(`  • claimed chest via UI: coins ${coins0}→${S.progress.coins}, +treat, trophy + "Adventurer" badge`);

  // one-shot: cannot claim again
  if (gm.claimQuest('q-welcome')) throw new Error('a claimed quest must not pay out again');

  // unlock gate opens: mastering enough skills unlocks the next adventure
  S.progress.stats.skillsMastered = 2;
  if (gm.listQuests()[1].status === 'locked') throw new Error('quest 2 should unlock at 2 mastered');
  console.log('  • mastering more skills unlocks the next adventure');
} catch (e) {
  console.log('\n❌ QUESTS FAILED:', e.message);
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  process.exit(1);
}
if (errors.length) { console.log('\n⚠️ runtime errors:', errors.slice(0, 5).join(' | ')); process.exit(1); }
console.log('\n✅ QUESTS PASSED — multi-step adventures progress, gate, and pay out once.');
process.exit(0);
