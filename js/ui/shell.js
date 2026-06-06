// ui/shell.js — persistent top HUD + bottom nav + navigation helper.
import { S } from '../state.js';
import { levelProgress } from '../gamification.js';
import { rewardsData } from '../curriculum/index.js';
import { sfx } from './sound.js';

export function navigate(hash) {
  if (location.hash === hash) renderRouteFromHash();
  else location.hash = hash;
}

const petEmoji = (id) => (rewardsData.pets.find((p) => p.id === id) || { emoji: '🦊' }).emoji;

export function renderHUD() {
  const host = document.getElementById('hud');
  if (!host) return;
  const lp = levelProgress();
  const st = S.progress.streak.count || 0;
  host.innerHTML = `
    <button class="hud-avatar" data-go="#/" aria-label="Home">
      <span class="hud-pet">${petEmoji(S.profile.avatar.pet)}</span>
    </button>
    <div class="hud-level">
      <div class="hud-level-badge">Lv ${lp.level}</div>
      <div class="hud-xp" role="progressbar" aria-label="Experience to next level" aria-valuemin="0" aria-valuemax="${lp.span}" aria-valuenow="${lp.into}" title="${lp.into} / ${lp.span} XP to level ${lp.level + 1}">
        <div class="hud-xp-fill" style="width:${(lp.pct * 100).toFixed(0)}%"></div>
      </div>
    </div>
    <div class="hud-stats">
      <span class="hud-coins" aria-label="${S.progress.coins} coins">🪙 <b>${S.progress.coins}</b></span>
      <span class="hud-streak ${st > 0 ? 'lit' : ''}" aria-label="${st} day streak">🔥 <b>${st}</b></span>
    </div>`;
  host.querySelector('[data-go]').addEventListener('click', () => navigate('#/'));
}

export function renderNav() {
  const host = document.getElementById('nav');
  if (!host) return;
  const route = (location.hash || '#/').split('/')[1] || '';
  const items = [
    { hash: '#/', icon: '🗺️', label: 'Learn', key: '' },
    { hash: '#/play', icon: '⚡', label: 'Play', key: 'play' },
    { hash: '#/rewards', icon: '🏆', label: 'Rewards', key: 'rewards' },
    { hash: '#/parent', icon: '👨‍👩‍👧', label: 'Grown-ups', key: 'parent' },
  ];
  host.innerHTML = items.map((it) =>
    `<button class="nav-btn ${route === it.key ? 'active' : ''}" data-hash="${it.hash}">
       <span class="nav-icon">${it.icon}</span><span class="nav-label">${it.label}</span>
     </button>`).join('');
  host.querySelectorAll('.nav-btn').forEach((b) =>
    b.addEventListener('click', () => { sfx.tap(); navigate(b.dataset.hash); }));
}

// the router lives in app.js but shell triggers a re-render through this hook
export let renderRouteFromHash = () => {};
export function setRouter(fn) { renderRouteFromHash = fn; }

export function refreshChrome() { renderHUD(); renderNav(); }
