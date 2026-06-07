// views/lesson.js — teach a skill with a guided, progressive lesson.
import { getSkill, getStandard } from '../curriculum/index.js';
import { completeLesson, checkNewBadges } from '../gamification.js';
import { mountMascot } from '../ui/mascot.js';
import { renderVisual } from '../ui/manipulatives.js';
import { navigate, refreshChrome } from '../ui/shell.js';
import { sfx } from '../ui/sound.js';
import { showBadges } from './rewards.js';
import { escapeHtml, nl2br } from '../ui/dom.js';

export function renderLesson(root, id) {
  const skill = getSkill(id);
  if (!skill) { navigate('#/'); return; }
  const L = skill.lesson || {};

  // build the lesson as a list of cards
  const cards = [];
  if (L.hook) cards.push({ mood: 'happy', html: `<p class="lesson-hook">${escapeHtml(L.hook)}</p>` });
  if (L.bigIdea) cards.push({ mood: 'idle', html: `<div class="big-idea"><span class="bi-label">💡 Big Idea</span><p>${escapeHtml(L.bigIdea)}</p></div>` });
  (L.steps || []).forEach((st, i) => {
    cards.push({
      mood: 'think',
      html: `<div class="lesson-step">
        <div class="ls-num">Step ${i + 1}</div>
        <h3>${escapeHtml(st.title || '')}</h3>
        <p>${escapeHtml(st.text || '')}</p>
        ${st.example ? `<div class="ls-example"><span class="ex-prob">${escapeHtml(st.example.problem || '')}</span>${st.example.show ? `<span class="ex-show">${escapeHtml(st.example.show)}</span>` : ''}</div>` : ''}
      </div>` });
  });
  if (L.visual) cards.push({ mood: 'happy', html: `<div class="lesson-visual"><p class="muted">Here's a picture to help! 🎨</p>${renderVisual(L.visual)}</div>` });
  if (!cards.length) cards.push({ mood: 'happy', html: `<p>Let's jump right into practice!</p>` });

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
    dots.innerHTML = cards.map((_, i) => `<span class="dot ${i === idx ? 'on' : ''}"></span>`).join('');
    prevBtn.disabled = idx === 0;
    nextBtn.textContent = idx === cards.length - 1 ? "Let's Practice! 🚀" : 'Next →';
  }
  draw();

  nextBtn.addEventListener('click', () => {
    sfx.tap();
    if (idx < cards.length - 1) { idx++; draw(); }
    else {
      // finished lesson -> reward + go practice
      completeLesson(skill.id);
      const fresh = checkNewBadges();
      refreshChrome();
      if (fresh.length) showBadges(fresh, () => navigate(`#/tutor/${skill.id}`));
      else navigate(`#/tutor/${skill.id}`);
    }
  });
  prevBtn.addEventListener('click', () => { if (idx > 0) { sfx.tap(); idx--; draw(); } });
}
