// views/quests.js — the Quest Log: multi-step island adventures.
// Quests auto-progress as the child plays (see gamification.bumpQuest); this
// screen shows each quest's narrative, step checklist, current objective, and a
// Claim button for the completion chest.
import { listQuests, claimQuest, checkNewBadges } from '../gamification.js';
import { showBadges } from './rewards.js';
import { navigate } from '../ui/shell.js';
import { sfx } from '../ui/sound.js';
import { popup, confetti } from '../ui/celebrations.js';
import { escapeHtml } from '../ui/dom.js';

const STATUS_PILL = {
  active: '<span class="q-pill q-active">In progress</span>',
  ready: '<span class="q-pill q-ready">Chest ready! 🎁</span>',
  claimed: '<span class="q-pill q-claimed">Complete ✓</span>',
  locked: '<span class="q-pill q-locked">🔒 Locked</span>',
};

function questCard(q) {
  const steps = q.steps.map((s) =>
    `<li class="q-step q-${s.state}"><span class="q-tick">${s.state === 'done' ? '✅' : s.state === 'current' ? '▶️' : '⬜'}</span>${escapeHtml(s.label)}</li>`).join('');
  let body;
  if (q.status === 'locked') {
    body = `<p class="q-lock muted">${escapeHtml(q.lockText || 'Keep learning to unlock this adventure!')}</p>`;
  } else if (q.status === 'claimed') {
    body = `<p class="q-done">${q.emoji} Adventure complete — trophy earned! 🏆</p>`;
  } else if (q.status === 'ready') {
    body = `<ul class="q-steps">${steps}</ul>
      <button class="btn btn-big q-claim" data-id="${q.id}" aria-label="Claim chest for ${escapeHtml(q.title)}">🎁 Claim chest — +${q.chest.coins} 🪙 +${q.chest.treats} 🍪</button>`;
  } else { // active
    body = `<ul class="q-steps">${steps}</ul>
      ${q.current ? `<div class="q-now"><div class="q-now-label">${escapeHtml(q.current.label)} <b>${q.current.n}/${q.current.goal}</b></div>
        <div class="q-bar"><div class="q-fill" style="width:${q.current.pct}%"></div></div></div>` : ''}`;
  }
  return `<section class="quest-card ${q.status}">
    <header class="quest-top"><span class="quest-emoji">${q.emoji}</span>
      <span class="quest-name">${escapeHtml(q.title)}</span>${STATUS_PILL[q.status] || ''}</header>
    <p class="quest-blurb muted">${escapeHtml(q.blurb)}</p>
    ${body}
  </section>`;
}

export function renderQuests(root) {
  const quests = listQuests();
  const ready = quests.filter((q) => q.status === 'ready').length;
  const done = quests.filter((q) => q.status === 'claimed').length;
  root.innerHTML = `
    <div class="quests-wrap">
      <header class="quests-head">
        <h1>🗺️ Quest Log</h1>
        <p class="muted">Big adventures across the island — they fill up as you learn and explore!</p>
        <div class="quests-summary">${done}/${quests.length} adventures complete${ready ? ` · <b>${ready} chest${ready > 1 ? 's' : ''} ready!</b>` : ''}</div>
      </header>
      <div id="quest-list">${quests.map(questCard).join('')}</div>
      <button class="btn btn-ghost q-toworld" id="q-world">🌍 Off to the World!</button>
    </div>`;

  const list = root.querySelector('#quest-list');
  const wire = () => list.querySelectorAll('.q-claim').forEach((b) => b.addEventListener('click', () => {
    const r = claimQuest(b.dataset.id);
    if (!r) return;
    sfx.level(); confetti(140);
    popup({ emoji: r.emoji || '🎁', title: 'Adventure complete!', sub: `${escapeHtml(r.title)}\n+${r.coins} 🪙  +${r.treats} 🍪  + a trophy!`, sound: 'level', hold: true });
    list.innerHTML = listQuests().map(questCard).join(''); wire();
    const fresh = checkNewBadges();
    if (fresh.length) setTimeout(() => showBadges(fresh, () => {}), 900);
  }));
  wire();
  root.querySelector('#q-world').addEventListener('click', () => { sfx.tap(); navigate('#/world'); });
}
