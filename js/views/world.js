// views/world.js — the explorable Pet World.
// Walk your pet around a tile map with a following camera + collision; bump into
// friends and creatures that start a real math encounter (the adaptive tutor),
// and a "practice portal" that opens full practice. Built on the vanilla canvas
// engine in js/game/*. The loop self-stops when the canvas leaves the DOM.
import { S, persist, persistSoon } from '../state.js';
import { rewardsData } from '../curriculum/index.js';
import worldMaps from '../curriculum/world-maps.js';
import toysData from '../curriculum/toys-data.js';
import decorData from '../curriculum/decor-data.js';
import { createLoop } from '../game/loop.js';
import { createInput } from '../game/input.js';
import { createCamera } from '../game/camera.js';
import { createTileMap } from '../game/tilemap.js';
import { drawTile } from '../game/tiles.js';
import { createSprite, loadImage } from '../game/sprite.js';
import { createParticles } from '../game/particles.js';
import { openEncounter } from '../game/encounter.js';
import { awardTreat, dueReviews, scheduleReview, addCoins, addFriendship, bumpQuest } from '../gamification.js';
import { navigate, refreshChrome } from '../ui/shell.js';
import { sfx, speak } from '../ui/sound.js';
import { confetti, floatText } from '../ui/celebrations.js';
import { escapeHtml } from '../ui/dom.js';

const petEmoji = (id) => (rewardsData.pets.find((p) => p.id === id) || { emoji: '🐱' }).emoji;
// every pet now has a bespoke art file (with emoji as the ultimate fallback)
const PET_ART = {
  'pet-cat': './assets/pets/pet-cat.svg',
  'pet-dog': './assets/pets/pet-dog.svg',
  'pet-bunny': './assets/pets/pet-bunny.svg',
  'pet-fox': './assets/pets/pet-fox.svg',
  'pet-dragon': './assets/pets/pet-dragon.svg',
  'pet-penguin': './assets/pets/pet-penguin.svg',
  'pet-unicorn': './assets/pets/pet-unicorn.svg',
  'pet-owl': './assets/pets/pet-owl.svg',
  'pet-chick': './assets/pets/pet-chick.svg',
  'pet-dino': './assets/pets/pet-dino.svg',
  'pet-rocket': './assets/pets/pet-rocket.svg',
};

let active = null; // { destroy }
function teardown() { if (active) { try { active.destroy(); } catch (e) {} active = null; } }

// a gentle rotating "daily event" flavor (picked by the day of the year)
const EVENTS = [
  { id: 'double', emoji: '🪙', label: 'Double Coins Day!' }, { emoji: '🍪', label: 'Treat Day!' },
  { emoji: '✨', label: 'Sparkle Day!' }, { emoji: '⭐', label: 'Star Day!' },
  { emoji: '🎈', label: 'Party Day!' }, { emoji: '🌈', label: 'Rainbow Day!' },
  { emoji: '🎁', label: 'Surprise Day!' },
];
function todayEvent() {
  const d = new Date(); const start = new Date(d.getFullYear(), 0, 0);
  const day = Math.floor((d - start) / 86400000);
  return EVENTS[((day % EVENTS.length) + EVENTS.length) % EVENTS.length];
}

export function renderWorld(root) {
  teardown();
  const zoneId = (S.progress.world && worldMaps.zones[S.progress.world.map]) ? S.progress.world.map : 'town';
  const mapData = worldMaps.zones[zoneId];
  const map = createTileMap(mapData);
  const reduced = !!S.progress.settings.reducedMotion;
  const emoji = petEmoji(S.profile.avatar.pet);
  const ev = todayEvent();

  root.innerHTML = `
    <div class="world-wrap">
      <div class="world-event" id="world-event">${ev.emoji} Today: ${escapeHtml(ev.label)}</div>
      <header class="world-top">
        <button class="btn-link" id="world-back">← Home</button>
        <button class="btn-link" id="world-map">🗺️ Map</button>
        <button class="btn-link" id="world-pet">🐾 Pet</button>
        <span class="world-zone">${mapData.emoji || '🗺️'} ${escapeHtml(mapData.name)}</span>
        <span class="world-status" id="world-status" hidden></span>
        <span class="pet-coins">🪙 <b id="world-coins">${S.progress.coins}</b></span>
      </header>
      <div class="world-stage" id="world-stage">
        <canvas id="world-canvas"></canvas>
        <div class="world-bubble" id="world-bubble"></div>
        <div class="world-prompt" id="world-prompt" hidden></div>
      </div>
      <p class="world-hint">Use the arrow keys or tap the ground to walk. Walk up to a friend and press <b>Space</b>.</p>
    </div>`;

  const stage = root.querySelector('#world-stage');
  const canvas = root.querySelector('#world-canvas');
  const bubble = root.querySelector('#world-bubble');
  const prompt = root.querySelector('#world-prompt');
  const ctx = canvas.getContext('2d');

  const mapImg = map.prerender(drawTile); // pre-render the static map once
  const fx = createParticles(); // footstep dust, ambient sparkles, solve bursts
  let dustT = 0, sparkT = 0, stepT = 0, pendingBurst = false;

  // --- avatar: an animated sprite (bespoke art if available, else emoji) ---
  let sprite = createSprite({
    emoji,
    anims: {
      idle: { row: 0, frames: [0] },
      walkDown: { row: 0, frames: { from: 0, to: 3 }, fps: 8 },
      walkUp: { row: 1, frames: { from: 0, to: 3 }, fps: 8 },
      walkSide: { row: 2, frames: { from: 0, to: 3 }, fps: 8 },
    },
    defaultAnim: 'idle',
  });
  if (PET_ART[S.profile.avatar.pet]) {
    loadImage(PET_ART[S.profile.avatar.pet]).then((img) => {
      if (img) sprite = createSprite({ image: img, emoji });
    });
  }

  const w = S.progress.world || (S.progress.world = {});
  const av = {
    x: w.x > 0 ? w.x : (mapData.spawn.col + 0.5) * map.tile,
    y: w.y > 0 ? w.y : (mapData.spawn.row + 0.5) * map.tile,
    dir: w.facing || 'down', speed: 120, bob: 0, moving: false, moveTarget: null,
  };
  const HW = 12, HH = 10; // half collision box at the feet

  // --- camera + HiDPI canvas sizing ---
  const cam = createCamera(stage.clientWidth || 320, stage.clientHeight || 360, map.widthPx, map.heightPx);
  function fit() {
    const cssW = stage.clientWidth || 320, cssH = stage.clientHeight || 360;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
    canvas.style.width = cssW + 'px'; canvas.style.height = cssH + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cam.setView(cssW, cssH); cam.center(av.x, av.y);
  }
  fit();
  const onResize = () => fit();
  window.addEventListener('resize', onResize);

  const input = createInput(canvas);
  const loop = createLoop({ update, render, alive: () => canvas.isConnected });

  // --- a "review critter": if a mastered skill is due for spaced review, a friendly
  //     critter appears in the zone; helping it runs a quick review and reschedules it. ---
  function buildCritter() {
    const due = dueReviews(); if (!due.length) return null;
    const s = due[0]; const sp = mapData.spawn;
    return { type: 'review', col: Math.min(sp.col + 1, map.cols - 2), row: sp.row, emoji: '🦋',
      name: 'Review Butterfly', skillId: s.id, say: `Let's refresh ${s.title}! 🦋` };
  }
  let critter = buildCritter();
  const allThings = () => (critter ? mapData.objects.concat(critter) : mapData.objects);

  // --- interaction ---
  const objCenter = (o) => ({ x: (o.col + 0.5) * map.tile, y: (o.row + 0.5) * map.tile });
  function nearestObject() {
    let best = null, bd = map.tile * 0.95;
    for (const o of allThings()) {
      const c = objCenter(o);
      const d = Math.hypot(c.x - av.x, c.y - av.y);
      if (d < bd) { bd = d; best = o; }
    }
    return best;
  }
  let bubbleT = 0;
  function say(text) { bubble.textContent = text; bubble.classList.add('show'); bubbleT = 3.2; speak(text); }

  // A small treasure drop after solving an encounter: always a treat, sometimes a
  // brand-new toy or decoration — surfaced in the Pet Home/Playground later.
  function rollLoot() {
    const home = S.progress.home; home.toys = home.toys || [];
    const found = [];
    awardTreat(1); found.push({ emoji: '🍪', name: 'a treat' });
    if (Math.random() < 0.34) {
      const toy = toysData.toys.find((t) => t.cost > 0 && !home.toys.includes(t.id));
      if (toy) { home.toys.push(toy.id); found.push({ emoji: toy.emoji, name: toy.name }); }
    }
    if (Math.random() < 0.22) {
      const dec = decorData.decor.find((d) => !home.decor.includes(d.id));
      if (dec) { home.decor.push(dec.id); found.push({ emoji: dec.emoji, name: dec.name }); }
    }
    addFriendship(2); // helping a friend deepens your bond
    persistSoon();
    return found;
  }
  // the first solve of each day grants a little bonus chest (doubled on Double Coins Day)
  function maybeDailyBonus() {
    const d = new Date(); const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    if (S.progress.world.bonusDate === key) return 0;
    S.progress.world.bonusDate = key;
    const amt = todayEvent().id === 'double' ? 30 : 15;
    addCoins(amt); awardTreat(1); persistSoon();
    return amt;
  }

  // show this zone's quest/boss state in the header
  function updateStatus() {
    const el = root.querySelector('#world-status'); if (!el) return;
    const bits = [];
    const q = mapData.quest;
    if (q) { const r = questRec(q.id); if (r.done) bits.push(`${q.emoji} ✓`); else if (r.started) bits.push(`${q.emoji} ${r.count}/${q.goal}`); }
    const boss = mapData.objects.find((o) => o.type === 'boss');
    if (boss) { const r = bossRec(boss.id); bits.push(`${boss.emoji} ${r.done ? '✓' : '⚔️'}`); }
    el.textContent = bits.join('   '); el.hidden = bits.length === 0;
  }

  let paused = false;
  function interact(o) {
    if (!o || paused) return;
    if (o.type === 'portal') { say(o.say || 'Off we go!'); sfx.star(); teardown(); navigate(o.to || '#/'); return; }
    if (o.type === 'warp') { sfx.star(); travel(o.to, o.toSpawn); return; }
    if (o.type === 'encounter') { startEncounter(o); return; }
    if (o.type === 'review') { startReview(o); return; }
    if (o.type === 'quest') { openQuestDialog(); return; }
    if (o.type === 'minigame') { openStarGame(); return; }
    if (o.type === 'boss') { startBoss(o); return; }
    if (o.type === 'npc' && o.lines && o.lines.length) { openNpcDialog(o); return; }
    sfx.tap(); say(o.say || `${o.name}: Hi friend!`);
  }

  // --- a simple NPC dialogue box: step through a script with Next ▶, remember "seen" ---
  function openNpcDialog(o) {
    if (paused) return;
    const lines = o.lines;
    const seen = S.progress.world.npcSeen || (S.progress.world.npcSeen = {});
    paused = true; loop.stop(); prompt.hidden = true;
    let i = 0;
    const prev = document.activeElement;
    const ov = document.createElement('div'); ov.className = 'enc-overlay';
    ov.innerHTML = `
      <div class="enc-card" role="dialog" aria-modal="true" aria-label="${escapeHtml(o.name || 'Friend')}">
        <div class="enc-head"><span class="enc-npc">${o.emoji || '🙂'}</span><span class="enc-title">${escapeHtml(o.name || 'Friend')}</span><button class="enc-close" id="dlg-x" aria-label="Close">✕</button></div>
        <div class="enc-intro" id="dlg-line"></div>
        <button class="enc-btn-big" id="dlg-ok"></button>
      </div>`;
    document.body.appendChild(ov);
    const lineEl = ov.querySelector('#dlg-line'); const okBtn = ov.querySelector('#dlg-ok');
    const render = () => { lineEl.textContent = lines[i]; okBtn.textContent = i < lines.length - 1 ? 'Next ▶' : 'Bye! 👋'; speak(lines[i]); };
    const close = () => {
      if (!ov.parentNode) return;
      ov.remove(); document.removeEventListener('keydown', onKey);
      paused = false; if (prev && prev.focus) prev.focus();
      if (canvas.isConnected) loop.start();
    };
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); close(); } };
    document.addEventListener('keydown', onKey);
    ov.querySelector('#dlg-x').addEventListener('click', close);
    ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
    okBtn.addEventListener('click', () => {
      sfx.tap();
      if (i < lines.length - 1) { i++; render(); }
      else { seen[o.id || o.name] = true; persistSoon(); close(); }
    });
    render();
    if (okBtn.focus) okBtn.focus();
  }

  // --- zone "boss": a multi-problem gauntlet (solve N in a row) for a trophy ---
  const bossRec = (id) => { const bs = S.progress.world.bosses || (S.progress.world.bosses = {}); return bs[id] || (bs[id] = { done: false }); };
  function startBoss(o) {
    if (paused) return;
    if (bossRec(o.id).done) { sfx.tap(); say((o.lines && o.lines.done) || 'You already beat me! 🏆'); return; }
    const total = o.questions || 3;
    let solved = 0;
    const runOne = () => {
      paused = true; loop.stop(); prompt.hidden = true;
      let roundSolved = false;
      openEncounter({
        host: document.body, strand: o.strand, teach: 'never',
        title: `${o.name} ⚔️ ${solved + 1}/${total}`, npcEmoji: o.emoji,
        intro: solved === 0 ? (o.say || 'Beat my puzzles!') : `${solved} down, ${total - solved} to go!`,
        onDone: () => { roundSolved = true; solved++; },
        onClose: () => {
          paused = false; if (canvas.isConnected) loop.start();
          const b = root.querySelector('#world-coins'); if (b) b.textContent = S.progress.coins; refreshChrome();
          if (roundSolved) { if (solved >= total) winBoss(o); else setTimeout(runOne, 320); }
          // if the player bailed without solving, the boss simply isn't beaten
        },
      });
    };
    runOne();
  }
  function winBoss(o) {
    bossRec(o.id).done = true;
    bumpQuest('boss');
    if (o.sticker) { const st = S.progress.world.stickers || (S.progress.world.stickers = []); if (!st.includes(o.id)) st.push(o.id); }
    if (o.reward && o.reward.coins) addCoins(o.reward.coins);
    if (o.reward && o.reward.decor && !S.progress.home.decor.includes(o.reward.decor)) S.progress.home.decor.push(o.reward.decor);
    persist(); refreshChrome();
    if (!reduced) { confetti(120); pendingBurst = false; fx.burst(av.x, av.y - map.tile * 0.2, 24); }
    say((o.lines && o.lines.win) || `You beat ${o.name}! 🏆`);
    const b = root.querySelector('#world-coins'); if (b) b.textContent = S.progress.coins;
    updateStatus();
    if (allBossesDone() && !S.progress.world.champion) {
      S.progress.world.champion = true; persist();
      if (!reduced) confetti(200);
      setTimeout(() => say('🏆 You are the MathQuest Champion! 👑'), 500);
    }
  }

  // --- a tiny zone quest: accept from an NPC, advance by helping math friends,
  //     complete for a collectible that lands in the Pet Home. ---
  const questRec = (id) => { const qs = S.progress.world.quests || (S.progress.world.quests = {}); return qs[id] || (qs[id] = { started: false, count: 0, done: false }); };
  function bumpQuest() {
    const q = mapData.quest; if (!q) return;
    const rec = questRec(q.id);
    if (rec.started && !rec.done) { rec.count++; persistSoon(); updateStatus(); }
  }
  function openQuestDialog() {
    const q = mapData.quest; if (!q || paused) return;
    paused = true; loop.stop(); prompt.hidden = true;
    const rec = questRec(q.id);
    let line, btn, action = null;
    if (!rec.started) { line = q.lines.intro; btn = 'Okay! 🐾'; action = () => { rec.started = true; persistSoon(); }; }
    else if (rec.count < q.goal && !rec.done) { line = q.lines.active.replace('{n}', rec.count); btn = 'On it!'; }
    else if (!rec.done) {
      line = q.lines.done; btn = 'Yay! 🎉';
      action = () => {
        rec.done = true;
        if (q.reward.coins) addCoins(q.reward.coins);
        if (q.reward.decor && !S.progress.home.decor.includes(q.reward.decor)) S.progress.home.decor.push(q.reward.decor);
        persist(); if (!reduced) confetti(60);
      };
    } else { line = q.lines.thanks; btn = 'Bye! 👋'; }

    const prev = document.activeElement;
    const ov = document.createElement('div'); ov.className = 'enc-overlay';
    ov.innerHTML = `
      <div class="enc-card" role="dialog" aria-modal="true" aria-label="${escapeHtml(q.name || 'Quest')}">
        <div class="enc-head"><span class="enc-npc">${q.emoji || '🐥'}</span><span class="enc-title">${escapeHtml(q.name || 'Quest')}</span><button class="enc-close" id="dlg-x" aria-label="Close">✕</button></div>
        <div class="enc-intro">${escapeHtml(line)}</div>
        <button class="enc-btn-big" id="dlg-ok">${escapeHtml(btn)}</button>
      </div>`;
    document.body.appendChild(ov);
    const close = () => {
      if (!ov.parentNode) return;
      ov.remove(); document.removeEventListener('keydown', onKey);
      paused = false; if (prev && prev.focus) prev.focus();
      const b = root.querySelector('#world-coins'); if (b) b.textContent = S.progress.coins;
      refreshChrome(); updateStatus(); if (canvas.isConnected) loop.start();
    };
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); close(); } };
    document.addEventListener('keydown', onKey);
    ov.querySelector('#dlg-x').addEventListener('click', close);
    ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
    ov.querySelector('#dlg-ok').addEventListener('click', () => { if (action) action(); sfx.tap(); close(); });
    const f = ov.querySelector('#dlg-ok'); if (f && f.focus) f.focus();
  }

  function startReview(o) {
    paused = true; loop.stop(); prompt.hidden = true;
    openEncounter({
      host: document.body, skillId: o.skillId, teach: 'never',
      title: 'Quick Review! 🦋', npcEmoji: '🦋', intro: o.say,
      onDone: () => {
        const found = rollLoot(); const extra = found.filter((f) => f.emoji !== '🍪');
        scheduleReview(o.skillId, null); // push this skill to its next review interval
        pendingBurst = true;
        critter = buildCritter();        // surface the next due review, if any
        say(extra.length ? `Great memory! You found ${extra.map((f) => f.emoji).join(' ')}! 🎉` : 'Great memory! 🍪');
        const db = maybeDailyBonus(); if (db) say(`🎁 Daily bonus! +${db} 🪙 +1 🍪`);
        sfx.coin();
        const b = root.querySelector('#world-coins'); if (b) b.textContent = S.progress.coins;
        refreshChrome();
      },
      onClose: () => {
        paused = false;
        const b = root.querySelector('#world-coins'); if (b) b.textContent = S.progress.coins;
        refreshChrome();
        if (pendingBurst && !reduced) fx.burst(av.x, av.y - map.tile * 0.2, 16);
        pendingBurst = false;
        if (canvas.isConnected) loop.start();
      },
    });
  }

  // Gentle mastery gates: a zone may require N total skills mastered or N bosses beaten.
  const masteredCount = () => (S.progress.stats && S.progress.stats.skillsMastered) || 0;
  function bossesBeatenCount() {
    let n = 0;
    for (const id of worldMaps.order) for (const o of (worldMaps.zones[id].objects || [])) {
      if (o.type === 'boss' && ((S.progress.world.bosses || {})[o.id] || {}).done) n++;
    }
    return n;
  }
  // find a boss object by id across every zone (for boss-gated labels)
  function bossById(id) {
    for (const zid of worldMaps.order) {
      const o = (worldMaps.zones[zid].objects || []).find((x) => x.type === 'boss' && x.id === id);
      if (o) return o;
    }
    return null;
  }
  const bossDone = (id) => !!((S.progress.world.bosses || {})[id] || {}).done;
  function zoneUnlocked(z) {
    if (!z || !z.lock) return true;
    if (z.lock.mastered && masteredCount() < z.lock.mastered) return false;
    if (z.lock.bosses && bossesBeatenCount() < z.lock.bosses) return false;
    if (z.lock.boss && !bossDone(z.lock.boss)) return false; // a specific boss gates access (Pokémon-style)
    return true;
  }
  function lockText(z) {
    if (z.lock.boss) { const b = bossById(z.lock.boss); return `Defeat ${b ? `${b.emoji} ${b.name}` : 'the keeper'} to open`; }
    if (z.lock.bosses) { const n = Math.max(0, z.lock.bosses - bossesBeatenCount()); return `Beat ${n} more boss${n !== 1 ? 'es' : ''} to open`; }
    const n = Math.max(0, (z.lock.mastered || 0) - masteredCount()); return `Master ${n} more skill${n !== 1 ? 's' : ''} to open`;
  }
  // per-zone completion: a star for a finished quest and a star for a beaten boss
  function zoneStars(id) {
    const z = worldMaps.zones[id]; let earned = 0, total = 0;
    if (z.quest) { total++; if (((S.progress.world.quests || {})[z.quest.id] || {}).done) earned++; }
    const boss = (z.objects || []).find((o) => o.type === 'boss');
    if (boss) { total++; if (((S.progress.world.bosses || {})[boss.id] || {}).done) earned++; }
    return { earned, total };
  }
  function allBossesDone() {
    for (const id of worldMaps.order) for (const o of (worldMaps.zones[id].objects || [])) {
      if (o.type === 'boss' && !((S.progress.world.bosses || {})[o.id] || {}).done) return false;
    }
    return true;
  }

  // Travel to another zone: park the pet at the destination spawn and re-enter.
  function travel(toZone, toSpawn) {
    const z = worldMaps.zones[toZone]; if (!z) return;
    if (!zoneUnlocked(z)) { sfx.wrong(); say(`🔒 ${lockText(z)} ${z.name}!`); return; }
    const t = z.tile || 40; const sp = toSpawn || z.spawn;
    S.progress.world.map = toZone;
    S.progress.world.x = (sp.col + 0.5) * t;
    S.progress.world.y = (sp.row + 0.5) * t;
    S.progress.world.facing = 'down';
    if (!(S.progress.world.visited || []).includes(toZone)) { (S.progress.world.visited || (S.progress.world.visited = [])).push(toZone); bumpQuest('explore'); }
    persistSoon();
    sfx.chime(); // a gentle arrival cue
    teardown(); renderWorld(root);
  }

  // Swap the active pet from the World (only pets you own).
  function openPetSwitch() {
    if (paused) return;
    paused = true; loop.stop(); prompt.hidden = true;
    const prev = document.activeElement;
    const owned = rewardsData.pets.filter((p) => p.id === 'pet-cat' || (S.progress.owned || []).includes(p.id));
    const ov = document.createElement('div'); ov.className = 'wmap-overlay';
    ov.innerHTML = `
      <div class="wmap-card" role="dialog" aria-modal="true" aria-label="Choose your pet">
        <div class="wmap-head"><span>🐾 Choose your pet</span><button class="enc-close" id="psw-x" aria-label="Close">✕</button></div>
        <div class="psw-grid">${owned.map((p) => `<button class="psw-pet ${p.id === S.profile.avatar.pet ? 'on' : ''}" data-id="${p.id}"><span class="psw-emoji">${p.emoji}</span><span class="psw-name">${escapeHtml(p.name)}</span></button>`).join('')}</div>
      </div>`;
    document.body.appendChild(ov);
    const close = () => { if (!ov.parentNode) return; ov.remove(); document.removeEventListener('keydown', onKey); paused = false; if (prev && prev.focus) prev.focus(); if (canvas.isConnected) loop.start(); };
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); close(); } };
    document.addEventListener('keydown', onKey);
    ov.querySelector('#psw-x').addEventListener('click', close);
    ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
    ov.querySelectorAll('.psw-pet').forEach((b) => b.addEventListener('click', () => {
      S.profile.avatar.pet = b.dataset.id; persist(); refreshChrome(); sfx.star();
      ov.remove(); document.removeEventListener('keydown', onKey); paused = false;
      teardown(); renderWorld(root); // reload the avatar art for the new pet
    }));
    const f = ov.querySelector('.psw-pet'); if (f && f.focus) f.focus();
  }

  // A quick "Star Catch" mini-game: tap stars before time runs out for coins.
  function openStarGame() {
    if (paused) return;
    paused = true; loop.stop(); prompt.hidden = true;
    const prev = document.activeElement;
    let score = 0, time = 15, timer = null;
    const ov = document.createElement('div'); ov.className = 'enc-overlay';
    ov.innerHTML = `
      <div class="enc-card" role="dialog" aria-modal="true" aria-label="Star Catch">
        <div class="enc-head"><span class="enc-npc">🌟</span><span class="enc-title">Star Catch</span><button class="enc-close" id="sg-x" aria-label="Close">✕</button></div>
        <div class="sg-bar"><span>⭐ <b id="sg-score">0</b></span><span>⏱️ <b id="sg-time">15</b></span></div>
        <div class="sg-field" id="sg-field"></div>
        <button class="enc-btn-big" id="sg-done">Done</button>
      </div>`;
    document.body.appendChild(ov);
    const field = ov.querySelector('#sg-field'), scoreEl = ov.querySelector('#sg-score'), timeEl = ov.querySelector('#sg-time');
    function spawnStar() {
      const b = document.createElement('button'); b.className = 'sg-star'; b.textContent = '⭐'; b.setAttribute('aria-label', 'star');
      b.style.left = (8 + Math.random() * 82) + '%'; b.style.top = (8 + Math.random() * 76) + '%';
      b.addEventListener('click', () => { score++; scoreEl.textContent = score; sfx.tap(); b.remove(); spawnStar(); });
      field.appendChild(b);
    }
    for (let i = 0; i < 5; i++) spawnStar();
    function finish() {
      if (!ov.parentNode) return;
      if (timer) clearInterval(timer); timer = null;
      if (score > 0) { addCoins(score); sfx.coin(); }
      ov.remove(); document.removeEventListener('keydown', onKey); paused = false; if (prev && prev.focus) prev.focus();
      const cb = root.querySelector('#world-coins'); if (cb) cb.textContent = S.progress.coins; refreshChrome();
      say(`🌟 You caught ${score} star${score === 1 ? '' : 's'}! +${score} 🪙`);
      if (canvas.isConnected) loop.start();
    }
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); finish(); } };
    document.addEventListener('keydown', onKey);
    ov.querySelector('#sg-x').addEventListener('click', finish);
    ov.querySelector('#sg-done').addEventListener('click', finish);
    timer = setInterval(() => { time--; if (timeEl) timeEl.textContent = time; if (time <= 0) finish(); }, 1000);
  }

  // Fast-travel: a simple accessible menu of zones.
  function openMap() {
    if (paused) return;
    paused = true; loop.stop(); prompt.hidden = true;
    const prev = document.activeElement;
    const ov = document.createElement('div');
    ov.className = 'wmap-overlay';
    ov.innerHTML = `
      <div class="wmap-card" role="dialog" aria-modal="true" aria-label="Travel map">
        <div class="wmap-head"><span>🗺️ Where to?</span><button class="enc-close" id="wmap-x" aria-label="Close">✕</button></div>
        <div class="wmap-list">${worldMaps.order.map((id) => {
          const z = worldMaps.zones[id]; const here = id === zoneId; const locked = !zoneUnlocked(z);
          const s = zoneStars(id); const stars = s.total ? '⭐'.repeat(s.earned) + '☆'.repeat(s.total - s.earned) : '';
          return `<button class="wmap-zone ${here ? 'here' : ''} ${locked ? 'locked' : ''}" data-id="${id}" ${here ? 'aria-current="true"' : ''} ${locked ? 'aria-disabled="true"' : ''}>
            <span class="wmap-emoji">${locked ? '🔒' : (z.emoji || '🗺️')}</span>
            <span class="wmap-name">${escapeHtml(z.name)}<span class="wmap-stars">${stars}</span></span>
            <span class="wmap-go">${here ? 'You are here' : locked ? lockText(z) : 'Travel →'}</span></button>`;
        }).join('')}</div>
      </div>`;
    document.body.appendChild(ov);
    const close = () => {
      if (!ov.parentNode) return;
      ov.remove(); document.removeEventListener('keydown', onKey);
      paused = false; if (prev && prev.focus) prev.focus();
      if (canvas.isConnected) loop.start();
    };
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); close(); } };
    document.addEventListener('keydown', onKey);
    ov.querySelector('#wmap-x').addEventListener('click', close);
    ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
    ov.querySelectorAll('.wmap-zone').forEach((b) => b.addEventListener('click', () => {
      const id = b.dataset.id; if (id === zoneId) { close(); return; }
      if (!zoneUnlocked(worldMaps.zones[id])) { sfx.wrong(); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); return; }
      sfx.star(); ov.remove(); document.removeEventListener('keydown', onKey); paused = false;
      travel(id, worldMaps.zones[id].spawn);
    }));
    const first = ov.querySelector('.wmap-zone'); if (first && first.focus) first.focus();
  }
  function startEncounter(o) {
    paused = true; loop.stop(); prompt.hidden = true;
    openEncounter({
      host: document.body,
      strand: o.strand, skillId: o.skillId,
      title: o.name || 'Math Friend', npcEmoji: o.emoji, intro: o.say,
      onDone: () => {
        // reward + a happy flourish back in the world
        const found = rollLoot();
        const extra = found.filter((f) => f.emoji !== '🍪');
        say(extra.length ? `You found ${extra.map((f) => f.emoji).join(' ')} + a treat! 🎉` : 'You earned a treat! 🍪');
        const db = maybeDailyBonus(); if (db) say(`🎁 Daily bonus! +${db} 🪙 +1 🍪`);
        sfx.coin();
        if (!reduced) { confetti(36); const r = stage.getBoundingClientRect(); floatText(extra[0] ? extra[0].emoji : '🍪', r.left + r.width / 2, r.top + 40, 'coin'); }
        pendingBurst = true; bumpQuest(); // helping a friend advances the zone quest
        const b = root.querySelector('#world-coins'); if (b) b.textContent = S.progress.coins;
        refreshChrome();
      },
      onClose: () => {
        paused = false;
        const b = root.querySelector('#world-coins'); if (b) b.textContent = S.progress.coins;
        refreshChrome();
        if (pendingBurst && !reduced) fx.burst(av.x, av.y - map.tile * 0.2, 16);
        pendingBurst = false;
        if (canvas.isConnected) loop.start();
      },
    });
  }

  const blocked = (x, y) =>
    map.isSolidPx(x - HW, y - HH) || map.isSolidPx(x + HW, y - HH) ||
    map.isSolidPx(x - HW, y + HH) || map.isSolidPx(x + HW, y + HH);

  function update(dt) {
    let ix = input.dir().x, iy = input.dir().y;
    const tap = input.takeTap();
    if (tap) {
      av.moveTarget = { x: tap.x + cam.x, y: tap.y + cam.y };
      const near = nearestObject();
      if (near) { const c = objCenter(near); if (Math.hypot(c.x - av.moveTarget.x, c.y - av.moveTarget.y) < map.tile * 0.7) { interact(near); av.moveTarget = null; } }
    }
    if (ix || iy) av.moveTarget = null;
    if (!ix && !iy && av.moveTarget) {
      const dx = av.moveTarget.x - av.x, dy = av.moveTarget.y - av.y, d = Math.hypot(dx, dy);
      if (d < 3) av.moveTarget = null; else { ix = dx / d; iy = dy / d; }
    }

    av.moving = !!(ix || iy);
    if (av.moving) {
      if (Math.abs(ix) > Math.abs(iy)) av.dir = ix > 0 ? 'right' : 'left';
      else if (iy) av.dir = iy > 0 ? 'down' : 'up';
      const nx = av.x + ix * av.speed * dt, ny = av.y + iy * av.speed * dt;
      if (!blocked(nx, av.y)) av.x = nx; else av.moveTarget = null;
      if (!blocked(av.x, ny)) av.y = ny; else av.moveTarget = null;
      av.x = Math.max(HW, Math.min(av.x, map.widthPx - HW));
      av.y = Math.max(HH, Math.min(av.y, map.heightPx - HH));
      av.bob += dt * 9;
      w.x = av.x; w.y = av.y; w.facing = av.dir; persistSoon();
    } else { av.bob += dt * 3; }

    // drive the sprite animation by movement state
    sprite.setAnim(!av.moving ? 'idle' : av.dir === 'up' ? 'walkUp' : av.dir === 'down' ? 'walkDown' : 'walkSide');
    sprite.update(dt);

    if (input.takeAction()) interact(nearestObject());

    // a soft footstep tick while walking (respects the sound setting via sfx)
    if (av.moving) { stepT -= dt; if (stepT <= 0) { sfx.step(); stepT = 0.4; } } else stepT = 0;

    // juice: footstep dust while walking + occasional ambient sparkles
    if (!reduced) {
      fx.update(dt);
      if (av.moving) { dustT -= dt; if (dustT <= 0) { fx.dust(av.x, av.y + map.tile * 0.30); dustT = 0.12; } }
      sparkT -= dt; if (sparkT <= 0) { fx.sparkle(av.x + (Math.random() - 0.5) * cam.vw * 0.5, av.y - 30 - Math.random() * 60); sparkT = 0.55 + Math.random() * 0.6; }
    }

    cam.follow(av.x, av.y, reduced ? 1 : 0.18);
    if (bubbleT > 0) { bubbleT -= dt; if (bubbleT <= 0) bubble.classList.remove('show'); }

    const near = nearestObject();
    const verb = near ? ({ portal: 'Enter', encounter: 'Math!', warp: 'Travel', review: 'Review!', quest: 'Quest!', boss: 'Battle!', minigame: 'Play!', npc: 'Talk' }[near.type] || 'Talk') : '';
    if (near && !paused) { prompt.hidden = false; prompt.textContent = `${near.emoji} ${verb} — press Space`; }
    else prompt.hidden = true;
  }

  function render() {
    const vw = cam.vw, vh = cam.vh;
    ctx.clearRect(0, 0, vw, vh);
    ctx.save();
    ctx.translate(-Math.round(cam.x), -Math.round(cam.y));
    ctx.drawImage(mapImg, 0, 0);

    // interactable objects (with a soft glow ring); the review critter drifts + glows gold
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    for (const o of allThings()) {
      const c = objCenter(o);
      let ox = c.x, oy = c.y + map.tile * 0.32;
      if (o.type === 'review' && !reduced) { ox += Math.cos(av.bob * 0.5) * 10; oy += Math.sin(av.bob) * 6 - 6; }
      if (!reduced) { ctx.fillStyle = o.type === 'review' ? 'rgba(255,214,102,.5)' : 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.arc(ox, oy, map.tile * 0.32, 0, Math.PI * 2); ctx.fill(); }
      ctx.font = `${Math.round(map.tile * 0.8)}px serif`;
      ctx.fillText(o.emoji, ox, oy);
    }

    // avatar: shadow + animated sprite, with a gentle hop
    ctx.fillStyle = 'rgba(0,0,0,.18)';
    ctx.beginPath(); ctx.ellipse(av.x, av.y + map.tile * 0.32, map.tile * 0.28, map.tile * 0.12, 0, 0, Math.PI * 2); ctx.fill();
    const hop = (reduced || !av.moving) ? 0 : Math.abs(Math.sin(av.bob)) * 3;
    sprite.draw(ctx, av.x, av.y + map.tile * 0.30 - hop, map.tile * 1.05, av.dir === 'left');

    if (!reduced) fx.draw(ctx); // particles live in world space, above the ground

    ctx.restore();
  }

  loop.start();
  updateStatus();
  active = { destroy() { loop.stop(); input.destroy(); window.removeEventListener('resize', onResize); } };
  root.querySelector('#world-back').addEventListener('click', () => { sfx.tap(); teardown(); navigate('#/'); });
  root.querySelector('#world-map').addEventListener('click', () => { sfx.tap(); openMap(); });
  root.querySelector('#world-pet').addEventListener('click', () => { sfx.tap(); openPetSwitch(); });
}
