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
export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('save failed', e);
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
