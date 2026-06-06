// views/onboard.js — friendly first-run setup with an optional placement check.
import { S, persist, applyBodyClasses } from '../state.js';
import { mountMascot } from '../ui/mascot.js';
import { navigate } from '../ui/shell.js';
import { sfx } from '../ui/sound.js';
import { confetti } from '../ui/celebrations.js';
import { escapeHtml } from '../ui/dom.js';
import { APP_VERSION } from '../version.js';
import { generateProblem } from '../engine/problemTypes.js';
import { makeRng, shuffle } from '../engine/rng.js';
import { GRADES } from '../curriculum/index.js';

// placement ladder: easy (g3) → hard (g6). Numeric answers only.
const LADDER = [
  { type: 'add', params: { digits: 2, regroup: true } },
  { type: 'mult', params: { aDigits: 2, bDigits: 1 } },
  { type: 'div', params: { dividendDigits: 2, divisor: 6, remainder: false } },
  { type: 'fractionOfNum', params: { maxDenom: 4 } },
  { type: 'percent', params: { kind: 'ofNumber' } },
];
const rng = makeRng(0);

function buildChoices(ans) {
  const set = new Set([ans]);
  const deltas = [1, 2, -1, -2, 10, -10, 5];
  let i = 0;
  while (set.size < 4 && i < deltas.length) {
    const d = ans + deltas[i++];
    if (d >= 0 && d !== ans) set.add(d);
  }
  while (set.size < 4) set.add(ans + set.size + 2);
  return shuffle(rng, [...set]);
}

export function renderOnboard(root) {
  let step = 0;
  let name = S.profile.name || '';
  let grade = S.profile.grade || 3;

  const finish = (g) => {
    sfx.level(); confetti(120);
    S.profile.grade = g; S.onboarded = true; S.lastVersion = APP_VERSION; persist(); applyBodyClasses();
    setTimeout(() => navigate('#/'), 600);
  };

  function draw() {
    root.innerHTML = `
      <div class="onboard">
        <div class="onboard-mascot" id="ob-mascot"></div>
        <div class="onboard-card card-soft" id="ob-card"></div>
      </div>`;
    const m = mountMascot(root.querySelector('#ob-mascot'), { mood: 'wave', size: 130 });
    const c = root.querySelector('#ob-card');

    if (step === 0) {
      m.setSay("Hi! I'm Foxy. What's your name? 🦊", 'happy');
      c.innerHTML = `
        <h1>Welcome to MathQuest! ✨</h1>
        <p>Let's get to know each other.</p>
        <input type="text" id="ob-name" class="ob-input" placeholder="Type your name" maxlength="20" value="${escapeHtml(name)}">
        <button class="btn btn-big" id="ob-next">Next →</button>`;
      const input = c.querySelector('#ob-name');
      input.focus();
      const go = () => { name = input.value.trim() || 'Explorer'; S.profile.name = name; persist(); step = 1; draw(); };
      c.querySelector('#ob-next').addEventListener('click', () => { sfx.tap(); go(); });
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });

    } else if (step === 1) {
      m.setSay(`Nice to meet you, ${name}! What grade are you in?`, 'happy');
      c.innerHTML = `
        <h1>Pick your level 🎯</h1>
        <p>Don't worry — you can change this anytime!</p>
        <div class="grade-pick grade-pick-wide">
          ${GRADES.map((g) => `<button class="grade-choice ${g === grade ? 'sel' : ''}" data-g="${g}">
            <span class="gc-num">${g}</span><span class="gc-label">Grade</span></button>`).join('')}
        </div>
        <button class="btn btn-big" id="ob-start">Start my adventure! 🚀</button>
        <button class="btn-link place-skip" id="ob-place">🧭 Or take a quick placement check</button>`;
      c.querySelectorAll('.grade-choice').forEach((b) =>
        b.addEventListener('click', () => { sfx.tap(); grade = +b.dataset.g; draw(); }));
      c.querySelector('#ob-start').addEventListener('click', () => finish(grade));
      c.querySelector('#ob-place').addEventListener('click', () => { sfx.tap(); step = 2; draw(); });

    } else if (step === 2) {
      // placement quiz runner
      let qi = 0, correct = 0;
      const ask = () => {
        const spec = LADDER[qi];
        const p = generateProblem(spec.type, spec.params, rng);
        const ans = Number(String(p.answer).replace(/[^\d-]/g, ''));
        const choices = buildChoices(ans);
        m.setSay(`Question ${qi + 1} of ${LADDER.length} — give it your best try!`, 'think');
        c.innerHTML = `
          <h1>Quick Check 🧭</h1>
          <div class="place-progress">${LADDER.map((_, i) => `<span class="pip ${i < qi ? 'done' : ''}"></span>`).join('')}</div>
          <div class="problem-prompt place-prompt">${escapeHtml(p.prompt)}</div>
          <div class="choices">${choices.map((v) => `<button class="choice-btn place-choice" data-v="${v}">${v}</button>`).join('')}</div>
          <button class="btn-link place-skip" id="ob-place-skip">Skip the check</button>`;
        c.querySelectorAll('.place-choice').forEach((b) =>
          b.addEventListener('click', () => {
            const chosen = Number(b.dataset.v);
            if (chosen === ans) { correct++; sfx.correct(); b.classList.add('correct'); }
            else { sfx.wrong(); b.classList.add('wrong'); }
            c.querySelectorAll('.place-choice').forEach((x) => { x.disabled = true; if (Number(x.dataset.v) === ans) x.classList.add('correct'); });
            qi++;
            setTimeout(() => { qi < LADDER.length ? ask() : showResult(correct); }, 650);
          }));
        c.querySelector('#ob-place-skip').addEventListener('click', () => { sfx.tap(); finish(grade); });
      };
      ask();
    }
  }

  function showResult(correct) {
    const placed = 3 + (correct >= 2 ? 1 : 0) + (correct >= 4 ? 1 : 0) + (correct >= 5 ? 1 : 0);
    grade = placed;
    const c = root.querySelector('#ob-card');
    const m = mountMascot(root.querySelector('#ob-mascot'), { mood: 'proud', size: 130 });
    m.setSay(`Great job! You got ${correct} of ${LADDER.length}.`, 'proud');
    confetti(90);
    c.innerHTML = `
      <h1>You're a Grade ${placed} explorer! 🌟</h1>
      <p class="muted">You answered ${correct} of ${LADDER.length} correctly. We'll start you here — you can change it any time.</p>
      <button class="btn btn-big" id="ob-go">Start my adventure! 🚀</button>`;
    c.querySelector('#ob-go').addEventListener('click', () => finish(placed));
  }

  draw();
}
