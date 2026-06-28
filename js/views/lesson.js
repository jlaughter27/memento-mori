// views/lesson.js — teach a skill with a guided lesson that walks
// Concrete → Pictorial → Abstract, then a low-stakes interactive "Now you try!".
import { getSkill, getStandard } from '../curriculum/index.js';
import { completeLesson, checkNewBadges } from '../gamification.js';
import { nextProblem } from '../engine/index.js';
import { mountMascot } from '../ui/mascot.js';
import { renderVisual } from '../ui/manipulatives.js';
import { navigate, refreshChrome } from '../ui/shell.js';
import { sfx } from '../ui/sound.js';
import { showBadges } from './rewards.js';
import { escapeHtml } from '../ui/dom.js';

export function renderLesson(root, id) {
  const skill = getSkill(id);
  if (!skill) { navigate('#/'); return; }
  const L = skill.lesson || {};
  // a demo problem powers the Concrete picture + the Abstract equation when the
  // hand-authored lesson doesn't supply them; a fresh one is the "you try".
  let demo = null, tryProblem = null;
  try { demo = nextProblem(skill, -1); } catch (e) {}
  try { tryProblem = nextProblem(skill, -1); } catch (e) {}

  // build the lesson as a list of cards, walking C → P → A → try
  const cards = [];
  if (L.hook) cards.push({ mood: 'happy', html: `<p class="lesson-hook">${escapeHtml(L.hook)}</p>` });
  if (L.bigIdea) cards.push({ mood: 'idle', html: `<div class="big-idea"><span class="bi-label">💡 Big Idea</span><p>${escapeHtml(L.bigIdea)}</p></div>` });

  // CONCRETE — see it as objects/blocks (the manipulative)
  const concreteVisual = L.visual || (demo && demo.visual);
  if (concreteVisual) cards.push({ mood: 'happy', html:
    `<div class="lesson-stage-block cpa-concrete"><span class="cpa-tag">🧱 See it</span>
      <p class="muted">Math you can picture — count and move the pieces.</p>${renderVisual(concreteVisual)}</div>` });

  // PICTORIAL / steps — work it, step by step
  (L.steps || []).forEach((st, i) => {
    cards.push({ mood: 'think', html:
      `<div class="lesson-step cpa-pictorial"><span class="cpa-tag">✏️ Work it</span>
        <div class="ls-num">Step ${i + 1}</div>
        <h3>${escapeHtml(st.title || '')}</h3>
        <p>${escapeHtml(st.text || '')}</p>
        ${st.example ? `<div class="ls-example"><span class="ex-prob">${escapeHtml(st.example.problem || '')}</span>${st.example.show ? `<span class="ex-show">${escapeHtml(st.example.show)}</span>` : ''}</div>` : ''}
      </div>` });
  });

  // ABSTRACT — the equation/answer in symbols
  if (demo && demo.prompt) cards.push({ mood: 'idle', html:
    `<div class="lesson-stage-block cpa-abstract"><span class="cpa-tag">🔢 Write it</span>
      <p class="muted">Now in numbers and symbols:</p>
      <div class="cpa-equation">${escapeHtml(demo.prompt.replace(/\?\s*$/, ''))} <b>${escapeHtml(demo.answer)}</b></div></div>` });

  if (!cards.length) cards.push({ mood: 'happy', html: `<p>Let's jump right into practice!</p>` });

  // TRY IT — a low-stakes interactive check (no penalty)
  if (tryProblem) {
    cards.push({ mood: 'think', stage: 'try', html:
      `<div class="lesson-try"><span class="cpa-tag">🎯 Now you try!</span>
        <div class="lt-prompt">${escapeHtml(tryProblem.prompt)}</div>
        ${tryProblem.visual ? `<div class="lt-visual">${renderVisual(tryProblem.visual)}</div>` : ''}
        <div class="lt-input"><input id="lt-ans" class="lt-field" type="text" inputmode="numeric" aria-label="Your answer" autocomplete="off">
          <button class="btn" id="lt-check" type="button">Check ✓</button></div>
        <div class="lt-fb" id="lt-fb" aria-live="polite"></div></div>`,
      onDraw() {
        const fb = root.querySelector('#lt-fb'); const inp = root.querySelector('#lt-ans');
        const submit = () => {
          if (!inp.value.trim()) { fb.textContent = 'Type your answer, then tap Check! 😊'; return; }
          if (tryProblem.check(inp.value)) {
            sfx.correct(); fb.innerHTML = `<span class="lt-good">✅ Yes! You've got it — let's practice for real! 🎉</span>`;
          } else {
            sfx.tap(); fb.innerHTML = `<span class="lt-soft">Not yet — the answer is <b>${escapeHtml(tryProblem.answer)}</b>. No worries, you'll nail it in practice! 🌱</span>`;
          }
        };
        root.querySelector('#lt-check').addEventListener('click', submit);
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
      } });
  }

  let idx = 0;
  root.innerHTML = `
    <div class="lesson-wrap">
      <header class="lesson-top">
        <span class="lesson-title">${skill.emoji || ''} ${escapeHtml(skill.title)}</span>
      </header>
      ${(() => { const st = getStandard(skill.id); return st ? `<div class="lesson-standard"><span class="std-tag" title="${escapeHtml(st.domain)}"><span class="std-code">${escapeHtml(st.code)}</span><span class="std-text">${escapeHtml(st.text)}</span></span></div>` : ''; })()}
      <div class="lesson-mascot" id="lesson-mascot"></div>
      <div class="lesson-stage card-soft" id="lesson-stage"></div>
      <div class="lesson-dots" id="lesson-dots"></div>
      <div class="lesson-controls">
        <button class="btn btn-ghost" id="lesson-prev" disabled>Back</button>
        <button class="btn btn-big" id="lesson-next">Next →</button>
      </div>
    </div>`;

  const m = mountMascot(root.querySelector('#lesson-mascot'), { mood: 'happy', size: 92 });
  const stage = root.querySelector('#lesson-stage');
  const dots = root.querySelector('#lesson-dots');
  const prevBtn = root.querySelector('#lesson-prev');
  const nextBtn = root.querySelector('#lesson-next');

  function draw() {
    const c = cards[idx];
    stage.innerHTML = c.html;
    stage.classList.remove('slide-in'); void stage.offsetWidth; stage.classList.add('slide-in');
    m.setMood(c.mood);
    if (typeof c.onDraw === 'function') c.onDraw();
    dots.innerHTML = cards.map((_, i) => `<span class="dot ${i === idx ? 'on' : ''}"></span>`).join('');
    prevBtn.disabled = idx === 0;
    nextBtn.textContent = idx === cards.length - 1 ? "Let's Practice! 🚀" : 'Next →';
  }
  draw();

  nextBtn.addEventListener('click', () => {
    sfx.tap();
    if (idx < cards.length - 1) { idx++; draw(); }
    else {
      completeLesson(skill.id);
      const fresh = checkNewBadges();
      refreshChrome();
      if (fresh.length) showBadges(fresh, () => navigate(`#/tutor/${skill.id}`));
      else navigate(`#/tutor/${skill.id}`);
    }
  });
  prevBtn.addEventListener('click', () => { if (idx > 0) { sfx.tap(); idx--; draw(); } });
}
