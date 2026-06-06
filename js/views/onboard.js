// views/onboard.js — friendly first-run setup.
import { S, persist, applyBodyClasses } from '../state.js';
import { mountMascot } from '../ui/mascot.js';
import { navigate } from '../ui/shell.js';
import { sfx } from '../ui/sound.js';
import { confetti } from '../ui/celebrations.js';
import { escapeHtml } from '../ui/dom.js';

export function renderOnboard(root) {
  let step = 0;
  let name = S.profile.name || '';
  let grade = S.profile.grade || 3;

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
        <div class="grade-pick">
          ${[3, 4, 5, 6].map((g) => `<button class="grade-choice ${g === grade ? 'sel' : ''}" data-g="${g}">
            <span class="gc-num">${g}</span><span class="gc-label">Grade</span></button>`).join('')}
        </div>
        <button class="btn btn-big" id="ob-start">Start my adventure! 🚀</button>`;
      c.querySelectorAll('.grade-choice').forEach((b) =>
        b.addEventListener('click', () => { sfx.tap(); grade = +b.dataset.g; draw(); }));
      c.querySelector('#ob-start').addEventListener('click', () => {
        sfx.level(); confetti(120);
        S.profile.grade = grade; S.onboarded = true; persist(); applyBodyClasses();
        setTimeout(() => navigate('#/'), 600);
      });
    }
  }
  draw();
}
