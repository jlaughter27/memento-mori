// ui/celebrations.js — confetti + popup moments (respects reduced-motion).
import { S } from '../state.js';
import { el } from './dom.js';
import { sfx } from './sound.js';

const reduce = () => S.progress.settings.reducedMotion;

const COLORS = ['#ff6b6b', '#ffd93d', '#6bcB77', '#4d96ff', '#ff8fab', '#b983ff', '#ff9f1c'];

export function confetti(amount = 90) {
  if (reduce()) return;
  const { innerWidth, innerHeight } = window;
  let canvas = document.getElementById('confetti-canvas');
  if (!canvas) {
    canvas = el('<canvas id="confetti-canvas"></canvas>');
    document.body.appendChild(canvas);
  }
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
  ctx.scale(dpr, dpr);
  const parts = Array.from({ length: amount }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 120,
    y: innerHeight / 2.4,
    vx: (Math.random() - 0.5) * 11,
    vy: Math.random() * -13 - 4,
    g: 0.32 + Math.random() * 0.18,
    size: 6 + Math.random() * 7,
    color: COLORS[(Math.random() * COLORS.length) | 0],
    rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
    life: 0,
  }));
  let raf;
  const draw = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    let alive = false;
    for (const p of parts) {
      p.life++; p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if (p.y < innerHeight + 40) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, 1 - p.life / 130);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }
    if (alive) raf = requestAnimationFrame(draw);
    else { cancelAnimationFrame(raf); ctx.clearRect(0, 0, innerWidth, innerHeight); }
  };
  draw();
}

// generic centered popup that auto-dismisses or waits for tap
export function popup({ emoji, title, sub, coins, confetti: doConfetti = true, sound = 'badge', hold = false, onClose }) {
  if (sound && sfx[sound]) sfx[sound]();
  if (doConfetti) confetti();
  const node = el(`
    <div class="celebrate-overlay">
      <div class="celebrate-card pop-in">
        <div class="celebrate-emoji">${emoji || '🎉'}</div>
        <div class="celebrate-title">${title || ''}</div>
        ${sub ? `<div class="celebrate-sub">${sub}</div>` : ''}
        ${coins ? `<div class="celebrate-coins">+${coins} 🪙</div>` : ''}
        <button class="celebrate-btn">${hold ? 'Yay!' : 'Awesome!'}</button>
      </div>
    </div>`);
  document.body.appendChild(node);
  let closed = false; // idempotent: a double-tap must not fire onClose twice
  const close = () => {
    if (closed) return;
    closed = true;
    node.classList.add('fade-out');
    setTimeout(() => node.remove(), 250);
    if (onClose) onClose();
  };
  node.querySelector('.celebrate-btn').addEventListener('click', close);
  node.addEventListener('click', (e) => { if (e.target === node) close(); });
  if (!hold) setTimeout(close, 4200);
  return close;
}

// small +XP / +coins floaty near a point
export function floatText(text, x, y, cls = '') {
  if (reduce()) return;
  const n = el(`<div class="float-text ${cls}">${text}</div>`);
  n.style.left = x + 'px'; n.style.top = y + 'px';
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 1100);
}

// quick sparkle burst at an element
export function sparkle(target) {
  if (reduce() || !target) return;
  const r = target.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    const s = el(`<div class="sparkle">✨</div>`);
    s.style.left = (r.left + r.width / 2) + 'px';
    s.style.top = (r.top + r.height / 2) + 'px';
    s.style.setProperty('--dx', (Math.cos(i / 8 * 6.28) * 60) + 'px');
    s.style.setProperty('--dy', (Math.sin(i / 8 * 6.28) * 60) + 'px');
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 700);
  }
}
