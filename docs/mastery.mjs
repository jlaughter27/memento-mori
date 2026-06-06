// Drives a skill to full mastery, then checks unlock + mastery state.
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
globalThis.innerWidth = 1024; globalThis.innerHeight = 768; globalThis.AudioContext = g.AudioContext; globalThis.speechSynthesis = g.speechSynthesis; globalThis.SpeechSynthesisUtterance = g.SpeechSynthesisUtterance; globalThis.confirm = () => true;
const errors = [];
window.addEventListener('error', (e) => errors.push(e.error?.message || e.message));
const wait = (ms = 30) => new Promise((r) => setTimeout(r, ms));
const q = (s) => window.document.querySelector(s);
const qa = (s) => [...window.document.querySelectorAll(s)];
const click = (el) => el && el.dispatchEvent(new window.Event('click', { bubbles: true }));
const dismiss = async () => { let n = 0; while (q('.celebrate-overlay') && n++ < 20) { const b = q('.celebrate-overlay .celebrate-btn'); if (b) click(b); await wait(300); } };

try {
  await import('../js/app.js'); await wait(60);
  q('#ob-name').value = 'Ada'; click(q('#ob-next')); await wait(40); click(qa('.grade-choice')[0]); await wait(20); click(q('#ob-start')); await wait(750);
  const unlockedBefore = qa('.skill-card:not(.locked)').length;
  click(qa('.skill-card:not(.locked)')[0]); await wait(50);
  let lg = 0; while (q('#lesson-next') && lg++ < 12) { const last = q('#lesson-next').textContent.includes('Practice'); click(q('#lesson-next')); await wait(40); if (last) break; }
  await dismiss();
  if (!q('.practice-wrap')) throw new Error('practice did not start');

  // answer correctly until the skill is mastered (finishSkill -> "Mastered" popup -> home)
  let solved = 0, loops = 0;
  while (q('.practice-wrap') && loops++ < 30) {
    // reveal the answer
    click(q('#show-btn')); await wait(20);
    let mg = 0; while (q('.sol-more') && !q('.sol-more').hidden && mg++ < 14) { click(q('.sol-more')); await wait(8); }
    const ansText = q('.sol-answer b')?.textContent?.trim();
    if (!ansText) throw new Error('no revealed answer');
    if (q('.choices')) {
      click(qa('.choice-btn').find((b) => b.textContent.trim() === ansText));
    } else {
      const typ = ansText.replace(/,/g, '').replace(/\s+/g, '');
      for (const ch of typ) click(qa('.key').find((b) => b.textContent === ch));
      await wait(8); click(q('#check-btn'));
    }
    solved++;
    await wait(150);
    await dismiss();          // dismiss level-up popup (~400ms)
    await wait(1600);         // wait past the 950ms advance / 1500ms level-up delay
    await dismiss();          // dismiss badge / mastery popups
    await wait(60);
    if (q('.home-hero')) break; // mastery completed -> returned to map
  }

  if (!q('.home-hero')) throw new Error('did not return to map after mastery (solved ' + solved + ')');
  const masteredCards = qa('.skill-card.mastered').length;
  const unlockedAfter = qa('.skill-card:not(.locked)').length;
  console.log(`  • solved ${solved} problems to master the skill`);
  console.log(`  • mastered cards on map: ${masteredCards}`);
  console.log(`  • unlocked skills: ${unlockedBefore} → ${unlockedAfter}`);
  if (masteredCards < 1) throw new Error('no skill shows as mastered');
  if (unlockedAfter <= unlockedBefore) throw new Error('mastery did not unlock the next skill');
  // check a badge was earned + stats updated
  const { S } = await import('../js/state.js');
  console.log(`  • stats: problemsCorrect=${S.progress.stats.problemsCorrect}, skillsMastered=${S.progress.stats.skillsMastered}, badges=${S.progress.badges.length}, level=${S.progress.level}, coins=${S.progress.coins}`);
  if (S.progress.stats.skillsMastered < 1) throw new Error('skillsMastered stat not incremented');
  if (S.progress.badges.length < 1) throw new Error('no badges earned');
} catch (e) {
  console.log('\n❌ MASTERY FAILED:', e.message);
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  process.exit(1);
}
if (errors.length) { console.log('\n⚠️ runtime errors:', errors.slice(0, 5).join(' | ')); process.exit(1); }
console.log('\n✅ MASTERY PASSED — skill mastered, next skill unlocked, badges & stats updated.');
process.exit(0);
