// ui/whatsnew.js — release-notes modal (shown after an update; also in the dashboard).
import { el, escapeHtml } from './dom.js';
import { latestRelease } from '../version.js';

export function showWhatsNew() {
  const r = latestRelease();
  const node = el(`
    <div class="celebrate-overlay">
      <div class="whatsnew-card pop-in">
        <div class="wn-emoji">🎉</div>
        <h2 class="wn-title">What's New</h2>
        <div class="wn-ver">v${escapeHtml(r.v)} · ${escapeHtml(r.title)}</div>
        <ul class="wn-list">${r.items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
        <button class="celebrate-btn wn-close">Let's go! 🚀</button>
      </div>
    </div>`);
  document.body.appendChild(node);
  const close = () => { node.classList.add('fade-out'); setTimeout(() => node.remove(), 250); };
  node.querySelector('.wn-close').addEventListener('click', close);
  node.addEventListener('click', (e) => { if (e.target === node) close(); });
}
