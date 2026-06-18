// game/input.js — keyboard (arrows/WASD), an action key (Space/Enter), and
// tap/pointer-to-move. Self-contained: attaches listeners to the canvas + window
// and cleans them all up on destroy().
const DIRS = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right',
};

export function createInput(target) {
  const keys = { up: false, down: false, left: false, right: false };
  const ptr = { x: 0, y: 0, active: false, tapped: false };
  let action = false;

  const setKey = (down) => (e) => {
    const d = DIRS[e.key];
    if (d) { keys[d] = down; e.preventDefault(); return; }
    if (down && (e.key === ' ' || e.key === 'Enter')) { action = true; e.preventDefault(); }
  };
  const kd = setKey(true), ku = setKey(false);

  const at = (e) => {
    const r = target.getBoundingClientRect();
    const t = (e.touches && e.touches[0]) || e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  };
  const pd = (e) => { const p = at(e); ptr.x = p.x; ptr.y = p.y; ptr.active = true; ptr.tapped = true; };
  const pm = (e) => { if (!ptr.active) return; const p = at(e); ptr.x = p.x; ptr.y = p.y; };
  const pu = () => { ptr.active = false; };

  window.addEventListener('keydown', kd);
  window.addEventListener('keyup', ku);
  target.addEventListener('pointerdown', pd);
  target.addEventListener('pointermove', pm);
  window.addEventListener('pointerup', pu);

  function dir() {
    let x = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    let y = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
    if (x && y) { const k = Math.SQRT1_2; x *= k; y *= k; } // normalize diagonals
    return { x, y };
  }
  function takeTap() { if (!ptr.tapped) return null; ptr.tapped = false; return { x: ptr.x, y: ptr.y }; }
  function takeAction() { if (!action) return false; action = false; return true; }
  function destroy() {
    window.removeEventListener('keydown', kd);
    window.removeEventListener('keyup', ku);
    target.removeEventListener('pointerdown', pd);
    target.removeEventListener('pointermove', pm);
    window.removeEventListener('pointerup', pu);
  }

  return { dir, pointer: () => ptr, takeTap, takeAction, keys, destroy };
}
