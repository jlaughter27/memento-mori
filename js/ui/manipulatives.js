// ui/manipulatives.js — SVG visual models for math concepts.
// renderVisual(descriptor) -> HTML string (SVG). Returns '' for unknown/empty.

const PALETTE = ['#6c5ce7', '#00b894', '#e17055', '#0984e3', '#e84393', '#fdcb6e', '#00cec9', '#fd79a8'];

export function renderVisual(v) {
  if (!v || !v.type) return '';
  try {
    switch (v.type) {
      case 'numberLine': return numberLine(v);
      case 'array': return array(v);
      case 'baseTen': return baseTen(v);
      case 'fractionBar': return fractionBars(v);
      case 'fractionCircle': return fractionCircle(v);
      case 'groups': return groups(v);
      case 'shape': return shapeRect(v);
      case 'clock': return clock(v);
      case 'money': return money(v);
      default: return '';
    }
  } catch (e) { return ''; }
}
const wrap = (inner, vb = '0 0 320 160') =>
  `<div class="manip"><svg viewBox="${vb}" class="manip-svg" preserveAspectRatio="xMidYMid meet">${inner}</svg></div>`;

function numberLine({ min = 0, max = 10, step = 1, mark }) {
  const W = 300, x0 = 10, x1 = W - 10, y = 70;
  const span = Math.max(1, max - min);
  const px = (n) => x0 + ((n - min) / span) * (x1 - x0);
  let ticks = '';
  for (let n = min; n <= max + 1e-9; n += step) {
    const x = px(n);
    ticks += `<line x1="${x}" y1="${y - 8}" x2="${x}" y2="${y + 8}" stroke="#7a6fb0" stroke-width="2"/>
      <text x="${x}" y="${y + 28}" text-anchor="middle" font-size="13" fill="#5a4f86">${+n.toFixed(2)}</text>`;
  }
  let marker = '';
  if (mark !== undefined) {
    const x = px(mark);
    marker = `<g class="nl-mark"><line x1="${x}" y1="${y}" x2="${x}" y2="${y - 34}" stroke="#e84393" stroke-width="3"/>
      <circle cx="${x}" cy="${y - 40}" r="13" fill="#e84393"/>
      <text x="${x}" y="${y - 35}" text-anchor="middle" font-size="12" fill="#fff" font-weight="700">${mark}</text></g>`;
  }
  return wrap(`<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="#7a6fb0" stroke-width="3"/>
    <polygon points="${x1},${y} ${x1 - 10},${y - 5} ${x1 - 10},${y + 5}" fill="#7a6fb0"/>${ticks}${marker}`, '0 0 300 110');
}

function array({ a = 3, b = 4 }) {
  a = Math.min(a, 12); b = Math.min(b, 12);
  const r = 11, gap = 6, ox = 16, oy = 14;
  let dots = '';
  for (let i = 0; i < a; i++)
    for (let j = 0; j < b; j++)
      dots += `<circle cx="${ox + j * (r * 2 + gap)}" cy="${oy + i * (r * 2 + gap)}" r="${r}" fill="${PALETTE[(i + j) % PALETTE.length]}" />`;
  const W = ox + b * (r * 2 + gap), H = oy + a * (r * 2 + gap);
  return wrap(`${dots}<text x="${W / 2}" y="${H + 4}" text-anchor="middle" font-size="14" fill="#5a4f86" font-weight="700">${a} rows × ${b} = ${a * b}</text>`, `0 0 ${W} ${H + 12}`);
}

function baseTen({ value = 0 }) {
  const h = Math.floor(value / 100), t = Math.floor((value % 100) / 10), o = value % 10;
  let s = ''; let x = 6;
  for (let i = 0; i < h; i++) { // 10x10 block
    s += `<rect x="${x}" y="6" width="60" height="60" fill="#6c5ce7" rx="4" opacity="0.9"/>`;
    for (let g = 1; g < 10; g++) s += `<line x1="${x + g * 6}" y1="6" x2="${x + g * 6}" y2="66" stroke="#fff" stroke-width="1" opacity="0.5"/><line x1="${x}" y1="${6 + g * 6}" x2="${x + 60}" y2="${6 + g * 6}" stroke="#fff" stroke-width="1" opacity="0.5"/>`;
    x += 68;
  }
  for (let i = 0; i < t; i++) { // tens rod
    s += `<rect x="${x}" y="6" width="14" height="60" fill="#00b894" rx="3"/>`;
    for (let g = 1; g < 10; g++) s += `<line x1="${x}" y1="${6 + g * 6}" x2="${x + 14}" y2="${6 + g * 6}" stroke="#fff" stroke-width="1" opacity="0.5"/>`;
    x += 20;
  }
  for (let i = 0; i < o; i++) { s += `<rect x="${x}" y="52" width="13" height="13" fill="#e17055" rx="3"/>`; x += 17; }
  const W = Math.max(x + 6, 120);
  return wrap(`${s}<text x="${W / 2}" y="86" text-anchor="middle" font-size="14" fill="#5a4f86" font-weight="700">${value}</text>`, `0 0 ${W} 96`);
}

function oneBar({ num, den }, y, h, label = true) {
  const W = 280, x0 = 10, w = W - 20;
  const cw = w / den;
  let cells = '';
  for (let i = 0; i < den; i++) {
    cells += `<rect x="${x0 + i * cw}" y="${y}" width="${cw}" height="${h}" fill="${i < num ? '#e84393' : '#fde7f1'}" stroke="#c2336e" stroke-width="2"/>`;
  }
  const lab = label ? `<text x="${W - 4}" y="${y + h / 2 + 5}" text-anchor="start" font-size="14" fill="#5a4f86" font-weight="700">${num}/${den}</text>` : '';
  return { svg: cells, lab };
}
function fractionBars(v) {
  const bars = v.bars || [{ num: v.num, den: v.den }];
  let s = ''; let y = 12; const h = 38;
  for (const b of bars) { const o = oneBar(b, y, h); s += o.svg + o.lab; y += h + 14; }
  return wrap(s, `0 0 320 ${y}`);
}

function fractionCircle({ num = 1, den = 2 }) {
  const cx = 80, cy = 70, r = 56;
  let s = '';
  for (let i = 0; i < den; i++) {
    const a0 = (i / den) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / den) * 2 * Math.PI - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    s += `<path d="M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z" fill="${i < num ? '#e17055' : '#fbe8e0'}" stroke="#b8502f" stroke-width="2"/>`;
  }
  s += `<text x="160" y="76" font-size="22" fill="#5a4f86" font-weight="800">${num}/${den}</text>`;
  return wrap(s, '0 0 220 150');
}

function groups({ groups = 3, perGroup = 4 }) {
  groups = Math.min(groups, 6); perGroup = Math.min(perGroup, 12);
  let s = ''; let x = 8;
  for (let g = 0; g < groups; g++) {
    const cols = Math.min(perGroup, 4), rows = Math.ceil(perGroup / cols);
    const gw = cols * 20 + 12, gh = rows * 20 + 14;
    s += `<rect x="${x}" y="8" width="${gw}" height="${gh}" rx="10" fill="none" stroke="#6c5ce7" stroke-width="2" stroke-dasharray="5 4"/>`;
    for (let i = 0; i < perGroup; i++) {
      const cx = x + 14 + (i % cols) * 20, cy = 20 + Math.floor(i / cols) * 20;
      s += `<circle cx="${cx}" cy="${cy}" r="7" fill="${PALETTE[g % PALETTE.length]}"/>`;
    }
    x += gw + 10;
  }
  return wrap(s, `0 0 ${Math.max(x, 120)} 90`);
}

function shapeRect({ w = 4, h = 3 }) {
  const u = Math.min(34, 220 / Math.max(w, h));
  const W = w * u, H = h * u, ox = 30, oy = 16;
  let grid = '';
  for (let i = 0; i <= w; i++) grid += `<line x1="${ox + i * u}" y1="${oy}" x2="${ox + i * u}" y2="${oy + H}" stroke="#00b894" stroke-width="1.5" opacity="0.5"/>`;
  for (let j = 0; j <= h; j++) grid += `<line x1="${ox}" y1="${oy + j * u}" x2="${ox + W}" y2="${oy + j * u}" stroke="#00b894" stroke-width="1.5" opacity="0.5"/>`;
  const box = `<rect x="${ox}" y="${oy}" width="${W}" height="${H}" fill="#d7f7ee" stroke="#00b894" stroke-width="3"/>`;
  const labels = `<text x="${ox + W / 2}" y="${oy - 4}" text-anchor="middle" font-size="14" font-weight="700" fill="#0a8f72">${w}</text>
    <text x="${ox - 8}" y="${oy + H / 2 + 5}" text-anchor="end" font-size="14" font-weight="700" fill="#0a8f72">${h}</text>`;
  return wrap(box + grid + labels, `0 0 ${ox + W + 16} ${oy + H + 16}`);
}

function clock({ h = 3, m = 0 }) {
  const cx = 80, cy = 80, r = 62;
  let ticks = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + (r - 8) * Math.cos(a), y1 = cy + (r - 8) * Math.sin(a);
    const x2 = cx + r * Math.cos(a), y2 = cy + r * Math.sin(a);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#5a4f86" stroke-width="3"/>`;
    const lx = cx + (r - 20) * Math.cos(a), ly = cy + (r - 20) * Math.sin(a);
    ticks += `<text x="${lx}" y="${ly + 5}" text-anchor="middle" font-size="13" fill="#5a4f86" font-weight="700">${i === 0 ? 12 : i}</text>`;
  }
  const ha = ((h % 12) + m / 60) / 12 * 2 * Math.PI - Math.PI / 2;
  const ma = (m / 60) * 2 * Math.PI - Math.PI / 2;
  const hx = cx + 30 * Math.cos(ha), hy = cy + 30 * Math.sin(ha);
  const mx = cx + 46 * Math.cos(ma), my = cy + 46 * Math.sin(ma);
  return wrap(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fffdf5" stroke="#6c5ce7" stroke-width="4"/>${ticks}
    <line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="#2d2233" stroke-width="5" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}" stroke="#e84393" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="5" fill="#2d2233"/>`, '0 0 160 160');
}

function money({ cents = 0 }) {
  const dollars = Math.floor(cents / 100), c = cents % 100;
  return wrap(`<text x="110" y="60" text-anchor="middle" font-size="40">💵💰🪙</text>
    <text x="110" y="100" text-anchor="middle" font-size="22" font-weight="800" fill="#0a8f72">$${dollars}.${String(c).padStart(2, '0')}</text>`, '0 0 220 120');
}
