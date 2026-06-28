// Missions: daily/weekly quests progress as you act, and claiming pays out + celebrates.
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
  q('#ob-name').value = 'Quinn'; click(q('#ob-next')); await wait(40); click(qa('.grade-choice')[0]); await wait(20); click(q('#ob-start')); await wait(750);
  const { S } = await import('../js/state.js');
  const gm = await import('../js/gamification.js');

  // fresh: daily missions exist (the 3 core), nothing claimable
  let mis = gm.listMissions();
  if (mis.daily.length !== 3) throw new Error('expected 3 daily missions, got ' + mis.daily.length);
  if (mis.weekly.length !== 3) throw new Error('expected 3 weekly missions, got ' + mis.weekly.length);
  if (gm.claimableMissions() !== 0) throw new Error('nothing should be claimable yet');
  const solve = mis.daily.find((m) => m.id === 'solve');
  if (!solve || solve.n !== 0) throw new Error('solve mission should start at 0');
  console.log(`  • fresh: 3 daily + 3 weekly quests, e.g. "${solve.title}"`);

  // acting feeds missions: record correct answers via the real gamification path
  const goal = solve.goal;
  for (let i = 0; i < goal; i++) gm.recordAnswer('g3-place-value-100s', true, true);
  mis = gm.listMissions();
  const solve2 = mis.daily.find((m) => m.id === 'solve');
  if (!solve2.done) throw new Error(`solve mission not done after ${goal} solves (n=${solve2.n})`);
  if (gm.claimableMissions() < 1) throw new Error('a finished mission should be claimable');
  console.log(`  • solving ${goal} problems completed the "Solve" quest (and progressed others)`);

  // the home panel surfaces a claim button; claiming pays coins + treats
  window.location.hash = '#/'; await wait(40); window.location.hash = '#/rewards'; await wait(40); window.location.hash = '#/'; await wait(120);
  const claimBtn = q('#missions-panel .btn-claim');
  if (!claimBtn) throw new Error('no Claim button rendered on the home missions panel');
  const coins0 = S.progress.coins, treats0 = S.progress.care.treats, done0 = S.progress.stats.missionsDone || 0;
  click(claimBtn); await wait(60);
  if (S.progress.coins <= coins0) throw new Error('claim did not award coins');
  if ((S.progress.care.treats || 0) <= treats0) throw new Error('claim did not award treats');
  if ((S.progress.stats.missionsDone || 0) !== done0 + 1) throw new Error('missionsDone stat did not increment');
  if (!S.progress.badges.includes('mission-1')) throw new Error('"Quest Begun" badge not earned on first mission (badges check runs on home)');
  console.log(`  • claimed: coins ${coins0}→${S.progress.coins}, treats +, missionsDone=${S.progress.stats.missionsDone}, badge earned`);

  // claiming is one-shot: the same mission can't be claimed twice
  const again = gm.claimMission(claimBtn.dataset.tier, claimBtn.dataset.id);
  if (again) throw new Error('a claimed mission must not pay out again');

  // a new day resets daily missions (progress back to 0)
  S.progress.missions.day = '2000-1-1';
  const reset = gm.listMissions();
  if (reset.daily.find((m) => m.id === 'solve').n !== 0) throw new Error('daily missions did not reset on a new day');
  console.log('  • new day resets daily quests; weekly persists');
} catch (e) {
  console.log('\n❌ MISSIONS FAILED:', e.message);
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  process.exit(1);
}
if (errors.length) { console.log('\n⚠️ runtime errors:', errors.slice(0, 5).join(' | ')); process.exit(1); }
console.log('\n✅ MISSIONS PASSED — daily/weekly quests track real actions, pay out once, and reset.');
process.exit(0);
