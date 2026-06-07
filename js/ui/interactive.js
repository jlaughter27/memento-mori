// ui/interactive.js — hands-on (tappable) manipulatives used as a problem INPUT,
// so a child builds a fraction by shading parts instead of only typing a number.
// Bar parts are native <button>s; circle wedges are SVG <path role="button"> — both
// keyboard-operable (Tab + Enter/Space) with aria-pressed + a live count region.

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v | 0));

function barHTML(den) {
  return `<div class="ftap ftap-bar" role="group" aria-label="Shade the bar by tapping parts">${
    Array.from({ length: den }, (_, i) =>
      `<button type="button" class="ftap-part ftap-cell" aria-pressed="false" aria-label="Part ${i + 1} of ${den}, empty"></button>`).join('')}</div>`;
}

function circleHTML(den) {
  const cx = 100, cy = 100, r = 92;
  let paths = '';
  for (let i = 0; i < den; i++) {
    const a0 = (i / den) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / den) * 2 * Math.PI - Math.PI / 2;
    const x0 = (cx + r * Math.cos(a0)).toFixed(2), y0 = (cy + r * Math.sin(a0)).toFixed(2);
    const x1 = (cx + r * Math.cos(a1)).toFixed(2), y1 = (cy + r * Math.sin(a1)).toFixed(2);
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    const d = `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
    paths += `<path class="ftap-part ftap-wedge" role="button" tabindex="0" aria-pressed="false" aria-label="Part ${i + 1} of ${den}, empty" d="${d}"/>`;
  }
  return `<div class="ftap ftap-circle" role="group" aria-label="Shade the circle by tapping parts"><svg viewBox="0 0 200 200" class="ftap-svg" aria-hidden="false">${paths}</svg></div>`;
}

export function mountFractionTap(host, { den = 4, shape = 'bar' } = {}) {
  den = clamp(den, 2, 12);
  const states = new Array(den).fill(false);
  const count = () => states.filter(Boolean).length;
  host.innerHTML = shape === 'circle' ? circleHTML(den) : barHTML(den);
  host.insertAdjacentHTML('beforeend', `<p class="ftap-read" aria-live="polite" aria-atomic="true">0 of ${den} shaded</p>`);
  const read = host.querySelector('.ftap-read');
  const parts = [...host.querySelectorAll('.ftap-part')];
  const update = (i) => {
    states[i] = !states[i];
    const p = parts[i];
    p.classList.toggle('on', states[i]);
    p.setAttribute('aria-pressed', states[i] ? 'true' : 'false');
    p.setAttribute('aria-label', `Part ${i + 1} of ${den}, ${states[i] ? 'shaded' : 'empty'}`);
    read.textContent = `${count()} of ${den} shaded`;
  };
  parts.forEach((p, i) => {
    p.addEventListener('click', () => update(i));
    if (p.getAttribute('role') === 'button') {
      p.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update(i); } });
    }
  });
  return { getCount: count };
}

// ---- base-ten place-value blocks: tap +/− per place to BUILD a number ----
const PLACE_NAMES = ['Ones', 'Tens', 'Hundreds', 'Thousands'];
const PLACE_SINGULAR = ['one', 'ten', 'hundred', 'thousand'];
const PLACE_CLASS = ['bt-one', 'bt-ten', 'bt-hundred', 'bt-thousand'];

export function mountBaseTenBuild(host, { places = 3 } = {}) {
  places = clamp(places, 1, 4);
  const counts = new Array(places).fill(0);
  const value = () => counts.reduce((s, c, i) => s + c * Math.pow(10, i), 0);
  // columns left→right are highest place first (Hundreds, Tens, Ones)
  const cols = Array.from({ length: places }, (_, k) => places - 1 - k);
  host.innerHTML = `
    <div class="bt-build" role="group" aria-label="Build the number with place-value blocks">
      ${cols.map((i) => `
        <div class="bt-col">
          <div class="bt-col-name">${PLACE_NAMES[i]}</div>
          <div class="bt-stack" id="bt-stack-${i}"></div>
          <div class="bt-count" id="bt-count-${i}">0</div>
          <div class="bt-btns">
            <button type="button" class="bt-add" data-i="${i}" aria-label="Add a ${PLACE_SINGULAR[i]}">＋</button>
            <button type="button" class="bt-sub" data-i="${i}" aria-label="Remove a ${PLACE_SINGULAR[i]}">－</button>
          </div>
        </div>`).join('')}
    </div>
    <p class="bt-read" aria-live="polite" aria-atomic="true">Built: 0</p>`;
  const read = host.querySelector('.bt-read');
  const refresh = (i) => {
    host.querySelector(`#bt-count-${i}`).textContent = String(counts[i]);
    host.querySelector(`#bt-stack-${i}`).innerHTML =
      Array.from({ length: counts[i] }, () => `<span class="bt-block ${PLACE_CLASS[i]}" aria-hidden="true"></span>`).join('');
    read.textContent = `Built: ${value()}`;
  };
  host.querySelectorAll('.bt-add').forEach((b) => b.addEventListener('click', () => {
    const i = +b.dataset.i; if (counts[i] < 20) { counts[i]++; refresh(i); }
  }));
  host.querySelectorAll('.bt-sub').forEach((b) => b.addEventListener('click', () => {
    const i = +b.dataset.i; if (counts[i] > 0) { counts[i]--; refresh(i); }
  }));
  return { getValue: value };
}
