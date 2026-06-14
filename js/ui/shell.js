// ui/shell.js — persistent top HUD + bottom nav + sub-screen header + nav helper.
import { S } from '../state.js';
import { levelProgress } from '../gamification.js';
import { rewardsData } from '../curriculum/index.js';
import { sfx } from './sound.js';

export function navigate(hash) {
  if (location.hash === hash) renderRouteFromHash();
  else location.hash = hash;
}

const petEmoji = (id) => (rewardsData.pets.find((p) => p.id === id) || { emoji: '🦊' }).emoji;

// Sub-screens (everything that isn't a top-level hub) get a consistent back bar.
// title = the label shown; back = where the ← button goes.
const SCREENS = {
  learn:     { title: 'Lesson',          back: '#/' },
  practice:  { title: 'Practice',        back: '#/' },
  tutor:     { title: 'Learn with Foxy', back: '#/' },
  play:      { title: 'Daily Challenge', back: '#/' },
  review:    { title: 'Review',          back: '#/' },
  fixit:     { title: 'Fix-It',          back: '#/' },
  warmup:    { title: 'Warm-Up',         back: '#/' },
  sprint:    { title: 'Math Sprint',     back: '#/' },
  magnitude: { title: 'Number Line',     back: '#/' },
  sort:      { title: 'Sort & Storm',    back: '#/' },
  parent:    { title: 'Grown-ups',       back: '#/' },
  report:    { title: 'Progress Report', back: '#/parent' },
  worksheet: { title: 'Worksheet Maker', back: '#/parent' },
  curriculum:{ title: 'Curriculum Map',  back: '#/parent' },
};
export function screenFor(route) { return SCREENS[route] || null; }

export function renderHUD() {
  const host = document.getElementById('hud');
  if (!host) return;
  const lp = levelProgress();
  const st = S.progress.streak.count || 0;
  host.innerHTML = `
    <button class="hud-avatar" data-go="#/" aria-label="Home">
      <span class="hud-pet" aria-hidden="true">${petEmoji(S.profile.avatar.pet)}</span>
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
    </div>
    <button class="hud-gear" data-go="#/parent" aria-label="Grown-ups area">⚙️</button>`;
  host.querySelectorAll('[data-go]').forEach((b) =>
    b.addEventListener('click', () => { sfx.tap(); navigate(b.dataset.go); }));
}

// Slim back bar shown on sub-screens (replaces the kid HUD/nav so the task is the focus).
export function renderSubhead() {
  const host = document.getElementById('subhead');
  if (!host) return;
  const route = (location.hash || '#/').split('/')[1] || '';
  const sc = SCREENS[route];
  if (!sc) { host.hidden = true; host.innerHTML = ''; return; }
  host.hidden = false;
  host.innerHTML = `
    <button class="sub-back" data-go="${sc.back}" aria-label="Back">
      <span aria-hidden="true">←</span> Back
    </button>
    <span class="sub-title">${sc.title}</span>
    <span class="sub-coins" aria-label="${S.progress.coins} coins">🪙 <b>${S.progress.coins}</b></span>`;
  host.querySelector('[data-go]').addEventListener('click', () => { sfx.tap(); navigate(sc.back); });
}

export function renderNav() {
  const host = document.getElementById('nav');
  if (!host) return;
  const route = (location.hash || '#/').split('/')[1] || '';
  const items = [
    { hash: '#/', icon: '🗺️', label: 'Learn', key: '' },
    { hash: '#/adventure', icon: '⚔️', label: 'Quest', key: 'adventure' },
    { hash: '#/pet', icon: '🐾', label: 'Pet', key: 'pet' },
    { hash: '#/rewards', icon: '🏆', label: 'Rewards', key: 'rewards' },
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

export function refreshChrome() { renderHUD(); renderNav(); renderSubhead(); }
