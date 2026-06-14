// game/particles.js — a tiny, pure particle system for canvas "juice".
// No DOM, no imports: you spawn particles, update(dt) advances them, draw(ctx)
// paints them, and dead ones are culled. Used by the world for footstep dust,
// ambient sparkles, and a celebratory burst when the pet helps a math friend.
export function createParticles(opts = {}) {
  const max = opts.max || 90;
  const parts = [];

  function spawn(p) {
    if (parts.length >= max) parts.shift();
    parts.push({
      x: p.x, y: p.y, vx: p.vx || 0, vy: p.vy || 0, g: p.g || 0,
      life: 0, max: p.life || 0.6, size: p.size || 4, color: p.color || '#fff',
    });
  }

  // a radial pop of colorful confetti-ish bits (a solve celebration)
  function burst(x, y, n = 14, o = {}) {
    const colors = o.colors || ['#ffd23f', '#ff6fa5', '#6bcb77', '#4d96ff', '#a06bff'];
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.6;
      const sp = (o.speed || 70) * (0.5 + Math.random());
      spawn({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 20, g: o.g != null ? o.g : 130,
        life: o.life || 0.75, size: o.size || 4, color: colors[i % colors.length] });
    }
  }
  // a little kick of dust under the pet's feet while walking
  function dust(x, y) {
    spawn({ x, y, vx: (Math.random() - 0.5) * 22, vy: -10 - Math.random() * 14, g: 46,
      life: 0.45, size: 3 + Math.random() * 2, color: 'rgba(120,92,60,.45)' });
  }
  // a drifting ambient sparkle to make the world feel alive
  function sparkle(x, y) {
    spawn({ x, y, vx: (Math.random() - 0.5) * 12, vy: -14 - Math.random() * 10, g: -8,
      life: 1.1, size: 2 + Math.random() * 2, color: 'rgba(255,240,180,.9)' });
  }

  function update(dt) {
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life += dt;
      if (p.life >= p.max) { parts.splice(i, 1); continue; }
      p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    }
  }
  function draw(ctx) {
    if (!ctx) return;
    for (const p of parts) {
      const a = Math.max(0, 1 - p.life / p.max);
      ctx.globalAlpha = a; ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  return { spawn, burst, dust, sparkle, update, draw, count: () => parts.length, clear: () => { parts.length = 0; } };
}
