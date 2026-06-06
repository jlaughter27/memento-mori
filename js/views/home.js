// views/home.js — the learning map: grade tabs + strands + skill cards.
import { S, persist, isUnlocked, isMastered, skillRec } from '../state.js';
import { groupedByStrand } from '../curriculum/index.js';
import { gradeCompletion } from '../gamification.js';
import { mountMascot, foxLine } from '../ui/mascot.js';
import { navigate } from '../ui/shell.js';
import { sfx } from '../ui/sound.js';
import { escapeHtml } from '../ui/dom.js';

const stars = (n) => `<span class="stars">${[0, 1, 2].map((i) => `<span class="${i < n ? 'on' : ''}">★</span>`).join('')}</span>`;

export function renderHome(root) {
  const grade = S.profile.grade;
  const comp = gradeCompletion(grade);
  root.innerHTML = `
    <section class="home-hero card-soft">
      <div class="home-mascot" id="home-mascot"></div>
      <div class="home-hello">
        <h1>Hi ${escapeHtml(S.profile.name || 'friend')}! 👋</h1>
        <p class="muted">Let's learn something awesome today.</p>
        <button class="btn btn-big btn-play" id="daily-btn">⚡ Daily Challenge</button>
      </div>
    </section>

    <div class="grade-tabs" role="tablist">
      ${[3, 4, 5, 6].map((g) => `<button class="grade-tab ${g === grade ? 'active' : ''}" data-grade="${g}">Grade ${g}</button>`).join('')}
    </div>

    <div class="grade-progress card-soft">
      <div class="gp-row">
        <span>Grade ${grade} journey</span>
        <span><b>${comp.done}</b> / ${comp.total} skills mastered</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${(comp.pct * 100).toFixed(0)}%"></div></div>
    </div>

    <div id="strands"></div>
  `;

  const m = mountMascot(root.querySelector('#home-mascot'), { mood: 'wave', say: foxLine('greet'), size: 110 });
  setTimeout(() => m.setMood('idle'), 1600);

  root.querySelector('#daily-btn').addEventListener('click', () => { sfx.tap(); navigate('#/play'); });
  root.querySelectorAll('.grade-tab').forEach((t) =>
    t.addEventListener('click', () => {
      sfx.tap();
      S.profile.grade = +t.dataset.grade; persist();
      renderHome(root);
    }));

  const strandsHost = root.querySelector('#strands');
  const groups = groupedByStrand(grade);
  strandsHost.innerHTML = groups.map((g) => {
    const mastered = g.skills.filter((s) => isMastered(s.id)).length;
    return `
    <section class="strand" style="--strand:${g.color}">
      <header class="strand-head">
        <span class="strand-emoji">${g.emoji}</span>
        <span class="strand-name">${escapeHtml(g.strand)}</span>
        <span class="strand-count">${mastered}/${g.skills.length}</span>
      </header>
      <div class="skill-row">
        ${g.skills.map((s) => skillCard(s)).join('')}
      </div>
    </section>`;
  }).join('');

  strandsHost.querySelectorAll('.skill-card').forEach((c) =>
    c.addEventListener('click', () => {
      const id = c.dataset.id;
      if (c.classList.contains('locked')) {
        sfx.wrong();
        c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake');
        return;
      }
      sfx.tap();
      const rec = skillRec(id);
      navigate(rec.lessonDone ? `#/practice/${id}` : `#/learn/${id}`);
    }));
}

function skillCard(s) {
  const unlocked = isUnlocked(s);
  const rec = S.progress.skills[s.id] || { stars: 0, mastered: false };
  return `
    <button class="skill-card ${unlocked ? '' : 'locked'} ${rec.mastered ? 'mastered' : ''}" data-id="${s.id}">
      <span class="skill-emoji">${s.emoji || '✏️'}</span>
      <span class="skill-title">${escapeHtml(s.title)}</span>
      ${unlocked ? stars(rec.stars || 0) : '<span class="lock">🔒</span>'}
      ${rec.mastered ? '<span class="skill-check">✓</span>' : ''}
    </button>`;
}
