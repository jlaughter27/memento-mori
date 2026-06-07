// storage.js — safe localStorage wrapper with one namespaced key.
const KEY = 'mathquest.v1';

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('load failed', e);
    return null;
  }
}

let saveTimer = null;
let warnedSaveFail = false;
export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('save failed', e);
    // quota exceeded or private-mode block: tell the grown-up once, gently,
    // so lost progress isn't a silent surprise.
    if (!warnedSaveFail) {
      warnedSaveFail = true;
      try { window.dispatchEvent(new CustomEvent('mathquest:save-error')); } catch (_) {}
    }
  }
}
// debounced save for hot paths
export function saveSoon(state) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => save(state), 250);
}

export function wipe() {
  try { localStorage.removeItem(KEY); } catch (e) {}
}
