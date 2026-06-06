// views/pet.js — Pet Home: care for your companion (happiness + feeding + play).
import { S, persist } from '../state.js';
import { rewardsData } from '../curriculum/index.js';
import decorData from '../curriculum/decor-data.js';
import { tickCare, petMood, patPet, playPet, feedPet, buyTreats, addCoins } from '../gamification.js';
import { navigate, refreshChrome } from '../ui/shell.js';
import { sfx, speak } from '../ui/sound.js';
import { floatText, sparkle, popup, confetti } from '../ui/celebrations.js';
import { escapeHtml } from '../ui/dom.js';

const petById = (id) => rewardsData.pets.find((p) => p.id === id) || { emoji: '🐱', name: 'Pixel' };

const MOOD_LINE = {
  celebrate: ['I love it here with you! 💖', 'Best day ever! 🎉', 'You\'re my favorite! 🥰'],
  happy: ['I\'m so happy you\'re here! 😊', 'Let\'s play! 🎾', 'You came back! 🐾'],
  idle: ['Hi friend… 🙂', 'Want to hang out?', 'I missed you a little.'],
  encourage: ['I missed you lots… 🥺', 'Can we play? I feel lonely.', 'A snack would be nice…'],
};
const line = (mood) => { const a = MOOD_LINE[mood] || MOOD_LINE.idle; return a[Math.floor(Math.random() * a.length)]; };

export function renderPet(root) {
  tickCare();
  const pet = petById(S.profile.avatar.pet);
  const c = S.progress.care;

  root.innerHTML = `
    <div class="pet-wrap">
      <header class="pet-top">
        <h1 class="pet-h1">${escapeHtml(pet.name)}'s Home 🏡</h1>
        <span class="pet-coins">🪙 <b id="pet-coins">${S.progress.coins}</b></span>
      </header>

      <div class="pet-room card-soft" id="pet-room" style="background:${roomBg()}">
        <div class="pet-decor" id="pet-decor">${decorEmojis()}</div>
        <div class="pet-bubble" id="pet-bubble"></div>
        <div class="pet-sprite" id="pet-sprite">${pet.emoji}</div>
        <div class="pet-floor"></div>
      </div>

      <div class="pet-meters">
        ${meter('Happiness', '💖', 'happy', c.happiness)}
        ${meter('Fullness', '🍖', 'full', c.fullness)}
      </div>

      <div class="pet-actions">
        <button class="pet-btn" id="act-pat"><span>✋</span>Pat</button>
        <button class="pet-btn" id="act-play"><span>🎾</span>Play</button>
        <button class="pet-btn" id="act-feed"><span>🍎</span>Feed<small id="treat-count">${c.treats} treats</small></button>
      </div>

      <div class="treat-shop card-soft">
        <div class="ts-head">🛒 Treat Shop</div>
        <div class="ts-row">
          <button class="btn btn-ghost ts-buy" data-n="1" data-cost="5">1 treat · 🪙 5</button>
          <button class="btn btn-ghost ts-buy" data-n="5" data-cost="20">5 treats · 🪙 20</button>
        </div>
        <button class="btn-link" id="more-pets">🐾 Get more pets &amp; outfits in Rewards →</button>
      </div>

      <div class="decorate card-soft">
        <div class="ts-head">🎨 Decorate the home</div>
        <div class="dec-sub">Rooms</div>
        <div class="room-row" id="room-row">${decorData.rooms.map(roomCard).join('')}</div>
        <div class="dec-sub">Decorations</div>
        <div class="decor-grid" id="decor-grid">${decorData.decor.map(decorCard).join('')}</div>
      </div>
    </div>`;

  const bubble = root.querySelector('#pet-bubble');
  const sprite = root.querySelector('#pet-sprite');
  const say = (text) => { bubble.textContent = text; bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop'); speak(text); };
  const react = (delta, kind) => {
    sprite.classList.remove('react'); void sprite.offsetWidth; sprite.classList.add('react');
    const r = sprite.getBoundingClientRect();
    if (delta) floatText(`+${delta} ${kind}`, r.left + r.width / 2, r.top, kind === '💖' ? 'xp' : 'coin');
    sparkle(sprite);
    refreshMeters();
  };
  function refreshMeters() {
    setBar(root, 'happy', S.progress.care.happiness);
    setBar(root, 'full', S.progress.care.fullness);
    root.querySelector('#treat-count').textContent = `${S.progress.care.treats} treats`;
    root.querySelector('#pet-coins').textContent = S.progress.coins;
  }
  say(line(petMood()));

  root.querySelector('#act-pat').addEventListener('click', () => {
    sfx.tap(); const before = S.progress.care.happiness; patPet();
    react(Math.round(S.progress.care.happiness - before), '💖'); say(line(petMood()));
  });
  root.querySelector('#act-play').addEventListener('click', () => {
    sfx.star(); const before = S.progress.care.happiness; playPet();
    react(Math.round(S.progress.care.happiness - before), '💖');
    // playing sometimes turns up a coin or two — a small surprise
    if (Math.random() < 0.3) { const found = 1 + Math.floor(Math.random() * 3); addCoins(found); sfx.coin(); say(`Look what I found! 🪙 +${found}`); refreshChrome(); }
    else say('Wheee! That was fun! 🎾');
    refreshMeters();
  });
  root.querySelector('#act-feed').addEventListener('click', () => {
    const r = feedPet();
    if (!r.ok) { sfx.wrong(); say('I\'m out of treats! Can we get some? 🥺'); flashTreatShop(root); return; }
    sfx.coin(); react(8, '💖'); say('Yum yum, thank you! 😋');
  });
  root.querySelectorAll('.ts-buy').forEach((b) => b.addEventListener('click', () => {
    const n = +b.dataset.n, cost = +b.dataset.cost;
    const r = buyTreats(n, cost);
    if (!r.ok) { sfx.wrong(); popup({ emoji: '🪙', title: 'Not enough coins yet!', sub: 'Earn coins by learning, then come back for treats. 🌱', sound: false, confetti: false }); return; }
    sfx.coin(); refreshMeters(); refreshChrome();
    say('Treats! You\'re the best! 💝');
  }));
  root.querySelector('#more-pets').addEventListener('click', () => { sfx.tap(); navigate('#/rewards'); });

  // rooms
  root.querySelectorAll('.room-card').forEach((c) => c.addEventListener('click', () => {
    const r = decorData.rooms.find((x) => x.id === c.dataset.id);
    const h = S.progress.home;
    if (!h.ownedRooms.includes(r.id)) {
      if (S.progress.coins < r.cost) { sfx.wrong(); popup({ emoji: '🪙', title: 'Not enough coins yet!', sub: 'Keep learning to earn coins. 🌱', sound: false, confetti: false }); return; }
      S.progress.coins -= r.cost; h.ownedRooms.push(r.id); sfx.coin();
    } else sfx.tap();
    h.room = r.id; persist(); refreshChrome(); renderPet(root);
  }));
  // decorations (buy = collect + place)
  root.querySelectorAll('.decor-card').forEach((c) => c.addEventListener('click', () => {
    const d = decorData.decor.find((x) => x.id === c.dataset.id);
    const h = S.progress.home;
    if (h.decor.includes(d.id)) { sfx.tap(); h.decor = h.decor.filter((x) => x !== d.id); persist(); renderPet(root); return; }
    if (S.progress.coins < d.cost) { sfx.wrong(); popup({ emoji: '🪙', title: 'Not enough coins yet!', sub: 'Keep learning to earn coins. 🌱', sound: false, confetti: false }); return; }
    S.progress.coins -= d.cost; h.decor.push(d.id); sfx.coin(); confetti(40); persist(); refreshChrome(); renderPet(root);
  }));
}

function roomBg() {
  const r = decorData.rooms.find((x) => x.id === S.progress.home.room) || decorData.rooms[0];
  return r ? r.bg : 'linear-gradient(180deg,#fff6e9,#ffe9cf)';
}
function decorEmojis() {
  const owned = S.progress.home.decor || [];
  return owned.map((id) => { const d = decorData.decor.find((x) => x.id === id); return d ? `<span class="placed-decor">${d.emoji}</span>` : ''; }).join('');
}
function roomCard(r) {
  const owned = S.progress.home.ownedRooms.includes(r.id);
  const using = S.progress.home.room === r.id;
  return `<button class="room-card ${using ? 'using' : ''}" data-id="${r.id}">
    <span class="room-emoji">${r.emoji}</span><span class="room-name">${escapeHtml(r.name)}</span>
    <span class="room-tag">${using ? '✓ Using' : owned ? 'Use' : '🪙 ' + r.cost}</span></button>`;
}
function decorCard(d) {
  const have = S.progress.home.decor.includes(d.id);
  return `<button class="decor-card ${have ? 'have' : ''}" data-id="${d.id}" title="${escapeHtml(d.name)}">
    <span class="decor-emoji">${d.emoji}</span>
    <span class="decor-tag">${have ? '✓' : '🪙' + d.cost}</span></button>`;
}

function meter(label, emoji, key, val) {
  return `<div class="meter">
    <div class="meter-label">${emoji} ${label}</div>
    <div class="meter-track"><div class="meter-fill ${key}" data-bar="${key}" style="width:${Math.round(val)}%"></div></div>
  </div>`;
}
function setBar(root, key, val) {
  const el = root.querySelector(`[data-bar="${key}"]`);
  if (el) el.style.width = Math.round(Math.max(0, Math.min(100, val))) + '%';
}
function flashTreatShop(root) {
  const ts = root.querySelector('.treat-shop');
  if (ts) { ts.classList.remove('flash'); void ts.offsetWidth; ts.classList.add('flash'); }
}
