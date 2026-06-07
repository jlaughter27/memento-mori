// ui/interactive.js — hands-on (tappable) manipulatives used as a problem INPUT,
// so a child builds a fraction by shading parts instead of only typing a number.
// Every part is a real <button> (keyboard + screen-reader friendly): Tab to a part,
// Enter/Space to shade, and a live region announces the running count.

export function mountFractionTap(host, { den = 4 } = {}) {
  den = Math.max(2, Math.min(12, den | 0));
  const states = new Array(den).fill(false);
  host.innerHTML = `
    <div class="ftap" role="group" aria-label="Shade the bar by tapping parts">
      ${Array.from({ length: den }, (_, i) =>
        `<button type="button" class="ftap-cell" data-i="${i}" aria-pressed="false" aria-label="Part ${i + 1} of ${den}, empty"></button>`).join('')}
    </div>
    <p class="ftap-read" aria-live="polite" aria-atomic="true">0 of ${den} shaded</p>`;
  const read = host.querySelector('.ftap-read');
  const cells = [...host.querySelectorAll('.ftap-cell')];
  const count = () => states.filter(Boolean).length;
  const toggle = (i) => {
    states[i] = !states[i];
    const btn = cells[i];
    btn.classList.toggle('on', states[i]);
    btn.setAttribute('aria-pressed', states[i] ? 'true' : 'false');
    btn.setAttribute('aria-label', `Part ${i + 1} of ${den}, ${states[i] ? 'shaded' : 'empty'}`);
    read.textContent = `${count()} of ${den} shaded`;
  };
  cells.forEach((btn) => btn.addEventListener('click', () => toggle(+btn.dataset.i)));
  return { getCount: count };
}
