// ui/whatsnew.js — release-notes modal (shown after an update; also in the dashboard).
import { el, escapeHtml } from './dom.js';
import { latestRelease } from '../version.js';
import { setInert } from './celebrations.js';

export function showWhatsNew() {
  const r = latestRelease();
  const node = el(`
    <div class="celebrate-overlay" role="dialog" aria-modal="true" aria-labelledby="wn-title">
      <div class="whatsnew-card pop-in">
        <div class="wn-emoji" aria-hidden="true">🎉</div>
        <h2 class="wn-title" id="wn-title">What's New</h2>
        <div class="wn-ver">v${escapeHtml(r.v)} · ${escapeHtml(r.title)}</div>
        <ul class="wn-list">${r.items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
        <button class="celebrate-btn wn-close">Let's go! 🚀</button>
      </div>
    </div>`);
  const prevFocus = document.activeElement;
  setInert(true);
  document.body.appendChild(node);
  const btn = node.querySelector('.wn-close');
  if (btn && btn.focus) btn.focus();
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  let closed = false; // idempotent: a double close must not unbalance the inert ref-count
  const close = () => {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', onKey);
    setInert(false);
    if (prevFocus && prevFocus.focus) prevFocus.focus();
    node.classList.add('fade-out'); setTimeout(() => node.remove(), 250);
  };
  document.addEventListener('keydown', onKey);
  btn.addEventListener('click', close);
  node.addEventListener('click', (e) => { if (e.target === node) close(); });
}
