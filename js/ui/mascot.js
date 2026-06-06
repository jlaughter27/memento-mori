// ui/mascot.js — "Foxy", a friendly SVG fox guide with moods + speech bubble.
import { S } from '../state.js';
import { speak } from './sound.js';

// mood ∈ idle | happy | think | celebrate | encourage | wave | proud | surprised
export function foxSVG(mood = 'idle') {
  const eyeCurveUp = '<path d="M73 92 q7 -9 14 0" fill="none" stroke="#2d2233" stroke-width="5" stroke-linecap="round"/><path d="M113 92 q7 -9 14 0" fill="none" stroke="#2d2233" stroke-width="5" stroke-linecap="round"/>';
  const eyes = {
    idle: '<circle cx="80" cy="92" r="7"/><circle cx="120" cy="92" r="7"/>',
    happy: eyeCurveUp,
    celebrate: '<path d="M73 90 q7 -10 14 0" fill="none" stroke="#2d2233" stroke-width="5" stroke-linecap="round"/><path d="M113 90 q7 -10 14 0" fill="none" stroke="#2d2233" stroke-width="5" stroke-linecap="round"/>',
    think: '<circle cx="80" cy="92" r="7"/><circle cx="122" cy="90" r="7"/>',
    encourage: '<circle cx="80" cy="92" r="7.5"/><circle cx="120" cy="92" r="7.5"/>',
    wave: '<circle cx="80" cy="92" r="7"/><circle cx="120" cy="92" r="7"/>',
    proud: '<path d="M72 94 q8 -8 16 0" fill="none" stroke="#2d2233" stroke-width="5" stroke-linecap="round"/><path d="M112 94 q8 -8 16 0" fill="none" stroke="#2d2233" stroke-width="5" stroke-linecap="round"/>',
    surprised: '<circle cx="80" cy="90" r="10" fill="#fff" stroke="#2d2233" stroke-width="3"/><circle cx="80" cy="91" r="5"/><circle cx="120" cy="90" r="10" fill="#fff" stroke="#2d2233" stroke-width="3"/><circle cx="120" cy="91" r="5"/>',
  }[mood] || '<circle cx="80" cy="92" r="7"/><circle cx="120" cy="92" r="7"/>';
  const mouth = {
    idle: '<path d="M88 112 q12 10 24 0" fill="none" stroke="#2d2233" stroke-width="4" stroke-linecap="round"/>',
    happy: '<path d="M84 110 q16 18 32 0" fill="none" stroke="#2d2233" stroke-width="4.5" stroke-linecap="round"/>',
    celebrate: '<path d="M84 108 q16 26 32 0 q-16 6 -32 0 Z" fill="#b8336a" stroke="#2d2233" stroke-width="3"/>',
    think: '<path d="M92 116 q10 -4 18 2" fill="none" stroke="#2d2233" stroke-width="4" stroke-linecap="round"/>',
    encourage: '<path d="M86 110 q14 14 28 0" fill="none" stroke="#2d2233" stroke-width="4.5" stroke-linecap="round"/>',
    wave: '<path d="M86 110 q14 14 28 0" fill="none" stroke="#2d2233" stroke-width="4.5" stroke-linecap="round"/>',
    proud: '<path d="M86 110 q14 16 28 0" fill="none" stroke="#2d2233" stroke-width="4.5" stroke-linecap="round"/>',
    surprised: '<ellipse cx="100" cy="116" rx="9" ry="12" fill="#b8336a" stroke="#2d2233" stroke-width="3"/>',
  }[mood] || '';
  const arm = (mood === 'wave' || mood === 'celebrate' || mood === 'proud')
    ? '<g class="fox-arm"><ellipse cx="150" cy="120" rx="11" ry="20" fill="#f0833a" transform="rotate(28 150 120)"/></g>'
    : '';
  const props = mood === 'think'
    ? '<text x="138" y="60" font-size="26">💭</text>'
    : mood === 'celebrate' ? '<text x="22" y="52" font-size="24">🎉</text><text x="150" y="52" font-size="24">⭐</text>'
    : mood === 'proud' ? '<text x="150" y="50" font-size="26">🏆</text>'
    : mood === 'surprised' ? '<text x="148" y="54" font-size="24">❗</text>' : '';
  return `
  <svg class="fox" viewBox="0 0 200 200" aria-hidden="true">
    <!-- ears -->
    <path d="M55 70 L40 22 L82 56 Z" fill="#f0833a" stroke="#d96b22" stroke-width="3"/>
    <path d="M145 70 L160 22 L118 56 Z" fill="#f0833a" stroke="#d96b22" stroke-width="3"/>
    <path d="M55 64 L48 36 L72 56 Z" fill="#ffd2a8"/>
    <path d="M145 64 L152 36 L128 56 Z" fill="#ffd2a8"/>
    <!-- head -->
    <ellipse cx="100" cy="100" rx="56" ry="52" fill="#f7943e" stroke="#d96b22" stroke-width="3"/>
    <!-- cheeks/snout -->
    <path d="M100 70 q-40 6 -36 44 q18 22 36 22 q18 0 36 -22 q4 -38 -36 -44 Z" fill="#fff3e6"/>
    <circle cx="100" cy="118" r="8" fill="#3a2a33"/>
    <circle cx="78" cy="106" r="6" fill="#ffb6c1" opacity="0.6"/>
    <circle cx="122" cy="106" r="6" fill="#ffb6c1" opacity="0.6"/>
    <g fill="#2d2233">${eyes}</g>
    ${mouth}
    ${arm}
    ${props}
  </svg>`;
}

const LINES = {
  greet: ['Hi friend! Ready for some math fun? 🦊', 'Yay, you\'re here! Let\'s learn together!', 'I missed you! Let\'s do math! ✨'],
  start: ['Let\'s do this together — I\'ll help you! 🦊', 'I\'ll explain every step. You\'ve got this!'],
  correct: ['Woohoo! 🎉', 'You\'re on fire! 🔥', 'High five! ✋', 'You worked that out! 🌟', 'Your brain is growing! 🌱'],
  encourage: ['It\'s okay — mistakes help our brain grow! 🌱', 'Let\'s try a different way together.', 'Almost! Take a breath and try again. 💛'],
  think: ['Hmm, let me show you a trick... 🤔', 'Watch this — it\'s easier than it looks!'],
};
export const foxLine = (k) => { const a = LINES[k] || LINES.start; return a[Math.floor(Math.random() * a.length)]; };

// mount a mascot with a speech bubble into a container element
export function mountMascot(container, { mood = 'idle', say = '', size = 120 } = {}) {
  container.innerHTML = `
    <div class="mascot" style="--mascot-size:${size}px">
      <div class="mascot-fox mood-${mood}">${foxSVG(mood)}</div>
      ${say ? `<div class="mascot-bubble" aria-live="polite" aria-atomic="true">${say}</div>` : ''}
    </div>`;
  if (say) speak(say);
  return {
    setMood(m) {
      const f = container.querySelector('.mascot-fox');
      if (f) { f.className = `mascot-fox mood-${m}`; f.innerHTML = foxSVG(m); }
    },
    setSay(text, m) {
      let b = container.querySelector('.mascot-bubble');
      if (!b) { b = document.createElement('div'); b.className = 'mascot-bubble'; b.setAttribute('aria-live', 'polite'); b.setAttribute('aria-atomic', 'true'); container.querySelector('.mascot').appendChild(b); }
      b.textContent = text;
      b.classList.remove('bubble-pop'); void b.offsetWidth; b.classList.add('bubble-pop');
      if (m) this.setMood(m);
      speak(text);
    },
  };
}
