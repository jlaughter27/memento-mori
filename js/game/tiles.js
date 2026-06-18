// game/tiles.js — procedural tile painting (the placeholder "art").
// Each tile is drawn deterministically from its grid position so the prerendered
// map looks varied but stable. This whole file is the swap point: replacing it with
// sprite-sheet sampling (bespoke generated art) upgrades the look with no engine change.
export function drawTile(ctx, code, x, y, s) {
  switch (code) {
    case '#': grass(ctx, x, y, s); path(ctx, x, y, s); break;       // walkable path
    case '~': water(ctx, x, y, s); break;                            // pond (solid)
    case 'T': grass(ctx, x, y, s); tree(ctx, x, y, s); break;       // tree (solid)
    case 'H': grass(ctx, x, y, s); house(ctx, x, y, s); break;     // house (solid)
    case '*': grass(ctx, x, y, s); flowers(ctx, x, y, s); break;   // flower patch
    default: grass(ctx, x, y, s);                                   // open grass
  }
}

function grass(ctx, x, y, s) {
  ctx.fillStyle = '#8ed06a'; ctx.fillRect(x, y, s, s);
  ctx.fillStyle = '#7cc25a';
  for (let i = 0; i < 4; i++) {
    const gx = x + ((x * 7 + i * 13 + 3) % s);
    const gy = y + ((y * 5 + i * 11 + 5) % s);
    ctx.fillRect(gx, gy, 2, 5);
  }
}
function path(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(205,168,107,.92)'; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
  ctx.fillStyle = 'rgba(189,152,86,.7)';
  ctx.fillRect(x + ((x + y) % s % (s - 6)), y + (y % (s - 6)), 4, 4);
}
function water(ctx, x, y, s) {
  ctx.fillStyle = '#4db7e8'; ctx.fillRect(x, y, s, s);
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.fillRect(x + 5, y + (y % (s - 8)) + 3, s - 14, 3);
}
function tree(ctx, x, y, s) {
  ctx.fillStyle = '#7a4a25'; ctx.fillRect(x + s / 2 - 3, y + s - 14, 6, 12);
  ctx.fillStyle = '#3f9d4e';
  ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2 - 2, s / 2 - 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#48b85b';
  ctx.beginPath(); ctx.arc(x + s / 2 - 4, y + s / 2 - 5, s / 4, 0, Math.PI * 2); ctx.fill();
}
function house(ctx, x, y, s) {
  ctx.fillStyle = '#e8d2a6'; ctx.fillRect(x + 2, y + s / 2, s - 4, s / 2);
  ctx.fillStyle = '#c0563b';
  ctx.beginPath(); ctx.moveTo(x, y + s / 2 + 2); ctx.lineTo(x + s / 2, y + 3); ctx.lineTo(x + s, y + s / 2 + 2); ctx.closePath(); ctx.fill();
}
function flowers(ctx, x, y, s) {
  const cols = ['#ff6fa5', '#ffd23f', '#a06bff'];
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = cols[i % cols.length];
    const fx = x + 6 + (i * 11) % (s - 10);
    const fy = y + 8 + (i * 13) % (s - 12);
    ctx.beginPath(); ctx.arc(fx, fy, 3, 0, Math.PI * 2); ctx.fill();
  }
}
