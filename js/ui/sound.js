// ui/sound.js — tiny WebAudio sound effects, no audio files needed.
import { S } from '../state.js';

let ctx = null;
function ac() {
  if (!S.progress.settings.sound) return null;
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type = 'sine', vol = 0.18) {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime + start);
  g.gain.setValueAtTime(0, c.currentTime + start);
  g.gain.linearRampToValueAtTime(vol, c.currentTime + start + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  o.connect(g); g.connect(c.destination);
  o.start(c.currentTime + start);
  o.stop(c.currentTime + start + dur + 0.02);
}

export const sfx = {
  correct() { tone(660, 0, 0.12, 'sine'); tone(880, 0.1, 0.18, 'sine'); },
  wrong() { tone(300, 0, 0.16, 'triangle', 0.14); tone(240, 0.12, 0.2, 'triangle', 0.12); },
  tap() { tone(520, 0, 0.05, 'square', 0.08); },
  coin() { tone(988, 0, 0.07, 'square', 0.12); tone(1319, 0.06, 0.12, 'square', 0.12); },
  level() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.1, 0.22, 'sine', 0.16)); },
  badge() { [784, 988, 1319].forEach((f, i) => tone(f, i * 0.12, 0.28, 'triangle', 0.16)); },
  star() { tone(1175, 0, 0.1, 'sine', 0.14); tone(1568, 0.08, 0.16, 'sine', 0.14); },
  whoosh() { tone(400, 0, 0.18, 'sawtooth', 0.05); },
};

// unlock audio on first user gesture (mobile)
export function primeAudio() {
  const h = () => { ac(); window.removeEventListener('pointerdown', h); };
  window.addEventListener('pointerdown', h, { once: true });
}

// optional text-to-speech for read-aloud
export function speak(text) {
  if (!S.progress.settings.tts || !('speechSynthesis' in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(String(text).replace(/[*_#]/g, ''));
    u.rate = 0.95; u.pitch = 1.1;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) {}
}
