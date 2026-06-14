// ui/dom.js — minimal DOM helpers (no framework).
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// preserve line breaks from worked-solution text
export function nl2br(s) { return escapeHtml(s).replace(/\n/g, '<br>'); }

// escape, then render **bold** and line breaks (safe lightweight markdown)
export function mdInline(s) {
  return escapeHtml(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

// ---- text-fitting helpers (keep long content inside fixed boxes) ----

// Shrink an element's font-size (to a floor) so its content never overflows
// its box — e.g. an answer display as the child types more characters.
// Re-runnable: it remembers the element's natural size and re-fits from there.
// Safe no-op where layout can't be measured (jsdom tests), so callers don't
// need to guard. Pass `max` to pin the base size explicitly.
export function fitText(el, { min = 16, max } = {}) {
  if (!el) return;
  const base = max
    || el._fitBase
    || (typeof getComputedStyle === 'function' ? parseFloat(getComputedStyle(el).fontSize) : 0);
  if (!base) return;
  el._fitBase = base;                 // natural size, so repeat fits start fresh
  el.style.fontSize = base + 'px';
  if (!el.clientWidth) return;        // not laid out (or jsdom) → keep base size
  let size = base, guard = 0;
  while (size > min && el.scrollWidth > el.clientWidth && guard++ < 40) {
    size = Math.max(min, size - Math.max(1, size * 0.08));
    el.style.fontSize = (Math.round(size * 2) / 2) + 'px'; // tidy half-pixel steps
  }
}

// Bucket a prompt by length so CSS can size/wrap long word problems gracefully.
// Returns '' | 'med' | 'long' | 'xlong' (used as a [data-len] attribute).
export function promptLen(s) {
  const n = String(s == null ? '' : s).length;
  return n > 80 ? 'xlong' : n > 44 ? 'long' : n > 26 ? 'med' : '';
}
