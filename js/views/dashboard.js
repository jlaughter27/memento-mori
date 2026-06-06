// views/dashboard.js — parent/grown-up dashboard: progress + settings.
import { S, persist, setSetting, resetAll, applyBodyClasses } from '../state.js';
import { STRANDS, STRAND_META, skillsForGrade, ALL_SKILLS } from '../curriculum/index.js';
import { levelProgress, allBadges } from '../gamification.js';
import { navigate, refreshChrome } from '../ui/shell.js';
import { sfx } from '../ui/sound.js';
import { escapeHtml } from '../ui/dom.js';

export function renderDashboard(root) {
  const st = S.progress.stats;
  const lp = levelProgress();
  const acc = st.problemsAttempted ? Math.round((st.problemsCorrect / st.problemsAttempted) * 100) : 0;
  const badges = allBadges().filter((b) => b.earned).length;

  root.innerHTML = `
    <div class="dash-wrap">
      <h1 class="dash-title">👨‍👩‍👧 Grown-ups Corner</h1>
      <p class="muted">A peek at ${escapeHtml(S.profile.name || 'your learner')}'s progress.</p>

      <div class="stat-grid">
        ${stat('Level', lp.level, '⬆️')}
        ${stat('Day streak', S.progress.streak.count, '🔥')}
        ${stat('Coins', S.progress.coins, '🪙')}
        ${stat('Badges', badges, '🏅')}
        ${stat('Problems solved', st.problemsCorrect, '✅')}
        ${stat('Accuracy', acc + '%', '🎯')}
        ${stat('Lessons done', st.lessonsCompleted, '📘')}
        ${stat('Skills mastered', st.skillsMastered, '🌟')}
      </div>

      <h2 class="section-h">Mastery by topic — Grade ${S.profile.grade}</h2>
      <div id="mastery"></div>

      <h2 class="section-h">Settings</h2>
      <div class="settings card-soft" id="settings"></div>

      <h2 class="section-h">Learner</h2>
      <div class="settings card-soft">
        <label class="set-row">Name
          <input type="text" id="set-name" maxlength="20" value="${escapeHtml(S.profile.name)}">
        </label>
        <label class="set-row">Starting grade
          <select id="set-grade">${[3,4,5,6].map((g)=>`<option value="${g}" ${g===S.profile.grade?'selected':''}>Grade ${g}</option>`).join('')}</select>
        </label>
        <button class="btn btn-danger" id="reset-btn">Reset all progress</button>
      </div>
      <div class="dash-foot muted">MathQuest • all progress is saved on this device only.</div>
    </div>`;

  // mastery bars
  const mh = root.querySelector('#mastery');
  const grade = S.profile.grade;
  mh.innerHTML = STRANDS.map((strand) => {
    const sk = skillsForGrade(grade).filter((s) => s.strand === strand);
    if (!sk.length) return '';
    const done = sk.filter((s) => S.progress.skills[s.id] && S.progress.skills[s.id].mastered).length;
    const pct = Math.round((done / sk.length) * 100);
    const meta = STRAND_META[strand] || { emoji: '⭐', color: '#888' };
    return `<div class="mastery-row">
      <span class="mr-emoji">${meta.emoji}</span>
      <span class="mr-name">${escapeHtml(strand)}</span>
      <div class="progress-track sm"><div class="progress-fill" style="width:${pct}%;background:${meta.color}"></div></div>
      <span class="mr-num">${done}/${sk.length}</span>
    </div>`;
  }).join('');

  // settings toggles
  const sh = root.querySelector('#settings');
  const toggles = [
    ['sound', '🔊 Sound effects'],
    ['tts', '🗣️ Read aloud (text-to-speech)'],
    ['reducedMotion', '🌿 Calm mode (less animation)'],
    ['dyslexicFont', '🔤 Easy-reading font'],
  ];
  sh.innerHTML = toggles.map(([k, label]) =>
    `<label class="set-row toggle"><span>${label}</span>
      <input type="checkbox" data-set="${k}" ${S.progress.settings[k] ? 'checked' : ''}></label>`).join('');
  sh.querySelectorAll('[data-set]').forEach((cb) =>
    cb.addEventListener('change', () => { sfx.tap(); setSetting(cb.dataset.set, cb.checked); }));

  root.querySelector('#set-name').addEventListener('input', (e) => { S.profile.name = e.target.value; persist(); });
  root.querySelector('#set-grade').addEventListener('change', (e) => { S.profile.grade = +e.target.value; persist(); refreshChrome(); });
  const resetBtn = root.querySelector('#reset-btn');
  let armed = false, armTimer = null;
  resetBtn.addEventListener('click', () => {
    if (!armed) {
      armed = true;
      resetBtn.textContent = '⚠️ Tap again to erase everything';
      resetBtn.classList.add('armed');
      clearTimeout(armTimer);
      armTimer = setTimeout(() => { armed = false; resetBtn.textContent = 'Reset all progress'; resetBtn.classList.remove('armed'); }, 5000);
      return;
    }
    clearTimeout(armTimer);
    resetAll(); applyBodyClasses(); refreshChrome(); navigate('#/onboard');
  });
}

const stat = (label, val, emoji) =>
  `<div class="stat card-soft"><div class="stat-emoji">${emoji}</div><div class="stat-val">${val}</div><div class="stat-label">${label}</div></div>`;
