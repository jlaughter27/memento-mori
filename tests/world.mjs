// Exercises the explorable Pet World (#/world): the canvas mounts, keyboard
// movement advances the avatar, and collision keeps it inside the map.
import { JSDOM } from 'jsdom';
import fs from 'fs';
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', pretendToBeVisual: true, runScripts: 'outside-only' });
const { window } = dom; const g = window;
g.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0); g.cancelAnimationFrame = (id) => clearTimeout(id);
g.matchMedia = () => ({ matches: false, addEventListener() {} }); g.devicePixelRatio = 1; g.scrollTo = () => {}; g.print = () => {};
g.AudioContext = class { constructor(){this.currentTime=0;this.destination={};this.state='running';} resume(){} createOscillator(){return{frequency:{setValueAtTime(){}},connect(){},start(){},stop(){}};} createGain(){return{gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};} };
g.SpeechSynthesisUtterance = class {}; g.speechSynthesis = { cancel(){}, speak(){} };
// A permissive 2D-context stub: any method/property access returns a callable proxy,
// so canvas draw calls (incl. gradients) are harmless no-ops.
const ctxProxy = new Proxy(function () {}, { get: () => ctxProxy, set: () => true, apply: () => ctxProxy });
window.HTMLCanvasElement.prototype.getContext = () => ctxProxy;
globalThis.window = window; globalThis.document = window.document; globalThis.location = window.location; globalThis.localStorage = window.localStorage;
globalThis.HTMLCanvasElement = window.HTMLCanvasElement; globalThis.requestAnimationFrame = g.requestAnimationFrame; globalThis.cancelAnimationFrame = g.cancelAnimationFrame;
globalThis.innerWidth = 1024; globalThis.innerHeight = 768; globalThis.devicePixelRatio = 1; globalThis.AudioContext = g.AudioContext; globalThis.speechSynthesis = g.speechSynthesis; globalThis.SpeechSynthesisUtterance = g.SpeechSynthesisUtterance; globalThis.confirm = () => true; globalThis.print = g.print;
globalThis.KeyboardEvent = window.KeyboardEvent;
const errors = [];
window.addEventListener('error', (e) => errors.push(e.error?.message || e.message));
const wait = (ms = 30) => new Promise((r) => setTimeout(r, ms));
const q = (s) => window.document.querySelector(s); const qa = (s) => [...window.document.querySelectorAll(s)];
const click = (el) => el && el.dispatchEvent(new window.Event('click', { bubbles: true }));
const hashTo = (h) => { window.location.hash = h; window.dispatchEvent(new window.Event('hashchange')); };
const key = (type, k) => window.dispatchEvent(new window.KeyboardEvent(type, { key: k }));
const log = (m) => console.log('  •', m);
const solveOpen = async () => {
  let g = 0; while (q('.enc-btn-step') && !q('.enc-btn-step').hidden && g++ < 12) { click(q('.enc-btn-step')); await wait(15); }
  if (q('.enc-btn-go')) { click(q('.enc-btn-go')); await wait(40); }
  if (q('.enc-btn-show')) { click(q('.enc-btn-show')); await wait(20); }
  const el = q('.enc-sol-answer b'); if (!el) throw new Error('no answer in encounter');
  const a = el.textContent.trim();
  if (q('.enc-choices')) { click(qa('.enc-choice').find((b) => b.textContent.trim() === a) || qa('.enc-choice')[0]); }
  else { for (const ch of a.replace(/,/g, '').replace(/\s+/g, '')) { const k = qa('.enc-key').find((b) => b.textContent === ch); if (k) click(k); } await wait(10); click(q('.enc-btn-check')); }
  await wait(1100);
};
let step = 'init';
try {
  await import('../js/app.js'); await wait(60);
  q('#ob-name').value = 'Mia'; click(q('#ob-next')); await wait(40); click(qa('.grade-choice')[0]); await wait(20); click(q('#ob-start')); await wait(750);
  const { S } = await import('../js/state.js');

  step = 'particle system';
  const { createParticles } = await import('../js/game/particles.js');
  const fxT = createParticles({ max: 5 });
  fxT.dust(0, 0); fxT.sparkle(0, 0);
  if (fxT.count() !== 2) throw new Error('particles did not spawn');
  fxT.burst(0, 0, 20); // should be capped at max=5
  if (fxT.count() > 5) throw new Error('particle pool cap not enforced');
  fxT.update(2); // everything is older than its lifetime now
  if (fxT.count() !== 0) throw new Error('dead particles were not culled');
  log('particles: spawn, cap, and cull all work');

  step = 'pet art assets';
  const allPets = ['pet-cat', 'pet-dog', 'pet-bunny', 'pet-chick', 'pet-dragon', 'pet-fox', 'pet-penguin', 'pet-unicorn', 'pet-owl', 'pet-dino', 'pet-rocket'];
  for (const id of allPets) {
    const svg = fs.readFileSync(new URL('../assets/pets/' + id + '.svg', import.meta.url), 'utf8');
    if (!(svg.includes('<svg') && svg.includes('</svg>'))) throw new Error('bad svg: ' + id);
  }
  log('pet art: all 11 bespoke SVG sprites present and well-formed');

  step = 'collection album';
  hashTo('#/collection'); await wait(50);
  if (!q('.coll-wrap')) throw new Error('collection did not render');
  if (qa('.coll-section').length < 5) throw new Error('collection sections missing');
  if (!q('.coll-chip.have')) throw new Error('no owned chips (expected at least the starter pet)');
  if (!q('.coll-count')) throw new Error('collection counts missing');
  if (!q('.coll-summary') || !q('.cs-fill') || !/%/.test((q('.cs-pct') || {}).textContent || '')) throw new Error('collection progress meter missing');
  log('collection: ' + qa('.coll-section').length + ' sections, progress meter (' + q('.cs-pct').textContent + ') + counts render');

  step = 'parent world stats';
  hashTo('#/parent'); await wait(50);
  if (!q('#world-stats')) throw new Error('parent world-stats block missing');
  log('parent dashboard: world adventure stats block renders');

  step = 'pet home -> world link';
  hashTo('#/pet'); await wait(40);
  if (!q('#open-world')) throw new Error('Explore-the-World CTA missing on pet home');
  if (!q('.pet-friend')) throw new Error('friendship bar missing on pet home');
  click(q('#open-world')); await wait(60);

  step = 'world renders';
  if (!q('#world-canvas')) throw new Error('world canvas did not mount');
  if (!q('.world-stage')) throw new Error('world stage did not render');
  if (!q('#world-event') || !q('#world-event').textContent.trim()) throw new Error('daily event banner missing');
  log('world: canvas + stage mounted (Town Square); event: ' + q('#world-event').textContent.trim());

  step = 'keyboard movement';
  const x0 = S.progress.world.x; // 0 until the pet first moves
  key('keydown', 'ArrowRight');
  await wait(260); // let the fixed-timestep loop run several updates
  key('keyup', 'ArrowRight');
  const x1 = S.progress.world.x;
  if (!(x1 > 0)) throw new Error('moving right did not record a position');
  if (!(x1 > x0)) throw new Error('avatar did not advance to the right');
  log(`movement: avatar walked right (x ${Math.round(x0)} → ${Math.round(x1)})`);

  step = 'stays inside the map';
  key('keydown', 'ArrowLeft');
  await wait(400); // push hard into the left wall
  key('keyup', 'ArrowLeft');
  if (S.progress.world.x < 0) throw new Error('avatar left the map bounds');
  log(`collision: stayed on the map (x=${Math.round(S.progress.world.x)})`);

  step = 'math encounter opens';
  // park the pet next to Professor Owl (col10,row6 -> ~420,260) and re-enter the world
  S.progress.world.x = 420; S.progress.world.y = 288;
  hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  const coins0 = S.progress.coins, treats0 = S.progress.care.treats, friend0 = S.progress.care.friendship || 0;
  key('keydown', ' '); // action button -> interact with the nearest friend
  await wait(160);
  if (!q('.enc-card')) throw new Error('pressing Space by an NPC did not open a math encounter');
  log('encounter: walked up to an NPC and the tutor opened');

  step = 'solve the encounter';
  // click through the teach-first steps if shown
  let guard = 0;
  while (q('.enc-btn-step') && !q('.enc-btn-step').hidden && guard++ < 12) { click(q('.enc-btn-step')); await wait(15); }
  if (q('.enc-btn-go')) { click(q('.enc-btn-go')); await wait(40); }
  // reveal the answer, then enter it (choice or keypad)
  if (q('.enc-btn-show')) { click(q('.enc-btn-show')); await wait(20); }
  const ansEl = q('.enc-sol-answer b');
  if (!ansEl) throw new Error('could not read the encounter answer');
  const ans = ansEl.textContent.trim();
  if (q('.enc-choices')) {
    click(qa('.enc-choice').find((b) => b.textContent.trim() === ans) || qa('.enc-choice')[0]);
  } else {
    for (const ch of ans.replace(/,/g, '').replace(/\s+/g, '')) { const k = qa('.enc-key').find((b) => b.textContent === ch); if (k) click(k); }
    await wait(10); click(q('.enc-btn-check'));
  }
  await wait(1100); // onDone fires (~700ms) then the modal closes
  if (q('.enc-card')) throw new Error('encounter did not close after solving');
  if (S.progress.coins <= coins0) throw new Error('solving did not award coins');
  if (S.progress.care.treats <= treats0) throw new Error('solving did not drop loot (a treat)');
  if (!((S.progress.care.friendship || 0) > friend0)) throw new Error('solving did not raise friendship');
  log(`solved in-world: coins ${coins0}→${S.progress.coins}, treats ${treats0}→${S.progress.care.treats}, friendship +`);

  step = 'fast-travel map';
  click(q('#world-map')); await wait(40);
  if (!q('.wmap-overlay')) throw new Error('map overlay did not open');
  const meadowBtn = qa('.wmap-zone').find((b) => /meadow/i.test(b.textContent));
  if (!meadowBtn) throw new Error('meadow not listed on the map');
  click(meadowBtn); await wait(80);
  if (S.progress.world.map !== 'meadow') throw new Error('fast-travel did not move to the meadow');
  log('map: fast-traveled to ' + S.progress.world.map);

  step = 'warp tile';
  // park next to the Meadow's "Back to Town" warp (col13,row6 -> ~540,260) and re-enter
  S.progress.world.x = 540; S.progress.world.y = 288;
  hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  key('keydown', ' '); await wait(180);
  if (S.progress.world.map !== 'town') throw new Error('warp did not travel back to town');
  log('warp: stepped through a warp back to ' + S.progress.world.map);

  step = 'locked zone';
  S.progress.stats.skillsMastered = 0; // ensure Fraction Falls is gated
  click(q('#world-map')); await wait(40);
  let fallsBtn = qa('.wmap-zone').find((b) => /falls/i.test(b.textContent));
  if (!fallsBtn || !fallsBtn.classList.contains('locked')) throw new Error('Falls should be locked at 0 mastered');
  click(fallsBtn); await wait(50);
  if (S.progress.world.map === 'falls') throw new Error('traveled into a locked zone');
  window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' })); await wait(40);
  log('gating: Falls locked at 0 mastered (travel blocked)');

  step = 'unlock zone';
  S.progress.stats.skillsMastered = 2; // meet the gate
  click(q('#world-map')); await wait(40);
  fallsBtn = qa('.wmap-zone').find((b) => /falls/i.test(b.textContent));
  if (fallsBtn.classList.contains('locked')) throw new Error('Falls should unlock at 2 mastered');
  click(fallsBtn); await wait(80);
  if (S.progress.world.map !== 'falls') throw new Error('did not travel to the now-unlocked Falls');
  log('gating: Falls unlocked at 2 mastered → traveled in');

  step = 'review critter';
  const revId = (await import('../js/curriculum/index.js')).ALL_SKILLS[0].id;
  S.progress.skills[revId] = { attempts: 5, correct: 5, mastered: true, stars: 3, lastSeen: Date.now(), reviewStage: 0, reviewAt: Date.now() - 1000 };
  S.progress.world.map = 'town'; S.progress.world.x = 260; S.progress.world.y = 420; // beside the critter (col6,row10)
  hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  key('keydown', ' '); await wait(170);
  if (!q('.enc-card')) throw new Error('review critter did not start an encounter');
  // solve the review (teach is skipped for reviews)
  if (q('.enc-btn-show')) { click(q('.enc-btn-show')); await wait(20); }
  const rAns = q('.enc-sol-answer b');
  if (!rAns) throw new Error('could not read review answer');
  const ra = rAns.textContent.trim();
  if (q('.enc-choices')) { click(qa('.enc-choice').find((b) => b.textContent.trim() === ra) || qa('.enc-choice')[0]); }
  else { for (const ch of ra.replace(/,/g, '').replace(/\s+/g, '')) { const k = qa('.enc-key').find((b) => b.textContent === ch); if (k) click(k); } await wait(10); click(q('.enc-btn-check')); }
  await wait(1100);
  if (!(S.progress.skills[revId].reviewAt > Date.now())) throw new Error('solving the review did not reschedule it forward');
  log('review: due 🦋 started a review and rescheduled the skill forward');

  step = 'quest: accept';
  S.progress.world.map = 'town'; S.progress.world.x = 180; S.progress.world.y = 100; // beside Sunny (col4,row2)
  hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  key('keydown', ' '); await wait(160);
  if (!q('#dlg-ok')) throw new Error('quest dialog did not open');
  click(q('#dlg-ok')); await wait(60);
  if (!(S.progress.world.quests['q-town-helper'] && S.progress.world.quests['q-town-helper'].started)) throw new Error('quest was not accepted');
  log('quest: accepted from Sunny');

  step = 'quest: advance by solving';
  S.progress.world.x = 420; S.progress.world.y = 288; // beside Owl
  hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  key('keydown', ' '); await wait(170);
  if (!q('.enc-card')) throw new Error('owl encounter did not open');
  guard = 0; while (q('.enc-btn-step') && !q('.enc-btn-step').hidden && guard++ < 12) { click(q('.enc-btn-step')); await wait(15); }
  if (q('.enc-btn-go')) { click(q('.enc-btn-go')); await wait(40); }
  if (q('.enc-btn-show')) { click(q('.enc-btn-show')); await wait(20); }
  const qAns = q('.enc-sol-answer b'); if (!qAns) throw new Error('no answer to read');
  const qa2 = qAns.textContent.trim();
  if (q('.enc-choices')) { click(qa('.enc-choice').find((b) => b.textContent.trim() === qa2) || qa('.enc-choice')[0]); }
  else { for (const ch of qa2.replace(/,/g, '').replace(/\s+/g, '')) { const k = qa('.enc-key').find((b) => b.textContent === ch); if (k) click(k); } await wait(10); click(q('.enc-btn-check')); }
  await wait(1100);
  if (S.progress.world.quests['q-town-helper'].count !== 1) throw new Error('quest did not advance on solve');
  const hud = q('#world-status'); if (!hud || !/1\/2/.test(hud.textContent)) throw new Error('zone HUD did not show quest progress');
  log('quest: advanced to ' + S.progress.world.quests['q-town-helper'].count + ' by helping a friend (HUD shows ' + hud.textContent.trim() + ')');

  step = 'quest: complete + reward';
  S.progress.world.quests['q-town-helper'].count = 2; // reach the goal
  S.progress.world.x = 180; S.progress.world.y = 100; // back to Sunny
  hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  const coinsB = S.progress.coins;
  key('keydown', ' '); await wait(160);
  if (!q('#dlg-ok')) throw new Error('completion dialog did not open');
  click(q('#dlg-ok')); await wait(60);
  if (!S.progress.world.quests['q-town-helper'].done) throw new Error('quest not completed');
  if (!(S.progress.coins > coinsB)) throw new Error('quest reward coins not granted');
  log('quest: completed → reward granted (coins ' + coinsB + '→' + S.progress.coins + ')');

  step = 'boss battle';
  S.progress.world.map = 'meadow'; S.progress.world.x = 340; S.progress.world.y = 368; // beside King Abacus (col8,row8)
  hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  key('keydown', ' '); await wait(180);
  if (!q('.enc-card')) throw new Error('boss battle did not start');
  for (let i = 0; i < 3; i++) {
    if (!q('.enc-card')) throw new Error('boss round ' + (i + 1) + ' did not open');
    await solveOpen();
    await wait(480); // let the next round (or the win) settle
  }
  if (!(S.progress.world.bosses['boss-meadow'] && S.progress.world.bosses['boss-meadow'].done)) throw new Error('boss not defeated after 3 solves');
  const bhud = q('#world-status'); if (!bhud || !/✓/.test(bhud.textContent)) throw new Error('zone HUD did not show boss ✓');
  log('boss: King Abacus defeated in 3 rounds → reward granted (HUD shows ' + bhud.textContent.trim() + ')');

  step = 'progress stars';
  click(q('#world-map')); await wait(40);
  const meadowRow = qa('.wmap-zone').find((b) => /meadow/i.test(b.textContent));
  if (!meadowRow || !/⭐/.test(meadowRow.textContent)) throw new Error('Meadow should show a ⭐ after the boss is beaten');
  window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' })); await wait(40);
  log('progress stars: a defeated-boss zone shows ⭐ on the Map');

  step = 'daily bonus';
  S.progress.world.bonusDate = '2000-1-1'; // pretend the last bonus was long ago
  const coinsPreBonus = S.progress.coins;
  S.progress.world.map = 'town'; S.progress.world.x = 420; S.progress.world.y = 288; // owl
  hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  key('keydown', ' '); await wait(170);
  if (!q('.enc-card')) throw new Error('encounter for daily bonus did not open');
  await solveOpen(); await wait(700);
  if (S.progress.world.bonusDate === '2000-1-1') throw new Error('daily bonus date was not updated');
  if (!(S.progress.coins > coinsPreBonus)) throw new Error('daily bonus coins not granted');
  log('daily bonus: granted on first solve and dated today');

  step = 'second boss';
  S.progress.world.map = 'town'; S.progress.world.x = 300; S.progress.world.y = 480; // beside Count Bot (col7,row11)
  hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  key('keydown', ' '); await wait(180);
  if (!q('.enc-card')) throw new Error('Town boss did not start');
  for (let i = 0; i < 2; i++) { if (!q('.enc-card')) throw new Error('Town boss round ' + (i + 1) + ' missing'); await solveOpen(); await wait(480); }
  if (!(S.progress.world.bosses['boss-town'] && S.progress.world.bosses['boss-town'].done)) throw new Error('Town boss not defeated');
  if (!(S.progress.world.stickers || []).includes('boss-town')) throw new Error('boss sticker not awarded');
  log('second boss: Count Bot defeated in Town (+ sticker earned)');

  step = 'new zones';
  S.progress.stats.skillsMastered = 0; // Gardens open, Docks gated
  S.progress.world.map = 'town'; hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  click(q('#world-map')); await wait(40);
  const gardensBtn = qa('.wmap-zone').find((b) => /garden/i.test(b.textContent));
  const docksBtn = qa('.wmap-zone').find((b) => /dock/i.test(b.textContent));
  if (!gardensBtn) throw new Error('Geometry Gardens missing from the map');
  if (!docksBtn || !docksBtn.classList.contains('locked')) throw new Error('Decimal Docks should be locked at 0 mastered');
  click(gardensBtn); await wait(80);
  if (S.progress.world.map !== 'gardens') throw new Error('did not travel to Geometry Gardens');
  log('new zones: traveled to Geometry Gardens; Decimal Docks gated');

  step = 'npc dialogue';
  S.progress.world.map = 'town'; S.progress.world.x = 540; S.progress.world.y = 140; // beside Mayor Bramble (col13,row3)
  hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  key('keydown', ' '); await wait(160);
  if (!q('#dlg-line')) throw new Error('npc dialogue did not open');
  const firstLine = q('#dlg-line').textContent;
  click(q('#dlg-ok')); await wait(40);
  if (q('#dlg-line').textContent === firstLine) throw new Error('dialogue did not advance');
  let g2 = 0; while (q('#dlg-ok') && /Next/.test(q('#dlg-ok').textContent) && g2++ < 6) { click(q('#dlg-ok')); await wait(30); }
  click(q('#dlg-ok')); await wait(40); // "Bye"
  if (q('#dlg-line')) throw new Error('dialogue did not close');
  if (!(S.progress.world.npcSeen && S.progress.world.npcSeen['npc-mayor'])) throw new Error('npc not marked seen');
  log('npc: stepped through Mayor Bramble\'s lines and closed');

  step = 'world audio (sound-off path)';
  S.progress.settings.sound = false;
  S.progress.world.map = 'town'; S.progress.world.x = 220; S.progress.world.y = 420;
  hashTo('#/'); await wait(20); hashTo('#/world'); await wait(40);
  key('keydown', 'ArrowRight'); await wait(140); key('keyup', 'ArrowRight');
  S.progress.settings.sound = true; // restore
  log('audio: footstep/chime path ran with sound off (no throw)');

  step = 'pet switcher';
  if (!S.progress.owned.includes('pet-dog')) S.progress.owned.push('pet-dog');
  S.progress.world.map = 'town'; hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  click(q('#world-pet')); await wait(40);
  if (!q('.psw-grid')) throw new Error('pet switcher did not open');
  const dogPick = qa('.psw-pet').find((b) => b.dataset.id === 'pet-dog');
  if (!dogPick) throw new Error('owned dog not listed in the switcher');
  click(dogPick); await wait(80);
  if (S.profile.avatar.pet !== 'pet-dog') throw new Error('active pet did not switch');
  if (!q('#world-canvas')) throw new Error('world did not re-render after switching pet');
  log('pet switcher: swapped active pet to the dog; world re-rendered');

  step = 'final zone gate';
  S.progress.world.map = 'town'; hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  click(q('#world-map')); await wait(40);
  let castleBtn = qa('.wmap-zone').find((b) => /castle/i.test(b.textContent));
  if (!castleBtn) throw new Error("Champion's Castle missing from the map");
  if (!castleBtn.classList.contains('locked')) throw new Error('Castle should be locked before all bosses');
  window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' })); await wait(40);
  for (const id of ['boss-town', 'boss-meadow', 'boss-falls', 'boss-gardens', 'boss-docks']) S.progress.world.bosses[id] = { done: true };
  hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  click(q('#world-map')); await wait(40);
  castleBtn = qa('.wmap-zone').find((b) => /castle/i.test(b.textContent));
  if (castleBtn.classList.contains('locked')) throw new Error('Castle should unlock after all bosses');
  click(castleBtn); await wait(80);
  if (S.progress.world.map !== 'castle') throw new Error('did not travel to the unlocked Castle');
  log("final zone: Champion's Castle gated behind all bosses, then unlocked");

  step = 'star mini-game';
  S.progress.world.map = 'town'; S.progress.world.x = 260; S.progress.world.y = 100; // beside the Star Game (col6,row2)
  hashTo('#/'); await wait(20); hashTo('#/world'); await wait(60);
  key('keydown', ' '); await wait(160);
  if (!q('.sg-field')) throw new Error('star mini-game did not open');
  const coinsSG = S.progress.coins;
  for (let i = 0; i < 3; i++) { const s = q('.sg-star'); if (s) click(s); await wait(20); }
  if (+(q('#sg-score').textContent) < 3) throw new Error('stars were not scored');
  click(q('#sg-done')); await wait(60);
  if (q('.sg-field')) throw new Error('star mini-game did not close');
  if (!(S.progress.coins > coinsSG)) throw new Error('star mini-game did not award coins');
  log('star mini-game: caught stars and earned coins');

  step = 'back to home';
  click(q('#world-back')); await wait(40);
  if (!q('#content')) throw new Error('navigation away from world failed');
  log('back button returns home and tears the loop down');
} catch (e) {
  console.log('\n❌ WORLD FAILED at [' + step + ']:', e.message);
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  process.exit(1);
}
if (errors.length) { console.log('\n⚠️ runtime errors:', errors.slice(0, 5).join(' | ')); process.exit(1); }
console.log('\n✅ WORLD PASSED — the explorable Pet World mounts, moves, and collides.');
process.exit(0);
