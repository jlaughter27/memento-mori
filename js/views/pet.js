// views/pet.js — Pet Home: care for your companion (happiness + feeding + play).
import { S, persist } from '../state.js';
import { rewardsData } from '../curriculum/index.js';
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

      <div class="pet-room card-soft">
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
