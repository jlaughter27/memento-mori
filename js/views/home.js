// views/home.js — the learning map: continue card, daily goal, grade tabs, strands.
import { S, persist, isUnlocked, isMastered, skillRec } from '../state.js';
import { groupedByStrand, getSkill } from '../curriculum/index.js';
import { gradeCompletion, recommendedSkill, dailyStatus } from '../gamification.js';
import { mountMascot, foxLine } from '../ui/mascot.js';
import { navigate } from '../ui/shell.js';
import { sfx } from '../ui/sound.js';
import { escapeHtml } from '../ui/dom.js';

const stars = (n) => `<span class="stars" aria-label="${n} of 3 stars">${[0, 1, 2].map((i) => `<span class="${i < n ? 'on' : ''}">★</span>`).join('')}</span>`;

export function renderHome(root) {
  const grade = S.profile.grade;
  const comp = gradeCompletion(grade);
  const streak = S.progress.streak.count || 0;
  const daily = dailyStatus();
  const cont = recommendedSkill(isUnlocked);
  const greeting = streak > 1
    ? `You've practiced ${streak} days in a row — keep it up! 🔥`
    : "Let's learn something awesome today.";

  root.innerHTML = `
    <section class="home-hero card-soft">
      <div class="home-mascot" id="home-mascot"></div>
      <div class="home-hello">
        <h1>Hi ${escapeHtml(S.profile.name || 'friend')}! 👋</h1>
        <p class="muted">${greeting}</p>
        <button class="btn btn-big btn-play" id="daily-btn">⚡ Daily Challenge</button>
      </div>
    </section>

    ${cont ? `
    <button class="continue-card" id="continue-btn" data-id="${cont.id}">
      <span class="cont-emoji">${cont.emoji || '✏️'}</span>
      <span class="cont-text"><b>Keep going</b><span>${escapeHtml(cont.title)}</span></span>
      <span class="cont-go">▶</span>
    </button>` : ''}

    <div class="daily-goal card-soft">
      <div class="gp-row"><span>🎯 Today's goal</span><span><b>${Math.min(daily.count, daily.goal)}</b> / ${daily.goal} problems</span></div>
      <div class="goal-pips">${Array.from({ length: daily.goal }, (_, i) => `<span class="goal-pip ${i < daily.count ? 'on' : ''}"></span>`).join('')}</div>
      ${daily.reached ? '<p class="goal-done">Goal complete — you\'re a star today! 🌟</p>' : ''}
    </div>

    <div class="grade-tabs" role="tablist" aria-label="Choose grade">
      ${[3, 4, 5, 6].map((g) => `<button class="grade-tab ${g === grade ? 'active' : ''}" role="tab" aria-selected="${g === grade}" data-grade="${g}">Grade ${g}</button>`).join('')}
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
  const contBtn = root.querySelector('#continue-btn');
  if (contBtn) contBtn.addEventListener('click', () => {
    sfx.tap();
    const rec = skillRec(cont.id);
    navigate(rec.lessonDone ? `#/practice/${cont.id}` : `#/learn/${cont.id}`);
  });

  const tabs = [...root.querySelectorAll('.grade-tab')];
  tabs.forEach((t) => {
    t.addEventListener('click', () => { sfx.tap(); S.profile.grade = +t.dataset.grade; persist(); renderHome(root); });
    t.addEventListener('keydown', (e) => {
      let i = tabs.indexOf(t);
      if (e.key === 'ArrowRight') i = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') i = (i - 1 + tabs.length) % tabs.length;
      else return;
      e.preventDefault();
      sfx.tap(); S.profile.grade = +tabs[i].dataset.grade; persist(); renderHome(root);
      const nt = root.querySelector('.grade-tab.active'); if (nt) nt.focus();
    });
  });

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
        // explain WHY it's locked, kindly
        const sk = getSkill(id);
        const pr = (sk.prereq || []).map((p) => getSkill(p)).find((x) => x && !isMastered(x.id));
        m.setSay(pr ? `Master "${pr.title}" first to unlock this one! 🔒` : 'Finish the earlier skills to unlock this! 🔒', 'idle');
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
    <button class="skill-card ${unlocked ? '' : 'locked'} ${rec.mastered ? 'mastered' : ''}" data-id="${s.id}"
      aria-label="${escapeHtml(s.title)}${unlocked ? '' : ' (locked)'}${rec.mastered ? ' (mastered)' : ''}">
      <span class="skill-emoji">${s.emoji || '✏️'}</span>
      <span class="skill-title">${escapeHtml(s.title)}</span>
      ${unlocked ? stars(rec.stars || 0) : '<span class="lock">🔒</span>'}
      ${rec.mastered ? '<span class="skill-check">✓</span>' : ''}
    </button>`;
}
